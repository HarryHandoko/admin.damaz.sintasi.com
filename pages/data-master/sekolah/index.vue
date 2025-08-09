<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2>Sekolah</h2>
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
              placeholder="Cari Sekolah"
            />
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-btn
              color="primary"
              class="float-end"
              @click="showModalDialog(null,null)"
            >
              <v-icon left>bx bx-plus</v-icon>
              Tambah Sekolah
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <!-- Index Number -->
      <template #item.index="props">
        {{ props.index + 1 }}
      </template>
      <!-- Name edit inline -->
      <template #item.name="{ item }">
        <div v-if="editingRow === 'name-sekolah'+item.id">
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
        <div v-else @click="startEdit('name-sekolah'+item.id)" style="cursor:pointer">
          {{ item.name }}
        </div>
      </template>
      <!-- biaya_admin edit inline -->
      <template #item.biaya_admin="{ item }">
        <div v-if="editingRow === 'biaya_admin'+item.id">
          <v-text-field
            v-model="item.biaya_admin"
            density="compact"
            autofocus
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
            @blur="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit('biaya_admin'+item.id)" style="cursor:pointer">
         {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' ,minimumFractionDigits: 0, maximumFractionDigits: 0  }).format(item.biaya_admin) }}
        </div>
      </template>
      <!-- biaya_pendaftaran edit inline -->
      <template #item.biaya_pendaftaran="{ item }">
        <div v-if="editingRow === 'biaya_pendaftaran'+item.id">
          <v-text-field
            v-model="item.biaya_pendaftaran"
            density="compact"
            autofocus
            hide-details
            @keydown.enter="saveEdit(item)"
            @keydown.esc="cancelEdit"
            @blur="cancelEdit"
          />
        </div>
        <div v-else @click="startEdit('biaya_pendaftaran'+item.id)" style="cursor:pointer">
          {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR',minimumFractionDigits: 0, maximumFractionDigits: 0  }).format(item.biaya_pendaftaran) }}
        </div>
      </template>


      <template #item.logo="{item}">
        <div 
            style="cursor: pointer;height:80px;width:80px;" class="pa-2">
          <v-img
            :src="item.logo ? item.logo : '/no-image.jpg'"
            cover
            style="border-radius:80px"
          />
        </div>
      </template>
      <!-- Delete -->
      <template #item.aksi="{ item }">
        <v-btn icon color="error" @click="confirmDeleteData(item,'sekolah')">
          <v-icon>bx bx-trash</v-icon>
        </v-btn>

        <v-btn icon color="secondary" class="ml-2" @click="showModalDialog(item,'edit')">
          <v-icon >bx-edit</v-icon>
        </v-btn>

        <v-btn icon color="info" class="ml-2" @click="showModalDialog(item,'adding-grade')">
          <v-icon >bx-plus</v-icon>
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
            <div v-if="item.grade && item.grade.length">
              <v-data-table
                :headers="headersSub"
                :items="item.grade"
                item-value="id"
                class="elevation-1"
                style="width: 100%;"
                hide-default-footer
              >
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
                      @keydown.enter="saveGradeEdit(item)"
                      @keydown.esc="cancelEdit"
                      @blur="cancelEdit"
                    />
                  </div>
                  <div v-else @click="startEdit('name'+item.id)" style="cursor:pointer">
                    {{ item.name }}
                  </div>
                </template>
                <!-- Path edit inline -->
                <template #item.nama_sekolah="{ item }">
                  <div style="cursor:pointer">
                    {{ item.nama_sekolah }}
                  </div>
                </template>
                <!-- Icon edit inline -->
                <template #item.icon="{ item }">
                  <v-icon>bx bx-menu</v-icon>
                </template>
                <!-- Delete -->
                <template #item.aksi="props">
                  <v-btn icon class="mr-1" :disabled="props.item.sort == '1'" @click="updateSort(props.item,'up')">
                    <v-icon>bx bx-chevron-up</v-icon>
                  </v-btn>

                  <v-btn icon color="secondary mr-1"  :disabled="item.grade.length == (props.index +1)" @click="updateSort(props.item,'down')">
                    <v-icon>bx bx-chevron-down</v-icon>
                  </v-btn>

                  <v-btn icon color="error" @click="confirmDeleteData(props.item,'grade')">
                    <v-icon>bx bx-trash</v-icon>
                  </v-btn>
                </template>
                <template #no-data>
                  Tidak ada Grade
                </template>
              </v-data-table>
            </div>
            <div v-else class="pa-4">
              <i>Tidak ada Grade</i>
            </div>
          </td>
        </tr>
      </template>



    </v-data-table>

    <!-- Dialog tambah menu -->
    <v-dialog v-model="showCreateModal" max-width="700" persistent>
      <v-card>
        <v-card-title class="pa-6">
          <span class="headline">Form {{ (form.sekolah_id == null || form.sekolah_id == '') ? 'Sekolah' : 'Grade' }}</span>
        </v-card-title>
        <v-form v-model="valid" @submit.prevent="handleCreateData">
        <v-card-text style="margin-top: -30px;">
            <v-col cols="12" sm="12" stlye="padding:0" v-if="(form.sekolah_id == null || form.sekolah_id == '')">
              <div v-if="fotoPreview" class="mt-2 text-center">
                <img
                  :src="fotoPreview"
                  alt="Preview Foto"
                  style="width: 120px; height: 120px; object-fit: cover; border-radius: 50%; border: 2px solid #eee;"
                />
              </div>
              <v-file-input
                label="Upload Foto"
                accept="image/*"
                show-size
                @change="handleFotoChange"
                class="mb-4"
              />
            </v-col>

            <v-text-field
              v-model="form.name"
              :label="(form.sekolah_id == null || form.sekolah_id == '') ? 'Nama Sekolah' : 'Nama Grade'"
              required
              class="mb-4"
              :rules="[v => !!v || 'From harus diisi']"
            />


            <v-text-field
              v-if="(form.sekolah_id == null || form.sekolah_id == '')"
              v-model="form.code_formulir"
              :label="'Kode Formulir'"
              required
              class="mb-4"
              :rules="[v => !!v || 'From harus diisi']"
            />


            <v-text-field
              v-if="(form.sekolah_id == null || form.sekolah_id == '')"
              v-model="form.slug"
              :label="'Slug'"
              required
              class="mb-4"
              :rules="[v => !!v || 'From harus diisi']"
            />

            <v-text-field
              v-model="form.biaya_admin"
              label="Biaya admin"
              required
              type="number"
              class="mb-4"
              :rules="[v => !!v || 'Biaya admin harus diisi']"
              v-if=" (form.sekolah_id == null || form.sekolah_id == '')"
            />


            <v-text-field
              v-model="form.biaya_pendaftaran"
              label="Biaya Pendaftaran"
              required
              type="number"
              class="mb-4"
              :rules="[v => !!v || 'Biaya Pendaftaran harus diisi']"
              v-if=" (form.sekolah_id == null || form.sekolah_id == '')"
            />


            <v-col cols="12">
              <v-switch
                v-model="form.is_need_nem"
                inset
                label="Apakah Menggunakan NEM?"
                color="success"
                hide-details
                v-if=" (form.sekolah_id == null || form.sekolah_id == '')"
              />
            </v-col>


            <v-col cols="12">
              <v-switch
                v-model="form.is_need_test"
                inset
                label="Apakah Membutuhkan Seleksi Test?"
                color="success"
                hide-details
                v-if=" (form.sekolah_id == null || form.sekolah_id == '')"
              />
            </v-col>

            <v-col cols="12" sm="12" stlye="padding:0" v-if="(form.sekolah_id == null || form.sekolah_id == '')">
              <div v-if="fotoPreviewSekolah" class="mt-2 text-center">
                <img
                  :src="fotoPreviewSekolah"
                  alt="Preview Foto"
                  style="width: auto; height: 120px; object-fit: cover; border-radius: 5%; border: 2px solid #eee;"
                />
              </div>
              <v-file-input
                label="Upload Foto"
                accept="image/*"
                show-size
                @change="handleFotoChangeSekolah"
                class="mb-4"
              />
            </v-col>

            <v-col cols="12" class="mb-11" v-if="(form.sekolah_id == null || form.sekolah_id == '')">
              <label style="font-weight:500;display:block;margin-bottom:4px;">Konten</label>
              <QuillEditor
                  v-model:content="form.kontent"
                  contentType="html"
                  class="quill-responsive"
                  :toolbar="[
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ header: [1, 2, 3, false] }],
                    [{ list: 'ordered'}, { list: 'bullet' }],
                    [{ align: [] }],
                    ['link', 'image'],
                    ['clean']
                  ]"
                />
            </v-col>




            <v-col cols="12" sm="12" stlye="padding:0" v-if="(form.sekolah_id == null || form.sekolah_id == '')">
              <div v-if="fotoPreviewSekolahDetail" class="mt-2 text-center">
                <img
                  :src="fotoPreviewSekolahDetail"
                  alt="Preview Foto"
                  style="width: auto; height: 120px; object-fit: cover; border-radius: 5%; border: 2px solid #eee;"
                />
              </div>
              <v-file-input
                label="Upload Foto Detail"
                accept="image/*"
                show-size
                @change="handleFotoChangeSekolahDetail"
                class="mb-4"
              />
            </v-col>

            <v-col cols="12" class="mb-11" v-if="(form.sekolah_id == null || form.sekolah_id == '')">
              <label style="font-weight:500;display:block;margin-bottom:4px;">Konten Detail</label>
              <QuillEditor
                  v-model:content="form.kontent_detail"
                  contentType="html"
                  class="quill-responsive"
                  :toolbar="[
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ header: [1, 2, 3, false] }],
                    [{ list: 'ordered'}, { list: 'bullet' }],
                    [{ align: [] }],
                    ['link', 'image'],
                    ['clean']
                  ]"
                />
            </v-col>

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
      :message="`Apakah Anda yakin ingin menghapus ${DataToDelete?.name}?`"
      @confirm="handleDeleteData(TypeToDelete)"
      @cancel="showConfirmDelete = false"
    />
  </v-card>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'

