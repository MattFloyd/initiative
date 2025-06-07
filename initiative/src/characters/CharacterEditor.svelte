<script lang="ts">
  import { characters, addCharacter as addChar, updateCharacter as updateChar, removeCharacter as removeChar } from './characterStore';
  import type { Character } from './characterStore';
  import AttackEditor from './AttackEditor.svelte';

  let newChar: Omit<Character, 'id'> = {
    name: '',
    team: 'good',
    isPlayer: false,
    ac: 0,
    hp: 0,
    initiativeModifier: 0,
    attacks: []
  };

  let editing: Record<string, boolean> = {};

  $: isAddDisabled = !newChar.name.trim();

  function addCharacter() {
    addChar(newChar);
    newChar = { ...newChar, name: '' };
  }

  function toggleEdit(id: string) {
    editing[id] = !editing[id];
  }

  function updateCharacter(id: string, field: keyof Character, value: any) {
    updateChar(id, field, value);
  }

  function removeCharacter(id: string) {
    removeChar(id);
  }
</script>

<h2>Add Character / NPC</h2>
<div class="char-form">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" bind:value={newChar.name} on:input={() => isAddDisabled = !newChar.name.trim()} />
  </div>
  <div class="form-group">
    <label for="team">Team</label>
    <select id="team" bind:value={newChar.team}>
      <option value="good">Good</option>
      <option value="bad">Bad</option>
    </select>
  </div>
  <div class="form-group">
    <div class="form-group">
      <label for="isPlayer">Type</label>
      <select id="isPlayer" bind:value={newChar.isPlayer}>
        <option value={false}>NPC</option>
        <option value={true}>Player</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <label for="ac">AC</label>
    <input id="ac" type="number" bind:value={newChar.ac} placeholder="AC" />
  </div>
  <div class="form-group">
    <label for="maxHp">Max HP</label>
    <input id="maxHp" type="number" bind:value={newChar.hp} placeholder="HP" />
  </div>
  <div class="form-group">
    <label for="init-mod">Initiative Modifier</label>
    <input 
      type="number" 
      id="init-mod" 
      bind:value={newChar.initiativeModifier} 
      disabled={newChar.isPlayer}
    />
  </div>
  {#if !newChar.isPlayer}
    <div class="form-group">
      <div class="attacks-section">
        <AttackEditor 
          attacks={newChar.attacks}
          onAttackChange={(newAttacks) => newChar = { ...newChar, attacks: newAttacks }}
        />
      </div>
    </div>
  {/if}
  <button on:click={addCharacter} disabled={isAddDisabled}>Add Character</button>
</div>

<h2>Existing Characters</h2>
{#each $characters as char (char.id)}
  <div class="char-card {char.team}">
    {#if editing[char.id]}
      <input bind:value={char.name} on:change={(e) => updateCharacter(char.id, 'name', (e.target as HTMLInputElement).value)} />
      <select bind:value={char.team} on:change={(e) => updateCharacter(char.id, 'team', (e.target as HTMLInputElement).value)}>
        <option value="good">Good</option>
        <option value="bad">Bad</option>
      </select>
      <label>
        <select on:change={(e) => updateCharacter(char.id, 'isPlayer', (e.target as HTMLSelectElement).value === 'true')}>
          <option value="false" selected={!char.isPlayer}>NPC</option>
          <option value="true" selected={char.isPlayer}>Player</option>
        </select>
      </label>
      <label>
        <input type="number" bind:value={char.ac} on:change={(e) => updateCharacter(char.id, 'ac', +(e.target as HTMLInputElement).value)} />
        AC
      </label>
      <label>
        <input type="number" bind:value={char.hp} on:change={(e) => updateCharacter(char.id, 'hp', +(e.target as HTMLInputElement).value)} />
        Max HP
      </label>
      {#if !char.isPlayer}
        <label>
          <input type="number" bind:value={char.initiativeModifier} on:change={(e) => updateCharacter(char.id, 'initiativeModifier', +(e.target as HTMLInputElement).value)} />
          Initiative Modifier
        </label>
        <AttackEditor 
          attacks={char.attacks}
          onAttackChange={(newAttacks) => updateCharacter(char.id, 'attacks', newAttacks)}
        />
      {/if}
    {:else}
      <div class="char-name">
        <strong>{char.name}{char.isPlayer ? ' (Player)' : ''}</strong>
        {#if char.team === 'good'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        {:else}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C6.5 2 2 6.5 2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2z"/>
            <path d="M16 9v1"/>
            <path d="M8 9v1"/>
            <path d="M12 17c-1.5 0-3.5-1-4-3h8c-.5 2-2.5 3-4 3z"/>
            <path d="M16 12c0 1.5-.5 3-2 4"/>
            <path d="M8 12c0 1.5.5 3 2 4"/>
          </svg>
        {/if}
      </div><br />
      AC: {char.ac}<br />
      Max HP: {char.hp}<br />
      {#if !char.isPlayer}
        Initiative Modifier: {char.initiativeModifier}
      {/if}
    {/if}

    <div class="char-actions">
      <button on:click={() => toggleEdit(char.id)}>{editing[char.id] ? 'Done' : 'Edit'}</button>
      <button on:click={() => removeCharacter(char.id)}>Delete</button>
    </div>
  </div>
{/each}

<style>
  .char-form, .char-card {
    border: 1px solid #ccc;
    margin-bottom: 1rem;
    border-radius: 6px;
    background: transparent;
  }

  .char-form {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    align-items: center;
    padding: 1rem;
    box-sizing: border-box;
    width: 100%;
  }

  .form-group {
    display: contents;
  }

  .form-group label {
    text-align: right;
    padding-right: 0.5rem;
  }

  .char-form button {
    grid-column: span 2;
    justify-self: center;
    margin-top: 0.5rem;
  }

  .attacks-section {
    grid-column: 1 / -1;
    margin: 1rem 0 0 0;
    padding: 1rem 0 0 0;
    border-top: 1px solid #eee;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  


  .char-card {
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.3s ease;
    background: transparent;
  }

  .good {
    box-shadow: 0 0 15px blue;
  }

  .bad {
    box-shadow: 0 0 15px red;
  }

  .char-actions {
    margin-top: 0.5rem;
  }

  .char-actions button {
    margin-right: 0.5rem;
  }

  .char-actions button {
    margin-right: 0.5rem;
  }
</style>