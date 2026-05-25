<?php

namespace App\Http\Controllers;

use App\Models\Spp;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Class SppController
 *
 * Controller untuk mengelola data CRUD SPP pada tabel tb_spp.
 */
class SppController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            return response()->json([
                'status' => true,
                'message' => 'Data SPP berhasil diambil.',
                'data' => Spp::all(),
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
                'id_spp' => 'required|string|max:11|unique:tb_spp,id_spp',
                'tahun' => 'required|integer',
                'nominal' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validasi gagal.',
                    'data' => $validator->errors()
                ], 422);
            }

            $spp = Spp::create($validator->validated());
            return response()->json([
                'status' => true,
                'message' => 'SPP berhasil ditambahkan.',
                'data' => $spp
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id_spp): JsonResponse
    {
        try {
            $spp = Spp::find($id_spp);
            if (!$spp) {
                return response()->json([
                    'status' => false,
                    'message' => 'Data SPP tidak ditemukan.'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'tahun' => 'required|integer',
                'nominal' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validasi gagal.',
                    'data' => $validator->errors()
                ], 422);
            }

            $spp->update($validator->validated());
            return response()->json([
                'status' => true,
                'message' => 'SPP berhasil diperbarui.',
                'data' => $spp
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id_spp): JsonResponse
    {
        try {
            $spp = Spp::find($id_spp);
            if (!$spp) {
                return response()->json([
                    'status' => false,
                    'message' => 'Data SPP tidak ditemukan.'
                ], 404);
            }
            $spp->delete();
            return response()->json([
                'status' => true,
                'message' => 'SPP berhasil dihapus.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
