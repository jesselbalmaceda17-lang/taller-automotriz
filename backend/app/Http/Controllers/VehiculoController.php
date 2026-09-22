<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasPermission('vehiculos.ver')) {
            return response()->json([
                'message' => 'No tienes permiso para consultar vehículos'
            ], 403);
        }

        return response()->json(Vehiculo::with('cliente')->get());
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('vehiculos.crear')) {
            return response()->json([
                'message' => 'No tienes permiso para crear vehículos'
            ], 403);
        }

        $datos = $request->validate([
            'placa' => 'required|string|max:20',
            'marca' => 'required|string|max:100',
            'modelo' => 'required|string|max:100',
            'anio' => 'required|integer|min:1900|max:2100',
            'cliente_id' => 'required|exists:clientes,id',
            'estado' => 'required|string|max:30',
        ]);

        $cliente = Cliente::findOrFail($datos['cliente_id']);
        $datos['cliente'] = $cliente->nombre;
        $vehiculo = Vehiculo::create($datos);

        return response()->json($vehiculo->load('cliente'), 201);
    }

    public function show(Vehiculo $vehiculo)
    {
        if (!auth()->user()->hasPermission('vehiculos.ver')) {
            return response()->json([
                'message' => 'No tienes permiso para consultar vehículos'
            ], 403);
        }

        return response()->json($vehiculo->load('cliente'));
    }

    public function update(Request $request, Vehiculo $vehiculo)
    {
        if (!auth()->user()->hasPermission('vehiculos.editar')) {
            return response()->json([
                'message' => 'No tienes permiso para editar vehículos'
            ], 403);
        }

        $datos = $request->validate([
            'placa' => 'required|string|max:20',
            'marca' => 'required|string|max:100',
            'modelo' => 'required|string|max:100',
            'anio' => 'required|integer|min:1900|max:2100',
            'cliente_id' => 'required|exists:clientes,id',
            'estado' => 'required|string|max:30',
        ]);

        $cliente = Cliente::findOrFail($datos['cliente_id']);
        $datos['cliente'] = $cliente->nombre;
        $vehiculo->update($datos);

        return response()->json($vehiculo->load('cliente'));
    }

    public function destroy(Vehiculo $vehiculo)
    {
        if (!auth()->user()->hasPermission('vehiculos.eliminar')) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar vehículos'
            ], 403);
        }

        $vehiculo->delete();

        return response()->json([
            'message' => 'Vehículo eliminado correctamente'
        ]);
    }
}