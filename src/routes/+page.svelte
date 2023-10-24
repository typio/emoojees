<script lang="ts">
    import Header from "$lib/Header.svelte";
    // import EmojiGuide from "$lib/EmojiGuide.svelte";
    // import EmojiCardCollection from "$lib/EmojiCardCollection.svelte";
    // import Footer from "$lib/Footer.svelte";
    // import Toasts from "$lib/Toasts.svelte";

    let emoji_mode = "emoji";
    let search_query = "";
</script>

<main>
    <!-- <Toasts /> -->

    <div class="min-h-screen">
        <Header bind:emoji_mode bind:search_query />
        <!-- <div class="px-10">
            {#if search_query.length === 0}
                <EmojiGuide bind:emoji_mode />
            {/if}

            <EmojiCardCollection
                bind:skin_tone
                bind:emoji_mode
                bind:search_query
            />
        </div> -->
    </div>
    <!-- <Footer /> -->
</main>
