<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2> Diskon Voucher</h2>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :items-per-page="pagination.itemsPerPage" :page="pagination.page"
      :server-items-length="pagination.totalItems" :loading="loading" class="elevation-1 small-table" show-expand
      item-value="id" @update:page="onPageChange" @update:items-per-page="onPerPageChange" hover bordered
      :search="filter.search">
      <!-- Top area -->
      <template #top>
        <v-row class="mb-2 pa-4">
          <v-col cols="12" sm="12" md="6">
            <v-text-field v-model="filter.search" label="Cari" placeholder="Cari Diskon" />
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-btn color="primary" class="float-end" @click="showModalDialog(null, null)">
              <v-icon left>bx bx-plus</v-icon>
              Tambah  Diskon Voucher
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <!-- Index Number -->
      <template #item.index="props">
        {{ props.index + 1 }}
      </template>

      <!-- Delete -->
      <template #item.aksi="props">
        <div style="width: 400px">
          <v-btn icon color="error" @click="confirmDeleteData(props.item, 'sekolah')">
            <v-icon>bx bx-trash</v-icon>
          </v-btn>

          <v-btn icon color="secondary" class="ml-2" @click="showModalDialog(props.item, 'edit')">
            <v-icon>bx-edit</v-icon>
          </v-btn>
        </div>
      </template>
      <!-- No data -->
      <template #no-data>
        Tidak ada data.
      </template>
    </v-data-table>

    <!-- Dialog tambah menu -->
    <v-dialog v-model="showCreateModal" max-width="700" persistent>
      <v-card>
        <v-card-title class="pa-6">
          <span class="headline">Form Diskon Voucher</span>
        </v-card-title>
        <v-form v-model="valid" @submit.prevent="handleCreateData">
          <v-card-text style="margin-top: -30px;">
            <v-text-field v-model="form.nama" label="Nama" required class="mb-4"
              :rules="[v => !!v || 'Nama harus diisi']" />
            <v-text-field v-model="form.nominal" label="Diskon Uang Formulir" type="number" required class="mb-4"
              :rules="[v => !!v || 'Diskon Uang Formulir harus diisi']" />
            <v-text-field v-model="form.diskon_uang_pangkal" label="Dikon Uang Pangkal" type="number" required class="mb-4"
              :rules="[v => !!v || 'Dikon Uang Pangkal harus diisi']" />
            <v-text-field v-model="form.kode" label="Kode" required class="mb-4"
              :rules="[v => !!v || 'Kode harus diisi']" />
            <v-text-field v-model="form.kuota" label="Kuota" type="number" required class="mb-4"
              :rules="[v => !!v || 'Kuota harus diisi']" />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-grey" variant="text" @click="showCreateModal = false">Batal</v-btn>
            <v-btn color="primary" variant="flat" :disabled="!valid || loading" type="submit"
              :loading="loading">Simpan</v-btn>
          </v-card-actions>

        </v-form>
      </v-card>
    </v-dialog>

    <!-- Snackbar error -->
    <v-snackbar v-model="show" color="error" timeout="3000">
      {{ message }}
    </v-snackbar>


    <!-- Dialog konfirmasi hapus -->
    <ConfirmDialog :modelValue="showConfirmDelete" title="Konfirmasi Hapus"
      :message="`Apakah Anda yakin ingin menghapus ${DataToDelete?.diskon}?`" @confirm="handleDeleteData(TypeToDelete)"
      @cancel="showConfirmDelete = false" />
  </v-card>
</template>

<script setup>
import CryptoJS from 'crypto-js';
import { onMounted, reactive, ref, watch } from 'vue';
import ConfirmDialog from '~/components/ConfirmDialog.vue';
const { MD5 } = CryptoJS;

const { $api } = useNuxtApp()
const headers = [
  { title: 'No', value: 'index', sortable: false, align: 'start', width: '50px' },
  { title: 'Nama', value: 'nama', sortable: true },
  { title: 'Diskon Uang Formulir', value: 'nominal', sortable: true },
  { title: 'Diskon Uang Pangkal', value: 'diskon_uang_pangkal', sortable: true },
  { title: 'Kode', value: 'kode', sortable: true },
  { title: 'Kuota', value: 'kuota', sortable: true },
  { title: '', value: 'aksi', sortable: false, align: 'end' },
]

const items = ref([])
const loading = ref(false)
const showCreateModal = ref(false)

const pagination = reactive({
  itemsPerPage: 10,
  page: 1,
  totalItems: 0,
})
const filter = reactive({
  search: '',
})

const form = reactive({
  id: '',
  nama: '',
  nominal: '',
  diskon_uang_pangkal: '',
  kode: '',
  kuota: '',
})
const valid = ref(true);

const show = ref(false)
const message = ref('')

const showConfirmDelete = ref(false)
const DataToDelete = ref(null)
const TypeToDelete = ref(null)

function confirmDeleteData(Data, type) {
  DataToDelete.value = Data
  showConfirmDelete.value = true
  TypeToDelete.value = type
}

function showModalDialog(item, type) {
  showCreateModal.value = true
  if (item == null) {
    Object.keys(form).forEach(k => form[k] = null)
  } else if (type == 'edit') {
    Object.keys(form).forEach(k => form[k] = item[k] ?? '')
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
    const response = await $api.get('/master-data/diskon/get', {
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
    const formData = new FormData()
    formData.append("id", form.id)
    formData.append("nama", form.nama)
    formData.append("nominal", form.nominal)
    formData.append("diskon_uang_pangkal", form.diskon_uang_pangkal)
    formData.append("kode", form.kode)
    formData.append("kuota", form.kuota)

    if (!form.id) {
      await $api.post('/master-data/diskon/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } else {
      await $api.post('/master-data/diskon/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }

    showCreateModal.value = false
    getData()

    form.diskon = ''
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal membuat Data'
  } finally {
    loading.value = false
  }
}


async function handleDeleteData() {
  loading.value = true
  try {
    await $api.post(`/master-data/diskon/delete`, {
      id: DataToDelete.value.id,
    })
    getData()
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal menghapus Data'
  } finally {
    loading.value = false
    showConfirmDelete.value = false
    DataToDelete.value = null
  }
}


onMounted(() => {
  getData()
})

</script>
