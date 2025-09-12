<template>
  <div v-if="dataPPDB != null">
    <v-form v-model="valid" @submit.prevent="handleCreateData">
      <v-row>
        <v-col cols="12">
          <b>Detail Siswa</b>
        </v-col>
        <v-col cols="12" sm="12" stlye="padding:0">
          <div v-if="fotoPreviewFotoSiswa" class="mt-2 text-center">
            <img
              :src="fotoPreviewFotoSiswa"
              alt="Preview Foto"
              style="
                width: 120px;
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
            @change="handleFotoChangeFotoSiswa"
            class="mb-2"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.nama_depan"
            label="Nama Depan *"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.nama_belakang"
            label="Nama Belakang *"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="form.nisn" label="NISN" type="number" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.no_akte_kelahiran"
            label="No Akte Kelahiran"
            type="number"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field v-model="form.nik" label="NIK" type="number" />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.agama"
            :items="['Islam', 'Kristen', 'Budha', 'Hindu', 'Konghucu']"
            label="Agama*"
            :rules="[(v) => !!v || 'Agama harus dipilih']"
            required
            return-object="false"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.jenis_kelamin"
            :items="['Laki-laki', 'Perempuan']"
            label="Jenis Kelamin*"
            :rules="[(v) => !!v || 'Jenis Kelamin harus dipilih']"
            required
            return-object="false"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.tempat_lahir"
            label="Tempat Lahir*"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.tgl_lahir"
            label="Tanggal Lahir*"
            type="date"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.anak_ke"
            label="Anak Ke*"
            required
            type="number"
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.jumlah_saudara"
            label="Jumlah Saudara*"
            required
            type="number"
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.goldarah"
            :items="['O', 'A', 'B', 'AB']"
            label="Golongan Darah*"
            :rules="[(v) => !!v || 'Golongan Darah harus dipilih']"
            required
            return-object="false"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.kewarganegaraan"
            label="Kewarganegaraan*"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="form.hobby" label="Hobby" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="form.cita_cita" label="Cita - Cita" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.tinggi_badan"
            label="Tinggi Badan"
            type="number"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.berat_badan"
            label="Berat Badan"
            type="number"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="form.no_handphone"
            label="No Handphone*"
            required
            type="number"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="form.riwayat_kesehatan"
            label="Riwayat Kesehatan*"
            required
          />
        </v-col>

        <v-col cols="12" md="12">
          <v-select
            v-model="form.jenis_beasiswa"
            :items="['Tahfidz', 'Akademik', 'Non Akademik']"
            label="Jenis Beasiswa"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="12" v-if="form.jenis_beasiswa === 'Tahfidz'">
          <v-select
            v-model="form.jumlah_juz"
            :items="['15 Juz', '5-10 Juz', '3-5 Juz']"
            label="Berapa Juz"
            outlined
            dense
          />
        </v-col>

        <template
          v-if="
            form.jenis_beasiswa === 'Akademik' ||
            form.jenis_beasiswa === 'Non Akademik'
          "
        >
          <v-col cols="12" md="12">
            <v-text-field
              v-model="form.nama_prestasi"
              label="Nama Prestasi"
              outlined
              dense
            />
          </v-col>
          <v-col cols="12" md="12">
            <div
              v-if="fotoPreviewFotoSertifikat"
              class="mt-2 text-center"
            >
              <img
                :src="fotoPreviewFotoSertifikat"
                alt="Preview Foto"
                style="
                  width: 120px;
                  height: 120px;
                  object-fit: cover;
                  border-radius: 5%;
                  border: 2px solid #eee;
                "
              />
            </div>
            <v-file-input
              @change="handleFotoChangeFotoSertifikat"
              label="Upload Sertifikat"
              outlined
              dense
              accept="image/*"
            />
          </v-col>
        </template>

        <v-col cols="12" md="12">
          <v-select
            v-model="form.is_alumni"
            :items="[
              { value: 0, text: 'Bukan Alumni' },
              { value: 1, text: 'Alumni' },
            ]"
            item-title="text"
            item-value="value"
            label="Apakah Alumni Darul Maza"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.status_pendaftaran_siswa"
            :items="['Siswa Baru', 'Siswa Pindahan']"
            label="Status Pendaftaran*"
            :rules="[(v) => !!v || 'Status Pendaftaran harus dipilih']"
            required
            return-object="false"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.asal_sekolah"
            label="Asal Sekolah*"
            required
            :rules="
              form.status_pendaftaran_siswa === 'Siswa Pindahan'
                ? [(v) => !!v || 'Form harus diisi']
                : []
            "
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
          v-if="form.status_pendaftaran_siswa == 'Siswa Pindahan'"
        >
          <v-text-field
            v-model="form.jenjang_terakhir"
            label="Jenjang Terakhir*"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
          v-if="
            form.status_pendaftaran_siswa == 'Siswa Pindahan' &&
            form.dataPPDB != null
          "
        >
          <v-text-field
            v-model="form.dataPPDB.sekolah_grade.name"
            label="Jenjang Lanjutan*"
            required
            readonly
          />
        </v-col>

        <v-col cols="12">
          <v-select
            v-model="form.bahasa_sehari_hari"
            :items="[
              'Bahasa Indonesia',
              'Bahasa Arab',
              'Bahasa Inggris',
              'Bahasa Daerah',
            ]"
            label="Bahasa Sehari Hari*"
            :rules="[(v) => !!v || 'Bahasa Sehari Hari harus dipilih']"
            required
            return-object="false"
          />
        </v-col>

        <v-col cols="12">
          <v-switch
            v-model="form.kebutuhan_spesial"
            label="Apakah memiliki kebutuhan khusus?"
            color="primary"
            inset
          ></v-switch>
        </v-col>

        <v-col
          cols="12"
          v-if="
            dataPPDB.sekolah != null
              ? dataPPDB.sekolah.is_need_nem == '1'
              : false
          "
        >
          <v-text-field
            v-model="form.nilai_nem"
            label="NEM*"
            required
            type="number"
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col
          cols="12"
          v-if="
            dataPPDB.sekolah != null
              ? dataPPDB.sekolah.is_need_nem == '1'
              : false
          "
        >
          <div class="mb-2" v-if="dataPPDB.siswa.file_raport != null">
            <a :href="dataPPDB.siswa.file_raport" target="_blank"
              ><v-icon>bx-file</v-icon> Ijazah</a
            >
          </div>
          <v-file-input
            label="Upload Ijazah Terakhir"
            show-size
            v-modal="form.file_raport"
            class="mb-2"
            @change="handleFileRaport"
          />
        </v-col>
        <v-col cols="12" v-if="dataPPDB.sekolah != null">
          <div class="mb-2" v-if="dataPPDB.file_akte_lahir != null">
            <a :href="dataPPDB.file_akte_lahir" target="_blank" download
              ><v-icon>bx-file</v-icon> Akte Lahir</a
            >
          </div>
          <v-file-input
            label="Upload Akte Lahir"
            show-size
            v-modal="form.file_akte_lahir"
            class="mb-2"
            @change="handleFileAkte"
          />
        </v-col>
        <v-col cols="12" v-if="dataPPDB.sekolah != null">
          <div
            class="mb-2"
            v-if="dataPPDB.file_kartu_keluarga != null"
          >
            <a :href="dataPPDB.file_kartu_keluarga" target="_blank" download
              ><v-icon>bx-file</v-icon> Kartu Keluarga</a
            >
          </div>
          <v-file-input
            label="Upload Kartu Keluarga"
            show-size
            v-modal="form.file_kartu_keluarga"
            class="mb-2"
            @change="handleFileKK"
          />
        </v-col>

        <v-col cols="12">
          <v-select
            v-model="form.award"
            :items="['Tidak ada', 'Ada']"
            label="Apakah memiliki prestasi?"
            required
            return-object="false"
          />
        </v-col>

        <v-col
          cols="12"
          sm="12"
          stlye="padding:0"
          v-if="form.award == 'Ada'"
        >
          <div v-if="fotoPreview" class="mt-2 text-center">
            <img
              :src="fotoPreview"
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
            @change="handleFotoChange"
            class="mb-2"
          />
        </v-col>

        <v-col cols="12" md="6" v-if="form.award == 'Ada'">
          <v-text-field
            v-model="form.award_name"
            label="Nama Prestasi*"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col cols="12" md="6" v-if="form.award == 'Ada'">
          <v-text-field
            v-model="form.award_date"
            label="Tanggal didapat*"
            type="date"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col cols="12" class="text-right">
          <v-row>
            <v-col cols="6">
              <v-btn
                color="secondary"
                variant="flat"
                :disabled="true"
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
                Simpan dan lanjut
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
  <div v-else class="text-center">
    <v-progress-circular
      indeterminate
      color="primary"
      size="240"
    ></v-progress-circular>
  </div>
