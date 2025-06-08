<script lang="ts">
  import { characters } from './characters/characterStore';
  import CharacterEditor from './characters/CharacterEditor.svelte';
  import PlayerCharacters from './characters/PlayerCharacters.svelte';
  import Encounter from './encounters/Encounter.svelte';
  import { settings } from './settings/settingsStore';
  import Settings from './settings/Settings.svelte';
  import { encounter } from './encounters/encounterStore';
  import Vehicles from './vehicles/Vehicles.svelte';
  import { vehicles } from './vehicles/vehicleStore';
  let currentView = 'players';
  let userNavigated = false;

  // Automatically navigate to character creation if no characters exist
  // Only do this if user hasn't manually navigated
  $: if ($characters.length === 0 && !userNavigated) {
    currentView = 'edit';
  }

  // Function to handle navigation that prevents automatic navigation
  function navigateTo(view: string) {
    currentView = view;
    userNavigated = true;
  }
</script>

<header>
  <h1>Roll Call</h1>
  <nav>
    <button class:active={currentView === 'players'} on:click={() => navigateTo('players')}>Player Characters</button>
    <button class:active={currentView === 'edit'} on:click={() => navigateTo('edit')}>Enemies / NPCs</button>
    <button class:active={currentView === 'vehicles'} on:click={() => navigateTo('vehicles')}>Vehicles</button>
    <button class:active={currentView === 'initiative'} on:click={() => navigateTo('initiative')}>Encounters</button>
    <button class:active={currentView === 'settings'} on:click={() => navigateTo('settings')}>Settings</button>
  </nav>
</header>

<main>
  {#if currentView === 'players'}
    <PlayerCharacters />
  {:else if currentView === 'edit'}
    <CharacterEditor />
  {:else if currentView === 'initiative'}
    <Encounter />
  {:else if currentView === 'vehicles'}
    <Vehicles />
  {:else if currentView === 'settings'}
    <Settings />
  {/if}
</main>

<div id="debug-section">
  {#if $settings.showDebugInfo}
    <div class="debug-info">
      {#if currentView === 'edit'}
        <h4>Characters Store</h4>
        <pre>{JSON.stringify($characters, null, 2)}</pre>
      {:else if currentView === 'initiative'}
        <h4>Encounter Store</h4>
        <pre>{JSON.stringify($encounter, null, 2)}</pre>
        <h4>Active Characters</h4>
        <pre>{JSON.stringify($characters.filter(char => 
          $encounter?.initiative?.some(init => init.characterId === char.id)
        ), null, 2)}</pre>
      {:else if currentView === 'vehicles'}
        <h4>Vehicles Store</h4>
        <pre>{JSON.stringify($vehicles, null, 2)}</pre>
      {:else if currentView === 'settings'}
        <h4>Settings Store</h4>
        <pre>{JSON.stringify($settings, null, 2)}</pre>
      {/if}
    </div>
  {/if}
</div>


<style>
  :global(body) {
    background-color: #1a1a1a;
    color: #e0e0e0;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1e1e1e;
    padding: 1rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    border-bottom: 1px solid #333;
  }

  main {
    padding: 1.5rem;
    margin-bottom: 200px; /* Add margin to account for debug section */
    width: 100%;
    margin-top: 60px; /* Add margin to account for fixed header */
  }

  header h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  main {
    padding: 1.5rem;
    margin-bottom: 200px; /* Add margin to account for debug section */
    width: 100%;
    padding-top: 60px; /* Add padding to account for sticky header */
  }

  #debug-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: #1e1e1e;
    border-top: 1px solid #333;
    font-family: monospace;
    font-size: 0.8rem;
    overflow-y: auto;
    max-height: 200px;
    color: #e0e0e0;
  }
  
  .debug-info {
    background: #2d2d2d;
    padding: 0.5rem;
    border-radius: 4px;
  }

  nav button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    background: #333;
    border: 1px solid #444;
    color: #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  nav button:hover {
    background: #444;
  }

  nav button.active {
    background: #007acc;
    border-color: #0090ff;
  }

  main {
    padding: 1.5rem;
  }
</style>