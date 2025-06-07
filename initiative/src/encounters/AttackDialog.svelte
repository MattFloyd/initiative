<script lang="ts">
  import { getCharacterName, characters as charactersStore } from '../characters/characterStore';
  import type { Character } from '../characters/characterStore';
  import { createEventDispatcher, onMount } from 'svelte';
  import { get } from 'svelte/store';
  import AttackResultsDialog from './AttackResultsDialog.svelte';

  export let isOpen = false;
  export let onClose: () => void;
  export let attackerId: string;
  export let attack: { name: string; bonus: number; damage: string };
  export let onAttackComplete: (results: { targetId: string; hit: boolean; damage: number }[]) => void;

  const dispatch = createEventDispatcher();
  let characterList: Character[] = [];
  let selectedTargets: string[] = [];
  let showResultsDialog = false;
  let attackResults: Array<{
    targetId: string;
    targetName: string;
    attackRoll: number;
    hit: boolean;
    damage: number;
    modifiedDamage: number | null;
  }> = [];
  
  // Subscribe to characters store
  const unsubscribe = charactersStore.subscribe(chars => {
    characterList = chars;
  });
  
  onMount(() => {
    return () => {
      unsubscribe();
    };
  });
  
  // Get attacker's team and group characters
  $: attacker = characterList.find(c => c.id === attackerId);
  $: attackerTeam = attacker?.team || '';
  $: teams = {
    otherTeam: characterList.filter(c => c.team && c.team !== attackerTeam && c.id !== attackerId),
    myTeam: characterList.filter(c => c.team === attackerTeam && c.id !== attackerId),
    self: characterList.filter(c => c.id === attackerId)
  };

  function toggleTarget(characterId: string) {
    selectedTargets = selectedTargets.includes(characterId)
      ? selectedTargets.filter(id => id !== characterId)
      : [...selectedTargets, characterId];
  }
  
  function handleKeyDown(e: KeyboardEvent, characterId: string) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleTarget(characterId);
    }
  }
  
  function handleOverlayKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  function executeAttack() {
    // Calculate attack results for each target
    attackResults = selectedTargets.map(targetId => {
      const target = characterList.find(c => c.id === targetId);
      if (!target) return null;

      const attackRoll = Math.floor(Math.random() * 20) + 1 + attack.bonus;
      const hit = attackRoll >= target.ac;
      const damage = hit ? rollDice(attack.damage) : 0;
      
      return {
        targetId,
        targetName: getCharacterName(targetId),
        attackRoll,
        hit,
        damage,
        modifiedDamage: hit ? damage : null
      };
    }).filter(Boolean);
    
    // Show results dialog instead of applying damage directly
    showResultsDialog = true;
  }
  
  function handleApplyDamage(damageResults: Array<{ targetId: string; damage: number }>) {
    // Close the results dialog first
    showResultsDialog = false;
    
    // Convert to the format expected by onAttackComplete
    const results = damageResults.map(r => ({
      targetId: r.targetId,
      hit: true, // Since we're applying damage, we consider it a hit
      damage: r.damage
    }));
    
    // Apply the damage
    onAttackComplete(results);
    
    // Close the attack dialog
    onClose();
  }
  
  function rollDice(diceString: string): number {
    // Simple dice roller - handles formats like "1d6+3" or "2d8"
    const match = diceString.match(/(\d+)d(\d+)([+-]\d+)?/);
    if (!match) return 0;
    
    const [, count, sides, modifier] = match;
    let total = 0;
    
    for (let i = 0; i < parseInt(count); i++) {
      total += Math.floor(Math.random() * parseInt(sides)) + 1;
    }
    
    if (modifier) {
      total += parseInt(modifier);
    }
    
    return Math.max(0, total);
  }
</script>

