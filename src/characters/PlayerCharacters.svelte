<script lang="ts">
  import { characters } from '../characters/characterStore';
  import type { Character } from '../characters/characterStore';

  let newPlayer: Omit<Character, 'id'> = {
    name: '',
    team: 'good', // Player characters are always on the good team
    isPlayer: true, // Always true for player characters
    ac: 0,
    hp: 0,
    initiativeModifier: 0,
    attacks: []
  };

  let selectedPlayerId: string | null = null;
  let isNewPlayer = false;
  
  // Filter characters to only show player characters
  $: playerCharacters = $characters.filter(char => char.isPlayer);

  function selectPlayer(id: string) {
    selectedPlayerId = id;
    isNewPlayer = false;
    const player = $characters.find(c => c.id === id);
    if (player) {
      newPlayer = { ...player };
    }
  }

  function createNewPlayer() {
    selectedPlayerId = null;
    isNewPlayer = true;
    newPlayer = {
      name: '',
      team: 'good',
      isPlayer: true,
      ac: 0,
      hp: 0,
      initiativeModifier: 0,
      attacks: []
    };
  }

  function savePlayer() {
    if (!newPlayer.name.trim()) return;
    
    if (isNewPlayer) {
      $characters = [...$characters, { ...newPlayer, id: crypto.randomUUID() }];
    } else if (selectedPlayerId) {
      $characters = $characters.map(char => 
        char.id === selectedPlayerId ? { ...newPlayer, id: selectedPlayerId } : char
      );
    }
    
    // Reset form
    selectedPlayerId = null;
    isNewPlayer = false;
  }

  function deletePlayer(id: string) {
    if (confirm('Are you sure you want to delete this player?')) {
      $characters = $characters.filter(char => char.id !== id);
      if (selectedPlayerId === id) {
        selectedPlayerId = null;
        isNewPlayer = false;
      }
    }
  }

  function cancelEdit() {
    selectedPlayerId = null;
    isNewPlayer = false;
  }

  // Form validation
  $: isFormValid = newPlayer.name.trim() !== '';
</script>

<div class="player-characters">
  <!-- Left Panel: Player List -->
  <div class="player-list">
    <h2>Player Characters</h2>
    <button 
      class="new-player-btn" 
      on:click={createNewPlayer}
      on:keypress={(e) => e.key === 'Enter' && createNewPlayer()}
    >
      + Add New Player
    </button>
    <div class="player-items">
      {#each playerCharacters as player (player.id)}
        <div 
          class="player-item {selectedPlayerId === player.id ? 'selected' : ''}"
          on:click={() => selectPlayer(player.id)}
          on:keypress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectPlayer(player.id);
            }
          }}
          role="button"
          tabindex="0"
        >
          <div class="player-icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="player-details">
            <h3>{player.name}</h3>
            <div class="player-stats">
              <span>AC: {player.ac}</span>
              <span>HP: {player.hp}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Right Panel: Player Form -->
  <div class="player-form-container">
    {#if selectedPlayerId || isNewPlayer}
      <div class="player-form">
        <h2>{isNewPlayer ? 'Create New Player' : 'Edit Player'}</h2>
        
        <div class="form-group">
          <label for="name">Character Name</label>
          <input 
            type="text" 
            id="name" 
            bind:value={newPlayer.name} 
            placeholder="Player character name"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="ac">Armor Class (AC)</label>
            <input 
              type="number" 
              id="ac" 
              bind:value={newPlayer.ac} 
              min="0"
              step="1"
            />
          </div>

          <div class="form-group">
            <label for="hp">Max Hit Points (HP)</label>
            <input 
              type="number" 
              id="hp" 
              bind:value={newPlayer.hp} 
              min="0"
              step="1"
            />
          </div>
        </div>

        <div class="form-actions">
          <button 
            class="save-btn" 
            on:click={savePlayer} 
            disabled={!isFormValid}
          >
            {isNewPlayer ? 'Create Player' : 'Save Changes'}
          </button>
          <button class="cancel-btn" on:click={cancelEdit}>
            Cancel
          </button>
          {#if !isNewPlayer}
            <button class="delete-btn" on:click={() => deletePlayer(selectedPlayerId!)}>
              Delete Player
            </button>
          {/if}
        </div>
      </div>
    {:else}
      <div class="no-selection">
        <div class="no-selection-content">
          <i class="fas fa-users"></i>
          <h3>No Player Selected</h3>
          <p>Select a player from the list or create a new one to get started.</p>
          <button 
            on:click={createNewPlayer} 
            on:keypress={(e) => e.key === 'Enter' && createNewPlayer()}
            class="new-player-btn"
          >
            + Create New Player
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .player-characters {
    display: flex;
    height: calc(100vh - 60px);
    overflow: hidden;
  }

  /* Player List Styles */
  .player-list {
    width: 300px;
    border-right: 1px solid #444;
    padding: 1rem;
    overflow-y: auto;
    background-color: #1a1a1a;
  }

  .player-list h2 {
    margin: 0 0 1rem 0;
    color: #fff;
  }

  .new-player-btn {
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

  .new-player-btn:hover {
    background-color: #1a68d1;
  }

  .player-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .player-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background-color: #2a2a2a;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-left: 4px solid #2c7be5;
  }

  .player-item:hover {
    background-color: #333;
  }

  .player-item.selected {
    background-color: #333;
    border-left-color: #4caf50;
  }

  .player-icon {
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

  .player-details {
    flex: 1;
    overflow: hidden;
  }

  .player-details h3 {
    margin: 0 0 0.25rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
  }

  .player-stats {
    display: flex;
    gap: 0.75rem;
    font-size: 0.85rem;
    color: #aaa;
  }

  /* Player Form Styles */
  .player-form-container {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    background-color: #1e1e1e;
  }

  .player-form {
    max-width: 600px;
    margin: 0 auto;
    background-color: #2a2a2a;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .player-form h2 {
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
  /* Select styles removed since we don't have any select elements */

  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #444;
  }


  .save-btn {
    padding: 0.5rem 1.5rem;
    background-color: #2c7be5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
  }

  .save-btn:hover:not(:disabled) {
    background-color: #1a68d1;
  }

  .save-btn:disabled {
    background-color: #555;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .cancel-btn {
    padding: 0.5rem 1.5rem;
    background-color: #555;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .cancel-btn:hover {
    background-color: #666;
  }

  .delete-btn {
    padding: 0.5rem 1.5rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: auto;
    transition: background-color 0.2s;
  }

  .delete-btn:hover {
    background-color: #c82333;
  }

  /* No Selection State */
  .no-selection {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
    text-align: center;
  }

  .no-selection-content {
    max-width: 300px;
    padding: 2rem;
  }

  .no-selection i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #444;
  }

  .no-selection h3 {
    margin: 0.5rem 0;
    color: #ddd;
  }

  .no-selection p {
    margin: 0.5rem 0 1.5rem;
    color: #888;
  }

  /* Scrollbar Styles */
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
</style>
