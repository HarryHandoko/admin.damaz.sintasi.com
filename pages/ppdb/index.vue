<template>
  <div>
    <!-- Tabs Navigation -->
    <VTabs v-model="activeTab" background-color="primary" dark>
      <VTab> Pendaftaran Admisi </VTab>
      <VTab> Pendaftaran Ulang </VTab>
    </VTabs>

    <VWindow v-model="activeTab">
      <!-- Tab 1: Pendaftar Admisi -->
      <VWindowItem :value="0">
        <!-- Filter Section -->
        <VCard class="mb-6 pa-4">
          <VRow>
            <VCol cols="12" md="4">
              <VSelect
                v-model="filter.status"
                :items="statusOptions"
                label="Filter Status"
                dense
                outlined
                clearable
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="filter.keyword"
                label="Cari Nama / Email"
                dense
                outlined
                clearable
              />
            </VCol>
            <VCol cols="12" md="3">
              <VBtn color="primary" @click="getData">Terapkan Filter</VBtn>
            </VCol>
            <VCol md="1">
              <VBtn color="warning" @click="getData">
                <v-icon>bx-refresh</v-icon>
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
          <VCardTitle class="mt-3">Daftar Pendaftar Admisi</VCardTitle>
          <VDataTable
            :headers="headers"
            :items="data"
            class="elevation-1"
            :loading="loading"
          >
            <!-- Custom Status Badge -->
            <template #item.status="{ item }">
              <VChip
                :color="getStatusColor(item.status_pendaftaran)"
                class="ma-1"
                dark
              >
                <VIcon left>{{ getStatusIcon(item.status_pendaftaran) }}</VIcon>
                {{ getStatusLabel(item.status_pendaftaran) }}
              </VChip>
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
              <VBtn icon color="success" @click="approvalConfirm(item,'Approve')" :loading="loading"  class="ml-2">
                <VIcon>bx-check</VIcon>
              </VBtn>
              <VBtn icon color="error" @click="approvalConfirm(item,'Reject')" :loading="loading" class="ml-2">
                <VIcon>bx-x</VIcon>
              </VBtn>
              </div>
            </template>
          </VDataTable>
        </VCard>
      </VWindowItem>

      <!-- Tab 2: Pendaftaran Ulang -->
      <VWindowItem :value="1">
        <PendaftaranUlang />
      </VWindowItem>
    </VWindow>

    <!-- Detail Dialog -->
    <VDialog v-model="dialogDetail" max-width="900px" persistent>
      <VCard class="pa-2">
        <VCardTitle class="text-h6">
          <VRow>
            <VCol cols="10">
              Detail Pendaftar 
            </VCol>
            <VCol cols="2" class="text-right">
              <v-icon style="cursor: pointer" @click="dialogDetail = false;getData()">bx bx-x</v-icon>
            </VCol>
          </VRow>
          <VRow v-if="selectedItem">
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
              <VCol cols="12" md="4" class="text-center">
                <img
                  :src="selectedItem.siswa.foto_siswa"
                  alt="Preview Foto"
                  style="width: 220px;  height: 220px; object-fit: cover; border-radius: 8px; border: 2px solid #eee;cursor: pointer"
                  @click="zoomDialogFoto = true"
                />

                <!-- Dialog Zoom -->
                <v-dialog v-model="zoomDialogFoto" max-width="600">
                  <v-card>
                    <v-img
                      :src="selectedItem.siswa.foto_siswa"
                      height="100%"
                      max-height="90vh"
                      contain
                    />
                  </v-card>
                </v-dialog>
              </VCol>
              <VCol cols="12" md="8">
                <p><strong>No Formulir:</strong> {{ selectedItem.code_pendaftaran }}</p>
                <p><strong>Nama Siswa:</strong> {{ selectedItem.siswa.nama_depan }} {{ selectedItem.siswa.nama_belakang }}</p>
                <p><strong>Jenis Kelamin:</strong> {{ selectedItem.siswa.jenis_kelamin }}</p>
                <p><strong>Tempat, Tanggal Lahir:</strong> {{ selectedItem.siswa.tempat_lahir }}, {{ formatDate(selectedItem.siswa.tgl_lahir) }}</p>
                <p><strong>NISN:</strong> {{ selectedItem.siswa.nisn }}</p>
                <p><strong>Bahasa Sehari-hari:</strong> {{ selectedItem.siswa.bahasa_sehari_hari }}</p>
                <p v-if="selectedItem.sekolah.is_need_nem == '1'"><strong>NEM:</strong> {{ selectedItem.nem }}</p>
              </VCol>
            </VRow>


            <VDivider class="my-4" />

            <VRow v-if="selectedItem.siswa_award">
              <VCol cols="12">
                <p><strong>Prestasi Siswa:</strong> {{ selectedItem.siswa_award.award }} ({{ formatDate(selectedItem.siswa_award.tgl_didapat) }})</p>
                <VImg :src="selectedItem.siswa_award.image" height="120" contain />
              </VCol>
            </VRow>

            <VDivider class="my-4" />

            <VRow>
              <VCol cols="12">
                <p><strong>Sekolah Tujuan:</strong> {{ selectedItem.sekolah.name }} – {{ selectedItem.sekolah_grade.name }}</p>
                <p><strong>Status Pendaftaran:</strong>
                  <VChip :color="getStatusColor(selectedItem.status_pendaftaran)" dark dense class="ml-2">
                    {{ getStatusLabel(selectedItem.status_pendaftaran) }}
                  </VChip>
                </p>
                <p><strong>Tanggal Pendaftaran:</strong> {{ formatDate(selectedItem.tanggal_pendaftaran) }}</p>
                <p><strong>Status:</strong>
                  {{ selectedItem.status_pendaftaran_siswa }}
                </p>
              </VCol>
            </VRow>

            <VDivider class="my-4" />

            <VRow>
              <VCol cols="12">
                <p><strong>Alamat:</strong> {{ selectedItem.siswa_address.alamat }}, RT {{ selectedItem.siswa_address.rt }} / RW {{ selectedItem.siswa_address.rw }} ({{ selectedItem.siswa_address.zip_code }})</p>
                <p>
                  DESA {{ selectedItem.siswa_address.desa }}<br>
                  KEC/KEL. {{ selectedItem.siswa_address.district }}<br>
                  KOTA/KAB. {{ selectedItem.siswa_address.kota }}<br>
                  Prov. {{ selectedItem.siswa_address.provinsi }}
                </p>

              </VCol>
            </VRow>

            <VDivider class="my-4" />

            <VRow>
              <VCol cols="12" md="6">
                <p><strong>Nama Ayah:</strong> {{ selectedItem.siswa_parent.nama_ayah }}</p>
                <p><strong>Pendidikan Ayah:</strong> {{ selectedItem.siswa_parent.pendidikan_terakhir_ayah }}</p>
                <p><strong>Pekerjaan Ayah:</strong> {{ selectedItem.siswa_parent.pekerjaan_ayah }}</p>
                <p><strong>Penghasilan Ayah:</strong> {{ selectedItem.siswa_parent.penghasilan_ayah }}</p>
              </VCol>
              <VCol cols="12" md="6">
                <p><strong>Nama Ibu:</strong> {{ selectedItem.siswa_parent.nama_ibu }}</p>
                <p><strong>Pendidikan Ibu:</strong> {{ selectedItem.siswa_parent.pendidikan_terakhir_ibu }}</p>
                <p><strong>Pekerjaan Ibu:</strong> {{ selectedItem.siswa_parent.pekerjaan_ibu }}</p>
                <p><strong>Penghasilan Ibu:</strong> {{ selectedItem.siswa_parent.penghasilan_ibu }}</p>
              </VCol>
            </VRow>

            <VDivider class="my-4" />

            <VRow>
              <VCol cols="12" md="6">
                <p><strong>Dokumen:</strong></p>
                <VList dense>
                  <VListItem v-if="selectedItem.sekolah.is_need_nem == '1'">
                    <VListItemTitle>Ijazah</VListItemTitle>
                    <VListItemSubtitle><a :href="selectedItem.file_raport" target="_blank">Lihat Ijazah</a></VListItemSubtitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>Kartu Keluarga</VListItemTitle>
                    <VListItemSubtitle><a :href="selectedItem.file_kartu_keluarga" target="_blank">Lihat KK</a></VListItemSubtitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>Akte Lahir</VListItemTitle>
                    <VListItemSubtitle><a :href="selectedItem.file_akte_lahir" target="_blank">Lihat Akta</a></VListItemSubtitle>
                  </VListItem>
                </VList>
              </VCol>

              <VCol cols="12" md="6">
                <p><strong>Pembayaran:</strong></p>
                <p>Tanggal Transaksi: {{ formatDate(selectedItem.payment.tanggal_transaksi) }}</p>

                <!-- Thumbnail -->
                <VImg
                  :src="selectedItem.payment.bukti_transfer"
                  height="120"
                  contain
                  style="cursor: zoom-in"
                  @click="zoomDialog = true"
                />

                <!-- Dialog Zoom -->
                <v-dialog v-model="zoomDialog" max-width="600">
                  <v-card>
                    <v-img
                      :src="selectedItem.payment.bukti_transfer"
                      height="100%"
                      max-height="90vh"
                      contain
                    />
                  </v-card>
                </v-dialog>
              </VCol>
            </VRow>
          </VContainer>
        </VCardText>
        <VCardActions>
          <v-row>
              <v-col cols="6" md="4">
                <v-btn color="success" variant="flat" @click="approvalConfirm(selectedItem,'Approve')" block>Setujui</v-btn>
              </v-col>
              <v-col cols="6" md="4">
                <v-btn color="error" variant="flat" @click="approvalConfirm(selectedItem,'Reject')" block>Tolak</v-btn>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn color="primary" variant="flat" @click="dialogDetail = false;getData()" block>Tutup</v-btn>
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
import PendaftaranUlang from '~/components/PendaftaranUlang.vue';
const { $api } = useNuxtApp()

