// Generates A Collection Of Information To Represent A Character
import { items } from "./data/Items.js";
import { monsters } from "./data/Monsters.js";

interface Item {
  name: string;
  type: string[];
  tier: number;
  location: string;
  rare: boolean;
  expansion: string;
  weaponType?: string[];
}

interface Challenge {
  monster: MonsterInfo | null;
  items: Item[];
  survivors: CharacterInfo[];
  settlement: SettlementInfo | null;
}

interface Monster {
  name: string;
  tier: number[];
  nemesis: boolean;
  expansion: string;
}

interface MonsterInfo {
  name: string;
  tier: number;
  nemesis: boolean;
  attributes: string[];
}

interface ItemsType {
  Armour: Item[];
  Accessory: Item[];
  Support: Item[];
  Weapon: Item[];
  Tank: Item[];
  Blacklist: Item[];
}

interface SettlementInfo {
  maxSurvival: number;
  startingSurvival: number;
  weaponProficiencies: number;
  weaponMasteries: number;
  encourage: boolean;
  dodge: boolean;
  surge: boolean;
  dash: boolean;
}

interface CharacterInfo {
  stats: {
    xp: number;
    courage: number;
    understanding: number;
    insanity: number;
    strength: number;
    evasion: number;
    accuracy: number;
    luck: number;
    movement: number;
    speed: number;
    fa: number;
    sfa: number;
    choose: number;
    disorders: number;
  };
  abilities: string[];
  title: string;
}

interface tier {
  Items: ItemsType;
  Monsters: MonsterInfo[];
  Weapons: Map<string, Item[]>;
}

const T0: tier = {
  Items: {
    Armour: [],
    Accessory: [],
    Support: [],
    Weapon: [],
    Tank: [],
    Blacklist: [],
  },
  Weapons: new Map<string, Item[]>(),
  Monsters: [],
};

const T1: tier = {
  Items: {
    Armour: [],
    Accessory: [],
    Support: [],
    Weapon: [],
    Tank: [],
    Blacklist: [],
  },
  Weapons: new Map<string, Item[]>(),
  Monsters: [],
};

const T2: tier = {
  Items: {
    Armour: [],
    Accessory: [],
    Support: [],
    Weapon: [],
    Tank: [],
    Blacklist: [],
  },
  Weapons: new Map<string, Item[]>(),
  Monsters: [],
};

const T3: tier = {
  Items: {
    Armour: [],
    Accessory: [],
    Support: [],
    Weapon: [],
    Tank: [],
    Blacklist: [],
  },
  Weapons: new Map<string, Item[]>(),
  Monsters: [],
};

const T4: tier = {
  Items: {
    Armour: [],
    Accessory: [],
    Support: [],
    Weapon: [],
    Tank: [],
    Blacklist: [],
  },
  Weapons: new Map<string, Item[]>(),
  Monsters: [],
};
const tiers: tier[] = [T0, T1, T2, T3, T4];

const expansions: Set<string> = new Set<string>();

let enabledExpansions: Set<string> = new Set<string>();

// load everything initially
load([]);

