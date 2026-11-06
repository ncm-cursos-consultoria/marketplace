package com.ncm.marketplace.gateways.controller.interfaces.domains.mentorship;

import com.ncm.marketplace.gateways.dtos.responses.domains.mentorship.MentorshipEvaluationAdminResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface MentorshipEvaluationAdminController {

    @Operation(
            summary = "Listar comentários aguardando moderação",
            description = "Retorna avaliações que possuem comentários pendentes de moderação."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Comentários pendentes encontrados"
    )
    ResponseEntity<List<MentorshipEvaluationAdminResponse>> findPendingModeration();


    @Operation(
            summary = "Aprovar comentário",
            description = "Aprova somente o comentário da avaliação para exibição pública."
    )
    @ApiResponse(
            responseCode = "204",
            description = "Comentário aprovado"
    )
    ResponseEntity<Void> approveComment(
            @PathVariable String id
    );


    @Operation(
            summary = "Rejeitar comentário",
            description = "Rejeita somente o comentário. A nota da avaliação continua válida."
    )
    @ApiResponse(
            responseCode = "204",
            description = "Comentário rejeitado"
    )
    ResponseEntity<Void> rejectComment(
            @PathVariable String id
    );
}