<template>
  <div>
    <div v-if="is_email_verifikasi == 0">
      <confirmEmail :data="dataUsers" />
    </div>
    <v-row v-if="is_email_verifikasi == 1">
      <v-col cols="12">
        <VCard class="pa-5">
          <v-row>
            <v-col cols="12" md="5">
              <v-text-field
                label="Cari Nama Siswa"
                v-model="form.search"
                dense
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="text-right">
              <v-btn
                :loading="loading"
                :disabled="loading"
                type="submit"
                color="primary"
                @click="createRegister(null)"
              >
                <v-icon>bx bx-plus</v-icon> Pendaftaran Baru
              </v-btn>
            </v-col>
          </v-row>
        </VCard>
      </v-col>

      <v-col
        v-for="(item, index) in dataRegister"
        :key="index"
        cols="12"
        md="4"
        style="cursor: pointer"
      >
        <v-card
          class="rounded-2xl elevation-10"
          style="box-shadow: 0 10px 24px -8px #60a5fa33"
        >
          <!-- Tombol Delete di kanan atas -->
          <v-btn
            icon
            class="ma-2 mb-4"
            color="red"
            style="
              position: absolute;
              top: 0;
              right: 0;
              z-index: 10;
              color: red;
            "
            @click.stop="deleteRegister(item)"
            v-if="item.is_daftar_ulang == 0"
          >
            <v-icon size="30" v-if="!loading">bx bx-trash</v-icon>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
              size="30"
            />
          </v-btn>

          <v-btn
            icon
            class="ma-2"
            color="red"
            :style="
              item.is_daftar_ulang == 0
                ? `position: absolute; top: 40px; right: 0; z-index: 10;color:blue`
                : `position: absolute; top: 0px; right: 0; z-index: 10;color:blue`
            "
            @click.stop="printData(item)"
            v-if="item.is_submit == '1' && item.status_pendaftaran == 'P01'"
          >
            <v-icon size="30" v-if="!loading">bx bx-printer</v-icon>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
              size="30"
            />
          </v-btn>

          <v-btn
            icon
            class="ma-2"
            color="red"
            :style="
              item.is_daftar_ulang == 1
                ? `position: absolute; top: 43px; right: 0; z-index: 10;color:blue`
                : `display: none`
            "
            @click.stop="printDataKTS(item)"
            v-if="
              item.is_submit == '1' &&
              item.registrasi_ulang?.status_pembayaran == '01'
            "
          >
            <v-icon size="30" v-if="!loading">bx bx-id-card</v-icon>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
              size="30"
            />
          </v-btn>

          <v-btn
            icon
            class="ma-2"
            color="red"
            :style="
              item.is_daftar_ulang == 0
                ? `position: absolute; top: 40px; right: 0; z-index: 10;color:blue`
                : `position: absolute; top: 0px; right: 0; z-index: 10;color:blue`
            "
            @click.stop="printData(item)"
            v-if="item.is_submit == '1' && item.status_pendaftaran == 'P01'"
          >
            <v-icon size="30" v-if="!loading">bx bx-printer</v-icon>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
              size="30"
            />
          </v-btn>

          <v-row
            align="center"
            no-gutters
            class="pa-5"
            @click="createRegister(item)"
          >
            <v-col
              cols="12"
              md="3"
              class="flex justify-center items-center text-center"
            >
              <v-avatar
                size="70"
                class="elevation-5"
                style="
                  border: 2px solid #38bdf8;
                  box-shadow: 0 4px 18px 0 #38bdf833;
                "
              >
                <v-img
                  :src="
                    item.siswa.foto_siswa != null
                      ? item.siswa.foto_siswa
                      : '/favicon.ico'
                  "
                  cover
                  alt="Avatar"
                />
              </v-avatar>
            </v-col>
            <v-col cols="12" md="7" class="pl-0 md:pl-4 md:mt-0">
              <div class="text-xl font-semibold text-gray-700 mb-1">
                {{
                  item.siswa != null
                    ? (item.siswa.nama_depan ?? "-") +
                      " " +
                      (item.siswa.nama_belakang ?? "")
                    : "Nama Siswa"
                }}
              </div>
              <div class="flex flex-col gap-1 text-gray-600 text-base">
                <div>
                  <span class="font-medium text-gray-500">Usia: </span>
                  <b>{{
                    item.siswa != null ? item.siswa.usia + " Th" : "0 Th"
                  }}</b
                  ><br />
                  <span class="font-medium text-gray-500">Jenjang: </span>
                  <b>
                    {{
                      item.sekolah != null ? item.sekolah.name : "Nama Sekolah"
                    }}
                    |
                    {{
                      item.sekolah_grade != null
                        ? item.sekolah_grade.name
                        : "Grade"
                    }}
                  </b>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-col
            cols="12"
            v-if="item.is_daftar_ulang == '0'"
            :class="
              item.status_pendaftaran == 'P00'
                ? 'pa-2 bg-warning'
                : item.status_pendaftaran == 'P01'
                ? 'pa-2 bg-primary'
                : item.status_pendaftaran == 'P02'
                ? 'pa-2 bg-error'
                : 'None'
            "
            style="margin: 0px"
          >
            {{ statusText(item) }}
          </v-col>

          <v-col
            cols="12"
            v-if="item.is_daftar_ulang == '1'"
            :class="
              item.registrasi_ulang?.status_pembayaran == '00'
                ? 'pa-2 bg-warning'
                : item.registrasi_ulang?.status_pembayaran == '01'
                ? 'pa-2 bg-primary'
                : item.registrasi_ulang?.status_pembayaran == '02'
                ? 'pa-2 bg-error'
                : 'None'
            "
            style="margin: 0px"
          >
            {{
              item.registrasi_ulang?.status_pembayaran == "00"
                ? "Menunggu"
                : item.registrasi_ulang?.status_pembayaran == "01"
                ? "Diterima"
                : item.registrasi_ulang?.status_pembayaran == "02"
                ? "Ditolak"
                : "None"
            }}
          </v-col>
        </v-card>
      </v-col>
    </v-row>


    <!-- Snackbar error -->
    <v-snackbar v-model="show" color="error" timeout="3000">
      {{ message }}
    </v-snackbar>

    <!-- Snackbar Sucess -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000">
      {{ message }}
    </v-snackbar>
    <!-- Dialog konfirmasi hapus -->
    <ConfirmDialog
      :modelValue="showConfirm"
      :title="titleConfirm"
      :message="messageConfirm"
      :color="color"
      @confirm="showModal(dataConfirm)"
      @cancel="showConfirm = false"
    />

    <ConfirmDialog
      :modelValue="showConfirmDelete"
      :title="titleConfirmDelete"
      :message="messageConfirmDelete"
      :color="colorDelete"
      @confirm="handleDelete(dataConfirmDelete)"
      @cancel="showConfirmDelete = false"
    />
    </div>


    <modal-pendaftaran
      v-model:show="showCreateModal"
      :dataRegis="dataRegis"
      @submit="getDataRegister"
      :step="step"
      @next-step="handleStepChange"
    />
