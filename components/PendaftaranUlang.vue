<template>
  <div>

    <VCard class="mb-6 pa-4">
      <VRow>
        <VCol cols="12" md="3">
          <VSelect
            v-model="filter.status"
            :items="statusOptions"
            label="Filter Status"
            dense
            outlined
            clearable
          />
        </VCol>
        <VCol cols="12" md="3">
          <VTextField
            v-model="filter.keyword"
            label="Cari Nama / Email"
            dense
            outlined
            clearable
          />
        </VCol>
        
        <VCol cols="12" md="3">
            <VSelect
              v-model="filter.tahun_periodik"
              :items="optionTahunPeriodik"
              label="Tahun Periodik"
              dense
              outlined
              clearable
            />
          </VCol>
          <VCol cols="12">
            <VBtn color="primary" :loading="loading" @click="getData();getStat();">Terapkan Filter</VBtn>

            <VBtn color="warning" :loading="loading" class="ml-2" @click="getData(); getStat()">
              <v-icon>bx-refresh</v-icon>
            </VBtn>

            <VBtn color="success" :loading="loading" class="ml-2" @click="getFileExcel()">
              <v-icon>bx bxs-file</v-icon> Print To Excel
            </VBtn>
            <VBtn color="secondary" :loading="loading" class="ml-2" @click="getFileBundle()">
              <v-icon>bx bxs-file</v-icon> Print To Bundle
            </VBtn>
          </VCol>
      </VRow>
    </VCard>

    <!-- Statistik Cards -->
    <VRow class="mb-6">
      <VCol cols="12" sm="6" md="3" v-for="(card, index) in statsCards" :key="index">
        <VCard class="text-center" :style="`background-color: ${card.bgColor}; color: ${card.textColor}`">
          <VCardText>
            <VIcon size="36" class="mb-2">{{ card.icon }}</VIcon>
            <div class="text-h6">{{ card.title }}</div>
            <div class="text-h4 font-weight-bold">{{ card.count }}</div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Table Pendaftar -->
    <VCard>
      <VCardTitle class="mt-3">Daftar Pendaftaran Ulang</VCardTitle>
      <VDataTable
        :headers="headers"
        :items="data"
        class="elevation-1"
        :loading="loading"
      >
        <!-- Custom Status Badge -->
        <template #item.status="{ item }">
          <VChip
            :color="getStatusColor(item.status_pembayaran)"
            class="ma-1"
            dark
          >
            <VIcon left>{{ getStatusIcon(item.status_pembayaran) }}</VIcon>
            {{ getStatusLabel(item.status_pembayaran) }}
          </VChip>
        </template>

        <template #item.code_pendaftaran="{ item }" >
          <div style="min-width: 200px;">
            {{ item.code_pendaftaran }}
          </div>
        </template>

        <template #item.code_registrasi_ulang="{ item }" >
          <div style="min-width: 200px;">
            {{ item.code_registrasi_ulang }}
          </div>
        </template>

        <template #item.name_register="{ item }" >
          <div style="min-width: 200px;">
            {{ item.register.nama_depan + ' ' + item.register.nama_belakang }}
          </div>
        </template>

        <template #item.name_siswa="{ item }">
          <div style="min-width: 200px;">
          {{ item.siswa.nama_depan + ' ' + item.siswa.nama_belakang }}
          </div>
        </template>

        <template #item.email="{ item }">
          <div style="min-width: 200px;">
          {{ item.register.email }}
          </div>
        </template>

        <template #item.actions="{ item }">

          <div style="min-width: 200px;">
          <VBtn icon color="primary" :loading="loading" @click="showDetail(item)">
            <VIcon>bx-show</VIcon>
          </VBtn>
          <VBtn icon color="success" :disabled="item.status_pembayaran == '01'" @click="approvalConfirm(item,'Approve')" :loading="loading"  class="ml-2">
            <VIcon>bx-check</VIcon>
          </VBtn>
          <VBtn icon color="error" :disabled="item.status_pembayaran == '02'" @click="approvalConfirm(item,'Reject')" :loading="loading" class="ml-2">
            <VIcon>bx-x</VIcon>
          </VBtn>
          </div>
        </template>
      </VDataTable>
    </VCard>

    <VDialog v-model="dialogDetail" max-width="700px" persistent>
      <VCard class="pa-4">
        <VCardTitle class="text-h6">
          <VRow>
            <VCol cols="10">
              Detail Registrasi Ulang
            </VCol>
            <VCol cols="2" class="text-right">
              <v-icon style="cursor: pointer" @click="dialogDetail = false">bx bx-x</v-icon>
            </VCol>
          </VRow>


          <VRow v-if="selectedItem?.status_pembayaran == '01'">
            <VCol cols="10">
            </VCol>
            <VCol cols="2" class="text-right">
               <div>
                <v-icon
                  v-if="!loading"
                  style="cursor: pointer"
                  size="30"
                  @click="printData(selectedItem)"
                >
                  bx-printer
                </v-icon>

                <v-progress-circular
                  v-else
                  indeterminate
                  color="primary"
                  size="30"
                />
              </div>
            </VCol>
          </VRow>
        </VCardTitle>

        <VCardText v-if="selectedItem">
          <VContainer>
            <VRow>
              <VCol cols="12" md="6">
                <p><strong>Kode Registrasi Ulang:</strong> {{ selectedItem.code_registrasi_ulang }}</p>
                <p><strong>Kode Pendaftaran:</strong> {{ selectedItem.code_pendaftaran }}</p>
                <p><strong>Nama Siswa:</strong> {{ selectedItem.register.nama_depan }} {{ selectedItem.register.nama_belakang }}</p>
                <p><strong>Sekolah:</strong> {{ selectedItem.sekolah.name }}</p>
                <p><strong>Jenjang:</strong> {{ selectedItem.sekolah_grade.name }}</p>
                <p><strong>Status:</strong> {{ selectedItem.status_pendaftaran_siswa }}</p>
                <p><strong>Email:</strong> {{ selectedItem.register.email }}</p>
                <p><strong>No. Handphone:</strong> {{ selectedItem.register.no_handphone }}</p>
              </VCol>
              <VCol cols="12" md="6">
                <p><strong>Nama Pendaftar:</strong> {{ selectedItem.register.nama_depan }} {{ selectedItem.register.nama_belakang }}</p>
                <p><strong>Biaya Pendaftaran:</strong> Rp {{ Number(selectedItem.biaya_pendaftaran).toLocaleString() }}</p>
                <p><strong class="mr-2">Status Pembayaran:</strong> 
                  <VChip :color="selectedItem.bukti_pembayaran != null ? 'success' : 'error'" dark>
                    {{ selectedItem.bukti_pembayaran != null ? 'Sudah dibayar' : 'Belum dibayar' }}
                  </VChip>
                </p>
                <p><strong>Tanggal Registrasi:</strong> {{ formatDate(selectedItem.created_at) }}</p>
              </VCol>
            </VRow>

            <VDivider class="my-4" />

            <VRow>
              <VCol cols="12">
                <p><strong>Bukti Pembayaran:</strong></p>
                <VImg
                  :src="`${selectedItem.bukti_pembayaran}`"
                  height="200"
                  contain
                  style="cursor: zoom-in"
                  @click="zoomDialog = true"
                />

                <VDialog v-model="zoomDialog" max-width="600">
                  <v-card>
                    <v-img
                      :src="`${selectedItem.bukti_pembayaran}`"
                      height="100%"
                      max-height="90vh"
                      contain
                    />
                  </v-card>
                </VDialog>
              </VCol>
            </VRow>
          </VContainer>
        </VCardText>

        <VCardActions>
          <v-row>
            <v-col cols="6" >
              <v-btn color="success" :disabled="selectedItem.status_pembayaran == '01'" variant="flat" @click="approvalConfirm(selectedItem,'Approve')" block>Setujui</v-btn>
            </v-col>
            <v-col cols="6" >
              <v-btn color="error" :disabled="selectedItem.status_pembayaran =='02'" variant="flat" @click="approvalConfirm(selectedItem,'Reject')" block>Tolak</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn color="primary" variant="flat" block @click="dialogDetail = false;getData()">Tutup</v-btn>
            </v-col>
          </v-row>
        </VCardActions>
      </VCard>
    </VDialog>



    <!-- Snackbar error -->
    <v-snackbar v-model="show" color="error" timeout="3000">
      {{ message }}
    </v-snackbar>


    <!-- Snackbar Sucess -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000">
      {{ message }}
    </v-snackbar>
    <!-- Dialog konfirmasi hapus -->
    <ConfirmDialog
      :modelValue="showConfirm"
      :title="titleConfirm"
      :message="messageConfirm"
      :color="color"
      @confirm="HandleApproval(dataConfirm, typeConfirm)"
      @cancel="showConfirm = false"
    />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import ConfirmDialog from '~/components/ConfirmDialog.vue';
