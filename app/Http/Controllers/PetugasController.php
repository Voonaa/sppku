<?php

namespace App\Http\Controllers;

use App\Models\Petugas;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Class PetugasController
 *
 * Controller untuk mengelola data CRUD petugas pada tabel tb_petugas.
 */
class PetugasController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            return response()->json([
                'status' => true,
                'message' => 'Data petugas berhasil diambil.',
                'data' => Petugas::all(),
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
                'id_petugas' => 'required|string|max:11|unique:tb_petugas,id_petugas',
                'username' => 'required|string|max:25|unique:tb_petugas,username',
                'password' => 'required|string|max:32',
                'nama_petugas' => 'required|string|max:35',
                'level' => 'required|in:admin,petugas',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validasi gagal.',
                    'data' => $validator->errors()
                ], 422);
            }

            $petugas = Petugas::create($validator->validated());
            return response()->json([
                'status' => true,
                'message' => 'Petugas berhasil ditambahkan.',
                'data' => $petugas
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id_petugas): JsonResponse
    {
        try {
            $petugas = Petugas::find($id_petugas);
            if (!$petugas) {
                return response()->json([
                    'status' => false,
                    'message' => 'Petugas tidak ditemukan.'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:25|unique:tb_petugas,username,' . $id_petugas . ',id_petugas',
                'password' => 'nullable|string|max:32',
                'nama_petugas' => 'required|string|max:35',
                'level' => 'required|in:admin,petugas',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validasi gagal.',
                    'data' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            if (empty($data['password'])) {
                unset($data['password']);
            }

            $petugas->update($data);
            return response()->json([
                'status' => true,
                'message' => 'Petugas berhasil diperbarui.',
                'data' => $petugas
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id_petugas): JsonResponse
    {
        try {
            $petugas = Petugas::find($id_petugas);
            if (!$petugas) {
                return response()->json([
                    'status' => false,
                    'message' => 'Petugas tidak ditemukan.'
                ], 404);
            }
            $petugas->delete();
            return response()->json([
                'status' => true,
                'message' => 'Petugas berhasil dihapus.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
