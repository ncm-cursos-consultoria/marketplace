package com.ncm.marketplace.usecases.services.security;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class RandomPasswordService {

    private static final int PASSWORD_LENGTH = 8;

    public String generateSecurePassword() {
        SecureRandom random = new SecureRandom();
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lower = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String symbols = "!@#$";
        String all = upper + lower + digits + symbols;

        StringBuilder password = new StringBuilder();

        password.append(upper.charAt(random.nextInt(upper.length())));
        password.append(lower.charAt(random.nextInt(lower.length())));
        password.append(digits.charAt(random.nextInt(digits.length())));
        password.append(symbols.charAt(random.nextInt(symbols.length())));

        for (int i = 4; i < PASSWORD_LENGTH; i++) {
            password.append(all.charAt(random.nextInt(all.length())));
        }

        return shuffleString(password.toString(), random);
    }

    private String shuffleString(String input, SecureRandom random) {
        char[] characters = input.toCharArray();
        for (int i = characters.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = characters[i];
            characters[i] = characters[j];
            characters[j] = temp;
        }
        return new String(characters);
    }

    public String generateForgetPasswordDigitCode() {
        SecureRandom random = new SecureRandom();
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String digits = "0123456789";
        String all = upper + digits;

        StringBuilder password = new StringBuilder();

        password.append(upper.charAt(random.nextInt(upper.length())));
        password.append(digits.charAt(random.nextInt(digits.length())));

        for (int i = 0; i < 2; i++) {
            password.append(all.charAt(random.nextInt(all.length())));
        }

        return shuffleString(password.toString(), random);
    }

}
