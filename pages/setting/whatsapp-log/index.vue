<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2>WhatsApp Log</h2>
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
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="filter.search"
              label="Cari"
              placeholder="Cari Kode Pendaftaran"
              prepend-inner-icon="bx-search"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filter.status"
              :items="statusOptions"
              label="Status"
              clearable
              @update:model-value="getData"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filter.method"
              :items="methodOptions"
              label="Method"
              clearable
              @update:model-value="getData"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn
              color="primary"
              class="float-end"
              @click="getData"
              :loading="loading"
            >
              <v-icon left>bx-refresh</v-icon>
              Refresh
            </v-btn>
          </v-col>
        </v-row>
      </template>

      <!-- Index Number -->
      <template #item.index="props">
        {{ (pagination.page - 1) * pagination.itemsPerPage + props.index + 1 }}
      </template>

      <!-- Status with color -->
      <template #item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="small"
          variant="flat"
        >
          {{ getStatusText(item.status) }}
        </v-chip>
      </template>

      <!-- Method with icon -->
      <template #item.method="{ item }">
        <v-chip
          color="blue-grey"
          size="small"
          variant="outlined"
        >
          <v-icon start size="16">{{ getMethodIcon(item.method) }}</v-icon>
          {{ getMethodText(item.method) }}
        </v-chip>
      </template>

      <!-- Attempt progress -->
      <template #item.attempt="{ item }">
        <span v-if="item.max_retries > 1">
          {{ item.attempt }} / {{ item.max_retries }}
        </span>
        <span v-else>{{ item.attempt }}</span>
      </template>

      <!-- Processing time -->
      <template #item.processing_time_ms="{ item }">
        <span v-if="item.processing_time_ms">
          {{ formatTime(item.processing_time_ms) }}
        </span>
        <span v-else class="text-grey">-</span>
      </template>

      <!-- Started at -->
      <template #item.started_at="{ item }">
        {{ formatDateTime(item.started_at) }}
      </template>

      <!-- Completed at -->
      <template #item.completed_at="{ item }">
        <span v-if="item.completed_at">
          {{ formatDateTime(item.completed_at) }}
        </span>
        <span v-else class="text-grey">-</span>
      </template>

      <!-- Message/Error -->
      <template #item.message="{ item }">
        <div style="max-width: 200px;">
          <span v-if="item.message" class="text-truncate d-block">
            {{ item.message }}
          </span>
          <span v-else class="text-grey">-</span>
        </div>
      </template>

      <!-- Expandable row for details -->
      <template #expanded-row="{ item }">
        <tr>
          <td :colspan="headers.length" class="pa-4">
            <v-card variant="outlined">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <h4 class="mb-2">Details</h4>
                    <p><strong>Log ID:</strong> {{ item.id }}</p>
                    <p><strong>Kode Pendaftaran:</strong> {{ item.kode_pendaftaran }}</p>
                    <p><strong>Method:</strong> {{ item.method }}</p>
                    <p><strong>Status:</strong> {{ item.status }}</p>
                    <p><strong>Attempt:</strong> {{ item.attempt }} / {{ item.max_retries }}</p>
                    <p><strong>Started:</strong> {{ formatDateTime(item.started_at) }}</p>
                    <p><strong>Completed:</strong> {{ item.completed_at ? formatDateTime(item.completed_at) : 'Not completed' }}</p>
                    <p v-if="item.processing_time_ms"><strong>Processing Time:</strong> {{ formatTime(item.processing_time_ms) }}</p>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div v-if="item.message">
                      <h4 class="mb-2">Message</h4>
                      <v-textarea
                        :model-value="item.message"
                        readonly
                        variant="outlined"
                        rows="3"
                        no-resize
                      />
                    </div>
                    <div v-if="item.error_details">
                      <h4 class="mb-2 text-error">Error Details</h4>
                      <v-textarea
                        :model-value="item.error_details"
                        readonly
                        variant="outlined"
                        rows="5"
                        no-resize
                        class="text-error"
                      />
                    </div>
                    <div v-if="item.response_data">
                      <h4 class="mb-2 text-success">Response Data</h4>
                      <v-textarea
                        :model-value="formatJSON(item.response_data)"
                        readonly
                        variant="outlined"
                        rows="5"
                        no-resize
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </td>
        </tr>
      </template>

      <!-- No data -->
      <template #no-data>
        <div class="text-center py-8">
          <v-icon size="64" color="grey">bx-message-square-x</v-icon>
          <p class="mt-2 text-grey">Tidak ada log WhatsApp.</p>
        </div>
      </template>
    </v-data-table>

    <!-- Statistics Cards -->
    <v-row class="ma-4">
      <v-col cols="12">
        <h3 class="mb-4">Statistik WhatsApp</h3>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="primary" variant="flat">
          <v-card-text class="text-center text-white">
            <div class="text-h4 text-white font-weight-bold">{{ stats.total || 0 }}</div>
            <div>Total</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="success" variant="flat">
          <v-card-text class="text-center text-white">
            <div class="text-h4 font-weight-bold text-white">{{ stats.success || 0 }}</div>
            <div>Success</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="error" variant="flat">
          <v-card-text class="text-center text-white">
            <div class="text-h4 font-weight-bold text-white">{{ stats.failed || 0 }}</div>
            <div>Failed</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="warning" variant="flat">
          <v-card-text class="text-center text-white">
            <div class="text-h4 font-weight-bold text-white">{{ stats.pending || 0 }}</div>
            <div>Pending</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="info" variant="flat">
          <v-card-text class="text-center text-white">
            <div class="text-h4 font-weight-bold text-white">{{ stats.retrying || 0 }}</div>
            <div>Retrying</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar for messages -->
    <v-snackbar v-model="show" :color="snackbarColor" timeout="3000">
      {{ message }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';

const { $api } = useNuxtApp()

// Headers for the data table
const headers = [
  { title: 'No', value: 'index', sortable: false, align: 'start', width: '60px' },
  { title: 'Kode Pendaftaran', value: 'kode_pendaftaran', sortable: true, width: '150px' },
  { title: 'Method', value: 'method', sortable: true, width: '180px' },
  { title: 'Status', value: 'status', sortable: true, width: '120px' },
  { title: 'Attempt', value: 'attempt', sortable: false, width: '80px' },
  { title: 'Started At', value: 'started_at', sortable: true, width: '160px' },
  { title: 'Completed At', value: 'completed_at', sortable: true, width: '160px' },
  { title: 'Time', value: 'processing_time_ms', sortable: true, width: '100px' },
  { title: 'Message', value: 'message', sortable: false, width: '200px' },
]

// Reactive data
const items = ref([])
const stats = ref({})
const loading = ref(false)

const pagination = reactive({
  itemsPerPage: 10,
  page: 1,
  totalItems: 0,
})

const filter = reactive({
  search: '',
  status: null,
  method: null,
})

// Snackbar
const show = ref(false)
const message = ref('')
const snackbarColor = ref('error')

// Options for filters
const statusOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'Success', value: 'success' },
  { title: 'Failed', value: 'failed' },
  { title: 'Retrying', value: 'retrying' },
]

