<script lang="ts">
  import { onMount } from 'svelte';
  import maplibregl, { Map, NavigationControl, Marker, GeolocateControl } from 'maplibre-gl';

  let map: Map;

  function initializeMap() {
    const apiKey = "52e42fd1727343ddb979120e8c9d473c";
    map = new maplibregl.Map({
      container: 'my-map',
      style: `https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=${apiKey}`,
      center: [0, 0],
      zoom: 2
    });
    map.addControl(new NavigationControl());

    const geolocateControl = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    map.addControl(geolocateControl);

    geolocateControl.on('geolocate', async (e) => {
      const { longitude, latitude } = e.coords;
      const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`);
      const locationData = await response.json();

      new Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);

      console.log(locationData); // This will give you more precise location details
    });
  }

  onMount(() => {
    initializeMap();
  });
</script>

<div id="my-map"></div>

<style>
  #my-map {
    width: 100%;
    height: 100vh;
  }
</style>
