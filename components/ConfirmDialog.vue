<template>
  <v-dialog v-model="props.modelValue" max-width="400" persistent>
    <v-card>
      <v-card-title class="headline">
        {{ title || 'Konfirmasi' }}
      </v-card-title>
      <v-card-text>
        <slot>
          {{ message || 'Apakah Anda yakin?' }}
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="cancel">Batal</v-btn>
        <v-btn color="error" variant="flat" @click="ok">Ya</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>

const props = defineProps({
  modelValue: Boolean,
  title: String,
  message: String,
})
const emits = defineEmits(['update:modelValue', 'confirm', 'cancel'])


function ok() {
  emits('confirm')
  props.modelValue = false
}
function cancel() {
  emits('cancel')
  props.modelValue = false
}
</script>
