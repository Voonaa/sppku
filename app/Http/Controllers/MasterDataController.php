<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Spp;
use Illuminate\Http\JsonResponse;

/**
 * Controller data master (hanya untuk admin).
 */
class MasterDataController extends Controller
{
    /**
     * Menampilkan ringkasan data master aplikasi.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => 'Data master berhasil diambil.',
            'data' => [
                'spp' => Spp::all(),
                'kelas' => Kelas::all(),
                'siswa' => Siswa::all(),
            ],
        ]);
    }
}