const { $api } = useNuxtApp()
const headers = [
  { title: 'No', value: 'index', sortable: false, align: 'start', width: '50px' },
  { title: '#', value: 'logo', sortable: true },
  { title: 'Nama', value: 'name', sortable: true },
  { title: 'Biaya Admin', value: 'biaya_admin', sortable: true },
  { title: 'Biaya Pendaftaran', value: 'biaya_pendaftaran', sortable: true },
  { title: '', value: 'aksi', sortable: false, align: 'end' },
]
const headersSub = [
  { title: 'No', value: 'index', sortable: false, align: 'start', width: '50px' },
  { title: 'Nama Sekolah', value: 'nama_sekolah', sortable: true },
  { title: 'Grade', value: 'name', sortable: true },
  { title: '', value: 'aksi', sortable: false, align: 'end' },
]

const items = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const fotoPreview = ref('/no-image.jpg')
const fotoPreviewSekolah = ref('/no-image.jpg')
const fotoPreviewSekolahDetail = ref('/no-image.jpg')


const pagination = reactive({
  itemsPerPage: 10,
  page: 1,
  totalItems: 0,
})
const filter = reactive({
  search: '',
})

const form = reactive({
  id: null,
  sekolah_id : null,
  name: '',
  logo: null,
  foto_kontent_sekolah: null,
  biaya_admin : 0,
  biaya_pendaftaran : 0,
  is_need_nem : 0,
  is_need_test : 0,
  kontent : null,
  kontent_detail: null,
  foto_kontent: null,
  code_formulir: null,
  slug: null
})
const valid = ref(true);

