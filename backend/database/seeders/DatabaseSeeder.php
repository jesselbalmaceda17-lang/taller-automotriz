<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(ClienteSeeder::class);
        $this->seedItemPermissions();

        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }

    private function seedItemPermissions(): void
    {
        $permissions = [
            'items.ver' => 'Consultar items',
            'items.crear' => 'Crear items',
            'items.editar' => 'Editar items',
            'items.eliminar' => 'Eliminar items',
        ];

        $permissionModels = [];

        foreach ($permissions as $name => $description) {
            $permissionModels[$name] = Permission::updateOrCreate(
                ['name' => $name],
                ['description' => $description],
            );
        }

        $rolePermissions = [
            'Administrador' => array_keys($permissions),
            'Editor' => ['items.ver', 'items.crear', 'items.editar'],
            'Consulta' => ['items.ver'],
        ];

        foreach ($rolePermissions as $roleName => $permissionNames) {
            $role = Role::where('name', $roleName)->first();

            if (!$role) {
                continue;
            }

            $existingPermissionIds = $role->permissions()
                ->pluck('permissions.id')
                ->all();
            $itemPermissionIds = collect($permissionNames)
                ->map(fn (string $name) => $permissionModels[$name]->id)
                ->all();

            $role->permissions()->syncWithoutDetaching(
                array_unique([...$existingPermissionIds, ...$itemPermissionIds]),
            );
        }
    }
}
