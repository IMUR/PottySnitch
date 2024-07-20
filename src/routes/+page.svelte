<script lang="ts">
  import Map from '$lib/Map.svelte';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  let showPopup = writable(false);

  function togglePopup() {
    showPopup.update(value => !value);
  }

  let formData = {
    name: '',
    address: '',
    rule: '',
    notes: '',
    type: ''
  };

  const pottyRules = ["Open to all", "Residents only", "Customers only"];
  const pottyTypes = ["Standard", "Accessible", "Portable"];

  function handleSubmit(event: Event) {
    event.preventDefault();
    console.log('Form submitted:', formData);
    togglePopup();
  }

  onMount(async () => {
    const { GeocoderAutocomplete } = await import('@geoapify/geocoder-autocomplete');
    const autocompleteInput = document.getElementById('potty-address') as HTMLInputElement;
    if (autocompleteInput) {
      const autocomplete = new GeocoderAutocomplete(autocompleteInput, '52e42fd1727343ddb979120e8c9d473c', {
        placeholder: 'Enter potty address'
      });

      autocomplete.on('select', (location: any) => {
        formData.address = location.properties.formatted;
      });

      // Adding custom styles to the Geoapify autocomplete elements
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .geoapify-autocomplete-input {
          width: 100%;
        }
        .geoapify-autocomplete-suggestions {
          border: 1px solid #ccc;
          border-radius: 15px;
          margin-top: 15px;
        }
        .geoapify-autocomplete-suggestion {
          padding: 10px;
          cursor: pointer;
        }
        .geoapify-autocomplete-suggestion:hover {
          background-color: #f0f0f0;
        }
      `;
      document.head.appendChild(styleElement);
    }
  });
</script>

<div class="container">
  <Map />
  <button class="floating-button" on:click={togglePopup}>Add Potty</button>
  {#if $showPopup}
    <div class="popup-container">
      <form on:submit={handleSubmit}>
        <label for="potty-name">Potty Name:</label>
        <input id="potty-name" type="text" bind:value={formData.name} placeholder="Enter potty name" required />

        <label for="potty-address">Potty Address:</label>
        <input id="potty-address" type="search" bind:value={formData.address} required />

        <label for="potty-rule">Potty Rule:</label>
        <select id="potty-rule" bind:value={formData.rule} required>
          {#each pottyRules as rule}
            <option value={rule}>{rule}</option>
          {/each}
        </select>

        <label for="potty-notes">Potty Notes:</label>
        <input id="potty-notes" type="text" bind:value={formData.notes} placeholder="Enter potty notes" />

        <label for="potty-type">Potty Type:</label>
        <select id="potty-type" bind:value={formData.type} required>
          {#each pottyTypes as type}
            <option value={type}>{type}</option>
          {/each}
        </select>

        <button type="submit">Submit</button>
      </form>
      <button on:click={togglePopup}>Close</button>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    position: relative;
  }

  .floating-button {
    position: absolute;
    top: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    padding: 10px 20px;
    border-radius: 15px;
    cursor: pointer;
    z-index: 1;
  }

  .popup-container {
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 15px;
  }

  .popup-container button {
    margin-top: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    padding: 10px;
    border-radius: 15px;
    cursor: pointer;
  }

  .popup-container form {
    display: flex;
    flex-direction: column;
  }

  .popup-container label {
    margin-top: 10px;
  }

  .popup-container input,
  .popup-container select {
    margin-top: 15px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 15px;
  }

  .popup-container button[type="submit"] {
    margin-top: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 15px;
    cursor: pointer;
  }
</style>
