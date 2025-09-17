<template>
  <div>
    <v-row>
      <v-col cols="12">
        <b>Pendafataran Unit</b>
      </v-col>

      <v-col cols="12">
        <v-form v-model="valid" @submit.prevent="handleCreateData">
          <v-row>
            <v-col cols="12">
              <v-checkbox
                v-for="option in sumberInformasiOptions"
                :key="option.value"
                :model-value="form.sumber_informasi.includes(option.value)"
                :label="option.text"
                @update:model-value="
                  toggleSumberInformasi(option.value, $event)
                "
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.nama_depan"
                label="Nama Depan *"
                required
                :rules="[(v) => !!v || 'Form harus diisi']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.nama_belakang"
                label="Nama Belakang *"
                required
                :rules="[(v) => !!v || 'Form harus diisi']"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.tgl_lahir"
                label="Tanggal Lahir *"
                type="date"
                required
                :rules="[(v) => !!v || 'Form harus diisi']"
              />
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="form.penanggung_jawab"
                :items="['Orang Tua', 'Wali']"
                label="Penanggung Jawab*"
                :rules="[(v) => !!v || 'Penanggung Jawab harus dipilih']"
                required
              />
            </v-col>
            <template v-if="form.penanggung_jawab === 'Orang Tua'">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.no_hp_ayah"
                  label="No Telepon Ayah"
                  required
                  :rules="[(v) => !!v || 'Form harus diisi']"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.no_hp_ibu"
                  label="No Telepon Ibu"
                  required
                  :rules="[(v) => !!v || 'Form harus diisi']"
                />
              </v-col>
            </template>
            <template v-else-if="form.penanggung_jawab === 'Wali'">
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="form.no_hp_wali"
                  label="No Telepon Wali"
                  required
                  :rules="[(v) => !!v || 'Form harus diisi']"
                />
              </v-col>
            </template>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.sekolah_id"
                :items="sekolah"
                item-title="name"
                item-value="id"
                label="Sekolah *"
                required
                :rules="[(v) => !!v || 'Form harus dipilih']"
                @update:model-value="
                  getGrade();
                  form.grade_id = null;
                "
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="form.grade_id"
                :items="grade"
                item-title="name"
                item-value="id"
                label="Grade *"
                required
                :rules="[(v) => !!v || 'Form harus dipilih']"
              />
            </v-col>

            <v-col cols="12" md="9">
              <v-text-field
                v-model="form.voucher_diskon"
                label="Voucher Diskon"
              />
            </v-col>

            <v-col cols="12" md="3" class="d-flex align-center">
              <v-btn
                color="primary"
                @click="applyVoucher"
                :loading="loadingDiskon"
                :disabled="loadingDiskon || !form.voucher_diskon"
              >
                Terapkan Diskon
              </v-btn>
            </v-col>

            <v-col cols="12" v-if="diskonAppliedMessage" class="mt-2">
              <v-alert type="success" dense text>
                {{ diskonAppliedMessage }}
              </v-alert>
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
});

const emit = defineEmits([
  "update:step",
  "submit",
  "next-step",
  "code-pendaftaran",
]);

const form = ref({
  id: null,
  code_ppdb: null,
  search: null,
  nama_depan: null,
  nama_belakang: null,
  penanggung_jawab: null,
  no_hp_ayah: null,
  no_hp_ibu: null,
  no_hp_wali: null,
  voucher_diskon: null,
  sekolah_id: null,
  grade_id: null,
  sumber_informasi: [],
});

const sumberInformasiOptions = [
  { text: "Teman/Tetangga", value: "teman_tetangga" },
  { text: "Sosial Media (IG/FB/TikTok)", value: "sosial_media" },
  { text: "Google/Website", value: "google_website" },
  { text: "Guru/Karyawan SIT Darul Maza", value: "guru_karyawan" },
];

function toggleSumberInformasi(value, checked) {
  if (checked) {
    if (!form.value.sumber_informasi.includes(value)) {
      form.value.sumber_informasi.push(value);
    }
  } else {
    const index = form.value.sumber_informasi.indexOf(value);
    if (index > -1) {
      form.value.sumber_informasi.splice(index, 1);
    }
  }
}

