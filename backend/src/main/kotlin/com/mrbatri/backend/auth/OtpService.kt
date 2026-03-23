package com.mrbatri.backend.auth

import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit
import kotlin.random.Random

@Service
class OtpService(private val redisTemplate: StringRedisTemplate) {

    private val otpPrefix = "OTP:"

    fun generateOtp(phone: String): String {
        // 1. Generate a random 5-digit code
        val code = (10000..99999).random().toString()

        // 2. Save to Redis with the phone as the key
        // We set it to expire in 2 minutes (120 seconds)
        redisTemplate.opsForValue().set(
            otpPrefix + phone,
            code,
            2,
            TimeUnit.MINUTES
        )

        return code
    }

    fun validateOtp(phone: String, inputCode: String): Boolean {
        val savedCode = redisTemplate.opsForValue().get(otpPrefix + phone)
        return savedCode != null && savedCode == inputCode
    }

    fun deleteOtp(phone: String) {
        redisTemplate.delete(otpPrefix + phone)
    }
}