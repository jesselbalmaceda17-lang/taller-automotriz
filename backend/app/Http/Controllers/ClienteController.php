<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\JsonResponse;

class ClienteController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Cliente::query()->orderBy('nombre')->get(['id', 'nombre'])
        );
    }
}
