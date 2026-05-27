<?php

namespace Tests\Feature;

use App\Models\Petugas;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Class PetugasControllerTest
 *
 * Pengujian fungsi CRUD dan validasi regex nama pada PetugasController.
 */
class PetugasControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Skenario Sukses: Menyimpan petugas baru dengan data yang valid.
     */
    public function test_store_petugas_berhasil(): void
    {
        $dataPetugas = [
            'id_petugas' => 'PTG001',
            'username' => 'petugaskeren',
            'password' => 'secret123',
            'nama_petugas' => 'Ahmad Fauzi',
            'level' => 'petugas',
        ];

        $response = $this->postJson('/api/petugas', $dataPetugas);

        $response->assertStatus(201)
            ->assertJson([
                'status' => true,
                'message' => 'Petugas berhasil ditambahkan.',
            ]);

        $this->assertDatabaseHas('tb_petugas', [
            'id_petugas' => 'PTG001',
            'nama_petugas' => 'Ahmad Fauzi',
        ]);
    }

    /**
     * Skenario Gagal: Menyimpan petugas dengan nama mengandung angka (Validasi Gagal).
     */
    public function test_store_petugas_gagal_nama_mengandung_angka(): void
    {
        $dataPetugas = [
            'id_petugas' => 'PTG002',
            'username' => 'petugasangka',
            'password' => 'secret123',
            'nama_petugas' => 'Agus123', // Ada angka
            'level' => 'petugas',
        ];

        $response = $this->postJson('/api/petugas', $dataPetugas);

        $response->assertStatus(422)
            ->assertJson([
                'status' => false,
                'message' => 'Validasi gagal.',
            ])
            ->assertJsonPath('data.nama_petugas.0', 'Format nama petugas tidak valid, hanya boleh berisi huruf dan spasi.');

        $this->assertDatabaseMissing('tb_petugas', [
            'id_petugas' => 'PTG002',
        ]);
    }

    /**
     * Skenario Gagal: Menyimpan petugas dengan nama mengandung simbol aneh (Validasi Gagal).
     */
    public function test_store_petugas_gagal_nama_mengandung_simbol(): void
    {
        $dataPetugas = [
            'id_petugas' => 'PTG003',
            'username' => 'petugassimbol',
            'password' => 'secret123',
            'nama_petugas' => 'Budi!@#', // Ada simbol khusus
            'level' => 'petugas',
        ];

        $response = $this->postJson('/api/petugas', $dataPetugas);

        $response->assertStatus(422)
            ->assertJson([
                'status' => false,
                'message' => 'Validasi gagal.',
            ])
            ->assertJsonPath('data.nama_petugas.0', 'Format nama petugas tidak valid, hanya boleh berisi huruf dan spasi.');

        $this->assertDatabaseMissing('tb_petugas', [
            'id_petugas' => 'PTG003',
        ]);
    }

    /**
     * Skenario Sukses: Mengubah data petugas dengan nama yang valid (boleh ada tanda kutip tunggal).
     */
    public function test_update_petugas_berhasil(): void
    {
        $petugas = Petugas::create([
            'id_petugas' => 'PTG004',
            'username' => 'petugasupdate',
            'password' => 'secret123',
            'nama_petugas' => 'Rian Hidayat',
            'level' => 'petugas',
        ]);

        $dataUpdate = [
            'username' => 'petugasupdate',
            'nama_petugas' => "D'Arcy", // Tanda kutip tunggal diperbolehkan
            'level' => 'petugas',
        ];

        $response = $this->putJson('/api/petugas/' . $petugas->id_petugas, $dataUpdate);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'Petugas berhasil diperbarui.',
            ]);

        $this->assertDatabaseHas('tb_petugas', [
            'id_petugas' => 'PTG004',
            'nama_petugas' => "D'Arcy",
        ]);
    }

    /**
     * Skenario Gagal: Mengubah data petugas dengan nama mengandung simbol.
     */
    public function test_update_petugas_gagal_nama_mengandung_simbol(): void
    {
        $petugas = Petugas::create([
            'id_petugas' => 'PTG005',
            'username' => 'petugassimbol2',
            'password' => 'secret123',
            'nama_petugas' => 'Rudi',
            'level' => 'petugas',
        ]);

        $dataUpdate = [
            'username' => 'petugassimbol2',
            'nama_petugas' => 'Rudi$', // Ada simbol $
            'level' => 'petugas',
        ];

        $response = $this->putJson('/api/petugas/' . $petugas->id_petugas, $dataUpdate);

        $response->assertStatus(422)
            ->assertJson([
                'status' => false,
                'message' => 'Validasi gagal.',
            ])
            ->assertJsonPath('data.nama_petugas.0', 'Format nama petugas tidak valid, hanya boleh berisi huruf dan spasi.');

        $this->assertDatabaseHas('tb_petugas', [
            'id_petugas' => 'PTG005',
            'nama_petugas' => 'Rudi', // Nama lama tetap bertahan
        ]);
    }
}
