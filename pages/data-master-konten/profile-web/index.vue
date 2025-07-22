<template>
  <v-form class="profile-form" @submit.prevent="saveProfile">
    <h2 class="mb-4 text-center">Website Profile</h2>
    
    <!-- FOTO ATAS: Banner & Logo -->
    <v-row class="justify-center mb-4">
      <v-col cols="12" md="6" class="text-center">
        <div>
          <img
            v-if="bannerPreview"
            :src="bannerPreview"
            alt="Banner Preview"
            style="height: 200px;  object-fit: cover; border-radius: 12px; border: 2px solid #eee;"
          />
          <div v-else style="height:120px;background:#f7f7f7;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#bbb;">Banner Preview</div>
        </div>
        <v-file-input
          label="Upload Banner"
          accept="image/*"
          show-size
          variant="outlined"
          dense
          clearable
          @change="handleBannerChange"
          class="mt-2"
        />
      </v-col>
      <v-col cols="12" md="6" class="text-center">
        <div>
          <img
            v-if="logoPreview"
            :src="logoPreview"
            alt="Logo Preview"
            style="height: 200px;  object-fit: cover; border-radius: 12px; border: 2px solid #eee;"
          />
          <div v-else style="width:110px;height:110px;background:#f7f7f7;border-radius:16px;display:flex;align-items:center;justify-content:center;color:#bbb;margin:auto;">Logo Preview</div>
        </div>
        <v-file-input
          label="Upload Logo"
          accept="image/*"
          show-size
          variant="outlined"
          dense
          clearable
          @change="handleLogoChange"
          class="mt-2"
        />
      </v-col>
    </v-row>
    
    <!-- FORM 2 KOLOM -->
    <v-row dense>
      <v-col cols="12"  class="mb-3">
        <v-text-field v-model="form.title" label="Title" variant="outlined" dense />
      </v-col>
      <v-col cols="12"  class="mb-3">
        <v-textarea v-model="form.address" label="Alamat" variant="outlined" dense />
      </v-col>
      <v-col cols="12" md="6" class="mb-3">
        <v-text-field v-model="form.whatsapp" label="WhatsApp" variant="outlined" dense />
      </v-col>
      <v-col cols="12" md="6" class="mb-3">
        <v-text-field v-model="form.email" label="Email" variant="outlined" dense type="email" />
      </v-col>
      <v-col cols="12" md="6" class="mb-3">
        <v-text-field v-model="form.social.fb" label="Facebook" variant="outlined" dense />
      </v-col>
      <v-col cols="12" md="6" class="mb-3">
        <v-text-field v-model="form.social.ig" label="Instagram" variant="outlined" dense />
      </v-col>
      <v-col cols="12" md="6" class="mb-3">
        <v-text-field v-model="form.social.youtube" label="Youtube" variant="outlined" dense />
      </v-col>
      <v-col cols="12" md="6" class="mb-3">
        <v-text-field v-model="form.social.wa" label="Whatsapp (Sosmed)" variant="outlined" dense />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="text-center">
        <div>
          <img
            v-if="bannerAboutPreview"
            :src="bannerAboutPreview"
            alt="Banner Tentang Kami"
            style="height: 200px;  object-fit: cover; border-radius: 12px; border: 2px solid #eee;"
          />
          <div v-else style="height:120px;background:#f7f7f7;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#bbb;">Banner Preview</div>
        </div>
        <v-file-input
          label="Upload Banner Tentang Kami"
          accept="image/*"
          show-size
          variant="outlined"
          dense
          clearable
          @change="handleBannerAboutChange"
          class="mt-2"
        />
      </v-col>

      <v-col cols="12" md="6" class="text-center">
        <div>
          <img
            v-if="bannerVisiPreview"
            :src="bannerVisiPreview"
            alt="Banner Visi"
            style="height: 200px;  object-fit: cover; border-radius: 12px; border: 2px solid #eee;"
          />
          <div v-else style="height:120px;background:#f7f7f7;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#bbb;">Banner Preview</div>
        </div>
        <v-file-input
          label="Upload Banner Visi"
          accept="image/*"
          show-size
          variant="outlined"
          dense
          clearable
          @change="handleBannerVisiChange"
          class="mt-2"
        />
      </v-col>


      <v-col cols="12" md="6" class="text-center">
        <div>
          <img
            v-if="bannerMisiPreview"
            :src="bannerMisiPreview"
            alt="Banner Misi"
            style="height: 200px;  object-fit: cover; border-radius: 12px; border: 2px solid #eee;"
          />
          <div v-else style="height:120px;background:#f7f7f7;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#bbb;">Banner Preview</div>
        </div>
        <v-file-input
          label="Upload Banner Misi"
          accept="image/*"
          show-size
          variant="outlined"
          dense
          clearable
          @change="handleBannerMisiChange"
          class="mt-2"
        />
      </v-col>
    </v-row>

    <v-row>
       <v-col cols="12" class="mb-15">
          <label style="font-weight:500;display:block;margin-bottom:4px;">Tentang Kami</label>
          <QuillEditor
              v-model:content="form.tentang_kami"
              contentType="html"
              class="quill-responsive"
              :toolbar="[
                ['bold', 'italic', 'underline', 'strike'],
                [{ header: [1, 2, 3, false] }],
                [{ list: 'ordered'}, { list: 'bullet' }],
                [{ align: [] }],
                ['link', 'image'],
                ['clean']
              ]"
            />
        </v-col>

        <v-col cols="12" class="mb-15">
          <label style="font-weight:500;display:block;margin-bottom:4px;">Komitmen Kami</label>
          <QuillEditor
              v-model:content="form.komitmen_kami"
              contentType="html"
              class="quill-responsive"
              :toolbar="[
                ['bold', 'italic', 'underline', 'strike'],
                [{ header: [1, 2, 3, false] }],
                [{ list: 'ordered'}, { list: 'bullet' }],
                [{ align: [] }],
                ['link', 'image'],
                ['clean']
              ]"
            />
        </v-col>

        <v-col cols="12" class="mb-15">
          <label style="font-weight:500;display:block;margin-bottom:4px;">Visi</label>
          <QuillEditor
              v-model:content="form.visi"
              contentType="html"
              class="quill-responsive"
              :toolbar="[
                ['bold', 'italic', 'underline', 'strike'],
                [{ header: [1, 2, 3, false] }],
                [{ list: 'ordered'}, { list: 'bullet' }],
                [{ align: [] }],
                ['link', 'image'],
                ['clean']
              ]"
            />
        </v-col>

        <v-col cols="12" class="mb-15">
          <label style="font-weight:500;display:block;margin-bottom:4px;">Misi</label>
          <QuillEditor
              v-model:content="form.misi"
              contentType="html"
              class="quill-responsive"
              :toolbar="[
                ['bold', 'italic', 'underline', 'strike'],
                [{ header: [1, 2, 3, false] }],
                [{ list: 'ordered'}, { list: 'bullet' }],
                [{ align: [] }],
                ['link', 'image'],
                ['clean']
              ]"
            />
        </v-col>

        <v-col cols="12" class="text-center">
          <div>
            <!-- Embed YouTube preview -->
            <div v-if="youtubeVideoId">
              <iframe
                :src="`https://www.youtube.com/embed/${youtubeVideoId}`"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                style="width: 100%; max-width: 400px; height: 225px; border-radius: 12px; border: 2px solid #eee;"
              ></iframe>
            </div>
            <div v-else style="height:120px;background:#f7f7f7;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#bbb;">
              YouTube Preview
            </div>
          </div>
          <v-text-field v-model="form.link_youtube" label="Link Youtube" variant="outlined" dense />
        </v-col>
    </v-row>

    <v-btn :loading="loading" :disabled="loading" type="submit" color="primary" class="mt-4" block>Simpan</v-btn>
    <div v-if="successMsg" class="text-success mt-3">{{ successMsg }}</div>
    <div v-if="errorMsg" class="text-error mt-3">{{ errorMsg }}</div>
  </v-form>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'

