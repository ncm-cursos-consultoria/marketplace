package com.ncm.marketplace.usecases.services.subscription;

import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.PlansEnum;
import com.ncm.marketplace.domains.enums.SubscriptionStatusEnum;
import com.ncm.marketplace.domains.others.Plan;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.dtos.requests.services.subscription.CreateSubscriptionRequest;
import com.ncm.marketplace.gateways.dtos.responses.services.subscription.SubscriptionResponse;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import com.ncm.marketplace.usecases.interfaces.relationships.plan.user.candidate.PlanUserCandidateService;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudUserCandidate;
import com.ncm.marketplace.usecases.services.query.others.PlanQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserEnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
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

import java.util.Objects;

import static com.ncm.marketplace.domains.enums.SubscriptionStatusEnum.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final CrudEnterprise crudEnterprise;
    private final UserEnterpriseQueryService userEnterpriseQueryService;
    private final UserCandidateQueryService userCandidateQueryService;
    private final CrudUserCandidate crudUserCandidate;
    private final PlanQueryService planQueryService;
    private final PlanUserCandidateService planUserCandidateService;

    @Value("${stripe.api.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.price-id}")
    private String stripePriceId;

    @Value("${stripe.candidate.price-id}")
    private String stripeUserCandidatePriceId;

    @Transactional
    public SubscriptionResponse createEnterpriseSubscription(CreateSubscriptionRequest request) throws StripeException {
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
            crudEnterprise.updateEnterprisePlan(userEnterprise.getEnterprise().getId(), PlansEnum.STANDARD.getName());
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
    public SubscriptionResponse createUserCandidateSubscription(CreateSubscriptionRequest request) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        UserCandidate userCandidate = userCandidateQueryService.findByIdOrThrow(request.getId());

        String paymentMethodId = request.getPaymentMethodId();

        CustomerCreateParams customerParams = CustomerCreateParams.builder()
                .setName(userCandidate.getFullName())
                .setEmail(userCandidate.getEmail())
                .setPaymentMethod(paymentMethodId)
                .setInvoiceSettings(
                        CustomerCreateParams.InvoiceSettings.builder()
                                .setDefaultPaymentMethod(paymentMethodId)
                                .build()
                )
                .build();

        Customer customer = Customer.create(customerParams);

        userCandidate.setStripeCustomerId(customer.getId());

        // 4. Crie a Assinatura (Subscription)
        SubscriptionCreateParams subParams = SubscriptionCreateParams.builder()
                .setCustomer(customer.getId())
                .addItem(
                        SubscriptionCreateParams.Item.builder()
                                .setPrice(stripeUserCandidatePriceId)
                                .build()
                )
                .setPaymentBehavior(SubscriptionCreateParams.PaymentBehavior.ALLOW_INCOMPLETE)
                .setCollectionMethod(SubscriptionCreateParams.CollectionMethod.CHARGE_AUTOMATICALLY)
                .addExpand("latest_invoice.payment_intent")
                .build();

        Subscription subscription = Subscription.create(subParams);

        userCandidate.setStripeSubscriptionId(subscription.getId());

        String stripeStatus = subscription.getStatus();

        if (stripeStatus.equals("active") || stripeStatus.equals("trialing")) {
            userCandidate.setSubscriptionStatus(ACTIVE);
            crudUserCandidate.updateUserCandidatePlan(userCandidate.getId(), PlansEnum.STANDARD.getName());
        } else {
            userCandidate.setSubscriptionStatus(PENDING);
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

        if (userEnterpriseQueryService.existsByStripeCustomerId(stripeCustomerId)) {
            UserEnterprise userEnterprise = userEnterpriseQueryService.findByStripeCustomerIdOrThrow(stripeCustomerId);
            userEnterprise.setSubscriptionStatus(newStatus);

            if (userEnterprise.getEnterprise() != null) {
                if (Objects.requireNonNull(newStatus) == ACTIVE) {
                    log.info("Ativando plano STANDARD para a empresa: {}", userEnterprise.getEnterprise().getId());
                    crudEnterprise.updateEnterprisePlan(userEnterprise.getEnterprise().getId(), PlansEnum.STANDARD.getName());
                }
            }

            log.info("Status de assinatura atualizado para {} para o usuário {}", newStatus, userEnterprise.getId());
        } else if (userCandidateQueryService.existsByStripeCustomerId(stripeCustomerId)) {
            UserCandidate userCandidate = userCandidateQueryService.findByStripeCustomerIdOrThrow(stripeCustomerId);
            userCandidate.setSubscriptionStatus(newStatus);

            if (newStatus == ACTIVE) {
                log.info("Ativando plano STANDARD para o usuário: {}", userCandidate.getId());
                crudUserCandidate.updateUserCandidatePlan(userCandidate.getId(), PlansEnum.STANDARD.getName());
            }

            log.info("Status de assinatura atualizado para {} para o usuário {}", newStatus, userCandidate.getId());
        } else {
            throw new NotFoundException("User not found with Stripe Customer Id: " + stripeCustomerId);
        }
    }

    @Transactional
    public void getWebhook(Event event) {
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = null;

        if (dataObjectDeserializer.getObject().isPresent()) {
            stripeObject = dataObjectDeserializer.getObject().get();
        } else {
            try {
                stripeObject = dataObjectDeserializer.deserializeUnsafe();
            } catch (Exception e) {
                log.error("Falha crítica na deserialização do objeto Stripe: {}", e.getMessage());
                return;
            }
        }

        switch (event.getType()) {
            case "invoice.payment_succeeded":
                if (stripeObject instanceof Invoice invoice) {
                    log.info("Pagamento sucedido para o cliente: {}", invoice.getCustomer());
                    updateSubscriptionStatus(invoice.getCustomer(), ACTIVE);
                }
                break;

            case "invoice.payment_failed":
                if (stripeObject instanceof Invoice failedInvoice) {
                    log.warn("Pagamento falhou para o cliente: {}", failedInvoice.getCustomer());
                    updateSubscriptionStatus(failedInvoice.getCustomer(), PAST_DUE);
                }
                break;

            case "customer.subscription.deleted":
                if (stripeObject instanceof Subscription subscription) {
                    log.info("Assinatura cancelada para o cliente: {}", subscription.getCustomer());
                    updateSubscriptionStatus(subscription.getCustomer(), CANCELED);
                }
                break;

            default:
                log.debug("Evento Stripe não tratado: {}", event.getType());
        }
    }

    public void cancelSubscription(String id) throws StripeException {
        Stripe.apiKey = stripeSecretKey;
        String stripeSubscriptionId = null;

        if (userEnterpriseQueryService.existsById(id)) {
            UserEnterprise userEnterprise = userEnterpriseQueryService.findByIdOrThrow(id);
            stripeSubscriptionId = userEnterprise.getStripeSubscriptionId();
        } else if (userCandidateQueryService.existsById(id)) {
            UserCandidate userCandidate = userCandidateQueryService.findByIdOrThrow(id);
            stripeSubscriptionId = userCandidate.getStripeSubscriptionId();
        } else {
            throw new NotFoundException("User not found with id " + id);
        }

        Subscription subscription = Subscription.retrieve(stripeSubscriptionId);

        subscription.cancel();
    }
}
