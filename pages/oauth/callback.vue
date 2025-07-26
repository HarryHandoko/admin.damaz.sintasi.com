<script setup>
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
if (process.client) {
  const token = route.query.token
  if (token) {
    localStorage.setItem('token', token)
    router.push('/')
  } else {
    router.push('/login?error=oauth')
  }
}
</script>
<template>
  <div>Login/Registrasi dengan Google...</div>
</template>
