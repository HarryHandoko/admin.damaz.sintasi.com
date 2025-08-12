<template>
  <VRow>
    <!-- 👉 Congratulations -->
    <VCol
      cols="12"
    >
      <AnalyticsCongratulations />
    </VCol>
  </VRow>



  <!-- Statistik Cards -->
  <VRow class="mb-6">
    <VCol cols="12" sm="6" md="3" v-for="(card, index) in statsCards" :key="index">
      <VCard class="text-center" :style="`background-color: ${card.bgColor}; color: ${card.textColor}`">
        <VCardText>
          <VIcon size="36" class="mb-2">{{ card.icon }}</VIcon>
          <div class="text-h6" :style="`color:${card.textColor}`">{{ card.title }}</div>
          <div class="text-h4 font-weight-bold" :style="`color:${card.textColor}`">{{ card.count }}</div>
        </VCardText>
      </VCard>
    </VCol>

    <v-col cols="12">
      <v-card class="pa-4">
        <h2>Jumlah Pendaftar per Tahun</h2>
        <apexchart
          type="line"
          height="350"
          :options="chartOptions"
          :series="chartSeries"
        />
      </v-card>
    </v-col>
  </VRow>
</template>
<script setup>

const { $api } = useNuxtApp()

// Kartu statistik
const statsCards = ref([
  { title: 'Total Pendaftar', count: 0, bgColor: '#E3F2FD', textColor: '#1E88E5', icon: 'bx-user' },
  { title: 'Diterima', count: 0, bgColor: '#E8F5E9', textColor: '#43A047', icon: 'bx-check-circle' },
  { title: 'Ditolak', count: 0, bgColor: '#FFEBEE', textColor: '#E53935', icon: 'bx-x-circle' },
  { title: 'Dalam Proses', count: 0, bgColor: '#FFF8E1', textColor: '#FB8C00', icon: 'bx-time' }
])


const loading = ref(false);
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

async function getPertahun() {
  loading.value = true
  try {
    const { data } = await $api.post('/dashboard/analitic-total-per-tahun')

    // Map data tahun dan total pendaftar
    years.value = data.map(item => item.year)
    totalPendaftar.value = data.map(item => item.total)

    // Update chart data dan options sekaligus
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
    show.value = true
    message.value = 'Server Error.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getStat()
  getPertahun()
})
</script>
