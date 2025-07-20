<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VImg
        :src="authV1TopShape"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VImg
        :src="authV1BottomShape"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <img src="/favicon.ico" style="width: 150px; height: 150px;" alt="Logo" />
        </VCardItem>

        <VCardText>
          <h4 class="text-h4 mb-1 text-center">
            Selamat Datang! 👋🏻
          </h4>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="login">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  :id="useId()"
                  v-model="form.email"
                  autofocus
                  label="Email or Username"
                  type="email"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  :id="useId()"
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <!-- remember me checkbox -->
                <div class="d-flex align-center justify-space-between flex-wrap my-6">
                  <VCheckbox
                    :id="useId()"
                    v-model="form.remember"
                    label="Remember me"
                  />

                  <a
                    class="text-primary"
                    href="javascript:void(0)"
                  >
                    Forgot Password?
                  </a>
                </div>

                <!-- login button -->
                <VBtn
                  block
                  type="submit"
                  :loading="loading"
                >
                  Login
                </VBtn>
              </VCol>

              
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>

    <v-snackbar v-model="show" color="error" timeout="3000">
      {{ message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?url'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?url'
import { ref } from 'vue'

const { $api } = useNuxtApp()

const form = ref({
  email: '',
  password: '',
  remember: false,
})
const show = ref(false)
const loading = ref(false)
const message = ref('Login failed. Please check your credentials.')

const isPasswordVisible = ref(false)

definePageMeta({ layout: 'blank' })


async function login() {
  loading.value = true
  try {
    const response = await $api.post('/login', {
      email: form.value.email,
      password: form.value.password,
    })
    localStorage.setItem('token', response.data.user.token)
    navigateTo('/')
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  if (localStorage.getItem('token')) {
    navigateTo('/')
  }
})
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
