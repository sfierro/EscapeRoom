<script>
    import { gameState, closeAlert } from "../game-state.svelte";
    import Alert from "../Alert.svelte";
    import remoteImage from "../assets/clues/remote.png";
    import tvImage from "../assets/clues/tv.png";

    const CORRECT_CHANNEL = "41";
    const MAX_DIGITS = 2;

    let channelInput = $state("");
    let flash_wrong = $state(false);

    const numberButtons = [
        { n: 1, x: 42.7, y: 58.4 },
        { n: 2, x: 49.9, y: 58.6 },
        { n: 3, x: 57.6, y: 58.6 },
        { n: 4, x: 42.4, y: 64.9 },
        { n: 5, x: 50.1, y: 64.6 },
        { n: 6, x: 57.6, y: 64.7 },
        { n: 7, x: 42.2, y: 70.8 },
        { n: 8, x: 50.3, y: 71.1 },
        { n: 9, x: 57.6, y: 71.3 },
        { n: 0, x: 49.9, y: 77.3 },
    ];

    function pressNumber(n) {
        if (flash_wrong) return;
        if (channelInput.length >= MAX_DIGITS) channelInput = "";
        channelInput += String(n);
    }

    function pressOK() {
        if (flash_wrong || !channelInput) return;
        if (channelInput === CORRECT_CHANNEL) {
            gameState.tvCorrectChannel = true;
        } else {
            flash_wrong = true;
            setTimeout(() => {
                channelInput = "";
                flash_wrong = false;
            }, 1000);
        }
    }

    function pressBack() {
        if (flash_wrong) return;
        channelInput = channelInput.slice(0, -1);
    }
</script>

{#if gameState.tvCorrectChannel}
    <Alert onClose={closeAlert}>
        <div class="tv-container">
            <img src={tvImage} alt="TV" class="tv-image" />
            <div class="symbols-overlay">
                <svg
                    class="symbol"
                    style="animation-delay: 1.5s"
                    viewBox="0 0 24 24"
                >
                    <polygon
                        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                        fill="currentColor"
                    />
                </svg>
                <svg
                    class="symbol"
                    style="animation-delay: 3.0s"
                    viewBox="0 0 24 24"
                >
                    <polygon
                        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                        fill="currentColor"
                    />
                </svg>
                <svg
                    class="symbol"
                    style="animation-delay: 4.5s"
                    viewBox="0 0 24 24"
                >
                    <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        fill="currentColor"
                    />
                </svg>
                <svg
                    class="symbol"
                    style="animation-delay: 6.0s"
                    viewBox="0 0 24 24"
                >
                    <polygon points="12,2 23,21 1,21" fill="currentColor" />
                </svg>
                <svg
                    class="symbol"
                    style="animation-delay: 7.5s"
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                </svg>
            </div>
        </div>
    </Alert>
{:else}
    <Alert onClose={closeAlert}>
        <div class="remote-alert-content">
            <div class="remote-container">
                <img src={remoteImage} alt="Remote" class="remote-image" />

                {#each numberButtons as btn}
                    <button
                        class="remote-btn num-btn"
                        style="left: {btn.x}%; top: {btn.y}%"
                        onclick={() => pressNumber(btn.n)}
                        aria-label="Number {btn.n}"
                    ></button>
                {/each}

                <button
                    class="remote-btn ok-btn"
                    style="left: 50.1%; top: 27.8%"
                    onclick={pressOK}
                    aria-label="OK"
                ></button>

                <button
                    class="remote-btn back-btn"
                    style="left: 50.1%; top: 51.0%"
                    onclick={pressBack}
                    aria-label="Back"
                ></button>
            </div>

            <p class="channel-display" class:wrong={flash_wrong}>
                CH {channelInput || "--"}
            </p>
        </div>
    </Alert>
{/if}

<style>
    .tv-container {
        position: relative;
        display: inline-block;
        line-height: 0;
    }

    .tv-image {
        max-width: 100%;
        max-height: 500px;
        object-fit: contain;
        border-radius: 8px;
        display: block;
    }

    .symbols-overlay {
        position: absolute;
        top: 43%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
    }

    .symbol {
        grid-area: 1 / 1;
        width: 96px;
        height: 96px;
        color: #555;
        opacity: 0;
        animation: symbol-flash 10s linear infinite;
    }

    @keyframes symbol-flash {
        0% {
            opacity: 0;
        }
        1% {
            opacity: 1;
        }
        10% {
            opacity: 1;
        }
        11% {
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }

    .remote-alert-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        max-width: 500px;
    }

    .channel-display {
        font-family: "Courier New", Courier, monospace;
        font-size: 1.4rem;
        font-weight: 700;
        letter-spacing: 0.15em;
        padding: 6px 20px;
        min-width: 100px;
        text-align: center;
        margin: 0;
        transition: all 0.3s;
    }

    .channel-display.wrong {
        animation: shake 0.4s ease-in-out;
    }

    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }
        20% {
            transform: translateX(-6px);
        }
        40% {
            transform: translateX(6px);
        }
        60% {
            transform: translateX(-4px);
        }
        80% {
            transform: translateX(4px);
        }
    }

    .remote-container {
        position: relative;
        display: inline-block;
        line-height: 0;
    }

    .remote-image {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
        display: block;
        border-radius: 8px;
        user-select: none;
        -webkit-user-drag: none;
    }

    .remote-btn {
        position: absolute;
        transform: translate(-50%, -50%);
        background: transparent;
        border: 2px solid transparent;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.15s ease;
        padding: 0;
    }

    .remote-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
    }

    .remote-btn:active {
        background: rgba(255, 255, 255, 0.35);
        transform: translate(-50%, -50%) scale(0.92);
    }

    .num-btn {
        width: 6%;
        height: 6%;
    }

    .ok-btn {
        width: 6%;
        height: 6%;
    }

    .back-btn {
        width: 8%;
        height: 4%;
    }
</style>