</template>

<script setup>

import { ref } from "vue";

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
  code_ppdb: null,
  search: null,
  nama_depan: null,
  nama_belakang: null,
  tempat_lahir: null,
  asal_sekolah: null,
  goldarah: null,
  kewarganegaraan: null,
  jenjang_terakhir: null,
  tgl_lahir: null,
  nisn: null,
  no_akte_kelahiran: null,
  penanggung_jawab: "Orang Tua",
  agama: null,
  nik: null,
  anak_ke: null,
  hobby: null,
  cita_cita: null,
  jumlah_saudara: null,
  tinggi_badan: null,
  berat_badan: null,
  riwayat_kesehatan: null,
  no_handphone: null,
  kebutuhan_spesial: false,
  bahasa_sehari_hari: null,
  status_pendaftaran_siswa: null,
  award: "Tidak ada",
  award_image: null,
  award_name: null,
  award_date: null,
  foto_siswa: null,
  nem: null,
  file_raport: null,
  file_akte_lahir: null,
  file_kartu_keluarga: null,
  jenis_beasiswa: "",
  jumlah_juz: "",
  nama_prestasi: "",
  foto_sertifikat: null,
});


const fotoPreview = ref(null);
const fotoPreviewFotoSiswa = ref(null);
const fotoPreviewFotoSertifikat = ref(null);


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

    form.value.nama_depan = dataPPDB.value.siswa.nama_depan;
    form.value.nama_belakang = dataPPDB.value.siswa.nama_belakang;
    form.value.tgl_lahir = dataPPDB.value.siswa.tgl_lahir;
    form.value.nik = dataPPDB.value.siswa.nik;
    form.value.nisn = dataPPDB.value.siswa.nisn;
    form.value.no_akte_kelahiran = dataPPDB.value.siswa.no_akte_kelahiran;
    form.value.agama = dataPPDB.value.siswa.agama;
    form.value.jenis_kelamin = dataPPDB.value.siswa.jenis_kelamin;
    form.value.tempat_lahir = dataPPDB.value.siswa.tempat_lahir;
    form.value.anak_ke = dataPPDB.value.siswa.anak_ke;
    form.value.jumlah_saudara = dataPPDB.value.siswa.jumlah_saudara;
    form.value.goldarah = dataPPDB.value.siswa.goldarah;
    form.value.kewarganegaraan = dataPPDB.value.siswa.kewarganegaraan;
    form.value.cita_cita = dataPPDB.value.siswa.cita_cita;
    form.value.hobby = dataPPDB.value.siswa.hobby;
    form.value.no_handphone = dataPPDB.value.siswa.no_handphone;
    form.value.riwayat_kesehatan = dataPPDB.value.siswa.riwayat_kesehatan;
    form.value.jenis_beasiswa = dataPPDB.value.siswa.jenis_beasiswa;
    form.value.jumlah_juz = dataPPDB.value.siswa.jumlah_juz;
    form.value.berat_badan = dataPPDB.value.siswa.berat_badan;
    form.value.tinggi_badan = dataPPDB.value.siswa.tinggi_badan;
    form.value.riwayat_kesehatan = dataPPDB.value.siswa.riwayat_kesehatan;
    form.value.kebutuhan_spesial =dataPPDB.value.siswa.kebutuhan_spesial == "1" ? true : false;
    form.value.is_alumni = dataPPDB.value.siswa.is_alumni;
    form.value.bahasa_sehari_hari = dataPPDB.value.siswa.bahasa_sehari_hari;
    form.value.asal_sekolah = dataPPDB.value.asal_sekolah;
    form.value.nama_prestasi = dataPPDB.value.siswa.nama_prestasi;
    form.value.status_pendaftaran_siswa = dataPPDB.value.status_pendaftaran_siswa;

    fotoPreviewFotoSiswa.value = dataPPDB.value.siswa.foto_siswa;
    fotoPreviewFotoSertifikat.value = dataPPDB.value.siswa.foto_sertifikat;

    if (dataPPDB.value.siswa_award != null) {
      form.value.award_name = dataPPDB.value.siswa_award.award;
      form.value.award_date = dataPPDB.value.siswa_award.tgl_didapat;
      fotoPreview.value = dataPPDB.value.siswa_award.image;
    }


    form.value.award = dataPPDB.value.siswa_award != null ? "Ada" : "Tidak Ada";

  } catch (error) {
    // show.value = true
    // message.value = error.response?.data?.message || 'Gagal Mendapatkan Data.'
  } finally {
    loading.value = false;
  }
}



