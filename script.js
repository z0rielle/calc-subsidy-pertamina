// --- DARK MODE ---
const themeToggleBtn = document.getElementById("themeToggle");
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
  updateIcons(true);
} else {
  document.documentElement.classList.remove("dark");
  updateIcons(false);
}

themeToggleBtn.addEventListener("click", function () {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
    updateIcons(false);
  } else {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
    updateIcons(true);
  }
});
function updateIcons(isDark) {
  iconSun.classList.toggle("hidden", isDark);
  iconMoon.classList.toggle("hidden", !isDark);
}

// --- DATA NAMA ---
const NAMA_URL =
  "https://gist.githubusercontent.com/z0rielle/e4a8407a3d15af58dc992332a61c401f/raw/b8465b38366622daad2d841054ad155d16c5c3a5/nama.txt";
let globalDaftarNama = [];
const statusEl = document.getElementById("statusData");
const btnEl = document.getElementById("btnHitung");

window.addEventListener("load", async function () {
  try {
    const response = await fetch(NAMA_URL);
    globalDaftarNama = (await response.text())
      .split("\n")
      .filter((n) => n.trim() !== "");
    statusEl.innerHTML = `<span class="text-green-600 dark:text-green-400">Database siap.</span>`;
    setTimeout(() => {
      statusEl.style.display = "none";
    }, 2000);
    btnEl.disabled = false;
  } catch (error) {
    statusEl.innerHTML = `<span class="text-red-500">Gagal memuat nama.</span>`;
    btnEl.disabled = false;
  }
});

// --- TOGGLE INPUTS ---
const templateSelect = document.getElementById("templateSelect");
const inputsV2 = document.getElementById("inputsV2");
const inputsV3 = document.getElementById("inputsV3");

templateSelect.addEventListener("change", function () {
  const val = this.value;
  inputsV2.classList.add("hidden");
  inputsV3.classList.add("hidden");

  if (val === "v2") inputsV2.classList.remove("hidden");
  if (val === "v3") inputsV3.classList.remove("hidden");
});

const rangeLogoSizeV2 = document.getElementById("v2_logo_size");
const rangeSpbuSizeV2 = document.getElementById("v2_spbu_font_size");
const imgLogoV2 = document.getElementById("v2_logo_img");
const txtSpbuV2 = document.getElementById("v2_spbu_display");

if (rangeLogoSizeV2 && imgLogoV2) {
  rangeLogoSizeV2.addEventListener("input", function () {
    document.getElementById("val_v2_logo_size").innerText = this.value;
    imgLogoV2.style.width = this.value + "px";
  });
}

if (rangeSpbuSizeV2 && txtSpbuV2) {
  rangeSpbuSizeV2.addEventListener("input", function () {
    document.getElementById("val_v2_spbu_size").innerText = this.value;
    txtSpbuV2.style.fontSize = this.value + "px";
  });
}

// --- CONTROL KUALITAS TINTA V2 (FIXED LOGO OPACITY) ---
const rangeInkV2 = document.getElementById("v2_ink_opacity");
const valInkV2 = document.getElementById("val_v2_ink");
const v2Wrapper = document.getElementById("v2_content_wrapper");

if (rangeInkV2) {
  rangeInkV2.addEventListener("input", function () {
    const val = this.value;
    valInkV2.innerText = val;

    // 1. Efek ke Teks (Color Alpha) & Blur Wrapper
    if (v2Wrapper) {
      v2Wrapper.style.color = `rgba(0, 0, 0, ${val})`;
      const blurAmt = (1 - val) * 0.5; // Sedikit blur jika pudar
      v2Wrapper.style.filter = `blur(${blurAmt}px)`;
    }

    // 2. Efek ke Logo (Opacity Image)
    // Perlu target img secara langsung karena img tidak mewarisi 'color'
    if (imgLogoV2) {
      imgLogoV2.style.opacity = val;
    }
  });
}

// --- LINE HEIGHT CONTROLS (V3) ---
const lhHeader = document.getElementById("lh_header");
const lhBody = document.getElementById("lh_body");
const lhFooter = document.getElementById("lh_footer");

const valLhHeader = document.getElementById("val_lh_header");
const valLhBody = document.getElementById("val_lh_body");
const valLhFooter = document.getElementById("val_lh_footer");

