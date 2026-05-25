<?php

namespace App\Http\Controllers;

use App\Models\Petugas;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Class AuthController
 *
 * Controller untuk mengelola otentikasi login pengguna (admin, petugas, siswa)
 * dengan mencocokkan data pada tabel tb_petugas.
 *
 * @package App\Http\Controllers
 */
class AuthController extends Controller
{
    /**
     * Memproses login pengguna dengan mencocokkan username dan plain-text password.
     * Mengembalikan token (ID Petugas) dan data level pengguna.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        try {
            // Validasi input
            $validator = Validator::make($request->all(), [
                'username' => 'required|string',
                'password' => 'required|string',
            ], [
                'username.required' => 'Nama pengguna wajib diisi.',
                'password.required' => 'Kata sandi wajib diisi.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validasi gagal.',
                    'data' => $validator->errors(),
                ], 422);
            }

            $username = $request->input('username');
            $password = $request->input('password');

            // Cari petugas berdasarkan username dan password plain-text (sesuai spesifikasi ujian)
            $petugas = Petugas::where('username', $username)
                              ->where('password', $password)
                              ->first();

            if (!$petugas) {
                return response()->json([
                    'status' => false,
                    'message' => 'Kredensial login salah. Silakan periksa kembali nama pengguna dan kata sandi Anda.',
                    'data' => null,
                ], 401);
            }

            return response()->json([
                'status' => true,
                'message' => 'Login berhasil.',
                'data' => [
                    'token' => $petugas->id_petugas, // Menggunakan ID Petugas sebagai token otentikasi (header X-Id-Petugas)
                    'user' => [
                        'id_petugas' => $petugas->id_petugas,
                        'username' => $petugas->username,
                        'nama_petugas' => $petugas->nama_petugas,
                        'level' => $petugas->level,
                    ]
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
