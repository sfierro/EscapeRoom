<script>
    import {
        gameState,
        setActiveGame,
        saveGame,
        loadGame,
        resetGame,
        check,
        closeAlert,
        openPuzzle,
        openText,
        openHintPanel,
        closeHintPanel,
        formatElapsedTime,
    } from "./game-state.svelte";

    import { houseGame } from "./games/house/index";
    import { zooGame } from "./games/zoo/index";
    import { getCurrentObjective } from "./engine/hints";

    import Hotspot from "./Hotspot.svelte";
    import Navigation from "./Navigation.svelte";
    import TextAlert from "./alerts/ui/TextAlert.svelte";
    import PuzzleAlert from "./engine/PuzzleAlert.svelte";
    import HintPanel from "./engine/HintPanel.svelte";

    // ─── Bootstrap the active game ─────────────────────────────
    // Select via `?game=zoo` query string in dev; defaults to house.
    // Production builds will hardcode whichever game is being shipped.
    const GAMES = { house: houseGame, zoo: zooGame };
    const requestedGameId =
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("game")
            : null;
    const game =
        (requestedGameId && GAMES[requestedGameId]) || houseGame;
    setActiveGame(game);

    const roomsById = new Map(game.rooms.map((r) => [r.id, r]));

    // ─── Derived state ─────────────────────────────────────────
    const currentRoom = $derived(roomsById.get(gameState.currentRoomId));

    const hasPreviousRoom = $derived(
        !!currentRoom?.previous && check(currentRoom.previous.requires),
    );
    const hasNextRoom = $derived(
        !!currentRoom?.next && check(currentRoom.next.requires),
    );

    const displayImage = $derived(
        gameState.showingOutside ? game.outsideImage : currentRoom?.image,
    );
    const displayName = $derived(
        gameState.showingOutside ? "Outside" : (currentRoom?.name ?? ""),
    );

    const currentObjective = $derived(
        getCurrentObjective(game, {
            flags: gameState.flags,
            inventory: gameState.inventory,
        }),
    );

    // ─── Navigation ────────────────────────────────────────────
    function navigateToRoom(roomId) {
        if (roomsById.has(roomId)) {
            gameState.currentRoomId = roomId;
            gameState.showingOutside = false;
        }
    }

    function goToPreviousRoom() {
        if (currentRoom?.previous) {
            navigateToRoom(currentRoom.previous.roomId);
        }
    }

    function goToNextRoom() {
        if (currentRoom?.next) {
            navigateToRoom(currentRoom.next.roomId);
        }
    }

    // ─── Hotspot click routing ─────────────────────────────────
    function handleHotspotClick(hotspot) {
        if (hotspot.navigateTo) {
            navigateToRoom(hotspot.navigateTo);
        } else if (hotspot.text) {
            openText(hotspot.text);
        } else if (hotspot.puzzleId) {
            openPuzzle(hotspot.puzzleId);
        }
    }

    function handleDragStart(e) {
        e.preventDefault();
        return false;
    }

    // ─── Inventory lookup ──────────────────────────────────────
    const itemsById = new Map(game.items.map((i) => [i.id, i]));

    function emojiFor(itemId) {
        return itemsById.get(itemId)?.emoji ?? "?";
    }

    // ─── Load saved game on startup ────────────────────────────
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
                {#if !gameState.showingOutside && currentRoom?.hotspots?.length}
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
                            <p class="escaped-time">
                                You escaped in {formatElapsedTime(
                                    gameState.escapeTotalMs,
                                )}
                            </p>
                        {/if}
                    </div>
                {/if}
            </div>
            <div
                class="inventory-container"
                class:hidden={gameState.showingOutside}
            >
                <div class="inventory-title">Inventory</div>
                <div class="inventory-slots">
                    {#each Array(8) as _, i}
                        <div class="inventory-slot">
                            {#if gameState.inventory[i]}
                                <span class="inventory-item"
                                    >{emojiFor(gameState.inventory[i])}</span
                                >
                            {/if}
                        </div>
                    {/each}
                </div>
                <div class="action-buttons">
                    {#if currentObjective}
                        <button
                            class="action-btn hint-btn"
                            onclick={openHintPanel}
                            aria-label="Show hint"
                        >
                            💡 Hint
                        </button>
                    {/if}
                    <button class="action-btn" onclick={resetGame}
                        >🔄 Restart</button
                    >
                    <button class="action-btn" onclick={saveGame}
                        >💾 Save</button
                    >
                    <button
                        class="action-btn exit-btn"
                        onclick={() => window.close()}>🚪 Exit</button
                    >
                </div>
            </div>
        </div>

        <!-- ═══════════════ DYNAMIC ALERT SLOT ═══════════════ -->
        {#if gameState.activeHotspotId}
            <PuzzleAlert puzzleId={gameState.activeHotspotId} />
        {/if}
        {#if gameState.activeText}
            <TextAlert
                text={gameState.activeText}
                onClose={closeAlert}
            />
        {/if}
        {#if gameState.hintPanelOpen}
            <HintPanel />
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
        font-family: "Courier New", Courier, monospace;
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 12px;
        text-align: center;
        flex-shrink: 0;
    }

    .inventory-slots {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
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
        font-size: 1rem;
        font-weight: 600;
        font-family: "Courier New", Courier, monospace;
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

    .action-btn.hint-btn {
        background: rgba(245, 158, 11, 0.25);
        border-color: rgba(245, 158, 11, 0.5);
    }

    .action-btn.hint-btn:hover {
        background: rgba(245, 158, 11, 0.4);
        border-color: rgba(245, 158, 11, 0.7);
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
