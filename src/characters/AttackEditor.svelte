<script lang="ts">
  import type { Character } from './characterStore';

  export let attacks: Character['attacks'];
  export let onAttackChange: (newAttacks: Character['attacks']) => void;

  function addAttack() {
    onAttackChange([...attacks, { name: '', bonus: 0, damage: '' }]);
  }

  function updateAttack(index: number, field: keyof typeof attacks[0], value: any) {
    onAttackChange([
      ...attacks.map((attack, i) => 
        i === index ? { ...attack, [field]: value } : attack
      )
    ]);
  }

  function removeAttack(index: number) {
    onAttackChange(attacks.filter((_, i) => i !== index));
  }
</script>

<div class="attacks-section">
  <div class="attacks-grid">
    {#each attacks as attack, i}
      <div class="attack-item">
        <input 
          type="text" 
          bind:value={attack.name} 
          on:input={(e) => updateAttack(i, 'name', (e.target as HTMLInputElement).value)}
          placeholder="Attack name" 
        />
        <input 
          type="number" 
          bind:value={attack.bonus} 
          on:input={(e) => updateAttack(i, 'bonus', +(e.target as HTMLInputElement).value)}
          placeholder="Attack bonus" 
        />
        <input 
          type="text" 
          bind:value={attack.damage} 
          on:input={(e) => updateAttack(i, 'damage', (e.target as HTMLInputElement).value)}
          placeholder="Damage dice (e.g. 1d6+3)" 
        />
        <button on:click={() => removeAttack(i)}>Remove</button>
      </div>
    {/each}
  </div>
  <button on:click={addAttack}>Add Attack</button>
</div>

<style>
  .attacks-section {
    width: 100%;
    box-sizing: border-box;
  }

  .attacks-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    width: 100%;
    box-sizing: border-box;
  }

  .attack-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) auto;
    gap: 0.5rem;
    padding: 0.5rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  }

  .attack-item input {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .attack-item button {
    padding: 0.25rem 0.5rem;
    white-space: nowrap;
  }
</style>
