package com.mrbatri.backend.auth

import com.mrbatri.backend.user.User
import com.mrbatri.backend.user.UserRepository
import com.mrbatri.backend.user.UserRole
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val jwtService: JwtService,
    private val otpService: OtpService,
    private val userRepository: UserRepository,
) {

    @PostMapping("/send-otp")
    fun requestOtp(@Valid @RequestBody request: LoginRequest): ResponseEntity<String> {
        val code = otpService.generateOtp(request.phone)
        
        // LOGGING THE CODE (Since we don't have an SMS provider yet)
        println("-------------------------------------------")
        println("SMS to ${request.phone}: Your MrBatri OTP is $code")
        println("-------------------------------------------")
        
        return ResponseEntity.ok("OTP sent successfully to ${request.phone}")
    }

    @PostMapping("/verify-otp")
    fun verifyOtp(@Valid @RequestBody request: VerifyRequest): ResponseEntity<Any> {
        val isValid = otpService.validateOtp(request.phone, request.otp)

        if (!isValid) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP code")
        }

        otpService.deleteOtp(request.phone)

        val user = userRepository.findByPhone(request.phone).orElseGet {
            userRepository.save(
                User(
                    phone = request.phone,
                    role = if (request.phone.endsWith("99")) UserRole.ADMIN else UserRole.USER
                )
            )
        }

        // Generate the JWT Token!
        val jwtToken = jwtService.generateToken(user)

        val userDto = UserDto(
            id = user.id,
            phone = user.phone,
            role = user.role.name,
            joinedAt = user.joinedAt.toString()
        )

        // Return both the token and the user data to the frontend
        return ResponseEntity.ok(AuthResponse(token = jwtToken, user = userDto))
    }
}