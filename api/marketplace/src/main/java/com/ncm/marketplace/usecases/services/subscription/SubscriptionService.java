package com.ncm.marketplace.usecases.services.subscription;

import com.ncm.marketplace.domains.catalog.Module;
import com.ncm.marketplace.domains.enterprise.Enterprise;
import com.ncm.marketplace.domains.enums.PlansEnum;
import com.ncm.marketplace.domains.enums.SubscriptionStatusEnum;
import com.ncm.marketplace.domains.mentorship.MentorshipAppointment;
import com.ncm.marketplace.domains.user.UserEnterprise;
import com.ncm.marketplace.domains.user.candidate.UserCandidate;
import com.ncm.marketplace.exceptions.IllegalStateException;
import com.ncm.marketplace.exceptions.NotFoundException;
import com.ncm.marketplace.gateways.dtos.requests.services.subscription.CreateSubscriptionRequest;
import com.ncm.marketplace.gateways.dtos.responses.services.subscription.SubscriptionResponse;
import com.ncm.marketplace.usecases.interfaces.enterprises.CrudEnterprise;
import com.ncm.marketplace.usecases.interfaces.mentorship.MentorshipAppointmentService;
import com.ncm.marketplace.usecases.interfaces.user.candidate.CrudUserCandidate;
import com.ncm.marketplace.usecases.services.query.catalog.ModuleQueryService;
import com.ncm.marketplace.usecases.services.query.enterprises.EnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.mentorship.MentorshipAppointmentQueryService;
import com.ncm.marketplace.usecases.services.query.user.UserEnterpriseQueryService;
import com.ncm.marketplace.usecases.services.query.user.candidate.UserCandidateQueryService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.param.*;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Map;
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
    private final EnterpriseQueryService enterpriseQueryService;
    private final MentorshipAppointmentService mentorshipAppointmentService;
    private final MentorshipAppointmentQueryService mentorshipAppointmentQueryService;
    private final ModuleQueryService moduleQueryService;

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
    public void getWebhook(Event event) throws IOException {
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
            case "checkout.session.completed":
                if (stripeObject instanceof Session session) {
                    handleCheckoutCompleted(session);
                }
                break;
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

        if (enterpriseQueryService.existsById(id)) {
            Enterprise enterprise = enterpriseQueryService.findByIdOrThrow(id);
            stripeSubscriptionId = enterprise.getUserEnterprise().getStripeSubscriptionId();
        } else if (userCandidateQueryService.existsById(id)) {
            UserCandidate userCandidate = userCandidateQueryService.findByIdOrThrow(id);
            stripeSubscriptionId = userCandidate.getStripeSubscriptionId();
        } else {
            throw new NotFoundException("User not found with id " + id);
        }

        Subscription subscription = Subscription.retrieve(stripeSubscriptionId);

        subscription.cancel();
    }

    @Transactional
    public void createMentorshipProduct(Module module) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        // 1. Criar o Produto no Stripe
        ProductCreateParams productParams = ProductCreateParams.builder()
                .setName("Mentoria: " + module.getTitle())
                .setDescription("Sessão de mentoria individual para o módulo " + module.getTitle())
                .build();

        Product product = Product.create(productParams);

        module.setStripeProductId(product.getId());

        // 2. Criar o Preço associado (Valor por hora)
        // O Stripe usa centavos (ex: R$ 100,00 = 10000)
        PriceCreateParams priceParams = PriceCreateParams.builder()
                .setProduct(product.getId())
                .setUnitAmount((long) (module.getMentorshipValuePerHour() * 100 * (1 + (0.16 + 0.30)))) // 16% de taxa e 30% taxa administrativa
                .setCurrency("brl")
                .build();

        Price price = Price.create(priceParams);

        module.setStripePriceId(price.getId());
    }

    private void handleCheckoutCompleted(Session session) throws IOException {
        Stripe.apiKey = stripeSecretKey;
        // Recupera o ID que você enviou nos metadados ao criar a sessão
        String appointmentId = session.getMetadata().get("appointmentId");
        String paymentIntentId = session.getPaymentIntent();
        String type = session.getMetadata().get("type");

        if ("MENTORSHIP".equals(type) && appointmentId != null) {
            log.info("Pagamento confirmado para mentoria ID: {}", appointmentId);
            // Aqui você chama o seu service de agendamento para mudar para PAID
            mentorshipAppointmentService.confirmPayment(appointmentId, paymentIntentId);
        }
    }

    public Map<String, String> createMentorshipPayment(String id) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        MentorshipAppointment appt = mentorshipAppointmentQueryService.findByIdOrThrow(id);
        Module module = moduleQueryService.findByIdOrThrow(appt.getModule().getId());

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("https://marketplace.ncmconsultoria.com.br/payment/success")
                .setCancelUrl("https://marketplace.ncmconsultoria.com.br/payment/failed")
                .putMetadata("appointmentId", id) // Fundamental para o Webhook
                .putMetadata("type", "MENTORSHIP")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPrice(module.getStripePriceId())
                        .setQuantity(1L)
                        .build())
                .build();

        Session session = Session.create(params);

        return Map.of("checkoutUrl", session.getUrl());
    }

    public void updateMentorshipPrice(Module module) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        // 1. Criar um NOVO preço para o produto já existente
        PriceCreateParams priceParams = PriceCreateParams.builder()
                .setProduct(module.getStripePriceId()) // Usa o ID do produto que você já salvou
                .setUnitAmount((long) (module.getMentorshipValuePerHour() * 100))
                .setCurrency("brl")
                .build();

        Price newPrice = Price.create(priceParams);

        // 2. Opcional: Arquivar o preço antigo no Stripe para ele não aparecer mais no Dashboard
        if (module.getStripePriceId() != null) {
            Price oldPrice = Price.retrieve(module.getStripePriceId());
            PriceUpdateParams updateParams = PriceUpdateParams.builder()
                    .setActive(false)
                    .build();
            oldPrice.update(updateParams);
        }

        // 3. Retornar o ID do novo preço para atualizar o banco
        module.setStripePriceId(newPrice.getId());
    }
}
