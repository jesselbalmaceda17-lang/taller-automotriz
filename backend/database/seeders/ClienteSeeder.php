<?php

namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            'fernando cordaba',
            'María López',
            'Carlos Hernández',
        ] as $nombre) {
            Cliente::firstOrCreate(['nombre' => $nombre]);
        }
    }
}
