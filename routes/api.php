<?php

use App\Http\Controllers\MasterDataController;
use App\Http\Controllers\PembayaranController;
use Illuminate\Support\Facades\Route;

Route::post('/pembayaran/transaksi', [PembayaranController::class, 'storeTransaksi']);

Route::middleware('check.level:admin')->group(function () {
    Route::get('/master-data', [MasterDataController::class, 'index']);
});
