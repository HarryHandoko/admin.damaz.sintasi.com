<template>
  <v-container class="pa-4">
    <v-card elevation="2" class="pa-6">
      <v-form @submit.prevent="submitForm">
        <h2 class="text-h5 text-center mb-6">Whatsapp Setting</h2>

        <v-row>
          <!-- Api Key -->
          <v-col cols="12">
            <v-text-field
              v-model="form.api_key"
              label="Api Key"
              type="password"
              variant="outlined"
              dense
            />
          </v-col>

          <!-- No HP -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.no_handphone"
              label="No HP"
              type="number"
              variant="outlined"
              dense
            />
          </v-col>

          <!-- No HP Keuangan -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.no_handphone_keuangan"
              label="No HP Keuangan"
              type="number"
              variant="outlined"
              dense
            />
          </v-col>

          <!-- === Registrasi === -->
          <WhatsappMessageEditor
            ref="registrasiTextarea"
            label="Format Pesan Registrasi"
            v-model="form.format_pesan_registrasi"
          />

          <!-- === Pendaftaran Formulir Diterima === -->
          <WhatsappMessageEditor
            ref="registrasiFormulirDiterimaTextarea"
            label="Format Pesan Pendaftaran Formulir Diterima"
            v-model="form.format_pesan_pendaftaran_formulir_diterima"
          />

          <!-- === Pendaftaran Formulir Ditolak === -->
          <WhatsappMessageEditor
            ref="registrasiFormulirDitolakTextarea"
            label="Format Pesan Pendaftaran Formulir Ditolak"
            v-model="form.format_pesan_pendaftaran_formulir_ditolak"
          />

          <!-- === Diterima === -->
          <WhatsappMessageEditor
            ref="diterimaTextarea"
            label="Format Pesan Diterima"
            v-model="form.format_pesan_diterima"
          />

          <!-- === Ditolak === -->
          <WhatsappMessageEditor
            ref="ditolakTextarea"
            label="Format Pesan Ditolak"
            v-model="form.format_pesan_ditolak"
          />

          <!-- === Pesan Keuangan === -->
          <WhatsappMessageEditor
            ref="keuanganTextarea"
            label="Format Pesan Keuangan"
            v-model="form.format_pesan_keuangan"
          />
        </v-row>

        <v-btn
          type="submit"
          color="primary"
          class="mt-6"
          block
          :loading="loading"
          :disabled="loading"
        >
          Simpan
        </v-btn>

        <v-alert v-if="successMsg" type="success" class="mt-4">
          {{ successMsg }}
        </v-alert>
        <v-alert v-if="errorMsg" type="error" class="mt-4">
          {{ errorMsg }}
        </v-alert>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
const { $api } = useNuxtApp();

const successMsg = ref("");
const errorMsg = ref("");
const loading = ref(false);

const form = ref({
  api_key: "",
  no_handphone: "",
  no_handphone_keuangan: "",
  format_pesan_registrasi: "",
  format_pesan_diterima: "",
  format_pesan_ditolak: "",
  format_pesan_keuangan: "",
  format_pesan_pendaftaran_formulir_diterima: "",
  format_pesan_pendaftaran_formulir_ditolak: "",
});

const registrasiTextarea = ref(null);
const diterimaTextarea = ref(null);
const registrasiFormulirDiterimaTextarea = ref(null);
const registrasiFormulirDitolakTextarea = ref(null);
const ditolakTextarea = ref(null);
const keuanganTextarea = ref(null);

async function getData() {
  try {
    const { data } = await $api.get("/whatsapp-setting/get");
    Object.keys(form.value).forEach((key) => {
      if (data[key] !== undefined) {
        form.value[key] = data[key];
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const submitForm = async () => {
  successMsg.value = "";
  errorMsg.value = "";
  loading.value = true;
  try {
    await $api.post("/whatsapp-setting/post", form.value);
    successMsg.value = "Settings updated successfully!";
  } catch (error) {
    errorMsg.value =
      error.response?.data?.message ||
      "An error occurred while updating settings.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getData();
});
</script>
