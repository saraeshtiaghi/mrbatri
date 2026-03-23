package com.mrbatri.backend.order

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface OrderRepository : JpaRepository<Order, UUID> {
    
    // For the Admin Dashboard: Filter orders by their status (Pending, Shipped, etc.)
    fun findAllByStatus(status: OrderStatus): List<Order>

    // For the User Profile: See all orders belonging to one specific phone number
    fun findAllByCustomerPhoneOrderByCreatedAtDesc(phone: String): List<Order>
}