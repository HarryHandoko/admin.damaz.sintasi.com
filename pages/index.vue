<template>
  <VRow v-if="dataAccount != null">
    <!-- 👉 Congratulations -->
    <VCol cols="12">
      <AnalyticsCongratulations />
    </VCol>

    <!-- Statistik Cards -->
    <VCol cols="12" sm="6" md="3" v-for="(card, index) in statsCards" :key="index" >
      <VCard class="text-center" :style="`background-color: ${card.bgColor}; color: ${card.textColor}`">
        <VCardText>
          <VIcon size="36" class="mb-2">{{ card.icon }}</VIcon>
          <div class="text-h6" :style="`color:${card.textColor}`">{{ card.title }}</div>
          <div class="text-h4 font-weight-bold" :style="`color:${card.textColor}`">{{ card.count }}</div>
        </VCardText>
      </VCard>
    </VCol>


    <v-col cols="12" v-if="dataAccount.role_name != 'Pendaftar'">
      <v-card class="pa-4 mb-6">
        <h2>Jumlah Pendaftar per Tahun</h2>
        <apexchart
          type="line"
          height="350"
          :options="chartOptions"
          :series="chartSeries"
        />
      </v-card>
    </v-col>



    <v-col cols="12" md="6" v-if="dataAccount.role_name != 'Pendaftar'">
      <v-card class="pa-4 mb-6">
        <h3>Filter Data Per Tahun</h3>
        <v-form @submit.prevent="onFilter">
          <v-row align="center" dense>
            <v-col cols="8">
              <v-select
                v-model="selectedYear"
                :items="tahun"
                label="Pilih Tahun"
                dense
                outlined
                required
              />
            </v-col>
            <v-col cols="4">
              <v-btn type="submit" color="primary" block>Filter</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>

    <v-col cols="12" md="6" v-if="dataAccount.role_name != 'Pendaftar'"></v-col>


    <!-- Chart Jumlah Pendaftar per Tahun (existing) -->
    <v-col cols="12" md="6" v-if="dataAccount.role_name != 'Pendaftar'">
      <v-card class="pa-4 mb-6">
          <h2>Jumlah Pendaftar per Unit</h2>
          <apexchart
            type="bar"
            height="350"
            :options="chartOptionsPerunit"
            :series="chartSeriesPerunit"
          />
      </v-card>
    </v-col>


    <!-- Chart: Jumlah Pendaftar per Jenis Kelamin -->
    <v-col cols="12" md="6" v-if="dataAccount.role_name != 'Pendaftar'">
      <v-card class="pa-4 mb-6">
        <h2>Jumlah Pendaftar per Jenis Kelamin</h2>
        <apexchart
          type="pie"
          height="400"
          :options="genderChartOptions"
          :series="genderChartSeries"
        />
      </v-card>
    </v-col>

    <!-- Chart: Distribusi Status Pendaftar -->
    <!-- <v-col cols="12" md="6">
      <v-card class="pa-4 mb-6">
        <h2>Distribusi Status Pendaftar</h2>
        <apexchart
          type="donut"
          height="400"
          :options="statusChartOptions"
          :series="statusChartSeries"
        />
      </v-card>
    </v-col> -->
  </VRow>
</template>

<script setup>
import AnalyticsCongratulations from '@/views/dashboard/AnalyticsCongratulations.vue';
import { onMounted, ref } from 'vue';
const { $api } = useNuxtApp()

// === Data dan fungsi yang sudah ada TIDAK DIUBAH ===
// Statistik Cards
const statsCards = ref([
  { title: 'Total Pendaftar', count: 0, bgColor: '#E3F2FD', textColor: '#1E88E5', icon: 'bx-user' },
  { title: 'Diterima', count: 0, bgColor: '#E8F5E9', textColor: '#43A047', icon: 'bx-check-circle' },
  { title: 'Ditolak', count: 0, bgColor: '#FFEBEE', textColor: '#E53935', icon: 'bx-x-circle' },
  { title: 'Dalam Proses', count: 0, bgColor: '#FFF8E1', textColor: '#FB8C00', icon: 'bx-time' }
])

