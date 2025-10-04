// bun run me 🙌

export type Emoji = {
  slug: string, // ID - github name for emoji
  fallback_url: string, // github url to image of emoji
  name: string, // unicode name, github name fallback
  emoji?: string, // unicode emoji
  hex?: string[]
  qual?: string
  aliases?: string[] // altnames from cldr annotations
}

export type EmojiList = {
  [group: string]: {
    [subgroup: string]: Emoji[]
  }
}

let emojis: EmojiList = {}
let groupOrder: string[] = []
let subgroupOrder: Map<string, string[]> = new Map()

const ghEmojis = await (await fetch('file:///Users/thomashuber/Downloads/gh-emojis.json')).json();
const unicodeEmojisTxt = await (await fetch('file:///Users/thomashuber/Downloads/unicode-emojis.txt')).text()
const unicodeAnnotations = await (await fetch('file:///Users/thomashuber/Downloads/annotations.xml')).text()
const unicodeAnnotationsDerived = await (await fetch('file:///Users/thomashuber/Downloads/annotationsDerived.xml')).text()

// const ghEmojis = await (await fetch('https://api.github.com/emojis')).json();
// const unicodeEmojis = await (await fetch('https://unicode.org/Public/emoji/latest/emoji-test.txt')).text()
// const unicodeAnnotations = await (await fetch('https://raw.githubusercontent.com/unicode-org/cldr/refs/heads/main/common/annotations/en.xml')).text()
// const unicodeAnnotationsDerived = await (await fetch('https://raw.githubusercontent.com/unicode-org/cldr/refs/heads/main/common/annotationsDerived/en.xml')).text()

const unicodeEmojis = unicodeEmojisTxt.split('\n').reduce((acc, curr) => {
  if (curr.trim().length === 0) {
    return acc
  }

  if (curr[0] === '#') {
    if (curr.includes('# group')) {
      const group = curr.split(':')[1].slice(1)
      if (!groupOrder.includes(group)) {
        groupOrder.push(group)
      }
      return { ...acc, group }
    } else if (curr.includes('# subgroup')) {
      const subgroup = curr.split(':')[1].slice(1)
      if (!subgroupOrder.has(acc.group)) {
        subgroupOrder.set(acc.group, [])
      }
      const subgroups = subgroupOrder.get(acc.group)!
      if (!subgroups.includes(subgroup)) {
        subgroups.push(subgroup)
      }
      return { ...acc, subgroup }
    } else {
      return acc
    }
  } else {
    const p1 = curr.split(';')
    const hex = p1[0].trim().toUpperCase().split(' ')
    const p2 = p1[1].split('#')
    const qual = p2[0].trim()

    const p3 = p2[1].trim()
    const w1 = p3.indexOf(' ')
    const w2 = p3.indexOf(' ', w1 + 1)

    const emoji = p3.slice(0, w1)
    const name = p3.slice(w2 + 1)

    return { ...acc, arr: [...acc.arr, { group: acc.group, subgroup: acc.subgroup, name, emoji, hex, qual }] }
  }
}, { group: '', subgroup: '', arr: [] }).arr

// Create a map to track Unicode emoji order within each subgroup
const unicodeOrderMap = new Map<string, Map<string, number>>()
unicodeEmojis.forEach((emoji, index) => {
  const key = `${emoji.group}::${emoji.subgroup}`
  if (!unicodeOrderMap.has(key)) {
    unicodeOrderMap.set(key, new Map())
  }
  // Store position based on hex codes for ordering
  const hexKey = emoji.hex.filter(code => code !== '200D' && code !== 'FE0F').join('-')
  unicodeOrderMap.get(key)!.set(hexKey, index)
})

// Don't pre-initialize groups and subgroups - only create them when needed
// GitHub category will always exist for GitHub-specific emojis
emojis['GitHub'] = {}
emojis['GitHub']['GitHub'] = []

// Store GitHub emojis temporarily before sorting
const tempEmojiMap = new Map<string, Emoji[]>()

const usedURLs = []