const { $api } = useNuxtApp()

// State
const loading = ref(false)
const message = ref(null)
const show = ref(false)
const filter = ref({ status: null, keyword: '' })

const dialogDetail = ref(false)
const selectedItem = ref(null)

// Opsi status
const statusOptions = ['Diterima', 'Ditolak', 'Dalam Proses']

const zoomDialog = ref(false);
const zoomDialogFoto = ref(false);

const showConfirm = ref(false);
const titleConfirm = ref(null);
const messageConfirm = ref(null);
const dataConfirm = ref(null);
const typeConfirm = ref(null);
const color = ref('error');
const showSuccess = ref(false);

// Kartu statistik
const statsCards = ref([
  { title: 'Total Pendaftar', count: 0, bgColor: '#E3F2FD', textColor: '#1E88E5', icon: 'bx-user' },
  { title: 'Diterima', count: 0, bgColor: '#E8F5E9', textColor: '#43A047', icon: 'bx-check-circle' },
  { title: 'Ditolak', count: 0, bgColor: '#FFEBEE', textColor: '#E53935', icon: 'bx-x-circle' },
  { title: 'Dalam Proses', count: 0, bgColor: '#FFF8E1', textColor: '#FB8C00', icon: 'bx-time' }
])

// Header tabel
const headers = [
  { title: 'Kode Admisi', value: 'code_pendaftaran',width: '200px' },
  { title: 'Kode Daftar Ulang', value: 'code_registrasi_ulang',width: '200px' },
  { title: 'Nama Pendaftar', value: 'name_register',width: '200px' },
  { title: 'Nama Siswa', value: 'name_siswa' },
  { title: 'Email', value: 'email' },
  { title: 'Status', value: 'status' },
  { title: 'Aksi', value: 'actions', sortable: false, width: '200px'}
]

