<script lang="ts">
  import { onMount } from 'svelte';
  import * as maplibregl from 'maplibre-gl';

  let map: maplibregl.Map;

  function initializeMap(latitude: number, longitude: number) {
    const apiKey = "52e42fd1727343ddb979120e8c9d473c";
    map = new maplibregl.Map({
      container: 'my-map',
      style: `https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=${apiKey}`,
      center: [longitude, latitude],
      zoom: 12
    });
    map.addControl(new maplibregl.NavigationControl());

    const geolocateControl = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    map.addControl(geolocateControl);

    new maplibregl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);

    geolocateControl.on('geolocate', async (e) => {
      const { longitude, latitude } = e.coords;
      const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`);
      const locationData = await response.json();
      console.log(locationData); // This will give you more precise location details
    });
  }

  onMount(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        initializeMap(latitude, longitude);
      });
    } else {
      // Default location if geolocation is not available
      initializeMap(0, 0);
    }
  });
</script>

<div id="my-map"></div>

<style>
  #my-map {
    width: 600px;
    height: 100%;
    border-radius: 15px;
  }
</style>
