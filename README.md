# Strash - Aplikasi Klasifikasi Sampah Pintar

Strash adalah aplikasi web progresif (PWA) yang menggunakan teknologi machine learning untuk mengidentifikasi dan mengklasifikasikan sampah secara otomatis. Aplikasi ini dibangun dengan React.js untuk frontend dan Hapi.js untuk backend, terintegrasi dengan Firebase dan Railway untuk penyimpanan data dan deployment.

## 🚀 Fitur Utama

### 📸 Klasifikasi Sampah

- Upload gambar atau gunakan kamera real-time
- Klasifikasi sampah menggunakan TensorFlow.js dan VGG16
- Hasil klasifikasi dengan persentase akurat
- Rekomendasi penanganan sampah berdasarkan jenis
- Integrasi machine learning model yang dioptimalkan

### 📊 Riwayat

- Menyimpan hasil klasifikasi di Firebase
- Filter berdasarkan jenis sampah
- Detail hasil klasifikasi dengan visualisasi
- Statistik pengguna

### 🏆 Leaderboard & Gamifikasi

- Peringkat pengguna berdasarkan jumlah klasifikasi
- Sistem poin
- Update real-time menggunakan Firebase

### 📚 Edukasi & Informasi

- Artikel edukasi tentang jenis sampah
- Tips pengelolaan sampah
- Desain card modern dengan animasi

### 🔐 Autentikasi & Keamanan

- Login dan registrasi dengan Firebase Auth
- Proteksi endpoint dengan JWT
- Manajemen sesi pengguna
- Secure data storage

## 🛠️ Teknologi yang Digunakan

### Frontend

- React.js dengan Hooks dan Context API
- TensorFlow.js & VGG16 untuk ML
- Tailwind CSS untuk styling
- PWA dengan Service Worker
- SweetAlert2 untuk UI/UX
- React-Toastify untuk notifikasi
- Axios untuk HTTP requests

### Backend

- Hapi.js framework
- Firebase Firestore
- Firebase Admin SDK
- JWT untuk autentikasi
- Railway untuk deployment
- Compression untuk optimasi

### Machine Learning

- TensorFlow.js
- VGG16 model
- Custom model training
- Model optimization
- Real-time inference

## 📦 Instalasi

### Prasyarat

- Node.js (v14 atau lebih baru)
- npm atau yarn
- Firebase account
- Railway account

### Frontend

```bash
cd frontend
npm install
npm run serve
```

## 🔧 Konfigurasi

### Frontend (.env)

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_API_URL=your_railway_api_url
```

## 📱 Penggunaan

1. Buka aplikasi di browser (default: http://127.0.0.1:8080)
2. Buat akun atau login
3. Pilih menu "Scan" untuk memulai
4. Upload gambar atau gunakan kamera
5. Lihat hasil klasifikasi dan rekomendasi
6. Cek riwayat di menu "Riwayat"
7. Lihat peringkat di "Leaderboard"
8. Baca artikel di menu "Edukasi"

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request
