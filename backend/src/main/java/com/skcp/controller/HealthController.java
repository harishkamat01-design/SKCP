package com.skcp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "SKCP Backend is Running Successfully 🚀";
    }

    @GetMapping("/health")
    public String health() {
        return "Backend Status: OK";
    }
}