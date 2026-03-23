package com.mrbatri.backend.auth

import com.mrbatri.backend.user.User
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

data class LoginRequest(
    @field:NotBlank
    @field:Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number format")
    val phone: String
)

data class VerifyRequest(
    @field:NotBlank
    val phone: String,

    @field:NotBlank
    val otp: String
)

data class UserDto(
    val id: Long?,
    val phone: String,
    val role: String,
    val joinedAt: String
)

data class AuthResponse(
    val token: String,
    val user: UserDto
)