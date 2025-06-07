<script lang="ts">
  import { settings } from './settingsStore';
  import type { Settings } from './settingsStore';

  let currentSettings: Settings;

  function updateSettings(newSettings: Partial<Settings>) {
    settings.update(s => ({ ...s, ...newSettings }));
  }
</script>

<div class="settings-container">
  <h2>Settings</h2>
  <div class="settings-group">
    <label class="setting-item">
      <input 
        type="checkbox" 
        bind:checked={currentSettings.showDebugInfo}
        on:change={() => updateSettings({ showDebugInfo: currentSettings.showDebugInfo })}
      />
      Show Debug Information
    </label>
  </div>
</div>

<style>
  .settings-container {
    padding: 1rem;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .settings-group {
    margin-bottom: 1rem;
  }

  .setting-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .setting-item input[type="checkbox"] {
    width: 1.2rem;
    height: 1.2rem;
  }
</style>
