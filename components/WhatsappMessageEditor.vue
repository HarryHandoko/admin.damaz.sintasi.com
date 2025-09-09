<template>
  <v-col cols="12">
    <label class="mb-2 font-weight-medium">{{ label }}</label>

    <!-- Placeholder Buttons -->
    <div class="d-flex flex-wrap mb-2" style="gap: 8px">
      <v-btn
        v-for="ph in placeholders"
        :key="ph.value"
        size="x-small"
        variant="outlined"
        color="primary"
        @click="insertPlaceholder(ph.value)"
      >
        {{ ph.label }}
      </v-btn>
    </div>

    <!-- Info Format -->
    <div class="mb-2 text-caption" style="color: #888">
      Format WhatsApp:<br />
      <b>*tebal*</b>, <i>_miring_</i>, <s>~coret~</s>,
      <code>```monospace```</code>
    </div>

    <!-- Textarea -->
    <v-textarea v-model="model" variant="outlined" rows="5" auto-grow />

    <!-- Preview -->
    <v-card class="mt-3" variant="outlined">
      <v-card-title class="text-subtitle-1">Preview {{ label }}</v-card-title>
      <v-card-text>
        <div v-html="previewText(model)"></div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
});

const model = defineModel();

const emit = defineEmits(["update:modelValue"]);

const placeholders = [
  { label: "Nama", value: "{nama}" },
  { label: "Sekolah", value: "{sekolah}" },
  { label: "Jenjang", value: "{jenjang}" },
  { label: "Jenis kelamin", value: "{jenis_kelamin}" },
  { label: "Kode Pendaftaran", value: "{kode_pendaftaran}" },
];

const dummyData = {
  nama: "Ahmad Fauzan",
  sekolah: "SDIT Darul Maza",
  jenjang: "SD",
  jenis_kelamin: "Laki-laki",
  kode_pendaftaran: "PSB2025-001",
};

function insertPlaceholder(placeholder) {
  emit("update:modelValue", props.modelValue + placeholder);
}

function previewText(text) {
  let preview = text || "";
  Object.keys(dummyData).forEach((key) => {
    preview = preview.replaceAll(`{${key}}`, dummyData[key]);
  });
  preview = preview.replace(/\*([^*]+)\*/g, "<b>$1</b>");
  preview = preview.replace(/_([^_]+)_/g, "<i>$1</i>");
  preview = preview.replace(/~([^~]+)~/g, "<s>$1</s>");
  preview = preview.replace(/```([^`]+)```/g, "<code>$1</code>");
  return preview.replace(/\n/g, "<br>");
}
</script>
