package com.mrbatri.backend.order

import com.mrbatri.backend.user.User
import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "orders")
class Order(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User, 

    @Column(name = "customer_phone", nullable = false)
    var customerPhone: String,

    @Column(name = "full_name")
    var fullName: String? = null,

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    var shippingAddress: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: OrderStatus = OrderStatus.Pending,

    @Column(name = "total_amount", nullable = false)
    var totalAmount: BigDecimal,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL], orphanRemoval = true)
    var items: MutableList<OrderItem> = mutableListOf()
)

enum class OrderStatus {
    Pending, Processing, Shipped, Delivered, Cancelled
}