<?php

namespace App\Http\Controllers;

use App\Models\CekPembayaran;
use App\Models\Pembayaran;
use App\Models\Siswa;
use App\Models\Spp;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

/**
 * Controller untuk mengelola transaksi pembayaran SPP siswa.
 */
class PembayaranController extends Controller
{
    /**
     * Memproses transaksi pembayaran SPP dan menghitung kembalian.
     *
     * Proses update tb_pembayaran dan sinkronisasi cek_pembayaran dibungkus
     * DB::transaction() agar jika salah satu operasi gagal, perubahan lain
     * di-rollback sehingga basis data tetap konsisten (tidak corrupt).
     */
    public function storeTransaksi(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'id_pembayaran' => 'required|string',
                'nisn' => 'required|string',
                'id_spp' => 'required|string',
                'nominal_bayar' => 'required|numeric|min:1',
                'jumlah_bayar' => 'required|numeric|min:1',
            ], [
                'nominal_bayar.required' => 'Nominal bayar wajib diisi.',
                'nominal_bayar.numeric' => 'Nominal bayar harus berupa angka.',
                'jumlah_bayar.required' => 'Jumlah bayar wajib diisi.',
                'jumlah_bayar.numeric' => 'Jumlah bayar harus berupa angka.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validasi gagal.',
                    'data' => $validator->errors(),
                ], 422);
            }

            $validated = $validator->validated();

            $spp = Spp::find($validated['id_spp']);
            if (! $spp) {
                return response()->json([
                    'status' => false,
                    'message' => 'Data SPP tidak ditemukan.',
                    'data' => null,
                ], 404);
            }

            $pembayaran = Pembayaran::find($validated['id_pembayaran']);
            if (! $pembayaran) {
                // Buat record pembayaran baru secara dinamis jika belum terbuat di sistem
                $pembayaran = new Pembayaran();
                $pembayaran->id_pembayaran = $validated['id_pembayaran'];
                $pembayaran->status = 'Belum Lunas';
                $pembayaran->jumlah_bulan = '1';
            }

            $siswa = Siswa::find($validated['nisn']);
            if (! $siswa) {
                return response()->json([
                    'status' => false,
                    'message' => 'Data siswa tidak ditemukan.',
                    'data' => null,
                ], 404);
            }

            $nominalSpp = (int) $spp->nominal;
            $uangDibayar = (int) $validated['jumlah_bayar'];
            $status = 'Belum Lunas';
            $kembalian = 0;
            $tglBayar = null;

            // Hitung kembalian: uang yang dibayar dikurangi nominal SPP dari tb_spp
            if ($uangDibayar >= $nominalSpp) {
                $kembalian = $uangDibayar - $nominalSpp;
                $status = 'Sudah Lunas';
                $tglBayar = now()->toDateString();
            } else {
                $kembalian = 0;
                $status = 'Belum Lunas';
            }

            $pembayaran = DB::transaction(function () use (
                $pembayaran,
                $validated,
                $nominalSpp,
                $uangDibayar,
                $kembalian,
                $status,
                $tglBayar,
                $siswa
            ) {
                $pembayaran->fill([
                    'nisn' => $validated['nisn'],
                    'id_spp' => $validated['id_spp'],
                    'nominal_bayar' => (string) $nominalSpp,
                    'jumlah_bayar' => (string) $uangDibayar,
                    'kembalian' => (string) $kembalian,
                    'status' => $status,
                    'tgl_bayar' => $tglBayar,
                ]);
                $pembayaran->save();

                CekPembayaran::updateOrCreate(
                    ['nisn' => $validated['nisn']],
                    [
                        'tgl_terakhir_bayar' => $tglBayar ?? $pembayaran->tgl_terakhir_bayar,
                        'tgl_sekarang' => now()->toDateString(),
                        'status_pembayaran' => $status,
                        'jumlah_bulan' => $pembayaran->jumlah_bulan,
                        'nama' => $siswa->nama,
                        'no_telp' => $siswa->no_telp,
                    ]
                );

                return $pembayaran;
            });

            return response()->json([
                'status' => true,
                'message' => 'Transaksi pembayaran berhasil diproses.',
                'data' => $pembayaran,
            ], 200);
        } catch (ValidationException $exception) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal.',
                'data' => $exception->errors(),
            ], 422);
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