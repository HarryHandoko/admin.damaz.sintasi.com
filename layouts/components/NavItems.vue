
<template>
  <div v-for="navItem in navItems" :key="navItem.id" class="nav-item">
    <VerticalNavLink
      v-if="navItem.submenu.length == 0 && navItem.name !='Logout'"
      :item="{
        title: navItem.name,
        icon: navItem.icon,
        to: navItem.path,
      }"
    />

    <VerticalNavLink
      v-if="navItem.submenu.length == 0 && navItem.name =='Logout'"
      @click="confirmDeleteData()"
      :item="{
        title: navItem.name,
        icon: navItem.icon,
      }"
    />

    <VerticalNavGroup
      v-else-if="navItem.submenu.length > 0"
      :item="{
        title: navItem.name,
        icon: navItem.icon,
      }"
    >
      <VerticalNavLink
        v-for="subItem in navItem.submenu"
        :key="subItem.id"
        :item="{
          title: subItem.name,
          to: subItem.path,
        }"
      />
    </VerticalNavGroup>


    <!-- Dialog konfirmasi hapus -->
    <ConfirmDialog
      :modelValue="showConfirmDelete"
      title="Konfirmasi Hapus"
      :message="`Apakah Anda yakin ingin Logout?`"
      @confirm="logout"
      @cancel="showConfirmDelete = false"
    />
  </div>
</template>
<script lang="ts" setup>
import VerticalNavGroup from "@layouts/components/VerticalNavGroup.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";
import ConfirmDialog from '~/components/ConfirmDialog.vue';

const { $api } = useNuxtApp()
const navItems = ref([]);

async function fetchNavItems() {
  try {
    const response = await $api.get('/users')
    navItems.value = response.data.menu;
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
  fetchNavItems();
}); 
</script>
