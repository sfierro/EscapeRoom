<script>
  import { rooms } from "./rooms";
  import Hotspot from "./Hotspot.svelte";
  import Navigation from "./Navigation.svelte";
  import Alert from "./Alert.svelte";
  import outsideImage from "./assets/outside.jpg";

  let currentRoomIndex = $state(0);
  let showingOutside = $state(false);
  const locked = true;
  let showingAlert = $state(false);

  const currentRoom = $derived(rooms[currentRoomIndex]);
  const hasPreviousRoom = $derived(currentRoomIndex > 0);
  const hasNextRoom = $derived(currentRoomIndex < rooms.length - 1);

  const displayImage = $derived(
    showingOutside ? outsideImage : currentRoom.image,
  );
  const displayName = $derived(showingOutside ? "Outside" : currentRoom.name);

  function goToPreviousRoom() {
    if (hasPreviousRoom) {
      currentRoomIndex--;
      showingOutside = false;
    }
  }

  function goToNextRoom() {
    if (hasNextRoom) {
      currentRoomIndex++;
      showingOutside = false;
    }
  }

  function handleEntranceHotspotClick() {
    if (locked) {
      showingAlert = true;
    } else {
      showingOutside = true;
    }
  }

  function handleDragStart(e) {
    e.preventDefault();
    return false;
  }
</script>

<main>
  <div class="home-screen">
    <div class="game-container">
      <div class="image-container">
        <img
          src={displayImage}
          alt={displayName}
          class="room-image"
          draggable="false"
          ondragstart={handleDragStart}
          ondrag={handleDragStart}
        />
        {#if !showingOutside}
          {#each currentRoom.hotspots as hotspot}
            <Hotspot
              cx={hotspot.cx}
              cy={hotspot.cy}
              onClick={currentRoom.id === "entrance"
                ? handleEntranceHotspotClick
                : undefined}
            />
          {/each}
        {/if}
        {#if !showingOutside}
          <Navigation
            {hasPreviousRoom}
            {hasNextRoom}
            onPrevious={goToPreviousRoom}
            onNext={goToNextRoom}
          />
        {:else}
          <Navigation
            hasPreviousRoom={false}
            hasNextRoom={false}
            onPrevious={() => (showingOutside = false)}
            onNext={() => {}}
          />
        {/if}
      </div>
      <div class="inventory-container">
        <div class="inventory-title">Inventory</div>
        <div class="inventory-slots">
          {#each Array(12) as _, i}
            <div class="inventory-slot"></div>
          {/each}
        </div>
      </div>
    </div>
    {#if showingAlert}
      <Alert onClose={() => (showingAlert = false)} />
    {/if}
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
    background-color: #1a1a1a;
  }

  .game-container {
    height: 100%;
    display: flex;
    align-items: center;
    max-width: 100%;
  }

  .image-container {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .room-image {
    height: 100%;
    width: auto;
    max-width: calc(100vw - 200px);
    object-fit: contain;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
    -moz-user-select: none;
    -ms-user-select: none;
    pointer-events: auto;
  }

  .inventory-container {
    width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 16px;
    z-index: 20;
  }

  .inventory-title {
    color: white;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
    text-align: center;
    flex-shrink: 0;
  }

  .inventory-slots {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    flex: 1;
    align-content: start;
  }

  .inventory-slot {
    aspect-ratio: 1;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .inventory-slot:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .room-image::selection {
    background: transparent;
  }
</style>