// State
const loading = ref(false)
const message = ref(null)
const show = ref(false)
const filter = ref({ status: null, keyword: '' })
const activeTab = ref(0)

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
  return code === 'P00' ? 'Menunggu Proses'
    : code === 'P01' ? 'Diterima'
    : code === 'P02' ? 'Ditolak'
    : 'Tidak Diketahui'
}

// Warna status pendaftaran
function getStatusColor(code) {
  return code === 'P00' ? 'warning'
    : code === 'P01' ? 'success'
    : code === 'P02' ? 'error'
    : 'grey'
}

// Ikon status pendaftaran
function getStatusIcon(code) {
  return code === 'P00' ? 'bx-time'
    : code === 'P01' ? 'bx-check-circle'
    : code === 'P02' ? 'bx-x-circle'
    : 'bx-question-mark'
}

// Ambil data dari API
async function getData() {
  loading.value = true
  try {
    const response = await $api.post('/register-ppdb/get-regist',{
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
    const response = await $api.post('/register-ppdb/generate-pdf', data)

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
    const {data} = await $api.get('/register-ppdb/statistik-pendaftar');
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
    const response = await $api.post('/register-ppdb/approval', {
      code_ppdb : data.code_pendaftaran,
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


// Lifecycle
onMounted(() => {
  getData()
  getStat()
})
</script>
