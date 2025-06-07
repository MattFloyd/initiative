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
    border: 1px solid #ccc;
    border-radius: 6px;
    margin: 1rem;
    width: 70vw;
  }

  .initiative-list {
    margin: 1rem 0;
  }

  .initiative-item {
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .initiative-rolls {
    color: #666;
  }

  .player-initiatives {
    margin: 1rem 0;
  }

  .player-initiative {
    margin: 0.5rem 0;
    padding: 0.5rem;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  input[type="number"] {
    width: 50px;
    margin: 0 0.5rem;
  }
</style>
