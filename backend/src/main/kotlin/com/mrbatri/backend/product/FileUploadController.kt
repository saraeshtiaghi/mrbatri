package com.mrbatri.backend.product

import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/upload")
class FileUploadController(
    private val minioService: MinioService
) {
    @PostMapping("/image")
    @PreAuthorize("hasRole('ADMIN')")
    fun uploadImage(@RequestParam("file") file: MultipartFile): ResponseEntity<Map<String, String>> {
        val imageUrl = minioService.uploadImage(file)
        return ResponseEntity.ok(mapOf("imageUrl" to imageUrl))
    }
}