Object.entries(ghEmojis).forEach(([slug, url]) => {
  if (usedURLs.includes(url)) return

  if (url.includes('unicode')) {
    let hex = url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.')).toUpperCase().split('-')

    // First try to find an exact match (including gender modifiers)
    let unicodeEmoji = unicodeEmojis.find(uE => {
      const sans200D = uE.hex.filter(code => code !== '200D' && code !== 'FE0F')
      const hexSans200D = hex.filter(code => code !== '200D' && code !== 'FE0F')
      return sans200D.length === hexSans200D.length && sans200D.every((code, i) => code === hexSans200D[i]);
    })

    // If no exact match, try partial match (base emoji without modifiers)
    if (unicodeEmoji === undefined) {
      let matchingEmoji = unicodeEmojis.find(uE => {
        const sans200D = uE.hex.filter(code => code !== '200D')
        return sans200D.every((code, i) => code === hex[i]);
      })

      if (matchingEmoji === undefined) {
        console.error(`Failed to find matching unicode emoji for GH: ${slug}, ${url}`)
        return
      }

      // Now look for a more qualified version with the same name
      unicodeEmoji = matchingEmoji
      const sameName = unicodeEmojis.filter(uE => uE.name === matchingEmoji.name)

      const fullyQualified = sameName.find(uE => uE.qual === 'fully-qualified')
      if (fullyQualified) {
        unicodeEmoji = fullyQualified
      } else {
        const qualified = sameName.find(uE => uE.qual === 'minimally-qualified')
        if (qualified) {
          unicodeEmoji = qualified
        }
      }
    }

    let group = unicodeEmoji.group
    let subgroup = unicodeEmoji.subgroup

    const newEmojiEntry: Emoji = {
      slug,
      fallback_url: url,
      name: unicodeEmoji.name,
      emoji: unicodeEmoji.emoji,
      hex: unicodeEmoji.hex,
      qual: unicodeEmoji.qual,
      aliases: [],
    }

    // Check if emoji field is empty - if so, don't mark as fully qualified
    if (!newEmojiEntry.emoji || newEmojiEntry.emoji.trim() === '') {
      delete newEmojiEntry.emoji
      newEmojiEntry.qual = 'unqualified'
    }

    // Store in temporary map for later sorting
    const key = `${group}::${subgroup}`
    if (!tempEmojiMap.has(key)) {
      tempEmojiMap.set(key, [])
    }
    tempEmojiMap.get(key)!.push(newEmojiEntry)

    usedURLs.push(url)

  } else {
    const newEmojiEntry = {
      slug,
      fallback_url: url
    }

    emojis['GitHub']['GitHub'].push(newEmojiEntry)
  }
})

// Now sort and add emojis to the proper structure
tempEmojiMap.forEach((emojisInGroup, groupSubgroupKey) => {
  const [group, subgroup] = groupSubgroupKey.split('::')

  // Sort emojis based on Unicode order
  const sortedEmojis = emojisInGroup.sort((a, b) => {
    const orderMapKey = `${group}::${subgroup}`
    const orderMap = unicodeOrderMap.get(orderMapKey)

    if (orderMap && a.hex && b.hex) {
      const aHexKey = a.hex.filter(code => code !== '200D' && code !== 'FE0F').join('-')
      const bHexKey = b.hex.filter(code => code !== '200D' && code !== 'FE0F').join('-')

      const aOrder = orderMap.get(aHexKey) ?? Number.MAX_SAFE_INTEGER
      const bOrder = orderMap.get(bHexKey) ?? Number.MAX_SAFE_INTEGER

      return aOrder - bOrder
    }

    // Fallback to alphabetical by slug
    return a.slug.localeCompare(b.slug)
  })

  // Create group and subgroup on demand
  if (!emojis[group]) {
    emojis[group] = {}
  }
  if (!emojis[group][subgroup]) {
    emojis[group][subgroup] = []
  }

  emojis[group][subgroup] = sortedEmojis
})

let emojiAnnotationMap = new Map()

const takeAnnotations = (annotations) => {
  annotations.split('\n').forEach(line => {
    const sI = line.indexOf('cp=\"')

    if (sI !== -1) {
      const emojiStart = sI + 4;
      const emojiEnd = line.indexOf('"', emojiStart);
      let emoji = line.slice(emojiStart, emojiEnd);

      if (line.includes('tts')) {

      } else {
        const regex = />([^<]+)<\/annotation>/;
        const match = line.match(regex);

        if (match) {
          const annotations = match[1];

          const hexKey = Array.from(emoji).map(char =>
            char.codePointAt(0).toString(16).toUpperCase()
          ).join('-');

          emojiAnnotationMap.set(hexKey, annotations.split('|').map(d => d.trim()))
        }
      }
    }
  });
}

takeAnnotations(unicodeAnnotations)
takeAnnotations(unicodeAnnotationsDerived)

Object.entries(emojis).forEach(([groupName, group]) => {
  Object.entries(group).forEach(([subgroupName, subgroup]) => {
    subgroup.forEach((emoji, eI) => {
      if (emoji.hex) {
        const hexArray = Array.isArray(emoji.hex) ? emoji.hex : [emoji.hex];
        const sans200D = hexArray.filter(code => code !== '200D');
        const hexKey = sans200D.join('-');
        const annotations = emojiAnnotationMap.get(hexKey);

        emojis[groupName][subgroupName][eI] = { ...emojis[groupName][subgroupName][eI], aliases: annotations }
      }
    })
  })
})

const orderedEmojis: EmojiList = {}

if (emojis['GitHub'] && Object.keys(emojis['GitHub']).length > 0) {
  orderedEmojis['GitHub'] = emojis['GitHub']
}

// Add groups in Unicode order, but only if they have content
groupOrder.forEach(group => {
  if (emojis[group]) {
    const orderedGroup: { [subgroup: string]: Emoji[] } = {}
    const subgroups = subgroupOrder.get(group) || []

    // Add subgroups in order, but only if they exist
    subgroups.forEach(subgroup => {
      if (emojis[group][subgroup] && emojis[group][subgroup].length > 0) {
        orderedGroup[subgroup] = emojis[group][subgroup]
      }
    })

    // Only add the group if it has at least one subgroup with content
    if (Object.keys(orderedGroup).length > 0) {
      orderedEmojis[group] = orderedGroup
    }
  }
})


const bytes = await Bun.write('./src/assets/emojis.json', JSON.stringify(orderedEmojis));
console.log(`Wrote ${bytes} bytes to emojis.json.`)
