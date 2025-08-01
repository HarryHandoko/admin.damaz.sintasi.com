<script setup>
import illustrationJohnDark from '@images/cards/illustration-john-dark.png'
import illustrationJohnLight from '@images/cards/illustration-john-light.png'
import { useTheme } from 'vuetify'
const router = useRouter()
const { global } = useTheme()
const illustrationJohn = computed(() => global.name.value === 'dark' ? illustrationJohnDark : illustrationJohnLight)


const { $api } = useNuxtApp()
const data = ref(null)
const profile = ref(null);

async function fetchUser() {
  try {
    const response = await $api.get('/users')
    data.value = response.data;
    profile.value = response.data.foto_profile ?? '/no-image.jpg'
  } catch (error) {
  }
}

onMounted(() => {
  fetchUser();
}); 
</script>

<template>
  <VCard class="text-center text-sm-start">
    <VRow no-gutters>
      <VCol
        cols="12"
        sm="8"
        order="2"
        order-sm="1"
      >
        <VCardItem class="pb-3">
          <VCardTitle class="text-primary">
            Selamat Datang, {{data?.nama_depan}}! 🎉
          </VCardTitle>
        </VCardItem>

        <VCardText>

            {{data?.role_name == 'Admin' ? 'Admin panel untuk manajemen konten website sekolah dan penerimaan peserta didik baru' 
            : 'Wesbite Pendaftaran Peserta Didik Baru'}}
           <br>
          <VBtn
            variant="tonal"
            class="mt-1"
            size="small"
            @click="data?.role_name == 'Admin' ? router.push('/ppdb') : router.push('/pendaftaran')"
          >
            {{data?.role_name == 'Admin' ? 'Cek Pendaftaran' : 'Daftar Sekarang'}}
          </VBtn>
        </VCardText>
      </VCol>

      <VCol
        cols="12"
        sm="4"
        order="1"
        order-sm="2"
        class="text-center"
      >
        <img
          :src="illustrationJohn"
          :height="$vuetify.display.xs ? '150' : '182'"
          :class="$vuetify.display.xs ? 'mt-6 mb-n2' : 'position-absolute'"
          class="john-illustration flip-in-rtl"
        >
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss" scoped>
.john-illustration {
  inset-block-end: -0.125rem;
  inset-inline-end: 3.5rem;
}
</style>