{#if isOpen}
  <div 
    class="dialog-overlay" 
    on:click|self={onClose}
    on:keydown={handleOverlayKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
    tabindex="-1"
  >
    <div class="dialog">
      <h3 id="dialog-title">Attack: {attack.name}</h3>
      <p>Select targets for {getCharacterName(attackerId)}'s attack</p>
      
      <div class="target-selection">
        {#if teams.otherTeam.length > 0}
          <div class="team-section">
            <h4>Other Team</h4>
            {#each teams.otherTeam as character}
              <div 
                class="target-option"
                role="checkbox"
                aria-checked={selectedTargets.includes(character.id)}
                tabindex="0"
                on:click={() => toggleTarget(character.id)}
                on:keydown={(e) => handleKeyDown(e, character.id)}
              >
                <input 
                  type="checkbox" 
                  checked={selectedTargets.includes(character.id)}
                  class="sr-only"
                  tabindex="-1"
                />
                <span class="checkmark"></span>
                <span class="target-name">{getCharacterName(character.id)}</span>
              </div>
            {/each}
          </div>
        {/if}
        
        {#if teams.myTeam.length > 0}
          <div class="team-section">
            <h4>My Team</h4>
            {#each teams.myTeam as character}
              <div 
                class="target-option"
                role="checkbox"
                aria-checked={selectedTargets.includes(character.id)}
                tabindex="0"
                on:click={() => toggleTarget(character.id)}
                on:keydown={(e) => handleKeyDown(e, character.id)}
              >
                <input 
                  type="checkbox" 
                  checked={selectedTargets.includes(character.id)}
                  class="sr-only"
                  tabindex="-1"
                />
                <span class="checkmark"></span>
                <span class="target-name">{getCharacterName(character.id)}</span>
              </div>
            {/each}
          </div>
        {/if}
        
        <div class="team-section">
          <h4>Self</h4>
          {#each teams.self as character}
            <div 
              class="target-option"
              role="checkbox"
              aria-checked={selectedTargets.includes(character.id)}
              tabindex="0"
              on:click={() => toggleTarget(character.id)}
              on:keydown={(e) => handleKeyDown(e, character.id)}
            >
              <input 
                type="checkbox" 
                checked={selectedTargets.includes(character.id)}
                class="sr-only"
                tabindex="-1"
              />
              <span class="checkmark"></span>
              <span class="target-name">{getCharacterName(character.id)}</span>
            </div>
          {/each}
        </div>
      </div>
      
      <div class="dialog-actions">
        <button on:click={onClose}>Cancel</button>
        <button on:click={executeAttack} disabled={selectedTargets.length === 0}>
          Execute Attack
        </button>
      </div>
    </div>
  </div>
  
  <AttackResultsDialog
    isOpen={showResultsDialog}
    onClose={() => showResultsDialog = false}
    results={attackResults}
    onApplyDamage={handleApplyDamage}
  />
{/if}

<style>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .dialog {
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1.5rem;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    color: #e0e0e0;
  }
  
  .dialog h3 {
    margin-top: 0;
    color: #fff;
    border-bottom: 1px solid #444;
    padding-bottom: 0.5rem;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .dialog-actions button {
    padding: 0.5rem 1rem;
    border: 1px solid #444;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    background: #2d2d2d;
    color: #e0e0e0;
    transition: all 0.2s;
  }
  
  .dialog-actions button:first-child {
    background: #2d2d2d;
    color: #e0e0e0;
  }
  
  .dialog-actions button:last-child {
    background: #0a5d8f;
    color: white;
    border-color: #0a5d8f;
  }
  
  .dialog-actions button:hover {
    filter: brightness(1.2);
  }
  
  .team-section {
    margin-bottom: 1.5rem;
    background: #252526;
    padding: 1rem;
    border-radius: 6px;
  }
  
  .team-section h4 {
    margin: 0 0 0.75rem 0;
    color: #9cdcfe;
    border-bottom: 1px solid #333;
    padding-bottom: 0.5rem;
  }
  
  .target-option {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin: 0.25rem 0;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
    background: #2d2d2d;
  }
  
  .target-option:hover,
  .target-option:focus {
    background: #3c3c3c;
    outline: 2px solid #4a9fe0;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  
  .checkmark {
    display: inline-block;
    width: 1.2em;
    height: 1.2em;
    border: 2px solid #5a5a5a;
    border-radius: 3px;
    margin-right: 0.75rem;
    position: relative;
    background-color: #2d2d2d;
    transition: all 0.2s ease;
  }
  
  .checkmark::after {
    content: '';
    position: absolute;
    display: none;
    left: 0.3em;
    top: 0.1em;
    width: 0.4em;
    height: 0.7em;
    border: solid #e0e0e0;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  
  input[type="checkbox"]:checked + .checkmark {
    background-color: #0a5d8f;
    border-color: #4a9fe0;
  }
  
  input[type="checkbox"]:checked + .checkmark::after {
    display: block;
  }
  
  .target-name {
    margin-left: 0.5rem;
    color: #e0e0e0;
  }
  
  .target-option[aria-checked="true"] {
    background: #1e3a5f;
    border-left: 3px solid #4a9fe0;
  }
  
  .target-option[aria-checked="true"] .checkmark {
    background-color: #0a5d8f;
    border-color: #4a9fe0;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #2d2d2d;
    color: #e0e0e0;
    cursor: pointer;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>