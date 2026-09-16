package com.skcp.dto.response.auth;

public class LoginResponse
{
    private String token;
    private Integer userId;
    private String username;
    private String role;

    public LoginResponse(
            String token,
            Integer userId,
            String username,
            String role
    )
    {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.role = role;
    }

    public String getToken()
    {
        return token;
    }

    public Integer getUserId()
    {
        return userId;
    }

    public String getUsername()
    {
        return username;
    }

    public String getRole()
    {
        return role;
    }
}