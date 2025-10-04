import toast from "svelte-french-toast";

export const copyToast = (msg: string) => {
  toast.success(`Copied! ${msg}`,
    {
      className: 'text-black! bg-slate-100! dark:text-white! dark:bg-slate-800!',
      duration: 2000,
      position: "bottom-right"
    })
}

export type Emoji = {
  slug: string; // ID - github name for emoji
  fallback_url: string; // github url to image of emoji
  name: string; // unicode name, github name fallback
  emoji?: string; // unicode emoji
  hex?: string[];
  qual?: string;
  aliases?: string[]; // altnames from cldr annotations
};

export type EmojiList = {
  [group: string]: {
    [subgroup: string]: Emoji[]
  }
}
