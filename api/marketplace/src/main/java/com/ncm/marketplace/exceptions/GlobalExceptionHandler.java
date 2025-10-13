package com.ncm.marketplace.exceptions;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<?> handleNoResourceFound(NoResourceFoundException ex, HttpServletRequest req) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage(), req);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<?> handleInvalidCredentials(InvalidCredentialsException ex, HttpServletRequest req) {
        return buildError(HttpStatus.FORBIDDEN, ex.getMessage(), req);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> handleIllegalState(IllegalStateException ex, HttpServletRequest req) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), req);
    }

    @ExceptionHandler(UserBlockedException.class)
    public ResponseEntity<?> handleUserBlocked(UserBlockedException ex, HttpServletRequest req) {
        return buildError(HttpStatus.FORBIDDEN, ex.getMessage(), req);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequest(BadRequestException ex, HttpServletRequest req) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), req);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<?> handleUnauthorized(UnauthorizedException ex, HttpServletRequest req) {
        return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage(), req);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<?> handleConflict(ConflictException ex, HttpServletRequest req) {
        return buildError(HttpStatus.CONFLICT, ex.getMessage(), req);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> handleEntityNotFound(EntityNotFoundException ex, HttpServletRequest req) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage(), req);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Dados inválidos");
        return buildError(HttpStatus.BAD_REQUEST, msg, req);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleDefault(Exception ex, HttpServletRequest req) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno", req);
    }

    private ResponseEntity<Map<String, Object>> buildError(HttpStatus status, String message, HttpServletRequest req) {
        return ResponseEntity.status(status).body(Map.of(
                "timestamp", Instant.now(),
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", message,
                "path", req.getRequestURI()
        ));
    }
}




