<script setup lang="ts">

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


function logout () {
  localStorage.clear();
  window.location.href = '/login';
}


const showConfirmDelete = ref(false)
const DataToDelete = ref(null)

function confirmDeleteData() {
  showConfirmDelete.value = true
}
onMounted(() => {
  fetchUser();
}); 
</script>

<template>

  <!-- Dialog konfirmasi hapus -->
  <ConfirmDialog
    :modelValue="showConfirmDelete"
    title="Konfirmasi Hapus"
    :message="`Apakah Anda yakin ingin Logout?`"
    @confirm="logout"
    @cancel="showConfirmDelete = false"
  />
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="profile" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="profile" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{data.nama_depan.toUpperCase() + ' ' +data.nama_belakang.toUpperCase()}}
            </VListItemTitle>
            <VListItemSubtitle>{{data.role_name.toUpperCase()}}</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="bx-user"
                size="22"
              />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Logout -->
          <VListItem @click="confirmDeleteData()">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="bx-log-out"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
