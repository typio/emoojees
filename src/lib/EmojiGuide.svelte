<script lang="ts">
    import GuidePicker from "./GuidePicker.svelte";
    import EmojiIcon from "./EmojiIcon.svelte";
    import { flip } from "svelte/animate";

    import type { Emoji, EmojiList } from "./utils";
    import type { Writable } from "svelte/store";

    export let emojis: EmojiList;
    export let recent_emoji_slugs: Writable<string[]>;
    export let onEmojiClick: (emoji: Emoji) => void;
    export let skin_tone = 0;

    let guide_selection_value =
        window.localStorage.getItem("guide_selection") ?? "Emoojees";

    $: if (typeof window !== "undefined") {
        window.localStorage.setItem("guide_selection", guide_selection_value);
    }

    const emoojeesList: Array<{
        slug: string;
        purpose: string;
        description: string;
    }> = [
        {
            slug: "tada",
            purpose: "First Commit!",
            description: "Start of a new project.",
        },
        {
            slug: "bookmark",
            purpose: "Version Tag",
            description: "Specific software release or version.",
        },
        {
            slug: "sparkles",
            purpose: "New Feature",
            description: "New capability addition.",
        },
        {
            slug: "bug",
            purpose: "Bug Fix",
            description: "Correction of a software error.",
        },
        {
            slug: "shield",
            purpose: "Security Fix",
            description: "Security vulnerability patch.",
        },
        {
            slug: "recycle",
            purpose: "Refactor",
            description: "Improvement of code structure or quality.",
        },
        {
            slug: "books",
            purpose: "Documentation",
            description: "Documentation changes or additions.",
        },
        {
            slug: "earth_africa",
            purpose: "Globalization",
            description: "Support for new languages or regions.",
        },
        {
            slug: "wheelchair",
            purpose: "Accessibility",
            description: "Enhancements for disability support.",
        },
        {
            slug: "zap",
            purpose: "Performance",
            description: "Enhancements to software speed.",
        },
        {
            slug: "art",
            purpose: "UI/UX",
            description: "Visual changes.",
        },
        {
            slug: "wrench",
            purpose: "Tooling",
            description: "Tool or dependency updates.",
        },
        {
            slug: "white_check_mark",
            purpose: "Tests",
            description: "Test additions or changes.",
        },
        {
            slug: "wastebasket",
            purpose: "Removal",
            description: "Deletion of code or functionality.",
        },
        {
            slug: "construction",
            purpose: "Work In Progress",
            description:
                "Ongoing changes that aren't ready for full review or merge.",
        },
    ];

    const conventionalCommitsList: Array<{
        slug: string;
        purpose: string;
        description: string;
    }> = [
        {
            slug: "bug",
            purpose: "fix",
            description: "Patch a bug.",
        },
        {
            slug: "sparkles",
            purpose: "feat",
            description: "Add a new feature.",
        },
        {
            slug: "bangbang",
            purpose: "BREAKING CHANGE",
            description: "Introduce breaking API change.",
        },
        {
            slug: "wrench",
            purpose: "build",
            description: "Changes to build system or dependencies.",
        },
        {
            slug: "hammer",
            purpose: "chore",
            description: "Maintenance tasks and other changes.",
        },
        {
            slug: "construction_worker",
            purpose: "ci",
            description: "CI/CD configuration and scripts.",
        },
        {
            slug: "books",
            purpose: "docs",
            description: "Documentation changes only.",
        },
        {
            slug: "zap",
            purpose: "perf",
            description: "Performance improvements.",
        },
        {
            slug: "recycle",
            purpose: "refactor",
            description: "Code changes without fixing bugs or adding features.",
        },
        {
            slug: "rewind",
            purpose: "revert",
            description: "Reverting previous commits.",
        },
        {
            slug: "art",
            purpose: "style",
            description: "Code formatting and style changes.",
        },
        {
            slug: "white_check_mark",
            purpose: "test",
            description: "Adding or updating tests.",
        },
    ];

    const slugsToEmojis = (
        list: { slug: string; [key: string]: any }[],
    ): (Emoji & {
        purpose?: string;
        description?: string;
    })[] => {
        return list
            .map((e) => {
                for (const group in emojis) {
                    for (const subgroup in emojis[group]) {
                        for (const emoji of emojis[group][subgroup]) {
                            if (emoji.slug === e.slug)
                                return { ...e, ...emoji };
                        }
                    }
                }
                return undefined;
            })
            .filter(Boolean);
    };

    $: currentList = slugsToEmojis(
        guide_selection_value === "Recent"
            ? $recent_emoji_slugs.map((e) => ({ slug: e }))
            : guide_selection_value === "Emoojees"
              ? emoojeesList
              : guide_selection_value === "Conventional Commits"
                ? conventionalCommitsList
                : emoojeesList,
    );
</script>

<div class="mx-auto max-w-3xl mb-8">
    <GuidePicker
        options={["Recent", "Emoojees", "Conventional Commits"]}
        bind:selected={guide_selection_value}
    />

    {#if guide_selection_value === "Recent"}
        <div class="flex flex-row flex-wrap justify-center">
            {#if currentList.length === 0}
                <div
                    class="text-center text-slate-500 dark:text-slate-400 py-8"
                >
                    No recent emojis yet. Click on any emoji to add it here!
                </div>
            {:else}
                {#each currentList as emoji, index (emoji.slug)}
                    <div animate:flip={{ duration: 300 }}>
                        <EmojiIcon
                            {emoji}
                            {skin_tone}
                            variant="default"
                            purpose={emoji.purpose}
                            description={emoji.description}
                            {onEmojiClick}
                            {index}
                        />
                    </div>
                {/each}
            {/if}
        </div>
    {:else}
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {#each currentList as emoji}
                <EmojiIcon
                    {emoji}
                    {skin_tone}
                    variant="guide"
                    purpose={emoji.purpose}
                    description={emoji.description}
                    {onEmojiClick}
                />
            {/each}
        </div>
    {/if}
</div>
