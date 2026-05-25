<?php

namespace Tests\Feature;

use App\Models\Pembayaran;
use App\Models\Siswa;
use App\Models\Spp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pengujian fungsi storeTransaksi pada PembayaranController.
 */
class PembayaranTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Skenario gagal: validasi gagal ketika nominal_bayar kosong.
     */
    public function test_store_transaksi_gagal_validasi_nominal_kosong(): void
    {
        $response = $this->postJson('/api/pembayaran/transaksi', [
            'id_pembayaran' => 'PAY001',
            'nisn' => '0011223344',
            'id_spp' => 'SPP01',
            'nominal_bayar' => '',
            'jumlah_bayar' => 300000,
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'status' => false,
                'message' => 'Validasi gagal.',
            ])
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'nominal_bayar',
                ],
            ]);
    }

    /**
     * Skenario berhasil: transaksi pembayaran diproses dan status menjadi lunas.
     */
    public function test_store_transaksi_berhasil(): void
    {
        Spp::create([
            'id_spp' => 'SPP02',
            'tahun' => 2024,
            'nominal' => '350000',
        ]);

        Siswa::create([
            'nisn' => '0011223345',
            'nis' => '1002',
            'nama' => 'Bunga Citra',
            'id_kelas' => 'KLS02',
            'id_spp' => 'SPP02',
            'no_telp' => '081234567891',
        ]);

        Pembayaran::create([
            'id_pembayaran' => 'PAY002',
            'status' => 'Belum Lunas',
            'nisn' => '0011223345',
            'id_spp' => 'SPP02',
            'jumlah_bayar' => '0',
            'kembalian' => '0',
        ]);

        $response = $this->postJson('/api/pembayaran/transaksi', [
            'id_pembayaran' => 'PAY002',
            'nisn' => '0011223345',
            'id_spp' => 'SPP02',
            'nominal_bayar' => 350000,
            'jumlah_bayar' => 400000,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'Transaksi pembayaran berhasil diproses.',
            ])
            ->assertJsonPath('data.status', 'Sudah Lunas')
            ->assertJsonPath('data.kembalian', '50000');

        $this->assertDatabaseHas('tb_pembayaran', [
            'id_pembayaran' => 'PAY002',
            'status' => 'Sudah Lunas',
            'kembalian' => '50000',
        ]);

        $this->assertDatabaseHas('cek_pembayaran', [
            'nisn' => '0011223345',
            'status_pembayaran' => 'Sudah Lunas',
        ]);
    }

    /**
     * Skenario berhasil: transaksi pembayaran baru (dinamis non-eksisten) berhasil diproses dan status menjadi lunas.
     */
    public function test_store_transaksi_baru_berhasil_dinamis(): void
    {
        Spp::create([
            'id_spp' => 'SPP03',
            'tahun' => 2024,
            'nominal' => '300000',
        ]);

        Siswa::create([
            'nisn' => '0011223346',
            'nis' => '1003',
            'nama' => 'Chandra Wijaya',
            'id_kelas' => 'KLS02',
            'id_spp' => 'SPP03',
            'no_telp' => '081234567892',
        ]);

        $response = $this->postJson('/api/pembayaran/transaksi', [
            'id_pembayaran' => 'PAY-DYNAMIC-999',
            'nisn' => '0011223346',
            'id_spp' => 'SPP03',
            'nominal_bayar' => 300000,
            'jumlah_bayar' => 300000,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'Transaksi pembayaran berhasil diproses.',
            ])
            ->assertJsonPath('data.status', 'Sudah Lunas')
            ->assertJsonPath('data.kembalian', '0');

        $this->assertDatabaseHas('tb_pembayaran', [
            'id_pembayaran' => 'PAY-DYNAMIC-999',
            'status' => 'Sudah Lunas',
            'kembalian' => '0',
        ]);

        $this->assertDatabaseHas('cek_pembayaran', [
            'nisn' => '0011223346',
            'status_pembayaran' => 'Sudah Lunas',
        ]);
    }
}
