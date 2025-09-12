<template>
  <div v-if="dataPPDB != null">
    <v-form v-model="valid" @submit.prevent="handleCreateData">
      <v-row>
        <v-col cols="12">
          <b>Orang Tua Calon Siswa</b>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="form.penanggung_jawab"
            :items="['Orang Tua', 'Wali']"
            label="Penanggung Jawab*"
            :rules="[(v) => !!v || 'Pilih salah satu penanggung jawab']"
            required
          />
        </v-col>
        <!-- Data Orang Tua -->
        <template v-if="form.penanggung_jawab === 'Orang Tua'">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.nama_ayah"
              label="Nama Ayah*"
              required
              :rules="[(v) => !!v || 'From harus diisi']"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.nik_ayah"
              label="NIK Ayah*"
              required
              :rules="[(v) => !!v || 'From harus diisi']"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.no_telepon_ayah"
              label="No Telepon"
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.no_hp_ayah"
              label="No Handphone"
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="form.pendidikan_terakhir_ayah"
              :items="[
                'SD / MI',
                'SMP / MTs',
                'SMA / MA',
                'SMK / MAK',
                'Diploma',
                'Sarjana (S1)',
                'Magister (S2)',
                'Doktor (S3)',
              ]"
              label="Pendidikan Terakhir Ayah*"
              :rules="[
                (v) => !!v || 'Pendidikan Terakhir Ayah harus dipilih',
              ]"
              required
              return-object="false"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.pekerjaan_ayah"
              :items="[
                'PNS',
                'Pegawai Swasta',
                'Pegawai BUMN',
                'TNI/POLISI',
                'GURU',
                'DOSEN',
                'Wirausaha',
                'Tidak Bekerja',
                'Lainnya',
              ]"
              label="Pekerjaan Ayah*"
              :rules="[(v) => !!v || 'Pekerjaan Ayah harus dipilih']"
              required
              return-object="false"
            />
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="form.penghasilan_ayah"
              :items="[
                'Kurang dari Rp 1.000.000',
                'Rp 1.000.000 – Rp 2.000.000',
                'Rp 2.000.000 – Rp 3.000.000',
                'Rp 3.000.000 – Rp 5.000.000',
                'Rp 5.000.000 – Rp 10.000.000',
                'Lebih dari Rp 10.000.000',
                'Tidak memiliki penghasilan',
              ]"
              label="Penghasilan Ayah*"
              :rules="[(v) => !!v || 'Penghasilan Ayah harus dipilih']"
              required
              return-object="false"
            />
          </v-col>

          <v-col cols="12">
            <v-checkbox
              v-model="form.is_same_address_ayah"
              label="Apakah alamat sama dengan siswa ?"
              @click="updateSameAddress('ayah')"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.alamat_ayah"
              label="Alamat*"
              required
              :rules="[(v) => !!v || 'From harus diisi']"
            />
          </v-col>
          <v-divider class="mb-2 mt-2" />
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.nama_ibu"
              label="Nama Ibu*"
              required
              :rules="[(v) => !!v || 'From harus diisi']"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.nik_ibu"
              label="NIK Ibu*"
              required
              :rules="[(v) => !!v || 'From harus diisi']"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.no_telepon_ibu"
              label="No Telepon"
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.no_hp_ibu"
              label="No Handphone"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.pendidikan_terakhir_ibu"
              :items="[
                'SD / MI',
                'SMP / MTs',
                'SMA / MA',
                'SMK / MAK',
                'Diploma',
                'Sarjana (S1)',
                'Magister (S2)',
                'Doktor (S3)',
              ]"
              label="Pendidikan Terakhir Ibu*"
              :rules="[
                (v) => !!v || 'Pendidikan Terakhir Ibu harus dipilih',
              ]"
              required
              return-object="false"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.pekerjaan_ibu"
              :items="[
                'PNS',
                'Pegawai Swasta',
                'Pegawai BUMN',
                'TNI/POLISI',
                'GURU',
                'DOSEN',
                'Wirausaha',
                'Ibu Rumah Tangga',
                'Lainnya',
              ]"
              label="Pekerjaan Ibu*"
              :rules="[(v) => !!v || 'Pekerjaan Ibu harus dipilih']"
              required
              return-object="false"
            />
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="form.penghasilan_ibu"
              :items="[
                'Kurang dari Rp 1.000.000',
                'Rp 1.000.000 – Rp 2.000.000',
                'Rp 2.000.000 – Rp 3.000.000',
                'Rp 3.000.000 – Rp 5.000.000',
                'Rp 5.000.000 – Rp 10.000.000',
                'Lebih dari Rp 10.000.000',
                'Tidak memiliki penghasilan',
              ]"
              label="Penghasilan Ibu*"
              :rules="[(v) => !!v || 'Penghasilan Ibu harus dipilih']"
              required
              return-object="false"
            />
          </v-col>

          <v-col cols="12">
            <v-checkbox
              v-model="form.is_same_address_ibu"
              label="Apakah alamat sama dengan siswa ?"
              @click="updateSameAddress('ibu')"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.alamat_ibu"
              label="Alamat*"
              required
              :rules="[(v) => !!v || 'From harus diisi']"
            />
          </v-col>
        </template>
        <template v-else>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.nama_wali"
              label="Nama Wali*"
              required
              :rules="[(v) => !!v || 'From harus diisi']"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.nik_wali"
              label="NIK Wali*"
              required
              :rules="[(v) => !!v || 'From harus diisi']"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.no_telepon_wali"
              label="No Telepon*"
              required
              :rules="[(v) => !!v || 'From harus diisi']"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.no_hp_wali"
              label="No Handphone"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.pendidikan_terakhir_wali"
              :items="[
                'SD / MI',
                'SMP / MTs',
                'SMA / MA',
                'SMK / MAK',
                'Diploma',
                'Sarjana (S1)',
                'Magister (S2)',
                'Doktor (S3)',
              ]"
              label="Pendidikan Terakhir Wali*"
              :rules="[
                (v) => !!v || 'Pendidikan Terakhir Wali harus dipilih',
              ]"
              required
              return-object="false"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.pekerjaan_wali"
              :items="[
                'PNS',
                'Pegawai Swasta',
                'Pegawai BUMN',
                'TNI/POLISI',
                'GURU',
                'DOSEN',
                'Wirausaha',
                'Ibu Rumah Tangga',
                'Lainnya',
              ]"
              label="Pekerjaan Wali*"
              :rules="[(v) => !!v || 'Pekerjaan Wali harus dipilih']"
              required
              return-object="false"
            />
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="form.penghasilan_wali"
              :items="[
                'Kurang dari Rp 1.000.000',
                'Rp 1.000.000 – Rp 2.000.000',
                'Rp 2.000.000 – Rp 3.000.000',
                'Rp 3.000.000 – Rp 5.000.000',
                'Rp 5.000.000 – Rp 10.000.000',
                'Lebih dari Rp 10.000.000',
                'Tidak memiliki penghasilan',
              ]"
              label="Penghasilan Wali*"
              :rules="[(v) => !!v || 'Penghasilan Wali harus dipilih']"
              required
              return-object="false"
            />
          </v-col>

          <v-col cols="12">
            <v-checkbox
              v-model="form.is_same_address_wali"
              label="Apakah alamat sama dengan siswa ?"
              @click="updateSameAddress('wali')"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.alamat_wali"
              label="Alamat*"
              required
              :rules="[(v) => !!v || 'From harus diisi']"
            />
          </v-col>
        </template>
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
                @click="backStep(4)"
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
  penanggung_jawab: null,

  nama_ayah: null,
  nik_ayah: null,
  no_telepon_ayah: null,
  no_hp_ayah: null,
  pekerjaan_ayah: null,
  pendidikan_terakhir_ayah: null,
  penghasilan_ayah: null,
  alamat_ayah: null,
  is_same_address_ayah: null,

  nama_ibu: null,
  nik_ibu: null,
  no_telepon_ibu: null,
  no_hp_ibu: null,
  pekerjaan_ibu: null,
  pendidikan_terakhir_ibu: null,
  penghasilan_ibu: null,
  alamat_ibu: null,
  is_same_address_ibu: null,

  nama_wali: null,
  nik_wali: null,
  no_telepon_wali: null,
  no_hp_wali: null,
  pekerjaan_wali: null,
  pendidikan_terakhir_wali: null,
  penghasilan_wali: null,
  alamat_wali: null,
  is_same_address_wali: null,

});