const methodOptions = [
  { title: 'Register Message', value: 'sendRegisterMessage' },
  { title: 'Approval Message', value: 'sendApprovalMessage' },
  { title: 'Rejection Message', value: 'sendRejectedMessage' },
  { title: 'Bill to User', value: 'sendBillToUser' },
  { title: 'Bill to Keuangan', value: 'sendBillToKeuangan' },
]

// Helper functions
function getStatusColor(status) {
  switch (status) {
    case 'success': return 'success'
    case 'failed': return 'error'
    case 'pending': return 'warning'
    case 'retrying': return 'info'
    default: return 'grey'
  }
}

function getStatusText(status) {
  switch (status) {
    case 'success': return 'Success'
    case 'failed': return 'Failed'
    case 'pending': return 'Pending'
    case 'retrying': return 'Retrying'
    default: return status
  }
}

function getMethodIcon(method) {
  switch (method) {
    case 'sendRegisterMessage': return 'bx-user-plus'
    case 'sendApprovalMessage': return 'bx-check-circle'
    case 'sendRejectedMessage': return 'bx-x-circle'
    case 'sendBillToUser': return 'bx-receipt'
    case 'sendBillToKeuangan': return 'bx-money'
    default: return 'bx-message'
  }
}

function getMethodText(method) {
  switch (method) {
    case 'sendRegisterMessage': return 'Register'
    case 'sendApprovalMessage': return 'Approval'
    case 'sendRejectedMessage': return 'Rejection'
    case 'sendBillToUser': return 'Bill User'
    case 'sendBillToKeuangan': return 'Bill Keuangan'
    default: return method
  }
}

function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function formatDateTime(dateTime) {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function formatJSON(jsonString) {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2)
  } catch {
    return jsonString
  }
}

// Event handlers
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

// API functions
async function getData() {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.itemsPerPage,
      search: filter.search,
      status: filter.status,
      method: filter.method,
    }

    const response = await $api.get('/whatsapp-log/get', { params })

    items.value = response.data.data
    pagination.totalItems = response.data.total
    pagination.page = response.data.page
    pagination.itemsPerPage = response.data.perPage

    showMessage('Data berhasil dimuat', 'success')
  } catch (error) {
    showMessage(error.response?.data?.message || 'Gagal memuat data', 'error')
  } finally {
    loading.value = false
  }
}

async function getStats() {
  try {
    const response = await $api.get('/whatsapp-log/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

function showMessage(msg, color = 'error') {
  message.value = msg
  snackbarColor.value = color
  show.value = true
}

// Lifecycle
onMounted(() => {
  getData()
  getStats()
})
</script>
