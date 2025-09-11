<template>
  <div v-if="dataPPDB != null">
    <v-form v-model="valid" @submit.prevent="handleCreateData">
      <v-row>
        <v-col cols="12">
          <b>Jarak Rumah ke Sekolah</b>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="form.jarak_rumah_sekolah"
            label="Jarak Rumah ke Sekolah*"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>
        <v-col cols="12">
          <b>Alamat</b>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="form.alamat_siswa"
            label="Alamat Lengkap*"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>
        <v-col cols="6" md="6">
          <v-text-field
            v-model="form.rt_siswa"
            label="RT*"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>
        <v-col cols="6" md="6">
          <v-text-field
            v-model="form.rw_siswa"
            label="RW*"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="form.zip_code_siswa"
            label="Kode Pos*"
            required
            :rules="[(v) => !!v || 'From harus diisi']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.provinsi_id_siswa"
            :items="provinceData"
            item-title="name"
            item-value="code"
            label="Provinsi*"
            :rules="[(v) => !!v || 'Form harus dipilih']"
            required
            @update:model-value="getKota(form.provinsi_id_siswa)"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.city_id_siswa"
            :items="cityData"
            item-title="name"
            item-value="code"
            label="Kota*"
            :rules="[(v) => !!v || 'Form harus dipilih']"
            required
            @update:model-value="getKelurahan(form.city_id_siswa)"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.district_id_siswa"
            :items="disctrictData"
            item-title="name"
            item-value="code"
            label="Kecamatan*"
            :rules="[(v) => !!v || 'Form harus dipilih']"
            required
            @update:model-value="getVillage(form.district_id_siswa)"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.subdistrict_id_siswa"
            :items="villageData"
            item-title="name"
            item-value="code"
            label="Desa*"
            :rules="[(v) => !!v || 'Form harus dipilih']"
            required
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
                @click="backStep(3)"
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

  jarak_rumah_sekolah: null,
  alamat_siswa: null,
  rt_siswa: null,
  rw_siswa: null,
  zip_code_siswa: null,
  provinsi_id_siswa: null,
  city_id_siswa: null,
  district_id_siswa: null,
  subdistrict_id_siswa: null,
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


    if (dataPPDB.value.siswa_address != null) {
      form.value.jarak_rumah_sekolah = dataPPDB.value.siswa_address.jarak_rumah_sekolah;
      form.value.alamat_siswa = dataPPDB.value.siswa_address.alamat;
      form.value.rt_siswa = dataPPDB.value.siswa_address.rt;
      form.value.rw_siswa = dataPPDB.value.siswa_address.rw;
      getProvince();
      form.value.provinsi_id_siswa = dataPPDB.value.siswa_address.provinsi_id;
      getKota(form.value.provinsi_id_siswa);
      form.value.city_id_siswa = dataPPDB.value.siswa_address.city_id;
      getKelurahan(form.value.city_id_siswa);
      form.value.district_id_siswa = dataPPDB.value.siswa_address.district_id;
      getVillage(form.value.district_id_siswa);
      form.value.subdistrict_id_siswa = dataPPDB.value.siswa_address.subdistrict_id;
      form.value.zip_code_siswa = dataPPDB.value.siswa_address.zip_code;
    }
    

  } catch (error) {
  } finally {
    loading.value = false;
  }
}



const provinceData = ref([]);
const cityData = ref([]);
const disctrictData = ref([]);
const villageData = ref([]);

async function getProvince() {
  loading.value = true;
  try {
    const { data } = await $api.get("/province/get-data");
    provinceData.value = data.data;
  } catch (error) {
    show.value = true;
    message.value = "Server Error.";
  } finally {
    loading.value = false;
  }
}

async function getKota(Params) {
  loading.value = true;
  try {
    const { data } = await $api.post("/city/get-data", {
      province_id: Params,
    });
    cityData.value = data.data;
  } catch (error) {
    show.value = true;
    message.value = "Server Error.";
  } finally {
    loading.value = false;
  }
}

async function getKelurahan(Params) {
  loading.value = true;
  try {
    const { data } = await $api.post("/district/get-data", {
      city_id: Params,
    });
    disctrictData.value = data.data;
  } catch (error) {
    show.value = true;
    message.value = "Server Error.";
  } finally {
    loading.value = false;
  }
}

async function getVillage(Params) {
  loading.value = true;
  try {
    const { data } = await $api.post("/village/get-data", {
      district_id: Params,
    });
    villageData.value = data.data;
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
    
    if ((form.value.alamat_siswa == null ||
        form.value.rt_siswa == null ||
        form.value.rw_siswa == null ||
        form.value.provinsi_id_siswa == null ||
        form.value.city_id_siswa == null ||
        form.value.district_id_siswa == null ||
        form.value.subdistrict_id_siswa == null ||
        form.value.zip_code_siswa == null ||
        form.value.jarak_rumah_sekolah == null)) {
      show.value = true;
      message.value = "Harap isi form dengan lengkap";
    } else {
      formData.append("step", 4);
      const { data } = await $api.post(`/register-ppdb/update-form`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      emit("next-step", 5)
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
  getDataRegister();
  getProvince();
});

</script>