const secHeader = document.getElementById("v3_sec_header");
const secBody = document.getElementById("v3_sec_body");
const secFooter = document.getElementById("v3_sec_footer");

const rangeThick = document.getElementById("print_thick");
const valThick = document.getElementById("val_print_thick");
const rangeOpacity = document.getElementById("ink_opacity");
const valOpacity = document.getElementById("val_ink_opacity");
const thermalWrapper = document.querySelector(".thermal-content");

function updateInkEffects() {
  // Nilai slider: 0.2 (Pudar/Rusak) s.d 1.0 (Baru/Jelas)
  const val = parseFloat(rangeOpacity.value);
  valOpacity.innerText = val;

  if (thermalWrapper) {
    // 1. Opacity Teks (Gelap Terang)
    thermalWrapper.style.setProperty("--ink-opacity", val);

    // 2. Blur (Semakin pudar, semakin blur sedikit)
    // Jika val 1.0 -> Blur 0px
    // Jika val 0.5 -> Blur 0.5px
    const blurAmount = (1 - val) * 0.8;
    thermalWrapper.style.setProperty("--text-blur", `${blurAmount}px`);

    // 3. Noise/Grain (Bintik Putih)
    // Jika val 1.0 -> Noise 0 (Bersih)
    // Jika val 0.5 -> Noise 0.3 (Mulai geripis)
    const noiseAmount = (1 - val) * 0.7;
    thermalWrapper.style.setProperty("--noise-opacity", noiseAmount);
  }
}

if (rangeOpacity) {
  rangeOpacity.addEventListener("input", updateInkEffects);
}

// Update fungsi applyStyles
function applyStyles() {
  updateLineHeights();
  updateInkEffects(); // Panggil fungsi efek baru
}

function updateLineHeights() {
  // Header
  const hVal = lhHeader.value;
  valLhHeader.innerText = hVal;
  if (secHeader) secHeader.style.lineHeight = hVal;

  // Body
  const bVal = lhBody.value;
  valLhBody.innerText = bVal;
  if (secBody) secBody.style.lineHeight = bVal;

  // Footer
  const fVal = lhFooter.value;
  valLhFooter.innerText = fVal;
  if (secFooter) secFooter.style.lineHeight = fVal;
}

lhHeader.addEventListener("input", updateLineHeights);
lhBody.addEventListener("input", updateLineHeights);
lhFooter.addEventListener("input", updateLineHeights);

