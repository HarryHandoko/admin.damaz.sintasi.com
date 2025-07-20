<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2>Roles</h2>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="paggionation.itemsPerPage"
      :page="paggionation.page"
      :server-items-length="paggionation.totalItems"
      :loading="loading"
      class="elevation-1 small-table"
      @update:page="onPageChange"
      @update:items-per-page="onPerPageChange"
      hover
      bordered
      :search="filter.search"
    >
      <template #top>
        <v-row class="mb-2 pa-4">
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-text-field
              v-model="filter.search"
              label="Cari"
              placeholder="Cari nama atau email"
            />
          </v-col>

          <v-col cols="12" sm="12" md="6" lg="6">
            <v-btn
              color="primary"
              class="float-end"
              @click="showCreateModal = true"
            >
              <v-icon left>bx bx-plus</v-icon>
              Tambah Role
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template #item.index="props">
        {{ props.index + 1 }}
      </template>
      <template #no-data>
        Tidak ada data. 
      </template>

      <template #item.aksi="{ item }">
        <!-- <v-btn icon @click="$emit('edit-role', item)" class="mr-1">
          <v-icon>bx bx-edit</v-icon>
        </v-btn> -->

        <v-btn icon color="primary" class="mr-1" @click="showMenuPermission(item)">
          <v-icon>bx bx-shield</v-icon>
        </v-btn>
        <v-btn icon color="error" @click="confirmDeleteRole(item)">
          <v-icon>bx bx-trash</v-icon>
        </v-btn>
      </template>

      <template #item.name="{ item }">
        <div v-if="editingRow === item.id">
          <v-text-field
            v-model="editingValue"
            density="compact"
            autofocus
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit(item)" style="cursor:pointer">
          {{ item.name }}
        </div>
      </template>
    </v-data-table>
  </v-card>


  <v-dialog v-model="showCreateModal" max-width="400" persistent>
    <v-card>
      <v-card-title class="pa-6">
        <span class="headline">Form Role</span>
      </v-card-title>
      <v-card-text style="margin-top: -30px;">
        <v-form>
          <v-text-field
            v-model="form.name"
            label="Nama Role"
            required
            autofocus
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-grey" variant="text" @click="showCreateModal = false">Batal</v-btn>
        <v-btn color="primary" variant="flat" @click="handleCreateRole" :loading="loading">Simpan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <v-dialog v-model="modalMenuPermission" max-width="500" persistent>
  <v-card>
    <v-card-title class="pa-6">
      <span class="headline">Hak Akses Menu</span>
    </v-card-title>
    <v-card-text style="margin-top: -30px;">
      <v-table hoverable>
        <thead>
          <tr>
            <th>Menu</th>
            <th style="width: 60px;">Akses</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="menu in menuList">
            <template v-for="row in renderMenuRowsWithExpand(menu)">
              <tr>
                <td :style="{ paddingLeft: `${row.level * 24}px` }" @click.stop="toggleExpand(row.menu.id)" 
                      style="cursor: pointer;">
                  <!-- Expand/Collapse Icon -->
                  <template v-if="row.menu.submenu && row.menu.submenu.length">
                    <v-icon
                      small
                      class="mr-2"
                    >{{ expandedMenus.includes(row.menu.id) ? 'bx bx-chevron-down' : 'bx bx-chevron-right' }}</v-icon>
                  </template>
                  {{ row.menu.name }}
                </td>
                <td>
                  <v-checkbox
                    v-model="form.permissions"
                    :value="row.menu.id"
                    color="primary"
                    hide-details
                    class="mt-0"
                  />
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-grey" variant="text" @click="modalMenuPermission = false">Batal</v-btn>
      <v-btn color="primary" variant="flat" @click="handlePermissionData()" :loading="loading">Simpan</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>





  <v-snackbar v-model="show" color="error" timeout="3000">
    {{ message }}
  </v-snackbar>

  <ConfirmDialog
    :modelValue="showConfirmDelete"
    title="Konfirmasi Hapus"
    :message="`Apakah Anda yakin ingin menghapus role ${roleToDelete?.name}?`"
    @confirm="handleDeleteRole"
    @cancel="showConfirmDelete = false"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'

const { $api } = useNuxtApp()
const headers = [
  { title: 'No', value: 'index', sortable: true, align: 'start', width: '50px' },
  { title: 'Nama', value: 'name', sortable: true },
  { title: '', value: 'aksi', sortable: true, align: 'end' },
]

const items = ref([])
const loading = ref(false)
const perPageOptions = [5, 10, 25, 50]
const showCreateModal = ref(false)
const modalMenuPermission = ref(false)
const menuList = ref([]);

