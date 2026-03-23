package com.mrbatri.backend.product

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "products")
class Product(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var price: BigDecimal,

    @Column(nullable = false)
    var category: String,

    @Column(name = "image_url", nullable = false)
    var imageUrl: String,

    @Column(columnDefinition = "TEXT", nullable = false)
    var description: String,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)