export function load(expansionList: string[]) {
  // make sure the arrays are empty
  for (let i = 0; i < 5; i++) {
    tiers[i] = {
      Items: {
        Armour: [],
        Accessory: [],
        Support: [],
        Weapon: [],
        Tank: [],
        Blacklist: [],
      },
      Weapons: new Map<string, Item[]>(),
      Monsters: [],
    };
  }
  enabledExpansions = new Set<string>();

  // Create the storage for all tiers and types
  for (const i of items) {
    if (
      expansionList.length !== 0 &&
      expansionList.indexOf(i.expansion) === -1
    ) {
      // omit this item as it isn't an included expansion
      continue;
    }
    // set missing info for non-rare items
    if ((i as Item).rare === undefined) {
      i.rare = false;
    }

    // add expansions for items
    expansions.add(i.expansion);
    enabledExpansions.add(i.expansion);

    for (const type of i.type) {
      switch (type) {
        case "Accessory":
          // add all accessories to every tier above as well
          for (let t = i.tier; t < 5; t++) {
            tiers[t].Items.Accessory.push(i as Item);
            // make rare gear half as likely
            if (!i.rare) tiers[t].Items.Accessory.push(i as Item);
          }
          break;
        case "Armour":
          // add almost all armour to every tier above as well
          if (i.tier > 0) {
            for (let t = i.tier; t < 5; t++) {
              tiers[t].Items.Armour.push(i as Item);
              // make rare gear half as likely
              if (!i.rare) tiers[t].Items.Armour.push(i as Item);
            }
          } else {
            // tier 0 is added to tier 1 as well not everyone has full armour sets early
            tiers[i.tier].Items.Armour.push(i as Item);
            tiers[i.tier + 1].Items.Armour.push(i as Item);
            tiers[i.tier + 1].Items.Armour.push(i as Item);
          }
          break;
        case "Support":
          // add all support to every tier above as well
          for (let t = i.tier; t < 5; t++) {
            tiers[t].Items.Support.push(i as Item);
            if (!i.rare) tiers[t].Items.Support.push(i as Item);
          }
          break;
        case "Weapon":
          // weapons can be used 1 tier above
          tiers[i.tier].Items.Weapon.push(i as Item);
          if (!i.rare) tiers[i.tier].Items.Weapon.push(i as Item);

          if (i.tier !== 4) {
            tiers[i.tier + 1].Items.Weapon.push(i as Item);
            if (!i.rare) tiers[i.tier].Items.Weapon.push(i as Item);
          }

          // add by tier to the weapons map
          for (const type of i.weaponType ?? []) {
            if (!tiers[i.tier].Weapons.has(type)) {
              // add weapons to the list for replacement
              tiers[i.tier].Weapons.set(type, [{ ...i, rare: false }]);
            } else {
              tiers[i.tier].Weapons.get(type)?.push({ ...i, rare: false });
            }
            if (i.tier !== 4) {
              if (!tiers[i.tier + 1].Weapons.has(type)) {
                // add weapons to the list for replacement
                tiers[i.tier + 1].Weapons.set(type, [{ ...i, rare: false }]);
              } else {
                tiers[i.tier + 1].Weapons.get(type)?.push({
                  ...i,
                  rare: false,
                });
              }
            }
          }
          break;
        case "Tank":
          tiers[i.tier].Items.Tank.push(i as Item);
          if (!i.rare) tiers[i.tier].Items.Tank.push(i as Item);
          break;
      }
    }
  }

  console.log(tiers);
  // Create the storage for all Monsters
  for (const i of monsters) {
    if (
      expansionList.length !== 0 &&
      expansionList.indexOf(i.expansion) === -1
    ) {
      // omit this item as it isn't an included expansion
      continue;
    }
    expansions.add(i.expansion);
    enabledExpansions.add(i.expansion);

    for (const t of i.tier) {
      // add monsters to each tier with their level in brackets
      tiers[t].Monsters.push({
        name: i.name,
        tier: i.tier.indexOf(t) + 1,
        nemesis: i.nemesis,
        attributes: [],
      });
    }
  }
}

