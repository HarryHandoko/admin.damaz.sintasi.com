<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2>Menu</h2>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="pagination.itemsPerPage"
      :page="pagination.page"
      :server-items-length="pagination.totalItems"
      :loading="loading"
      class="elevation-1 small-table"
      show-expand
      item-value="id"
      @update:page="onPageChange"
      @update:items-per-page="onPerPageChange"
      hover
      bordered
      :search="filter.search"
    >
      <!-- Top area -->
      <template #top>
        <v-row class="mb-2 pa-4">
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="filter.search"
              label="Cari"
              placeholder="Cari Menu"
            />
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-btn
              color="primary"
              class="float-end"
              @click="showModalDialog(null)"
            >
              <v-icon left>bx bx-plus</v-icon>
              Tambah Menu
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <!-- Expand Button -->
      <template #item.expand="props">
        <v-btn icon class="mr-1" :disabled="props.item.sort == '1'" @click="updateSort(props.item,'up')">
          <v-icon>bx bx-chevron-up</v-icon>
        </v-btn>

        <v-btn icon color="secondary mr-1"  :disabled="items.length == (props.index +1)" @click="updateSort(props.item,'down')">
          <v-icon>bx bx-chevron-down</v-icon>
        </v-btn>

        <v-btn icon color="info" @click="showModalDialog(props.item)">
          <v-icon >bx-plus</v-icon>
        </v-btn>
      </template>
      <!-- Index Number -->
      <template #item.index="props">
        {{ props.index + 1 }}
      </template>
      <!-- Name edit inline -->
      <template #item.name="{ item }">
        <div v-if="editingRow === 'name'+item.id">
          <v-text-field
            v-model="item.name"
            density="compact"
            autofocus
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
            @blur="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit('name'+item.id)" style="cursor:pointer">
          {{ item.name }}
        </div>
      </template>
      <!-- Path edit inline -->
      <template #item.path="{ item }">
        <div v-if="editingRow === 'path'+item.id">
          <v-text-field
            v-model="item.path"
            density="compact"
            autofocus
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
            @blur="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit('path'+item.id)" style="cursor:pointer">
          {{ item.path }}
        </div>
      </template>
      <!-- Icon edit inline -->
      <template #item.icon="{ item }">
        <div v-if="editingRow === 'icon'+item.id">
          <v-text-field
            v-model="item.icon"
            density="compact"
            autofocus
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
            @blur="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit('icon'+item.id)" style="cursor:pointer">
          <v-icon>{{ item.icon }}</v-icon>
        </div>
      </template>
      <!-- Delete -->
      <template #item.aksi="{ item }">
        <v-btn icon color="error" @click="confirmDeleteData(item)">
          <v-icon>bx bx-trash</v-icon>
        </v-btn>
      </template>
      <!-- No data -->
      <template #no-data>
        Tidak ada data.
      </template>
      <!-- Expanded Row for Children -->
      <template #expanded-row="{ columns, item }">
        <tr class="bg-dark">
          <td colspan="2"></td>
          <td :colspan="6" class="pa-2" style="background-color: #f5f5f5;">
            <div v-if="item.children && item.children.length">
              <v-data-table
                :headers="headers"
                :items="item.children"
                item-value="id"
                class="elevation-1"
                style="width: 100%;"
                hide-default-footer
              >
                <template #item.expand="props">
                  <v-btn icon class="mr-1" :disabled="props.item.sort == '1'" @click="updateSort(props.item,'up')">
                    <v-icon>bx bx-chevron-up</v-icon>
                  </v-btn>

                  <v-btn icon color="secondary mr-1"  :disabled="item.children.length == (props.index +1)" @click="updateSort(props.item,'down')">
                    <v-icon>bx bx-chevron-down</v-icon>
                  </v-btn>

                  <v-btn icon color="info">
                    <v-icon >bx-plus</v-icon>
                  </v-btn>
                </template>
                <!-- Index Number -->
                <template #item.index="props">
                  {{ props.index + 1 }}
                </template>
                <!-- Name edit inline -->
                <template #item.name="{ item }">
                  <div v-if="editingRow === 'name'+item.id">
                    <v-text-field
                      v-model="item.name"
                      density="compact"
                      autofocus
                      hide-details
                      @keydown.enter="saveEdit(item)"
                      @keydown.esc="cancelEdit"
                      @blur="cancelEdit"
                    />
                  </div>
                  <div v-else @click="startEdit('name'+item.id)" style="cursor:pointer">
                    {{ item.name }}
                  </div>
                </template>
                <!-- Path edit inline -->
                <template #item.path="{ item }">
                  <div v-if="editingRow === 'path'+item.id">
                    <v-text-field
                      v-model="item.path"
                      density="compact"
                      autofocus
                      hide-details
                      @keydown.enter="saveEdit(item)"
                      @keydown.esc="cancelEdit"
                      @blur="cancelEdit"
                    />
                  </div>
                  <div v-else @click="startEdit('path'+item.id)" style="cursor:pointer">
                    {{ item.path }}
                  </div>
                </template>
                <!-- Icon edit inline -->
                <template #item.icon="{ item }">
                  <v-icon>bx bx-menu</v-icon>
                </template>
                <!-- Delete -->
                <template #item.aksi="{ item }">
                  <v-btn icon color="error" @click="confirmDeleteData(item)">
                    <v-icon>bx bx-trash</v-icon>
                  </v-btn>
                </template>
                <template #no-data>
                  Tidak ada submenu.
                </template>
              </v-data-table>
            </div>
            <div v-else class="pa-4">
              <i>Tidak ada submenu.</i>
            </div>
          </td>
        </tr>
      </template>



    </v-data-table>

    <!-- Dialog tambah menu -->
    <v-dialog v-model="showCreateModal" max-width="400" persistent>
      <v-card>
        <v-card-title class="pa-6">
          <span class="headline">Form Menu</span>
        </v-card-title>
        <v-form v-model="valid" @submit.prevent="handleCreateData">
        <v-card-text style="margin-top: -30px;">
            <v-text-field
              v-model="form.name"
              label="Nama Menu"
              required
              class="mb-2"
              :rules="[v => !!v || 'Nama harus diisi']"
            />

            <v-text-field
              v-model="form.path"
              label="Path Url"
              required
              class="mb-2"
              :rules="[v => !!v || 'Path harus diisi']"
            />

            <v-text-field
              v-model="form.icon"
              label="Icon"
              required
              class="mb-2"
              :rules="[v => !!v || 'Icon harus diisi']"
            >
              <template #append-inner>
                <i :class="form.icon"></i>
              </template>
            </v-text-field>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" variant="text" @click="showCreateModal = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" :disabled="!valid || loading" type="submit" :loading="loading">Simpan</v-btn>
        </v-card-actions>

        </v-form>
      </v-card>
    </v-dialog>

    <!-- Snackbar error -->
    <v-snackbar v-model="show" color="error" timeout="3000">
      {{ message }}
    </v-snackbar>

    <!-- Dialog konfirmasi hapus -->
    <ConfirmDialog
      :modelValue="showConfirmDelete"
      title="Konfirmasi Hapus"
      :message="`Apakah Anda yakin ingin menghapus Menu ${DataToDelete?.name}?`"
      @confirm="handleDeleteData"
      @cancel="showConfirmDelete = false"
    />
  </v-card>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'

