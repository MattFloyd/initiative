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
  <h3>Attacks</h3>
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
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    grid-column: span 2;
  }

  .attacks-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .attack-item {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #f8f8f8;
    border-radius: 4px;
  }

  .attack-item input {
    width: 100%;
  }

  .attack-item button {
    padding: 0.25rem 0.5rem;
  }
</style>
