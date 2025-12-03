<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <!-- Tabs Header -->
        <VTabs v-model="activeTab" background-color="primary" dark>
          <VTab value="profile">Profil</VTab>
          <VTab value="password">Ganti Password</VTab>
        </VTabs>

        <VDivider />

        <!-- Tabs Content -->
        <VWindow v-model="activeTab">
          <!-- === TAB PROFILE === -->
          <VWindowItem value="profile">
            <VCardText>
              <div class="text-center mb-6">
                <VAvatar size="120">
                  <VImg
                    :src="fotoPreview"
                    alt="Foto Profil"
                  />
                </VAvatar>
                <v-file-input
                  label="Upload Foto"
                  accept="image/*"
                  prepend-icon="bx-camera"
                  @change="handleFotoChange"
                  class="mt-4"
                  hide-details
                  style="max-width: 300px; margin: auto;"
                />
              </div>

              <VForm class="mt-4">
                <VRow>
                  <VCol md="6" cols="12">
                    <VTextField
                      v-model="dataAccount.nama_depan"
                      label="Nama Depan"
                      placeholder="John"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol md="6" cols="12">
                    <VTextField
                      v-model="dataAccount.nama_belakang"
                      label="Nama Belakang"
                      placeholder="Doe"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol md="6" cols="12">
                    <VTextField
                      v-model="dataAccount.email"
                      label="E-mail"
                      placeholder="johndoe@gmail.com"
                      type="email"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol md="6" cols="12">
                    <VTextField
                      v-model="dataAccount.no_handphone"
                      label="No Handphone"
                      placeholder="+62 812 3456 7890"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol cols="12" class="d-flex gap-3 mt-4">
                    <VBtn color="primary" @click="saveProfile">Simpan</VBtn>
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VWindowItem>

          <!-- === TAB GANTI PASSWORD === -->
          <VWindowItem value="password">
            <VCardText>
              <VForm>
              
                <v-row>
                  <v-col cols="6">
                    <VRow>
                      <VCol cols="12">
                        <VTextField
                          v-model="passwordForm.current_password"
                          label="Password Lama"
                          type="password"
                          variant="outlined"
                        />
                      </VCol>
                      <VCol cols="12">
                        <VTextField
                          v-model="passwordForm.new_password"
                          label="Password Baru"
                          type="password"
                          variant="outlined"
                        />
                      </VCol>
                      <VCol cols="12">
                        <VTextField
                          v-model="passwordForm.confirm_password"
                          label="Konfirmasi Password"
                          type="password"
                          variant="outlined"
                        />
                      </VCol>

                      <VCol cols="12" class="d-flex gap-3 mt-4">
                        <VBtn color="primary" @click="changePassword">Simpan Password</VBtn>
                      </VCol>
                    </VRow>
                  </v-col>
                    
                  <v-col cols="12" md="6"></v-col>
                </v-row>
              </VForm>
            </VCardText>
          </VWindowItem>
        </VWindow>
      </VCard>

    <!-- Snackbar error -->
    <v-snackbar v-model="show" color="error" timeout="3000">
      {{ message }}
    </v-snackbar>


    <!-- Snackbar Success -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000">
      {{ messageSuccess }}
    </v-snackbar>
    </VCol>
  </VRow>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const { $api } = useNuxtApp()

// State
const activeTab = ref('profile')
const show = ref(false)
const showSuccess = ref(false)
const messageSuccess = ref('')
const message = ref('')
const dataAccount = ref({
  nama_depan: '',
  nama_belakang: '',
  email: '',
  no_handphone: '',
  foto_profile: '/no-image.jpg',
})
const fotoPreview = ref('/no-image.jpg')

const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

// Fetch Data User
async function fetchUser() {
  try {
    const { data } = await $api.get('/users')
    dataAccount.value = data
    fotoPreview.value = data.foto_profile || '/no-image.jpg'
  } catch (error) {
    console.error(error)
  }
}

// Foto Change
function handleFotoChange(e) {
  let file = Array.isArray(e) ? e[0] : e?.target?.files?.[0] || e
  if (file) {
    dataAccount.value.foto_profile = file
    fotoPreview.value = URL.createObjectURL(file)
  } else {
    dataAccount.value.foto_profile = null
    fotoPreview.value = '/no-image.jpg'
  }
}

// Save Profile
async function saveProfile() {
  try {
    const formData = new FormData()
    for (const key in dataAccount.value) {
      // If foto_profile is a File, append as file, else as string
      if (key === 'foto_profile' && dataAccount.value[key] instanceof File) {
        formData.append(key, dataAccount.value[key])
      } else {
        formData.append(key, dataAccount.value[key])
      }
    }
    const response = await $api.post('/users/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    showSuccess.value = true
    messageSuccess.value = response.data.message
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message
  }
}




// Change Password
async function changePassword() {
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    show.value = true
    message.value = 'Password baru dan konfirmasi tidak sama! '
    return
  }

  try {
    const response = await $api.post('/users/change-password', {
      old_password: passwordForm.value.current_password,
      new_password: passwordForm.value.new_password,
      confirm_password: passwordForm.value.confirm_password
    })
    showSuccess.value = true
    messageSuccess.value = response.data.message
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message
  }
}

// Reset Password Form
function resetPasswordForm() {
  passwordForm.value = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  }
}

onMounted(fetchUser)
</script>
