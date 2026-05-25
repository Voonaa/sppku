<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model untuk tabel tb_pembayaran (transaksi pembayaran SPP).
 */
class Pembayaran extends Model
{
    /** @var string */
    protected $table = 'tb_pembayaran';

    /** @var string */
    protected $primaryKey = 'id_pembayaran';

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
        'id_pembayaran',
        'status',
        'nisn',
        'tgl_bayar',
        'tgl_terakhir_bayar',
        'batas_pembayaran',
        'jumlah_bulan',
        'id_spp',
        'nominal_bayar',
        'jumlah_bayar',
        'kembalian',
    ];

    /**
     * Relasi ke siswa yang melakukan pembayaran.
     */
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class, 'nisn', 'nisn');
    }

    /**
     * Relasi ke data tarif SPP transaksi.
     */
    public function spp(): BelongsTo
    {
        return $this->belongsTo(Spp::class, 'id_spp', 'id_spp');
    }
}
