<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tb_spp', function (Blueprint $table) {
            $table->string('id_spp', 11)->primary();
            $table->integer('tahun')->nullable();
            $table->string('nominal', 40)->nullable();
        });

        Schema::create('tb_kelas', function (Blueprint $table) {
            $table->string('id_kelas', 11)->primary();
            $table->string('nama_kelas', 10)->nullable();
            $table->string('komp_keahlian', 50)->nullable();
        });

        Schema::create('tb_petugas', function (Blueprint $table) {
            $table->string('id_petugas', 11)->primary();
            $table->string('username', 25)->nullable();
            $table->string('password', 32)->nullable();
            $table->string('nama_petugas', 35)->nullable();
            $table->enum('level', ['admin', 'petugas', 'siswa'])->nullable();
        });

        Schema::create('tb_siswa', function (Blueprint $table) {
            $table->string('nisn', 10)->primary();
            $table->string('nis', 8)->nullable();
            $table->string('nama', 50)->nullable();
            $table->string('id_kelas', 11)->nullable();
            $table->text('alamat')->nullable();
            $table->string('no_telp', 13)->nullable();
            $table->string('id_spp', 40)->nullable();
        });

        Schema::create('tb_pembayaran', function (Blueprint $table) {
            $table->string('id_pembayaran', 11)->primary();
            $table->enum('status', ['Belum Lunas', 'Sudah Lunas'])->nullable();
            $table->string('nisn', 10)->nullable();
            $table->date('tgl_bayar')->nullable();
            $table->date('tgl_terakhir_bayar')->nullable();
            $table->date('batas_pembayaran')->nullable();
            $table->string('jumlah_bulan', 10)->nullable();
            $table->string('id_spp', 40)->nullable();
            $table->string('nominal_bayar', 100)->nullable();
            $table->string('jumlah_bayar', 40)->nullable();
            $table->string('kembalian', 100)->nullable();
        });

        Schema::create('cek_pembayaran', function (Blueprint $table) {
            $table->string('nisn', 10)->primary();
            $table->date('tgl_terakhir_bayar')->nullable();
            $table->date('tgl_sekarang')->nullable();
            $table->enum('status_pembayaran', ['Belum Lunas', 'Sudah Lunas'])->nullable();
            $table->string('jumlah_bulan', 5)->nullable();
            $table->string('nama', 50)->nullable();
            $table->string('no_telp', 13)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cek_pembayaran');
        Schema::dropIfExists('tb_pembayaran');
        Schema::dropIfExists('tb_siswa');
        Schema::dropIfExists('tb_petugas');
        Schema::dropIfExists('tb_kelas');
        Schema::dropIfExists('tb_spp');
    }
};
