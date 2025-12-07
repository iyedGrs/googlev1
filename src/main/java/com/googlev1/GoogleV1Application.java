package com.googlev1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.googlev1")
@EnableJpaRepositories(basePackages = "com.googlev1.repository")
public class GoogleV1Application {

    public static void main(String[] args) {
        SpringApplication.run(GoogleV1Application.class, args);
    }

}
