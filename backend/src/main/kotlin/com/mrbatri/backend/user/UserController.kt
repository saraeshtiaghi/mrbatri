package com.mrbatri.backend.user

import com.mrbatri.backend.auth.UserDto
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userRepository: UserRepository
) {
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Only admins can see the user list!
    fun getAllUsers(): ResponseEntity<List<UserDto>> {
        val users = userRepository.findAll().map { user ->
            UserDto(
                id = user.id,
                phone = user.phone,
                role = user.role.name,
                joinedAt = user.joinedAt.toString()
            )
        }
        return ResponseEntity.ok(users)
    }
}