</template>

<script setup>
import ModalPendaftaran from "@/components/pendaftaran/modalPendaftaran.vue";
const { $pusher } = useNuxtApp();
import { ref } from "vue";
import ConfirmDialog from "~/components/ConfirmDialog.vue";
import confirmEmail from "~/components/confirmEmail.vue";

const { $api } = useNuxtApp();
const loading = ref(false);

const form = ref({
  search: null
});

const emit = defineEmits([ "next-step"]);
const is_email_verifikasi = ref(null);
const dataRegister = ref([]);
const showCreateModal = ref(false)
const show = ref(false);
const message = ref(null);
const showConfirm = ref(false);
const titleConfirm = ref(null);
const messageConfirm = ref(null);
const dataConfirm = ref(null);
const color = ref("error");
const dataUsers = ref(null);
const step = ref(1);

const showConfirmDelete = ref(false);
const titleConfirmDelete = ref(null);
const messageConfirmDelete = ref(null);
const dataConfirmDelete = ref(null);
const colorDelete = ref("error");

async function fetchUser() {
  try {
    const response = await $api.get("/users");
    is_email_verifikasi.value = response.data.is_active_email;
    dataUsers.value = response.data;
  } catch (error) {}
}

async function getDataRegister() {
  loading.value = true;
  try {
    const data = await $api.post(`/register-ppdb/get-data`);
    dataRegister.value = data.data.data;
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

function createRegister(data) {
  if (data == null) {
    Object.keys(form.value).forEach((k) => {
      form.value[k] = null;
    });
    color.value = "primary";
    titleConfirm.value = "Konfirmasi Pendataran";
    messageConfirm.value = "Yakin ingin mendaftar baru?";
    dataConfirm.value = data;
    showConfirm.value = true;
  } else {
    color.value = "primary";
    titleConfirm.value = "Lanjutkan pendaftaran";
    messageConfirm.value = "Yakin ingin melanjutkan pendaftaran?";
    dataConfirm.value = data;
    showConfirm.value = true;
  }
}


function showModal(data) {
  showConfirm.value = false;
  if (data == null) {
    register();
  }else{
    dataRegis.value = data.id
    showCreateModal.value = true // bisa buka modal di sini
  }
}
const dataRegis = ref(null);
async function register() {
  loading.value = true;
  try {
    const data = await $api.post(`/register-ppdb/create`);
    const code = data?.data?.data?.id || null

    if (code) {
      dataRegis.value = code
      if(dataRegis.value != null){
        showCreateModal.value = true // bisa buka modal di sini
      }
    }
  } catch (error) {
    show.value = true;
    message.value = "Server Error.";
  } finally {
    loading.value = false;
  }
}



function deleteRegister(data) {
  colorDelete.value = "error";
  titleConfirmDelete.value = "Batalkan pendaftaran";
  messageConfirmDelete.value = "Yakin ingin Membatalkan pendaftaran?";
  dataConfirmDelete.value = data;
  showConfirmDelete.value = true;
}
const showSuccess = ref(false);

async function handleDelete(dataDelete) {
  loading.value = true;
  try {
    const data = await $api.post(`/register-ppdb/delete`, dataDelete);
    showSuccess.value = true;
    message.value = "Berhasil dibatalkan";
    showConfirmDelete.value = false;

    getDataRegister();
  } catch (error) {
    show.value = true;
    message.value = "Server Error.";
  } finally {
    loading.value = false;
  }
}



async function printDataKTS(data) {
  loading.value = true;
  try {
    const response = await $api.post("/register-ppdb/generate-kts-pdf", {
      register_id: data.id,
    });

    const downloadUrl = response.data.download_url;
    if (downloadUrl) {
      window.open(downloadUrl, "_blank"); // 👈 buka di tab baru
    } else {
      show.value = true;
      message.value = "Gagal mendapatkan link unduhan.";
    }
  } catch (error) {
    show.value = true;
    message.value =
      error.response?.data?.message || "Terjadi kesalahan saat mencetak.";
  } finally {
    loading.value = false;
  }
}



async function printData(data) {
  loading.value = true;
  try {
    const response = await $api.post("/register-ppdb/generate-pdf", data);

    const downloadUrl = response.data.download_url;
    if (downloadUrl) {
      window.open(downloadUrl, "_blank"); // 👈 buka di tab baru
    } else {
      show.value = true;
      message.value = "Gagal mendapatkan link unduhan.";
    }
  } catch (error) {
    show.value = true;
    message.value =
      error.response?.data?.message || "Terjadi kesalahan saat mencetak.";
  } finally {
    loading.value = false;
  }
}



function statusText(ItemProps){
  let status = 'Menunggu';
  if(ItemProps.is_done_submit == '0'){
      if(ItemProps.is_form_done == '0'){
        status = 'Menunggu Konfirmasi Pembayaran Formulir'
      }else if(ItemProps.is_form_done == '1'){
        status = 'Pembayaran Formulir Sudah disetujui, silahkan lanjut isi formulir'
      }else {
        status = 'Pembayaran ditolak'
      }
  }else{
    if(ItemProps.is_need_test == '0'){
      if(ItemProps.status_pendaftaran == 'P00'){
        status = 'Menunggu Konfirmasi Administrasi Berkas'
      }else if(ItemProps.status_pendaftaran == 'P01'){
        status = 'Pendaftaran Berhasil disetujui, silahkan lanjut daftar ulang'
      }else {
        status = 'Pendaftaran Ditolak'
      }
    }else{
      if(ItemProps.status_pendaftaran == 'P00'){
        status = 'Menunggu Konfirmasi Administrasi Berkas'
      }else if(ItemProps.status_pendaftaran == 'P01' && ItemProps.status_test == '00'){
        status = 'Disetujui Seleksi Test akan ' + (ItemProps.tgl_test != null ? ' dilaksanakan pada ' + ItemProps.tgl_test : ' diinformasikan lebih lanjut ')
      }else if(ItemProps.status_pendaftaran == 'P01' && ItemProps.status_test == '01'){
        status = 'Telah dinyatakan Lulus Seleksi Tes'
      }else {
        status = 'Pendaftaran Ditolak'
      }
    }
  }
  return status;
  
}

// Subscribe ke channel 'ppdb'
const channel = $pusher.subscribe('ppdb')
channel.bind('acc_account', (data) => {
  if(data.registed_by == dataUsers.value.id){
    getDataRegister();
    const audio = new Audio('/sound/notif.mp3')
    audio.currentTime = 0
    audio.play()
  }
})
onMounted(() => {
  getDataRegister();
  fetchUser();
});


</script>
