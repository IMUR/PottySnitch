<script lang="ts">
  import Map from '$lib/Map.svelte';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import type { SvelteComponent } from 'svelte';

  let Form: typeof SvelteComponent;
  let Input: typeof SvelteComponent;
  let Select: typeof SvelteComponent;
  let Button: typeof SvelteComponent;

  const pottyRules = ["Open to all", "Residents only", "Customers only"];
  const pottyTypes = ["Standard", "Accessible", "Portable"];

  let showPopup = writable(false);

  function togglePopup() {
    showPopup.update(value => !value);
  }

  onMount(async () => {
    try {
      const shadcn = await import('shadcn-svelte');
      ({ Form, Input, Select, Button } = shadcn);
      console.log('Components loaded:', { Form, Input, Select, Button });
    } catch (error) {
      console.error('Failed to load components:', error);
    }
  });
</script>

<div class="container">
  <Map />
  <button class="floating-button" on:click={togglePopup}>Add Potty</button>
  {#if $showPopup}
    <div class="popup-container">
      {#if Form && Input && Select && Button}
        <svelte:component this={Form}>
          <svelte:component this={Input} name="potty-name" label="Potty Name" type="text" placeholder="Enter potty name" required />
          <svelte:component this={Input} name="potty-address" label="Potty Address" type="search" placeholder="Enter potty address" required />
          <svelte:component this={Select} name="potty-rule" label="Potty Rule" options={pottyRules} required />
          <svelte:component this={Input} name="potty-notes" label="Potty Notes" type="text" placeholder="Enter potty notes" />
          <svelte:component this={Select} name="potty-type" label="Potty Type" options={pottyTypes} required />
          <svelte:component this={Button} type="submit">Submit</svelte:component>
        </svelte:component>
        <button on:click={togglePopup}>Close</button>
      {:else}
        <p>Loading form...</p>
      {/if}
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
    border-radius: 5px;
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
    border-radius: 5px;
  }

  .popup-container button {
    margin-top: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
