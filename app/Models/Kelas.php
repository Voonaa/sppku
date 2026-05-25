<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model untuk tabel tb_kelas (data kelas siswa).
 */
class Kelas extends Model
{
    /** @var string */
    protected $table = 'tb_kelas';

    /** @var string */
    protected $primaryKey = 'id_kelas';

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
        'id_kelas',
        'nama_kelas',
        'komp_keahlian',
    ];

    /**
     * Relasi ke siswa dalam kelas ini.
     */
    public function siswa(): HasMany
    {
        return $this->hasMany(Siswa::class, 'id_kelas', 'id_kelas');
    }
}
