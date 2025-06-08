<script lang="ts">
  import { encounter } from './encounterStore';
  import { characters } from '../characters/characterStore';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import NewEncounter from './NewEncounter.svelte';
  import ActiveEncounter from './ActiveEncounter.svelte';

  let playerInitiatives: Record<string, { roll: number; modifier: number }> = {};
  let fightMode = false;
  $: activeEncounter = $encounter;
  $: $characters;

  function startFight() {
    // Add all player initiatives to the encounter
    Object.entries(playerInitiatives).forEach(([id, { roll }]) => {
      encounter.addPlayerInitiative(id, roll);
    });
    fightMode = true;
  }
  onMount(() => {
    // Reset player initiatives when characters change
    playerInitiatives = {};
  });

  function handlePlayerInitiative(characterId: string, roll: number) {
    encounter.addPlayerInitiative(characterId, roll);
  }

  function endCurrentEncounter() {
    encounter.endEncounter();
  }

  function getCharacterName(id: string) {
    const chars = get(characters);
    return chars.find(char => char.id === id)?.name || 'Unknown';
  }

  function areAllInitiativesEntered(): boolean {
    const playerCharacters = $characters.filter(char => char.isPlayer);
    return playerCharacters.every(char => 
      playerInitiatives[char.id] && !isNaN(playerInitiatives[char.id].roll)
    );
  }
</script>

{#if activeEncounter}
  <div class="encounter-container">
    <h2>Encounter: {activeEncounter.name}</h2>

    {#if !fightMode}
      <div class="initiative-list">
        {#each activeEncounter.initiative.sort((a, b) => b.initiative - a.initiative) as init}
          <div class="initiative-item">
            <strong>{getCharacterName(init.characterId)}</strong>
            <span class="initiative-rolls">
              Roll: {init.initiative + (init.modifier ?? 0)}
            </span>
          </div>
        {/each}
      </div>

      <div class="player-initiatives">
        {#each $characters.filter(char => char.isPlayer) as char}
          <div class="player-initiative">
            <label for="{`roll-${char.id}`}">Roll for {char.name}</label>
            <input
              type="number"
              min="1"
              max="20"
              value={playerInitiatives[char.id]?.roll}
              on:change={(e: Event) => {
                const target = e.target as HTMLInputElement;
                handlePlayerInitiative(char.id, parseInt(target.value));
              }}
              on:input={(e: Event) => {
                const target = e.target as HTMLInputElement;
                playerInitiatives[char.id] = { ...playerInitiatives[char.id], roll: parseInt(target.value) };
              }}
            />
          </div>
        {/each}
      </div>

      <button 
        on:click={startFight}
        disabled={!areAllInitiativesEntered()}
      >
        Fight!
      </button>
    {/if}

    {#if fightMode}
      <ActiveEncounter encounter={activeEncounter} characters={$characters} />
    {/if}

    <button on:click={endCurrentEncounter}>End Encounter</button>
  </div>
{:else}
  <NewEncounter />
{/if}

<style>
  .encounter-container {
    padding: 1rem;
    border: 1px solid #444;
    border-radius: 6px;
    margin: 1rem;
    width: 70vw;
    background: #1e1e1e;
  }

  .initiative-list {
    margin: 1rem 0;
  }

  .initiative-item {
    padding: 0.8rem;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2d2d2d;
    margin-bottom: 0.25rem;
    border-radius: 4px;
  }

  .initiative-rolls {
    color: #999;
  }

  .player-initiatives {
    margin: 1rem 0;
  }

  .player-initiative {
    margin: 0.5rem 0;
    padding: 1rem;
    border: 1px solid #333;
    border-radius: 4px;
    background: #2d2d2d;
  }

  input[type="number"] {
    width: 60px;
    margin: 0 0.5rem;
    background: #1e1e1e;
    border: 1px solid #444;
    color: #e0e0e0;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
  
  button {
    background: #333;
    border: 1px solid #444;
    color: #e0e0e0;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: all 0.2s ease;
  }
  
  button:hover {
    background: #444;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
