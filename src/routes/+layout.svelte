<script>
  import '../app.css';
</script>

<svelte:head>
  <title>MapTiles+Map Libre GL</title>
  <link rel="stylesheet" href="https://cdn.skypack.dev/maplibre-gl/dist/maplibre-gl.css">
  <link rel="stylesheet" href="https://unpkg.com/@geoapify/geocoder-autocomplete@1.0.0/styles/minimal.css">
  <style>
    body {
      margin: 0;
      padding: 0;
    }

    #my-map {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }
  </style>
</svelte:head>

<slot />