// Data tabel
const data = ref([])

// Fungsi menampilkan detail
function showDetail(item) {
  selectedItem.value = item
  dialogDetail.value = true
}

// Format tanggal
function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('id-ID', options)
}

// Label status pendaftaran
function getStatusLabel(code) {
  return code === '00' ? 'Menunggu Proses'
    : code === '01' ? 'Diterima'
    : code === '02' ? 'Ditolak'
    : 'Tidak Diketahui'
}

// Warna status pendaftaran
function getStatusColor(code) {
  return code === '00' ? 'warning'
    : code === '01' ? 'success'
    : code === '02' ? 'error'
    : 'grey'
}

// Ikon status pendaftaran
function getStatusIcon(code) {
  return code === '00' ? 'bx-time'
    : code === '01' ? 'bx-check-circle'
    : code === '02' ? 'bx-x-circle'
    : 'bx-question-mark'
}

// Ambil data dari API
async function getData() {
  loading.value = true
  try {
    const response = await $api.post('/register-ppdb/get-pendaftaran-ulang',{
      filter : filter.value
    })
    data.value = response.data.data
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message
  } finally {
    loading.value = false
  }
}

// Placeholder filter
function applyFilter() {
  // Tambahkan logika filter sesuai kebutuhan
}


function approvalConfirm(data,type) {
    color.value = type == 'Approve' ? 'success' : 'error';
    titleConfirm.value = 'Konfirmasi Tindakan';
    messageConfirm.value = `Yakin ingin Apakah anda ingin ${type}?`;
    dataConfirm.value = data;
    typeConfirm.value = type;
    showConfirm.value = true;
}

