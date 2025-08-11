<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2>Prestasi - {{ namaSekolah }}</h2>
    </v-card-title>
    <!-- Search & Add -->
    <v-row class="mb-2 pa-4">
      <v-col cols="12" sm="12" md="6">
        <v-text-field
          v-model="filter.search"
          label="Cari"
          placeholder="Cari Galeri"
          @keyup.enter="getData"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <v-btn
          color="primary"
          class="float-end"
          @click="showModalDialog(null)"
        >
          <v-icon left>bx bx-plus</v-icon>
          Tambah Prestasi
        </v-btn>
      </v-col>
    </v-row>

    <!-- Dialog tambah/edit Prestasi -->
    <v-dialog v-model="showCreateModal" max-width="600" persistent>
      <v-card>
        <v-card-title class="pa-6 text-center">
          <span class="headline">Form Prestasi</span>
        </v-card-title>
        <v-form v-model="valid" @submit.prevent="handleCreateData" ref="formRef">
          <v-card-text style="margin-top: -30px;">
            <v-row dense>
              <v-col cols="12" sm="12">
                <div v-if="fotoPreview" class="mt-2 text-center">
                  <img
                    :src="fotoPreview"
                    alt="Preview Foto"
                    style="width: 120px; height: 120px; object-fit: cover; border-radius: 50%; border: 2px solid #eee;"
                  />
                </div>
                <v-file-input
                  label="Upload Foto"
                  accept="image/*"
                  show-size
                  @change="handleFotoChange"
                  class="mb-2"
                />
              </v-col>
              <v-col cols="12" >
                <v-text-field
                  v-model="form.name"
                  label="Prestasi"
                  :rules="[v => !!v || 'Prestasi Harus diisi']"
                  required
                  class="mb-2"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-grey" variant="text" @click="showCreateModal = false">Batal</v-btn>
            <v-btn color="primary" variant="flat" :disabled="!valid || loading" type="submit" :loading="loading">
              Simpan
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Dialog Foto Besar -->
    <v-dialog v-model="showFotoDialog" max-width="600px">
      <v-card>
        <v-img
          :src="selectedFoto"
          height="400px"
          contain
          style="object-fit:contain;"
        />
      </v-card>
    </v-dialog>

    <!-- Snackbar error -->
    <v-snackbar v-model="show" color="error" timeout="3000">
      {{ message }}
    </v-snackbar>

    <!-- Dialog konfirmasi hapus -->
    <ConfirmDialog
      :modelValue="showConfirmDelete"
      title="Konfirmasi Hapus"
      :message="`Apakah Anda yakin ingin menghapus Data ${DataToDelete?.title}?`"
      @confirm="handleDeleteData"
      @cancel="showConfirmDelete = false"
    />
  </v-card>


  <v-row v-if="loading" justify="center" align="center" class="my-12">
    <v-col cols="12" class="text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="5"
      />
      <div class="mt-2">Memuat data...</div>
    </v-col>
  </v-row>


  <!-- Card List -->
  <v-row class="mt-4" v-if="!loading && items.length">
    <v-col
      v-for="(item, idx) in items"
      :key="item.id"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <v-card class="mb-4" elevation="2">
        <v-img
          :src="item.image ? item.image : '/no-image.jpg'"
          alt="Galeri Image"
          height="180px"
          cover
          style="cursor: pointer;"
          @click="openFotoDialog(item.image)"
        />
        <v-card-title>
          <span v-if="editingRow === 'name'+item.id">
            <v-text-field
              v-model="item.name"
              density="compact"
              autofocus
              hide-details
              @keydown.enter="saveEdit(item)"
              @keydown.esc="cancelEdit"
              @blur="cancelEdit"
              style="width: 100%;"
            />
          </span>
          <span v-else @click="startEdit('name'+item.id)" style="cursor:pointer;">
            {{ item.name ?? '-' }}
          </span>
        </v-card-title>
        <v-card-actions>
          <v-btn icon color="error" @click="confirmDeleteData(item)">
            <v-icon>bx bx-trash</v-icon>
          </v-btn>
          <v-btn icon color="primary" class="ml-1" @click="showModalDialog(item)">
            <v-icon>bx bx-edit</v-icon>
          </v-btn>
          <v-switch
            v-model="item.is_active"
            inset
            color="success"
            hide-details
            @change="onToggleActive(item)"
            class="ml-2"
            style="width: 70px;"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <!-- No data -->
  <div v-else-if="!loading && !items.length" class="pa-4 text-center">
    Tidak ada data.
  </div>

  <!-- Pagination -->
  <v-row justify="center" v-if="pagination.totalItems > pagination.itemsPerPage">
    <v-pagination
      v-model="pagination.page"
      :length="Math.ceil(pagination.totalItems / pagination.itemsPerPage)"
      @input="onPageChange"
      class="my-4"
    />
  </v-row>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'

