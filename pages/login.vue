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

              <VCol cols="12">
                <div id="googleBtn" data-width="100%" style="width:100%"></div>

              </VCol>

              <!-- login instead -->
              <VCol
                cols="12"
                class="text-center text-base"
              >
                <span>Belum punya akun ?</span>
                <NuxtLink
                  class="text-primary ms-1"
                  to="/register-ppdb"
                >
                  Daftar Sekarang
                </NuxtLink>
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

<script setup >
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?url'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?url'
import { ref } from 'vue'

const config = useRuntimeConfig()
const { $api,$gAuth } = useNuxtApp()

const form = ref({
  email: '',
  password: '',
  remember: false,
})
const show = ref(false)
const loading = ref(false)
const message = ref('Login failed. Please check your credentials.')

const isPasswordVisible = ref(false)

async function login() {
  loading.value = true
  try {
    const response = await $api.post('/login', {
      email: form.value.email,
      password: form.value.password,
    })
    localStorage.setItem('token', response.data.user.token)
    localStorage.removeItem('redirected')
    navigateTo('/')
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}


async function handleCredentialResponse(response) {
  const idToken = response.credential
  const {data} = await $api.post('/auth/google', {token: idToken})

  localStorage.setItem('token', data.user.token)
  localStorage.removeItem('redirected')
  navigateTo('/')
}


onMounted(() => {
  if (localStorage.getItem('token')) {
    navigateTo('/')
  }
  google.accounts.id.initialize({
    client_id: config.public.GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
  })

  google.accounts.id.renderButton(
    document.getElementById("googleBtn"),
    { theme: "outline", size: "large" }
  )
})

definePageMeta({ layout: 'blank' })

</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

#googleBtn > div {
  width: 100% !important;
  display: flex;
  justify-content: center;
}
</style>
