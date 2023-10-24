type UnicodeEmoji =
  { emoji: string, name: string, fallback_url: string, description: string }

type GitHubEmoji =
  { name: string, fallback_url: string }

export type Emoji = UnicodeEmoji | GitHubEmoji

export type EmojiList = {
  [key: string]: {
    [key: string]: {
      [key: string]: Emoji
    } | Emoji
  }
}

export const buildEmojiJSON = async () => {
  // TODO: Setup GitHub Workflow to fetch emojis periodically

  // get GitHub emojis
  // fetch("https://api.github.com/emojis")
  // .then((response) => response.json())
  // .then((data) => console.log(data));

  // get unicode emojis
  // https://unicode.org/emoji/charts/full-emoji-list.html
  // fetch("https://unicode.org/emoji/charts/full-emoji-list.html", {
  //   headers: {
  //     "Content-Type": "text/html",
  //   },
  //   mode: "cors",
  // })
  // .then((response) => response.text())
  // .then((data) => console.log(data));

  const gh_emojis = (await import("../../assets/gh_emojis.json")).default;
  const unicode_html = (await import("../../assets/unicode-emoji-list.html?raw"))
    .default;

  let emojisList: EmojiList = {}

  let gh_unicode_emojis: { [key: string]: { slug: string, fallback_url: string } } = {};
  let gh_custom_emojis: { [key: string]: { fallback_url: string } } = {};

  for (const [key, value] of Object.entries(gh_emojis)) {
    if (value.includes("unicode")) {
      gh_unicode_emojis[value.match(/unicode\/(.*)\.png/)[1]] = {
        slug: key,
        fallback_url: value,
      };
    } else {
      gh_custom_emojis[value.match(/emoji\/(.*)\.png/)[1]] = {
        fallback_url: value,
      };
    }
  }

  const parser = new DOMParser();
  const unicode_doc = parser.parseFromString(unicode_html, "text/html");

  // parse table tag
  const unicode_table = unicode_doc.querySelector("table");
  // console.log(unicode_table)
  // for each row in table

  let currentCategory = "";
  let currentSubcategory = "";
  for (const row of unicode_table.querySelectorAll("tr")) {
    // for each cell in row

    for (const header of row.querySelectorAll("th")) {
      if (header.classList.contains("bighead")) {
        currentCategory = header.textContent;
        if (currentCategory === "Component") continue;
        emojisList[currentCategory] = {}
        continue;
      }
      if (header.classList.contains("mediumhead")) {
        currentSubcategory = header.textContent;
        if (currentSubcategory === "hair-style") continue;
        emojisList[currentCategory][currentSubcategory] = {}
        continue;
      }
    }

    let emoji_text: string;
    let code: string[];
    let name: string;
    for (const cell of row.querySelectorAll("td")) {
      if (cell.classList.contains("chars")) emoji_text = cell.textContent;
      if (cell.classList.contains("code")) code = cell.textContent.split(" ");
      if (cell.classList.contains("name")) name = cell.textContent;
    }

    if (emoji_text === undefined) continue;
    // regex for part after U+ in U+1F3F4
    let unicode_slug = "";
    for (const c of code) {
      unicode_slug += c.match(/U\+(.*)/)[1] + "-";
    }
    unicode_slug = unicode_slug.slice(0, -1);
    unicode_slug = unicode_slug.toLowerCase();

    let gh_emoji = gh_unicode_emojis[unicode_slug];
    if (gh_emoji === undefined) continue;
    emojisList[currentCategory][currentSubcategory][gh_emoji.slug] = {
      emoji: emoji_text,
      name: name,
      fallback_url: gh_emoji.fallback_url,
    };
  }

  emojisList["Custom"] = {}
  for (const [key, value] of Object.entries(gh_custom_emojis)) {
    emojisList["Custom"][key] = {
      name: key,
      fallback_url: value.fallback_url,
    };
  }

  return emojisList;
};

(async () => {
  const jsonData = await buildEmojiJSON()
  console.log(JSON.stringify(jsonData, null, 2))
})()