export function generateTier(
  selectedTier: number,
  survivors: number = 4
): Challenge {
  const challenge: Challenge = {
    items: [],
    monster: null,
    settlement: null,
    survivors: [],
  };
  // generate 4 armour sets and 4 weapons
  challenge.items.push(generateItem(selectedTier, "Armour"));
  challenge.items.push(generateItem(selectedTier, "Armour"));
  challenge.items.push(generateItem(selectedTier, "Armour"));
  challenge.items.push(generateItem(selectedTier, "Armour"));
  challenge.items.push(generateItem(selectedTier, "Weapon"));
  challenge.items.push(generateItem(selectedTier, "Weapon"));
  challenge.items.push(generateItem(selectedTier, "Weapon"));
  challenge.items.push(generateItem(selectedTier, "Weapon"));

  switch (selectedTier) {
    case 0:
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      break;
    case 1:
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      break;
    case 2:
      challenge.items.push(generateItem(selectedTier, "Weapon"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Support"));
      challenge.items.push(generateItem(selectedTier, "Tank"));
      break;
    default:
      challenge.items.push(generateItem(selectedTier, "Weapon"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Accessory"));
      challenge.items.push(generateItem(selectedTier, "Support"));
      challenge.items.push(generateItem(selectedTier, "Tank"));
      break;
  }
  challenge.monster = generateMonster(selectedTier, survivors);

  challenge.survivors.push(generateSurvivor(selectedTier));
  challenge.survivors.push(generateSurvivor(selectedTier));
  challenge.survivors.push(generateSurvivor(selectedTier));
  challenge.survivors.push(generateSurvivor(selectedTier));

  for (let i = 4; i < survivors; i++) {
    challenge.survivors.push(generateSurvivor(selectedTier, true));
  }

  challenge.settlement = generateSettlementDetails(selectedTier);

  return challenge;
}

function roll(): number {
  return Math.floor(Math.random() * 10) + 1;
}

function generateItem(selectedTier: number, type: keyof ItemsType): Item {
  //10% chance to roll up or down a tier
  let itemTier = selectedTier;

  let roll = Math.random();
  while (roll < 0.1 || roll > 0.9) {
    if (roll > 0.9) itemTier++;
    if (roll < 0.1) itemTier--;

    roll = Math.random();
  }

  //bound our values
  if (itemTier > 4) itemTier = 4;
  if (itemTier < 0) itemTier = 0;

  if (tiers[itemTier].Items[type].length === 0) {
    return {
      name: "Founding Stone",
      type: ["Accessory"],
      tier: 0,
      location: "Starter",
      rare: false,
      expansion: "Core Box",
      weaponType: [],
    };
  }

  // find the random index
  const entry = Math.floor(Math.random() * tiers[itemTier].Items[type].length);

  return tiers[itemTier].Items[type][entry];
}

export function formatItem(i: Item | null): string {
  if (i === null) return "";
  return `${i.name}(${i.location})`;
}

function generateMonster(
  selectedTier: number,
  survivors: number = 4
): MonsterInfo {
  // find the random index
  const entry = Math.floor(Math.random() * tiers[selectedTier].Monsters.length);

  const a: string[] = [];

  for (const attribute of tiers[selectedTier].Monsters[entry].attributes) {
    a.push(attribute);
  }

  if (survivors === 5) {
    a.push(`Life ${tiers[selectedTier].Monsters[entry].tier}`);
  }

  if (survivors === 6) {
    a.push(`Life ${tiers[selectedTier].Monsters[entry].tier * 2}`);
    a.push("+1 Speed");
  }

  return { ...tiers[selectedTier].Monsters[entry], attributes: a };
}

// generate a player with ages completed
function generateSurvivor(
  selectedTier: number,
  scout?: boolean
): CharacterInfo {
  const character: CharacterInfo = {
    stats: {
      xp: 0,
      courage: 0,
      understanding: 0,
      insanity: 0,
      strength: 0,
      evasion: 0,
      accuracy: 0,
      luck: 0,
      movement: 0,
      speed: 0,
      fa: 0,
      choose: 0,
      sfa: 0,
      disorders: 0,
    },
    abilities: [],
    title: "Survivor",
  };

  // set XP
  character.stats.xp =
    selectedTier * 3 + Math.floor(Math.random() * (3 * selectedTier));

  if (character.stats.xp >= 16) {
    character.stats.xp = 16;
    character.abilities.push("Ageless");
  }

  // set courage and understanding
  character.stats.courage =
    selectedTier - 2 + Math.floor(Math.random() * (selectedTier * 3));
  character.stats.understanding =
    selectedTier - 2 + Math.floor(Math.random() * (selectedTier * 3));

  if (character.stats.courage < 0) character.stats.courage = 0;
  if (character.stats.understanding < 0) character.stats.understanding = 0;

  // set insanity
  if (selectedTier === 0) {
    character.stats.insanity = Math.floor(Math.random() * 2);
  } else {
    character.stats.insanity = Math.ceil(roll() / 2);
  }

  // check for a unique survivor
  if (selectedTier > 0 && !scout && Math.random() > 0.95) {
    //determine the survivor type
    const options = ["Twilight", "Savior"];

    if (enabledExpansions.has("Dragon King") && selectedTier >= 2)
      options.push("Constellation");
    if (enabledExpansions.has("Sunstalker") && selectedTier >= 2)
      options.push("Katana");
    if (enabledExpansions.has("Community Edition")) options.push("Kingsman");

    const type = Math.floor(Math.random() * options.length);
    switch (options[type]) {
      case "Twilight":
        character.title = "Twilight Knight";
        character.abilities.push("Twilight Sword (Gear)");
        character.abilities.push(
          `Twilight Sword Proficiency ${
            selectedTier + Math.floor(Math.random() * selectedTier) + 2
          } Ranks`
        );
        break;
      case "Savior":
        // determine dream
        const dreams = ["Beast", "Crown", "Lantern"];
        const dream = dreams[Math.floor(Math.random() * dreams.length)];

        switch (dream) {
          case "Beast":
            //Beast
            character.title = "Dreamer Of The Beast";
            character.stats.strength += 1;
            character.abilities.push("+1 red affinity");
            character.abilities.push("Caratosis");
            character.abilities.push("Life Exchange");
            if (character.stats.xp >= 6) {
              character.abilities.push(
                "Beast Of Caratosis (Secret Fighting Art)"
              );
            }
            if (character.stats.understanding >= 7) {
              // saviors shouldn't immediately cease to exist
              character.stats.understanding = 7;
            }
            break;
          case "Crown":
            //crown
            character.title = "Dreamer Of The Crown";
            character.stats.evasion += 1;
            character.abilities.push("+1 green affinity");
            character.abilities.push("Dormenatus");
            character.abilities.push("Life Exchange");
            if (character.stats.xp >= 6) {
              character.abilities.push(
                "Grace Of Dormenatus (Secret Fighting Art)"
              );
            }
            if (character.stats.understanding >= 7) {
              // saviors shouldn't immediately cease to exist
              character.stats.understanding = 7;
            }
            break;
          case "Lantern":
            //lantern
            character.title = "Dreamer Of The Lantern";
            character.stats.luck += 1;
            character.abilities.push("+1 blue affinity");
            character.abilities.push("Lucernae");
            character.abilities.push("Life Exchange");
            if (character.stats.xp >= 6) {
              character.abilities.push(
                "Lucernae's Lantern (Secret Fighting Art)"
              );
            }
            if (character.stats.understanding >= 7) {
              // saviors shouldn't immediately cease to exist
              character.stats.understanding = 7;
            }
            break;
        }
        break;
      case "Constellation":
        let constellations = [
          "Absolute",
          "Gambler",
          "Reaper",
          "Rust",
          "Storm",
          "Witch",
        ];

        const constellation =
          constellations[Math.floor(Math.random() * constellations.length)];
        character.title = `Born Under ${constellation}`;
        // select a constellation
        switch (constellation) {
          case "Absolute":
            character.stats.evasion += 1;
            character.stats.movement += 1;
            character.abilities.push("Rooted to All");
            break;
          case "Gambler":
            character.stats.insanity += 100;
            character.abilities.push("Immortal");
            character.abilities.push("Twelve Fingers");
            break;
          case "Reaper":
            character.stats.accuracy += 3;
            character.abilities.push("Psychovore");
            break;
          case "Rust":
            character.abilities.push("Tough (Fighting Art)");
            character.abilities.push("Way of the Rust");
            break;
          case "Storm":
            character.stats.speed += 1;
            character.abilities.push("Destined");
            character.abilities.push("Heart of the Sword");
            break;
          case "Witch":
            character.stats.speed += 1;
            character.stats.luck += 1;
            character.abilities.push("Presage");
        }

        break;
      case "Katana":
        character.title = "Katana Specialist";
        character.abilities.push("Katana Proficiency 5 Ranks");
        character.abilities.push("Eyepatch (Gear)");
        character.abilities.push("Rainbow Katana (Gear)");
        character.abilities.push("Blood Sheath (Gear)");
        break;
      case "Kingsman":
        character.title = "Cursed";
        if (selectedTier === 1) {
          character.abilities.push("Kings Curse (Event) X2");
        } else if (selectedTier === 2) {
          character.abilities.push("Kings Curse (Event) X4");
        } else {
          character.title = "Unlikely Ally";
          character.abilities.push("Regal Armour (Gear)");
          character.abilities.push("Lantern Halberd (Gear)");
          character.abilities.push("Kings Step (Secret Fighting Art)");
        }
        break;
    }
  }

  // Age 1
  if (character.stats.xp >= 2) {
    const val = roll() + roll();
    if (val === 2) {
      character.stats.evasion += 1;
    } else if (val <= 6) {
      character.stats.strength += 1;
    } else if (val <= 15) {
      character.stats.fa += 1;
    } else if (val <= 19) {
      character.stats.accuracy += 1;
    } else if (val === 20) {
      character.stats.luck += 1;
    }

    // chance for a SFA
    if (roll() > 9) character.stats.sfa = 1;
  }

  // Age 2
  if (character.stats.xp >= 6) {
    const val = roll() + roll();
    if (val === 2) {
      character.stats.movement += 1;
    } else if (val <= 6) {
      character.stats.fa += 1;
    } else if (val <= 15) {
      character.stats.strength += 1;
    } else if (val <= 19) {
      character.stats.fa += 1;
    } else if (val === 20) {
      character.stats.speed += 1;
    }

    // chance for a SFA
    if (roll() > 9) character.stats.sfa = 1;
  }

  // Age 3
  if (character.stats.xp >= 10) {
    const val = roll() + roll();
    if (val === 2) {
      character.stats.speed += 1;
    } else if (val <= 6) {
      character.stats.movement += 1;
    } else if (val <= 15) {
      character.stats.fa += 1;
    } else if (val <= 19) {
      character.stats.fa += 2;
    } else if (val === 20) {
      character.stats.strength += 3;
    }

    // chance for a SFA
    if (roll() > 9) character.stats.sfa = 1;
  }

  // Age 4
  if (character.stats.xp >= 15) {
    const val = roll() + roll();
    if (val === 2) {
      character.stats.fa += 5;
    } else if (val <= 6) {
      character.stats.evasion += 1;
    } else if (val <= 15) {
      character.stats.luck += 1;
    } else if (val <= 19) {
      character.stats.speed += 1;
    } else if (val === 20) {
      character.stats.choose += 1;
    }

    // chance for a SFA
    if (roll() > 9) character.stats.sfa = 1;
  }

  // Bold
  if (character.stats.courage >= 3) {
    // determine when it happened
    const boldRoll = roll();

    if (boldRoll <= 3) {
      // settlement
      character.abilities.push(
        'Dependent: "If someone dies during the hunt phase, you may replace them in the showdown with a new survivor with no abilities or attributes"'
      );

      const val = roll();
      if (val === 10) {
        character.stats.accuracy += 1;
      } else if (val >= 8) {
        character.stats.strength += 1;
      }
    } else if (boldRoll <= 6) {
      //hunt
      character.abilities.push("Prepared");

      const val = roll();
      if (val === 10) {
        character.stats.movement += 1;
      } else if (val >= 8) {
        character.stats.strength += 1;
      }
    } else {
      //showdown
      character.abilities.push("Stalwart");

      const val = roll();
      if (val === 10) {
        character.stats.speed += 1;
      } else if (val >= 8) {
        character.stats.strength += 1;
      }
    }
  }

  // Insight
  if (character.stats.understanding >= 3) {
    // determine when it happened
    const understandingRoll = roll();

    if (understandingRoll <= 3) {
      // settlement
      character.abilities.push('Handy: "Gain an additional ✪"');

      const val = roll();
      if (val === 10) {
        character.stats.strength += 1;
      } else if (val >= 8) {
        character.stats.accuracy += 1;
      }
    } else if (understandingRoll <= 6) {
      //hunt
      character.abilities.push("Explore");

      const val = roll();
      if (val === 10) {
        character.stats.evasion += 1;
      } else if (val >= 8) {
        character.stats.accuracy += 1;
      }
    } else {
      //showdown
      character.abilities.push("Analyze");

      const val = roll();
      if (val === 10) {
        character.stats.movement += 1;
      } else if (val >= 8) {
        character.stats.accuracy += 1;
      }
    }
  }

  // See the truth
  if (character.stats.courage >= 9) {
    character.stats.courage = 9;
    character.abilities.push("Blind (Severe Injury)");
    const val = roll();
    if (val <= 2) {
      //sweet
      character.abilities.push("Weak Spot (Disorder)");
      character.abilities.push("Sweet Battle");
    } else if (val <= 8) {
      //bitter
      character.abilities.push("Berserker (Fighting Art)");
      character.abilities.push("Bitter Frenzy");
    } else {
      //sour
      character.abilities.push("Sour Death");
    }
  }

  // White Secret
  if (character.stats.understanding >= 9) {
    character.stats.understanding = 9;
    character.stats.insanity += Math.ceil(roll() / 2);
    character.stats.disorders += 1;
    const val = roll();
    if (val <= 2) {
      //Ageless
      character.stats.accuracy += 1;
      character.stats.strength += 1;
      if (character.stats.xp < 16) {
        // already have it otherwise
        character.abilities.push("Ageless");
      }
    } else if (val <= 8) {
      //Survivor
      character.abilities.push("Quixotic (Disorder)");
      character.abilities.push("Peerless");
    } else {
      //Invisible Hair
      character.abilities.push("Extra Sense (Fighting Art)");
      character.abilities.push("Leyline Walker");
    }
  }

  if (character.stats.sfa >= 1) {
    character.stats.sfa = 1;
  }

  if (scout) {
    // this is a scout, generate them appropriately
    character.title = "Scout";
    character.abilities.push("Scout Gear Grid (Can't use Death Pact)");
  }

  return character;
}

export function formatSurvivor(c: CharacterInfo): string {
  let character = ``;
  let stats = "";
  let abilities = "";
  for (const key of Object.keys(c.stats)) {
    if (c.stats[key as keyof typeof c.stats] > 0) {
      stats += `+${c.stats[key as keyof typeof c.stats]} ${key},`;
    }
  }

  for (const a of c.abilities) {
    abilities += `${a}, `;
  }

  character += characterHelper(stats, abilities, c.title);
  return character;
}

function generateSettlementDetails(selectedTier: number): SettlementInfo {
  const settlement: SettlementInfo = {
    maxSurvival: 0,
    startingSurvival: 0,
    weaponProficiencies: 0,
    weaponMasteries: 0,
    encourage: true,
    dodge: true,
    surge: false,
    dash: false,
  };

  settlement.maxSurvival = selectedTier * 2 + 1;
  settlement.startingSurvival = selectedTier;

  switch (selectedTier) {
    case 1:
      settlement.weaponProficiencies = 1;
      if (Math.random() > 0.5) settlement.dash = true;
      if (Math.random() > 0.5) settlement.surge = true;
      break;
    case 2:
      settlement.weaponProficiencies = Math.floor(Math.random() * 3) + 1;
      if (Math.random() > 0.2) settlement.dash = true;
      if (Math.random() > 0.2) settlement.surge = true;

      break;
    case 3:
      settlement.weaponProficiencies = 2;
      settlement.weaponMasteries = Math.floor(Math.random() * 2);
      settlement.dash = true;
      settlement.surge = true;
      break;
  }

  return settlement;
}

export function formatSettlementDetails(c: SettlementInfo): string {
  let settlement = `<div class="flex">`;

  settlement += settlementHelper("Max Survival:", c.maxSurvival);
  settlement += settlementHelper("Starting Survival:", c.startingSurvival);
  settlement += settlementHelper(
    "Weapon Proficiencies:",
    c.weaponProficiencies
  );
  settlement += settlementHelper("Weapon Masteries:", c.weaponMasteries);

  if (c.encourage) settlement += settlementHelperCheck("Encourage");
  if (c.dodge) settlement += settlementHelperCheck("Dodge");
  if (c.surge) settlement += settlementHelperCheck("Surge");
  if (c.dash) settlement += settlementHelperCheck("Dash");

  settlement += `</div>`;

  return settlement;
}

function characterHelper(
  val: string,
  abilities: string,
  title: string
): string {
  return `<h3 class=settlementTitle>${title}</h3><p class=settlementValue>${val}</p><p class=settlementValue>${abilities}</p>`;
}

function settlementHelper(title: string, val: number): string {
  return `<div class=settlementAttribute><h3 class=settlementTitle>${title}</h3><p class=settlementValue>${val}</p></div>`;
}

function settlementHelperCheck(title: string): string {
  return `<div class=settlementAttribute><h3 class=settlementTitle>${title}</h3><p class=settlementValue>✓</p></div>`;
}

export function generateExpansionList(): string {
  let html = ``;
  const sortedExpansions: string[] = [];
  for (const e of expansions) {
    sortedExpansions.push(e);
  }

  for (const e of sortedExpansions.sort()) {
    const id = e.replace(/ /g, "_");
    html += `<div><input type="checkbox" id="${id}" name="${e}" checked /><label for="${id}">${e}</label></div>\n`;
  }
  return html;
}

export function formatWeaponList(selectedTier: number): string {
  let weaponHTML = `<option value=" "></option>`;
  for (const key of tiers[selectedTier].Weapons.keys()) {
    weaponHTML += `<option value="${key}">${key}</option>`;
  }
  return weaponHTML;
}

export function getWeapon(selectedTier: number, type: string): string {
  let weapons = tiers[selectedTier].Weapons.get(type);

  if (weapons)
    return formatItem(weapons[Math.floor(Math.random() * weapons?.length)]);
  else return "";
}

export function getArmour(selectedTier: number): string {
  let armours = tiers[selectedTier].Items.Armour;

  if (armours)
    return formatItem(armours[Math.floor(Math.random() * armours?.length)]);
  else return "";
}
