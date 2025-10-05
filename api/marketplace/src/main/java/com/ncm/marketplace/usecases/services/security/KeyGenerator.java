package com.ncm.marketplace.usecases.services.security;

import java.security.SecureRandom;
import java.util.Base64;

public class KeyGenerator {
    public static void main(String[] args) {
        SecureRandom random = new SecureRandom();
        byte[] key = new byte[32]; // 32 bytes = 256 bits
        random.nextBytes(key);
        String base64Key = Base64.getEncoder().encodeToString(key);
        System.out.println("Sua nova chave secreta (guarde com segurança):");
        System.out.println(base64Key);
    }
}