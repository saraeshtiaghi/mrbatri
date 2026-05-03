package com.mrbatri.backend.product

import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.net.URI

@RestController
@RequestMapping("/api/products")
class ProductController(
    private val productRepository: ProductRepository
) {

    // --- PUBLIC ROUTES (Anyone can view products) ---

    @GetMapping
    fun getAllProducts(): ResponseEntity<List<Product>> {
        return ResponseEntity.ok(productRepository.findAll())
    }

    @GetMapping("/{id}")
    fun getProductById(@PathVariable id: Long): ResponseEntity<Product> {
        return productRepository.findById(id)
            .map { ResponseEntity.ok(it) }
            .orElse(ResponseEntity.notFound().build())
    }

    // --- ADMIN ROUTES (Protected) ---

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun createProduct(@RequestBody product: Product): ResponseEntity<Product> {
        val savedProduct = productRepository.save(product)
        return ResponseEntity
            .created(URI.create("/api/products/${savedProduct.id}"))
            .body(savedProduct)
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun updateProduct(
        @PathVariable id: Long,
        @RequestBody updatedProduct: Product
    ): ResponseEntity<Product> {
        return productRepository.findById(id).map { existingProduct ->
            existingProduct.name = updatedProduct.name
            existingProduct.price = updatedProduct.price
            existingProduct.category = updatedProduct.category
            existingProduct.imageUrl = updatedProduct.imageUrl
            existingProduct.description = updatedProduct.description
            existingProduct.stock = updatedProduct.stock

            val saved = productRepository.save(existingProduct)
            ResponseEntity.ok(saved)
        }.orElse(ResponseEntity.notFound().build())
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteProduct(@PathVariable id: Long): ResponseEntity<Void> {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build()
        }
        productRepository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}