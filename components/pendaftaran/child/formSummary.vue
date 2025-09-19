<template>
  <div v-if="dataPPDB != null">
    <v-form v-model="valid" @submit.prevent="submitPayRegistrasiUlang">
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center" v-if="dataPPDB.is_done_submit == '1'">
            <v-btn
              color="primary"
              variant="outlined"
              class="mb-2"
              block
            >
              Berkas Sudah Dikirim
            </v-btn>
          </div>
          <div class="d-flex justify-space-between align-center">
            <b>Informasi Sekolah</b>
          </div>
          <div>
            Nama Sekolah: <b>{{ dataPPDB.sekolah?.name || "-" }}</b>
          </div>
          <div>
            Jenjang Dituju:
            <b>{{ dataPPDB.sekolah_grade.name || "-" }}</b>
          </div>
          <div>
            Tahun Ajaran:
            <b>{{ dataPPDB.tahun_periodik }}</b>
          </div>
        </v-col>

        <!-- Data Calon Siswa -->
        <v-col
          cols="12"
          class="mt-4"
          style="border-top: 1px solid #d9d9d9"
        >
          <div class="d-flex justify-space-between align-center">
            <b>Data Calon Siswa</b>
            <span
              @click="backStep(3)"
              v-if="dataPPDB.status_pendaftaran == 'P00' && dataPPDB.is_done_submit == 0"
              style="cursor: pointer; color: blue"
              >Show Detail</span
            >
          </div>
          <div>
            Nama Lengkap:
            <b>{{ dataPPDB.siswa.nama_depan }} {{ dataPPDB.siswa.nama_belakang }}</b>
          </div>
          <div>
            NIK: <b>{{ dataPPDB.siswa.nik || "-" }}</b>
          </div>
          <div>
            No. Akte Kelahiran: <b>{{ dataPPDB.siswa.no_akte_kelahiran || "-" }}</b>
          </div>
          <div>
            Jenis Kelamin: <b>{{ dataPPDB.siswa.jenis_kelamin || "-" }}</b>
          </div>
          <div>
            Tempat Lahir: <b>{{ dataPPDB.siswa.tempat_lahir }}</b>
          </div>
          <div>
            Tanggal Lahir: <b>{{ dataPPDB.siswa.tgl_lahir }}</b>
          </div>
          <div>
            Agama: <b>{{ dataPPDB.siswa.agama || "-" }}</b>
          </div>
          <div>
            Anak ke: <b>{{ dataPPDB.siswa.anak_ke || "-" }}</b>
          </div>
          <div>
            Jumlah Saudara: <b>{{ dataPPDB.siswa.jumlah_saudara || "-" }}</b>
          </div>
          <div>
            Hobby: <b>{{ dataPPDB.siswa.hobby || "-" }}</b>
          </div>
          <div>
            Cita - Cita: <b>{{ dataPPDB.siswa.cita_cita || "-" }}</b>
          </div>
          <div>
            Tinggi Badan: <b>{{ dataPPDB.siswa.tinggi_badan || "-" }}</b>
          </div>
          <div>
            Berat Badan: <b>{{ dataPPDB.siswa.berat_badan || "-" }}</b>
          </div>
          <div>
            Riwayat Kesehatan : <b>{{ dataPPDB.siswa.riwayat_kesehatan || "-" }}</b>
          </div>
          <div>
            No. Handphone : <b>{{ dataPPDB.siswa.no_handphone || "-" }}</b>
          </div>
          <div>
            Status Pendaftaran: <b>{{ dataPPDB.status_pendaftaran_siswa }}</b>
          </div>
          <div>
            Kebutuhan Khusus:
            <b>{{ dataPPDB.siswa.kebutuhan_spesial == "1" ? "Ya" : "Tidak" }}</b>
          </div>
          <div>
            Bahasa Sehari-hari: <b>{{ dataPPDB.siswa.bahasa_sehari_hari }}</b>
          </div>
          <div>
            Penghargaan: <b>{{ dataPPDB.siswa_award?.award }}</b>
          </div>
        </v-col>

        <!-- Alamat -->
        <v-col
          cols="12"
          class="mt-4"
          style="border-top: 1px solid #d9d9d9"
        >
          <div class="d-flex justify-space-between align-center">
            <b>Alamat</b>
            <span
              @click="backStep(4)"
              v-if="dataPPDB.status_pendaftaran == 'P00' && dataPPDB.is_done_submit == 0"
              style="cursor: pointer; color: blue"
              >Show Detail</span
            >
          </div>
          <div>
            Jarak Rumah Ke Sekolah : <b>{{ dataPPDB.siswa_address.jarak_rumah_sekolah }}</b>
          </div>
          <div>
            Alamat Lengkap: <b>{{ dataPPDB.siswa_address.alamat }}</b>
          </div>
          <div>
            RT/RW:
            <b
              >{{ dataPPDB.siswa_address.rt }}/{{
                dataPPDB.siswa_address.rw
              }}</b
            >
          </div>
          <div>
            Kode Pos: <b>{{ dataPPDB.siswa_address.zip_code }}</b>
          </div>
          <div>
            Provinsi: <b>{{ dataPPDB.siswa_address.provinsi }}</b>
          </div>
          <div>
            Kota/Kabupaten: <b>{{ dataPPDB.siswa_address.kota }}</b>
          </div>
          <div>
            Kecamatan: <b>{{ dataPPDB.siswa_address.district }}</b>
          </div>
          <div>
            Kelurahan/Desa: <b>{{ dataPPDB.siswa_address.desa }}</b>
          </div>
        </v-col>

        <!-- Data Orang Tua -->
        <v-col
          cols="12"
          class="mt-4"
          style="border-top: 1px solid #d9d9d9"
        >
          <div class="d-flex justify-space-between align-center">
            <b>Data Orang Tua / Wali</b>
            <span
              @click="backStep(5)"
              v-if="dataPPDB.status_pendaftaran == 'P00' && dataPPDB.is_done_submit == 0"
              style="cursor: pointer; color: blue"
              >Show Detail</span
            >
          </div>

          <div v-if="dataPPDB.siswa_parent.penanggung_jawab == 'Orang Tua'">
            <div>
              Nama Ayah: <b>{{ dataPPDB.siswa_parent.nama_ayah }}</b>
            </div>
            <div>
              NIK Ayah: <b>{{ dataPPDB.siswa_parent.nik_ayah }}</b>
            </div>
            <div>
              Pekerjaan Ayah: <b>{{ dataPPDB.siswa_parent.pekerjaan_ayah }}</b>
            </div>
            <div>
              Pendidikan Terakhir Ayah:
              <b>{{ dataPPDB.siswa_parent.pendidikan_terakhir_ayah }}</b>
            </div>
            <div>
              Penghasilan Ayah: <b>{{ dataPPDB.siswa_parent.penghasilan_ayah }}</b>
            </div>
            <div>
              Alamat: <b>{{ dataPPDB.siswa_parent.alamat_ayah }}</b>
            </div>

            <br />
            <div>
              Nama Ibu: <b>{{ dataPPDB.siswa_parent.nama_ibu }}</b>
            </div>
            <div>
              NIK Ibu: <b>{{ dataPPDB.siswa_parent.nik_ibu }}</b>
            </div>
            <div>
              Pekerjaan Ibu: <b>{{ dataPPDB.siswa_parent.pekerjaan_ibu }}</b>
            </div>
            <div>
              Pendidikan Terakhir Ibu:
              <b>{{ dataPPDB.siswa_parent.pendidikan_terakhir_ibu }}</b>
            </div>
            <div>
              Penghasilan Ibu: <b>{{ dataPPDB.siswa_parent.penghasilan_ibu }}</b>
            </div>
            <div>
              Alamat: <b>{{ dataPPDB.siswa_parent.alamat_ibu }}</b>
            </div>
          </div>
          <div v-if="dataPPDB.siswa_parent.penanggung_jawab != 'Orang Tua'">
            
            <br />
            <div>
              Nama Wali: <b>{{ dataPPDB.siswa_parent.nama_wali }}</b>
            </div>
            <div>
              NIK Wali: <b>{{ dataPPDB.siswa_parent.nik_wali }}</b>
            </div>
            <div>
              Pekerjaan Wali: <b>{{ dataPPDB.siswa_parent.pekerjaan_wali }}</b>
            </div>
            <div>
              Pendidikan Terakhir Wali:
              <b>{{ dataPPDB.siswa_parent.pendidikan_terakhir_wali }}</b>
            </div>
            <div>
              Penghasilan Wali: <b>{{ dataPPDB.siswa_parent.penghasilan_wali }}</b>
            </div>
            <div>
              Alamat: <b>{{ dataPPDB.siswa_parent.alamat_wali }}</b>
            </div>
          </div>
        </v-col>
        <v-col cols="12" v-if="dataPPDB.is_done_submit == 0">
          <v-btn
            color="primary"
            variant="flat"
            :disabled="loading"
            :loading="loading"
            block
            @click="showConfirmDelete = true"
          >
            Kirim Berkas
          </v-btn>
        </v-col>
        <v-col cols="12" v-if="dataPPDB.is_daftar_ulang == '1'">
          <v-col cols="12" style="border-top: 1px solid #d9d9d9" 
          >
          Biaya Uang Pangkal :
          <b>{{ formatRupiah(dataPPDB.biaya_pendaftaran) }}</b><br>
          Diskon Biaya Uang Pangkal :
          <b>{{ formatRupiah(dataPPDB.diskon_uang_pangkal) }}</b><br>
          Total Biaya Uang Pangkal :
          <b>{{ formatRupiah(dataPPDB.biaya_pendaftaran - dataPPDB.diskon_uang_pangkal) }}</b>

          <p style="margin-bottom: 15px">
            <strong>Informasi Pembayaran:</strong>
          </p>

          <v-row style="margin-bottom: 12px">
            <v-col
              cols="12"
              md="6"
              v-if="dataBank && dataBank.length"
              v-for="(bank, index) in dataBank"
              :key="index"
            >
              <v-card
                class="text-center"
                style="width: 200px; height: 150px"
              >
                <v-img
                  :src="bank.image"
                  cover
                  width="100%"
                  height="100%"
                ></v-img>
              </v-card>
              <p style="margin-bottom: 0px">
                <strong>Bank :</strong> {{ bank.name }}
              </p>
              <p style="margin-bottom: 0px">
                <strong>Rekening :</strong> {{ bank.no_rek }} (A/N
                {{ bank.nama_akun_bank }})
              </p>
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          style="border-top: 1px solid #d9d9d9"
          v-if="formDaftarUlang.data?.bukti_pembayaran != null"
        >
          Status Pembayaran :
          <span
            :style="
              formDaftarUlang.data.status_pembayaran == '00'
                ? 'color:blue'
                : formDaftarUlang.data.status_pembayaran == '01'
                ? 'color:green'
                : 'color:red'
            "
            ><b>{{
              formDaftarUlang.data.status_pembayaran == "00"
                ? "Menunggu Verifikasi"
                : formDaftarUlang.data.status_pembayaran == "01"
                ? "Pembayaran Berhasil"
                : "Pembayaran ditolak"
            }}</b></span
          >
        </v-col>

        <v-col cols="12" sm="12" stlye="padding:0">
          <div v-if="foto_bukti_regis_ulang" class="mt-2 text-center">
            <img
              :src="foto_bukti_regis_ulang"
              alt="Preview Foto"
              style="
                width: auto;
                height: 120px;
                object-fit: cover;
                border-radius: 5%;
                border: 2px solid #eee;
              "
            />
          </div>
          <v-file-input
            label="Upload Foto"
            accept="image/*"
            show-size
            v-if="formDaftarUlang.data?.status_pembayaran != '01'"
            @change="handleFotoChangeBuktiRegisUlang"
            class="mb-2"
          />
        </v-col>
        </v-col>
        


        <v-col
          v-if="dataPPDB.status_pendaftaran == 'P01' && dataPPDB.is_daftar_ulang != '1' && (dataPPDB.is_need_test == '0' || (dataPPDB.is_need_test == '1' && dataPPDB.status_test == '01' ))"
        >
          <v-btn
            color="warning"
            variant="flat"
            class="mr-2"
            :loading="loading"
            @click="daftarUlang(dataPPDB)"
            block
          >
            Daftar Ulang
          </v-btn>
        </v-col>
        
        <v-col cols="12" 
          v-if="dataPPDB.status_pendaftaran == 'P01' && dataPPDB.is_daftar_ulang == '1' && formDaftarUlang.data?.status_pembayaran != '01'">
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

        <v-col cols="12" class="text-right">
          <v-row>
            <v-col cols="12">
              <v-btn
                color="secondary"
                variant="flat"
                :disabled="false"
                v-if="dataPPDB.siswa_parent==null"
                block
                class="mr-2"
                :loading="loading"
                @click="backStep(5)"
              >
                Kembali
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </div>
  <div v-else class="text-center">
    <v-progress-circular
      indeterminate
      color="primary"
      size="240"
    ></v-progress-circular>
  </div>


  <!-- Snackbar error -->
  <v-snackbar v-model="show" color="error" timeout="3000">
    {{ message }}
  </v-snackbar>

  <!-- Snackbar Sucess -->
  <v-snackbar v-model="showSuccess" color="success" timeout="3000">
    {{ message }}
  </v-snackbar>


  <ConfirmDialog
    :modelValue="showConfirmDelete"
    :title="'Apakah anda yakin ingin mengirim berkas ?'"
    :message="'Mengirim berkas artinya anda sudah yakin data sudah terisi dengan lengkap'"
    :color="'primary'"
    @confirm="KirimBerkas"
    @cancel="showConfirmDelete = false"
  />
