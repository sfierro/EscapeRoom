<script>
  import { roomsById } from "./rooms";
  import Hotspot from "./Hotspot.svelte";
  import Navigation from "./Navigation.svelte";
  import Alert from "./Alert.svelte";
  import SlidingPuzzle from "./SlidingPuzzle.svelte";
  import NumberLock from "./NumberLock.svelte";
  import PasswordLock from "./PasswordLock.svelte";
  import outsideImage from "./assets/outside.jpg";
  import booksImage from "./assets/books.png";

  let currentRoomId = $state("single_bedroom");
  let showingOutside = $state(false);

  // ─── Overlay / popup state ─────────────────────────────────
  let showingDoorAlert = $state(false);
  let showingPainting = $state(false);
  let showingDrawer = $state(false);
  let showingComputer = $state(false);
  let showingBooks = $state(false);

  // ─── Inventory ─────────────────────────────────────────────
  let inventory = $state([]);

  const currentRoom = $derived(roomsById.get(currentRoomId));
  const hasPreviousRoom = $derived(!!currentRoom.previousRoomId);
  const hasNextRoom = $derived(!!currentRoom.nextRoomId);

  const displayImage = $derived(
    showingOutside ? outsideImage : currentRoom.image,
  );
  const displayName = $derived(showingOutside ? "Outside" : currentRoom.name);

  function navigateToRoom(roomId) {
    if (roomsById.has(roomId)) {
      currentRoomId = roomId;
      showingOutside = false;
    }
  }

  function goToPreviousRoom() {
    if (currentRoom.previousRoomId) {
      navigateToRoom(currentRoom.previousRoomId);
    }
  }

  function goToNextRoom() {
    if (currentRoom.nextRoomId) {
      navigateToRoom(currentRoom.nextRoomId);
    }
  }

  // ─── Per-hotspot click routing ─────────────────────────────
  function handleHotspotClick(id) {
    if (id === "bedroom_door") {
      navigateToRoom("single_bedroom");
    } else if (id === "bathroom_door") {
      navigateToRoom("bathroom");
    } else if (id === "door") {
      if (inventory.includes("key")) {
        inventory.splice(inventory.indexOf("key"), 1);
        showingOutside = true;
      } else {
        showingDoorAlert = true;
      }
    } else if (id === "painting") {
      showingPainting = true;
    } else if (id === "drawer") {
      showingDrawer = true;
    } else if (id === "computer") {
      showingComputer = true;
    } else if (id === "books") {
      showingBooks = true;
    }
  }

  // ─── Drawer number-lock handler ────────────────────────────
  function handleDrawerCode(value) {
    if (value === "2817") {
      if (!inventory.includes("key")) {
        inventory.push("key");
      }
      return true;
    }
    return false;
  }

  // ─── Computer password handler ────────────────────────────
  function handleComputerPassword(value) {
    if (value === "blackcat") {
      return true;
    }
    return false;
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
        {#if !showingOutside && currentRoom.hotspots.length > 0}
          <svg
            class="hotspots-overlay"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {#each currentRoom.hotspots as hotspot}
              <Hotspot
                cx={hotspot.cx}
                cy={hotspot.cy}
                onClick={() => handleHotspotClick(hotspot.id)}
              />
            {/each}
          </svg>
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
        {#if showingOutside}
          <div class="escaped-overlay">
            <h1 class="escaped-text">You Escaped!</h1>
          </div>
        {/if}
      </div>
      <div class="inventory-container" class:hidden={showingOutside}>
        <div class="inventory-title">Inventory</div>
        <div class="inventory-slots">
          {#each Array(12) as _, i}
            <div class="inventory-slot">
              {#if inventory[i] === "key"}
                <span class="inventory-item">🔑</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Door alert -->
    {#if showingDoorAlert}
      <Alert onClose={() => (showingDoorAlert = false)}>
        <p class="alert-text">This door is locked!</p>
      </Alert>
    {/if}

    <!-- Painting → sliding puzzle -->
    {#if showingPainting}
      <Alert onClose={() => (showingPainting = false)}>
        <SlidingPuzzle />
      </Alert>
    {/if}

    <!-- Drawer → number lock -->
    {#if showingDrawer}
      <Alert onClose={() => (showingDrawer = false)}>
        <NumberLock digits={4} onEnter={handleDrawerCode} />
      </Alert>
    {/if}

    <!-- Computer → password lock -->
    {#if showingComputer}
      <Alert onClose={() => (showingComputer = false)}>
        <PasswordLock onEnter={handleComputerPassword} />
      </Alert>
    {/if}

    <!-- Books → text -->
    {#if showingBooks}
      <Alert onClose={() => (showingBooks = false)} transparent>
        <img src={booksImage} alt="Books" class="books-image" />
      </Alert>
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

  .hotspots-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
    -moz-user-select: none;
  }

  .hotspots-overlay :global(.hotspot-group) {
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

  .inventory-container.hidden {
    display: none;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .inventory-slot:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .inventory-item {
    font-size: 28px;
    line-height: 1;
  }

  .books-image {
    max-width: 80vw;
    max-height: 80vh;
    object-fit: contain;
    display: block;
  }

  .alert-text {
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
    padding: 8px 16px;
  }

  .escaped-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 15;
  }

  .escaped-text {
    font-size: 4rem;
    font-weight: 900;
    color: gold;
    text-shadow:
      0 0 20px rgba(255, 215, 0, 0.6),
      0 0 40px rgba(255, 215, 0, 0.3),
      2px 2px 4px rgba(0, 0, 0, 0.7);
    animation: escapePulse 2s ease-in-out infinite;
  }

  @keyframes escapePulse {
    0%,
    100% {
      transform: scale(1);
      text-shadow:
        0 0 20px rgba(255, 215, 0, 0.6),
        0 0 40px rgba(255, 215, 0, 0.3),
        2px 2px 4px rgba(0, 0, 0, 0.7);
    }
    50% {
      transform: scale(1.05);
      text-shadow:
        0 0 30px rgba(255, 215, 0, 0.8),
        0 0 60px rgba(255, 215, 0, 0.5),
        2px 2px 4px rgba(0, 0, 0, 0.7);
    }
  }

  .room-image::selection {
    background: transparent;
  }
</style>
