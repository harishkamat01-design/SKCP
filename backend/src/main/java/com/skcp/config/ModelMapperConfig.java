package com.skcp.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration                        // Tells Spring Boot: this class contains application setup code.
public class ModelMapperConfig 
{

    @Bean                             // Tells Spring Boot to create one reusable ModelMapper object.
    public ModelMapper modelMapper() 
    {
        return new ModelMapper();
    }
}


/*

Then CustomerMapper can receive and use that same object, instead of manually copying every matching field.
    ModelMapperConfig
            ↓ creates
    ModelMapper object
            ↓ used by
    CustomerMapper

*/