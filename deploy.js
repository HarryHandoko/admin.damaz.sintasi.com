// deploy-zip.js
import AdmZip from "adm-zip"
import ftp from "basic-ftp"
import { execSync } from "child_process"
import { unlinkSync, writeFileSync } from "fs"
import fetch from "node-fetch"

const LOCAL_DIST = "./dist"
const ZIP_FILE = "./dist_upload.zip"
const REMOTE_ZIP = "dist_upload.zip"
const REMOTE_EXTRACTOR = "extractor.php"
const EXTRACTOR_URL = `https://test.darulmaza.sch.id/${REMOTE_EXTRACTOR}`

// ====================================
// 1. Build Nuxt
// ====================================
async function buildNuxt() {
  console.log("🏗️ Building Nuxt...")
  execSync("npx nuxi build", { stdio: "inherit" })
  console.log("✅ Build selesai")
}

// ====================================
// 2. Buat ZIP file dari dist/
// ====================================
async function createZip() {
  console.log("📦 Membuat zip file...")
  const zip = new AdmZip()
  zip.addLocalFolder(LOCAL_DIST)
  zip.writeZip(ZIP_FILE)
  console.log(`✅ Zip selesai: ${ZIP_FILE}`)
}

// ====================================
// 3. Upload + Eksekusi Extractor
// ====================================
async function deploy() {
  const client = new ftp.Client(60000)
  client.ftp.verbose = true
  try {
    await buildNuxt()
    await createZip()

    console.log("🔗 Koneksi ke FTP...")
    await client.access({
      host: "ftp.darulmaza.sch.id",
      user: "darulmazasc",
      password: "nkBSGgsDLgbyC6nCQ",
      secure: false,
      passive: true
    })

    console.log("📤 Upload zip...")
    await client.ensureDir("/spmb")
    await client.uploadFrom(ZIP_FILE, REMOTE_ZIP)

    console.log("📤 Upload extractor.php...")
    writeFileSync("./extractor.php", EXTRACTOR_SCRIPT)
    await client.uploadFrom("./extractor.php", REMOTE_EXTRACTOR)
    unlinkSync("./extractor.php")

    console.log("✅ Upload selesai")
    console.log("⏳ Menjalankan extractor (zero downtime)...")

    const res = await fetch(EXTRACTOR_URL)
    const text = await res.text()

    console.log("📄 Hasil eksekusi extractor:")
    console.log(text)

    console.log("⚠️ extractor.php akan otomatis menghapus dirinya setelah sukses")
  } catch (err) {
    console.error("❌ Error:", err)
  }
  client.close()
}

// ====================================
// 4. PHP Extractor dengan Zero Downtime
// ====================================
const EXTRACTOR_SCRIPT = `<?php
function rrmdir($dir) {
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                $path = $dir . DIRECTORY_SEPARATOR . $object;
                if (is_dir($path)) {
                    rrmdir($path);
                } else {
                    unlink($path);
                }
            }
        }
        rmdir($dir);
    }
}

$TMP_DIR = "spmb_tmp";
$LIVE_DIR = "spmb";
$OLD_DIR = "spmb_old";

// 1. Hapus tmp lama kalau ada
if (is_dir($TMP_DIR)) rrmdir($TMP_DIR);

// 2. Extract ke tmp
$zip = new ZipArchive;
if ($zip->open('${REMOTE_ZIP}') === TRUE) {
    mkdir($TMP_DIR);
    $zip->extractTo($TMP_DIR);
    $zip->close();

    // 3. Rename live ke old
    if (is_dir($LIVE_DIR)) {
        if (is_dir($OLD_DIR)) rrmdir($OLD_DIR);
        rename($LIVE_DIR, $OLD_DIR);
    }

    // 4. Rename tmp ke live
    rename($TMP_DIR, $LIVE_DIR);

    // 5. Hapus old (bisa skip kalau mau simpan rollback)
    rrmdir($OLD_DIR);

    echo "✅ Deploy sukses tanpa downtime";
    unlink('${REMOTE_ZIP}');
    unlink(__FILE__);
} else {
    echo "❌ Gagal extract ZIP";
}
?>`

deploy()
