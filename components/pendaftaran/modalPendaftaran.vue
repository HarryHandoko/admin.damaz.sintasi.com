<template>
  <v-dialog v-model="internalShow" max-width="700" persistent>
     <v-card>
      <v-card-title class="pa-6">
        <v-row>
          <v-col cols="11">
            <span class="headline">Pendaftaran Peserta Didik Baru</span>
          </v-col>
          <v-col cols="1" class="pa-2 text-center">
            <v-icon
              style="cursor: pointer"
              @click="closeModal"
              >bx bx-x</v-icon
            >
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-section class="pa-4" v-if="dataPPDB != null">
        <div v-if="step == 1 && dataRegistrasi != null && dataPPDB.is_form_done == 0 ">
          <formPendaftaranUnit :dataRegist="dataRegistrasi"  @next-step="handleStepChange"  @code-pendaftaran="codePendaftaran"></formPendaftaranUnit>
        </div>
        <div v-if="step == 2 && dataRegistrasi != null  && dataPPDB.is_form_done == 0 ">
          <formPaymentForm :dataRegist="dataRegistrasi"  @next-step="handleStepChange" @code-pendaftaran="codePendaftaran"></formPaymentForm>
        </div>
        <div v-if="step == 3 && dataRegistrasi != null  && dataPPDB.is_form_done == 1">
          <formSiswa :dataRegist="dataRegistrasi"  @next-step="handleStepChange" @code-pendaftaran="codePendaftaran"></formSiswa>
        </div>
        <div v-if="step == 4 && dataRegistrasi != null  && dataPPDB.is_form_done == 1">
          <formAddress :dataRegist="dataRegistrasi"  @next-step="handleStepChange" @code-pendaftaran="codePendaftaran"></formAddress>
        </div>
        <div v-if="step == 5 && dataRegistrasi != null  && dataPPDB.is_form_done == 1">
          <FormOrangtua :dataRegist="dataRegistrasi"  @next-step="handleStepChange" @code-pendaftaran="codePendaftaran"></FormOrangtua>
        </div>
        <div v-if="step == 6 && dataRegistrasi != null  && dataPPDB.is_form_done == 1">
          <formSummary :dataRegist="dataRegistrasi"  @next-step="handleStepChange" @code-pendaftaran="codePendaftaran"></formSummary>
        </div>
      </v-card-section>
      <div v-else class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="240"
        ></v-progress-circular>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue"
import formAddress from "./child/formAddress.vue"
import FormOrangtua from "./child/formOrangtua.vue"
import formPaymentForm from "./child/formPaymentForm.vue"
import formPendaftaranUnit from "./child/formPendaftaranUnit.vue"
import formSiswa from "./child/formSiswa.vue"
import formSummary from "./child/formSummary.vue"

const props = defineProps({
  show: { type: Boolean, default: false },
  dataRegis: null,
  step:1
})

const emit = defineEmits(["update:show", "submit"])

const { $api } = useNuxtApp();
const internalShow = ref(props.show)
const dataRegistrasi = ref(props.dataRegis);
const step = ref(props.step);
const valid = ref(true)
const form = ref({
  nama: "",
  tgl_lahir: "",
})

watch(
  () => props.show,
  (val) => {
    internalShow.value = val
    dataPPDB.value = null;
    getDataRegister(true); // pass `true` to indicate first load
  }
)
// watch(
//   () => props.step,
//   (val) => {
//     step.value = val
//   }
// )

watch(
  () => props.dataRegis,
  (val) => {
    if (val) {
      dataRegistrasi.value = props.dataRegis
      getDataRegister();
    }
  },
  { immediate: true }
)

watch(internalShow, (val) => {
  emit("update:show", val)
})

function handleStepChange(newStep) {
  step.value = newStep
}
function codePendaftaran(newCode) {
  dataRegistrasi.value = newCode
}

const formRef = ref(null)

function closeModal() {
  internalShow.value = false;
  // step.value = 1;
  emit("submit")
}

const dataPPDB = ref(null);
async function getDataRegister() {
  try {
    const data = await $api.post(`/register-ppdb/get-data`, {
      ids: dataRegistrasi.value,
    });
    dataPPDB.value = data.data.data[0];

    if (!dataPPDB.value) return; 

    if (dataPPDB.value.is_form_done == 1 && dataPPDB.value.siswa_parent != null) {
      step.value = 6;
    } else if (dataPPDB.value.is_form_done == 1) {
      step.value = 3;
    } else {
      step.value = 1;
    }
  } catch (error) {
  }
}
onMounted(() => {
  dataPPDB.value = null;
})
</script>
