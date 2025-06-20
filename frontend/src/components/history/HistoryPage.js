import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, handleApiError } from '../../config/api';
import { formatDate } from '../../utils/formatDate';
import Swal from 'sweetalert2';

// Menginline fungsi formatTime karena tidak ada file terpisah yang disediakan
// Output akan menjadi "HH:MM" (misal: 09:30)
const formatTime = (isoString) => {
  if (!isoString) return ''; // Mengembalikan string kosong jika input tidak ada
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}.${minutes} WIB`; // Menambahkan WIB secara manual agar sesuai screenshot
};

const HistoryPage = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const scansPerPage = 6; // Menampilkan 6 item per halaman sesuai screenshot

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Anda harus login untuk melihat riwayat klasifikasi. Silakan login terlebih dahulu.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token otentikasi tidak ditemukan. Silakan login kembali.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/scans/${userId}`, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const sortedScans = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setScans(sortedScans);
    } catch (err) {
      console.error("Failed to fetch scans:", err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memfilter data berdasarkan kategori
  const filterByCategory = (scan) => {
    if (categoryFilter === 'all') return true;
    return scan.classification.toLowerCase() === categoryFilter.toLowerCase();
  };

  // Fungsi untuk memfilter data berdasarkan pencarian
  const filterBySearch = (scan) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      scan.classification.toLowerCase().includes(query) ||
      formatDate(scan.timestamp).toLowerCase().includes(query) ||
      formatTime(scan.timestamp).toLowerCase().includes(query)
    );
  };

  // Memfilter dan mengurutkan data
  const filteredScans = scans
    .filter(filterByCategory)
    .filter(filterBySearch)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Update pagination logic untuk menggunakan filteredScans
  const indexOfLastScan = currentPage * scansPerPage;
  const indexOfFirstScan = indexOfLastScan - scansPerPage;
  const currentScans = filteredScans.slice(indexOfFirstScan, indexOfLastScan);
  const totalPages = Math.ceil(filteredScans.length / scansPerPage);

  // Reset ke halaman pertama ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchQuery]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fungsi untuk mendapatkan poin - Disesuaikan agar selalu mengembalikan 5
  const getPointsForClassification = (classification) => {
    return 5; // Setiap klasifikasi bernilai 5 poin
  };

  const getWasteIcon = (classification) => {
    switch (classification) {
      case 'Plastik': return (
        <img
            src="/images/icons/Plastic.svg"
            alt="Sampah Plastik Icon"
            className="w-8 h-8"
        />
      );
      case 'Kertas': return (
        <img
            src="/images/icons/Paper.svg"
            alt="Sampah Kertas Icon"
            className="w-8 h-8"
        />
      );
      case 'Kaca': return (
        <img
            src="/images/icons/Glass.svg"
            alt="Sampah Kaca Icon"
            className="w-8 h-8"
        />
      );
      case 'Baterai': return (
        <svg className="w-8 h-8 text-green-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.34C7 21.4 7.6 22 8.33 22h7.34c.73 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
        </svg>
      );
      case 'Sampah Organik': return (
        <img
            src="/images/icons/Organic.svg"
            alt="Sampah Organik Icon"
            className="w-8 h-8"
        />
      );
      case 'Kardus': return (
        <svg className="w-8 h-8 text-green-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 6h-6V4h-4v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM4 20V8h16l.01 12H4zM6 10h12v2H6zm0 4h12v2H6z"/>
        </svg>
      );
      case 'Pakaian': return (
        <svg className="w-8 h-8 text-green-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2V6h-2v4h-2v4h4v4h-2v2h4v-2h2v-4zM2 16h8v-2H2v2z" />
        </svg>
      );
      case 'Sampah Medis': return (
        <svg className="w-8 h-8 text-green-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      );
      case 'Logam': return (
        <img
            src="/images/icons/Metal.svg"
            alt="Sampah Logam Icon"
            className="w-8 h-8"
        />
      );
      case 'Sepatu': return (
        <svg className="w-8 h-8 text-green-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.5 8.9c-.3-.3-.7-.5-1.1-.5H18c-.8 0-1.5.7-1.5 1.5v1.8c0 .2.1.4.3.4s.4-.1.4-.3V10.5c0-.2.2-.4.4-.4h1.5c.6 0 1.1.5 1.1 1.1v2.1c0 .2.1.4.3.4s.4-.1.4-.3V12c.1-.4.2-.8.2-1.2v-.6c0-.8-.7-1.5-1.5-1.5zM20 18H4c-1.1 0-2 .9-2 2v2h18v-2c0-1.1-.9-2-2-2zM15 15V8h-3V5H9c-1.1 0-2 .9-2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2 .9-2 2v2h15v-4z"/>
        </svg>
      );
      default: return (
        <svg className="w-8 h-8 text-green-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"/>
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      ); // Default/fallback icon
    }
  };

  // Hitung total poin dari semua scan
  const totalPoints = filteredScans.reduce((sum, scan) => sum + getPointsForClassification(scan.classification), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2C6B3F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            onClick={fetchScans}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const totalScansCount = filteredScans.length;
  const totalActivitiesCount = filteredScans.length;

  return (
    <div className="font-nunito w-full text-[#2C6B3F]"> {/* Background gray-50 for overall page */}
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Riwayat Aktivitas</h1>
        <p className="text-lg ">Lihat riwayat aktivitas daur ulang dan transaksi poin Anda</p>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-[#E8F5E9] rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-white rounded-lg border border-primary px-3 pr-8 py-2 text-primary font-semibold appearance-none outline-none"
              aria-label="Filter Kategori"
            >
              <option value="all">Semua Kategori</option>
              <option value="plastik">Plastik</option>
              <option value="kertas">Kertas</option>
              <option value="kaca">Kaca</option>
              <option value="baterai">Baterai</option>
              <option value="organik">Sampah Organik</option>
              <option value="kardus">Kardus</option>
              <option value="pakaian">Pakaian</option>
              <option value="medis">Sampah Medis</option>
              <option value="logam">Logam</option>
              <option value="sepatu">Sepatu</option>
            </select>
            <img
              src="/images/icons/Dropdown.svg"
              alt="Dropdown"
              className="w-4 h-4 text-primary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari aktivitas..."
            className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2C6B3F]/50 bg-white text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center">
          <div className="flex items-center gap-4">
            <span
                className="flex items-center justify-center h-16 w-16 rounded-full"
                style={{ background: "#E8F5E9" }}
              >
            <img
                    src="/images/icons/Star-2.svg"
                    alt="Route Icon"
                    className="w-7 h-7"
            />
              </span>
            <div>
              <span className="text-3xl font-extrabold leading-tight">{totalPoints}</span>
              <p className="text-base font-semibold mt-1">Total Poin</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center">
          <div className="flex items-center gap-4">
            <span
                className="flex items-center justify-center h-16 w-16 rounded-full"
                style={{ background: "#E8F5E9" }}
                >
              <img
                      src="/images/icons/Task.svg"
                      alt="Route Icon"
                      className="w-7 h-7"
              />
            </span>
            <div>
              <span className="text-3xl font-extrabold leading-tight">{totalActivitiesCount}</span>
              <p className="text-base font-semibold mt-1">Total Aktivitas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scan History List */}
      {filteredScans.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200 mb-12">
          <p className="text-lg">Tidak ada aktivitas yang sesuai dengan filter.</p>
          <p className="text-sm mt-2 opacity-75">Silakan coba filter atau pencarian yang berbeda.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentScans.map((scan) => (
              <article
                key={scan.id}
                className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-sm overflow-hidden"
              >
                <div className="flex flex-row items-start gap-4 p-6 pb-0 flex-1">
                  <span
                    className="flex items-center justify-center h-16 w-16 rounded-lg"
                    style={{ background: "#E8F5E9" }}
                  >
                    {getWasteIcon(scan.classification)} {/* Ikon sesuai jenis sampah */}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-bold text-lg truncate">
                        {scan.classification}
                      </span>
                      <span className="bg-[#E8F5E9] text-primary text-xs font-bold rounded-lg px-3 py-1 ml-auto">
                        Selesai
                      </span>
                    </div>
                    <div className="text-primary text-sm font-medium opacity-70 mb-2 truncate">
                      {formatDate(scan.timestamp).split('pukul')[0].trim()} • {formatTime(scan.timestamp)}
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/icons/Star-2.svg"
                        alt="Poin"
                        className="h-5 w-5"
                      />
                      <span className="text-primary font-semibold text-base">
                        {getPointsForClassification(scan.classification)} Poin
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F5F6F7] w-full px-6 py-3 flex justify-end items-center mt-6">
                  <button 
                    onClick={() => {
                      Swal.fire({
                        title: 'Fitur Segera Hadir!',
                        text: 'Fitur lihat gambar sedang dalam pengembangan. Mohon tunggu update selanjutnya.',
                        icon: 'info',
                        confirmButtonText: 'Mengerti',
                        confirmButtonColor: '#2C6B3F',
                        customClass: {
                          popup: 'rounded-3xl',
                          title: 'text-[#2C6B3F] font-bold text-2xl',
                          confirmButton: 'rounded-xl',
                        }
                      });
                    }}
                    className="text-primary font-semibold text-sm flex items-center gap-1 hover:font-bold"
                  >
                    Lihat Gambar
                    <img
                      src="/images/icons/Arrow-Right-3.svg"
                      alt="Lihat"
                      className="h-3 w-3"
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mb-8">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === index + 1
                      ? 'bg-[#2C6B3F] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* About Recycle Section */}
      <div className="bg-[#E8F5E9] bg-opacity-70 rounded-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-5 text-[#2C6B3F]">Tentang Daur Ulang</h2>
        <p className="text-base mb-6">
            Poin yang Anda peroleh dari aktivitas daur ulang dapat ditukarkan
            dengan berbagai hadiah menarik atau donasi untuk program lingkungan.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cara Mendapatkan Poin */}
          <div className='bg-white rounded-xl border border-[#2C6B3F] p-6 flex flex-col gap-2'>
            <div className="flex items-center gap-3 mb-2">
                <img
                  src="/images/icons/Recycle-3.svg"
                  alt="Poin"
                  className="h-6 w-6"
                />
                <span className="font-bold text-lg">
                  <h3>
                    Cara Mendapatkan Poin
                  </h3>
                </span>
              </div>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Daur ulang plastik</li>
              <li>Daur ulang botol kaca</li>
              <li>Daur ulang kertas</li>
              <li>Daur ulang logam</li>
              <li>Daur ulang organik</li>
            </ul>
          </div>
          {/* Penukaran Poin */}
          <div className='bg-white rounded-xl border border-[#2C6B3F] p-6 flex flex-col gap-2'>
            <div className="flex items-center gap-3 mb-2">
                <img
                  src="/images/icons/Gift.svg"
                  alt="Poin"
                  className="h-6 w-6"
                />
                <span className="font-bold text-lg">
                  <h3>
                    Penukaran Poin
                  </h3>
                </span>
              </div>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>100 poin: Voucher Belanja Rp 10.000</li>
              <li>500 poin: Voucher Belanja Rp 50.000</li>
              <li>1000 poin: Voucher Belanja Rp 100.000</li>
              <li>2500 poin: Voucher Belanja Rp 250.000</li>
              <li>5000 poin: Donasi Penanaman Lingkungan</li>
              <li>Selengkapnya: Dapatkan informasi dari program lingkungan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;