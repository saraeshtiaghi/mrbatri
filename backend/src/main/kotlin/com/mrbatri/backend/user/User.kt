package com.mrbatri.backend.user

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true, nullable = false)
    val phone: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: UserRole = UserRole.USER,

    @Column(name = "joined_at", nullable = false, updatable = false)
    val joinedAt: LocalDateTime = LocalDateTime.now()
)

enum class UserRole {
    USER, ADMIN
}