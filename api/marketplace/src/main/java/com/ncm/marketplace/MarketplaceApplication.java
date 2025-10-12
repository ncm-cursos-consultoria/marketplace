package com.ncm.marketplace;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
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
	//  retornar url nas vagsa externas
	//  hasDisc
	//  BUG
	//    upload não funcionando ✅
	//    profile picture nao retornando no /me ✅
	//    todos erros retornando como 500
	//  INITIALIZER
	//    finalizar de aplicar as init criadas ✅
	//  CONTROLLER
	//    finalizar controllers que estão off ✅
	//    esqueci senha
	//  PROPRIEDADES
	//    JOB OPENING
	//      adcionar senioridade ✅
	//  TABELAS
	//    TAG
	//      soft skills e hard skills ✅
	//  RELATIONSHIPS
	//    finalizar
	//  SERVICES
	//    DASHBOARD PARTNER
	//      verificar propriedades
	//    JOB OPENING
	//      adicionar view
	//      mudar status
	//    MODULE
	//      mudar status
	//    COURSE
	//      mudar status
	//  emissão de certificados
	//  estudar teste comportamental
	//    disc
	//    big five
	//  role admin
}
