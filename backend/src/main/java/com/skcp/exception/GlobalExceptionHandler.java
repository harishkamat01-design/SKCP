package com.skcp.exception;

import com.skcp.common.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler 
{

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) 
    
        {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Validation failed");

        ApiErrorResponse response = ApiErrorResponse.failure(
                message,
                "VALIDATION_ERROR");

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
        }
        

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ApiErrorResponse> handleResourceNotFoundException(
        ResourceNotFoundException ex
        ) 
        {
         ApiErrorResponse response = ApiErrorResponse.failure(
            ex.getMessage(),
            "RESOURCE_NOT_FOUND"
        );

        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(response);
        }


        @ExceptionHandler(DuplicateResourceException.class)
        public ResponseEntity<ApiErrorResponse> handleDuplicateResourceException(
        DuplicateResourceException ex
        ) 
        {
        ApiErrorResponse response = ApiErrorResponse.failure(
            ex.getMessage(),
            "DUPLICATE_RESOURCE"
        );

        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(response);
        }
    
}