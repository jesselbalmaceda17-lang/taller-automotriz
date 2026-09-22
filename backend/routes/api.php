<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClienteController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/clientes', [ClienteController::class, 'index']);

    Route::apiResource('vehiculos', VehiculoController::class);
    Route::apiResource('items', ItemController::class);
});