const show = ref(false)
const message = ref('')

const editingRow = ref(null)

const showConfirmDelete = ref(false)
const DataToDelete = ref(null)
const TypeToDelete = ref(null)

function confirmDeleteData(Data,type) {
  DataToDelete.value = Data
  showConfirmDelete.value = true
  TypeToDelete.value = type
}

function startEdit(item) {
  editingRow.value = item
}

async function saveEdit(item) {
  loading.value = true
  try {
    const response = await $api.post('/master-data/sekolah/update', {
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



async function saveGradeEdit(item) {
  loading.value = true
  try {
    const response = await $api.post('/master-data/sekolah/update-grade', {
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

function showModalDialog (item,type) {
   showCreateModal.value = true
  if(item == null){
    Object.keys(form).forEach(k => form[k] = null)
    fotoPreview.value = '/no-image.jpg'
    fotoPreviewSekolah.value = '/no-image.jpg'
    fotoPreviewSekolahDetail.value = '/no-image.jpg'
  }else if(type == 'edit'){
    Object.keys(form).forEach(k => form[k] = item[k] ?? '')
    fotoPreview.value = item.logo ? item.logo : '/no-image.jpg'
    fotoPreviewSekolah.value = item.foto_kontent_sekolah ? item.foto_kontent_sekolah : '/no-image.jpg'
    fotoPreviewSekolahDetail.value = item.foto_kontent ? item.foto_kontent : '/no-image.jpg'
    form.is_need_nem = item.is_need_nem == '1' ? true : false;
    form.is_need_test = item.is_need_test == '1' ? true : false;
  }else{
    form.sekolah_id = item.id;
  }
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
    const response = await $api.get('/master-data/sekolah/get', {
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
  try {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('id', form.id)
    formData.append('sekolah_id', form.sekolah_id)
    formData.append('biaya_admin', form.biaya_admin)
    formData.append('biaya_pendaftaran', form.biaya_pendaftaran)
    formData.append('kontent', form.kontent)
    formData.append('code_formulir', form.code_formulir)
    formData.append('kontent_detail', form.kontent_detail)
    formData.append('is_need_nem', form.is_need_nem)
    formData.append('is_need_test', form.is_need_test)
    formData.append('slug', form.slug)
    formData.append('logo', form.logo) // Pastikan form.logo adalah File
    formData.append('foto_kontent_sekolah', form.foto_kontent_sekolah) // Pastikan form.logo adalah File
    formData.append('foto_kontent', form.foto_kontent) // Pastikan form.logo adalah File

    if(form.sekolah_id == null && form.id == null){

      // Cek validasi file jika perlu
      if (!form.logo) {
        show.value = true
        message.value = 'Logo harus diupload.'
        loading.value = false
        return
      }


      // Cek validasi file jika perlu
      if (!form.foto_kontent_sekolah) {
        show.value = true
        message.value = 'Foto Sekolah harus diupload.'
        loading.value = false
        return
      }



      // Cek validasi file jika perlu
      if (!form.foto_kontent) {
        show.value = true
        message.value = 'Foto Sekolah Detail harus diupload.'
        loading.value = false
        return
      }

      await $api.post('/master-data/sekolah/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }else if((form.sekolah_id == null || form.sekolah_id == '') && form.id != null){
      await $api.post('/master-data/sekolah/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }else{
      await $api.post('/master-data/sekolah/adding-grade', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }

    showCreateModal.value = false
    getData()

    form.name = ''
    form.biaya_admin = 0
    form.biaya_pendaftaran = 0
    form.logo = null
    form.id = null
    form.sekolah_id = null
    form.code_formulir = null
    form.is_need_nem = 0
    form.is_need_test = 0
    form.foto_kontent = null
    form.foto_kontent_sekolah = null
    form.kontent = null
    form.kontent_detail = null
    form.slug = null
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal membuat Data'
  } finally {
    loading.value = false
  }
}


async function handleDeleteData(type) {
  loading.value = true
  try {
    if(type == 'sekolah'){
      await $api.post(`/master-data/sekolah/delete`,{
        id: DataToDelete.value.id,
      })
    }else{
      await $api.post(`/master-data/sekolah-grade/delete`,{
        id: DataToDelete.value.id,
      })
    }
    getData()
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal menghapus Data'
  } finally {
    loading.value = false
    showConfirmDelete.value = false
    DataToDelete.value = null
  }
}


function handleFotoChange(e) {
  let file
  if (Array.isArray(e)) file = e[0]
  else if (e?.target?.files) file = e.target.files[0]
  else file = e

  if (file) {
    form.logo = file
    fotoPreview.value = URL.createObjectURL(file)
  } else {
    form.logo = null
    fotoPreview.value = '/no-image.jpg'
  }
}

function handleFotoChangeSekolah(e) {
  let file
  if (Array.isArray(e)) file = e[0]
  else if (e?.target?.files) file = e.target.files[0]
  else file = e

  if (file) {
    form.foto_kontent_sekolah = file
    fotoPreviewSekolah.value = URL.createObjectURL(file)
  } else {
    form.foto_kontent_sekolah = null
    fotoPreviewSekolah.value = '/no-image.jpg'
  }
}




function handleFotoChangeSekolahDetail(e) {
  let file
  if (Array.isArray(e)) file = e[0]
  else if (e?.target?.files) file = e.target.files[0]
  else file = e

  if (file) {
    form.foto_kontent = file
    fotoPreviewSekolahDetail.value = URL.createObjectURL(file)
  } else {
    form.foto_kontent = null
    fotoPreviewSekolahDetail.value = '/no-image.jpg'
  }
}


async function onToggleActive(item) {
  try {
    item.is_need_nem = item.is_need_nem == true ? 1 : 0;
    await $api.post(`/master-data/sekolah/update`, {
      ...item
    });
  } catch (error) {
  } finally{
    form.is_need_nem = item.is_need_nem == '1' ? true : false;
    getData()
  }
}





async function updateSort (item,type){
  loading.value = true
  try {
    await $api.post(`/master-data/sekolah/update-sort`,{
      id: item.id,
      type: type
    })
    getData()
  } catch (error) {
    show.value = true
    message.value = error.response?.data?.message || 'Gagal Mengupdate Grade.'
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  getData()
})

</script>
