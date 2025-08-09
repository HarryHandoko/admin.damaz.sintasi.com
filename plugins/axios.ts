import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  // Create axios instance with your baseURL
  const api = axios.create({
    // baseURL: 'https://rest-damaz.sintasi.com/api', // <-- set your baseURL here
    baseURL: 'http://localhost:3333/api', // <-- set your baseURL here
    headers: {
      // Common headers (optional)
      'x-api-key': 'YEHTtRk0CK3meHvnWWwhzbbG1UVbflUh'
    }
  })
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  api.interceptors.response.use(
    response => response,
    error => {
      if (
        error.response &&
        error.response.status === 401 &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register-ppdb' &&
       (!localStorage.getItem('token') || localStorage.getItem('token') == null)
      ) {
        localStorage.setItem('redirected', 'true')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )


  // Example fetch on plugin init
  api.get('/users')
    .then(() => {
      // Success, do nothing or handle as needed
    })
    .catch(() => {
      // Error handled by interceptor
    })
  // Provide this instance globally as $api
  nuxtApp.provide('api', api)
})