const { $api } = useNuxtApp()

const form = reactive({
  title: '',
  banner: null,
  banner_about: null,
  banner_visi: null,
  banner_misi: null,
  komitmen_kami: null,
  tentang_kami: null,
  visi: null,
  misi: null,
  logo: null,
  link_youtube: null,
  address: '',
  whatsapp: '',
  email: '',
  social: {
    fb: '',
    ig: '',
    youtube: '',
    wa: ''
  }
})

const bannerPreview = ref(null)
const bannerAboutPreview = ref(null)
const bannerVisiPreview = ref(null)
const bannerMisiPreview = ref(null)
const logoPreview = ref(null)
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')


const youtubeVideoId = computed(() => {
  if (!form.link_youtube) return null
  // Regex for common YouTube URL formats
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = form.link_youtube.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
})

function handleBannerAboutChange(e) {
  let file
  if (Array.isArray(e)) file = e[0]
  else if (e?.target?.files) file = e.target.files[0]
  else file = e

  if (file) {
    form.banner_about = file
    bannerAboutPreview.value = URL.createObjectURL(file)
  } else {
    form.banner_about = null
    bannerAboutPreview.value = null
  }
}


function handleBannerVisiChange(e) {
  let file
  if (Array.isArray(e)) file = e[0]
  else if (e?.target?.files) file = e.target.files[0]
  else file = e

  if (file) {
    form.banner_visi = file
    bannerVisiPreview.value = URL.createObjectURL(file)
  } else {
    form.banner_visi = null
    bannerVisiPreview.value = null
  }
}

