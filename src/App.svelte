<script>
  import { roomsById } from "./rooms";
  import Hotspot from "./Hotspot.svelte";
  import Navigation from "./Navigation.svelte";
  import Alert from "./Alert.svelte";
  import SlidingPuzzle from "./SlidingPuzzle.svelte";
  import NumberLock from "./NumberLock.svelte";
  import PasswordLock from "./PasswordLock.svelte";
  import DirectionalLock from "./DirectionalLock.svelte";
  import outsideImage from "./assets/outside.jpg";
  import booksImage from "./assets/books.png";
  import placeholderImage from "./assets/placeholder.jpg";
  import toothbrush_2_image from "./assets/toothbrush_2.png";
  import toothbrush_3_image from "./assets/toothbrush_3.png";
  import maze_image from "./assets/maze.png";

  let currentRoomId = $state("single_bedroom");
  let showingOutside = $state(false);

  // ─── Overlay / popup state ─────────────────────────────────
  let showingDoorAlert = $state(false);
  let showingComputer = $state(false);
  let showingBooks = $state(false);
  let showingCanister = $state(false);
  let toothbrushCollected = $state(false);
  let showingToothbrushHolder = $state(false);
  let showingMedicineCabinet = $state(false);
  let showingSpiceRack = $state(false);
  let showingSafe = $state(false);
  let showingRemote = $state(false);
  let showingDrawer = $state(false);
  let showingKitchenDrawer = $state(false);
  let showingPainting = $state(false);
  // Flavor-text hotspots
  let showingHallwayPainting = $state(false);
  let showingFlowerPot = $state(false);
  let showingBoots = $state(false);
  let showingKeyBowl = $state(false);

  // ─── Game progress flags ─────────────────────────────────────
  let computerSolved = $state(false);
  let canisterOpen = $state(false);
  let toothbrushPlaced = $state(false);
  let medicineCabinetOpen = $state(false);
  let safeOpen = $state(false);
  let tvCorrectChannel = $state(false);
  let kitchenDrawerOpen = $state(false);
  let screwdriverCollected = $state(false);
  let drawerUnlocked = $state(false);
  let drawerKeyCollected = $state(false);
  let paintingPried = $state(false);

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
    // Navigation hotspots
    if (id === "bedroom_door") {
      navigateToRoom("single_bedroom");
    } else if (id === "bathroom_door") {
      navigateToRoom("bathroom");
    }
    // Front door
    else if (id === "door") {
      showingDoorAlert = true;
    }
    // Single bedroom
    else if (id === "computer") {
      showingComputer = true;
    } else if (id === "books") {
      showingBooks = true;
    } else if (id === "canister") {
      showingCanister = true;
    }
    // Bathroom
    else if (id === "toothbrush_holder") {
      showingToothbrushHolder = true;
      inventory.push("toothbrush");
    } else if (id === "medicine_cabinet") {
      showingMedicineCabinet = true;
    }
    // Kitchen
    else if (id === "spice_rack") {
      showingSpiceRack = true;
    } else if (id === "kitchen_drawer") {
      showingKitchenDrawer = true;
    }
    // Lounge
    else if (id === "safe") {
      showingSafe = true;
    } else if (id === "remote") {
      showingRemote = true;
    }
    // Entrance
    else if (id === "drawer") {
      showingDrawer = true;
    } else if (id === "painting") {
      showingPainting = true;
    }
    // Flavor-text hotspots
    else if (id === "hallway_painting") {
      showingHallwayPainting = true;
    } else if (id === "flower_pot") {
      showingFlowerPot = true;
    } else if (id === "boots") {
      showingBoots = true;
    } else if (id === "key_bowl") {
      showingKeyBowl = true;
    }
  }

  // ─── Computer password handler ────────────────────────────
  function handleComputerPassword(value) {
    return value === "BLACKCAT";
  }

  // ─── Canister directional lock handler ────────────────────
  function handleCanisterCode(value) {
    return value === "RULDL";
  }

  // ─── Medicine cabinet number lock handler ─────────────────
  function handleMedicineCabinetCode(value) {
    return value === "232";
  }

  // ─── Safe number lock handler ─────────────────────────────
  function handleSafeCode(value) {
    return value === "391582";
  }

  // ─── Remote / TV channel handler ──────────────────────────
  function handleRemoteChannel(value) {
    return value === "73";
  }

  // ─── Kitchen drawer (symbol lock) handler ──────────────────
  function handleKitchenDrawerCode(value) {
    return value === "placeholder";
  }

  function collectScrewdriver() {
    if (!screwdriverCollected) {
      screwdriverCollected = true;
      if (!inventory.includes("screwdriver")) {
        inventory.push("screwdriver");
      }
    }
  }

  // ─── Entrance drawer number lock handler ───────────────────
  function handleDrawerCode(value) {
    return value === "2817";
  }

  function collectKey() {
    if (!drawerKeyCollected) {
      drawerKeyCollected = true;
      if (!inventory.includes("key")) {
        inventory.push("key");
      }
    }
  }

  function useKeyOnDoor() {
    inventory.splice(inventory.indexOf("key"), 1);
    showingDoorAlert = false;
    showingOutside = true;
  }

  function useScrewdriverOnPainting() {
    inventory.splice(inventory.indexOf("screwdriver"), 1);
    paintingPried = true;
  }

  function handleDragStart(e) {
    e.preventDefault();
    return false;
  }
