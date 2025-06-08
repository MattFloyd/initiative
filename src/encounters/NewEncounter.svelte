<script lang="ts">
    import { encounter } from './encounterStore';
  
    let encounterName = '';
  
    function startNewEncounter() {
      if (!encounterName.trim()) return;
      encounter.startEncounter(encounterName);
      encounterName = '';
    }
  

  </script>

    <div class="encounter-container">
        <h2>Start New Encounter</h2>
        <input
        type="text"
        bind:value={encounterName}
        placeholder="Enter encounter name"
        />
        <button on:click={startNewEncounter}>Start Encounter</button>
    </div>
  
<style>
  .encounter-container {
    padding: 1rem;
    border: 1px solid #444;
    border-radius: 6px;
    margin: 1rem;
    background: #1e1e1e;
  }

  input[type="text"] {
    background: #2d2d2d;
    border: 1px solid #444;
    color: #e0e0e0;
    padding: 0.5rem;
    border-radius: 4px;
    margin-right: 0.5rem;
  }

  button {
    background: #333;
    border: 1px solid #444;
    color: #e0e0e0;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  button:hover {
    background: #444;
  }
</style>