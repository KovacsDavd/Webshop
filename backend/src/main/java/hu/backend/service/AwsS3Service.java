package hu.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
@Slf4j
public class AwsS3Service {
    private final String bucketName = "mywebshop";

    @Value("${spring.cloud.aws.credentials.access-key}")
    private String accessKeyId;

    @Value("${spring.cloud.aws.credentials.secret-key}")
    private String secretAccessKey;

    public String saveImageToAwsS3(final MultipartFile file) {
        try {
            String s3FileName = file.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID() + "_" + s3FileName;
            S3Client s3Client = createS3Client();

            Path tempFile = Files.createTempFile("s3-upload", s3FileName);
            file.transferTo(tempFile.toFile());

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(uniqueFileName)
                    .build();
            s3Client.putObject(putObjectRequest, tempFile);
            Files.delete(tempFile);
            String fileUrl = "https://" + bucketName + ".s3." + Region.EU_NORTH_1.id() + ".amazonaws.com/" + uniqueFileName;

            log.info("File URL: {}", fileUrl);
            return fileUrl;

        } catch (IOException e) {
            throw new RuntimeException("Unable to upload image to s3 bucket: " + e.getMessage());
        }
    }

    public void deleteImageFromAwsS3(String s3FileName) {
        try {
            S3Client s3Client = createS3Client();

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3FileName)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            log.info("File deleted successfully: {}", s3FileName);
        } catch (Exception e) {
            log.error("Failed to delete file: {}", s3FileName, e);
            throw new RuntimeException("Unable to delete file: " + e.getMessage());
        }
    }

    private S3Client createS3Client() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
        return S3Client.builder()
                .region(Region.EU_NORTH_1)
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .endpointOverride(URI.create("https://s3.eu-north-1.amazonaws.com"))
                .build();
    }

}
