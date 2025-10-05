package com.ncm.marketplace;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MarketplaceApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

		dotenv.entries().forEach(entry -> {
			if (System.getenv(entry.getKey()) == null) {
				System.setProperty(entry.getKey(), entry.getValue());
			}
		});

		System.setProperty("user.timezone", "America/Sao_Paulo");
		SpringApplication.run(MarketplaceApplication.class, args);
	}
	// TODO
	//  domains ✅
	//  repositories ✅
	//  dtos ✅
	//    requests ✅
	//    responses ✅
	//  mappers ✅
	//  services
	//    command ✅
	//    query
	//  usecases
	//  controllers
	//  swagger
	//  DigitalOcean
	//    deploy api ✅
	//    create SQL DB ✅
	//    create Storage
	//  return filesUrl
	//  services
	//    login ✅
	//    view job opening
	//    change status job opening
	//    change status module
	//    change status course
}
