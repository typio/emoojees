<script lang="ts">
  import HistoryIcon from "../assets/history.svelte";

  export let options: string[] = [];
  export let selected: string = options[0] || "";

  let selectedIndex = options.indexOf(selected);

  function handleChange(value: string, index: number) {
    selected = value;
    selectedIndex = index;
  }

  $: highlightStyle =
    selectedIndex !== -1
      ? `transform: translateX(calc(${selectedIndex * 100}% + ${selectedIndex * 4}px));`
      : `visibility: hidden;`;
</script>

<!-- Desktop: Segmented Picker with Sliding Highlight -->
<div class="hidden md:block relative">
  <div
    class="flex bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900
           rounded-2xl p-1.5 gap-1 shadow-sm border border-slate-200 dark:border-slate-700"
  >
    <!-- Sliding highlight -->
    <div
      class="absolute top-1.5 left-1.5 h-[calc(100%-12px)] bg-white dark:bg-slate-700
             rounded-xl shadow-md transition-all duration-300 ease-out pointer-events-none
             border border-slate-200 dark:border-slate-600"
      style="width: calc((100% - 12px - {(options.length - 1) *
        4}px) / {options.length}); {highlightStyle}"
    />

    <!-- Option buttons -->
    {#each options as option, index}
      <button
        class="relative z-10 px-4 py-2 rounded-xl font-medium transition-all duration-200 flex-1 flex flex-row items-center justify-center gap-2
          {selected === option
          ? 'text-slate-900 dark:text-slate-100'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}"
        on:click={() => handleChange(option, index)}
      >
        {#if option === "Recent"}
          <div class="w-4 fill-current">
            <HistoryIcon />
          </div>
        {/if}
        {option}
      </button>
    {/each}
  </div>
</div>

<!-- Mobile: Dropdown -->
<div class="md:hidden relative">
  <div
    class="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900
           rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
  >
    <select
      class="w-full px-4 py-3 rounded-2xl bg-transparent text-slate-900 dark:text-slate-200
             font-medium appearance-none cursor-pointer focus:outline-none
             focus:ring-2 focus:ring-indigo-400 dark:focus:ring-pink-500"
      bind:value={selected}
      on:change={(e) => {
        const index = options.indexOf(e.target.value);
        handleChange(e.target.value, index);
      }}
    >
      {#each options as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400"
    >
      <svg
        class="fill-current h-4 w-4 transition-transform duration-200"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
        />
      </svg>
    </div>
  </div>
</div>

<style>
  select {
    background-image: none;
  }
</style>