const { $api } = useNuxtApp()
const headers = [
  { title: '', value: 'expand', width: '200px' },
  { title: 'No', value: 'index', sortable: false, align: 'start', width: '50px' },
  { title: 'Nama', value: 'name', sortable: true },
  { title: 'Path', value: 'path', sortable: true },
  { title: 'Icon', value: 'icon', sortable: true },
  { title: '', value: 'aksi', sortable: false, align: 'end' },
]

const items = ref([])
const loading = ref(false)
const showCreateModal = ref(false)

const pagination = reactive({
  itemsPerPage: 10,
  page: 1,
  totalItems: 0,
})
const filter = reactive({
  search: '',
})

const form = reactive({
  name: '',
  path: null,
  icon: null,
  parent_id : 0,
})
const valid = ref(true);

const show = ref(false)
const message = ref('')

const editingRow = ref(null)

const showConfirmDelete = ref(false)
const DataToDelete = ref(null)

function confirmDeleteData(Data) {
  DataToDelete.value = Data
  showConfirmDelete.value = true
}

function startEdit(item) {
  editingRow.value = item
}

async function saveEdit(item) {
  loading.value = true
  try {
    const response = await $api.post('/menu/update', {
      ...item,
    })
    message.value = response.data.message
  } catch (error) {
    message.value = error.response?.data?.message
  } finally {
    loading.value = false
    editingRow.value = null
    getData() // Refresh data setelah edit
  }
}

function cancelEdit() {
  editingRow.value = ''
}

function showModalDialog (data) {
  showCreateModal.value = true;
  form.name = null;
  form.icon = null;
  form.path = data != null ? data.path : 0;
  form.parent_id = data != null ? data.id : 0 ;
}

watch([() => pagination.itemsPerPage, () => pagination.page], () => {
  getData()
})

const onPageChange = (newPage) => {
  pagination.page = newPage
  getData()
}

const onPerPageChange = (newPerPage) => {
  pagination.itemsPerPage = newPerPage
  pagination.page = 1
  getData()
}

async function getData() {
  loading.value = true
  try {
    const response = await $api.get('/menu/get', {
      params: {
        page: pagination.page,
        perPage: pagination.itemsPerPage,
        search: filter.search,
      },
    })
    items.value = response.data.data // Pastikan sudah return children!
    pagination.totalItems = response.data.total
    pagination.page = response.data.currentPage
    pagination.itemsPerPage = response.data.perPage
    pagination.totalItems = response.data.total
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message
  } finally {
    loading.value = false
  }
}

async function handleCreateData() {
  loading.value = true
  if (!form.name) {
    show.value = true
    message.value = 'Nama Menu tidak boleh kosong.'
    loading.value = false
    return
  }

  try {
    await $api.post('/menu/post', form)
    showCreateModal.value = false
    form.name = ''
    getData()
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal membuat Menu.'
  } finally {
    loading.value = false
  }
}

async function handleDeleteData() {
  loading.value = true
  try {
    await $api.post(`/menu/delete`,{
      id: DataToDelete.value.id,
    })
    getData()
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal menghapus Menu.'
  } finally {
    loading.value = false
    showConfirmDelete.value = false
    DataToDelete.value = null
  }
}


async function updateSort (item,type){
  loading.value = true
  try {
    await $api.post(`/menu/update-sort`,{
      id: item.id,
      type: type
    })
    getData()
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal Mengupdate Menu.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getData()
})

</script>
