package com.ncm.marketplace.gateways.controller.impl.services.email;

import com.ncm.marketplace.gateways.controller.interfaces.services.email.EmailController;
import com.ncm.marketplace.usecases.services.email.EmailService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/email")
@Tag(name = "Email")
public class EmailControllerImpl implements EmailController {
    private final EmailService emailService;

    @GetMapping("/hello-world")
    @Override
    public ResponseEntity<String> helloWorld(@RequestParam String email) {
        return ResponseEntity.ok(emailService.sendHelloWorldEmail(email));
    }
    @GetMapping("/marketing")
    @Override
    public ResponseEntity<String> sendMarketingEmail(@RequestParam String subject, @RequestParam String templateName) throws IOException {
        return ResponseEntity.ok(emailService.sendMarketingEmail(subject, templateName));
    }

}
