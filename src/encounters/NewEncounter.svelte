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
      border: 1px solid #ccc;
      border-radius: 6px;
      margin: 1rem;
    }

  </style>
  