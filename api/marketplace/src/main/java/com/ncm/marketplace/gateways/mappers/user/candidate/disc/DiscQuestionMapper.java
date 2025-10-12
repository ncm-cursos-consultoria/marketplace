package com.ncm.marketplace.gateways.mappers.user.candidate.disc;

import com.ncm.marketplace.domains.user.candidate.disc.DiscQuestion;
import com.ncm.marketplace.gateways.dtos.requests.domains.user.candidate.disc.CreateDiscQuestionRequest;
import com.ncm.marketplace.gateways.dtos.responses.domains.user.candidate.disc.DiscQuestionResponse;

import java.util.List;

public class DiscQuestionMapper {
    public static DiscQuestion toEntityCreate(CreateDiscQuestionRequest request) {
        return DiscQuestion.builder()
                .name(request.getName())
                .type(request.getType())
                .build();
    }

    public static DiscQuestionResponse toResponse(DiscQuestion question) {
        return DiscQuestionResponse.builder()
                .id(question.getId())
                .name(question.getName())
                .type(question.getType())
                .build();
    }

    public static List<DiscQuestionResponse> toResponse(List<DiscQuestion> questions) {
        return questions.stream().map(DiscQuestionMapper::toResponse).toList();
    }
}