function handleFotoChange(e) {
  let file;
  if (Array.isArray(e)) file = e[0];
  else if (e?.target?.files) file = e.target.files[0];
  else file = e;

  if (file) {
    form.value.award_image = file;
    fotoPreview.value = URL.createObjectURL(file);
  } else {
    form.value.award_image = null;
    fotoPreview.value = "/no-image.jpg";
  }
}


function handleFotoChangeFotoSiswa(e) {
  let file;
  if (Array.isArray(e)) file = e[0];
  else if (e?.target?.files) file = e.target.files[0];
  else file = e;

  if (file) {
    form.value.foto_siswa = file;
    fotoPreviewFotoSiswa.value = URL.createObjectURL(file);
  } else {
    form.value.foto_siswa = null;
    fotoPreviewFotoSiswa.value = "/no-image.jpg";
  }
}
function handleFotoChangeFotoSertifikat(e) {
  let file;
  if (Array.isArray(e)) file = e[0];
  else if (e?.target?.files) file = e.target.files[0];
  else file = e;

  if (file) {
    form.value.foto_sertifikat = file;
    fotoPreviewFotoSertifikat.value = URL.createObjectURL(file);
  } else {
    form.value.foto_sertifikat = null;
    fotoPreviewFotoSertifikat.value = "/no-image.jpg";
  }
}


