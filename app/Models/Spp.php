<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model untuk tabel tb_spp (data nominal SPP per tahun).
 */
class Spp extends Model
{
    /** @var string */
    protected $table = 'tb_spp';

    /** @var string */
    protected $primaryKey = 'id_spp';

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
        'id_spp',
        'tahun',
        'nominal',
    ];

    /**
     * Relasi ke data siswa yang menggunakan SPP ini.
     */
    public function siswa(): HasMany
    {
        return $this->hasMany(Siswa::class, 'id_spp', 'id_spp');
    }

    /**
     * Relasi ke riwayat pembayaran SPP.
     */
    public function pembayaran(): HasMany
    {
        return $this->hasMany(Pembayaran::class, 'id_spp', 'id_spp');
    }
}
