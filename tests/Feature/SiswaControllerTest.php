<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\Spp;
use App\Models\Siswa;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Class SiswaControllerTest
 *
 * Pengujian fungsi store pada SiswaController.
 *
 * @package Tests\Feature
 */
class SiswaControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Skenario Sukses: Menyimpan data siswa baru dengan input lengkap dan valid.
     *
     * @return void
     */
    public function test_store_siswa_berhasil(): void
    {
        // Siapkan data pendukung (Kelas & SPP) untuk integritas relasi foreign key
        Kelas::create([
            'id_kelas' => 'KLS01',
            'nama_kelas' => 'XII RPL 1',
            'komp_keahlian' => 'Rekayasa Perangkat Lunak',
        ]);

        Spp::create([
            'id_spp' => 'SPP01',
            'tahun' => 2026,
            'nominal' => '300000',
        ]);

        $dataSiswa = [
            'nisn' => '1234567890',
            'nis' => '88887777',
            'nama' => 'Ahmad Rian',
            'id_kelas' => 'KLS01',
            'alamat' => 'Jl. Kebangsaan No. 45',
            'no_telp' => '081234567890',
            'id_spp' => 'SPP01',
        ];

        $response = $this->postJson('/api/siswa', $dataSiswa);

        $response->assertStatus(201)
            ->assertJson([
                'status' => true,
                'message' => 'Data siswa berhasil ditambahkan.',
            ])
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'nisn',
                    'nis',
                    'nama',
                    'id_kelas',
                    'alamat',
                    'no_telp',
                    'id_spp',
                ],
            ]);

        $this->assertDatabaseHas('tb_siswa', [
            'nisn' => '1234567890',
            'nama' => 'Ahmad Rian',
        ]);
    }

    /**
     * Skenario Gagal: Menyimpan data siswa tanpa menyertakan NISN (Validasi Gagal).
     *
     * @return void
     */
    public function test_store_siswa_gagal_validasi_nisn_kosong(): void
    {
        $dataSiswa = [
            'nisn' => '', // NISN Kosong
            'nis' => '88887777',
            'nama' => 'Ahmad Rian',
            'id_kelas' => 'KLS01',
            'alamat' => 'Jl. Kebangsaan No. 45',
            'no_telp' => '081234567890',
            'id_spp' => 'SPP01',
        ];

        $response = $this->postJson('/api/siswa', $dataSiswa);

        $response->assertStatus(422)
            ->assertJson([
                'status' => false,
                'message' => 'Validasi gagal.',
            ])
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'nisn',
                ],
            ]);

        $this->assertDatabaseMissing('tb_siswa', [
            'nama' => 'Ahmad Rian',
        ]);
    }
}