</script>

<main>
  <div class="home-screen">
    <div class="game-container">
      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
      <div
        class="image-container"
        onclick={(e) => {
          const img = e.currentTarget.querySelector(".room-image");
          if (!img) return;
          const rect = img.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 1920;
          const y = ((e.clientY - rect.top) / rect.height) * 1080;
          console.log(`cx: ${Math.round(x)}, cy: ${Math.round(y)}`);
        }}
      >
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
              {:else if inventory[i] === "toothbrush"}
                <span class="inventory-item">🪥</span>
              {:else if inventory[i] === "screwdriver"}
                <span class="inventory-item">🪛</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- ═══════════════ ALERTS / POPUPS ═══════════════ -->

    <!-- Door alert -->
    {#if showingDoorAlert}
      <Alert onClose={() => (showingDoorAlert = false)}>
        {#if inventory.includes("key")}
          <div class="found-item-container">
            <span class="found-item-emoji">🔑</span>
            <p class="alert-text">Use the key on the door?</p>
            <button class="collect-button" onclick={useKeyOnDoor}>
              Use key
            </button>
          </div>
        {:else}
          <p class="alert-text">This door is locked!</p>
        {/if}
      </Alert>
    {/if}

    <!-- Computer → password lock or maze clue -->
    {#if showingComputer}
      <Alert onClose={() => (showingComputer = false)}>
        {#if computerSolved}
          <img src={maze_image} alt="Maze" class="maze-clue-image" />
        {:else}
          <PasswordLock
            onEnter={handleComputerPassword}
            onSuccess={() => (computerSolved = true)}
          />
        {/if}
      </Alert>
    {/if}

    <!-- Books -->
    {#if showingBooks}
      <Alert onClose={() => (showingBooks = false)} transparent>
        <img src={booksImage} alt="Books" class="books-image" />
      </Alert>
    {/if}

    <!-- Canister → directional lock or empty -->
    {#if showingCanister}
      <Alert onClose={() => (showingCanister = false)}>
        {#if toothbrushCollected}
          <p class="alert-text">The canister is empty.</p>
        {:else if canisterOpen}
          <div class="clue-container">
            <p style="font-size: 3rem;">🪥</p>
            <p class="alert-text">Inside the canister you find a toothbrush.</p>
            <button
              class="collect-button"
              onclick={() => {
                inventory.push("toothbrush");
                toothbrushCollected = true;
                showingCanister = false;
              }}
            >
              Take toothbrush
            </button>
          </div>
        {:else}
          <DirectionalLock
            onEnter={handleCanisterCode}
            onSuccess={() => (canisterOpen = true)}
          />
        {/if}
      </Alert>
    {/if}

    <!-- Toothbrush Holder -->
    {#if showingToothbrushHolder}
      <Alert onClose={() => (showingToothbrushHolder = false)}>
        {#if toothbrushPlaced}
          <div class="clue-container">
            <img
              src={toothbrush_3_image}
              alt="Toothbrushes"
              class="toothbrush-clue-image"
            />
          </div>
        {:else}
          <div class="clue-container">
            <img
              src={toothbrush_2_image}
              alt="Toothbrushes"
              class="toothbrush-clue-image"
            />
            {#if inventory.includes("toothbrush")}
              <button
                class="collect-button"
                onclick={() => {
                  inventory.splice(inventory.indexOf("toothbrush"), 1);
                  toothbrushPlaced = true;
                }}
              >
                Place toothbrush
              </button>
            {:else}
              <p class="alert-text">
                There are two toothbrushes in the holder.
              </p>
            {/if}
          </div>
        {/if}
      </Alert>
    {/if}

    <!-- Medicine Cabinet → number lock or pill bottles clue -->
    {#if showingMedicineCabinet}
      <Alert onClose={() => (showingMedicineCabinet = false)}>
        {#if medicineCabinetOpen}
          <div class="clue-container">
            <img src={placeholderImage} alt="Pill Bottles" class="clue-image" />
            <p class="clue-text">
              Prescription bottles with colored pills (L→R):<br />
              Red · Blue · Yellow · Green · Purple · Orange
            </p>
          </div>
        {:else}
          <NumberLock
            digits={3}
            onEnter={handleMedicineCabinetCode}
            onSuccess={() => (medicineCabinetOpen = true)}
          />
        {/if}
      </Alert>
    {/if}

    <!-- Spice Rack → always shows clue info -->
    {#if showingSpiceRack}
      <Alert onClose={() => (showingSpiceRack = false)}>
        <div class="clue-container">
          <img src={placeholderImage} alt="Spice Rack" class="clue-image" />
          <p class="clue-text">
            Paprika <span class="clue-color red">●</span> 3oz · Salt
            <span class="clue-color blue">●</span> 9oz · Turmeric
            <span class="clue-color yellow">●</span> 1oz<br />
            Basil <span class="clue-color green">●</span> 5oz · Lavender
            <span class="clue-color purple">●</span> 8oz · Cayenne
            <span class="clue-color orange">●</span> 2oz
          </p>
        </div>
      </Alert>
    {/if}

    <!-- Safe → number lock or channel hint -->
    {#if showingSafe}
      <Alert onClose={() => (showingSafe = false)}>
        {#if safeOpen}
          <div class="clue-container">
            <img
              src={placeholderImage}
              alt="Safe Contents"
              class="clue-image"
            />
            <p class="clue-text">
              Inside the safe you find a small note that reads:<br />
              <strong>"CH 73"</strong>
            </p>
          </div>
        {:else}
          <NumberLock
            digits={6}
            onEnter={handleSafeCode}
            onSuccess={() => (safeOpen = true)}
          />
        {/if}
      </Alert>
    {/if}

    <!-- Remote / TV → channel input or TV screen symbols -->
    {#if showingRemote}
      <Alert onClose={() => (showingRemote = false)}>
        {#if tvCorrectChannel}
          <div class="clue-container">
            <img src={placeholderImage} alt="TV Screen" class="clue-image" />
            <p class="clue-text">
              The TV displays a repeating series of symbols:<br />
              ☾→e · ☀→c · ◐→l · ☆→i · ◑→p · ●→s · ☾→e<br />
              <em>Decode the symbols…</em>
            </p>
          </div>
        {:else}
          <p class="alert-text" style="margin-bottom: 12px;">
            Enter the TV channel:
          </p>
          <NumberLock
            digits={2}
            onEnter={handleRemoteChannel}
            onSuccess={() => (tvCorrectChannel = true)}
          />
        {/if}
      </Alert>
    {/if}

    <!-- Entrance drawer → number lock, found key, or empty -->
    {#if showingDrawer}
      <Alert onClose={() => (showingDrawer = false)}>
        {#if drawerKeyCollected}
          <p class="alert-text">The drawer is empty.</p>
        {:else if drawerUnlocked}
          <div class="found-item-container">
            <span class="found-item-emoji">🔑</span>
            <p class="alert-text">You found a key!</p>
            <button
              class="collect-button"
              onclick={() => {
                collectKey();
                showingDrawer = false;
              }}
            >
              Take key
            </button>
          </div>
        {:else}
          <NumberLock
            digits={4}
            onEnter={handleDrawerCode}
            onSuccess={() => (drawerUnlocked = true)}
          />
        {/if}
      </Alert>
    {/if}

    <!-- Kitchen drawer → symbol lock, found screwdriver, or empty -->
    {#if showingKitchenDrawer}
      <Alert onClose={() => (showingKitchenDrawer = false)}>
        {#if screwdriverCollected}
          <p class="alert-text">The drawer is empty.</p>
        {:else if kitchenDrawerOpen}
          <div class="found-item-container">
            <span class="found-item-emoji">🪛</span>
            <p class="alert-text">You found a screwdriver!</p>
            <button
              class="collect-button"
              onclick={() => {
                collectScrewdriver();
                showingKitchenDrawer = false;
              }}
            >
              Take it
            </button>
          </div>
        {:else}
          <!-- TODO: This should be a symbol lock -->
          <PasswordLock
            onEnter={handleKitchenDrawerCode}
            onSuccess={() => (kitchenDrawerOpen = true)}
          />
        {/if}
      </Alert>
    {/if}

    <!-- Painting → use screwdriver, sliding puzzle, or hint -->
    {#if showingPainting}
      <Alert onClose={() => (showingPainting = false)}>
        {#if paintingPried}
          <SlidingPuzzle />
        {:else if inventory.includes("screwdriver")}
          <div class="found-item-container">
            <span class="found-item-emoji">🪛</span>
            <p class="alert-text">Use the screwdriver to pry off the frame?</p>
            <button class="collect-button" onclick={useScrewdriverOnPainting}>
              Use screwdriver
            </button>
          </div>
        {:else}
          <p class="alert-text">
            A beautiful painting in an ornate frame. The frame looks like it
            could be pried off with the right tool.
          </p>
        {/if}
      </Alert>
    {/if}

    <!-- ═══════════════ FLAVOR TEXT HOTSPOTS ═══════════════ -->

    {#if showingHallwayPainting}
      <Alert onClose={() => (showingHallwayPainting = false)}>
        <p class="alert-text">
          An interesting painting of a countryside scene.
        </p>
      </Alert>
    {/if}

    {#if showingFlowerPot}
      <Alert onClose={() => (showingFlowerPot = false)}>
        <p class="alert-text">These are pretty flowers!</p>
      </Alert>
    {/if}

    {#if showingBoots}
      <Alert onClose={() => (showingBoots = false)}>
        <p class="alert-text">
          A pair of muddy boots. Doesn't look like anyone's been outside
          recently.
        </p>
      </Alert>
    {/if}

    {#if showingKeyBowl}
      <Alert onClose={() => (showingKeyBowl = false)}>
        <p class="alert-text">
          A bowl of keys, but none of them seem to fit the front door.
        </p>
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

  .found-item-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
  }

  .found-item-emoji {
    font-size: 3.5rem;
    line-height: 1;
  }

  .collect-button {
    margin-top: 4px;
    padding: 10px 28px;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(180deg, #4a90e2 0%, #357abd 100%);
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow:
      0 4px 6px rgba(74, 144, 226, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .collect-button:hover {
    background: linear-gradient(180deg, #5ba0f2 0%, #4080cd 100%);
    transform: translateY(-1px);
    box-shadow:
      0 6px 8px rgba(74, 144, 226, 0.4),
      0 3px 6px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  .collect-button:active {
    background: linear-gradient(180deg, #357abd 0%, #2a5f9d 100%);
    transform: translateY(0);
  }

  .clue-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    max-width: 500px;
  }

  .clue-image {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 8px;
  }

  .maze-clue-image {
    max-width: 100%;
    max-height: 600px;
    object-fit: contain;
    border-radius: 8px;
  }

  .toothbrush-clue-image {
    width: 100%;
    max-height: 900px;
    object-fit: contain;
    border-radius: 8px;
  }

  .clue-text {
    font-size: 0.95rem;
    text-align: center;
    line-height: 1.6;
    color: #333;
  }

  .clue-color {
    font-size: 0.85rem;
  }
  .clue-color.red {
    color: #e53e3e;
  }
  .clue-color.blue {
    color: #3182ce;
  }
  .clue-color.yellow {
    color: #d69e2e;
  }
  .clue-color.green {
    color: #38a169;
  }
  .clue-color.purple {
    color: #805ad5;
  }
  .clue-color.orange {
    color: #dd6b20;
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
