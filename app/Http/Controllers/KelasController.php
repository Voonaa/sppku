<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Class KelasController
 *
 * Controller untuk mengelola data CRUD kelas pada tabel tb_kelas.
 */
class KelasController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            return response()->json([
                'status' => true,
                'message' => 'Data kelas berhasil diambil.',
                'data' => Kelas::all(),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'id_kelas' => 'required|string|max:11|unique:tb_kelas,id_kelas',
                'nama_kelas' => 'required|string|max:10',
                'komp_keahlian' => 'nullable|string|max:50',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validasi gagal.',
                    'data' => $validator->errors()
                ], 422);
            }

            $kelas = Kelas::create($validator->validated());
            return response()->json([
                'status' => true,
                'message' => 'Kelas berhasil ditambahkan.',
                'data' => $kelas
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id_kelas): JsonResponse
    {
        try {
            $kelas = Kelas::find($id_kelas);
            if (!$kelas) {
                return response()->json([
                    'status' => false,
                    'message' => 'Kelas tidak ditemukan.'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'nama_kelas' => 'required|string|max:10',
                'komp_keahlian' => 'nullable|string|max:50',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validasi gagal.',
                    'data' => $validator->errors()
                ], 422);
            }

            $kelas->update($validator->validated());
            return response()->json([
                'status' => true,
                'message' => 'Kelas berhasil diperbarui.',
                'data' => $kelas
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id_kelas): JsonResponse
    {
        try {
            $kelas = Kelas::find($id_kelas);
            if (!$kelas) {
                return response()->json([
                    'status' => false,
                    'message' => 'Kelas tidak ditemukan.'
                ], 404);
            }
            $kelas->delete();
            return response()->json([
                'status' => true,
                'message' => 'Kelas berhasil dihapus.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
