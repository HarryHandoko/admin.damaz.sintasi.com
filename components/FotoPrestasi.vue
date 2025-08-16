<template>
  <VCard class="pa-6 rounded-xl elevation-2">
    <VCardTitle class="text-h4 font-weight-bold mb-4">
      Foto Background Prestasi
    </VCardTitle>

    <VForm>
      <VRow dense>
        <!-- Prestasi Siswa -->
        <VCol cols="12" md="6">
          <VCard outlined class="pa-4 rounded-lg hover:elevation-4 transition-all">
            <VCardTitle class="text-subtitle-1 mb-2 text-center">Prestasi Siswa</VCardTitle>
            
            <!-- Preview Image (default + uploaded) -->
            <div class="d-flex align-center justify-center mb-3" style="min-height:180px">
              <VImg
                :src="fotoPreview.siswa"
                max-width="200"
                class="rounded-lg shadow"
                cover
              />
            </div>

            <!-- File Upload -->
            <VFileInput
              v-model="fotoSiswa"
              accept="image/*"
              prepend-icon="mdi-upload"
              variant="outlined"
              density="comfortable"
              @change="handleFotoChange($event, 'image_prestasi_siswa', 'siswa')"
              label="Upload Foto Siswa"
            />
          </VCard>
        </VCol>

        <!-- Prestasi Guru -->
        <VCol cols="12" md="6">
          <VCard outlined class="pa-4 rounded-lg hover:elevation-4 transition-all">
            <VCardTitle class="text-subtitle-1 mb-2 text-center">Prestasi Guru</VCardTitle>

            <div class="d-flex align-center justify-center mb-3" style="min-height:180px">
              <VImg
                :src="fotoPreview.guru"
                max-width="200"
                class="rounded-lg shadow"
                cover
              />
            </div>

            <VFileInput
              v-model="fotoGuru"
              accept="image/*"
              prepend-icon="mdi-upload"
              variant="outlined"
              density="comfortable"
              @change="handleFotoChange($event, 'image_prestasi_guru', 'guru')"
              label="Upload Foto Guru"
            />
          </VCard>
        </VCol>

        <!-- Prestasi Sekolah -->
        <VCol cols="12" md="6">
          <VCard outlined class="pa-4 rounded-lg hover:elevation-4 transition-all">
            <VCardTitle class="text-subtitle-1 mb-2 text-center">Prestasi Sekolah</VCardTitle>

            <div class="d-flex align-center justify-center mb-3" style="min-height:180px">
              <VImg
                :src="fotoPreview.sekolah"
                max-width="200"
                class="rounded-lg shadow"
                cover
              />
            </div>

            <VFileInput
              v-model="fotoSekolah"
              accept="image/*"
              prepend-icon="mdi-upload"
              variant="outlined"
              density="comfortable"
              @change="handleFotoChange($event, 'image_prestasi_sekolah', 'sekolah')"
              label="Upload Foto Sekolah"
            />
          </VCard>
        </VCol>

        <!-- Prestasi Kepala Sekolah -->
        <VCol cols="12" md="6">
          <VCard outlined class="pa-4 rounded-lg hover:elevation-4 transition-all">
            <VCardTitle class="text-subtitle-1 mb-2 text-center">Prestasi Kepala Sekolah</VCardTitle>

            <div class="d-flex align-center justify-center mb-3" style="min-height:180px">
              <VImg
                :src="fotoPreview.kepala_sekolah"
                max-width="200"
                class="rounded-lg shadow"
                cover
              />
            </div>

            <VFileInput
              v-model="fotoKepala"
              accept="image/*"
              prepend-icon="mdi-upload"
              variant="outlined"
              density="comfortable"
              @change="handleFotoChange($event, 'image_prestasi_kepala_sekolah', 'kepala_sekolah')"
              label="Upload Foto Kepala Sekolah"
            />
          </VCard>
        </VCol>
      </VRow>

      <!-- Submit -->
      <div class="mt-6 text-center">
        <VBtn color="primary" size="large" rounded="xl" elevation="2" @click="handleCreateData" :loading="loading">
          Simpan Semua
        </VBtn>
      </div>
    </VForm>


    <!-- Snackbar error -->
    <v-snackbar v-model="show" color="error" timeout="3000">
      {{ message }}
    </v-snackbar>


    <!-- Snackbar success -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000">
      {{ messageSuccess }}
    </v-snackbar>
  </VCard>
</template>
<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router"
const route = useRoute()

const { $api } = useNuxtApp()
const loading = ref(false)
const show = ref(false)
const message = ref("")
const showSuccess = ref(false)
const messageSuccess = ref("")
const form = ref({
  image_prestasi_siswa: null,
  image_prestasi_guru: null,
  image_prestasi_sekolah: null,
  image_prestasi_kepala_sekolah: null,
})

const fotoPreview = ref({
  siswa: "/no-image.jpg",
  guru: "/no-image.jpg",
  sekolah: "/no-image.jpg",
  kepala_sekolah: "/no-image.jpg",
})

const defaultImage = "/no-image.jpg"

// reusable handler
function handleFotoChange(e, field, key) {
  let file
  if (Array.isArray(e)) file = e[0]
  else if (e?.target?.files) file = e.target.files[0]
  else file = e

  if (file) {
    form.value[field] = file
    fotoPreview.value[key] = URL.createObjectURL(file)
  } else {
    form.value[field] = null
    fotoPreview.value[key] = defaultImage
  }
}


async function getData() {
  loading.value = true
  try {
    const response = await $api.post('/master-content/background-prestasi-unit/get', {
      sekolah_id : route.query.id
    })
    const data = response.data.data[0]
    if (data) {
      fotoPreview.value.siswa = data.image_prestasi_siswa != null ? data.image_prestasi_siswa  :defaultImage
      fotoPreview.value.guru = data.image_prestasi_guru != null ? data.image_prestasi_guru  :defaultImage
      fotoPreview.value.sekolah = data.image_prestasi_sekolah != null ? data.image_prestasi_sekolah  :defaultImage
      fotoPreview.value.kepala_sekolah = data.image_prestasi_kepala_sekolah != null ? data.image_prestasi_kepala_sekolah  :defaultImage
    } else {
      fotoPreview.value.siswa = defaultImage
      fotoPreview.value.guru = defaultImage
      fotoPreview.value.sekolah = defaultImage
      fotoPreview.value.kepala_sekolah = defaultImage
    }
  } catch (error) {
    show.value = true
    message.value = error
  } finally {
    loading.value = false
  }
}


async function handleCreateData() {
  loading.value = true
  try {
    // Buat FormData
    const formData = new FormData()
    for (const key in form.value) {
      if (form.value[key] !== null && form.value[key] !== undefined) {
        formData.append(key, form.value[key])
      }
    }

    formData.append('sekolah_id', route.query.id)
    await $api.post('/master-content/background-prestasi-unit/post', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    showSuccess.value = true
    messageSuccess.value = 'Background berhasil di perbarui.'
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal memperbarui background.'
  } finally {
    loading.value = false
    getData()
  }
}

onMounted(() => {
  getData()
})
</script>


