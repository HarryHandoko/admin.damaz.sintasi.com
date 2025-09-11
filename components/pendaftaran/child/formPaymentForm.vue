<template>
  <div>
        <v-form v-model="valid" @submit.prevent="handleCreateData">
          <v-row v-if="dataPPDB != null">
            <v-col cols="12">
              <b>Summary</b>
            </v-col>

            <v-col cols="12" style="border-top: 1px solid #d9d9d9">
              <b>Pembayaran Administrasi</b>
            </v-col>

            <v-col cols="12" style="border-top: 1px solid #d9d9d9">
              ID Registrasi : <b>{{ dataPPDB.code_pendaftaran }}</b>
            </v-col>

            <v-col cols="12" style="border-top: 1px solid #d9d9d9">
              Nama Calon Siswa :
              <b>{{ dataPPDB.siswa.nama_depan }} {{ dataPPDB.siswa.nama_belakang }}</b>
            </v-col>

            <v-col cols="12" style="border-top: 1px solid #d9d9d9">
              <p>Biaya Administrasi : <b>{{ formatRupiah(dataPPDB.biaya_admin) }}</b></p>
              <p>Diskon : <b>{{ formatRupiah(dataPPDB.nominal_diskon) }}</b></p>
              <p>Total Bayar :
                <b>{{ formatRupiah(Number(dataPPDB.biaya_admin) - Number(dataPPDB.nominal_diskon ?? 0)) }}</b>
              </p>

              <p><strong>Informasi Pembayaran:</strong></p>

              <v-row>
                <v-col
                  v-for="(bank, index) in dataBank"
                  :key="index"
                  cols="12"
                  md="6"
                >
                  <v-card class="text-center" style="width: 200px; height: 150px">
                    <v-img :src="bank.image" cover width="100%" height="100%" />
                  </v-card>
                  <p><strong>Bank :</strong> {{ bank.name }}</p>
                  <p><strong>Rekening :</strong> {{ bank.no_rek }} (A/N {{ bank.nama_akun_bank }})</p>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" style="border-top: 1px solid #d9d9d9">
              Status Pembayaran :
              <span
                :style="
                  dataPPDB.is_form_done == '0' && fotoPreviewBukti
                    ? 'color:blue'
                    : dataPPDB.is_form_done == '1'
                    ? 'color:green'
                    : 'color:red'
                "
              >
                <b>{{ dataPPDB.is_form_done== '0' && fotoPreviewBukti ? 'Menunggu Konfirmasi' : dataPPDB.is_form_done == '1' ? 'Pembayaran Berhasil' : 'Belum dibayar' }}</b>
              </span>
            </v-col>

            <v-col cols="12">
              <div v-if="fotoPreviewBukti" class="mt-2 text-center">
                <img
                  :src="fotoPreviewBukti"
                  alt="Preview Foto"
                  style="width:auto;height:120px;object-fit:cover;border-radius:5%;border:2px solid #eee"
                />
              </div>
              <v-file-input
                label="Upload Foto"
                accept="image/*"
                show-size
                v-if="dataPPDB.is_form_done != 1"
                @change="handleFotoChangeBukti"
                class="mb-2"
              />
            </v-col>

            <v-col cols="12" class="text-right">
              <v-row>
                <v-col cols="6">
                  <v-btn
                    color="secondary"
                    variant="flat"
                    :disabled="false"
                    block
                    class="mr-2"
                    :loading="loading"
                    @click="backStep(1)"
                  >
                    Kembali
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    color="primary"
                    variant="flat"
                    :disabled="loading"
                    type="submit"
                    :loading="loading"
                    block
                  >
                    Kirim Bukti Pembayaran
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>

    
    <!-- Snackbar error -->
    <v-snackbar v-model="show" color="error" timeout="3000">
      {{ message }}
    </v-snackbar>

    <!-- Snackbar Sucess -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000">
      {{ message }}
    </v-snackbar>
  </div>
</template>

<script setup>

import { ref, watch } from "vue";

const { $api } = useNuxtApp();
const loadingDiskon = ref(false);
const loading = ref(false);
const showSuccess = ref(null);
const show = ref(null);
const message = ref(null);

const props = defineProps({
  dataRegist: null,
})
const emit = defineEmits(["update:step", "submit", "next-step"]);
const dataPPDB = ref(null);

const form = ref({
  id: null,
  bukti_transaksi : null,
  payment_status: null
});


watch(
  () => props.dataRegist,
  (val) => {
    if (val) form.value.id = props.dataRegist
  },
  { immediate: true }
)

const formatRupiah = (value) => {
  if (!value) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

async function getDataRegister() {
  loading.value = true;
  try {
    const data = await $api.post(`/register-ppdb/get-data`,{
        ids : props.dataRegist
    });
    dataPPDB.value = data.data.data[0];

    if (dataPPDB.value.payment == null) {
      form.value.payment_status = "Belum dibayar";
    } else {
      fotoPreviewBukti.value = dataPPDB.value.payment.bukti_transfer;
      form.value.payment_status =
        dataPPDB.value.payment.status_payment == "00"
          ? "Menunggu"
          : dataPPDB.value.payment.status_payment == "01"
          ? "Pembayaran Berhasil"
          : "Pembayaran Ditolak";
    }

  } catch (error) {
    // show.value = true
    // message.value = error.response?.data?.message || 'Gagal Mendapatkan Data.'
  } finally {
    loading.value = false;
  }
}


const fotoPreviewBukti = ref(null);

function handleFotoChangeBukti(e) {
  let file;
  if (Array.isArray(e)) file = e[0];
  else if (e?.target?.files) file = e.target.files[0];
  else file = e;

  if (file) {
    form.value.bukti_transaksi = file;
    fotoPreviewBukti.value = URL.createObjectURL(file);
  } else {
    form.value.bukti_transaksi = null;
    fotoPreviewBukti.value = "/no-image.jpg";
  }
}



const dataBank = ref(null);
async function getBankAccount() {
  loading.value = true;
  try {
    const { data } = await $api.get("/master-data/bank-account/get-payment");
    dataBank.value = data.data;
  } catch (error) {
    show.value = true;
    message.value = "Server Error.";
  } finally {
    loading.value = false;
  }
}


async function handleCreateData() {
  loading.value = true;
  try {
    const formData = new FormData();

    // Tambahkan semua data dari form.value ke FormData
    for (const key in form.value) {
      if (form.value.hasOwnProperty(key)) {
        formData.append(key, form.value[key]);
      }
    }
    
    if (form.value.bukti_transaksi == null) {
      show.value = true;
      message.value = "Bukti Pembayaran belum diupload";
    } else {
      formData.append("step", 2);
      const { data } = await $api.post(`/register-ppdb/update-form`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // emit("next-step", 2)
      // emit("submit")
      getDataRegister();
    }
  } catch (error) {
    show.value = true;
    message.value = error.response.data.message;
  } finally {
    loading.value = false;
  }
}

function backStep (steps){
  emit("next-step", steps)
}

onMounted(() => {
  getBankAccount();
  getDataRegister();
});

</script>
