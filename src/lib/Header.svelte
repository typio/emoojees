<script lang="ts">
    import { onMount } from "svelte";

    import { writable } from "svelte/store";
    export const theme = writable<string>(
        window.localStorage.getItem("theme") ?? "dark"
    );
    theme.subscribe((value) => {
        window.localStorage.setItem("theme", value);
    });
    $: if ($theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    // not useful because <g-emoji> doesnt take this value on init for some reason
    export const tone = writable<string>(
        window.localStorage.getItem("tone") ?? "0"
    );
    tone.subscribe((value) => {
        window.localStorage.setItem("tone", value);
    });

    export const mode = writable<string>(
        window.localStorage.getItem("mode") ?? "code"
    );
    mode.subscribe((value) => {
        window.localStorage.setItem("mode", value);
    });

    let subtitle_el: HTMLElement;

    export let skin_tone = 0;
    export let search_query = "";
    export let emoji_mode = "code";

    let search_el: HTMLElement;
    onMount(() => {
        subtitle_el = document.getElementById("subtitle");
        search_el = document.getElementById("search");

        // skin_tone = parseInt($tone);
        emoji_mode = $mode;
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === " " && search_query.length === 0) return;
        if (e.key.match(/^([a-zA-Z ]|Backspace)$/) === null) return;
        search_el.focus();
    });

    document.addEventListener("scroll", () => {
        if (window.scrollY > 0) {
            subtitle_el.classList.add(["max-h-0"]);
            subtitle_el.classList.add(["scale-y-0"]);

            subtitle_el.classList.remove(["max-h-6"]);
        } else {
            subtitle_el.classList.remove(["max-h-0"]);
            subtitle_el.classList.remove(["scale-y-0"]);

            subtitle_el.classList.add(["max-h-6"]);
        }
    });
</script>

<div
    class="shadow sticky z-10 top-0 py-4 px-6 bg-white flex mb-12
  dark:bg-[#020617] dark:text-slate-200 flex-col md:flex-row"
>
    <div class="flex flex-row">
        <button
            class="mr-2 md:mr-6 flex flex-row items-center"
            on:click={() => {
                skin_tone = (skin_tone + 1) % 6;
                tone.set("" + skin_tone);
            }}
            aria-label="Cycle emoji skin tones"
        >
            <!-- <g-emoji class="w-10 h-10 pt-1 text-2xl" tone={skin_tone}>👋</g-emoji> -->
            <!-- <p>skin tone</p> -->
            <g-emoji
                class="w-10 h-10 pt-1 text-2xl md:text-4xl"
                tone={skin_tone}
            >
                {[
                    "👶",
                    "🧒",
                    "👦",
                    "👧",
                    "🧑",
                    "👱",
                    "👨",
                    "🧔",
                    "👩",
                    "🧓",
                    "👴",
                    "👵",
                ][Math.floor(Math.random() * 11)]}
            </g-emoji>
        </button>
        <div class="flex flex-col">
            <h1 class="text-2xl md:text-3xl font-semibold"
            on:click={() => {
                search_query = "";
                window.scroll(0, 0);
            }}
            >emoojees</h1>
            <p
                id="subtitle"
                class="text-md overflow-hidden max-h-6 transition-[max-height] duration-300
      ease-in-out"
            >
                because emojis are important
            </p>
        </div>
    </div>
    <div
        class="w-fit ring-2 ring-indigo-500 dark:ring-pink-500 rounded-md h-10 mx-auto mt-4 md:m-auto p-2 flex flex-row items-center"
    >
        <input
            id="search"
            class="focus:outline-none bg-[rgba(0,0,0,0)] focus:border-none"
            bind:value={search_query}
            type="text"
            autocomplete="off"
            placeholder="Search"
            aria-label="Search for emojis"
        />
        <p>🔍</p>
    </div>
    <div class="flex flex-row mx-auto md:mx-0 mt-2 md:my-auto">
        <button
            aria-label="Toggle emoji copy mode"
            class="mr-6 flex flex-row items-center md:w-[84.14px]"
            on:click={() => {
                emoji_mode = emoji_mode === "emoji" ? "code" : "emoji";
                mode.set(emoji_mode);
            }}
        >
            <p class="ml-auto mr-0 text-center">
                {@html emoji_mode === "emoji"
                    ? "📎"
                    : `<span class="bg-gray-200 p-1 rounded dark:text-slate-200
        dark:bg-slate-700">:paperclip:</span>`}
            </p>
        </button>
        <button
            aria-label="Toggle dark mode"
            class="mr-6 text-2xl"
            on:click={() => {
                $theme === "light" ? theme.set("dark") : theme.set("light");
            }}
        >
            {$theme === "light" ? "☀ " : "🌙"}
        </button>
        <button
            aria-label="Scroll to top"
            class="text-3xl"
            on:click={() => {
                window.scroll(0, 0);
            }}
            >🔝
        </button>
    </div>
</div>

<style>
</style>
