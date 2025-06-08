<script lang="ts">
  import { characters, addCharacter as addChar, updateCharacter as updateChar, removeCharacter as removeChar } from './characterStore';
  import type { Character } from './characterStore';
  import AttackEditor from './AttackEditor.svelte';
  import { onMount } from 'svelte';

  let newChar: Omit<Character, 'id'> = {
    name: '',
    team: 'evil', // Default to 'evil' team for enemies/NPCs
    isPlayer: false, // Always false for enemies/NPCs
    ac: 0,
    hp: 0,
    initiativeModifier: 0,
    attacks: []
  };

  let selectedCharacterId: string | null = null;
  let isNewCharacter = false;

  function selectCharacter(id: string) {
    selectedCharacterId = id;
    isNewCharacter = false;
  }

  function createNewCharacter() {
    selectedCharacterId = null;
    isNewCharacter = true;
    newChar = {
      name: '',
      team: 'evil',
      isPlayer: false, // Always false for enemies/NPCs
      ac: 0,
      hp: 0,
      initiativeModifier: 0,
      attacks: []
    };
  }

  function cancelEdit() {
    selectedCharacterId = null;
    isNewCharacter = false;
  }

  $: isFormValid = newChar.name.trim().length > 0;

  function saveCharacter() {
    if (isNewCharacter) {
      addChar(newChar);
      isNewCharacter = false;
    } else if (selectedCharacterId) {
      // Update existing character
      Object.entries(newChar).forEach(([key, value]) => {
        updateChar(selectedCharacterId, key as keyof Character, value);
      });
    }
  }

  function deleteCharacter() {
    if (selectedCharacterId && !isNewCharacter) {
      removeChar(selectedCharacterId);
      selectedCharacterId = null;
      isNewCharacter = false;
    }
  }

  function loadCharacter(character: Character) {
    newChar = {
      name: character.name,
      team: character.team,
      isPlayer: character.isPlayer,
      ac: character.ac,
      hp: character.hp,
      initiativeModifier: character.initiativeModifier,
      attacks: [...character.attacks]
    };
  }
</script>

