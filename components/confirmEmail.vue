<template>
  <div class="min-h-screen flex items-center justify-center bg-white pa-4">
    <div class="w-full max-w-md bg-white relative">
      <!-- Loading Overlay -->
      <v-overlay :model-value="loading" class="z-50 d-flex align-center justify-center" persistent>
        <v-progress-circular indeterminate color="primary" size="48" />
      </v-overlay>

      <!-- Card -->
      <div class="shadow-lg rounded-xl pa-6 border border-gray-200 text-center bg-white">
        <div class="mb-6 text-center">
          <h2 class="text-2xl font-bold mb-2">Verifikasi Email</h2>
          <p class="text-gray-600 text-sm">
            Kode OTP telah dikirim ke email <strong>{{ data.email }}</strong>.<br />
            Silakan masukkan 6 digit kode di bawah ini.
          </p>
        </div>

        <!-- OTP Input -->
        <div class="grid grid-cols-6 gap-2 text-center mb-4">
          <input
            v-for="(digit, index) in otpDigits"
            :key="index"
            :ref="el => otpInputRefs[index] = el"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="1"
            class="border rounded text-center text-xl py-2 w-12 ma-2 focus:outline-none"
            v-model="otpDigits[index]"
            @input="handleInput(index)"
            @keydown.backspace="handleBackspace(index, $event)"
          />
        </div>

        <!-- Resend -->
        <p class="text-center text-sm text-gray-500 mt-4">
          Tidak menerima email?
          <button
            class="text-primary underline"
            @click="resendOtp"
            :disabled="resending"
          >
            {{ resending ? 'Mengirim ulang...' : 'Kirim ulang kode' }}
          </button>
        </p>
      </div>
    </div>
  </div>

  <!-- Snackbar error -->
  <v-snackbar v-model="show" color="error" timeout="3000">
    {{ message }}
  </v-snackbar>

  <!-- Snackbar Sucess -->
  <v-snackbar v-model="showSuccess" color="success" timeout="3000">
    {{ message }}
  </v-snackbar>
</template>


<script setup>
import { useNuxtApp } from '#app'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const { $api } = useNuxtApp()

const props = defineProps({
  data: {
    type: String,
    required: true
  }
})

const otpDigits = ref(Array(6).fill(''))
const otpInputRefs = ref([])
const loading = ref(false)
const resending = ref(false)
const show = ref(false);
const showSuccess = ref(false);
const message = ref(null);

const router = useRouter()

const handleInput = (index) => {
  const val = otpDigits.value[index]
  if (index < 5) {
    otpInputRefs.value[index + 1]?.focus()
  }
  if(index === 5){
    submitOTP()
  }
}

const handleBackspace = (index, event) => {
  if (event.key !== 'Backspace') return

  if (otpDigits.value[index] === '' && index > 0) {
    otpInputRefs.value[index - 1]?.focus()
    otpDigits.value[index - 1] = ''
  }
}


const submitOTP = async () => {
  const otp = otpDigits.value.join('')

  loading.value = true
  try {
    await $api.post('/verifikasi/verify-email', {
      otp : otp
    })
    showSuccess.value = true;
    message.value = 'Email berhasil di verifikasi.';
    window.location.reload()
  } catch (err) {
    show.value = true;
    message.value = 'Gagal mengverifikasi.';
  } finally {
    loading.value = false
  }
}

const resendOtp = async () => {
  resending.value = true
  try {
    await $api.post('/verifikasi/resend-otp', { email: props.data })
    showSuccess.value = true;
    message.value = 'OTP sudah dikirimkan keemail.';
  } catch (err) {
  } finally {
    resending.value = false
  }
}
</script>

<style scoped>
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 5px;
}
input {
  width: 3rem;
  height: 3rem;
  font-size: 1.25rem;
  border: 1px solid #ccc;
}
</style>
