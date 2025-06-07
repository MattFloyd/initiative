import { writable, get } from 'svelte/store';

// Settings type
export interface Settings {
  showDebugInfo: boolean;
}

// Default settings
const defaultSettings: Settings = {
  showDebugInfo: true
};

// Load settings from localStorage
const storedSettings = localStorage.getItem('settings')
  ? JSON.parse(localStorage.getItem('settings')!)
  : defaultSettings;

// Create settings store
export const settings = writable<Settings>(storedSettings);

// Subscribe to changes and save to localStorage
settings.subscribe(value => {
  localStorage.setItem('settings', JSON.stringify(value));
});