<div class="character-editor">
  <!-- Left Panel: Character List -->
  <div class="character-list">
    <h2>Enemies & NPCs</h2>
    <button 
      class="new-character-btn" 
      on:click={createNewCharacter}
      on:keypress={(e) => e.key === 'Enter' && createNewCharacter()}
    >
      + Add New Enemy/NPC
    </button>
    <div class="character-items">
      {#each $characters.filter(c => !c.isPlayer) as char (char.id)}
        <div 
          class="character-item {char.team} {selectedCharacterId === char.id ? 'selected' : ''}"
          on:click={() => {
            selectCharacter(char.id);
            loadCharacter(char);
          }}
          on:keypress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectCharacter(char.id);
              loadCharacter(char);
            }
          }}
          role="button"
          tabindex="0"
        >
          <div class="char-icon">
            {#if char.team === 'good'}
              <i class="fas fa-user-shield"></i>
            {:else if char.team === 'evil'}
              <i class="fas fa-skull"></i>
            {:else}
              <i class="fas fa-user"></i>
            {/if}
          </div>
          <div class="char-info">
            <div class="char-name">{char.name}</div>
            <div class="char-details">
              AC: {char.ac} | HP: {char.hp} | Init: {char.initiativeModifier >= 0 ? '+' : ''}{char.initiativeModifier}
            </div>
          </div>
        </div>
      {:else}
        <div class="empty-state">
          <i class="fas fa-users-slash"></i>
          <p>No enemies or NPCs found</p>
        </div>
      {/each}
    </div>
  </div>

  <!-- Right Panel: Character Form -->
  <div class="character-form-container">
    {#if selectedCharacterId || isNewCharacter}
      <div class="character-form">
        <h2>{isNewCharacter ? 'Create New Enemy/NPC' : 'Edit Enemy/NPC'}</h2>
        
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            type="text" 
            id="name" 
            bind:value={newChar.name} 
            placeholder="Enemy/NPC name"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="team">Team</label>
            <select id="team" bind:value={newChar.team}>
              <option value="evil">Enemy</option>
              <option value="good">Friendly NPC</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="ac">Armor Class</label>
            <input 
              id="ac" 
              type="number" 
              bind:value={newChar.ac} 
              placeholder="AC" 
              min="0"
            />
          </div>

          <div class="form-group">
            <label for="maxHp">Max HP</label>
            <input 
              id="maxHp" 
              type="number" 
              bind:value={newChar.hp} 
              placeholder="HP" 
              min="1"
            />
          </div>
        </div>

        <div class="form-group" class:hidden={newChar.isPlayer}>
          <label for="init-mod">Initiative Modifier</label>
          <input 
            type="number" 
            id="init-mod" 
            bind:value={newChar.initiativeModifier}
            placeholder="0"
          />
        </div>

        {#if !newChar.isPlayer}
          <div class="attacks-section">
            <h3>Attacks</h3>
            <AttackEditor 
              attacks={newChar.attacks}
              onAttackChange={(newAttacks) => newChar = { ...newChar, attacks: newAttacks }}
            />
          </div>
        {/if}

        <div class="form-actions">
          <button 
            class="save-btn" 
            on:click={saveCharacter} 
            disabled={!isFormValid}
          >
            {isNewCharacter ? 'Create Enemy/NPC' : 'Save Changes'}
          </button>
          <button class="cancel-btn" on:click={cancelEdit}>
            Cancel
          </button>
          {#if !isNewCharacter}
            <button class="delete-btn" on:click={deleteCharacter}>
              Delete Enemy/NPC
            </button>
          {/if}
        </div>
      </div>
    {:else}
      <div class="no-selection">
        <div class="no-selection-content">
          <i class="fas fa-users"></i>
          <h3>No Enemy/NPC Selected</h3>
          <p>Select an enemy/NPC from the list or create a new one to get started.</p>
          <button 
            on:click={createNewCharacter} 
            on:keypress={(e) => e.key === 'Enter' && createNewCharacter()}
            class="new-character-btn"
          >
            + Create New Enemy/NPC
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .character-editor {
    display: flex;
    height: calc(100vh - 150px);
    gap: 1.5rem;
    margin-top: 1rem;
  }

  /* Left Panel: Character List */
  .character-list {
    width: 300px;
    background: #1e1e1e;
    border-radius: 6px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    border: 1px solid #333;
    overflow: hidden;
  }

  .character-list h2 {
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #333;
    color: #e0e0e0;
  }

  .new-character-btn {
    background: #007acc;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s ease;
  }

  .new-character-btn:hover {
    background: #0090ff;
  }

  .character-items {
    flex: 1;
    overflow-y: auto;
    margin: 0 -0.5rem;
    padding: 0 0.5rem;
  }

  .character-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: background 0.2s ease;
    border: 1px solid #333;
  }

  .character-item:hover {
    background: #2a2a2a;
  }

  .character-item.selected {
    background: #333;
    border-color: #007acc;
  }

  .char-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
    color: #e0e0e0;
  }

  .char-info {
    flex: 1;
    min-width: 0;
  }

  .char-name {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #e0e0e0;
  }

  .char-details {
    font-size: 0.8rem;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Right Panel: Character Form */
  .character-form-container {
    flex: 1;
    background: #1e1e1e;
    border-radius: 6px;
    border: 1px solid #333;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .character-form {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
  }

  .character-form h2 {
    margin-top: 0;
    color: #e0e0e0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #333;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .form-row .form-group {
    flex: 1;
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #e0e0e0;
    font-size: 0.9rem;
  }

  input[type="text"],
  input[type="number"],
  select {
    width: 100%;
    padding: 0.5rem;
    background: #2d2d2d;
    border: 1px solid #444;
    border-radius: 4px;
    color: #e0e0e0;
    font-size: 1rem;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: #007acc;
    box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.3);
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #333;
  }

  .save-btn,
  .cancel-btn,
  .delete-btn {
    padding: 0.75rem 1.25rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .save-btn {
    background: #007acc;
    color: white;
  }

  .save-btn:hover {
    background: #0090ff;
  }

  .save-btn:disabled {
    background: #1a3e5c;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .cancel-btn {
    background: #2d2d2d;
    color: #e0e0e0;
    border: 1px solid #444;
  }

  .cancel-btn:hover {
    background: #3d3d3d;
  }

  .delete-btn {
    margin-left: auto;
    background: #5c1a1a;
    color: #ff9e9e;
  }

  .delete-btn:hover {
    background: #7d1f1f;
  }

  /* No Selection State */
  .no-selection {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    text-align: center;
    padding: 2rem;
  }

  .no-selection-content {
    max-width: 300px;
  }

  .no-selection i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .no-selection h3 {
    margin: 0 0 0.5rem 0;
    color: #e0e0e0;
  }

  .no-selection p {
    margin: 0 0 1.5rem 0;
    color: #999;
  }

  /* Attacks Section */
  .attacks-section {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #333;
  }

  .attacks-section h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #e0e0e0;
  }

  /* Team Colors */
  .good {
    border-left: 3px solid #2e7d32; /* Green border for good team */
  }

  .evil {
    border-left: 3px solid #c62828; /* Red border for evil team */
    box-shadow: 0 0 15px rgba(198, 40, 40, 0.3); /* Subtle red glow */
  }

  .neutral {
    border-left: 3px solid #ff9800; /* Orange border for neutral team */
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  ::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Removed unused .char-actions styles */
</style>