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
      <VCardTitle class="mt-3">Permintaan Formulir Pendaftaran</VCardTitle>
      <VDataTable
        :headers="headers"
        :items="data"
        class="elevation-1"
        :loading="loading"
      >
        <!-- Custom Status Badge -->
        <template #item.status="{ item }">
          <VChip
            :color="getStatusColor(item.is_form_done)"
            class="ma-1"
            dark
          >
            <VIcon left>{{ getStatusIcon(item.is_form_done) }}</VIcon>
            {{ getStatusLabel(item.is_form_done) }}
          </VChip>
        </template>

        <template #item.code_pendaftaran="{ item }" >
          <div style="min-width: 200px;">
            {{ item.code_pendaftaran }}
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

        <template #item.no_handphone="{ item }">
          <div style="min-width: 200px;">
          {{ item.siswa_parent != null ? item.siswa_parent.penanggung_jawab != 'Orang Tua' ? item.siswa_parent.no_hp_wali : 'No WA Ayah : '+ item.siswa_parent.no_hp_ayah + ' | No WA Ibu : '+ item.siswa_parent.no_hp_ibu : '-'}}
          </div>
        </template>

        <template #item.actions="{ item }">

          <div style="min-width: 200px;">
          <VBtn icon color="error" :disabled="item.status_test == '2'" @click="approvalConfirm(item,'2')" :loading="loading" class="mr-2">
            <VIcon>bx-x</VIcon>
          </VBtn>
          <VBtn icon color="success" :disabled="item.status_test == '1'" @click="approvalConfirm(item,'1')" :loading="loading"  class="mr-2">
            <VIcon>bx-check</VIcon>
          </VBtn>
          <VBtn icon color="primary" :loading="loading" @click="showDetail(item)">
            <VIcon>bx-show</VIcon>
          </VBtn>
          </div>
        </template>
      </VDataTable>
    </VCard>

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
        </VCardTitle>

        <VCardText v-if="selectedItem">
          <VContainer>
            <VRow>
              <VCol cols="12" md="8">
                <p><strong>No Formulir:</strong> {{ selectedItem.code_pendaftaran }}</p>
                <p><strong>Nama Siswa:</strong> {{ selectedItem.siswa.nama_depan }} {{ selectedItem.siswa.nama_belakang }}</p>
                <p><strong>Tanggal Lahir:</strong> {{ formatDate(selectedItem.siswa.tgl_lahir) }}</p>
              </VCol>
            </VRow>


            <VDivider class="my-4" />

            <VRow>
              <VCol cols="12">
                <p><strong>Sekolah Tujuan: </strong> {{ selectedItem.sekolah.name }} – {{ selectedItem.sekolah_grade.name }}</p>
                <p><strong>Tanggal Pendaftaran: </strong> {{ formatDate(selectedItem.tanggal_pendaftaran) }}</p>
                <p><strong>Status: </strong>
                  <b :style="`color: ${selectedItem.is_form_done == '0' ? 'orange' : selectedItem.is_form_done == '1' ?  'green' : 'red'}`">{{ selectedItem.is_form_done == '0' ? 'Menunggu Konfirmasi' : selectedItem.is_form_done == '1' ?  'Disetujui' : 'Ditolak' }}</b>
                </p>
              </VCol>
            </VRow>

            <VDivider class="my-4" />

            <VRow>
              <VCol cols="12" md="6">
                <p><strong>Pembayaran:</strong></p>

                <p><strong>Biaya Formulir : </strong> {{ formatRupiah(selectedItem.biaya_admin) }}</p>
                <p><strong>Diskon : </strong> {{ formatRupiah(selectedItem.nominal_diskon) }}</p>
                <p><strong>Total Biaya Formulir : </strong> {{ formatRupiah(selectedItem.biaya_admin - selectedItem.nominal_diskon) }}</p>
                <p>Tanggal Transaksi : {{ formatDate(selectedItem.payment.tanggal_transaksi) }}</p>

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
                <v-btn color="success" variant="flat" @click="approvalConfirm(selectedItem,'1')" block>Setujui</v-btn>
              </v-col>
              <v-col cols="6" md="4">
                <v-btn color="error" variant="flat" @click="approvalConfirm(selectedItem,'2')" block>Tolak</v-btn>
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
// import Pusher from 'pusher-js';
const { $pusher } = useNuxtApp();
import { onMounted, ref } from 'vue';
import ConfirmDialog from '~/components/ConfirmDialog.vue';
const { $api } = useNuxtApp()

// State
const loading = ref(false)
const message = ref(null)
const show = ref(false)

const filter = ref({ 
  status: null, 
  keyword: '' ,
  tanggal_awal: null,
  tanggal_akhir: null,
  tahun_periodik: null
})

const dialogDetail = ref(false)
const selectedItem = ref(null)

// Opsi status
const statusOptions = ['Lulus', 'Tidak Lulus', 'Dalam Proses']

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
  { title: 'Aksi', value: 'actions', sortable: false, width: '200px'},
  { title: 'Kode Pendaftaran', value: 'code_pendaftaran',width: '200px' },
  { title: 'Status', value: 'status' },
  { title: 'Nama Siswa', value: 'name_siswa' },
  { title: 'Email', value: 'email' },
  { title: 'No Handphone', value: 'no_handphone' },
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
  return code === '0' ? 'Menunggu Proses'
    : code === '1' ? 'Disetujui'
    : code === '2' ? 'Tidak disetujui'
    : 'Tidak Diketahui'
}

// Warna status pendaftaran
function getStatusColor(code) {
  return code === '0' ? 'warning'
    : code === '1' ? 'success'
    : code === '2' ? 'error'
    : 'grey'
}

// Ikon status pendaftaran
function getStatusIcon(code) {
  return code === '0' ? 'bx-time'
    : code === '1' ? 'bx-check-circle'
    : code === '2' ? 'bx-x-circle'
    : 'bx-question-mark'
}

// Ambil data dari API
async function getData() {
  loading.value = true
  try {
    const response = await $api.post('/form-req/getdata',{
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

function approvalConfirm(data,type) {
    color.value = type == '1' ? 'success' : 'error';
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
    const { data } = await $api.get('/register-ppdb/statistik-req-form', {
      params: {
        ...filter.value
      }
    })

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
    const response = await $api.post('/form-req/approval', {
      id : data.id,
      status : type
    })

    showSuccess.value = true
    message.value = 'Data berhasil diubah.'
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
    const response = await $api.post('/report/seleksi-ppdb/download-excel', {
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
    const response = await $api.post('/report/seleksi-ppdb/download-bundle', {
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



const formatRupiah = (value) => {
  if (!value) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};



// Lifecycle
onMounted(() => {

  if ($pusher) {
    const channel = $pusher.subscribe('ppdb')
    channel.bind('reqform', (data) => {
      const audio = new Audio('/sound/notifikasi.mp3')
      audio.currentTime = 0
      audio.play()
      getData()
      getStat()
    })
  }
  getTahunPeriodik()
})
</script>
