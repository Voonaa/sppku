<?php

namespace App\Http\Middleware;

use App\Models\Petugas;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware pembatasan hak akses berdasarkan level petugas.
 */
class CheckLevelMiddleware
{
    /**
     * Memvalidasi level pengguna dari header X-Id-Petugas terhadap level yang diizinkan.
     *
     * @param  string  ...$levels  Level yang diperbolehkan (contoh: admin)
     */
    public function handle(Request $request, Closure $next, string ...$levels): Response|JsonResponse
    {
        $petugas = Petugas::find($request->header('X-Id-Petugas'));

        if (! $petugas || ! in_array($petugas->level, $levels, true)) {
            return response()->json([
                'status' => false,
                'message' => 'Akses Ditolak',
                'data' => null,
            ], 403);
        }

        $request->attributes->set('petugas', $petugas);

        return $next($request);
    }
}
