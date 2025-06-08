import { writable } from 'svelte/store';

export interface Vehicle {
  id: string;
  name: string;
  ac: number;
  maxHp: number;
  speed: number;
  notes: string;
  isPlayer: boolean;
}

function createVehicleStore() {
  const { subscribe, set, update } = writable<Vehicle[]>([]);

  // Load vehicles from localStorage
  function load() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vehicles');
      if (saved) {
        set(JSON.parse(saved));
      }
    }
  }

  // Save vehicles to localStorage
  function save(vehicles: Vehicle[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }
  }

  // Add a new vehicle
  function add(vehicle: Omit<Vehicle, 'id'>) {
    const newVehicle = {
      ...vehicle,
      id: crypto.randomUUID(),
    };
    
    update(vehicles => {
      const newVehicles = [...vehicles, newVehicle];
      save(newVehicles);
      return newVehicles;
    });
    
    return newVehicle.id;
  }

  // Update a vehicle
  function updateVehicle(id: string, updates: Partial<Vehicle>) {
    update(vehicles => {
      const index = vehicles.findIndex(v => v.id === id);
      if (index === -1) return vehicles;
      
      const updatedVehicles = [...vehicles];
      updatedVehicles[index] = { ...updatedVehicles[index], ...updates };
      save(updatedVehicles);
      return updatedVehicles;
    });
  }

  // Remove a vehicle
  function remove(id: string) {
    update(vehicles => {
      const newVehicles = vehicles.filter(v => v.id !== id);
      save(newVehicles);
      return newVehicles;
    });
  }

  // Initialize the store
  load();

  return {
    subscribe,
    add,
    update: updateVehicle,
    remove,
    load,
  };
}

export const vehicles = createVehicleStore();
