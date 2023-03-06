<script lang="ts">
  import Header from "./lib/Header.svelte";
  import EmojiCardCollection from "./lib/EmojiCardCollection.svelte";
  import Footer from "./lib/Footer.svelte";

  let skin_tone = 0;
  let emoji_mode = "code";
  let search_query = "";
</script>

<main>
  <div class="min-h-screen">
    <Header bind:skin_tone bind:emoji_mode bind:search_query />
    <div class="px-10">
      <EmojiCardCollection bind:skin_tone bind:emoji_mode bind:search_query />
    </div>
  </div>
  <Footer />
</main>
