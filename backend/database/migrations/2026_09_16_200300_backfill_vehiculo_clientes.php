<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('vehiculos')
            ->select(['id', 'cliente'])
            ->whereNotNull('cliente')
            ->where('cliente', '!=', '')
            ->orderBy('id')
            ->each(function (object $vehiculo): void {
                $clienteId = DB::table('clientes')
                    ->where('nombre', $vehiculo->cliente)
                    ->value('id');

                if (!$clienteId) {
                    $clienteId = DB::table('clientes')->insertGetId([
                        'nombre' => $vehiculo->cliente,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                DB::table('vehiculos')
                    ->where('id', $vehiculo->id)
                    ->update(['cliente_id' => $clienteId]);
            });
    }

    public function down(): void
    {
        DB::table('vehiculos')->update(['cliente_id' => null]);
    }
};
