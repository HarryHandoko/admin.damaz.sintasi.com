<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <VImg :src="authV1TopShape" class="text-primary auth-v1-top-shape d-none d-sm-block" />
      <VImg :src="authV1BottomShape" class="text-primary auth-v1-bottom-shape d-none d-sm-block" />

      <VCard class="auth-card" max-width="460" :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'">
        <VCardItem class="justify-center">
          <img src="/favicon.ico" style="width: 150px; height: 150px;" alt="Logo" />
        </VCardItem>
        <VCardItem class="justify-center">
          <h1 class="text-h5 font-weight-bold">
            Isi Data Wali Murid
          </h1>
        </VCardItem>
        <VCardText>
          <VForm @submit.prevent="register">
            <VRow>
              <!-- Nama Depan -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.nama_depan"
                  autofocus
                  label="Nama Depan"
                  placeholder="John"
                  :rules="[v => !!v || 'Nama Depan harus diisi']"
                />
              </VCol>
              <!-- Nama Belakang -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="form.nama_belakang"
                  label="Nama Belakang"
                  placeholder="Doe"
                  :rules="[v => !!v || 'Nama Belakang harus diisi']"
                />
              </VCol>
              <!-- Email -->
              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                  :rules="[
                    v => !!v || 'Email harus diisi',
                    v => /.+@.+\..+/.test(v) || 'Format email tidak valid'
                  ]"
                />
              </VCol>
              <!-- No Handphone -->
              <VCol cols="12">
                <VTextField
                  v-model="form.no_handphone"
                  label="No Handphone"
                  type="number"
                  placeholder="089xxxxxxx"
                  :rules="[v => !!v || 'No Handphone harus diisi']"
                />
              </VCol>
              <!-- Password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Password"
                  autocomplete="password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :rules="[v => !!v || 'Password harus diisi']"
                />
              </VCol>

              <!-- CAPTCHA -->
              <VCol cols="12" class="d-flex align-center mb-0">
                <VImg
                  :src="captchaImage"
                  alt="captcha"
                  height="40"
                  width="10"
                  style="border-radius: 6px; background: #fff; border: 1px solid #eee;"
                  class="mr-2"
                />
                <VBtn icon @click="fetchCaptcha" variant="text" style="margin-left: -6px;">
                  <v-icon>bx-refresh</v-icon>
                </VBtn>
                <VTextField
                  v-model="captchaInput"
                  class="ml-2"
                  label="Kode Captcha"
                  placeholder="Kode Captcha"
                  :rules="[v => !!v || 'Captcha wajib diisi']"
                />
              </VCol>

              <!-- Privacy Policy & Register -->
              <VCol cols="12">
                <div class="d-flex align-center my-6">
                  <VCheckbox
                    id="privacy-policy"
                    v-model="form.privacyPolicies"
                    inline
                  />
                  <VLabel for="privacy-policy" style="opacity: 1;">
                    <span class="me-1 text-high-emphasis">Ya saya setuju dengan </span>
                    <a href="javascript:void(0)" class="text-primary">Syarat & Ketentuan</a>
                  </VLabel>
                </div>
                <VBtn
                  block
                  :disabled="form.privacyPolicies == false ||
                    form.nama_depan == '' ||
                    form.nama_belakang == '' ||
                    form.email == '' ||
                    form.password == '' ||
                    form.no_handphone == '' ||
                    captchaInput == ''"
                  type="submit"
                  :loading="loading"
                >
                  Daftar Sekarang
                </VBtn>
              </VCol>

              <!-- Login instead -->
              <VCol cols="12" class="text-center text-base">
                <span>Sudah punya akun ?</span>
                <NuxtLink class="text-primary ms-1" to="/login">
                  Langsung Login
                </NuxtLink>
              </VCol>

              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- Login dengan Google -->
              <VCol cols="12">
                <div id="googleBtn" data-width="100%" style="width:100%"></div>

              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>

      <v-snackbar v-model="show" :color="color" timeout="3000">
        {{ message }}
      </v-snackbar>
    </div>
  </div>
</template>

<script setup>
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?url';
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?url';
import { onMounted, ref } from 'vue';

const { $api,$gAuth } = useNuxtApp()

const form = ref({
  nama_depan: '',
  nama_belakang: '',
  email: '',
  password: '',
  privacyPolicies: false,
  no_handphone: '',
})

const captchaImage = ref('')
const captchaInput = ref('')
const tokenCaptcha = ref('')

const loading = ref(false);
const isPasswordVisible = ref(false)
const show = ref(false)
const color = ref('error');
const message = ref('')

async function fetchCaptcha() {
  try {
    const { data } = await $api.get('/captcha')
    captchaImage.value = data.image // pastikan backend mengirim { code: "1234" }
    captchaInput.value = ''
    tokenCaptcha.value = data.token
  } catch (error) {
    captchaImage.value = ''
  }
}

const config = useRuntimeConfig()
onMounted(() => {
  fetchCaptcha()

  google.accounts.id.initialize({
    client_id: config.public.GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
  })

  google.accounts.id.renderButton(
    document.getElementById("googleBtn"),
    { theme: "outline", size: "large" }
  )

})

async function register() {
  loading.value = true
  try {
    const payload = {
      ...form.value,
      captcha: captchaInput.value,
      token : tokenCaptcha.value
    }
    const response = await $api.post('/daftar', payload)
    show.value = true
    if (response.data.status !== 'success') {
      color.value = 'error'
      message.value = response.data.message || 'Pendaftaran gagal'
    } else {
      color.value = 'success'
      message.value = response.data.message || 'Pendaftaran berhasil'

      form.value.nama_depan = ''
      form.value.nama_belakang = ''
      form.value.email = ''
      form.value.no_handphone = ''
      captchaInput.value = ''
    }


    fetchCaptcha()
  } catch (error) {
    color.value = 'error'
    message.value = 'Server error. Silakan coba lagi.'
    fetchCaptcha()
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

definePageMeta({ layout: 'blank' })
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
/* Chrome, Safari, Edge, Opera */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

#googleBtn > div {
  width: 100% !important;
  display: flex;
  justify-content: center;
}

</style>