watch(
  () => props.dataRegist,
  (val) => {
    if (val) form.value.id = props.dataRegist
  },
  { immediate: true }
)


async function getDataRegister() {
  loading.value = true;
  try {
    const data = await $api.post(`/register-ppdb/get-data`,{
        ids : props.dataRegist
    });
    dataPPDB.value = data.data.data[0];
    if (dataPPDB.value.siswa_parent != null) {
      form.value.penanggung_jawab = dataPPDB.value.siswa_parent.penanggung_jawab;
      form.value.nama_ayah = dataPPDB.value.siswa_parent.nama_ayah;
      form.value.nik_ayah = dataPPDB.value.siswa_parent.nik_ayah;
      form.value.pekerjaan_ayah = dataPPDB.value.siswa_parent.pekerjaan_ayah;
      form.value.pendidikan_terakhir_ayah =
        dataPPDB.value.siswa_parent.pendidikan_terakhir_ayah;
      form.value.penghasilan_ayah = dataPPDB.value.siswa_parent.penghasilan_ayah;
      form.value.no_hp_ayah = dataPPDB.value.siswa_parent.no_hp_ayah;
      form.value.no_telepon_ayah = dataPPDB.value.siswa_parent.no_telepon_ayah;
      form.value.alamat_ayah = dataPPDB.value.siswa_parent.alamat_ayah;
      form.value.is_same_address_ayah =
        dataPPDB.value.siswa_parent.is_same_address_ayah == "true" ? true : false;

      form.value.nama_ibu = dataPPDB.value.siswa_parent.nama_ibu;
      form.value.nik_ibu = dataPPDB.value.siswa_parent.nik_ibu;
      form.value.pekerjaan_ibu = dataPPDB.value.siswa_parent.pekerjaan_ibu;
      form.value.pendidikan_terakhir_ibu =
        dataPPDB.value.siswa_parent.pendidikan_terakhir_ibu;
      form.value.penghasilan_ibu = dataPPDB.value.siswa_parent.penghasilan_ibu;
      form.value.no_hp_ibu = dataPPDB.value.siswa_parent.no_hp_ibu;
      form.value.no_telepon_ibu = dataPPDB.value.siswa_parent.no_telepon_ibu;
      form.value.alamat_ibu = dataPPDB.value.siswa_parent.alamat_ibu;
      form.value.is_same_address_ibu =
        dataPPDB.value.siswa_parent.is_same_address_ibu == "true" ? true : false;

      form.value.nama_wali = dataPPDB.value.siswa_parent.nama_wali;
      form.value.nik_wali = dataPPDB.value.siswa_parent.nik_wali;
      form.value.pekerjaan_wali = dataPPDB.value.siswa_parent.pekerjaan_wali;
      form.value.pendidikan_terakhir_wali =
        dataPPDB.value.siswa_parent.pendidikan_terakhir_wali;
      form.value.penghasilan_wali = dataPPDB.value.siswa_parent.penghasilan_wali;
      form.value.no_hp_wali = dataPPDB.value.siswa_parent.no_hp_wali;
      form.value.no_telepon_wali = dataPPDB.value.siswa_parent.no_telepon_wali;
      form.value.alamat_wali = dataPPDB.value.siswa_parent.alamat_wali;
      form.value.is_same_address_wali =
        dataPPDB.value.siswa_parent.is_same_address_wali == "true" ? true : false;
    }
    

  } catch (error) {
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
    
    if (( (form.value.penanggung_jawab == 'Orang Tua' &&  ( form.value.nama_ayah == null ||
        form.value.nik_ayah == null ||
        form.value.pekerjaan_ayah == null ||
        form.value.pendidikan_terakhir_ayah == null ||
        form.value.penghasilan_ayah == null ||
        form.value.alamat_ayah == null ||
        form.value.nik_ibu == null ||
        form.value.nama_ibu == null ||
        form.value.pekerjaan_ibu == null ||
        form.value.pendidikan_terakhir_ibu == null ||
        form.value.penghasilan_ibu == null ||
        form.value.alamat_ibu == null) ) ||
        (form.value.penanggung_jawab != 'Orang Tua' && (form.value.nik_wali == null ||
        form.value.nama_wali == null ||
        form.value.pekerjaan_wali == null ||
        form.value.pendidikan_terakhir_wali == null ||
        form.value.penghasilan_wali == null ||
        form.value.alamat_wali == null)))) {
      show.value = true;
      message.value = "Harap isi form dengan lengkap";
    } else {
      formData.append("step", 5);
      const { data } = await $api.post(`/register-ppdb/update-form`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      emit("next-step", 6)
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


async function updateSameAddress(type) {
  const alamat =
    dataPPDB.value.siswa_address.alamat +
    ", Kel/Des. " +
    dataPPDB.value.siswa_address.desa +
    ", Kec. " +
    dataPPDB.value.siswa_address.district +
    ", " +
    dataPPDB.value.siswa_address.kota +
    " Prov. " +
    dataPPDB.value.siswa_address.provinsi +
    " " +
    dataPPDB.value.siswa_address.zip_code;
  if (type == "ayah") {
    form.value.alamat_ayah = alamat;
  }

  if (type == "ibu") {
    form.value.alamat_ibu = alamat;
  }
  if (type == "wali") {
    form.value.alamat_wali = alamat;
  }
}

function backStep (steps){
  emit("next-step", steps)
}

onMounted(() => {
  form.value.penanggung_jawab ='Orang Tua'
  getDataRegister();
});

</script>
