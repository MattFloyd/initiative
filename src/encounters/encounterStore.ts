import { writable } from 'svelte/store';
import { characters } from '../characters/characterStore';
import { get } from 'svelte/store';

export type Initiative = {
  characterId: string;
  initiative: number;
  modifier: number;
};

export interface Encounter {
  id: string;
  name: string;
  active: boolean;
  initiative: Initiative[];
};

function createEncounterStore() {
  const { subscribe, update, set } = writable<Encounter | null>(null);

  const rollInitiative = (character: { id: string; isPlayer: boolean; initiativeModifier: number }) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    return {
      characterId: character.id,
      initiative: roll,
      modifier: character.initiativeModifier
    };
  };

  const startEncounter = async (name: string) => {
    const chars = get(characters);
    const initiative: Initiative[] = [];

    // Roll initiative for NPCs
    chars.forEach(char => {
      if (!char.isPlayer) {
        initiative.push(rollInitiative(char));
      }
    });

    const newEncounter: Encounter = {
      id: crypto.randomUUID(),
      name,
      active: true,
      initiative
    };

    set(newEncounter);
  };

  const addPlayerInitiative = (id: string, roll: number) => {
    update((encounter) => {
      if (!encounter) return null;
      const character = get(characters).find(c => c.id === id);
      const existing = encounter.initiative.find(i => i.characterId === id);
      if (existing) {
        existing.initiative = roll;
        existing.modifier = character?.initiativeModifier || 0;
      } else {
        encounter.initiative.push({
          characterId: id,
          initiative: roll,
          modifier: character?.initiativeModifier || 0
        });
      }
      return encounter;
    });
  };

  const endEncounter = () => {
    set(null);
  };

  return {
    subscribe,
    startEncounter,
    addPlayerInitiative,
    endEncounter
  };
}

export const encounter = createEncounterStore();
