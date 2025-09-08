<template>
  <div>
    <div v-if="is_email_verifikasi == 0">
      <confirmEmail :data="dataUsers" />
    </div>
    <v-row v-if="is_email_verifikasi == 1">
      <v-col cols="12">
        <VCard class="pa-5">
          <v-row>
            <v-col cols="12" md="5">
              <v-text-field
                label="Cari Nama Siswa"
                v-model="form.search"
                dense
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="text-right">
              <v-btn
                :loading="loading"
                :disabled="loading"
                type="submit"
                color="primary"
                @click="createRegister(null)"
              >
                <v-icon>bx bx-plus</v-icon> Pendaftaran Baru
              </v-btn>
            </v-col>
          </v-row>
        </VCard>
      </v-col>

      <v-col
        v-for="(item, index) in dataRegister"
        :key="index"
        cols="12"
        md="4"
        style="cursor: pointer"
      >
        <v-card
          class="rounded-2xl elevation-10"
          style="box-shadow: 0 10px 24px -8px #60a5fa33"
        >
          <!-- Tombol Delete di kanan atas -->
          <v-btn
            icon
            class="ma-2 mb-4"
            color="red"
            style="
              position: absolute;
              top: 0;
              right: 0;
              z-index: 10;
              color: red;
            "
            @click.stop="deleteRegister(item)"
            v-if="item.is_daftar_ulang == 0"
          >
            <v-icon size="30" v-if="!loading">bx bx-trash</v-icon>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
              size="30"
            />
          </v-btn>

          <v-btn
            icon
            class="ma-2"
            color="red"
            :style="
              item.is_daftar_ulang == 0
                ? `position: absolute; top: 40px; right: 0; z-index: 10;color:blue`
                : `position: absolute; top: 0px; right: 0; z-index: 10;color:blue`
            "
            @click.stop="printData(item)"
            v-if="item.is_submit == '1' && item.status_pendaftaran == 'P01'"
          >
            <v-icon size="30" v-if="!loading">bx bx-printer</v-icon>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
              size="30"
            />
          </v-btn>

          <v-btn
            icon
            class="ma-2"
            color="red"
            :style="
              item.is_daftar_ulang == 1
                ? `position: absolute; top: 43px; right: 0; z-index: 10;color:blue`
                : `display: none`
            "
            @click.stop="printDataKTS(item)"
            v-if="
              item.is_submit == '1' &&
              item.registrasi_ulang?.status_pembayaran == '01'
            "
          >
            <v-icon size="30" v-if="!loading">bx bx-id-card</v-icon>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
              size="30"
            />
          </v-btn>

          <v-btn
            icon
            class="ma-2"
            color="red"
            :style="
              item.is_daftar_ulang == 0
                ? `position: absolute; top: 40px; right: 0; z-index: 10;color:blue`
                : `position: absolute; top: 0px; right: 0; z-index: 10;color:blue`
            "
            @click.stop="printData(item)"
            v-if="item.is_submit == '1' && item.status_pendaftaran == 'P01'"
          >
            <v-icon size="30" v-if="!loading">bx bx-printer</v-icon>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
              size="30"
            />
          </v-btn>

          <v-row
            align="center"
            no-gutters
            class="pa-5"
            @click="createRegister(item)"
          >
            <v-col
              cols="12"
              md="3"
              class="flex justify-center items-center text-center"
            >
              <v-avatar
                size="70"
                class="elevation-5"
                style="
                  border: 2px solid #38bdf8;
                  box-shadow: 0 4px 18px 0 #38bdf833;
                "
              >
                <v-img
                  :src="
                    item.siswa.foto_siswa != null
                      ? item.siswa.foto_siswa
                      : '/favicon.ico'
                  "
                  cover
                  alt="Avatar"
                />
              </v-avatar>
            </v-col>
            <v-col cols="12" md="7" class="pl-0 md:pl-4 md:mt-0">
              <div class="text-xl font-semibold text-gray-700 mb-1">
                {{
                  item.siswa != null
                    ? (item.siswa.nama_depan ?? "-") +
                      " " +
                      (item.siswa.nama_belakang ?? "")
                    : "Nama Siswa"
                }}
              </div>
              <div class="flex flex-col gap-1 text-gray-600 text-base">
                <div>
                  <span class="font-medium text-gray-500">Usia: </span>
                  <b>{{
                    item.siswa != null ? item.siswa.usia + " Th" : "0 Th"
                  }}</b
                  ><br />
                  <span class="font-medium text-gray-500">Jenjang: </span>
                  <b>
                    {{
                      item.sekolah != null ? item.sekolah.name : "Nama Sekolah"
                    }}
                    |
                    {{
                      item.sekolah_grade != null
                        ? item.sekolah_grade.name
                        : "Grade"
                    }}
                  </b>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-col
            cols="12"
            v-if="item.is_daftar_ulang == '0'"
            :class="
              item.status_pendaftaran == 'P00'
                ? 'pa-2 bg-warning'
                : item.status_pendaftaran == 'P01'
                ? 'pa-2 bg-primary'
                : item.status_pendaftaran == 'P02'
                ? 'pa-2 bg-error'
                : 'None'
            "
            style="margin: 0px"
          >
            {{
              item.status_pendaftaran == "P00"
                ? "Menunggu"
                : item.status_pendaftaran == "P01"
                ? item.is_need_test == "1"
                  ? item.status_test == "00"
                    ? "Disetujui Seleksi Test akan dilaksanakan pada " +
                      item.tgl_test
                    : item.status_test == "01"
                    ? "Lulus Tes Seleksi"
                    : "Tidak Lulus Tes Seleksi"
                  : "Disetujui"
                : item.status_pendaftaran == "P02"
                ? "Ditolak"
                : "None"
            }}
          </v-col>

          <v-col
            cols="12"
            v-if="item.is_daftar_ulang == '1'"
            :class="
              item.registrasi_ulang?.status_pembayaran == '00'
                ? 'pa-2 bg-warning'
                : item.registrasi_ulang?.status_pembayaran == '01'
                ? 'pa-2 bg-primary'
                : item.registrasi_ulang?.status_pembayaran == '02'
                ? 'pa-2 bg-error'
                : 'None'
            "
            style="margin: 0px"
          >
            {{
              item.registrasi_ulang?.status_pembayaran == "00"
                ? "Menunggu"
                : item.registrasi_ulang?.status_pembayaran == "01"
                ? "Diterima"
                : item.registrasi_ulang?.status_pembayaran == "02"
                ? "Ditolak"
                : "None"
            }}
          </v-col>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog tambah menu -->
    <v-dialog v-model="showCreateModal" max-width="700" persistent>
      <v-card>
        <v-card-title class="pa-6">
          <v-row>
            <v-col cols="11">
              <span class="headline">Pendaftaran Peserta Didik Baru</span>
            </v-col>
            <v-col cols="1" class="pa-2 text-center">
              <v-icon
                style="cursor: pointer"
                @click="
                  showCreateModal = false;
                  getDataRegister();
                "
                >bx bx-x</v-icon
              >
            </v-col>
          </v-row>
        </v-card-title>
        <v-form v-model="valid" @submit.prevent="handleCreateData">
          <v-card-text style="margin-top: -30px">
            <v-row v-if="step == 0">
              <!-- Informasi Sekolah -->
              <v-col cols="12">
                <div class="d-flex justify-space-between align-center">
                  <b>Informasi Sekolah</b>
                  <span
                    @click="step = 1"
                    v-if="form.dataPPDB?.status_pendaftaran == 'P00'"
                    style="cursor: pointer; color: blue"
                    >Show Detail</span
                  >
                </div>
                <div>
                  Nama Sekolah: <b>{{ form.dataSekolah?.name || "-" }}</b>
                </div>
                <div>
                  Jenjang Dituju:
                  <b>{{ form.dataPPDB?.sekolah_grade.name || "-" }}</b>
                </div>
                <div>
                  Tahun Ajaran:
                  <b>{{ getTahunAjaran(form.dataPPDB?.created_at) }}</b>
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
                    @click="step = 2"
                    v-if="form.dataPPDB?.status_pendaftaran == 'P00'"
                    style="cursor: pointer; color: blue"
                    >Show Detail</span
                  >
                </div>
                <div>
                  Nama Lengkap:
                  <b>{{ form.nama_depan }} {{ form.nama_belakang }}</b>
                </div>
                <div>
                  NIK: <b>{{ form.nik || "-" }}</b>
                </div>
                <div>
                  No. Akte Kelahiran: <b>{{ form.no_akte_kelahiran || "-" }}</b>
                </div>
                <div>
                  Jenis Kelamin: <b>{{ form.jenis_kelamin || "-" }}</b>
                </div>
                <div>
                  Tempat Lahir: <b>{{ form.tempat_lahir }}</b>
                </div>
                <div>
                  Tanggal Lahir: <b>{{ form.tgl_lahir }}</b>
                </div>
                <div>
                  Agama: <b>{{ form.agama || "-" }}</b>
                </div>
                <div>
                  Anak ke: <b>{{ form.anak_ke || "-" }}</b>
                </div>
                <div>
                  Jumlah Saudara: <b>{{ form.jumlah_saudara || "-" }}</b>
                </div>
                <div>
                  Hobby: <b>{{ form.hobby || "-" }}</b>
                </div>
                <div>
                  Cita - Cita: <b>{{ form.cita_cita || "-" }}</b>
                </div>
                <div>
                  Tinggi Badan: <b>{{ form.tinggi_badan || "-" }}</b>
                </div>
                <div>
                  Berat Badan: <b>{{ form.berat_badan || "-" }}</b>
                </div>
                <div>
                  Riwayat Kesehatan : <b>{{ form.riwayat_kesehatan || "-" }}</b>
                </div>
                <div>
                  No. Handphone : <b>{{ form.no_handphone || "-" }}</b>
                </div>
                <div>
                  Status Pendaftaran: <b>{{ form.status_pendaftaran_siswa }}</b>
                </div>
                <div>
                  Kebutuhan Khusus:
                  <b>{{ form.kebutuhan_spesial == "1" ? "Ya" : "Tidak" }}</b>
                </div>
                <div>
                  Bahasa Sehari-hari: <b>{{ form.bahasa_sehari_hari }}</b>
                </div>
                <div>
                  Penghargaan: <b>{{ form.dataPPDB?.siswa_award?.award }}</b>
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
                    @click="step = 3"
                    v-if="form.dataPPDB?.status_pendaftaran == 'P00'"
                    style="cursor: pointer; color: blue"
                    >Show Detail</span
                  >
                </div>
                <div>
                  Jarak Rumah Ke Sekolah : <b>{{ form.jarak_rumah_sekolah }}</b>
                </div>
                <div>
                  Alamat Lengkap: <b>{{ form.alamat_siswa }}</b>
                </div>
                <div>
                  RT/RW:
                  <b
                    >{{ form.dataPPDB?.siswa_address.rt }}/{{
                      form.dataPPDB?.siswa_address.rw
                    }}</b
                  >
                </div>
                <div>
                  Kode Pos: <b>{{ form.dataPPDB?.siswa_address.zip_code }}</b>
                </div>
                <div>
                  Provinsi: <b>{{ form.dataPPDB?.siswa_address.provinsi }}</b>
                </div>
                <div>
                  Kota/Kabupaten: <b>{{ form.dataPPDB?.siswa_address.kota }}</b>
                </div>
                <div>
                  Kecamatan: <b>{{ form.dataPPDB?.siswa_address.district }}</b>
                </div>
                <div>
                  Kelurahan/Desa: <b>{{ form.dataPPDB?.siswa_address.desa }}</b>
                </div>
              </v-col>

              <!-- Data Orang Tua -->
              <v-col
                cols="12"
                class="mt-4"
                style="border-top: 1px solid #d9d9d9"
              >
                <div class="d-flex justify-space-between align-center">
                  <b>Data Orang Tua</b>
                  <span
                    @click="step = 4"
                    v-if="form.dataPPDB?.status_pendaftaran == 'P00'"
                    style="cursor: pointer; color: blue"
                    >Show Detail</span
                  >
                </div>
                <div>
                  Nama Ayah: <b>{{ form.nama_ayah }}</b>
                </div>
                <div>
                  NIK Ayah: <b>{{ form.nik_ayah }}</b>
                </div>
                <div>
                  Pekerjaan Ayah: <b>{{ form.pekerjaan_ayah }}</b>
                </div>
                <div>
                  Pendidikan Terakhir Ayah:
                  <b>{{ form.pendidikan_terakhir_ayah }}</b>
                </div>
                <div>
                  Penghasilan Ayah: <b>{{ form.penghasilan_ayah }}</b>
                </div>
                <div>
                  Alamat: <b>{{ form.alamat_ayah }}</b>
                </div>

                <br />
                <div>
                  Nama Ibu: <b>{{ form.nama_ibu }}</b>
                </div>
                <div>
                  NIK Ibu: <b>{{ form.nik_ibu }}</b>
                </div>
                <div>
                  Pekerjaan Ibu: <b>{{ form.pekerjaan_ibu }}</b>
                </div>
                <div>
                  Pendidikan Terakhir Ibu:
                  <b>{{ form.pendidikan_terakhir_ibu }}</b>
                </div>
                <div>
                  Penghasilan Ibu: <b>{{ form.penghasilan_ibu }}</b>
                </div>
                <div>
                  Alamat: <b>{{ form.alamat_ibu }}</b>
                </div>
                <br />
                <div>
                  Nama Wali: <b>{{ form.nama_wali }}</b>
                </div>
                <div>
                  NIK Wali: <b>{{ form.nik_wali }}</b>
                </div>
                <div>
                  Pekerjaan Wali: <b>{{ form.pekerjaan_wali }}</b>
                </div>
                <div>
                  Pendidikan Terakhir Wali:
                  <b>{{ form.pendidikan_terakhir_wali }}</b>
                </div>
                <div>
                  Penghasilan Wali: <b>{{ form.penghasilan_wali }}</b>
                </div>
                <div>
                  Alamat: <b>{{ form.alamat_wali }}</b>
                </div>
              </v-col>

              <!-- Ringkasan Pembayaran -->
              <v-col
                cols="12"
                class="mt-4"
                style="border-top: 1px solid #d9d9d9"
              >
                <div class="d-flex justify-space-between align-center">
                  <b>Ringkasan Pembayaran</b>
                  <span
                    @click="step = 5"
                    v-if="form.dataPPDB?.status_pendaftaran == 'P00'"
                    style="cursor: pointer; color: blue"
                    >Show Detail</span
                  >
                </div>
                <div>
                  ID Registrasi: <b>{{ form.code_ppdb }}</b>
                </div>
                <div>
                  Biaya Administrasi:
                  <b>{{ formatRupiah(form.biaya_admin) }}</b>
                </div>
                <div>
                  Diskon: <b>{{ formatRupiah(form.nominal_diskon) }}</b>
                </div>
                <div>
                  Total Bayar:
                  <b>{{
                    formatRupiah(
                      Number(form.biaya_admin) -
                        Number(form.nominal_diskon ?? 0)
                    )
                  }}</b>
                </div>
                <div>
                  Status Pembayaran:
                  <span
                    :style="
                      form.payment_status == 'Menunggu'
                        ? 'color:blue'
                        : form.payment_status == 'Pembayaran Berhasil'
                        ? 'color:green'
                        : 'color:red'
                    "
                  >
                    <b>{{ form.payment_status }}</b>
                  </span>
                </div>
              </v-col>
            </v-row>

            <v-row v-if="step == 1">
              <v-col cols="12">
                <b>Pendaftaran Perserta Didik</b>
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

              <v-col cols="12">
                <v-text-field
                  v-model="form.tgl_lahir"
                  label="Tanggal Lahir*"
                  type="date"
                  required
                  :rules="[(v) => !!v || 'From harus diisi']"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.sekolah_id"
                  :items="sekolah"
                  item-title="name"
                  item-value="id"
                  label="Sekolah*"
                  :rules="[(v) => !!v || 'Form harus dipilih']"
                  required
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
                  label="Grade*"
                  :rules="[(v) => !!v || 'Form harus dipilih']"
                  required
                />
              </v-col>

              <v-col cols="12" md="9">
                <v-text-field
                  v-model="form.voucher_diskon"
                  label="Voucher Diskon"
                  type="text"
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
            </v-row>

            <v-row v-if="step == 2">
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
                  v-model="form.beasiswa_id"
                  :items="beasiswa"
                  item-title="nama"
                  item-value="id"
                  label="Beasiswa"
                />
              </v-col>

              <v-col cols="12" md="12">
                <v-select
                  v-model="form.is_alumni"
                  :items="[
                    { value: false, text: 'Bukan Alumni' },
                    { value: true, text: 'Alumni' },
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
                  form.dataSekolah != null
                    ? form.dataSekolah.is_need_nem == '1'
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
                  form.dataSekolah != null
                    ? form.dataSekolah.is_need_nem == '1'
                    : false
                "
              >
                <div class="mb-2" v-if="form.dataPPDB.file_raport != null">
                  <a :href="form.dataPPDB.file_raport" target="_blank"
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
              <v-col cols="12" v-if="form.dataSekolah != null">
                <div class="mb-2" v-if="form.dataPPDB.file_akte_lahir != null">
                  <a :href="form.dataPPDB.file_akte_lahir" target="_blank"
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
              <v-col cols="12" v-if="form.dataSekolah != null">
                <div
                  class="mb-2"
                  v-if="form.dataPPDB.file_kartu_keluarga != null"
                >
                  <a :href="form.dataPPDB.file_kartu_keluarga" target="_blank"
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
            </v-row>

            <v-row v-if="step == 3">
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
            </v-row>

            <v-row v-if="step == 4">
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
            </v-row>

            <v-row v-if="step == 5">
              <v-col cols="12">
                <b>Summary</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                <b>Pembayaran Administrasi</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                ID Registrasi : <b>{{ form.code_ppdb }}</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                Nama Calon Siswa :
                <b>{{ form.nama_depan }} {{ form.nama_belakang }}</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                Nama Ayah : <b>{{ form.nama_ayah }}</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                <p>
                  Biaya Admininstrasi :
                  <b>{{ formatRupiah(form.biaya_admin) }}</b>
                </p>
                <p>
                  Diskon : <b>{{ formatRupiah(form.nominal_diskon) }}</b>
                </p>
                <p>
                  Total Bayar :
                  <b>{{
                    formatRupiah(
                      Number(form.biaya_admin) -
                        Number(form.nominal_diskon ?? 0)
                    )
                  }}</b>
                </p>

                <p style="margin-bottom: 10px">
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
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                Status Pembayaran :
                <span
                  :style="
                    form.payment_status == 'Menunggu'
                      ? 'color:blue'
                      : form.payment_status == 'Pembayaran Berhasil'
                      ? 'color:green'
                      : 'color:red'
                  "
                  ><b>{{ form.payment_status }}</b></span
                >
              </v-col>

              <v-col cols="12" sm="12" stlye="padding:0">
                <div v-if="fotoPreviewBukti" class="mt-2 text-center">
                  <img
                    :src="fotoPreviewBukti"
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
                  @change="handleFotoChangeBukti"
                  class="mb-2"
                />
              </v-col>
            </v-row>

            <v-row v-if="step == 6" justify="center" align="center">
              <v-col cols="12" class="text-center">
                <!-- Animasi GIF sukses -->
                <img
                  src="/images/success.gif"
                  alt="Success"
                  style="max-width: 200px; margin-bottom: 20px"
                />

                <!-- Pesan sukses -->
                <h3 class="mt-4">Pendaftaran Berhasil!</h3>
                <p>Terima kasih telah mengisi formulir PPDB.</p>
              </v-col>
            </v-row>

            <v-row v-if="step == 7">
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                <b>Pendaftaran Ulang</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                ID Daftar Ulang :
                <b>{{ formDaftarUlang.code_registrasi_ulang }}</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                Nama Calon Siswa :
                <b>{{ form.nama_depan }} {{ form.nama_belakang }}</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                Nama Ayah : <b>{{ form.nama_ayah }}</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                Sekolah : <b>{{ form.dataPPDB?.sekolah.name }}</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                Jenjang : <b>{{ form.dataPPDB?.sekolah_grade.name }}</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                Jenjang : <b>{{ form.dataPPDB?.status_pendaftaran_siswa }}</b>
              </v-col>
              <v-col cols="12" style="border-top: 1px solid #d9d9d9">
                Biaya Admininstrasi :
                <b>{{ formatRupiah(formDaftarUlang.biaya_pendaftaran) }}</b>

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
                  v-if="formDaftarUlang.data?.bukti_pembayaran == null"
                  label="Upload Foto"
                  accept="image/*"
                  show-size
                  @change="handleFotoChangeBuktiRegisUlang"
                  class="mb-2"
                />
              </v-col>
            </v-row>

            <v-row
              class="d-none d-md-flex"
              v-if="step != 6 && step != 0 && step != 7"
            >
              <v-col cols="12" class="text-right">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-btn
                      color="error"
                      variant="flat"
                      class="mr-2"
                      @click="
                        showCreateModal = false;
                        getDataRegister();
                      "
                      block
                      >Batal</v-btn
                    >
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-btn
                      color="secondary"
                      variant="flat"
                      :disabled="
                        loading ||
                        (form.dataPPDB?.is_submit == '1' ? false : step == 1)
                      "
                      block
                      class="mr-2"
                      :loading="loading"
                      @click="
                        form.dataPPDB?.is_submit == '1'
                          ? ((step = 0), getDetail())
                          : ((step = step - 1), getDetail())
                      "
                    >
                      Kembali
                    </v-btn>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-btn
                      color="primary"
                      variant="flat"
                      :disabled="loading"
                      type="submit"
                      :loading="loading"
                      block
                    >
                      {{ step < 5 ? "Simpan dan lanjut" : "Kirim" }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row
              class="d-flex d-md-none"
              v-if="step != 6 && step != 0 && step != 7"
            >
              <v-col cols="12" class="text-right">
                <v-row>
                  <v-col cols="6">
                    <v-btn
                      color="secondary"
                      variant="flat"
                      :disabled="
                        loading ||
                        (form.dataPPDB?.is_submit == '1' ? false : step == 1)
                      "
                      block
                      class="mr-2"
                      :loading="loading"
                      @click="
                        form.dataPPDB?.is_submit == '1'
                          ? ((step = 0), getDetail())
                          : ((step = step - 1), getDetail())
                      "
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
                      {{ step < 5 ? "Simpan dan lanjut" : "Kirim" }}
                    </v-btn>
                  </v-col>

                  <v-col cols="12">
                    <v-btn
                      color="error"
                      variant="flat"
                      class="mr-2"
                      @click="
                        showCreateModal = false;
                        getDataRegister();
                      "
                      block
                      >Batal</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row v-if="step == 6 || step == 0">
              <v-col cols="12" class="text-right">
                <v-row>
                  <v-col>
                    <v-btn
                      color="primary"
                      variant="flat"
                      class="mr-2"
                      :loading="loading"
                      @click="
                        showCreateModal = false;
                        getDataRegister();
                      "
                      block
                      >Tutup</v-btn
                    >
                  </v-col>

                  <v-col
                    v-if="
                      form.dataPPDB?.status_pendaftaran == 'P01' &&
                      (form.dataPPDB?.is_need_test == '1'
                        ? form.dataPPDB?.status_test == '01'
                        : true) &&
                      (form.dataPPDB.registrasi_ulang != null
                        ? form.dataPPDB.registrasi_ulang?.status_pembayaran ==
                          '00'
                        : true)
                    "
                  >
                    <v-btn
                      color="warning"
                      variant="flat"
                      class="mr-2"
                      :loading="loading"
                      @click="daftarUlang(form.dataPPDB)"
                      block
                    >
                      Daftar Ulang
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row v-if="step == 7">
              <v-col cols="12" class="text-right">
                <v-row>
                  <v-col
                    :cols="
                      form.dataPPDB?.status_pendaftaran == 'P01' &&
                      formDaftarUlang.data?.bukti_pembayaran == null
                        ? '6'
                        : '12'
                    "
                  >
                    <v-btn
                      color="secondary"
                      variant="flat"
                      class="mr-2"
                      :loading="loading"
                      @click="step = 0"
                      block
                      >Kembali</v-btn
                    >
                  </v-col>

                  <v-col
                    cols="6"
                    v-if="formDaftarUlang.data?.bukti_pembayaran == null"
                  >
                    <v-btn
                      color="primary"
                      variant="flat"
                      :disabled="loading"
                      @click="submitPayRegistrasiUlang"
                      :loading="loading"
                      block
                    >
                      Kirim
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Snackbar error -->
    <v-snackbar v-model="show" color="error" timeout="3000">
      {{ message }}
    </v-snackbar>

    <!-- Snackbar Sucess -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000">
      {{ message }}
    </v-snackbar>
    <!-- Dialog konfirmasi hapus -->
    <ConfirmDialog
      :modelValue="showConfirm"
      :title="titleConfirm"
      :message="messageConfirm"
      :color="color"
      @confirm="showModal(dataConfirm)"
      @cancel="showConfirm = false"
    />

    <ConfirmDialog
      :modelValue="showConfirmDelete"
      :title="titleConfirmDelete"
      :message="messageConfirmDelete"
      :color="colorDelete"
      @confirm="handleDelete(dataConfirmDelete)"
      @cancel="showConfirmDelete = false"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";
import ConfirmDialog from "~/components/ConfirmDialog.vue";
import confirmEmail from "~/components/confirmEmail.vue";

const { $api } = useNuxtApp();
const loading = ref(false);
const form = ref({
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
  beasiswa_id: null,
  is_alumni: false,
  nominal_diskon: 0,
  voucher_diskon: null,
  jarak_rumah_sekolah: null,
  alamat_siswa: null,
  rt_siswa: null,
  rw_siswa: null,
  zip_code_siswa: null,
  provinsi_id_siswa: null,
  city_id_siswa: null,
  district_id_siswa: null,
  subdistrict_id_siswa: null,

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

  sekolah_id: null,
  grade_id: null,

  biaya_admin: 0,
  biaya_pendaftaran: 0,
  payment_status: null,

  bukti_transaksi: null,

  dataSekolah: null,
  dataPPDB: null,
});

const formDaftarUlang = ref({
  code_registrasi_ulang: null,
  biaya_pendaftaran: 0,
  bukti_pembayaran: null,
  data: null,
});
const is_email_verifikasi = ref(null);
const dataUsers = ref(null);
const foto_bukti_regis_ulang = ref(null);
const sekolah = ref([]);
const dataRegister = ref([]);
const grade = ref([]);
const show = ref(false);
const message = ref(null);
const showConfirm = ref(false);
const titleConfirm = ref(null);
const messageConfirm = ref(null);
const dataConfirm = ref(null);
const color = ref("error");
const step = ref(1);
const fotoPreview = ref(null);
const fotoPreviewBukti = ref(null);
const fotoPreviewFotoSiswa = ref(null);

const showConfirmDelete = ref(false);
const titleConfirmDelete = ref(null);
const messageConfirmDelete = ref(null);
const dataConfirmDelete = ref(null);
const colorDelete = ref("error");

const showCreateModal = ref(false);

function getTahunAjaran(dateString) {
  if (!dateString) return "-";
  const year = new Date(dateString).getFullYear();
  return `${year}/${year + 1}`;
}

function createRegister(data) {
  if (data == null) {
    Object.keys(form.value).forEach((k) => {
      form.value[k] = null;
    });
    fotoPreview.value = "/no-image.jpg";
    fotoPreviewBukti.value = "/no-image.jpg";
    fotoPreviewFotoSiswa.value = "/no-image.jpg";
    color.value = "primary";
    titleConfirm.value = "Konfirmasi Pendataran";
    messageConfirm.value = "Yakin ingin mendaftar baru?";
    dataConfirm.value = data;
    showConfirm.value = true;
  } else {
    color.value = "primary";
    titleConfirm.value = "Lanjutkan pendaftaran";
    messageConfirm.value = "Yakin ingin melanjutkan pendaftaran?";
    dataConfirm.value = data;
    showConfirm.value = true;
  }
}

function showModal(data) {
  fotoPreview.value = "/no-image.jpg";
  showConfirm.value = false;
  showCreateModal.value = true;
  if (data == null) {
    step.value = 1;
    register();
  } else {
    step.value = data.is_submit == "1" ? 0 : 1;
    form.value.sekolah_id = data.sekolah_id;
    getGrade();
    form.value.grade_id = data.grade_id;
    form.value.code_ppdb = data.code_pendaftaran;
    form.value.nama_depan = data.siswa.nama_depan;
    form.value.nama_belakang = data.siswa.nama_belakang;
    form.value.tgl_lahir = data.siswa.tgl_lahir;
    form.value.tempat_lahir = data.siswa.tempat_lahir;
    form.value.jenis_kelamin = data.siswa.jenis_kelamin;
    form.value.nisn = data.siswa.nisn;
    form.value.no_akte_kelahiran = data.siswa.no_akte_kelahiran;
    form.value.agama = data.siswa.agama;
    form.value.nik = data.siswa.nik;
    form.value.anak_ke = data.siswa.anak_ke;
    form.value.hobby = data.siswa.hobby;
    form.value.goldarah = data.siswa.goldarah;
    form.value.kewarganegaraan = data.siswa.kewarganegaraan;
    form.value.cita_cita = data.siswa.cita_cita;
    form.value.jumlah_saudara = data.siswa.jumlah_saudara;
    form.value.tinggi_badan = data.siswa.tinggi_badan;
    form.value.berat_badan = data.siswa.berat_badan;
    form.value.riwayat_kesehatan = data.siswa.riwayat_kesehatan;
    form.value.no_handphone = data.siswa.no_handphone;
    form.value.asal_sekolah = data.asal_sekolah;
    form.value.jenjang_terakhir = data.jenjang_terakhir;
    form.value.status_pendaftaran_siswa = data.status_pendaftaran_siswa;
    form.value.bahasa_sehari_hari = data.siswa.bahasa_sehari_hari;
    form.value.kebutuhan_spesial =
      data.siswa.kebutuhan_spesial == "1" ? true : false;
    form.value.award = data.siswa_award != null ? "Ada" : "Tidak Ada";
    form.value.biaya_admin = data.biaya_admin;
    form.value.diskon = data.diskon;
    form.value.biaya_pendaftaran = data.biaya_pendaftaran;
    form.value.dataSekolah = data.sekolah;
    form.value.dataPPDB = data;
    fotoPreviewFotoSiswa.value = data.siswa.foto_siswa;
    form.value.nilai_nem = data.nem;
    form.value.nominal_diskon = data?.nominal_diskon ?? 0;
    form.value.voucher_diskon = data?.voucher_diskon;

    if (data.siswa_award != null) {
      form.value.award_name = data.siswa_award.award;
      form.value.award_date = data.siswa_award.tgl_didapat;
      fotoPreview.value = data.siswa_award.image;
    }

    if (data.siswa_address != null) {
      form.value.jarak_rumah_sekolah = data.siswa_address.jarak_rumah_sekolah;
      form.value.alamat_siswa = data.siswa_address.alamat;
      form.value.rt_siswa = data.siswa_address.rt;
      form.value.rw_siswa = data.siswa_address.rw;
      getProvince();
      form.value.provinsi_id_siswa = data.siswa_address.provinsi_id;
      getKota(form.value.provinsi_id_siswa);
      form.value.city_id_siswa = data.siswa_address.city_id;
      getKelurahan(form.value.city_id_siswa);
      form.value.district_id_siswa = data.siswa_address.district_id;
      getVillage(form.value.district_id_siswa);
      form.value.subdistrict_id_siswa = data.siswa_address.subdistrict_id;
      form.value.zip_code_siswa = data.siswa_address.zip_code;
    }

    if (data.siswa_parent != null) {
      form.value.nama_ayah = data.siswa_parent.nama_ayah;
      form.value.nik_ayah = data.siswa_parent.nik_ayah;
      form.value.pekerjaan_ayah = data.siswa_parent.pekerjaan_ayah;
      form.value.pendidikan_terakhir_ayah =
        data.siswa_parent.pendidikan_terakhir_ayah;
      form.value.penghasilan_ayah = data.siswa_parent.penghasilan_ayah;
      form.value.no_hp_ayah = data.siswa_parent.no_hp_ayah;
      form.value.no_telepon_ayah = data.siswa_parent.no_telepon_ayah;
      form.value.alamat_ayah = data.siswa_parent.alamat_ayah;
      form.value.is_same_address_ayah =
        data.siswa_parent.is_same_address_ayah == "true" ? true : false;

      form.value.nama_ibu = data.siswa_parent.nama_ibu;
      form.value.nik_ibu = data.siswa_parent.nik_ibu;
      form.value.pekerjaan_ibu = data.siswa_parent.pekerjaan_ibu;
      form.value.pendidikan_terakhir_ibu =
        data.siswa_parent.pendidikan_terakhir_ibu;
      form.value.penghasilan_ibu = data.siswa_parent.penghasilan_ibu;
      form.value.no_hp_ibu = data.siswa_parent.no_hp_ibu;
      form.value.no_telepon_ibu = data.siswa_parent.no_telepon_ibu;
      form.value.alamat_ibu = data.siswa_parent.alamat_ibu;
      form.value.is_same_address_ibu =
        data.siswa_parent.is_same_address_ibu == "true" ? true : false;

      form.value.nama_wali = data.siswa_parent.nama_wali;
      form.value.nik_wali = data.siswa_parent.nik_wali;
      form.value.pekerjaan_wali = data.siswa_parent.pekerjaan_wali;
      form.value.pendidikan_terakhir_wali =
        data.siswa_parent.pendidikan_terakhir_wali;
      form.value.penghasilan_wali = data.siswa_parent.penghasilan_wali;
      form.value.no_hp_wali = data.siswa_parent.no_hp_wali;
      form.value.no_telepon_wali = data.siswa_parent.no_telepon_wali;
      form.value.alamat_wali = data.siswa_parent.alamat_wali;
      form.value.is_same_address_wali =
        data.siswa_parent.is_same_address_wali == "true" ? true : false;
    }

    if (data.payment == null) {
      form.value.payment_status = "Belum dibayar";
    } else {
      fotoPreviewBukti.value = data.payment.bukti_transfer;
      form.value.payment_status =
        data.payment.status_payment == "00"
          ? "Menunggu"
          : data.payment.status_payment == "01"
          ? "Pembayaran Berhasil"
          : "Pembayaran Ditolak";
    }
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
    if (
      step.value == 1 &&
      (form.value.sekolah_id == null || form.value.grade_id == null)
    ) {
      show.value = true;
      message.value = "Harap isi form dengan lengkap";
    } else if (
      step.value === 2 &&
      (!form.value.nama_depan ||
        !form.value.nama_belakang ||
        !fotoPreviewFotoSiswa.value ||
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
        (form.value.dataSekolah?.is_need_nem === "1" &&
          (!form.value.nilai_nem ||
            (!form.value.dataPPDB?.file_raport && !form.value.file_raport))) ||
        (form.value.status_pendaftaran_siswa === "Siswa Pindahan" &&
          (!form.value.sekolah_asal || !form.value.jenjang_terakhir)))
    ) {
      show.value = true;
      message.value = "Harap isi form dengan lengkap";
    } else if (
      step.value == 3 &&
      (form.value.alamat_siswa == null ||
        form.value.rt_siswa == null ||
        form.value.rw_siswa == null ||
        form.value.provinsi_id_siswa == null ||
        form.value.city_id_siswa == null ||
        form.value.district_id_siswa == null ||
        form.value.subdistrict_id_siswa == null ||
        form.value.zip_code_siswa == null ||
        form.value.jarak_rumah_sekolah == null)
    ) {
      show.value = true;
      message.value = "Harap isi form dengan lengkap";
    } else if (
      step.value == 4 &&
      (form.value.nama_ayah == null ||
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
        form.value.alamat_ibu == null ||
        form.value.nik_wali == null ||
        form.value.nama_wali == null ||
        form.value.pekerjaan_wali == null ||
        form.value.pendidikan_terakhir_wali == null ||
        form.value.penghasilan_wali == null ||
        form.value.alamat_wali == null)
    ) {
      show.value = true;
      message.value = "Harap isi form dengan lengkap";
    } else if (step.value == 5 && form.value.bukti_transaksi == null) {
      show.value = true;
      message.value = "Bukti Pembayaran belum diupload";
    } else {
      // Tambahkan nilai step secara eksplisit
      formData.append("step", step.value);

      const { data } = await $api.post(`/register-ppdb/update-form`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      step.value = parseInt(step.value) + 1;
      form.value.code_ppdb = data.data.code_pendaftaran;
      getDetail();
    }
  } catch (error) {
    show.value = true;
    message.value = "Server Error.";
  } finally {
    loading.value = false;
  }
}

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

const beasiswa = ref([]);
async function getBeasiswa() {
  loading.value = true;
  try {
    const data = await $api.get(`/master-data/beasiswa/get-select`, {});
    beasiswa.value = data.data.data;
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

async function getDataRegister() {
  loading.value = true;
  try {
    const data = await $api.post(`/register-ppdb/get-data`);
    dataRegister.value = data.data.data;
  } catch (error) {
    // show.value = true
    // message.value = error.response?.data?.message || 'Gagal Mendapatkan Data.'
  } finally {
    loading.value = false;
  }
}

async function register() {
  loading.value = true;
  try {
    const data = await $api.post(`/register-ppdb/create`, form.value);
    form.value.code_ppdb = data.data.data.code_pendaftaran;
  } catch (error) {
    show.value = true;
    message.value = "Server Error.";
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

const formatRupiah = (value) => {
  if (!value) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

function deleteRegister(data) {
  colorDelete.value = "error";
  titleConfirmDelete.value = "Batalkan pendaftaran";
  messageConfirmDelete.value = "Yakin ingin Membatalkan pendaftaran?";
  dataConfirmDelete.value = data;
  showConfirmDelete.value = true;
}
const showSuccess = ref(false);

async function handleDelete(dataDelete) {
  loading.value = true;
  try {
    const data = await $api.post(`/register-ppdb/delete`, dataDelete);
    showSuccess.value = true;
    message.value = "Berhasil dibatalkan";
    showConfirmDelete.value = false;

    getDataRegister();
  } catch (error) {
    show.value = true;
    message.value = "Server Error.";
  } finally {
    loading.value = false;
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

async function getDetail() {
  loading.value = true;
  try {
    const { data } = await $api.post(`/register-ppdb/get-detail`, {
      register_id: form.value.code_ppdb,
    });
    console.log(data);
    const dataDetail = data.data[0];
    form.value.sekolah_id = dataDetail.sekolah_id;
    getGrade();
    form.value.grade_id = dataDetail.grade_id;
    form.value.code_ppdb = dataDetail.code_pendaftaran;
    form.value.nama_depan = dataDetail.siswa.nama_depan;
    form.value.nama_belakang = dataDetail.siswa.nama_belakang;
    form.value.tgl_lahir = dataDetail.siswa.tgl_lahir;
    form.value.tempat_lahir = dataDetail.siswa.tempat_lahir;
    form.value.jenis_kelamin = dataDetail.siswa.jenis_kelamin;
    form.value.nisn = dataDetail.siswa.nisn;
    form.value.nik = dataDetail.siswa.nik;
    form.value.agama = dataDetail.siswa.agama;
    form.value.no_akte_kelahiran = dataDetail.siswa.no_akte_kelahiran;
    form.value.anak_ke = dataDetail.siswa.anak_ke;
    form.value.hobby = dataDetail.siswa.hobby;
    form.value.cita_cita = dataDetail.siswa.cita_cita;
    form.value.jumlah_saudara = dataDetail.siswa.jumlah_saudara;
    form.value.goldarah = dataDetail.siswa.goldarah;
    form.value.kewarganegaraan = dataDetail.siswa.kewarganegaraan;
    form.value.tinggi_badan = dataDetail.siswa.tinggi_badan;
    form.value.berat_badan = dataDetail.siswa.berat_badan;
    form.value.riwayat_kesehatan = dataDetail.siswa.riwayat_kesehatan;
    form.value.no_handphone = dataDetail.siswa.no_handphone;
    form.value.asal_sekolah = dataDetail.asal_sekolah;
    form.value.jenjang_terakhir = dataDetail.jenjang_terakhir;
    form.value.status_pendaftaran_siswa = dataDetail.status_pendaftaran_siswa;
    form.value.bahasa_sehari_hari = dataDetail.siswa.bahasa_sehari_hari;
    form.value.kebutuhan_spesial =
      dataDetail.siswa.kebutuhan_spesial == "1" ? true : false;
    form.value.award = dataDetail.siswa_award != null ? "Ada" : "Tidak Ada";
    form.value.biaya_admin = dataDetail.biaya_admin;
    form.value.diskon = dataDetail.diskon;
    form.value.biaya_pendaftaran = dataDetail.biaya_pendaftaran;
    form.value.dataSekolah = dataDetail.sekolah;
    form.value.dataPPDB = dataDetail;
    fotoPreviewFotoSiswa.value = dataDetail.siswa.foto_siswa ?? "/no-image.jpg";
    form.value.nilai_nem = dataDetail.nem ?? null;

    if (dataDetail.siswa_award != null) {
      form.value.award_name = dataDetail.siswa_award.award;
      form.value.award_date = dataDetail.siswa_award.tgl_didapat;
      fotoPreview.value = dataDetail.siswa_award.image;
    }

    if (dataDetail.siswa_address != null) {
      form.value.jarak_rumah_sekolah =
        dataDetail.siswa_address.jarak_rumah_sekolah;
      form.value.alamat_siswa = dataDetail.siswa_address.alamat;
      form.value.rt_siswa = dataDetail.siswa_address.rt;
      form.value.rw_siswa = dataDetail.siswa_address.rw;
      getProvince();
      form.value.provinsi_id_siswa = dataDetail.siswa_address.provinsi_id;
      getKota(form.value.provinsi_id_siswa);
      form.value.city_id_siswa = dataDetail.siswa_address.city_id;
      getKelurahan(form.value.city_id_siswa);
      form.value.district_id_siswa = dataDetail.siswa_address.district_id;
      getVillage(form.value.district_id_siswa);
      form.value.subdistrict_id_siswa = dataDetail.siswa_address.subdistrict_id;
      form.value.zip_code_siswa = dataDetail.siswa_address.zip_code;
    }

    if (dataDetail.siswa_parent != null) {
      form.value.nama_ayah = dataDetail.siswa_parent.nama_ayah;
      form.value.nik_ayah = dataDetail.siswa_parent.nik_ayah;
      form.value.pekerjaan_ayah = dataDetail.siswa_parent.pekerjaan_ayah;
      form.value.pendidikan_terakhir_ayah =
        dataDetail.siswa_parent.pendidikan_terakhir_ayah;
      form.value.penghasilan_ayah = dataDetail.siswa_parent.penghasilan_ayah;
      form.value.no_hp_ayah = dataDetail.siswa_parent.no_hp_ayah;
      form.value.no_telepon_ayah = dataDetail.siswa_parent.no_telepon_ayah;
      form.value.alamat_ayah = dataDetail.siswa_parent.alamat_ayah;
      form.value.is_same_address_ayah =
        dataDetail.siswa_parent.is_same_address_ayah == "true" ? true : false;

      form.value.nama_ibu = dataDetail.siswa_parent.nama_ibu;
      form.value.nik_ibu = dataDetail.siswa_parent.nik_ibu;
      form.value.pekerjaan_ibu = dataDetail.siswa_parent.pekerjaan_ibu;
      form.value.pendidikan_terakhir_ibu =
        dataDetail.siswa_parent.pendidikan_terakhir_ibu;
      form.value.penghasilan_ibu = dataDetail.siswa_parent.penghasilan_ibu;
      form.value.no_hp_ibu = dataDetail.siswa_parent.no_hp_ibu;
      form.value.no_telepon_ibu = dataDetail.siswa_parent.no_telepon_ibu;
      form.value.alamat_ibu = dataDetail.siswa_parent.alamat_ibu;
      form.value.is_same_address_ibu =
        dataDetail.siswa_parent.is_same_address_ibu == "true" ? true : false;

      form.value.nama_wali = dataDetail.siswa_parent.nama_wali;
      form.value.nik_wali = dataDetail.siswa_parent.nik_wali;
      form.value.pekerjaan_wali = dataDetail.siswa_parent.pekerjaan_wali;
      form.value.pendidikan_terakhir_wali =
        dataDetail.siswa_parent.pendidikan_terakhir_wali;
      form.value.penghasilan_wali = dataDetail.siswa_parent.penghasilan_wali;
      form.value.no_hp_wali = dataDetail.siswa_parent.no_hp_wali;
      form.value.no_telepon_wali = dataDetail.siswa_parent.no_telepon_wali;
      form.value.alamat_wali = dataDetail.siswa_parent.alamat_wali;
      form.value.is_same_address_wali =
        dataDetail.siswa_parent.is_same_address_wali == "true" ? true : false;
    }

    if (dataDetail.payment == null) {
      form.value.payment_status = "Belum dibayar";
    } else {
      fotoPreviewBukti.value = dataDetail.payment.bukti_transfer;
      form.value.payment_status =
        dataDetail.payment.status_payment == "00"
          ? "Menunggu"
          : dataDetail.payment.status_payment == "01"
          ? "Pembayaran Berhasil"
          : "Pembayaran Ditolak";
    }
  } catch (error) {
    show.value = true;
    message.value = "Server Error.";
  } finally {
    loading.value = false;
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

async function printData(data) {
  loading.value = true;
  try {
    const response = await $api.post("/register-ppdb/generate-pdf", data);

    const downloadUrl = response.data.download_url;
    if (downloadUrl) {
      window.open(downloadUrl, "_blank"); // 👈 buka di tab baru
    } else {
      show.value = true;
      message.value = "Gagal mendapatkan link unduhan.";
    }
  } catch (error) {
    show.value = true;
    message.value =
      error.response?.data?.message || "Terjadi kesalahan saat mencetak.";
  } finally {
    loading.value = false;
  }
}

async function daftarUlang(data) {
  if (data.is_daftar_ulang == "1") {
    getDaftarUlang(data);
    step.value = 7;
  } else {
    loading.value = true;
    try {
      const response = await $api.post("/register-ppdb/daftar-ulang", data);

      // showSuccess.value = true
      // message.value = 'Pendaftaran Ulang berhasil dibuat.'
      // showCreateModal.value = false;
      getDaftarUlang(data);
      step.value = 7;
    } catch (error) {
      show.value = true;
      message.value = "Terjadi kesalahan.";
    } finally {
      loading.value = false;
    }
  }
}

async function getDaftarUlang(dataProp) {
  loading.value = true;
  try {
    const { data } = await $api.post("/register-ppdb/get-daftar-ulang", {
      id: dataProp.id,
    });
    formDaftarUlang.value.biaya_pendaftaran = data.data.biaya_pendaftaran;
    formDaftarUlang.value.code_registrasi_ulang =
      data.data.code_registrasi_ulang;
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
      step.value = 7;
    }
  } catch (error) {
    show.value = true;
    message.value = "Terjadi kesalahan.";
  } finally {
    loading.value = false;
  }
}

async function printDataKTS(data) {
  loading.value = true;
  try {
    const response = await $api.post("/register-ppdb/generate-kts-pdf", {
      register_id: data.id,
    });

    const downloadUrl = response.data.download_url;
    if (downloadUrl) {
      window.open(downloadUrl, "_blank"); // 👈 buka di tab baru
    } else {
      show.value = true;
      message.value = "Gagal mendapatkan link unduhan.";
    }
  } catch (error) {
    show.value = true;
    message.value =
      error.response?.data?.message || "Terjadi kesalahan saat mencetak.";
  } finally {
    loading.value = false;
  }
}

async function fetchUser() {
  try {
    const response = await $api.get("/users");
    is_email_verifikasi.value = response.data.is_active_email;
    dataUsers.value = response.data;
  } catch (error) {}
}

async function updateSameAddress(type) {
  const alamat =
    form.value.dataPPDB.siswa_address.alamat +
    ", Kel/Des. " +
    form.value.dataPPDB.siswa_address.desa +
    ", Kec. " +
    form.value.dataPPDB.siswa_address.district +
    ", " +
    form.value.dataPPDB.siswa_address.kota +
    " Prov. " +
    form.value.dataPPDB.siswa_address.provinsi +
    " " +
    form.value.dataPPDB.siswa_address.zip_code;
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

const loadingDiskon = ref(false);
const diskonAppliedMessage = ref(null);

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
      show.value = true;
      message.value =
        error.response?.data?.message || "Gagal menerapkan voucher.";
    })
    .finally(() => {
      loadingDiskon.value = false;
    });
}

onMounted(() => {
  getRole();
  getDataRegister();
  fotoPreview.value = "/no-image.jpg";
  fotoPreviewBukti.value = "/no-image.jpg";
  fotoPreviewFotoSiswa.value = "/no-image.jpg";
  foto_bukti_regis_ulang.value = "/no-image.jpg";
  getProvince();
  getBankAccount();
  fetchUser();
  getBeasiswa();
});
</script>
