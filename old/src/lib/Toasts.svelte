<script lang="ts">
    import { toastStore } from "./stores.ts";

    let toasts;
    toastStore.subscribe((value) => {
        toasts = value;
    });
</script>

<div
    class="fixed pointer-events-none bottom-0 right-0 z-50 flex flex-col items-end p-4"
>
    <!-- {#each toasts as toast}
    {/each} -->

    {#if toasts.length > 0}
        <div
            class="flex items-center px-2 py-3 space-x-4 bg-slate-50 rounded-lg pr-8 shadow-xl dark:bg-slate-700"
        >
            <div
                class="flex items-center justify-center flex-shrink-0 w-10 h-10 text-2xl rounded-full"
            >
                ✅
            </div>
            <div>
                <p
                    class="text-sm font-medium text-slate-700 dark:text-slate-100"
                >
                    {toasts.at(-1).title}
                </p>
                <p class="{toasts.at(-1).emoji_mode === 'emoji' ? 'text-3xl' : 'text-base'} text-slate-600 dark:text-slate-300">
                    {toasts.at(-1).emoji}
                </p>
            </div>
        </div>
    {/if}
</div>
