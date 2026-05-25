<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Model untuk tabel tb_siswa (data siswa dan referensi kelas/SPP).
 */
class Siswa extends Model
{
    /** @var string */
    protected $table = 'tb_siswa';

    /** @var string */
    protected $primaryKey = 'nisn';

    /** @var bool */
    public $incrementing = false;

    /** @var string */
    protected $keyType = 'string';

    /** @var bool */
    public $timestamps = false;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'nisn',
        'nis',
        'nama',
        'id_kelas',
        'alamat',
        'no_telp',
        'id_spp',
    ];

    /**
     * Relasi ke kelas siswa.
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }

    /**
     * Relasi ke tarif SPP siswa.
     */
    public function spp(): BelongsTo
    {
        return $this->belongsTo(Spp::class, 'id_spp', 'id_spp');
    }

    /**
     * Relasi ke daftar pembayaran siswa.
     */
    public function pembayaran(): HasMany
    {
        return $this->hasMany(Pembayaran::class, 'nisn', 'nisn');
    }

    /**
     * Relasi ke informasi cek pembayaran siswa.
     */
    public function cekPembayaran(): HasOne
    {
        return $this->hasOne(CekPembayaran::class, 'nisn', 'nisn');
    }
}
