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

interface Options {
  highMult: number;
  lowMult: number;
  itemMult: number;
  specialMult: number;
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

const T5: tier = {
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
const tiers: tier[] = [T0, T1, T2, T3, T4, T5];

const expansions: Set<string> = new Set<string>();

let enabledExpansions: Set<string> = new Set<string>();

// load everything initially
load([]);

export function load(expansionList: string[]) {
  // make sure the arrays are empty
  for (let i = 0; i < 6; i++) {
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

          if (i.tier !== 5) {
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
            if (i.tier !== 5) {
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

  //console.log(tiers);
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
  survivors: number = 4,
  options: Options
): Challenge {
  const challenge: Challenge = {
    items: [],
    monster: null,
    settlement: null,
    survivors: [],
  };

  const gearCounts = {
    Armour: 4,
    Weapon: 4,
    Accessory: 1,
    Tank: 0,
    Support: 0,
    Blacklist: 0,
  };

  switch (selectedTier) {
    case 0:
      // already configured
      break;
    case 1:
      gearCounts.Accessory = 3;
      break;
    case 2:
      gearCounts.Weapon = 5;
      gearCounts.Accessory = 5;
      gearCounts.Support = 1;
      gearCounts.Tank = 1;
      break;
    default:
      gearCounts.Weapon = 5;
      gearCounts.Accessory = 10;
      gearCounts.Support = 1;
      gearCounts.Tank = 1;
      break;
  }

  for (const t of Object.keys(tiers[0].Items)) {
    for (
      let i = 0;
      i < Math.round(gearCounts[t as keyof ItemsType] * options.itemMult);
      i++
    ) {
      challenge.items.push(
        generateItem(selectedTier, t as keyof ItemsType, options)
      );
    }
  }

  challenge.monster = generateMonster(selectedTier, survivors);

  challenge.survivors.push(generateSurvivor(selectedTier, options));
  challenge.survivors.push(generateSurvivor(selectedTier, options));
  challenge.survivors.push(generateSurvivor(selectedTier, options));
  challenge.survivors.push(generateSurvivor(selectedTier, options));

  for (let i = 4; i < survivors; i++) {
    challenge.survivors.push(generateSurvivor(selectedTier, options, true));
  }

  challenge.settlement = generateSettlementDetails(selectedTier);

  return challenge;
}

function roll(): number {
  return Math.floor(Math.random() * 10) + 1;
}

function generateItem(
  selectedTier: number,
  type: keyof ItemsType,
  options: Options
): Item {
  //chance to roll up or down a tier
  //if they exist
  let itemTier = selectedTier;
  let roll = Math.random();
  if (roll > 1 - options.highMult) {
    if (tiers[Math.min(itemTier + 1, 5)].Items[type].length !== 0) itemTier++;
  } else if (roll < options.lowMult) {
    if (tiers[Math.max(itemTier - 1, 0)].Items[type].length !== 0) itemTier--;
  }
  //bound our values
  if (itemTier > 5) itemTier = 5;
  if (itemTier < 0) itemTier = 0;

  if (tiers[itemTier].Items[type].length === 0) {
    if (itemTier === 0) {
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

    // otherwise try to find something lower tier
    return generateItem(itemTier - 1, type, {
      highMult: 0,
      lowMult: 0,
      itemMult: 1,
      specialMult: 0,
    });
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
  // make sure something exists in the tier
  if (tiers[selectedTier].Monsters.length === 0) {
    return {
      attributes: [],
      name: "No Monster In Tier",
      nemesis: true,
      tier: -1,
    };
  }
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
  options: Options,
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

  let honorific = "";

  // give an honorific 20% of the time
  if (roll() > 8) {
    const honourifics = ["Inexperienced", "Injured", "Veteran"];

    switch (honourifics[Math.floor(Math.random() * honourifics.length)]) {
      case "Inexperience":
        // young survivor
        honorific = "Inexperience";
        if (selectedTier > 0) selectedTier--;
        break;
      case "Injured":
        honorific = "Injured";
        const validInjuries: string[] = [
          "Deaf",
          "Blind",
          "Shatterd Jaw",
          "Dismembered Arm",
          "Ruptured Muscle",
          "Broken Arm",
          "Contracture",
          "Gaping Chest Wound",
          "Destroyed Back",
          "Broken Rib",
          "Warped Pelvis",
          "Broken Hip",
          "Dismembered Leg",
          "Hamstrung",
          "Broken Leg",
        ];

        character.abilities.push(
          `${
            validInjuries[Math.floor(Math.random() * validInjuries.length)]
          } (Injury)`
        );
        break;
      case "Veteran":
        honorific = "Veteran";
        if (selectedTier < 4) selectedTier++;
        break;
    }
  }

  // set XP
  character.stats.xp =
    Math.floor(selectedTier * 2.5) +
    Math.floor(Math.random() * (2 * selectedTier));

  if (character.stats.xp >= 16) {
    character.stats.xp = 16;
    character.abilities.push("Ageless");
  }

  // set courage and understanding
  character.stats.courage =
    selectedTier - 1 + Math.floor(Math.random() * (selectedTier * 2));
  character.stats.understanding =
    selectedTier - 1 + Math.floor(Math.random() * (selectedTier * 2));

  if (character.stats.courage < 0) character.stats.courage = 0;
  if (character.stats.understanding < 0) character.stats.understanding = 0;

  // set insanity
  if (selectedTier === 0) {
    character.stats.insanity = Math.floor(Math.random() * 2);
  } else {
    character.stats.insanity = Math.ceil(roll() / 2);
  }

  // check for a unique survivor
  console.log(options.specialMult);
  if (selectedTier > 0 && !scout && Math.random() > 1 - options.specialMult) {
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
  }

  // secret fighting arts, small chance based on tier
  if (Math.random() * 100 + 1 > 100 - selectedTier) {
    character.stats.sfa = 1;
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
    character.abilities.push(
      '<a href="./data/Scout.png">Scout Gear Grid</a> (Can\'t use Death Pact)'
    );
  }

  character.title = `${honorific} ${character.title}`;

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

  settlement.maxSurvival = selectedTier * 2 + 2;
  settlement.startingSurvival = selectedTier + 1;

  switch (selectedTier) {
    case 0:
      // get nothing
      break;
    case 1:
      if (Math.random() > 0.8) settlement.dash = true;
      if (Math.random() > 0.8) settlement.surge = true;
      break;
    case 2:
      settlement.weaponProficiencies = Math.floor(Math.random() * 3) + 1;
      if (Math.random() > 0.2) settlement.dash = true;
      if (Math.random() > 0.2) settlement.surge = true;
      break;
    default:
      settlement.weaponMasteries = Math.floor(Math.random() * 3);
      settlement.weaponProficiencies = 4 - settlement.weaponMasteries;
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
    html += `<div class="expac"><input type="checkbox" id="${id}" name="${e}" checked /><label for="${id}">${e}</label></div>\n`;
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

export function getItem(selectedTier: number, key: keyof ItemsType): string {
  let things = tiers[selectedTier].Items[key];

  if (things)
    return formatItem(things[Math.floor(Math.random() * things?.length)]);
  else return "";
}