function handleFileRaport(e) {
  let file;
  if (Array.isArray(e)) file = e[0];
  else if (e?.target?.files) file = e.target.files[0];
  else file = e;

  if (file) {
    form.value.file_raport = file;
  } else {
    form.value.file_raport = null;
  }
}

function handleFileAkte(e) {
  let file;
  if (Array.isArray(e)) file = e[0];
  else if (e?.target?.files) file = e.target.files[0];
  else file = e;

  if (file) {
    form.value.file_akte_lahir = file;
  } else {
    form.value.file_akte_lahir = null;
  }
}

function handleFileKK(e) {
  let file;
  if (Array.isArray(e)) file = e[0];
  else if (e?.target?.files) file = e.target.files[0];
  else file = e;

  if (file) {
    form.value.file_kartu_keluarga = file;
  } else {
    form.value.file_kartu_keluarga = null;
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
    
    if (!form.value.nama_depan ||
          !form.value.nama_belakang ||
          !form.value.jenis_kelamin ||
          !form.value.status_pendaftaran_siswa ||
          !form.value.tempat_lahir ||
          !form.value.tgl_lahir ||
          !form.value.bahasa_sehari_hari ||
          !form.value.agama ||
          !form.value.anak_ke ||
          !form.value.kewarganegaraan ||
          !form.value.goldarah ||
          !form.value.jumlah_saudara ||
          (dataPPDB.sekolah?.is_need_nem === "1" &&
            (!form.value.nilai_nem ||
              (!dataPPDB.siswa?.file_raport && !form.value.file_raport))) ||
          (form.value.status_pendaftaran_siswa === "Siswa Pindahan" &&
            (!form.value.sekolah_asal || !form.value.jenjang_terakhir))) {
      show.value = true;
      message.value = "Harap isi form dengan lengkap";
    } else {
      formData.append("step", 3);
      const { data } = await $api.post(`/register-ppdb/update-form`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      emit("next-step", 4)
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

const downloadFile = (data,title) => {
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", title); // force download
  document.body.appendChild(link);
  link.click();
  link.remove();
};

onMounted(() => {
  getDataRegister();
  fotoPreview.value = "/no-image.jpg";
  fotoPreviewFotoSiswa.value = "/no-image.jpg";
});

</script>
