<script>
  import { onMount } from 'svelte';
  import maplibregl from 'maplibre-gl';

  let map;

  onMount(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        map = new maplibregl.Map({
          container: 'map',
          style: 'https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=52e42fd1727343ddb979120e8c9d473c',
          center: [longitude, latitude],
          zoom: 12
        });

        new maplibregl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map);

        map.addControl(new maplibregl.NavigationControl());
        map.addControl(new maplibregl.ScaleControl({ maxWidth: 80, unit: 'metric' }));
      });
    }
  });
</script>

<div id="map" style="width: 100%; height: 100vh;"></div>

<style>
  #map {
    width: 100%;
    height: 100vh;
  }
</style>
