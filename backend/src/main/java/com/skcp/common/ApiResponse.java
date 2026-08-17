
/*
Your existing class has success: true/false.
We are now standardizing it to exactly what you requested:
status = SUCCESS/FAILURE        rather than          success=true/false
data
message
timestamp

*/


package com.skcp.common;

import java.time.LocalDateTime;

public class ApiResponse<T>
{

    // ============================================================
    // RESPONSE STATUS
    // ============================================================

    private String status;


    // ============================================================
    // RESPONSE DATA
    // ============================================================

    private T data;


    // ============================================================
    // RESPONSE MESSAGE
    // ============================================================

    private String message;


    // ============================================================
    // TIMESTAMP
    // ============================================================

    private LocalDateTime timestamp;


    // ============================================================
    // DEFAULT CONSTRUCTOR
    // ============================================================

    public ApiResponse()
    {
    }


    // ============================================================
    // PRIVATE CONSTRUCTOR
    // ============================================================

    private ApiResponse(
            String status,
            T data,
            String message
    )
    {
        this.status = status;
        this.data = data;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }


    // ============================================================
    // SUCCESS RESPONSE
    // ============================================================

    public static <T> ApiResponse<T> success(
            String message,
            T data
    )
    {
        return new ApiResponse<>(
                "SUCCESS",
                data,
                message
        );
    }


    // ============================================================
    // FAILURE RESPONSE
    // ============================================================

    public static <T> ApiResponse<T> failure(
            String message
    )
    {
        return new ApiResponse<>(
                "FAILURE",
                null,
                message
        );
    }


    // ============================================================
    // GETTERS
    // ============================================================

    public String getStatus()
    {
        return status;
    }


    public T getData()
    {
        return data;
    }


    public String getMessage()
    {
        return message;
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


    public void setData(T data)
    {
        this.data = data;
    }


    public void setMessage(String message)
    {
        this.message = message;
    }


    public void setTimestamp(LocalDateTime timestamp)
    {
        this.timestamp = timestamp;
    }

}

























/*

package com.skcp.common;

import java.time.LocalDateTime;

public class ApiResponse<T>     

{
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public ApiResponse() 
    {
    }

    private ApiResponse(boolean success, 
        String message, 
        T data) 
    {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ApiResponse<T> success(
        String message, 
        T data) 
    {
        return new ApiResponse<>(true, 
            message,
            data);
    }

    public static <T> ApiResponse<T> failure(String message)  //if failure
    
    {
        return new ApiResponse<>(false, message, null);
    }

    public boolean isSuccess() 
    {
        return success;
    }

    public String getMessage() 
    {
        return message;
    }

    public T getData() 
    {
        return data;
    }

    public LocalDateTime getTimestamp() 
    {
        return timestamp;
    }
}

*/

/*

<T> means this class can wrap any type of data:
ApiResponse<CustomerResponse>
ApiResponse<List<CustomerSummaryResponse>>
ApiResponse<Void>

For example, instead of returning only this:
{
  "customerId": 8,
  "customerName": "Gangadhar Shenoy"
}
the API will return:
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "customerId": 8,
    "customerName": "Gangadhar Shenoy"
  },
  "timestamp": "2026-08-07T21:30:00"
}


*/