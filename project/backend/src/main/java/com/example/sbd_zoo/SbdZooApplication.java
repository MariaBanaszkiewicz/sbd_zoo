package com.example.sbd_zoo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@EntityScan("com.example.sbd_zoo.model")
@EnableJpaRepositories("com.example.sbd_zoo.repository")
public class SbdZooApplication {

	public static void main(String[] args) {
		SpringApplication.run(SbdZooApplication.class, args);
	}

}
