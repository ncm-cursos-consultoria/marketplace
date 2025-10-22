package com.ncm.marketplace.usecases.services.gemini;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ncm.marketplace.domains.enums.DiscEnum;
import com.ncm.marketplace.gateways.dtos.responses.services.gemini.GeminiApiResponse;
import com.ncm.marketplace.gateways.dtos.responses.services.gemini.GeminiDiscReport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class GeminiService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GeminiService(
            @Value("${gemini.api.url}") String apiUrl,
            @Value("${gemini.api.key}") String apiKey,
            ObjectMapper objectMapper
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(apiUrl + "?key=" + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
        this.objectMapper = objectMapper;
    }

    public GeminiDiscReport generateDiscReport(Map<String, Integer> questionScores) {
        try {
            // 1. Crie o prompt
            String prompt = createPrompt(questionScores);

            // 2. Crie o corpo da requisição da API Gemini
            String requestBody = """
                {
                  "contents": [
                    { "parts": [ { "text": "%s" } ] }
                  ]
                }
                """.formatted(prompt.replace("\"", "\\\"")); // Escapa aspas

            // 3. Chame a API
            GeminiApiResponse apiResponse = restClient.post()
                    .body(requestBody)
                    .retrieve()
                    .body(GeminiApiResponse.class);

            // 4. Extraia o texto da resposta
            if (apiResponse != null && !apiResponse.getCandidates().isEmpty()) {
                String jsonTextResponse = apiResponse.getCandidates().get(0)
                        .getContent().getParts().get(0)
                        .getText();

                // 5. Limpe o JSON (Gemini às vezes adiciona "```json" no início e "```" no fim)
                String cleanedJson = jsonTextResponse
                        .replace("```json", "")
                        .replace("```", "")
                        .trim();

                // 6. Converta a string JSON em nosso DTO Java
                return objectMapper.readValue(cleanedJson, GeminiDiscReport.class);
            }

            throw new RuntimeException("Resposta inválida da API Gemini");

        } catch (Exception e) {
            log.error("Erro ao chamar API Gemini: {}", e.getMessage());
            throw new RuntimeException("Falha ao gerar relatório DISC", e);
        }
    }

    private String createPrompt(Map<String, Integer> questionScores) {
        String scoreString = questionScores.entrySet().stream()
                .map(entry -> String.format("- Pergunta (traço de personalidade): \"%s\", Pontuação (1-4): %d",
                        entry.getKey(), entry.getValue()))
                .collect(Collectors.joining("\n"));

        return """
            Você é um especialista em análise comportamental e perfis DISC.
            Baseado nas seguintes respostas de um usuário a um questionário (onde 1 é "pouco a ver" e 4 é "tudo a ver"):
            %s
            
            Gere um relatório detalhado para este usuário.
            A resposta DEVE ser um único objeto JSON, sem formatação markdown.
            O JSON deve conter EXATAMENTE as seguintes chaves (use os nomes em inglês):
            1. "yourDiscProfile": (Tradução de "Você no DISC". Um parágrafo de 3 linhas sobre o perfil principal, maximo 2000 caracteres)
            2. "publicProfile": (Tradução de "Máscara Postural". Um parágrafo de 3 linhas sobre como o usuário se projeta, maximo 2000 caracteres)
            3. "privateSelf": (Tradução de "Íntimo". Um parágrafo de 3 linhas sobre o perfil íntimo, maximo 2000 caracteres)
            4. "naturalBehavior": (Tradução de "Postura Usual". Um parágrafo de 3 linhas sobre o comportamento natural, maximo 2000 caracteres)
            5. "developmentTips": (Tradução de "Aconselhamento Adicional". Um parágrafo de 3 linhas com conselhos, maximo 2000 caracteres)
            
            O texto deve ser em português do Brasil. Não inclua "```json" na resposta.
            """.formatted(scoreString);
    }
}