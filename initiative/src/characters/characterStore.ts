// src/stores/characterStore.ts
import { writable, get } from 'svelte/store';
import { nanoid } from 'nanoid';

// Character and Attack types
export type Attack = {
  name: string;
  toHit: number;
  damage: string; // e.g. "1d6+3"
};

export interface Character {
  id: string;
  name: string;
  team: 'good' | 'evil';
  isPlayer: boolean;
  ac: number;
  hp: number;
  initiativeModifier: number;
  attacks: {
    name: string;
    bonus: number;
    damage: string;
  }[];
}

// Load characters from localStorage on initialization
const storedChars = localStorage.getItem('characters')
  ? JSON.parse(localStorage.getItem('characters')!)
  : [];

export const characters = writable<Character[]>(storedChars);

// Subscribe to changes and persist to localStorage
characters.subscribe(chars => {
  localStorage.setItem('characters', JSON.stringify(chars));
});

export function getCharacterName(id: string) {
  const chars = get(characters);
  return chars.find(char => char.id === id)?.name || 'Unknown';
}

export function addCharacter(character: Omit<Character, 'id'>) {
  const chars = get(characters);
  const newChar = { ...character, id: Date.now().toString() };
  characters.set([...chars, newChar]);
}

export function updateCharacter(id: string, field: keyof Character, value: any) {
  const chars = get(characters);
  const updatedChars = chars.map(char =>
    char.id === id ? { ...char, [field]: value } : char
  );
  characters.set(updatedChars);
}

export function removeCharacter(id: string) {
  const chars = get(characters);
  const updatedChars = chars.filter(char => char.id !== id);
  characters.set(updatedChars);
}

export function updateCharacterObj(id: string, updates: Partial<Character>) {
  const chars = get(characters);
  const updatedChars = chars.map(char =>
    char.id === id ? { ...char, ...updates } : char
  );
  characters.set(updatedChars);
}

export function reset() {
  characters.set([]);
}