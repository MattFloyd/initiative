<script lang="ts">
  import { getCharacterName } from '../characters/characterStore';
  import AttackDialog from './AttackDialog.svelte';

  export let encounter: any;
  export let characters: any;

  function getCharacterStats(id: string) {
    const char = characters.find(c => c.id === id);
    return char ? {
      ac: char.ac,
      hp: char.hp,
      attacks: char.attacks
    } : null;
  }

  let selectedCharacter = null;

  function selectCharacter(id: string) {
    selectedCharacter = id;
  }

  let attackDialogOpen = false;
  let currentAttack: { name: string; bonus: number; damage: string } | null = null;

  function updateCharacter(id: string, field: string, value: any) {
    const index = characters.findIndex(c => c.id === id);
    if (index !== -1) {
      characters[index][field] = value;
    }
  }

  function openAttackDialog(attack: { name: string; bonus: number; damage: string }) {
    currentAttack = attack;
    attackDialogOpen = true;
  }

  function handleAttackComplete(results: { targetId: string; hit: boolean; damage: number }[]) {
    results.forEach(result => {
      if (result.hit) {
        const target = $characters.find(c => c.id === result.targetId);
        if (target) {
          updateCharacter(result.targetId, 'hp', target.hp - result.damage);
        }
      }
    });
  }

  // Automatically select the first character in initiative order
  $: if (!selectedCharacter && encounter?.initiative?.length > 0) {
    selectedCharacter = encounter.initiative[0].characterId;
  }
</script>

<div class="active-encounter">

  <div class="initiative-sidebar">
    {#each encounter.initiative.sort((a, b) => (b.initiative + b.modifier) - (a.initiative + a.modifier)) as init}
      <button 
        class="initiative-item {selectedCharacter === init.characterId ? 'selected' : ''}"
        on:click={() => selectCharacter(init.characterId)}
        role="tab"
        aria-selected={selectedCharacter === init.characterId}
      >
        <strong>{getCharacterName(init.characterId)}</strong>
      </button>
    {/each}
  </div>

  <div class="character-stats">
    {#if selectedCharacter}
      <h3>{getCharacterName(selectedCharacter)}'s Stats</h3>
      {#each [getCharacterStats(selectedCharacter)] as stats}
        <div class="stat-block">
          <div class="stat">AC: {stats.ac}</div>
          <div class="stat">HP: {stats.hp}</div>
          <h4>Attacks:</h4>
          {#each stats.attacks as attack}
            <div class="stat">
              {attack.name} ({attack.bonus} to hit)
              <button on:click={() => openAttackDialog(attack)}>Attack</button>
            </div>
          {/each}
        </div>
      {/each}
    {/if}
  </div>
  
  {#if attackDialogOpen && currentAttack}
    <AttackDialog
      isOpen={attackDialogOpen}
      onClose={() => attackDialogOpen = false}
      attackerId={selectedCharacter}
      attack={currentAttack}
      onAttackComplete={handleAttackComplete}
    />
  {/if}
</div>

<style>
  .active-encounter {
    display: flex;
    height: 100%;
    margin-top: 1rem;
  }

  .initiative-sidebar {
    width: 250px;
    border-right: 1px solid #ddd;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;
  }

  .initiative-sidebar .initiative-item {
    cursor: pointer;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }

  .initiative-sidebar .initiative-item:hover {
    background: #f5f5f5;
    transform: translateY(-1px);
  }

  .initiative-sidebar .initiative-item.selected {
    background: #007acc;
    color: white;
    transform: translateY(-1px);
  }

  .character-stats {
    flex: 1;
    padding: 1rem;
  }

  .stat-block {
    margin-top: 1rem;
  }

  .stat {
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }

  h4 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
</style>