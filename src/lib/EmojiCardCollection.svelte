<script lang="ts">
    import fuzzysort from "fuzzysort";
    import { writable } from "svelte/store";
    import "@github/g-emoji-element";
    import EmojiIcon from "./EmojiIcon.svelte";
    import type { Emoji, EmojiList } from "./utils";

    export let emojis: EmojiList;
    export let skin_tone = 0;
    export let onEmojiClick: ((emoji: Emoji) => void) | undefined = undefined;

    export const categories_selected = writable<string>(
        window.localStorage.getItem("categories_selected") ??
            '["Smileys & Emotion"]',
    );
    categories_selected.subscribe((value) => {
        window.localStorage.setItem("categories_selected", value);
    });
    let categories_selected_arr = JSON.parse($categories_selected);

    let categories = Object.keys(emojis);

    export let search_query = "";

    $: allCategoriesSelected =
        categories_selected_arr.length === categories.length;

    const flatEmojiList = Object.values(emojis).reduce(
        (acc, curr) => [
            ...acc,
            ...Object.values(curr).reduce(
                (acc2, curr2) => [...acc2, ...Object.values(curr2)],
                [],
            ),
        ],
        [],
    );

    const searchableEmojis = flatEmojiList.map((emoji) => ({
        ...emoji,
        searchName: emoji.name || "",
        searchSlug: emoji.slug || "",
        searchAliases: emoji.aliases?.join(" ") || "",
    }));

    $: searchResults =
        search_query.trim().length === 0
            ? []
            : (() => {
                  const results = fuzzysort.go(
                      search_query.trim(),
                      searchableEmojis,
                      {
                          keys: ["searchName", "searchSlug", "searchAliases"],
                          limit: 70,
                          threshold: 0.2,
                      },
                  );
                  return results.map((result) => result.obj);
              })();
</script>

{#if search_query.length === 0}
    <div
        class="text-sm font-semibold flex select-none relative flex-wrap mx-auto mb-10 w-fit max-w-3xl justify-center gap-2"
    >
        {#if !allCategoriesSelected}
            <button
                class="
                       bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400
                       rounded-xl px-4 py-3 min-w-[100px] font-medium
                       hover:bg-green-200 dark:hover:bg-green-900/30"
                on:click={() => {
                    categories_selected_arr = categories;
                    $categories_selected = JSON.stringify(
                        categories_selected_arr,
                    );
                    categories = categories;
                }}
            >
                Show all
            </button>
        {:else}
            <button
                class="
                       bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400
                       rounded-xl px-4 py-3 min-w-[100px] font-medium
                       hover:bg-red-200 dark:hover:bg-red-900/30"
                on:click={() => {
                    categories_selected_arr = [];
                    $categories_selected = JSON.stringify(
                        categories_selected_arr,
                    );
                    categories = categories;
                }}
            >
                Hide all
            </button>
        {/if}
        {#each categories as category (category)}
            <button
                class="group relative rounded-xl px-4 py-3 min-w-[112px] font-medium transition-all duration-200
                       {categories_selected_arr.includes(category)
                    ? 'bg-accent text-slate-900 dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50'}"
                on:click={() => {
                    if (categories_selected_arr.includes(category))
                        categories_selected_arr =
                            categories_selected_arr.filter(
                                (e) => e !== category,
                            );
                    else categories_selected_arr.push(category);
                    $categories_selected = JSON.stringify(
                        categories_selected_arr,
                    );
                    categories = categories;
                }}
            >
                {category}
            </button>
        {/each}
    </div>

    <div class="show-all-spacer h-16 lg:h-0" />
{/if}

<div class="mx-auto max-w-3xl">
    {#if search_query.length > 0}
        {#if searchResults.length === 0}
            <div class="flex h-[60vh] justify-center items-center text-center">
                Sorry, no results for <span
                    class="mx-1 px-2 bg-slate-700 rounded"
                >
                    {search_query}
                </span>.
            </div>
        {:else}
            <div class="flex flex-row flex-wrap justify-center">
                {#each searchResults as emoji}
                    <EmojiIcon {emoji} {skin_tone} {onEmojiClick} />
                {/each}
            </div>
        {/if}
    {:else}
        {#each categories as category (category)}
            {#if categories_selected_arr.includes(category)}
                <div
                    class="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 mb-8 rounded-3xl"
                >
                    <h2 class="text-2xl font-semibold" id={category}>
                        <header>{category}</header>
                    </h2>
                    {#each Object.keys(emojis[category]) as subcategory (subcategory)}
                        <div class="my-6">
                            {#if subcategory !== "GitHub"}
                                <h3 class="font-medium">
                                    <header>
                                        {subcategory
                                            .replaceAll("-", " ")
                                            .replace(/\w\S*/g, (txt) => {
                                                return (
                                                    txt
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    txt.slice(1).toLowerCase()
                                                );
                                            })}
                                    </header>
                                </h3>
                            {/if}
                            <div
                                class="text-center flex flex-row flex-wrap justify-center"
                            >
                                {#each Object.entries(emojis[category][subcategory]) as [slug, emoji] (slug)}
                                    <EmojiIcon
                                        {emoji}
                                        {skin_tone}
                                        {onEmojiClick}
                                    />
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        {/each}
    {/if}
</div>

<!--  Emoji Care Guide: Take the time to find the right one. Emojis are created for -->
<!-- specific purposes by people far wiser than you, if your use-case is valid, one -->
<!-- perfect emoji will exist for it, if you can't find it, remember you are at -->
<!-- fault, not the creators of emoji. Do not overcrowd your emoji, emojis are like -->
<!-- apex predators--they need a territory to control.  -->

<style>
</style>
