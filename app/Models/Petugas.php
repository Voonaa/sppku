<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model untuk tabel tb_petugas (akun admin, petugas, dan siswa).
 */
class Petugas extends Model
{
    /** @var string */
    protected $table = 'tb_petugas';

    /** @var string */
    protected $primaryKey = 'id_petugas';

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
        'id_petugas',
        'username',
        'password',
        'nama_petugas',
        'level',
    ];
}
