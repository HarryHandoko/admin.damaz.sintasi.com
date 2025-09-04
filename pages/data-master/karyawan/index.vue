<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2>Karyawan</h2>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="pagination.itemsPerPage"
      :page="pagination.page"
      :server-items-length="pagination.totalItems"
      :loading="loading"
      class="elevation-1 small-table responsive"
      item-value="id"
      @update:page="onPageChange"
      @update:items-per-page="onPerPageChange"
      hover
      bordered
      :search="filter.search"
    >
      <!-- Top area -->
      <template #top>
        <v-row class="mb-2 pa-4">
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="filter.search"
              label="Cari"
              placeholder="Cari Karyawan"
            />
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-btn
              color="primary"
              class="float-end"
              @click="showModalDialog(null)"
            >
              <v-icon left>bx bx-plus</v-icon>
              Tambah Karyawan
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <!-- Index Number -->
      <template #item.index="props">
        {{ props.index + 1 }}
      </template>
      <!-- Name edit inline -->
      <template #item.nama_depan="{ item }">
        <div v-if="editingRow === 'nama_depan'+item.id" style="min-width: 200px;" >
          <v-text-field
            v-model="item.nama_depan"
            density="compact"
            autofocus
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
            @blur="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit('nama_depan'+item.id)" style="cursor:pointer;min-width: 200px;">
          {{ item.nama_depan ?? '-' }}
        </div>
      </template>

      <template #item.nama_belakang="{ item }">
        <div v-if="editingRow === 'nama_belakang'+item.id" style="min-width: 200px;" >
          <v-text-field
            v-model="item.nama_belakang"
            density="compact"
            autofocus
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
            @blur="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit('nama_belakang'+item.id)" style="cursor:pointer;min-width: 200px;">
          {{ item.nama_belakang ?? '-' }}
        </div>
      </template>
      <template #item.foto_profile="{ item }">
        <img
          :src="item.foto_profile ? `${item.foto_profile}` : '/no-image.jpg'"
          alt="Foto Profil"
          style="width: 48px; height: 48px; object-fit: cover; border-radius: 50%; border: 2px solid #eee;"
        />
      </template>

      <template #item.nik="{ item }">
        <div v-if="editingRow === 'nik'+item.id" style="min-width: 200px;">
          <v-text-field
            v-model="item.nik"
            density="compact"
            autofocus
            type="number"
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
            @blur="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit('nik'+item.id)" style="min-width: 200px;cursor:pointer">
          {{ item.nik  ?? '-'}}
        </div>
      </template>

      <template #item.email="{ item }">
        <div v-if="editingRow === 'email'+item.id" style="min-width: 200px;">
          <v-text-field
            v-model="item.email"
            density="compact"
            autofocus
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
            @blur="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit('email'+item.id)" style="min-width: 200px;cursor:pointer">
          {{ item.email  ?? '-'}}
        </div>
      </template>

      <template #item.alamat="{ item }">
        <div v-if="editingRow === 'alamat'+item.id" style="min-width: 200px;">
          <v-text-field
            v-model="item.alamat"
            density="compact"
            autofocus
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
            @blur="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit('alamat'+item.id)" style="min-width: 200px;cursor:pointer">
          {{ item.alamat ?? '-' }}
        </div>
      </template>

      <template #item.no_handphone="{ item }">
        <div v-if="editingRow === 'no_handphone'+item.id">
          <v-text-field
            v-model="item.no_handphone"
            density="compact"
            autofocus
            type="number"
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
            @blur="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit('no_handphone'+item.id)" style="cursor:pointer">
          {{ item.no_handphone ?? '-' }}
        </div>
      </template>
      <!-- Delete -->
      <template #item.aksi="{ item }" >
        <div style="min-width: 200px; display: flex; align-items: center;">
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
        </div>
      </template>
      <!-- No data -->
      <template #no-data>
        Tidak ada data.
      </template>
      

    </v-data-table>

    <!-- Dialog tambah Karyawan -->
    <v-dialog v-model="showCreateModal" max-width="600" persistent>
      <v-card>
        <v-card-title class="pa-6 text-center">
          <span class="headline">Form Karyawan</span>
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
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.nama_depan"
                  label="Nama Depan"
                  :rules="[v => !!v || 'Nama depan harus diisi']"
                  required
                  class="mb-2"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.nama_belakang"
                  label="Nama Belakang"
                  :rules="[v => !!v || 'Nama belakang harus diisi']"
                  required
                  class="mb-2"
                />
              </v-col>


              <v-col cols="12" sm="6">
                <v-select
                  v-model="form.jenis_kelamin"
                  :items="['Laki-laki','Perempuan']"
                  label="Jenis Kelamin"
                  :rules="[v => !!v || 'Jenis Kelamin harus dipilih']"
                  required
                  class="mb-2"
                  return-object="false"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.no_handphone"
                  label="No. Handphone"
                  type="number"
                  class="mb-2"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.nik"
                  label="No. NIK"
                  type="number"
                  class="mb-2"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  :rules="[
                    v => !!v || 'Email harus diisi',
                    v => /.+@.+\..+/.test(v) || 'Format email tidak valid'
                  ]"
                  required
                  class="mb-2"
                  type="email"
                />
              </v-col>
              <v-col cols="12"  :sm="form.id == null ? 6 : 12">
                <v-text-field
                  v-model="form.username"
                  label="Username"
                  :rules="[v => !!v || 'Username harus disi',
                    v => (v && v.length > 8) || 'Username setidaknya memiliki 8 karakter']"
                  required
                  class="mb-2"
                />
              </v-col>
              <v-col cols="12"  sm="6" v-if="form.id == null">
                <v-text-field
                  v-model="form.password"
                  label="Password"
                  type="password"
                  :rules="[v => !!v || 'Password harus diisi']"
                  required
                  class="mb-2"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.tempat_lahir"
                  label="Tempat Lahir"
                  class="mb-2"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.tanggal_lahir"
                  label="Tanggal Lahir"
                  type="date"
                  class="mb-2"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="form.role_id"
                  :items="roles"
                  item-title="name"
                  item-value="id"
                  label="Role"
                  :rules="[v => !!v || 'Role harus dipilih']"
                  required
                  class="mb-2"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.tanggal_masuk"
                  label="Tanggal Masuk"
                  type="date"
                  required
                  class="mb-2"
                />
              </v-col>

              <v-col cols="12" sm="12">
                <v-textarea
                  v-model="form.alamat"
                  label="Alamat"
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

    <!-- Snackbar error -->
    <v-snackbar v-model="show" color="error" timeout="3000">
      {{ message }}
    </v-snackbar>

    <!-- Dialog konfirmasi hapus -->
    <ConfirmDialog
      :modelValue="showConfirmDelete"
      title="Konfirmasi Hapus"
      :message="`Apakah Anda yakin ingin menghapus Karyawan ${DataToDelete?.name}?`"
      @confirm="handleDeleteData"
      @cancel="showConfirmDelete = false"
    />
  </v-card>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'

