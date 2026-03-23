package com.mrbatri.backend.order

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty

data class CreateOrderRequest(
    @field:NotBlank val phone: String,
    @field:NotBlank val fullName: String,
    @field:NotBlank val address: String,
    @field:NotEmpty val items: List<OrderItemRequest>
)

data class OrderItemRequest(
    val productId: Long,
    val quantity: Int
)

data class UpdateOrderStatusRequest(
    val status: OrderStatus
)