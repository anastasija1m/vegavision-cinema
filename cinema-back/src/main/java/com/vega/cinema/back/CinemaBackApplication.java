package com.vega.cinema.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
@EntityScan
@SpringBootApplication
public class CinemaBackApplication {

	public static void main(String[] args) {

		SpringApplication.run(CinemaBackApplication.class, args);
		System.out.println("Hello world!");
	}
}