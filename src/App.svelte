<script>
  import { rooms } from "./rooms";
  import Hotspot from "./Hotspot.svelte";
  import Navigation from "./Navigation.svelte";
  import Alert from "./Alert.svelte";
  import outsideImage from "./assets/outside.jpg";

  let currentRoomIndex = $state(0);
  let showingOutside = $state(false);
  const locked = false;
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
  }

  .room-image {
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

  .room-image::selection {
    background: transparent;
  }
</style>
