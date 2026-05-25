<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\CekPembayaran;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Class SiswaController
 *
 * Controller untuk mengelola data CRUD siswa pada tabel tb_siswa.
 *
 * @package App\Http\Controllers
 */
class SiswaController extends Controller
{
    /**
     * Menampilkan daftar semua siswa dengan fitur pencarian berdasarkan Nama atau NISN.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Siswa::query();

            // Jika ada parameter search, lakukan pencarian berdasarkan Nama atau NISN
            if ($request->has('search') && !empty($request->input('search'))) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('nisn', 'like', "%{$search}%")
                      ->orWhere('nama', 'like', "%{$search}%");
                });
            }

            // Eager load relasi kelas, spp, dan cekPembayaran untuk informasi yang lebih lengkap
            $siswa = $query->with(['kelas', 'spp', 'cekPembayaran'])->get();

            return response()->json([
                'status' => true,
                'message' => 'Daftar data siswa berhasil diambil.',
                'data' => $siswa,
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

    /**
     * Menyimpan data siswa baru ke tabel tb_siswa.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validasi Input. NISN wajib diisi, berupa string, panjang tepat/maksimal 10, dan harus unik.
            $validator = Validator::make($request->all(), [
                'nisn' => 'required|string|max:10|unique:tb_siswa,nisn',
                'nis' => 'nullable|string|max:8',
                'nama' => 'required|string|max:50',
                'id_kelas' => 'nullable|string|exists:tb_kelas,id_kelas',
                'alamat' => 'nullable|string',
                'no_telp' => 'nullable|string|max:13',
                'id_spp' => 'nullable|string|exists:tb_spp,id_spp',
            ], [
                'nisn.required' => 'NISN wajib diisi.',
                'nisn.unique' => 'NISN sudah terdaftar.',
                'nisn.max' => 'NISN maksimal 10 karakter.',
                'nama.required' => 'Nama wajib diisi.',
                'nama.max' => 'Nama maksimal 50 karakter.',
                'id_kelas.exists' => 'Kelas tidak ditemukan.',
                'id_spp.exists' => 'SPP tidak ditemukan.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validasi gagal.',
                    'data' => $validator->errors(),
                ], 422);
            }

            $validated = $validator->validated();

            // Membuat record baru menggunakan Eloquent
            $siswa = Siswa::create($validated);

            // Inisialisasi data cek_pembayaran siswa baru
            CekPembayaran::create([
                'nisn' => $siswa->nisn,
                'status_pembayaran' => $request->input('status', 'Belum Lunas'),
                'nama' => $siswa->nama,
                'no_telp' => $siswa->no_telp,
                'tgl_sekarang' => now()->toDateString(),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Data siswa berhasil ditambahkan.',
                'data' => $siswa->load('cekPembayaran'),
            ], 201);

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

    /**
     * Menampilkan detail informasi seorang siswa berdasarkan NISN.
     *
     * @param string $nisn
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $nisn): JsonResponse
    {
        try {
            $siswa = Siswa::with(['kelas', 'spp', 'cekPembayaran'])->find($nisn);

            if (!$siswa) {
                return response()->json([
                    'status' => false,
                    'message' => 'Data siswa tidak ditemukan.',
                    'data' => null,
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Detail data siswa berhasil diambil.',
                'data' => $siswa,
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

    /**
     * Memperbarui data siswa berdasarkan NISN.
     *
     * @param \Illuminate\Http\Request $request
     * @param string $nisn
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $nisn): JsonResponse
    {
        try {
            $siswa = Siswa::find($nisn);

            if (!$siswa) {
                return response()->json([
                    'status' => false,
                    'message' => 'Data siswa tidak ditemukan.',
                    'data' => null,
                ], 404);
            }

            // Validasi Input untuk update. NISN tidak diubah di sini karena primary key varchar.
            $validator = Validator::make($request->all(), [
                'nis' => 'nullable|string|max:8',
                'nama' => 'sometimes|required|string|max:50',
                'id_kelas' => 'nullable|string|exists:tb_kelas,id_kelas',
                'alamat' => 'nullable|string',
                'no_telp' => 'nullable|string|max:13',
                'id_spp' => 'nullable|string|exists:tb_spp,id_spp',
            ], [
                'nama.required' => 'Nama wajib diisi.',
                'nama.max' => 'Nama maksimal 50 karakter.',
                'id_kelas.exists' => 'Kelas tidak ditemukan.',
                'id_spp.exists' => 'SPP tidak ditemukan.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validasi gagal.',
                    'data' => $validator->errors(),
                ], 422);
            }

            $validated = $validator->validated();
            $siswa->update($validated);

            // Perbarui data di cek_pembayaran (termasuk status_pembayaran, nama, dan no_telp)
            CekPembayaran::updateOrCreate(
                ['nisn' => $siswa->nisn],
                [
                    'status_pembayaran' => $request->input('status', 'Belum Lunas'),
                    'nama' => $siswa->nama,
                    'no_telp' => $siswa->no_telp,
                    'tgl_sekarang' => now()->toDateString(),
                ]
            );

            return response()->json([
                'status' => true,
                'message' => 'Data siswa berhasil diperbarui.',
                'data' => $siswa->fresh(['kelas', 'spp', 'cekPembayaran']),
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

    /**
     * Menghapus data siswa berdasarkan NISN.
     *
     * @param string $nisn
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $nisn): JsonResponse
    {
        try {
            $siswa = Siswa::find($nisn);

            if (!$siswa) {
                return response()->json([
                    'status' => false,
                    'message' => 'Data siswa tidak ditemukan.',
                    'data' => null,
                ], 404);
            }

            $siswa->delete();

            return response()->json([
                'status' => true,
                'message' => 'Data siswa berhasil dihapus.',
                'data' => null,
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
