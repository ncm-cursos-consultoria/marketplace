package com.ncm.marketplace.usecases.services.payment;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.Locale;

@Service
public class PixPayloadService {

    public String buildPayload(String pixKey, String beneficiaryName, String beneficiaryCity, BigDecimal amount, String txid) {
        String merchantAccount = field("00", "BR.GOV.BCB.PIX") + field("01", pixKey);
        String additionalData = field("05", sanitize(txid, 25));

        String payloadWithoutCrc =
                field("00", "01") +
                field("01", "11") +
                field("26", merchantAccount) +
                field("52", "0000") +
                field("53", "986") +
                field("54", amount.setScale(2, RoundingMode.HALF_UP).toPlainString()) +
                field("58", "BR") +
                field("59", sanitize(beneficiaryName, 25)) +
                field("60", sanitize(beneficiaryCity, 15)) +
                field("62", additionalData) +
                "6304";

        return payloadWithoutCrc + crc16(payloadWithoutCrc);
    }

    private String field(String id, String value) {
        int length = value.getBytes(StandardCharsets.UTF_8).length;
        return id + String.format("%02d", length) + value;
    }

    private String sanitize(String value, int maxLength) {
        String normalized = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[^A-Za-z0-9 .\\-]", "")
                .trim()
                .toUpperCase(Locale.ROOT);
        return normalized.length() > maxLength ? normalized.substring(0, maxLength) : normalized;
    }

    private String crc16(String payload) {
        int polynomial = 0x1021;
        int result = 0xFFFF;

        byte[] bytes = payload.getBytes(StandardCharsets.UTF_8);
        for (byte b : bytes) {
            result ^= (b & 0xFF) << 8;
            for (int bit = 0; bit < 8; bit++) {
                if ((result & 0x8000) != 0) {
                    result = (result << 1) ^ polynomial;
                } else {
                    result <<= 1;
                }
                result &= 0xFFFF;
            }
        }

        return String.format("%04X", result);
    }
}