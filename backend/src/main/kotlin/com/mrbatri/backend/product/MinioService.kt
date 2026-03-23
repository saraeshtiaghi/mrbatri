package com.mrbatri.backend.product

import io.minio.BucketExistsArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import io.minio.PutObjectArgs
import io.minio.SetBucketPolicyArgs
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@Service
class MinioService(
    private val minioClient: MinioClient,
    @Value("\${minio.url}") private val minioUrl: String,
    @Value("\${minio.bucket-name}") private val bucketName: String
) {
    fun uploadImage(file: MultipartFile): String {
        // 1. Ensure bucket exists
        val bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())
        if (!bucketExists) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build())
            makeBucketPublic() // Ensure images can be read by the Next.js frontend
        }

        // 2. Generate a unique filename (e.g., 123e4567-e89b-12d3-a456-426614174000.webp)
        val extension = file.originalFilename?.substringAfterLast(".", "jpg")
        val fileName = "${UUID.randomUUID()}.$extension"

        // 3. Upload the file to MinIO
        minioClient.putObject(
            PutObjectArgs.builder()
                .bucket(bucketName)
                .`object`(fileName)
                .stream(file.inputStream, file.size, -1)
                .contentType(file.contentType)
                .build()
        )

        // 4. Return the public URL
        return "$minioUrl/$bucketName/$fileName"
    }

    // Makes the bucket readable so your Next.js <Image> tags don't get 403 Forbidden errors
    private fun makeBucketPublic() {
        val policy = """
            {
              "Statement": [
                {
                  "Action": ["s3:GetObject"],
                  "Effect": "Allow",
                  "Principal": "*",
                  "Resource": ["arn:aws:s3:::$bucketName/*"]
                }
              ],
              "Version": "2012-10-17"
            }
        """.trimIndent()
        minioClient.setBucketPolicy(SetBucketPolicyArgs.builder().bucket(bucketName).config(policy).build())
    }
}