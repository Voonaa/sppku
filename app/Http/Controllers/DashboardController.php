<?php

namespace App\Http\Controllers;

use App\Models\CekPembayaran;
use App\Models\Siswa;
use Exception;
use Illuminate\Http\JsonResponse;

/**
 * Class DashboardController
 *
 * Controller untuk mengelola data ringkasan dashboard,
 * seperti jumlah siswa yang sudah lunas dan belum lunas.
 *
 * @package App\Http\Controllers
 */
class DashboardController extends Controller
{
    /**
     * Mengambil total/jumlah Siswa yang Sudah Lunas dan Siswa yang Belum Lunas.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            // Hitung siswa yang sudah lunas berdasarkan status_pembayaran di tabel cek_pembayaran
            $sudahLunas = CekPembayaran::where('status_pembayaran', 'Sudah Lunas')->count();

            // Hitung seluruh siswa untuk mengetahui berapa yang belum lunas
            $totalSiswa = Siswa::count();
            $belumLunas = $totalSiswa - $sudahLunas;

            // Jika belum lunas bernilai negatif karena ketidakkonsistenan data, amankan nilainya ke 0
            if ($belumLunas < 0) {
                $belumLunas = 0;
            }

            return response()->json([
                'status' => true,
                'message' => 'Data ringkasan dashboard berhasil diambil.',
                'data' => [
                    'sudah_lunas' => $sudahLunas,
                    'belum_lunas' => $belumLunas,
                ],
            ], 200);

        } catch (Exception $exception) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan pada server.',
                'data' => [
                    'error' => $exception->getMessage(),
                ],
            ], 500);
        }
    }
}
