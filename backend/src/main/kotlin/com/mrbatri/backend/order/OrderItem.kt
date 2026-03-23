package com.mrbatri.backend.order

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name = "order_items")
class OrderItem(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    val order: Order,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var quantity: Int,

    @Column(nullable = false)
    var price: BigDecimal,

    @Column(name = "image_url", nullable = false)
    var imageUrl: String
)