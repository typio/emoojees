<script lang="ts">
    import { addToast } from "./utils.ts";

    export let emoji_mode;

    const curated_emojis: {
        emoji: string;
        slug: string;
        purpose: string;
        description: string;
    }[] = [
        {
            emoji: "🎉",
            slug: ":tada:",
            purpose: "Initial Commit",
            description: "Start of a new project.",
        },
        {
            emoji: "🔖",
            slug: ":bookmark:",
            purpose: "Version Tag",
            description: "Specific software release or version.",
        },
        {
            emoji: "✨",
            slug: ":sparkles:",
            purpose: "New Feature",
            description: "New capability addition.",
        },
        {
            emoji: "🐛",
            slug: ":bug:",
            purpose: "Bug Fix",
            description: "Correction of a software error.",
        },
        {
            emoji: "🛡️",
            slug: ":shield:",
            purpose: "Security Fix",
            description: "Security vulnerability patch.",
        },
        {
            emoji: "♻️",
            slug: ":recycle:",
            purpose: "Refactor",
            description: "Improvement of code structure or quality.",
        },
        {
            emoji: "📚",
            slug: ":books:",
            purpose: "Documentation",
            description: "Documentation changes or additions.",
        },
        {
            emoji: "🌍",
            slug: ":earth_africa:",
            purpose: "Globalization",
            description: "Support for new languages or regions.",
        },
        {
            emoji: "♿",
            slug: ":wheelchair:",
            purpose: "Accessibility",
            description: "Enhancements for disability support.",
        },
        {
            emoji: "⚡",
            slug: ":zap:",
            purpose: "Performance",
            description: "Enhancements to software speed.",
        },
        {
            emoji: "🎨",
            slug: ":art:",
            purpose: "UI/UX",
            description: "Visual changes.",
        },
        {
            emoji: "🔧",
            slug: ":wrench:",
            purpose: "Tooling",
            description: "Tool or dependency updates.",
        },
        {
            emoji: "✅",
            slug: ":white_check_mark:",
            purpose: "Tests",
            description: "Test additions or changes.",
        },
        {
            emoji: "🗑️",
            slug: ":wastebasket:",
            purpose: "Removal",
            description: "Deletion of code or functionality.",
        },
        {
            emoji: "🚧",
            slug: ":construction:",
            purpose: "Work In Progress",
            description:
                "Ongoing changes that aren't ready for full review or merge.",
        },
    ];
</script>

<div class="mx-auto max-w-3xl mb-8">
    <div class="flex flex-row items-center mb-2">
        <h1 class="font-semibold text-2xl mr-4">Emoji</h1>
        <h1 class="text-5xl">📖</h1>
    </div>
    <div class="flex flex-row flex-wrap justify-center">
        {#each curated_emojis as c_emoji}
            <button
                on:click={() => {
                    if (emoji_mode === "code") {
                        navigator.clipboard.writeText(`:${c_emoji.slug}:`);
                        addToast("Copied!", `${c_emoji.slug}`, 2000);
                    } else {
                        navigator.clipboard.writeText(c_emoji.emoji);
                        addToast("Copied!", `${c_emoji.emoji}`, 2000);
                    }
                }}
                class="flex flex-col items-center justify-between bg-white dark:bg-slate-800 rounded-2xl shadow-md w-[130px] lg:w-[240px] h-28 my-2 mx-2 py-4 px-4 select-none space-y-2 lg:space-y-0"
            >
                <div
                    class="flex flex-col items-center lg:flex-row w-full lg:justify-between"
                >
                    <h2
                        class="text-xs lg:text-base text-center font-semibold mt-1 mb-3 lg:mb-0"
                    >
                        {c_emoji.purpose}
                    </h2>
                    <h1 class="w-16 text-5xl lg:text-4xl">
                        {c_emoji.emoji}
                    </h1>
                </div>
                <div class="hidden lg:block">
                    <p
                        class="text-xs w-full text-center text-slate-500 dark:text-slate-400"
                    >
                        {c_emoji.description}
                    </p>
                </div>
            </button>
        {/each}
    </div>
</div>
