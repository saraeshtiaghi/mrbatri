package com.mrbatri.backend.order

import com.mrbatri.backend.product.ProductRepository
import com.mrbatri.backend.user.UserRepository
import com.mrbatri.backend.user.UserRole
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.util.UUID

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val orderRepository: OrderRepository,
    private val userRepository: UserRepository,
    private val productRepository: ProductRepository // <-- Add this!
) {

    @PostMapping
    @Transactional
    fun createOrder(
        @RequestBody request: CreateOrderRequest,
        authentication: Authentication
    ): ResponseEntity<Any> {

        val userPhone = authentication.name
        val user = userRepository.findByPhone(userPhone).orElse(null)
            ?: return ResponseEntity.badRequest().body("User not found")

        // 1. Initialize the order framework
        val newOrder = Order(
            user = user,
            customerPhone = request.phone,
            fullName = request.fullName,
            shippingAddress = request.address,
            totalAmount = BigDecimal.ZERO // We will calculate this below
        )

        var calculatedTotal = BigDecimal.ZERO
        val orderItems = mutableListOf<OrderItem>()

        // 2. Iterate through the requested items securely
        for (itemRequest in request.items) {
            // Fetch the REAL product from the database
            val product = productRepository.findById(itemRequest.productId).orElse(null)

            if (product == null) {
                return ResponseEntity.badRequest().body("Product ID ${itemRequest.productId} not found.")
            }

            // Stock check
            if (product.stock < itemRequest.quantity) {
                return ResponseEntity.badRequest()
                    .body("Not enough stock for '${product.name}'. Available: ${product.stock}, requested: ${itemRequest.quantity}.")
            }

            // Deduct stock
            product.stock -= itemRequest.quantity
            productRepository.save(product)

            // Calculate exact math on the server
            val itemTotal = product.price.multiply(BigDecimal(itemRequest.quantity))
            calculatedTotal = calculatedTotal.add(itemTotal)

            // Build the OrderItem using verified database data
            orderItems.add(
                OrderItem(
                    order = newOrder,
                    name = product.name,
                    quantity = itemRequest.quantity,
                    price = product.price, // Real price
                    imageUrl = product.imageUrl // Real image URL
                )
            )
        }

        // 3. Attach the secure data to the order
        newOrder.totalAmount = calculatedTotal
        newOrder.items = orderItems

        // 4. Save everything in one transaction
        val savedOrder = orderRepository.save(newOrder)

        return ResponseEntity.ok(savedOrder)
    }

    // 2. GET ORDERS (For 'My Orders' AND 'Admin Dashboard')
    @GetMapping
    fun getOrders(authentication: Authentication): ResponseEntity<List<Order>> {
        val userPhone = authentication.name
        val user = userRepository.findByPhone(userPhone).get()

        // If it's an admin, return ALL orders. If a user, return ONLY their orders.
        val orders = if (user.role == UserRole.ADMIN) {
            orderRepository.findAll()
        } else {
            orderRepository.findAllByCustomerPhoneOrderByCreatedAtDesc(userPhone)
        }

        return ResponseEntity.ok(orders)
    }

    // 3. UPDATE ORDER STATUS (Admin Only)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    fun updateOrderStatus(
        @PathVariable id: UUID,
        @RequestBody request: UpdateOrderStatusRequest
    ): ResponseEntity<Any> {
        val order = orderRepository.findById(id).orElse(null)
            ?: return ResponseEntity.notFound().build()

        order.status = request.status
        val updatedOrder = orderRepository.save(order)

        return ResponseEntity.ok(updatedOrder)
    }
}