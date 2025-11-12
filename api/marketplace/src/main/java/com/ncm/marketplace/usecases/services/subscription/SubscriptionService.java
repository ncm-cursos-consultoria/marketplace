package com.ncm.marketplace.usecases.services.subscription;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.PlansEnum;
import com.ncm.marketplace.domains.enums.SubscriptionStatusEnum;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.gateways.dtos.requests.services.subscription.CreateEnterpriseSubscriptionRequest;
import com.ncm.marketplace.gateways.dtos.responses.services.subscription.SubscriptionResponse;
import com.ncm.marketplace.usecases.impl.enterprises.CrudEnterpriseImpl;
import com.ncm.marketplace.usecases.services.query.user.UserEnterpriseQueryService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.SubscriptionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.ncm.marketplace.domains.enums.SubscriptionStatusEnum.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final CrudEnterpriseImpl crudEnterpriseImpl;
    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    private final UserEnterpriseQueryService userEnterpriseQueryService;
    @Value("${stripe.api.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.price-id}")
    private String stripePriceId;

    @Transactional
    public SubscriptionResponse createEnterpriseSubscription(CreateEnterpriseSubscriptionRequest request) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        UserEnterprise userEnterprise = userEnterpriseQueryService.findByIdOrThrow(request.getId());
        String paymentMethodId = request.getPaymentMethodId();

        if (userEnterprise.getEnterprise() == null) {
            throw new IllegalStateException("Enterprise cannot be null on user enterprise");
        }

        Enterprise enterprise = userEnterprise.getEnterprise();

        CustomerCreateParams customerParams = CustomerCreateParams.builder()
                .setName(enterprise.getLegalName())
                .setEmail(userEnterprise.getEmail())
                .setPaymentMethod(paymentMethodId)
                .setInvoiceSettings(
                        CustomerCreateParams.InvoiceSettings.builder()
                                .setDefaultPaymentMethod(paymentMethodId)
                                .build()
                )
                .build();

        Customer customer = Customer.create(customerParams);

        userEnterprise.setStripeCustomerId(customer.getId());

        // 4. Crie a Assinatura (Subscription)
        SubscriptionCreateParams subParams = SubscriptionCreateParams.builder()
                .setCustomer(customer.getId())
                .addItem(
                        SubscriptionCreateParams.Item.builder()
                                .setPrice(stripePriceId)
                                .build()
                )
                .setPaymentBehavior(SubscriptionCreateParams.PaymentBehavior.ALLOW_INCOMPLETE)
                .setCollectionMethod(SubscriptionCreateParams.CollectionMethod.CHARGE_AUTOMATICALLY)
                .addExpand("latest_invoice.payment_intent")
                .setTrialPeriodDays(30L)
                .build();

        Subscription subscription = Subscription.create(subParams);

        userEnterprise.setStripeSubscriptionId(subscription.getId());

        String stripeStatus = subscription.getStatus();

        if (stripeStatus.equals("active") || stripeStatus.equals("trialing")) {
            userEnterprise.setSubscriptionStatus(ACTIVE);
            crudEnterpriseImpl.updateEnterprisePlan(userEnterprise.getEnterprise().getId(), PlansEnum.STANDARD.getName());
        } else {
            userEnterprise.setSubscriptionStatus(PENDING);
        }

        String clientSecret = null;
        if (subscription.getPendingSetupIntentObject() != null) {
            SetupIntent setupIntent = subscription.getPendingSetupIntentObject();
            clientSecret = setupIntent.getClientSecret();
        } else if (subscription.getLatestInvoiceObject() != null &&
                subscription.getLatestInvoiceObject().getPaymentIntentObject() != null) {
            PaymentIntent paymentIntent = subscription.getLatestInvoiceObject().getPaymentIntentObject();
            clientSecret = paymentIntent.getClientSecret();
        }

        return SubscriptionResponse.builder()
                .subscriptionId(subscription.getId())
                .status(subscription.getStatus())
                .clientSecret(clientSecret)
                .build();
    }

    @Transactional
    public void updateSubscriptionStatus(String stripeCustomerId, SubscriptionStatusEnum newStatus) {
        log.info("Webhook recebido: Atualizando status para {} para o cliente {}", newStatus, stripeCustomerId);

        UserEnterprise userEnterprise = userEnterpriseQueryService.findByStripeCustomerIdOrThrow(stripeCustomerId);
        userEnterprise.setSubscriptionStatus(newStatus);

        if (newStatus == ACTIVE && userEnterprise.getEnterprise() != null) {
            log.info("Ativando plano STANDARD para a empresa: {}", userEnterprise.getEnterprise().getId());
            crudEnterpriseImpl.updateEnterprisePlan(userEnterprise.getEnterprise().getId(), PlansEnum.STANDARD.getName());
        }

        log.info("Status de assinatura atualizado para {} para o usuário {}", newStatus, userEnterprise.getId());
    }

    @Transactional
    public void getWebhook(Event event) {
        switch (event.getType()) {
            case "invoice.payment_succeeded":
                Invoice invoice = (Invoice) event.getDataObjectDeserializer().getObject().orElseThrow();
                log.info("Pagamento sucedido para o cliente: {}", invoice.getCustomer());
                updateSubscriptionStatus(invoice.getCustomer(), ACTIVE);
                break;

            case "invoice.payment_failed":
                Invoice failedInvoice = (Invoice) event.getDataObjectDeserializer().getObject().orElseThrow();
                log.warn("Pagamento falhou para o cliente: {}", failedInvoice.getCustomer());
                updateSubscriptionStatus(failedInvoice.getCustomer(), PAST_DUE);
                break;

            case "customer.subscription.deleted":
                Subscription subscription = (Subscription) event.getDataObjectDeserializer().getObject().orElseThrow();
                log.info("Assinatura cancelada para o cliente: {}", subscription.getCustomer());
                updateSubscriptionStatus(subscription.getCustomer(), CANCELED);
                break;

            default:
                log.debug("Evento Stripe não tratado: {}", event.getType());
        }
    }
}
