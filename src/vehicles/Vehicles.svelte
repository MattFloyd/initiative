<script lang="ts">
  import { vehicles } from './vehicleStore';
  import type { Vehicle } from './vehicleStore';
  import { onMount } from 'svelte';

  let newVehicle: Omit<Vehicle, 'id'> = {
    name: '',
    ac: 10,
    maxHp: 30,
    speed: 30,
    notes: '',
    isPlayer: true
  };

  let selectedVehicleId: string | null = null;
  let isNewVehicle = false;

  // Filter vehicles to only show player vehicles by default
  $: playerVehicles = $vehicles.filter(v => v.isPlayer);

  function selectVehicle(id: string) {
    selectedVehicleId = id;
    isNewVehicle = false;
    const vehicle = $vehicles.find(v => v.id === id);
    if (vehicle) {
      newVehicle = { ...vehicle };
    }
  }

  function createNewVehicle() {
    selectedVehicleId = null;
    isNewVehicle = true;
    newVehicle = {
      name: '',
      ac: 10,
      maxHp: 30,
      speed: 30,
      notes: '',
      isPlayer: true
    };
  }

  function saveVehicle() {
    if (!newVehicle.name.trim()) return;
    
    if (isNewVehicle) {
      vehicles.add(newVehicle);
    } else if (selectedVehicleId) {
      vehicles.update(selectedVehicleId, newVehicle);
    }
    
    // Reset form
    selectedVehicleId = null;
    isNewVehicle = false;
  }

  function deleteVehicle(id: string) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      vehicles.remove(id);
      if (selectedVehicleId === id) {
        selectedVehicleId = null;
        isNewVehicle = false;
      }
    }
  }

  function cancelEdit() {
    selectedVehicleId = null;
    isNewVehicle = false;
  }

  // Form validation
  $: isFormValid = newVehicle.name.trim() !== '' && newVehicle.maxHp > 0;

  // Initialize with sample data if empty
  onMount(() => {
    
  });
</script>

<div class="vehicles">
  <!-- Left Panel: Vehicle List -->
  <div class="vehicle-list">
    <h2>Vehicles</h2>
    <button 
      class="new-vehicle-btn" 
      on:click={createNewVehicle}
      on:keypress={(e) => e.key === 'Enter' && createNewVehicle()}
    >
      + Add New Vehicle
    </button>
    <div class="vehicle-items">
      {#each $vehicles as vehicle (vehicle.id)}
        <div 
          class="vehicle-item {selectedVehicleId === vehicle.id ? 'selected' : ''}"
          on:click={() => selectVehicle(vehicle.id)}
          on:keypress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectVehicle(vehicle.id);
            }
          }}
          role="button"
          tabindex="0"
        >
          <div class="vehicle-icon">
              <i class="fas fa-car"></i>
          </div>
          <div class="vehicle-details">
            <h3>{vehicle.name}</h3>
            <div class="vehicle-stats">
              <span>AC: {vehicle.ac}</span>
              <span>Max HP: {vehicle.maxHp}</span>
              <span>Speed: {vehicle.speed}ft</span>
            </div>
          </div>
        </div>
      {:else}
        <div class="empty-state">
          <i class="fas fa-car-crash"></i>
          <p>No vehicles found</p>
        </div>
      {/each}
    </div>
  </div>

  <!-- Right Panel: Vehicle Form -->
  <div class="vehicle-form-container">
    {#if selectedVehicleId || isNewVehicle}
      <div class="vehicle-form">
        <h2>{isNewVehicle ? 'Create New Vehicle' : 'Edit Vehicle'}</h2>
        
        <div class="form-group">
          <label for="name">Vehicle Name</label>
          <input 
            type="text" 
            id="name" 
            bind:value={newVehicle.name} 
            placeholder="Enter vehicle name"
          />
        </div>

        <div class="form-row">

          <div class="form-group">
            <label for="ac">Armor Class (AC)</label>
            <input 
              type="number" 
              id="ac" 
              bind:value={newVehicle.ac} 
              min="0"
              step="1"
            />
          </div>
        </div>

        <div class="form-row">

          <div class="form-group">
            <label for="maxHp">Max HP</label>
            <input 
              type="number" 
              id="maxHp" 
              bind:value={newVehicle.maxHp} 
              min="1"
              step="1"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="speed">Speed (ft)</label>
          <input 
            type="number" 
            id="speed" 
            bind:value={newVehicle.speed} 
            min="0"
            step="5"
          />
        </div>

        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea 
            id="notes" 
            bind:value={newVehicle.notes} 
            placeholder="Any additional notes about the vehicle"
            rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button 
            class="save-btn" 
            on:click={saveVehicle} 
            disabled={!isFormValid}
          >
            {isNewVehicle ? 'Create Vehicle' : 'Save Changes'}
          </button>
          <button class="cancel-btn" on:click={cancelEdit}>
            Cancel
          </button>
          {#if !isNewVehicle && selectedVehicleId}
            <button class="delete-btn" on:click={() => deleteVehicle(selectedVehicleId!)}>
              Delete Vehicle
            </button>
          {/if}
        </div>
      </div>
    {:else}
      <div class="no-selection">
        <div class="no-selection-content">
          <i class="fas fa-truck-monster"></i>
          <h3>No Vehicle Selected</h3>
          <p>Select a vehicle from the list or create a new one to get started.</p>
          <button 
            on:click={createNewVehicle} 
            on:keypress={(e) => e.key === 'Enter' && createNewVehicle()}
            class="new-vehicle-btn"
          >
            + Create New Vehicle
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .vehicles {
    display: flex;
    height: calc(100vh - 60px);
    overflow: hidden;
    color: #e0e0e0;
  }

  /* Vehicle List Styles */
  .vehicle-list {
    width: 300px;
    border-right: 1px solid #444;
    padding: 1rem;
    overflow-y: auto;
    background-color: #1a1a1a;
  }

  .vehicle-list h2 {
    margin: 0 0 1rem 0;
    color: #fff;
  }

  .new-vehicle-btn {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    background-color: #2c7be5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
  }

  .new-vehicle-btn:hover {
    background-color: #1a68d1;
  }

  .vehicle-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .vehicle-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background-color: #2a2a2a;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-left: 4px solid #2c7be5;
  }

  .vehicle-item:hover {
    background-color: #333;
  }

  .vehicle-item.selected {
    background-color: #333;
    border-left-color: #4caf50;
  }

  .vehicle-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #2c7be5;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    color: white;
  }

  .vehicle-details {
    flex: 1;
    overflow: hidden;
  }

  .vehicle-details h3 {
    margin: 0 0 0.25rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
  }

  .vehicle-stats {
    display: flex;
    gap: 0.75rem;
    font-size: 0.85rem;
    color: #aaa;
  }

  /* Vehicle Form Styles */
  .vehicle-form-container {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    background-color: #1e1e1e;
  }

  .vehicle-form {
    max-width: 600px;
    margin: 0 auto;
    background-color: #2a2a2a;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .vehicle-form h2 {
    margin-top: 0;
    color: #fff;
    border-bottom: 1px solid #444;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .form-row .form-group {
    flex: 1;
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #ddd;
    font-weight: 500;
  }

  input[type="text"],
  input[type="number"],
  select,
  textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #444;
    border-radius: 4px;
    background-color: #333;
    color: #fff;
    font-size: 1rem;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  button {
    padding: 0.5rem 1rem;
    background: #007acc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background: #0062a3;
  }
  
  .vehicle-list {
    margin-top: 1rem;
  }
</style>
