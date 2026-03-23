package com.mrbatri.backend.auth

import com.mrbatri.backend.user.UserRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userRepository: UserRepository
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")
        
        // If no token, move along (it might be a public route like /api/products)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        val jwt = authHeader.substring(7)
        val userPhone = jwtService.extractUsername(jwt)

        // If we found a phone in the token, but they aren't currently authenticated in this request context
        if (userPhone != null && SecurityContextHolder.getContext().authentication == null) {
            val user = userRepository.findByPhone(userPhone).orElse(null)

            if (user != null && jwtService.isTokenValid(jwt, user)) {
                val authToken = UsernamePasswordAuthenticationToken(user, null, user.authorities)
                authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                // Officially log them in for this specific request
                SecurityContextHolder.getContext().authentication = authToken
            }
        }
        filterChain.doFilter(request, response)
    }
}