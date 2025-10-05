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
	//  services ✅
	//    command ✅
	//    query ✅
	//  usecases ✅
	//  controllers
	//  adicionar selo vaga externa
	//  adicionar senioridade da vaga
	//  adicionar horario de trabalho
	//  adicionar modelo de contratação
	//  tags de soft e hard skills
	//  swagger ✅
	//  DigitalOcean
	//    deploy api ✅
	//    create SQL DB ✅
	//    create Storage
	//  return filesUrl
	//  services
	//    login ✅
	//    logout
	//    painel partner
	//    view job opening
	//    change status job opening
	//    change status module
	//    change status course
	//  emissão de certificados
	//  estudar teste comportamental
	//    disc
	//    big five
	//  role admin
}
