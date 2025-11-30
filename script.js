// ================= DARK MODE LOGIC =================
const themeToggleBtn = document.getElementById("themeToggle");
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");

// 1. Cek Preferensi Awal (Local Storage -> System Preference)
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

// 2. Event Listener Tombol Toggle
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

// 3. Fungsi Update Ikon
function updateIcons(isDark) {
  if (isDark) {
    iconSun.classList.remove("hidden");
    iconMoon.classList.add("hidden");
  } else {
    iconSun.classList.add("hidden");
    iconMoon.classList.remove("hidden");
  }
}

// ================= APP LOGIC =================

const NAMA_URL =
  "https://gist.githubusercontent.com/z0rielle/e4a8407a3d15af58dc992332a61c401f/raw/b8465b38366622daad2d841054ad155d16c5c3a5/nama.txt";
let globalDaftarNama = [];
const statusEl = document.getElementById("statusData");
const btnEl = document.getElementById("btnHitung");

window.addEventListener("load", async function () {
  try {
    const response = await fetch(NAMA_URL);
    const text = await response.text();
    globalDaftarNama = text.split("\n").filter((n) => n.trim() !== "");

    // Status: Ready
    statusEl.innerHTML = `
            <svg class="h-3 w-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span class="text-green-600 dark:text-green-400">Database siap.</span>
        `;
    setTimeout(() => {
      statusEl.style.display = "none";
    }, 2000);
    btnEl.disabled = false;
  } catch (error) {
    console.error("Gagal mengambil nama:", error);
    statusEl.innerHTML = `<span class="text-red-500">Gagal memuat nama. Mode Offline.</span>`;
    btnEl.disabled = false;
  }
});

btnEl.addEventListener("click", prosesTransaksi);

function formatRupiahKoma(angka) {
  return "Rp. " + parseFloat(angka).toLocaleString("en-US");
}

function generateTwoNames() {
  if (globalDaftarNama.length === 0) return "Pelanggan Umum";
  const idx1 = Math.floor(Math.random() * globalDaftarNama.length);
  let idx2 = Math.floor(Math.random() * globalDaftarNama.length);
  while (idx1 === idx2 && globalDaftarNama.length > 1) {
    idx2 = Math.floor(Math.random() * globalDaftarNama.length);
  }
  return `${globalDaftarNama[idx1].trim()} ${globalDaftarNama[idx2].trim()}`;
}

function prosesTransaksi() {
  const output = document.getElementById("strukOutput");

  let hNonSub =
    parseFloat(document.getElementById("hargaNonSubsidi").value) || 0;
  let subGov =
    parseFloat(document.getElementById("subsidiPemerintah").value) || 0;
  let cash = parseFloat(document.getElementById("cash").value) || 0;

  let hargaJual = hNonSub - subGov;
  let volume = 0;
  if (hargaJual > 0) volume = cash / hargaJual;

  let totalTanpaSub = Math.round(volume * hNonSub);
  let totalSubGov = Math.round(volume * subGov);
  let namaPelanggan = generateTwoNames();

  output.classList.remove("hidden");

  // Perhatikan penggunaan class text-foreground, bg-card, border-border, text-muted-foreground
  // agar struk juga mendukung dark mode.
  output.innerHTML = `
        <div class="font-mono text-xs sm:text-sm text-foreground space-y-4 bg-card p-4 border border-border rounded shadow-sm">
            <div class="text-center border-b border-dashed border-border pb-3 mb-3">
                <h2 class="font-bold text-lg">STRUK BBM</h2>
                <p class="text-muted-foreground">${new Date().toLocaleString("id-ID")}</p>
            </div>

            <div class="flex justify-between items-center">
                <span class="text-muted-foreground">Pelanggan</span>
                <span class="font-bold uppercase text-right w-1/2 break-words">${namaPelanggan}</span>
            </div>

            <div class="flex justify-between">
                <span class="text-muted-foreground">Volume</span>
                <span class="font-medium">${volume.toFixed(2)} Liter</span>
            </div>

            <div class="border-t border-dashed border-border my-2"></div>

            <div class="space-y-1">
                <p class="font-bold mb-1">Rincian Harga (Rp/L)</p>
                <div class="flex justify-between">
                    <span class="text-muted-foreground">Non Subsidi</span>
                    <span>${formatRupiahKoma(hNonSub)}</span>
                </div>
                <div class="flex justify-between text-green-600 dark:text-green-400">
                    <span>Subsidi Pemerintah</span>
                    <span>- ${formatRupiahKoma(subGov)}</span>
                </div>
                <div class="flex justify-between font-semibold mt-1">
                    <span>Harga Jual</span>
                    <span>${formatRupiahKoma(hargaJual)}</span>
                </div>
            </div>

            <div class="border-t border-dashed border-border my-2"></div>

            <div class="space-y-1">
                <p class="font-bold mb-1">Total Penjualan</p>
                <div class="flex justify-between text-muted-foreground">
                    <span>Tanpa Subsidi</span>
                    <span>${formatRupiahKoma(totalTanpaSub)}</span>
                </div>
                <div class="flex justify-between text-muted-foreground">
                    <span>Subsidi Gov</span>
                    <span>${formatRupiahKoma(totalSubGov)}</span>
                </div>
                <div class="flex justify-between font-bold text-base mt-2 pt-2 border-t border-border">
                    <span>DIBAYAR</span>
                    <span>${formatRupiahKoma(cash)}</span>
                </div>
            </div>

            <div class="text-center mt-6 pt-2 border-t border-border">
                <p class="font-bold">CASH</p>
                <p class="text-[10px] text-muted-foreground mt-1 uppercase">Semua kalkulasi berdasarkan CASH</p>
            </div>
        </div>
    `;

  output.scrollIntoView({ behavior: "smooth" });
}
