<script lang="ts">
    import Header from "./lib/Header.svelte";
    import EmojiGuide from "./lib/EmojiGuide.svelte";
    import EmojiCardCollection from "./lib/EmojiCardCollection.svelte";
    import Footer from "./lib/Footer.svelte";
    import { Toaster } from "svelte-french-toast";
    import { writable } from "svelte/store";
    import type { Emoji, EmojiList } from "./lib/utils";
    import { copyToast } from "./lib/utils";
    import emojis_import from "./assets/emojis.json";

    const emojis: EmojiList = emojis_import;

    let skin_tone = 0;
    let emoji_mode: "emoji" | "code" = "emoji";
    let search_query = "";

    const storedRecent = window.localStorage.getItem("recent_emojis");
    const initialRecent: string[] = storedRecent
        ? JSON.parse(storedRecent)
        : [];

    export const recent_emojis = writable<string[]>(initialRecent);

    recent_emojis.subscribe((value) => {
        window.localStorage.setItem("recent_emojis", JSON.stringify(value));
    });

    function handleEmojiClick(emoji: Emoji) {
        if (emoji.emoji === undefined || emoji_mode === "code") {
            navigator.clipboard.writeText(`:${emoji.slug}:`);
            copyToast(`:${emoji.slug}:`);
        } else {
            navigator.clipboard.writeText(emoji.emoji);
            copyToast(`${emoji.emoji}`);
        }

        recent_emojis.update((current) => {
            const recentEmoji = emoji.slug;
            const filtered = current.filter((e) => e !== emoji.slug);
            return [recentEmoji, ...filtered].slice(0, 50);
        });
    }
</script>

<main>
    <div class="min-h-screen">
        <Header bind:skin_tone bind:emoji_mode bind:search_query />

        <div class="px-10">
            {#if search_query.length === 0}
                <div class="text-center my-12 max-w-xl mx-auto">
                    <h2
                        class="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-200"
                    >
                        GitHub emoji cheat sheet.
                    </h2>
                    <p class="mt-2 text-slate-800 dark:text-slate-300">
                        Quick emoji loopup for your commit messages.
                    </p>
                </div>

                <EmojiGuide
                    {emojis}
                    recent_emoji_slugs={recent_emojis}
                    {skin_tone}
                    onEmojiClick={handleEmojiClick}
                />
            {/if}

            <EmojiCardCollection
                {emojis}
                bind:skin_tone
                bind:search_query
                onEmojiClick={handleEmojiClick}
            />
        </div>
    </div>
    <Footer />

    <Toaster />
</main>
