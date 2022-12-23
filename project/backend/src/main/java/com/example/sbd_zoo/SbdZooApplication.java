package com.example.sbd_zoo;

import com.example.sbd_zoo.db.ConnectionHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;


@SpringBootApplication(exclude={DataSourceAutoConfiguration.class})
public class SbdZooApplication {

	public static void main(String[] args) {
		SpringApplication.run(SbdZooApplication.class, args);
	}

}
