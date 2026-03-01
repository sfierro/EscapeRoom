<script>
  import { roomsById } from "./rooms";
  import {
    gameState,
    saveGame,
    loadGame,
    resetGame,
    formatElapsedTime,
  } from "./game-state.svelte";
  import { alertRegistry } from "./alert-registry";
  import Hotspot from "./Hotspot.svelte";
  import Navigation from "./Navigation.svelte";
  import TextAlert from "./alerts/ui/TextAlert.svelte";
  import outsideImage from "./assets/rooms/outside.jpg";

  let activeText = $state(null);

  // ─── Derived state ───────────────────────────────────────────
  const currentRoom = $derived(roomsById.get(gameState.currentRoomId));
  const hasPreviousRoom = $derived(!!currentRoom.previousRoomId);
  const hasNextRoom = $derived(!!currentRoom.nextRoomId);

  const displayImage = $derived(
    gameState.showingOutside ? outsideImage : currentRoom.image,
  );
  const displayName = $derived(
    gameState.showingOutside ? "Outside" : currentRoom.name,
  );

  const ActiveAlert = $derived(
    gameState.activeHotspotId
      ? (alertRegistry[gameState.activeHotspotId] ?? null)
      : null,
  );

  // ─── Navigation ──────────────────────────────────────────────
  function navigateToRoom(roomId) {
    if (roomsById.has(roomId)) {
      gameState.currentRoomId = roomId;
      gameState.showingOutside = false;
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

  // ─── Hotspot click routing ───────────────────────────────────
  function handleHotspotClick(hotspot) {
    if (hotspot.navigateTo) {
      navigateToRoom(hotspot.navigateTo);
    } else if (hotspot.text) {
      activeText = hotspot.text;
    } else if (hotspot.alertId && alertRegistry[hotspot.alertId]) {
      gameState.activeHotspotId = hotspot.alertId;
    }
  }

  // ─── Drag prevention ────────────────────────────────────────
  function handleDragStart(e) {
    e.preventDefault();
    return false;
  }

  // ─── Load saved game on startup ──────────────────────────────
  loadGame();
</script>

<main>
  <div class="home-screen">
    <div class="game-container">
      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
      <div
        class="image-container"
        role="button"
        tabindex="0"
        aria-label="room-image"
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
        {#if !gameState.showingOutside && currentRoom.hotspots.length > 0}
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
                onClick={() => handleHotspotClick(hotspot)}
              />
            {/each}
          </svg>
        {/if}
        {#if !gameState.showingOutside}
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
            onPrevious={() => (gameState.showingOutside = false)}
            onNext={() => {}}
          />
        {/if}
        {#if gameState.showingOutside}
          <div class="escaped-overlay">
            <h1 class="escaped-text">You Escaped!</h1>
            {#if gameState.escapeTotalMs != null}
              <p class="escaped-time">You escaped in {formatElapsedTime(gameState.escapeTotalMs)}</p>
            {/if}
          </div>
        {/if}
      </div>
      <div class="inventory-container" class:hidden={gameState.showingOutside}>
        <div class="inventory-title">Inventory</div>
        <div class="inventory-slots">
          {#each Array(12) as _, i}
            <div class="inventory-slot">
              {#if gameState.inventory[i] === "key"}
                <span class="inventory-item">🔑</span>
              {:else if gameState.inventory[i] === "toothbrush"}
                <span class="inventory-item">🪥</span>
              {:else if gameState.inventory[i] === "screwdriver"}
                <span class="inventory-item">🪛</span>
              {/if}
            </div>
          {/each}
        </div>
        <div class="action-buttons">
          <button class="action-btn" onclick={() => {}}>💡 Hint</button>
          <button class="action-btn" onclick={resetGame}>🔄 Restart Game</button
          >
          <button class="action-btn" onclick={saveGame}>💾 Save Game</button>
          <button class="action-btn exit-btn" onclick={() => window.close()}
            >🚪 Exit Game</button
          >
        </div>
      </div>
    </div>

    <!-- ═══════════════ DYNAMIC ALERT SLOT ═══════════════ -->
    {#if ActiveAlert}
      <ActiveAlert />
    {/if}
    {#if activeText}
      <TextAlert text={activeText} onClose={() => (activeText = null)} />
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

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: auto;
    flex-shrink: 0;
  }

  .action-btn {
    width: 100%;
    padding: 8px 12px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #fff;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }

  .action-btn:hover {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .action-btn:active {
    background: rgba(255, 255, 255, 0.08);
    transform: scale(0.97);
  }

  .action-btn.exit-btn {
    background: rgba(220, 50, 50, 0.25);
    border-color: rgba(220, 50, 50, 0.5);
  }

  .action-btn.exit-btn:hover {
    background: rgba(220, 50, 50, 0.4);
    border-color: rgba(220, 50, 50, 0.7);
  }

  .escaped-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
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

  .escaped-time {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    margin-top: 0.5rem;
    text-shadow:
      0 0 12px rgba(255, 255, 255, 0.4),
      2px 2px 4px rgba(0, 0, 0, 0.7);
    letter-spacing: 0.05em;
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
