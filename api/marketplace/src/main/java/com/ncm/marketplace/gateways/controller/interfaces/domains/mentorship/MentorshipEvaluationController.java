package com.ncm.marketplace.gateways.controller.interfaces.domains.mentorship;

import com.ncm.marketplace.gateways.dtos.requests.domains.mentorship.evaluation.CreateMentorshipEvaluationRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipEvaluationResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface MentorshipEvaluationController {

    @Operation(
            summary = "Criar avaliação de mentoria",
            description = "Permite que o mentorado avalie uma mentoria concluída."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Avaliação criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados da avaliação inválidos"),
            @ApiResponse(responseCode = "404", description = "Mentoria não encontrada"),
            @ApiResponse(responseCode = "409", description = "Mentoria já avaliada")
    })
    ResponseEntity<MentorshipEvaluationResponse> save(
            @Valid @RequestBody CreateMentorshipEvaluationRequest request
    );

    @Operation(
            summary = "Listar avaliações públicas de um mentor",
            description = "Retorna as avaliações de um mentor. Comentários pendentes ou rejeitados não são retornados publicamente."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Avaliações encontradas"
    )
    ResponseEntity<List<MentorshipEvaluationResponse>> findByMentorId(
            @PathVariable String mentorId
    );
}