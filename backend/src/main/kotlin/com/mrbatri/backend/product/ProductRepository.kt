package com.mrbatri.backend.product

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProductRepository : JpaRepository<Product, Long> {
    
    // For the category sidebar: "SELECT * FROM products WHERE category = ?"
    fun findAllByCategory(category: String): List<Product>

    // For the Search Bar: Finds products where the name contains a string (case-insensitive)
    fun findByNameContainingIgnoreCase(name: String): List<Product>
}