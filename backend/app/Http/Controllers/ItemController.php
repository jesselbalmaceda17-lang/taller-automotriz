<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {
        
        if (!auth()->user()->hasPermission('items.ver')) {
            return response()->json([
                'message' => 'No tienes permiso para consultar items'
            ], 403);
        }

        return response()->json(Item::all());
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('items.crear')) {
            return response()->json([
                'message' => 'No tienes permiso para crear items'
            ], 403);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:active',
        ]);

        $item = Item::create($data);

        return response()->json($item, 201);
    }

    public function show(Item $item)
    {
        if (!auth()->user()->hasPermission('items.ver')) {
            return response()->json([
                'message' => 'No tienes permiso para consultar items'
            ], 403);
        }

        return response()->json($item);
    }


    
    public function update(Request $request, Item $item)
    {
        if (!auth()->user()->hasPermission('items.editar')) {
            return response()->json([
                'message' => 'No tienes permiso para editar items'
            ], 403);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:active',
        ]);

        $item->update($data);

        return response()->json($item);
    }

    public function destroy(Item $item)
    {
        if (!auth()->user()->hasPermission('items.eliminar')) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar items'
            ], 403);
        }

        $item->delete();

        return response()->json([
            'message' => 'Item eliminado correctamente'
        ]);
    }
}