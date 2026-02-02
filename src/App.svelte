<script>
  import entranceImage from './assets/entrance.jpg';
  import Hotspot from './Hotspot.svelte';
  import { entranceHotspot } from './hotspot-utils';
  
  function handleDragStart(e) {
    e.preventDefault();
    return false;
  }
</script>

<main>
  <div class="home-screen">
    <img 
      src={entranceImage} 
      alt="Entrance" 
      class="entrance-image"
      draggable="false"
      ondragstart={handleDragStart}
      ondrag={handleDragStart}
    />
    <Hotspot cx={entranceHotspot.cx} cy={entranceHotspot.cy} />
  </div>
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .home-screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .entrance-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
    -moz-user-select: none;
    -ms-user-select: none;
    pointer-events: auto;
  }
  
  .entrance-image::selection {
    background: transparent;
  }
</style>
