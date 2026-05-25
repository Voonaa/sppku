<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MasterDataController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\SppController;
use App\Http\Controllers\PetugasController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::post('/pembayaran/transaksi', [PembayaranController::class, 'storeTransaksi']);

Route::get('/dashboard', [DashboardController::class, 'index']);

Route::apiResource('siswa', SiswaController::class)->parameters([
    'siswa' => 'nisn',
]);

Route::apiResource('kelas', KelasController::class)->parameters([
    'kelas' => 'id_kelas',
]);

Route::apiResource('spp', SppController::class)->parameters([
    'spp' => 'id_spp',
]);

Route::apiResource('petugas', PetugasController::class)->parameters([
    'petugas' => 'id_petugas',
]);

Route::middleware('check.level:admin')->group(function () {
    Route::get('/master-data', [MasterDataController::class, 'index']);
});
