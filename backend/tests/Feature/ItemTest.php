<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ItemTest extends TestCase
{
    use RefreshDatabase;

    public function test_items_can_be_listed(): void
    {
        $this->authenticateWithPermissions(['items.ver']);
        Item::factory()->create(['title' => 'Aceite']);

        $this->getJson('/api/items')
            ->assertOk()
            ->assertJsonFragment(['title' => 'Aceite']);
    }

    public function test_valid_item_can_be_created(): void
    {
        $this->authenticateWithPermissions(['items.crear']);

        $this->postJson('/api/items', [
            'title' => 'Filtro de aceite',
            'description' => 'Filtro para motor',
            'status' => 'active',
        ])
            ->assertCreated()
            ->assertJsonPath('title', 'Filtro de aceite');

        $this->assertDatabaseHas('items', ['title' => 'Filtro de aceite']);
    }

    public function test_invalid_item_returns_unprocessable_entity(): void
    {
        $this->authenticateWithPermissions(['items.crear']);

        $this->postJson('/api/items', [
            'description' => 'Sin título',
            'status' => 'active',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    }

    public function test_existing_item_can_be_shown(): void
    {
        $this->authenticateWithPermissions(['items.ver']);
        $item = Item::factory()->create();

        $this->getJson("/api/items/{$item->id}")
            ->assertOk()
            ->assertJsonPath('id', $item->id);
    }

    public function test_missing_item_returns_not_found(): void
    {
        $this->authenticateWithPermissions(['items.ver']);

        $this->getJson('/api/items/99999')->assertNotFound();
    }

    public function test_item_can_be_updated(): void
    {
        $this->authenticateWithPermissions(['items.editar']);
        $item = Item::factory()->create(['title' => 'Original']);

        $this->putJson("/api/items/{$item->id}", [
            'title' => 'Actualizado',
            'description' => null,
            'status' => 'active',
        ])
            ->assertOk()
            ->assertJsonPath('title', 'Actualizado');

        $this->assertDatabaseHas('items', ['id' => $item->id, 'title' => 'Actualizado']);
    }

    public function test_item_can_be_deleted(): void
    {
        $this->authenticateWithPermissions(['items.eliminar']);
        $item = Item::factory()->create();

        $this->deleteJson("/api/items/{$item->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Item eliminado correctamente');

        $this->assertDatabaseMissing('items', ['id' => $item->id]);
    }

    public function test_items_require_authentication(): void
    {
        $this->getJson('/api/items')->assertUnauthorized();
    }

    public function test_user_without_permission_cannot_create_or_change_an_item(): void
    {
        $this->authenticateWithPermissions([]);
        $item = Item::factory()->create(['title' => 'Original']);

        $this->postJson('/api/items', [
            'title' => 'No autorizado',
            'description' => null,
            'status' => 'active',
        ])->assertForbidden();

        $this->putJson("/api/items/{$item->id}", [
            'title' => 'No autorizado',
            'description' => null,
            'status' => 'active',
        ])->assertForbidden();

        $this->assertDatabaseCount('items', 1);
        $this->assertDatabaseHas('items', ['id' => $item->id, 'title' => 'Original']);
    }

    private function authenticateWithPermissions(array $permissionNames): void
    {
        $user = User::factory()->create();
        $role = Role::create(['name' => fake()->unique()->word()]);

        $permissions = collect($permissionNames)->map(
            fn (string $name) => Permission::create(['name' => $name]),
        );

        $role->permissions()->attach($permissions->pluck('id'));
        $user->roles()->attach($role);

        Sanctum::actingAs($user);
    }
}
