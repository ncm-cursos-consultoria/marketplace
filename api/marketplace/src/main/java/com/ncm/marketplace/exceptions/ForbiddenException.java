package com.ncm.marketplace.exceptions;

public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {

        super(message);
    }
}
