<script lang="ts">
    // import { buildEmojiJSON } from "./scripts/BuildJSON";
    // console.log(buildEmojiJSON())

    import type { Emoji, EmojiList } from "./scripts/BuildJSON";

    import EmojiCard from "./EmojiCard.svelte";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import git_emojis_import from "../assets/git_emojis.json";
    import "@github/g-emoji-element";

    import Toasts from "./Toasts.svelte";

    let git_emojis: EmojiList = git_emojis_import;

    export let skin_tone = 0;
    export let emoji_mode = "code";

    export const categories_selected = writable<string>(
        window.localStorage.getItem("categories_selected") ??
            '["Smileys & Emotion"]'
    );
    categories_selected.subscribe((value) => {
        window.localStorage.setItem("categories_selected", value);
    });
    let categories_selected_arr = JSON.parse($categories_selected);

    let categories = Object.keys(git_emojis);

    export let search_query = "";

    let sendToast;
    const doToast = (title: string, description: string, duration: number) => {
        sendToast(title, description, duration);
    };
</script>

<Toasts bind:addToast={sendToast} />

<div
    class="flex select-none flex-wrap mx-auto mb-10 max-w-2xl place-content-evenly text-white"
>
    {#each categories as category}
        <button
            class={`w-28 px-4 py-2 h-16 mx-1 my-3 rounded-xl transition-all font-semibold
        ${
            categories_selected_arr.includes(category)
                ? `translate-y-[4px] bg-indigo-400 dark:bg-pink-400 `
                : `bg-indigo-500 dark:bg-pink-500
        [box-shadow:0_4px_0_0_#4f46e5] dark:[box-shadow:0_4px_0_0_#db2777]`
        }`}
            on:click={() => {
                if (categories_selected_arr.includes(category))
                    categories_selected_arr = categories_selected_arr.filter(
                        (e) => e !== category
                    );
                else categories_selected_arr.push(category);
                // var scrollTarget = document.getElementById(category).offsetTop;
                // window.scrollTo({ top: scrollTarget - 95, behavior: "smooth" });
                $categories_selected = JSON.stringify(categories_selected_arr);
                categories = categories;
            }}
        >
            {category}
        </button>
    {/each}
</div>

<div class="mx-auto max-w-3xl">
    {#each categories as category}
        {#if categories_selected_arr.includes(category) || search_query.length > 0}
            {#if search_query.length === 0}
                <h2 class="text-2xl font-semibold" id={category}>
                    <header>{category}</header>
                </h2>
            {/if}
            {#if category === "Custom"}
                {#each Object.values(git_emojis[category]) as emoji}
                    <div class="my-6">
                        {#if emoji.name.constructor === String && emoji.fallback_url.constructor === String}
                            {#if emoji.name.includes(search_query) || search_query.length === 0}
                                <button
                                    class={`text-3xl w-1/4 md:w-auto font-emoji p-6 hover:bg-slate-200
              dark:hover:bg-slate-700 rounded-xl`}
                                    on:click={() => {
                                        navigator.clipboard.writeText(
                                            `:${emoji.name}:`
                                        );
                                    }}
                                >
                                    <img
                                        class="w-6"
                                        src={emoji.fallback_url}
                                        alt={emoji.name}
                                    />
                                </button>
                            {/if}
                        {/if}
                    </div>
                {/each}
            {:else}
                {#each Object.keys(git_emojis[category]) as subcategory}
                    <div class="my-6">
                        {#if search_query.length === 0}
                            <h3 class="ml-8 font-medium">
                                <header>
                                    {subcategory
                                        .replaceAll("-", " ")
                                        .replace(/\w\S*/g, (txt) => {
                                            return (
                                                txt.charAt(0).toUpperCase() +
                                                txt.slice(1).toLowerCase()
                                            );
                                        })}
                                </header>
                            </h3>
                        {/if}
                        <div class="text-center">
                            {#each Object.entries(git_emojis[category][subcategory]) as [slug, emoji]}
                                {#if slug.includes(search_query) || emoji.name.includes(search_query) || search_query.length === 0}
                                    <button
                                        class={`text-3xl w-1/4 md:w-auto font-emoji p-6 hover:bg-slate-200
              dark:hover:bg-slate-700 rounded-xl`}
                                        on:click={() => {
                                            if (emoji_mode === "code") {
                                                navigator.clipboard.writeText(
                                                    `:${slug}:`
                                                );
                                                doToast(
                                                    "Copied!",
                                                    `:${slug}:`,
                                                    2000
                                                );
                                            } else {
                                                navigator.clipboard.writeText(
                                                    emoji.emoji
                                                );
                                                doToast(
                                                    "Copied!",
                                                    emoji.emoji,
                                                    2000
                                                );
                                            }
                                            sendToast = sendToast;
                                        }}
                                    >
                                        <g-emoji tone={skin_tone}>
                                            {emoji.emoji}
                                        </g-emoji>
                                    </button>
                                {/if}
                            {/each}
                        </div>
                    </div>
                {/each}
            {/if}
        {/if}
    {/each}
</div>

<!-- <EmojiCard -->
<!--     emoji="👋" -->
<!--     slug=":waving_hand:" -->
<!--     name="Waving Hand" -->

<!-- /> -->
<style>
</style>