// --- HELPER FUNCTIONS ---
function formatFullDate(d) {
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatNumber(num) {
  return parseFloat(num).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatUS_Currency(num) {
  // 10000 -> "10,000"
  return Math.round(num).toLocaleString("en-US");
}

function generateName() {
  if (globalDaftarNama.length === 0) return "USER UMUM";
  const idx1 = Math.floor(Math.random() * globalDaftarNama.length);
  let idx2 = Math.floor(Math.random() * globalDaftarNama.length);
  return `${globalDaftarNama[idx1].trim()} ${globalDaftarNama[idx2].trim()}`;
}

function getRandomDigits(length) {
  let res = "";
  for (let i = 0; i < length; i++) res += Math.floor(Math.random() * 10);
  return res;
}

function getRandomLetters(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// --- CORE LOGIC ---
btnEl.addEventListener("click", () => {
  const tmpl = templateSelect.value;
  const viewV1 = document.getElementById("strukV1");
  const viewV2 = document.getElementById("strukV2");
  const viewV3 = document.getElementById("strukV3");
  const container = document.getElementById("outputContainer");

  viewV1.classList.add("hidden");
  viewV2.classList.add("hidden");
  viewV3.classList.add("hidden");
  container.classList.remove("hidden");

  // Calc
  const hNon =
    parseFloat(document.getElementById("hargaNonSubsidi").value) || 0;
  const sub =
    parseFloat(document.getElementById("subsidiPemerintah").value) || 0;
  const cash = parseFloat(document.getElementById("cash").value) || 0;
  const plat = document.getElementById("platNomor").value.toUpperCase();

  const hJual = hNon - sub;
  const vol = hJual > 0 ? cash / hJual : 0;
  const tNon = Math.round(vol * hNon);
  const tSub = Math.round(vol * sub);
  const rndName = generateName();
  const now = new Date();

  if (tmpl === "v1") {
    viewV1.classList.remove("hidden");
    document.getElementById("v1_waktu").innerText = now.toLocaleString("id-ID");
    document.getElementById("v1_pelanggan").innerText = rndName;
    document.getElementById("v1_plat").innerText = plat;
    document.getElementById("v1_volume").innerText = vol.toFixed(2);
    document.getElementById("v1_hNon").innerText = "Rp " + formatNumber(hNon);
    document.getElementById("v1_hSub").innerText = "- Rp " + formatNumber(sub);
    document.getElementById("v1_hJual").innerText = "Rp " + formatNumber(hJual);
    document.getElementById("v1_tNon").innerText = "Rp " + formatNumber(tNon);
    document.getElementById("v1_tSub").innerText = "Rp " + formatNumber(tSub);
    document.getElementById("v1_tBayar").innerText = "Rp " + formatNumber(cash);
  } else if (tmpl === "v2") {
    viewV2.classList.remove("hidden");

    // 1. Waktu Input (Format dd-mm-yyyy hh:mm:ss)
    const inputWaktu = document.getElementById("v2_waktuInput").value.trim();
    let displayWaktu;
    let dateObj = new Date(); // Untuk shift logic

    if (inputWaktu) {
      displayWaktu = inputWaktu;
      // Parse sederhana untuk Shift (asumsi jam ada di string)
      // Coba ambil jam dari format "dd-mm-yyyy hh:mm:ss"
      const parts = inputWaktu.split(" ");
      if (parts.length > 1) {
        const timeParts = parts[1].split(":");
        dateObj.setHours(timeParts[0], timeParts[1]);
      }
    } else {
      // Auto Format
      const pad = (n) => n.toString().padStart(2, "0");
      const d = now;
      displayWaktu = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    // 2. Hitung Shift
    const currentHour = dateObj.getHours();
    let calculatedShift = 3;
    if (currentHour >= 6 && currentHour < 14) calculatedShift = 1;
    else if (currentHour >= 14 && currentHour < 22) calculatedShift = 2;

    // 3. Logo & SPBU Size
    const logoSize = document.getElementById("v2_logo_size").value;
    const spbuSize = document.getElementById("v2_spbu_font_size").value;
    document.getElementById("v2_logo_img").style.width = logoSize + "px";
    document.getElementById("v2_spbu_display").style.fontSize = spbuSize + "px";
    document.getElementById("val_v2_logo_size").innerText = logoSize;
    document.getElementById("val_v2_spbu_size").innerText = spbuSize;

    if (rangeLogoSizeV2) imgLogoV2.style.width = rangeLogoSizeV2.value + "px";
    if (rangeSpbuSizeV2)
      txtSpbuV2.style.fontSize = rangeSpbuSizeV2.value + "px";

    // Apply Ink Initial
    const inkVal = rangeInkV2.value;
    v2Wrapper.style.color = `rgba(0, 0, 0, ${inkVal})`;
    imgLogoV2.style.opacity = inkVal; // Apply ke logo

    // 4. Data Transaksi
    let noTrans = document.getElementById("v2_transInput").value.trim();
    if (!noTrans)
      noTrans = Math.floor(100000 + Math.random() * 9000000).toString();

    const spbuCode = document.getElementById("v2_spbuInput").value;
    const rawAlamat = document.getElementById("v2_alamatInput").value;
    const formattedAlamat = rawAlamat
      .split("\n")
      .map((line) => `<div>${line}</div>`)
      .join("");

    document.getElementById("v2_spbu_display").innerText = spbuCode;
    document.getElementById("v2_address_display").innerHTML = formattedAlamat;

    const pompa = document.getElementById("v2_pompaInput").value;
    let operator = document.getElementById("v2_operatorInput").value;
    if (!operator) operator = rndName;

    // MAPPING DATA
    document.getElementById("v2_shift").innerText = calculatedShift;
    document.getElementById("v2_trans").innerText = noTrans;
    document.getElementById("v2_waktu").innerText = displayWaktu;
    document.getElementById("v2_pompa").innerText = pompa;
    document.getElementById("v2_operator").innerText = operator;

    // Volume: Gunakan Titik (.) 2 Desimal
    document.getElementById("v2_volume").innerText = vol.toFixed(2);

    // Harga: Gunakan Koma (,) untuk ribuan
    document.getElementById("v2_hNon").innerText = formatUS_Currency(hNon);
    document.getElementById("v2_hSub").innerText = formatUS_Currency(sub);
    document.getElementById("v2_hJual").innerText = formatUS_Currency(hJual);

    document.getElementById("v2_tNon").innerText = formatUS_Currency(tNon);
    document.getElementById("v2_tSub").innerText = formatUS_Currency(tSub);
    document.getElementById("v2_tBayar").innerText = formatUS_Currency(cash);
    document.getElementById("v2_cashBig").innerText = formatUS_Currency(cash);

    document.getElementById("v2_plat").innerText = plat;
    document.getElementById("v2_msgSub").innerText =
      "Rp " + formatUS_Currency(tSub);
  }
  // --- V3 LOGIC (THERMAL) ---
  else if (tmpl === "v3") {
    viewV3.classList.remove("hidden");

    // 1. Data Transaksi (Auto Generate jika kosong)
    let transCode = document.getElementById("v3_transInput").value.trim();
    if (!transCode) {
      // Request: "1-2 character abjad acak" + getRandomDigits(10) + "SK + generate angka random 0-99"

      // Generate 1 atau 2 huruf acak
      const charLen = Math.floor(Math.random() * 2) + 1;
      const prefix = getRandomLetters(charLen);

      // 10 Angka acak
      const middle = getRandomDigits(10);

      // Angka acak 0-99
      const suffix = Math.floor(Math.random() * 100);

      transCode = `${prefix}${middle}SK${suffix}`;
    }

    // 2. Data Petugas
    let petugas = document.getElementById("v3_petugasInput").value;
    if (!petugas) petugas = rndName;

    // 3. Data Produk & Odoo
    const produk = document.getElementById("v3_produkInput").value;
    const odoo = document.getElementById("v3_odooInput").value;

    // 4. Header (SPBU & Alamat)
    const spbuCode = document.getElementById("v3_spbuInput").value;
    const rawAlamat = document.getElementById("v3_alamatInput").value;
    // Ubah baris baru (\n) menjadi <div> agar tampil rapi
    const formattedAlamat = rawAlamat
      .split("\n")
      .map((line) => `<div>${line}</div>`)
      .join("");

    // Update DOM Header
    const headerTextContainer = document.getElementById("v3_header_text");
    headerTextContainer.innerHTML = `
              <div class="text-[14px]">SPBU ${spbuCode}</div>
              <div class="mt-1">${formattedAlamat}</div>
          `;

    // 5. Checkbox Alignment Header
    const isCenter = document.getElementById("v3_centerHeader").checked;
    headerTextContainer.className = isCenter ? "text-center" : "text-left";

    // 6. Tanggal & Waktu (Format: dd-mm-yyyy hh:mm:ss)
    const inputWaktu = document.getElementById("v3_waktuInput").value.trim();
    let displayWaktu;

    if (inputWaktu) {
      displayWaktu = inputWaktu;
    } else {
      // Auto Current Time
      const pad = (n) => n.toString().padStart(2, "0");
      const d = now; // Variable 'now' dari scope luar

      // UPDATE: Menggunakan format dd/mm/yyyy
      displayWaktu = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    // Apply Line Heights
    updateLineHeights();

    // MAPPING DATA KE STRUK
    document.getElementById("v3_trans").innerText = transCode;
    document.getElementById("v3_waktu").innerText = displayWaktu;
    document.getElementById("v3_petugas").innerText = petugas;
    document.getElementById("v3_odoo").innerText = odoo;
    document.getElementById("v3_produk").innerText = produk;
    document.getElementById("v3_volume").innerText = vol.toFixed(2);

    document.getElementById("v3_hNon").innerText = formatNumber(hNon);
    document.getElementById("v3_hSub").innerText = formatNumber(sub);
    document.getElementById("v3_hJual").innerText = formatNumber(hJual);

    document.getElementById("v3_tNon").innerText = formatNumber(tNon);
    document.getElementById("v3_tSub").innerText = formatNumber(tSub);
    document.getElementById("v3_tBayar").innerText = formatNumber(cash);
    document.getElementById("v3_cashBig").innerText = formatNumber(cash);

    document.getElementById("v3_plat").innerText = plat;
    document.getElementById("v3_barcode").innerText = getRandomDigits(10);
    document.getElementById("v3_msgSub").innerText = formatNumber(tSub);

    applyStyles();
  }

  container.scrollIntoView({ behavior: "smooth" });
});
