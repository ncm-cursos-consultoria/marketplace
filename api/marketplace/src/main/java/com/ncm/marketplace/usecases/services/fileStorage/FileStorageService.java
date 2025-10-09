package com.ncm.marketplace.usecases.services.fileStorage;

import com.ncm.marketplace.domains.enums.FilePathEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final S3Client s3Client;

    @Value("${do.spaces.bucket-name}")
    private String bucketName;

    @Value("${do.spaces.region}")
    private String region;

    public String uploadFile(MultipartFile file,
                             FilePathEnum filePath,
                             Map<String, String> pathParams) throws IOException {
        String folderPath = buildPath(filePath, pathParams);
        String extension = getFileExtension(file.getOriginalFilename());
        String key = String.format("%s/%s.%s", folderPath, UUID.randomUUID(), extension);

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        // Retorna a URL pública do arquivo
        return String.format("https://%s.%s.digitaloceanspaces.com/%s", bucketName, region, key);
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }

    private String buildPath(FilePathEnum filePath, Map<String, String> pathParams) {
        String template = filePath.getPath();

        Pattern pattern = Pattern.compile("\\{([^}]+)}");
        Matcher matcher = pattern.matcher(template);

        StringBuilder path = new StringBuilder();
        while (matcher.find()) {
            String placeholder = matcher.group(1);
            String value = pathParams.get(placeholder);

            if (value == null || value.isBlank()) {
                throw new IllegalArgumentException("Parâmetro de caminho obrigatório '" + placeholder + "' está faltando para o tipo de arquivo " + filePath.name());
            }
            matcher.appendReplacement(path, value);
        }
        matcher.appendTail(path);

        return path.toString();
    }
}