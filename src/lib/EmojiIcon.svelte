<script lang="ts">
    import type { Emoji } from "./utils";

    export let emoji: Emoji;
    export let skin_tone: number;
    export let variant: "default" | "guide" = "default";
    export let purpose: string = "";
    export let description: string | undefined = undefined;
    export let onEmojiClick: (emoji: Emoji) => void;
    export let index: number | undefined = undefined;
</script>

{#if variant === "guide"}
    <button
        class="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900
               rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700
               p-4 select-none transition-all duration-200 hover:-translate-y-0.5
               flex flex-col [@media(min-width:450px)]:flex-row items-center gap-2 [@media(min-width:450px)]:gap-3 min-h-[4.5rem]"
        on:click={() => {
            onEmojiClick(emoji);
        }}
    >
        <!-- Emoji -->
        <div class="flex-shrink-0">
            <span
                class="text-3xl group-hover:scale-125 transition-transform duration-200 block"
            >
                {#if emoji.emoji === undefined || emoji.qual !== "fully-qualified"}
                    <img
                        class="w-9 h-9 object-contain"
                        src={emoji.fallback_url}
                        alt={emoji.name}
                    />
                {:else}
                    {#key emoji.slug + (index !== undefined ? `-${index}` : "")}
                        <g-emoji
                            fallback-src={emoji.fallback_url}
                            alias={emoji.name}
                            tone={skin_tone}
                        >
                            {emoji.emoji}
                        </g-emoji>
                    {/key}
                {/if}
            </span>
        </div>

        <!-- Text content -->
        <div class="flex-1 text-center [@media(min-width:450px)]:text-left">
            <h3
                class="text-sm [@media(min-width:450px)]:text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight"
            >
                {purpose || emoji.name}
            </h3>
            {#if description}
                <p
                    class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden [@media(min-width:600px)]:block leading-tight"
                >
                    {description}
                </p>
            {/if}
        </div>

        <!-- Hover indicator -->
        <div
            class="absolute inset-0 rounded-2xl ring-2 ring-accent opacity-0
                    group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        />
    </button>
{:else}
    <button
        class={`group text-3xl w-1/4 md:w-auto font-emoji p-4 md:p-6 rounded-xl`}
        on:click={() => {
            onEmojiClick(emoji);
        }}
    >
        <div
            class="group-hover:scale-150 transition-transform w-10 h-10 flex items-center justify-center"
        >
            {#if emoji.emoji === undefined || emoji.qual !== "fully-qualified"}
                <img
                    class="w-full h-full object-contain"
                    src={emoji.fallback_url}
                    alt={emoji.name}
                />
            {:else}
                {#key emoji.slug + (index !== undefined ? `-${index}` : "")}
                    <g-emoji
                        class="text-[2.5rem] leading-none"
                        fallback-src={emoji.fallback_url}
                        alias={emoji.name}
                        tone={skin_tone}
                    >
                        {emoji.emoji}
                    </g-emoji>
                {/key}
            {/if}
        </div>
    </button>
{/if}