const { $api } = useNuxtApp()
const headers = [
  { title: '#', value: 'aksi', width: '300px' },
  { title: 'No', value: 'index', sortable: false, align: 'start', width: '50px' },
  { title: 'Foto', value: 'foto_profile', sortable: false },
  { title: 'Nama Depan', value: 'nama_depan', sortable: true },
  { title: 'Nama Belakang', value: 'nama_belakang', sortable: true },
  { title: 'No. NIK', value: 'nik', sortable: true },
  { title: 'Email', value: 'email', sortable: true },
  { title: 'No. Handphone', value: 'no_handphone', sortable: true },
  { title: 'Alamat', value: 'alamat', sortable: true },
]

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

const valid = ref(true);
const roles = ref([]);
const form = reactive({
  id: null,
  nama_depan: "",
  nama_belakang: "",
  nik: "",
  email: "",
  no_handphone: "",
  alamat: "",
  foto: null,
  username: null,
  tanggal_lahir : null,
  tanggal_masuk : null,
  tempat_lahir : null,
  jenis_kelamin : null,
  role_id : null,
  password: null
})

const show = ref(false)
const message = ref('')

const editingRow = ref(null)

const showConfirmDelete = ref(false)
const DataToDelete = ref(null)

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
    const response = await $api.post('/master/karyawan/update', {
      ...item,
    })
    message.value = response.data.message
  } catch (error) {
    message.value = error.response?.data?.message
  } finally {
    loading.value = false
    editingRow.value = null
    getData() // Refresh data setelah edit
  }
}

function cancelEdit() {
  editingRow.value = ''
}

function showModalDialog (item) {
  showCreateModal.value = true;
  getRole()
  if(item == null){
    Object.keys(form).forEach(k => form[k] = null)
    fotoPreview.value = '/no-image.jpg'
  }else{
    Object.keys(form).forEach(k => form[k] = item[k] ?? '')
    fotoPreview.value = item.foto_profile || '/no-image.jpg'
  }
}

watch([() => pagination.itemsPerPage, () => pagination.page], () => {
  getData()
})

const onPageChange = (newPage) => {
  pagination.page = newPage
  getData()
}

const onPerPageChange = (newPerPage) => {
  pagination.itemsPerPage = newPerPage
  pagination.page = 1
  getData()
}

async function getData() {
  loading.value = true
  try {
    const response = await $api.get('/master/karyawan/get', {
      params: {
        page: pagination.page,
        perPage: pagination.itemsPerPage,
        search: filter.search,
      },
    })
    items.value = response.data.data // Pastikan sudah return children!
    pagination.totalItems = response.data.total
    pagination.page = response.data.currentPage
    pagination.itemsPerPage = response.data.perPage
    pagination.totalItems = response.data.total
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
    if(form.id == null){
      await $api.post('/master/karyawan/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }else{
      await $api.post('/master/karyawan/update-data', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    showCreateModal.value = false
    Object.keys(form).forEach(k => form[k] = '')
    fotoPreview.value = '/no-image.jpg'
    getData()
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal membuat Karyawan.'
  } finally {
    loading.value = false
  }
}


async function getRole() {
  loading.value = true
  try {
    const data = await $api.get(`/roles/get-select`)
    roles.value = data.data;
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal Mendapatkan Data.'
  } finally {
    loading.value = false
  }
}


// --- Methods
function handleFotoChange(e) {
  let file
  if (Array.isArray(e)) file = e[0]
  else if (e?.target?.files) file = e.target.files[0]
  else file = e

  if (file) {
    form.foto = file
    fotoPreview.value = URL.createObjectURL(file)
  } else {
    form.foto = null
    fotoPreview.value = '/no-image.jpg'
  }
}


async function handleDeleteData() {
  loading.value = true
  try {
    await $api.post(`/master/karyawan/delete`,{
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
    item.is_active = item.is_active == true ? 1 : 0;
    await $api.post(`/master/karyawan/update/`, {
      ...item
    });
  } catch (error) {
    getData();
  } finally{
    getData()
  }
}


onMounted(() => {
  getData()
})

</script>
<style lang="scss">
/* Untuk Chrome, Safari, Edge, Opera */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none;
  margin: 0; 
}
/* Untuk Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

</style>
