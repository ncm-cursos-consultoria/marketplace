package com.ncm.marketplace.usecases.services.security;

import com.ncm.marketplace.exceptions.IllegalStateException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class CryptoService {

    @Value("${meta.credentials-key-b64}")
    private String masterKeyB64;

    private static final String VER = "v1";
    private static final int GCM_TAG_BITS = 128;
    private static final int IV_LEN = 12;
    private SecretKey key;
    private final SecureRandom rng = new SecureRandom();

    @PostConstruct
    void init() {
        byte[] raw = Base64.getDecoder().decode(masterKeyB64);
        if (raw.length != 32) throw new IllegalStateException("CREDENTIALS_MASTER_KEY_B64 deve ter 32 bytes");
        this.key = new SecretKeySpec(raw, "AES");
    }

    public String encrypt(String plaintext) {
        if (plaintext == null) return null;
        try {
            byte[] iv = new byte[IV_LEN];
            rng.nextBytes(iv);
            Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
            c.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_BITS, iv));
            byte[] cipher = c.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
            return VER + ":" + Base64.getEncoder().encodeToString(iv) + ":" +
                    Base64.getEncoder().encodeToString(cipher);
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao criptografar");
        }
    }

    public String decrypt(String blob) {
        if (blob == null) return null;
        try {
            String[] parts = blob.split(":");
            if (parts.length != 3 || !VER.equals(parts[0])) {
                throw new IllegalArgumentException("Formato de credencial inválido");
            }
            byte[] iv = Base64.getDecoder().decode(parts[1]);
            byte[] cipher = Base64.getDecoder().decode(parts[2]);
            Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
            c.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_BITS, iv));
            byte[] plain = c.doFinal(cipher);
            return new String(plain, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao descriptografar");
        }
    }
}
