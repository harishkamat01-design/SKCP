/* Since we changed the standard response contract, update the error response too. */


package com.skcp.common;

import java.time.LocalDateTime;

public class ApiErrorResponse
{

    // ============================================================
    // RESPONSE STATUS
    // ============================================================

    private String status;


    // ============================================================
    // RESPONSE MESSAGE
    // ============================================================

    private String message;


    // ============================================================
    // ERROR
    // ============================================================

    private String error;


    // ============================================================
    // TIMESTAMP
    // ============================================================

    private LocalDateTime timestamp;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public ApiErrorResponse()
    {
    }


    // ============================================================
    // PRIVATE CONSTRUCTOR
    // ============================================================

    private ApiErrorResponse(
            String status,
            String message,
            String error
    )
    {
        this.status = status;
        this.message = message;
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }


    // ============================================================
    // FAILURE RESPONSE
    // ============================================================

    public static ApiErrorResponse failure(
            String message,
            String error
    )
    {
        return new ApiErrorResponse(
                "FAILURE",
                message,
                error
        );
    }


    // ============================================================
    // GETTERS
    // ============================================================

    public String getStatus()
    {
        return status;
    }


    public String getMessage()
    {
        return message;
    }


    public String getError()
    {
        return error;
    }


    public LocalDateTime getTimestamp()
    {
        return timestamp;
    }


    // ============================================================
    // SETTERS
    // ============================================================

    public void setStatus(String status)
    {
        this.status = status;
    }


    public void setMessage(String message)
    {
        this.message = message;
    }


    public void setError(String error)
    {
        this.error = error;
    }


    public void setTimestamp(LocalDateTime timestamp)
    {
        this.timestamp = timestamp;
    }

}





/*
package com.skcp.common;

import java.time.LocalDateTime;

public class ApiErrorResponse 

{
    private boolean success;
    private String message;
    private String error;
    private LocalDateTime timestamp;

    public ApiErrorResponse() 
    {
    }

    private ApiErrorResponse(
            boolean success,
            String message,
            String error) 
    {
        this.success = success;
        this.message = message;
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }

    public static ApiErrorResponse failure(
            String message,
            String error
    ) 
    {
        return new ApiErrorResponse(
                false,
                message,
                error);
    }




    public boolean isSuccess() //If Success
    {
        return success;
    }

    public String getMessage() 
    {
        return message;
    }

    public String getError() 
    {
        return error;
    }

    public LocalDateTime getTimestamp() 
    {
        return timestamp;
    }
}


*/