const loading = ref(false);

const currentYear = new Date().getFullYear()
const tahun = Array.from({ length: 10 }, (_, i) => currentYear - i) // 10 tahun ke belakang

const selectedYear = ref(currentYear)

function onFilter() {
  getPertahunUnit()
  getGenderChartData();
}

const years = ref([])
const totalPendaftar = ref([])

const chartSeries = ref([])
const chartOptions = ref({
  chart: {
    height: 350,
    type: "area",
    zoom: { enabled: false }
  },
  dataLabels: {
    enabled: true
  },
  stroke: {
    curve: "smooth"
  },
  xaxis: {
    categories: []
  },
  markers: {
    size: 5
  },
  colors: ["#1E90FF"],
  legend: {
    position: "bottom",
    horizontalAlign: "right"
  }
})

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
  } finally {
  }
}

async function getPertahun() {
  loading.value = true
  try {
    const { data } = await $api.post('/dashboard/analitic-total-per-tahun')

    years.value = data.map(item => item.year)
    totalPendaftar.value = data.map(item => item.total)

    chartSeries.value = [
      { name: "Total Pendaftar", data: totalPendaftar.value }
    ]
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: years.value
      }
    }

  } catch (error) {
  } finally {
    loading.value = false
  }
}


const chartSeriesPerunit = ref([
  {
    name: 'Jumlah Pendaftar',
    data: [0,0,0] // SD, SMP, TK
  }
])

const chartOptionsPerunit = ref({
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      borderRadius: 4,
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '14px',
      colors: ['#000']
    }
  },
  xaxis: {
    categories: ['SD', 'SMP', 'TK'],
    labels: {
      style: {
        fontSize: '14px'
      }
    }
  },
  yaxis: {
    title: {
      text: 'Jumlah Pendaftar',
      style: { fontSize: '14px' }
    },
    min: 0
  },
  colors: ['#1E90FF']
})

async function getPertahunUnit() {
  loading.value = true
  try {
    const { data } = await $api.post('/dashboard/analitic-total-per-unit',{
      tahun : selectedYear.value
    })
    const categories = data.data.map(item => item.unit)
    const totals = data.data.map(item => item.total)

    chartSeriesPerunit.value = [
      {
        name: 'Jumlah Pendaftar',
        data: totals
      }
    ]

    chartOptionsPerunit.value = {
      ...chartOptionsPerunit.value,
      xaxis: {
        ...chartOptionsPerunit.value.xaxis,
        categories: categories
      }
    }

  } catch (error) {
  } finally {
    loading.value = false
  }
}



const statusChartSeries = ref([600, 250, 150])
const statusChartOptions = ref({
  labels: ['Diterima', 'Ditolak', 'Dalam Proses'],
  colors: ['#43A047', '#E53935', '#FB8C00'],
  legend: { position: 'bottom' },
  responsive: [{
    breakpoint: 480,
    options: { legend: { position: 'bottom' } }
  }]
})

const genderChartSeries = ref([0,0])
const genderChartOptions = ref({
  labels: ['Laki-laki', 'Perempuan'],
  colors: ['#1976D2', '#E91E63'],
  legend: { position: 'bottom' },
  responsive: [{
    breakpoint: 480,
    options: { legend: { position: 'bottom' } }
  }]
})

async function getGenderChartData() {
  loading.value = true
  try {
    const { data } = await $api.post('/dashboard/analitic-total-per-gender', {
      tahun: selectedYear.value,
    })

    const totals = data.data.map(item => item.value)
    genderChartSeries.value = totals

  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const dataAccount = ref(null);
// Fetch Data User
async function fetchUser() {
  try {
    const { data } = await $api.get('/users')
    dataAccount.value = data
  } catch (error) {
    console.error(error)
  }
}


onMounted(() => {
  fetchUser()
  getStat()
  getPertahun()
  getPertahunUnit()
  getGenderChartData()
})
</script>
