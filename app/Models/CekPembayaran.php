<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model untuk tabel cek_pembayaran (ringkasan status pembayaran siswa).
 */
class CekPembayaran extends Model
{
    /** @var string */
    protected $table = 'cek_pembayaran';

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
        'tgl_terakhir_bayar',
        'tgl_sekarang',
        'status_pembayaran',
        'jumlah_bulan',
        'nama',
        'no_telp',
    ];

    /**
     * Relasi ke data siswa.
     */
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class, 'nisn', 'nisn');
    }
}
