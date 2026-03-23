package com.mrbatri.backend.user

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UserRepository : JpaRepository<User, Long> {
    // Spring magic: This automatically generates "SELECT * FROM users WHERE phone = ?"
    fun findByPhone(phone: String): Optional<User>
    
    // Check if a user exists before trying to create one
    fun existsByPhone(phone: String): Boolean
}