watch(
  () => props.dataRegist,
  (val) => {
    if (val) form.value.id = props.dataRegist;
  },
  { immediate: true }
);

const dataPPDB = ref(null);
const sekolah = ref([]);
const grade = ref([]);
const diskonAppliedMessage = ref(null);

async function getRole() {
  loading.value = true;
  try {
    const data = await $api.get(`/master-data/sekolah/get-select`);
    sekolah.value = data.data.data;
  } catch (error) {
    // show.value = true
    // message.value = error.response?.data?.message || 'Gagal Mendapatkan Data.'
  } finally {
    loading.value = false;
  }
}

async function getGrade() {
  loading.value = true;
  try {
    const data = await $api.post(`/master-data/sekolah/get-select-grade`, {
      sekolah_id: form.value.sekolah_id,
    });
    grade.value = data.data.data;
  } catch (error) {
    // show.value = true
    // message.value = error.response?.data?.message || 'Gagal Mendapatkan Data.'
  } finally {
    loading.value = false;
  }
}

function applyVoucher() {
  loadingDiskon.value = true;
  $api
    .post("/register-ppdb/apply-voucher", {
      code_ppdb: form.value.code_ppdb,
      voucher_diskon: form.value.voucher_diskon,
    })
    .then((response) => {
      showSuccess.value = true;
      message.value = "Voucher berhasil diterapkan";
      diskonAppliedMessage.value = "Voucher berhasil diterapkan";
      form.value.diskon = response.data.diskon;
    })
    .catch((error) => {
      diskonAppliedMessage.value = null;
      show.value = true;
      message.value =
        error.response?.data?.message || "Gagal menerapkan voucher.";
    })
    .finally(() => {
      loadingDiskon.value = false;
    });
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

    formData.append(
      "sumber_informasi",
      JSON.stringify(form.value.sumber_informasi)
    );

    if (
      form.value.sekolah_id == null ||
      form.value.grade_id == null ||
      form.value.penanggung_jawab == null ||
      form.value.nama_depan == null ||
      form.value.nama_belakang == null ||
      form.value.tgl_lahir == null ||
      (form.value.penanggung_jawab === "Orang Tua" &&
        (form.value.no_hp_ayah == null || form.value.no_hp_ibu == null)) ||
      (form.value.penanggung_jawab === "Wali" && form.value.no_hp_wali == null)
    ) {
      show.value = true;
      message.value = "Harap isi form dengan lengkap";
    } else {
      // Tambahkan nilai step secara eksplisit
      formData.append("step", 1);

      const { data } = await $api.post(`/register-ppdb/update-form`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      emit("next-step", 2);
      emit("code-pendaftaran", data.data.id);
      emit("submit");
    }
  } catch (error) {
    show.value = true;
    message.value =
      error?.response?.data?.message ||
      error?.message ||
      "Terjadi kesalahan pada server.";
  } finally {
    loading.value = false;
  }
}

async function getDataRegister() {
  loading.value = true;
  try {
    const data = await $api.post(`/register-ppdb/get-data`, {
      ids: props.dataRegist,
    });
    dataPPDB.value = data.data.data[0];

    form.value.nama_depan = dataPPDB.value.siswa.nama_depan;
    form.value.nama_belakang = dataPPDB.value.siswa.nama_belakang;
    form.value.tgl_lahir = dataPPDB.value.siswa.tgl_lahir;
    form.value.sekolah_id = dataPPDB.value.sekolah_id;
    form.value.code_ppdb = dataPPDB.value.code_pendaftaran;
    form.value.voucher_diskon = dataPPDB.value.voucher_diskon;
    form.value.sumber_informasi = dataPPDB.value.sumber_informasi || [];
    form.value.id = props.dataRegist;
    getGrade();
    form.value.grade_id = dataPPDB.value.grade_id;
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getRole();
  getDataRegister();
});
</script>
