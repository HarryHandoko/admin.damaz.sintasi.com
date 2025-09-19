<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2>WhatsApp Log</h2>
    </v-card-title>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      :items-per-page="10"
      :loading="loading"
      class="elevation-1 small-table"
      show-expand
      show-select
      item-value="id"
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
              @update:model-value="onSearchChange"
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
            <div class="d-flex gap-2">
              <v-btn
                color="primary"
                @click="getData"
                :loading="loading"
                size="small"
              >
                <v-icon left>bx-refresh</v-icon>
                Refresh
              </v-btn>
              <v-btn
                color="warning"
                @click="bulkResend"
                :disabled="!hasSelectedFailed || loading"
                :loading="resendLoading"
                size="small"
              >
                <v-icon left>bx-redo</v-icon>
                Resend Selected
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </template>

      <!-- Index Number -->
      <template #item.index="props">
        {{ props.index + 1 }}
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

      <!-- Actions -->
      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn
            v-if="item.status === 'failed'"
            icon
            size="small"
            color="warning"
            @click="resendSingle(item)"
            :loading="resendingSingle[item.id]"
            variant="text"
          >
            <v-icon size="18">bx-redo</v-icon>
            <v-tooltip activator="parent" location="top">
              Resend Message
            </v-tooltip>
          </v-btn>
          <v-btn
            icon
            size="small"
            color="primary"
            @click="viewDetails(item)"
            variant="text"
          >
            <v-icon size="18">bx-show</v-icon>
            <v-tooltip activator="parent" location="top">
              View Details
            </v-tooltip>
          </v-btn>
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

                    <!-- Resend button in details -->
                    <div v-if="item.status === 'failed'" class="mt-3">
                      <v-btn
                        color="warning"
                        size="small"
                        @click="resendSingle(item)"
                        :loading="resendingSingle[item.id]"
                      >
                        <v-icon left>bx-redo</v-icon>
                        Resend This Message
                      </v-btn>
                    </div>
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
            <div class="text-h4 font-weight-bold">{{ stats.success || 0 }}</div>
            <div>Success</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="error" variant="flat">
          <v-card-text class="text-center text-white">
            <div class="text-h4 font-weight-bold">{{ stats.failed || 0 }}</div>
            <div>Failed</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="warning" variant="flat">
          <v-card-text class="text-center text-white">
            <div class="text-h4 font-weight-bold">{{ stats.pending || 0 }}</div>
            <div>Pending</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="info" variant="flat">
          <v-card-text class="text-center text-white">
            <div class="text-h4 font-weight-bold">{{ stats.retrying || 0 }}</div>
            <div>Retrying</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar for messages -->
    <v-snackbar v-model="show" :color="snackbarColor" timeout="3000">
      {{ message }}
    </v-snackbar>

    <!-- Confirm Dialog for Resend -->
    <ConfirmDialog
      :modelValue="showResendConfirm"
      title="Konfirmasi Resend"
      :message="resendConfirmMessage"
      @confirm="confirmResend"
      @cancel="showResendConfirm = false"
    />
  </v-card>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ConfirmDialog from '~/components/ConfirmDialog.vue';

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
  { title: 'Actions', value: 'actions', sortable: false, width: '100px' },
]

// Reactive data
const items = ref([])
const stats = ref({})
const loading = ref(false)
const selected = ref([])
const resendLoading = ref(false)
const resendingSingle = ref({})

const filter = reactive({
  search: '',
  status: null,
  method: null,
})

// Snackbar
const show = ref(false)
const message = ref('')
const snackbarColor = ref('error')

// Resend confirmation
const showResendConfirm = ref(false)
const resendConfirmMessage = ref('')
const resendAction = ref(null)

// Search timeout
let searchTimeout = ref(null)

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

// Computed properties
const hasSelectedFailed = computed(() => {
  return selected.value.some(id => {
    const item = items.value.find(item => item.id === id)
    return item && item.status === 'failed'
  })
})

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
    case 'sendPendaftaranFormulirDisetujui': return 'bx-file-check'
    case 'sendPendaftaranFormulirDitolak': return 'bx-file-x'
    case 'sendRegUlangDisetujui': return 'bx-rename'
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
    case 'sendPendaftaranFormulirDisetujui': return 'Form Approved'
    case 'sendPendaftaranFormulirDitolak': return 'Form Rejected'
    case 'sendRegUlangDisetujui': return 'Daftar Ulang Approved'
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
watch(() => filter.search, () => {
  onSearchChange()
})

const onSearchChange = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    getData()
  }, 500)
}

// API functions
async function getData() {
  loading.value = true
  try {
    const params = {
      search: filter.search,
      status: filter.status,
      method: filter.method,
    }

    const response = await $api.get('/whatsapp-log/get', { params })

    items.value = response.data

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

// Resend functions
function resendSingle(item) {
  resendConfirmMessage.value = `Apakah Anda yakin ingin mengirim ulang pesan ${getMethodText(item.method)} untuk ${item.kode_pendaftaran}?`
  resendAction.value = () => performSingleResend(item)
  showResendConfirm.value = true
}

function bulkResend() {
  const failedSelected = selected.value.filter(id => {
    const item = items.value.find(item => item.id === id)
    return item && item.status === 'failed'
  })

  resendConfirmMessage.value = `Apakah Anda yakin ingin mengirim ulang ${failedSelected.length} pesan yang gagal?`
  resendAction.value = () => performBulkResend(failedSelected)
  showResendConfirm.value = true
}

async function confirmResend() {
  showResendConfirm.value = false
  if (resendAction.value) {
    await resendAction.value()
    resendAction.value = null
  }
}

async function performSingleResend(item) {
  resendingSingle.value[item.id] = true
  try {
    const response = await $api.post('/whatsapp-log/resend', {
      id: item.id
    })

    showMessage(`Pesan berhasil dikirim ulang untuk ${item.kode_pendaftaran}`, 'success')
    getData() // Refresh data
  } catch (error) {
    showMessage(error.response?.data?.message || 'Gagal mengirim ulang pesan', 'error')
  } finally {
    resendingSingle.value[item.id] = false
  }
}

async function performBulkResend(ids) {
  resendLoading.value = true
  try {
    const response = await $api.post('/whatsapp-log/bulk-resend', {
      ids: ids
    })

    showMessage(`${response.data.resend_count} pesan berhasil dikirim ulang`, 'success')
    selected.value = [] // Clear selection
    getData() // Refresh data
  } catch (error) {
    showMessage(error.response?.data?.message || 'Gagal mengirim ulang pesan', 'error')
  } finally {
    resendLoading.value = false
  }
}

function viewDetails(item) {
  // This could open a modal or navigate to detail page
  console.log('View details for:', item)
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

<style scoped>
.small-table {
  font-size: 0.875rem;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.d-flex.gap-1 > * {
  margin-right: 4px;
}

.d-flex.gap-2 > * {
  margin-right: 8px;
}
</style>