</template>

<script setup>

import { ref } from "vue";
import ConfirmDialog from "~/components/ConfirmDialog.vue";
const showConfirmDelete = ref(false);
const { $api } = useNuxtApp();
const loadingDiskon = ref(false);
const loading = ref(false);
const showSuccess = ref(false);
const show = ref(false);
const message = ref(null);

const foto_bukti_regis_ulang = ref(null);

const props = defineProps({
  dataRegist: null,
})
const emit = defineEmits(["update:step", "submit", "next-step"]);
const dataPPDB = ref(null);

const form = ref({
  id : null
});


const formDaftarUlang = ref({
  code_registrasi_ulang: null,
  biaya_pendaftaran: 0,
  bukti_pembayaran: null,
  data: null,
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
      if(dataPPDB.value.is_daftar_ulang == 1){
        getDaftarUlang(dataPPDB.value);
      }
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

function backStep (steps){
  emit("next-step", steps)
}


function handleFotoChangeBuktiRegisUlang(e) {
  let file;
  if (Array.isArray(e)) file = e[0];
  else if (e?.target?.files) file = e.target.files[0];
  else file = e;

  if (file) {
    formDaftarUlang.value.bukti_pembayaran = file;
    foto_bukti_regis_ulang.value = URL.createObjectURL(file);
  } else {
    formDaftarUlang.value.bukti_pembayaran = null;
    foto_bukti_regis_ulang.value = "/no-image.jpg";
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


async function getDaftarUlang(dataProp) {
  loading.value = true;
  try {
    const { data } = await $api.post("/register-ppdb/get-daftar-ulang", {
      id: dataProp.id,
    });
    formDaftarUlang.value.biaya_pendaftaran = data.data.biaya_pendaftaran;
    formDaftarUlang.value.code_registrasi_ulang = data.data.code_registrasi_ulang;
    formDaftarUlang.value.bukti_pembayaran = data.data.bukti_pembayaran;
    foto_bukti_regis_ulang.value = data.data.bukti_pembayaran;
    formDaftarUlang.value.data = data.data;
  } catch (error) {
    show.value = true;
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}

async function daftarUlang(data) {
  if (data.is_daftar_ulang == "1") {
    getDaftarUlang(data);
  } else {
    loading.value = true;
    try {
      const response = await $api.post("/register-ppdb/daftar-ulang", data);

      getDataRegister();
      getDaftarUlang(data);
    } catch (error) {
      show.value = true;
      message.value = "Terjadi kesalahan.";
    } finally {
      loading.value = false;
    }
  }
}



async function submitPayRegistrasiUlang() {
  loading.value = true;
  try {
    const formData = new FormData();
    if (formDaftarUlang.value.bukti_pembayaran == null) {
      show.value = true;
      message.value = "Bukti pembayaran belum di upload.";
    } else {
      for (const key in formDaftarUlang.value) {
        if (formDaftarUlang.value.hasOwnProperty(key)) {
          formData.append(key, formDaftarUlang.value[key]);
        }
      }
      const { data } = await $api.post(
        `/register-ppdb/pay-reg-ulang`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      formDaftarUlang.value.biaya_pendaftaran = 0;
      formDaftarUlang.value.bukti_pembayaran = null;
      formDaftarUlang.value.code_registrasi_ulang = null;
      foto_bukti_regis_ulang.value = null;
      getDaftarUlang(data.data);
    }
  } catch (error) {
    show.value = true;
    message.value = "Terjadi kesalahan.";
  } finally {
    loading.value = false;
  }
}

async function KirimBerkas() {
  loading.value = true;
  try {
    const { data } = await $api.post("/register-ppdb/kirim-berkas",{
      id : dataPPDB.value.id
    });
    showSuccess.value = true;
    message.value = "Berhasil kirim berkas";
      getDataRegister();

      showConfirmDelete.value= false;
  } catch (error) {
    show.value = true;
    message.value = "Kirim Berkas Gagal";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  foto_bukti_regis_ulang.value = "/no-image.jpg";
  getBankAccount();
  getDataRegister();
});

</script>
