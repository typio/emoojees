<script lang="ts">
  import { onMount } from "svelte";

  import { writable } from "svelte/store";
  const defaultValue = "dark";
  const initialValue = window.localStorage.getItem("theme") ?? defaultValue;
  export const theme = writable<string>(initialValue);
  theme.subscribe((value) => {
    window.localStorage.setItem("theme", value);
  });
  $: if ($theme === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");

  let subtitle_el;

  export let skin_tone = 0;
  export let search_query = "";
  export let emoji_mode = "code";

  let search_el: HTMLElement;
  onMount(() => {
    subtitle_el = document.getElementById("subtitle");
    search_el = document.getElementById("search");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === " " && search_query.length === 0 ) return
    search_el.focus()
    // if (e.key.match(/^[a-zA-Z]$/)) search_query += e.key;
    // if (e.key === "Backspace") search_query = search_query.slice(0, -1);
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
  class="shadow sticky z-10 top-0 py-4 pl-6 bg-white flex flex-row mb-12
  dark:bg-slate-900 dark:text-slate-200"
>
  <button
    class="mr-6 flex flex-row items-center"
    on:click={() => {
      skin_tone = (skin_tone + 1) % 6;
    }}
  >
    <!-- <g-emoji class="w-10 h-10 pt-1 text-2xl" tone={skin_tone}>👋</g-emoji> -->
    <!-- <p>skin tone</p> -->
    <g-emoji class="w-10 h-10 pt-1 text-4xl" tone={skin_tone}>
      {["👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👩", "🧓", "👴", "👵"][
        Math.floor(Math.random() * 11)
      ]}
    </g-emoji>
  </button>
  <div class="flex flex-col">
    <h1 class="text-3xl font-semibold ">git emojis</h1>
    <p
      id="subtitle"
      class="text-md overflow-hidden max-h-6 transition-[max-height] duration-300
      ease-in-out "
    >
      because emojis are important
    </p>
  </div>
  <div class="w-fit ring-2 ring-pink-500 rounded-md ml-[8vw] my-auto h-10 p-2 flex flex-row items-center">
    <input
      id="search"
      class="focus:outline-none bg-[rgba(0,0,0,0)] focus:border-none"
      bind:value={search_query}
      type="text"
      autocomplete="off"
    />
    <p>🔍</p>
  </div>
  <button
    class="ml-auto mr-6 flex flex-row items-center"
    on:click={() => {
      emoji_mode = emoji_mode === "emoji" ? "text" : "emoji";
    }}
  >
    <p>
      {@html emoji_mode === "emoji"
        ? "📎"
        : `<span class="bg-gray-200 p-1 rounded dark:text-slate-200
        dark:bg-slate-700">:paperclip:</span>`}
    </p>
  </button>
  <button
    class="mr-6 text-2xl"
    on:click={() => {
      $theme === "light" ? theme.set("dark") : theme.set("light");
    }}
  >
    {$theme === 'light' ? '☀ ' : '🌙'}
  </button>
  <button
    class="mr-4 text-3xl"
    on:click={() => {
      window.scroll(0, 0);
    }}
    >🔝
  </button>
</div>

<style>
</style>
