<script lang="ts">
  import { onMount } from "svelte";

  import { writable } from "svelte/store";
  export const theme = writable<string>(
    window.localStorage.getItem("theme") ?? "dark",
  );
  theme.subscribe((value) => {
    window.localStorage.setItem("theme", value);
  });
  $: if ($theme === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");

  // not useful because <g-emoji> doesnt take this value on init for some reason
  export const tone = writable<string>(
    window.localStorage.getItem("tone") ?? "0",
  );
  tone.subscribe((value) => {
    window.localStorage.setItem("tone", value);
  });

  export const mode = writable<string>(
    window.localStorage.getItem("mode") ?? "emoji",
  );
  mode.subscribe((value) => {
    window.localStorage.setItem("mode", value);
  });

  let title_el: HTMLElement;
  let subtitle_el: HTMLElement;

  export let skin_tone = 0;
  export let search_query = "";
  export let emoji_mode = "emoji";

  let search_el: HTMLElement;
  onMount(() => {
    title_el = document.getElementById("title");
    subtitle_el = document.getElementById("subtitle");
    search_el = document.getElementById("search");

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
      subtitle_el.classList.remove(["max-h-6"]);
      title_el.innerText = "emoojees";
    } else {
      title_el.innerText = "emoojees,";
      subtitle_el.classList.remove(["max-h-0"]);
      subtitle_el.classList.add(["max-h-6"]);
    }
  });
</script>

<div
  class="sticky top-0 py-4 px-6 bg-slate-50 shadow-md dark:shadow-none flex
  dark:bg-slate-950 dark:text-slate-200 flex-col md:flex-row z-20"
>
  <div class="flex flex-row">
    <button
      class="mr-2 md:mr-4 flex flex-row items-center"
      on:click={() => {
        skin_tone = (skin_tone + 1) % 6;
        tone.set("" + skin_tone);
      }}
      aria-label="Cycle emoji skin tones"
    >
      <!-- <g-emoji class="w-10 h-10 pt-1 text-2xl" tone={skin_tone}>👋</g-emoji> -->
      <!-- <p>skin tone</p> -->
      <g-emoji class="w-10 h-10 pt-1 text-2xl md:text-4xl" tone={skin_tone}>
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
    <div class="flex flex-col justify-center">
      <h1 class="text-2xl md:text-3xl font-[Nabla]">
        <a id="title" href="https://emoojees.com">emoojees,</a>
      </h1>
      <p
        id="subtitle"
        class="text-lg overflow-hidden max-h-6 transition-[max-height] duration-300
      ease-in-out font-medium dark:text-accent"
      >
        because emojis are important.
      </p>
    </div>
  </div>
  <!-- Search Bar -->
  <div class="mx-auto mt-4 md:m-auto max-w-lg">
    <div
      class="group flex items-center bg-slate-50 dark:bg-slate-900 rounded-2xl
             shadow-sm hover:shadow-lg border-2 border-slate-200 dark:border-slate-700
             focus-within:border-accent dark:focus-within:border-accent
             transition-all duration-300"
    >
      <span
        class="pl-4 text-xl opacity-60 group-focus-within:opacity-100 transition-opacity"
        >🔍</span
      >
      <input
        id="search"
        class="max-w-3xs py-2 px-4 bg-transparent focus:outline-none text-slate-900 dark:text-slate-100
               placeholder-slate-500 dark:placeholder-slate-400 text-lg font-medium"
        bind:value={search_query}
        type="text"
        autocomplete="off"
        placeholder="Search emojis..."
        aria-label="Search for emojis"
      />
      <button
        class="pr-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition
          {search_query ? 'opacity-100' : 'opacity-0'}"
        on:click={() => (search_query = "")}
        aria-label="Clear search"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="flex flex-row gap-2 mt-4 md:my-auto justify-center">
    <!-- Copy Mode Toggle -->
    <button
      class="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900
             rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700
             p-2.5 transition-all duration-200 hover:-translate-y-0.5"
      aria-label="Toggle emoji copy mode"
      on:click={() => {
        emoji_mode = emoji_mode === "emoji" ? "code" : "emoji";
        mode.set(emoji_mode);
      }}
    >
      <div class="flex items-center justify-center gap-2 w-[56px] sm:w-[82px]">
        {#if emoji_mode === "emoji"}
          <span class="text-xl leading-0 overflow-visible">😊</span>
          <span
            class="text-md font-medium text-slate-600 dark:text-slate-400 hidden sm:block"
            >Emoji</span
          >
        {:else}
          <span class="font-mono text-md text-slate-700 dark:text-slate-300"
            >:code:</span
          >
        {/if}
      </div>
    </button>

    <!-- Theme Toggle -->
    <button
      aria-label="Toggle dark mode"
      class="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900
             rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700
             p-2.5 transition-all duration-200 hover:-translate-y-0.5 w-12 h-12 flex items-center justify-center"
      on:click={() => {
        $theme === "light" ? theme.set("dark") : theme.set("light");
      }}
    >
      <span class="text-xl">{$theme === "light" ? "☀️" : "🌙"}</span>
    </button>

    <!-- Scroll to Top -->
    <button
      aria-label="Scroll to top"
      class="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900
             rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700
             p-2.5 transition-all duration-200 hover:-translate-y-0.5 w-12 h-12 flex items-center justify-center"
      on:click={() => {
        window.scroll({ top: 0, behavior: "smooth" });
      }}
    >
      <span class="text-xl">⬆️</span>
    </button>

    <!-- GitHub Link -->
    <a
      href="https://github.com/typio/emoojees"
      aria-label="View on GitHub"
      class="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900
             rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700
             p-2.5 transition-all duration-200 hover:-translate-y-0.5 w-12 h-12 flex items-center justify-center"
    >
      <svg
        class="fill-slate-700 dark:fill-slate-200 w-6 h-6"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        />
      </svg>
    </a>
  </div>
</div>
