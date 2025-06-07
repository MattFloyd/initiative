<script lang="ts">
  import { characters } from './characters/characterStore';
  import CharacterEditor from './characters/CharacterEditor.svelte';
  import Encounter from './encounters/Encounter.svelte';
  import { settings } from './settings/settingsStore';
  import Settings from './settings/Settings.svelte';
  import { encounter } from './encounters/encounterStore';
  let currentView = 'initiative';
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

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2d2d2d;
    padding: 1rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    border-bottom: 1px solid #ddd;
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
    border-top: 1px solid #ddd;
    font-family: monospace;
    font-size: 0.8rem;
    overflow-y: auto;
    max-height: 200px;
  }

  nav button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    background: #444;
    border: none;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }

  nav button.active {
    background: #007acc;
  }

  main {
    padding: 1.5rem;
  }
</style>

<header>
  <h1>Roll Call</h1>
  <nav>
    <button class:active={currentView === 'edit'} on:click={() => navigateTo('edit')}>Edit Characters</button>
    <button class:active={currentView === 'initiative'} on:click={() => navigateTo('initiative')}>Initiative</button>
    <button class:active={currentView === 'settings'} on:click={() => navigateTo('settings')}>Settings</button>
  </nav>
</header>

<main>
  {#if currentView === 'edit'}
    <CharacterEditor />
  {:else if currentView === 'initiative'}
    <Encounter />
  {:else if currentView === 'settings'}
    <Settings />
  {/if}
</main>

<div id="debug-section">
  {#if $settings.showDebugInfo}
    <div class="debug-info">
      <pre>{JSON.stringify($characters, null, 2)}</pre>
      <pre>{JSON.stringify($encounter, null, 2)}</pre>
    </div>
  {/if}
</div>