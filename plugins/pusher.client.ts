// plugins/pusher.client.ts
import Pusher from 'pusher-js'

export default defineNuxtPlugin((nuxtApp) => {
  const pusher = new Pusher('2222bbf0d0069f56342b', {
    cluster: 'ap1',
  })

  nuxtApp.provide('pusher', pusher)
})
