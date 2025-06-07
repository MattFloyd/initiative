<script lang="ts">
  import { getCharacterName } from '../characters/characterStore';
  import { createEventDispatcher } from 'svelte';

  export let isOpen = false;
  export let onClose: () => void;
  type AttackResult = {
    targetId: string;
    targetName: string;
    attackRoll: number;
    hit: boolean;
    damage: number;
    modifiedDamage: number | null;
  };
  
  export let results: AttackResult[] = [];
  export let onApplyDamage: (results: Array<{ targetId: string; damage: number }>) => void;

  const dispatch = createEventDispatcher();

  function updateDamage(index: number, value: string) {
    const numValue = parseInt(value) || 0;
    const newResults = [...results];
    newResults[index] = {
      ...newResults[index],
      modifiedDamage: numValue >= 0 ? numValue : 0
    };
    results = newResults;
  }

  function applyDamage() {
    const damageResults = results.map(r => ({
      targetId: r.targetId,
      damage: r.modifiedDamage !== null ? r.modifiedDamage : r.damage
    }));
    onApplyDamage(damageResults);
    onClose();
  }
</script>

{#if isOpen}
  <div 
    class="dialog-overlay" 
    on:click|self={onClose}
    on:keydown={(e) => e.key === 'Escape' && onClose()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="results-dialog-title"
    tabindex="-1"
  >
    <div class="dialog">
      <h3 id="results-dialog-title">Attack Results</h3>
      
      <div class="results-list">
        {#each results as result, i}
          <div class="result-item">
            <div class="target-name">{result.targetName}</div>
            <div class="attack-details">
              <div class="attack-roll">
                Roll: <span class:success={result.hit} class:fail={!result.hit}>
                  {result.attackRoll} {result.hit ? '(Hit!)' : '(Miss!)'}
                </span>
              </div>
              <div class="damage-input">
                <label>
                  Damage:
                  <input 
                    type="number" 
                    value={result.modifiedDamage !== null ? result.modifiedDamage : result.damage}
                    on:input={(e) => updateDamage(i, e.currentTarget.value)}
                    min="0"
                    aria-label={`Damage for ${result.targetName}`}
                  />
                </label>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="dialog-actions">
        <button on:click={onClose}>Cancel</button>
        <button on:click={applyDamage}>Apply Damage</button>
      </div>
    </div>
  </div>
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
  
  .results-list {
    margin: 1.5rem 0;
  }
  
  .result-item {
    background: #252526;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 1rem;
    border-left: 3px solid #444;
  }
  
  .target-name {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #9cdcfe;
  }
  
  .attack-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  
  .attack-roll {
    flex: 1;
  }
  
  .success {
    color: #4ec9b0;
  }
  
  .fail {
    color: #f47d7d;
  }
  
  .damage-input input {
    background: #2d2d2d;
    border: 1px solid #444;
    border-radius: 4px;
    color: #e0e0e0;
    padding: 0.25rem 0.5rem;
    width: 80px;
    text-align: right;
  }
  
  .damage-input input:focus {
    outline: 2px solid #4a9fe0;
    outline-offset: 1px;
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
</style>