function handleBannerMisiChange(e) {
  let file
  if (Array.isArray(e)) file = e[0]
  else if (e?.target?.files) file = e.target.files[0]
  else file = e

  if (file) {
    form.banner_misi = file
    bannerMisiPreview.value = URL.createObjectURL(file)
  } else {
    form.banner_misi = null
    bannerMisiPreview.value = null
  }
}

function handleBannerChange(e) {
  let file
  if (Array.isArray(e)) file = e[0]
  else if (e?.target?.files) file = e.target.files[0]
  else file = e

  if (file) {
    form.banner = file
    bannerPreview.value = URL.createObjectURL(file)
  } else {
    form.banner = null
    bannerPreview.value = null
  }
}

function handleLogoChange(e) {
  let file
  if (Array.isArray(e)) file = e[0]
  else if (e?.target?.files) file = e.target.files[0]
  else file = e

  if (file) {
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
  } else {
    form.logo = null
    logoPreview.value = null
  }
}

async function saveProfile() {
  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('address', form.address)
    formData.append('whatsapp', form.whatsapp)
    formData.append('email', form.email)
    formData.append('social_fb', form.social.fb)
    formData.append('social_ig', form.social.ig)
    formData.append('social_youtube', form.social.youtube)
    formData.append('social_wa', form.social.wa)
    formData.append('komitmen_kami', form.komitmen_kami)
    formData.append('tentang_kami', form.tentang_kami)
    formData.append('visi', form.visi)
    formData.append('misi', form.misi)
    formData.append('link_youtube', youtubeVideoId.value)
    if (form.banner) formData.append('banner', form.banner)
    if (form.logo) formData.append('logo', form.logo)
    if (form.banner_about) formData.append('banner_about', form.banner_about)
    if (form.banner_visi) formData.append('banner_visi', form.banner_visi)
    if (form.banner_misi) formData.append('banner_misi', form.banner_misi)

    const response = await $api.post(`/master-content/web-profile-update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    successMsg.value = response.data.message || 'Profil berhasil diupdate!'
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'Gagal update profil'
  } finally {
    loading.value = false
  }
}

async function getData () {

  loading.value = true
  try {
    const { data } = await  $api.post(`/master-content/web-profile`)
    form.title = data.title || ''
    form.address = data.address || ''
    form.whatsapp = data.whatsapp || ''
    form.email = data.email || ''
    form.social.fb = data.social_fb || ''
    form.social.ig = data.social_ig || ''
    form.social.youtube = data.social_youtube || ''
    form.social.wa = data.social_wa || ''
    form.tentang_kami = data.tentang_kami || ''
    form.komitmen_kami = data.komitmen_kami || ''
    form.visi = data.visi || ''
    form.misi = data.misi || ''
    form.link_youtube = data.link_youtube || ''
    // Set preview (assume you store only the filename and serve it from /uploads/web_profile/)
    bannerPreview.value = data.banner ?? null
    logoPreview.value = data.logo ?? null
    bannerVisiPreview.value = data.banner_visi ?? null
    bannerMisiPreview.value = data.banner_misi ?? null
    bannerAboutPreview.value = data.banner_about ?? null
    form.banner = null // will be replaced if upload new
    form.logo = null
  } catch (e) {
    // It's OK if empty for first setup
  } finally {
    loading.value = false
  }
}

// OPTIONAL: Fetch existing profile for editing (and show image preview)
onMounted(async () => {
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
.mb-4 { margin-bottom: 1.5rem; }
.mt-4 { margin-top: 1.5rem; }
.text-success { color: #28a745 }
.text-error { color: #d32f2f }
</style>
