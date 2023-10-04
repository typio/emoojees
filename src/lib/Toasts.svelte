<script lang="ts">
    import { toastStore } from "./stores.ts";

    let toasts;
    toastStore.subscribe((value) => {
        toasts = value;
    });
</script>

<div
    class="fixed pointer-events-none bottom-0 right-0 z-50 flex flex-col items-end p-4 mx-4 my-6 space-y-4"
>
    {#each toasts as toast}
        <div
            class="flex items-center p-4 space-x-4 bg-white rounded-xl min-w-[300px] shadow-lg dark:bg-slate-800"
        >
            <div
                class="flex items-center justify-center flex-shrink-0 w-10 h-10 text-2xl rounded-full"
            >
                ✅
            </div>
            <div>
                <p
                    class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                    {toast.title}
                </p>
                <p class="text-lg text-slate-600 dark:text-slate-400">
                    {toast.emoji}
                </p>
            </div>
        </div>
    {/each}
</div>