import { useRoute } from 'vue-router'

const route = useRoute()

const { $api } = useNuxtApp()

const items = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const fotoPreview = ref('/no-image.jpg')
const formRef = ref(null)

const pagination = reactive({
  itemsPerPage: 10,
  page: 1,
  totalItems: 0,
})
const filter = reactive({
  search: '',
})

const valid = ref(true)
const form = reactive({
  id: null,
  name: "",
  sekolah_id: route.query.id,
  image: null,
})

const show = ref(false)
const message = ref('')
const editingRow = ref(null)
const showConfirmDelete = ref(false)
const DataToDelete = ref(null)
const namaSekolah = ref(null);

// State untuk dialog foto
const showFotoDialog = ref(false)
const selectedFoto = ref('')

function openFotoDialog(image) {
  selectedFoto.value = image || '/no-image.jpg'
  showFotoDialog.value = true
}

function confirmDeleteData(Data) {
  DataToDelete.value = Data
  showConfirmDelete.value = true
}

function startEdit(item) {
  editingRow.value = item
}

async function saveEdit(item) {
  loading.value = true
  try {
    const formData = new FormData()
    for (const key in item) {
      if (item[key] !== undefined && item[key] !== null) {
        if (item[key] instanceof File) {
          formData.append(key, item[key])
        } else {
          formData.append(key, item[key])
        }
      }
    }
    const response = await $api.post('/master-content/prestasi-unit/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    message.value = response.data.message
  } catch (error) {
    message.value = error.response?.data?.message
  } finally {
    loading.value = false
    editingRow.value = null
    getData()
  }
}


function cancelEdit() {
  editingRow.value = ''
}

function showModalDialog (item) {
  showCreateModal.value = true
  if(item == null){
    Object.keys(form).forEach(k => form[k] = null)
    fotoPreview.value = '/no-image.jpg'
  }else{
    Object.keys(form).forEach(k => form[k] = item[k] ?? '')
    fotoPreview.value = item.image ? item.image : '/no-image.jpg'
  }
}

watch([() => pagination.itemsPerPage, () => pagination.page, () => filter.search], () => {
  getData()
})

const onPageChange = (newPage) => {
  pagination.page = newPage
  getData()
}

async function getData() {
  loading.value = true
  try {
    const response = await $api.post('/master-content/prestasi-unit/get', {
      page: pagination.page,
      perPage: pagination.itemsPerPage,
      search: filter.search,
      sekolah_id : route.query.id
    })
    items.value = response.data.data
    pagination.totalItems = response.data.total
    pagination.page = response.data.currentPage
    pagination.itemsPerPage = response.data.perPage
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message
  } finally {
    loading.value = false
  }
}

async function handleCreateData() {
  loading.value = true
  try {
    // Buat FormData
    const formData = new FormData()
    for (const key in form) {
      if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key])
      }
    }

    formData.append('sekolah_id', route.query.id)
    if(form.id == null){
      await $api.post('/master-content/prestasi-unit/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }else{
      await $api.post('/master-content/prestasi-unit/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    showCreateModal.value = false
    Object.keys(form).forEach(k => form[k] = '')
    fotoPreview.value = '/no-image.jpg'
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal membuat Galeri.'
  } finally {
    loading.value = false
    getData()
  }
}

function handleFotoChange(e) {
  let file
  if (Array.isArray(e)) file = e[0]
  else if (e?.target?.files) file = e.target.files[0]
  else file = e

  if (file) {
    form.image = file
    fotoPreview.value = URL.createObjectURL(file)
  } else {
    form.image = null
    fotoPreview.value = '/no-image.jpg'
  }
}

async function handleDeleteData() {
  loading.value = true
  try {
    await $api.post(`/master-content/prestasi-unit/delete`,{
      id: DataToDelete.value.id,
    })
    getData()
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal menghapus Data.'
  } finally {
    loading.value = false
    showConfirmDelete.value = false
    DataToDelete.value = null
  }
}

async function onToggleActive(item) {
  try {
    await $api.post(`/master-content/prestasi-unit/update`, {
      ...item
    })
  } catch (error) {
    getData()
  } finally{
    getData()
  }
}

onMounted(() => {
  getData()
  namaSekolah.value = route.query.name;
  form.sekolah_id = route.query.id;

  // console.log(route.query.id) // get the "id" param
})
</script>

<style lang="scss">
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none;
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
