<template>
  <v-form class="profile-form" @submit.prevent="submitForm">
    <h2 class="mb-4 text-center">
      Whatsapp Setting
    </h2>
    <!-- FORM 2 KOLOM -->
    <v-row dense>
      <v-col cols="12"  class="mb-3">
        <v-text-field v-model="form.api_key" label="Api Key" type="password" variant="outlined" dense :rules="[v => !!v || 'Api Key is required']" />
      </v-col>
      <v-col cols="12"  class="mb-3">
        <v-text-field v-model="form.phone_number" label="No HP" variant="outlined" dense type="number" :rules="[v => !!v || 'No HP is required']" />
      </v-col>
    </v-row>

    <v-btn :loading="loading" :disabled="loading" type="submit" color="primary" class="mt-4" block>Simpan</v-btn>
    <div v-if="successMsg" class="text-success mt-3">{{ successMsg }}</div>
    <div v-if="errorMsg" class="text-error mt-3">{{ errorMsg }}</div>
  </v-form>
</template>

<script setup>
const { $api } = useNuxtApp()

const successMsg = ref('')
const errorMsg = ref('')
const loading = ref(false)

const form = reactive({
  api_key: '',
  phone_number: ''
})

async function getData() {
  try {
    const { data } = await $api.get('/whatsapp-setting/get')
    form.api_key = data.api_key || ''
    form.phone_number = data.phone_number || ''
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const submitForm = async () => {
  successMsg.value = ''
  errorMsg.value = ''
  loading.value = true
  try {
    await $api.post('/whatsapp-setting/post', form)
    successMsg.value = 'Settings updated successfully!'
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'An error occurred while updating settings.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getData()
})
</script>

<style scoped>
.profile-form {
  background: #fff;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem 1.7rem;
  box-shadow: 0 6px 36px rgba(35,40,105,.09);
  margin: 2rem auto;
  max-width: 1080px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
