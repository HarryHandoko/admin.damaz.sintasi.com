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
  </VRow>
</template>
<script setup>
import AnalyticsCongratulations from '@/views/dashboard/AnalyticsCongratulations.vue';

const { $api } = useNuxtApp()

// Kartu statistik
const statsCards = ref([
  { title: 'Total Pendaftar', count: 0, bgColor: '#E3F2FD', textColor: '#1E88E5', icon: 'bx-user' },
  { title: 'Diterima', count: 0, bgColor: '#E8F5E9', textColor: '#43A047', icon: 'bx-check-circle' },
  { title: 'Ditolak', count: 0, bgColor: '#FFEBEE', textColor: '#E53935', icon: 'bx-x-circle' },
  { title: 'Dalam Proses', count: 0, bgColor: '#FFF8E1', textColor: '#FB8C00', icon: 'bx-time' }
])



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

onMounted(() => {
  getStat()
})
</script>