const paggionation = reactive({
  itemsPerPage: 10,
  page: 1,
  totalItems: 0,
})
const filter = reactive({
  search: '',
})

const form = reactive({
  name: '',
  permissions: [],
  id: null,
})

const show = ref(false)
const message = ref('')

const editingRow = ref(null)   // Simpan id/row yang sedang di-edit
const editingValue = ref('') // Simpan nilai yang sedang di-edit

const showConfirmDelete = ref(false)
const expandedMenus = ref([]) // Track expanded menu IDs
const roleToDelete = ref(null)

function confirmDeleteRole(role) {
  roleToDelete.value = role
  showConfirmDelete.value = true
}

function startEdit(item) {
  editingRow.value = item.id
  editingValue.value = item.name
}

async function saveEdit(item) {
  loading.value = true
  try {
    const response = await $api.post('/roles/update', {
      id: editingRow.value,
      name: editingValue.value,
    })
    message.value = response.data.message
  } catch (error) {
    message.value = error.response?.data?.message
  } finally {
    loading.value = false
    editingRow.value = null
    editingValue.value = ''
    getData() // Refresh data setelah edit
  }
}

function cancelEdit() {
  editingRow.value = null
  editingValue.value = ''
}

watch([paggionation.itemsPerPage, paggionation.page], () => {
  // Jika fetch dari API, panggil fetchData() di sini
})

const onPageChange = (newPage) => {
  paggionation.page = newPage
  // fetchData() jika perlu
  getData()
}

const onPerPageChange = (newPerPage) => {
  paggionation.itemsPerPage = newPerPage
  paggionation.page = 1
  // fetchData() jika perlu

  getData()
}

async function getData() {
  loading.value = true
  try {
    const response = await $api.get('/roles/get', {
      params: {
        page: paggionation.page,
        perPage: paggionation.itemsPerPage,
        search: filter.search,
      },
    })
    items.value = response.data.data
    paggionation.totalItems = response.data.total
    paggionation.page = response.data.currentPage
    paggionation.itemsPerPage = response.data.perPage
    paggionation.totalItems = response.data.total
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message
  } finally {
    loading.value = false
  }
}


async function handleCreateRole() {
  loading.value = true
  if (!form.name) {
    show.value = true
    message.value = 'Nama role tidak boleh kosong.'
    return
  }

  try {
    await $api.post('/roles/post', form)
    showCreateModal.value = false
    form.name = ''
    getData()
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal membuat role.'
  } finally {
    loading.value = false
  }
}



async function handleDeleteRole() {
  loading.value = true
  try {
    await $api.post(`/roles/delete`,{
      id: roleToDelete.value.id,
    })
    getData()
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal menghapus role.'
  } finally {
    loading.value = false
    showConfirmDelete.value = false
    roleToDelete.value = null
  }
}

function collectCheckedIds(menus) {
  let ids = []
  menus.forEach(menu => {
    if (menu.checked) ids.push(menu.id)
    if (menu.submenu && menu.submenu.length) {
      ids = ids.concat(collectCheckedIds(menu.submenu))
    }
  })
  return ids
}



async function getMenu(item) {
  loading.value = true
  try {
    const res = await $api.post(`/roles/get-menu`, {
      id: item.id,
    })
    menuList.value = res.data.menu || []
    form.permissions = collectCheckedIds(menuList.value)
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal Mendapatkan data.'
  } finally {
    loading.value = false
  }
}


async function handlePermissionData() {
  loading.value = true
  try {
    const res = await $api.post(`/roles/set-permission`, {
      id : form.id,
      permission : form.permissions
    })
    modalMenuPermission.value = false
    getData()
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal Update data.'
  } finally {
    loading.value = false
  }
}


function showMenuPermission (item){
  getMenu(item)
  modalMenuPermission.value = true
  form.id = item.id
}




// Toggle expand/collapse for menus
function toggleExpand(menuId) {
  const idx = expandedMenus.value.indexOf(menuId)
  if (idx === -1) {
    expandedMenus.value.push(menuId)
  } else {
    expandedMenus.value.splice(idx, 1)
  }
}

// Recursively build rows with nesting and expansion state
function renderMenuRowsWithExpand(menu, level = 0) {
  let rows = [{ menu, level }]
  if (menu.submenu && expandedMenus.value.includes(menu.id)) {
    for (const child of menu.submenu) {
      rows = rows.concat(renderMenuRowsWithExpand(child, level + 1))
    }
  }
  return rows
}

onMounted(() => {
  getData()
})

</script>