async function printData(data) {
  loading.value = true
  try {
    const response = await $api.post('/register-ppdb/generate-kts-pdf', data)

    const downloadUrl = response.data.download_url
    if (downloadUrl) {
      window.open(downloadUrl, '_blank') // 👈 buka di tab baru
    } else {
      show.value = true
      message.value = 'Gagal mendapatkan link unduhan.'
    }
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Terjadi kesalahan saat mencetak.'
  } finally {
    loading.value = false
  }
}

async function getStat() {
  try {
    const {data} = await $api.get('/register-ppdb/statistik-pendaftar-ulang');
    statsCards.value = [
      {
        title: 'Total Pendaftar',
        count: data.data.total,
        bgColor: '#E3F2FD',
        textColor: '#1E88E5',
        icon: 'bx-user',
      },
      {
        title: 'Diterima',
        count: data.data.diterima,
        bgColor: '#E8F5E9',
        textColor: '#43A047',
        icon: 'bx-check-circle',
      },
      {
        title: 'Ditolak',
        count: data.data.ditolak,
        bgColor: '#FFEBEE',
        textColor: '#E53935',
        icon: 'bx-x-circle',
      },
      {
        title: 'Dalam Proses',
        count: data.data.diproses,
        bgColor: '#FFF8E1',
        textColor: '#FB8C00',
        icon: 'bx-time',
      },
    ]
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Terjadi kesalahan.'
  } finally {
    loading.value = false
  }
}



async function HandleApproval(data,type) {
  loading.value = true
  try {
    const response = await $api.post('/register-ppdb/pendaftaran-ulang-approval', {
      code_registrasi_ulang : data.code_registrasi_ulang,
      siswa_id : data.siswa_id,
      type : type
    })

    showSuccess.value = true
    message.value = 'Pendaftaran berhasil diubah.'
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Terjadi kesalahan saat mencetak.'
  } finally {
    loading.value = false
    dialogDetail.value = false
    showConfirm.value = false
    getData()
    getStat()
  }
}




const optionTahunPeriodik = ref([]);

async function getTahunPeriodik() {
  loading.value = true;
  try {
    const {data} = await $api.get('/register-ppdb/ref-tahun-periodik');
    optionTahunPeriodik.value = data.data
    filter.value.tahun_periodik = optionTahunPeriodik.value.at(-1)

    if(filter.value.tahun_periodik != null){
      getData();
      getStat();
    }
  } catch (error) {
    show.value = true;
    message.value = 'Server Error.';
  } finally {
    loading.value = false;
  }
}



async function getFileExcel() {
  loading.value = true
  try {
    const response = await $api.post('/report/register-ulang/download-excel', {
      filter : filter.value
    })

    const downloadUrl = response.data.download_url
    if (downloadUrl) {
      window.open(downloadUrl, '_blank') // 👈 buka di tab baru
    } else {
      show.value = true
      message.value = 'Gagal mendapatkan link unduhan.'
    }
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Terjadi kesalahan saat mencetak.'
  } finally {
    loading.value = false
  }
}



async function getFileBundle() {
  loading.value = true
  try {
    const response = await $api.post('/report/register-ulang/download-bundle', {
      filter : filter.value
    })

    const downloadUrl = response.data.download_url
    if (downloadUrl) {
      window.open(downloadUrl, '_blank') // 👈 buka di tab baru
    } else {
      show.value = true
      message.value = 'Gagal mendapatkan link unduhan.'
    }
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Terjadi kesalahan saat mencetak.'
  } finally {
    loading.value = false
  }
}


// Lifecycle
onMounted(() => {
  getTahunPeriodik()
})
</script>
