// Generates A Collection Of Information To Represent A Character
import { items } from "./data/Items.js";
import { monsters } from "./data/Monsters.js";

interface Item {
  name: string;
  type: string[];
  tier: number;
  location: string;
  rare: boolean;
}

interface Challenge {
  monster: string;
  items: Item[];
  survivors: CharacterInfo[];
  settlement: SettlementInfo | null;
}

interface monster {
  name: string;
  tier: number[];
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
  strength: number;
  evasion: number;
  accuracy: number;
  luck: number;
  movement: number;
  speed: number;
  fa: number;
  sfa: number;
  choose: number;
}

interface tier {
  Items: ItemsType;
  Monsters: string[];
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
  Monsters: [],
};
const tiers: tier[] = [T0, T1, T2, T3, T4];

// Create the storage for all tiers and types
for (const i of items) {
  if ((i as Item).rare === undefined) {
    i.rare = false;
  }
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
          tiers[i.tier].Items.Armour.push(i as Item);
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
        break;
      case "Tank":
        tiers[i.tier].Items.Tank.push(i as Item);
        if (!i.rare) tiers[i.tier].Items.Tank.push(i as Item);
        break;
    }
  }
}

// Create the storage for all Monsters
for (const i of monsters) {
  for (const t of i.tier) {
    // add monsters to each tier with their level in brackets
    tiers[t].Monsters.push(`${i.name}(${i.tier.indexOf(t) + 1})`);
  }
}

export function generateTier(selectedTier: number): Challenge {
  const challenge: Challenge = {
    items: [],
    monster: "",
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
  challenge.monster = generateMonster(selectedTier);

  challenge.survivors.push(generateSurvivor(selectedTier));
  challenge.survivors.push(generateSurvivor(selectedTier));
  challenge.survivors.push(generateSurvivor(selectedTier));
  challenge.survivors.push(generateSurvivor(selectedTier));

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

function generateMonster(selectedTier: number): string {
  // find the random index
  const entry = Math.floor(Math.random() * tiers[selectedTier].Monsters.length);

  return tiers[selectedTier].Monsters[entry];
}

// generate a player with ages completed
function generateSurvivor(selectedTier: number): CharacterInfo {
  const stats: CharacterInfo = {
    strength: 0,
    evasion: 0,
    accuracy: 0,
    luck: 0,
    movement: 0,
    speed: 0,
    fa: 0,
    choose: 0,
    sfa: 0,
  };

  // Age 1
  if (selectedTier >= 1) {
    const val = roll() + roll();
    if (val === 2) {
      stats.evasion += 1;
    } else if (val <= 6) {
      stats.strength += 1;
    } else if (val <= 15) {
      stats.fa += 1;
    } else if (val <= 19) {
      stats.accuracy += 1;
    } else if (val === 20) {
      stats.luck += 1;
    }

    // chance for a SFA
    if (roll() > 9) stats.sfa = 1;
  }

  // Age 2
  if (selectedTier >= 2) {
    const val = roll() + roll();
    if (val === 2) {
      stats.movement += 1;
    } else if (val <= 6) {
      stats.fa += 1;
    } else if (val <= 15) {
      stats.strength += 1;
    } else if (val <= 19) {
      stats.fa += 1;
    } else if (val === 20) {
      stats.speed += 1;
    }

    // chance for a SFA
    if (roll() > 9) stats.sfa = 1;
  }

  // Age 3
  if (selectedTier >= 3) {
    const val = roll() + roll();
    if (val === 2) {
      stats.speed += 1;
    } else if (val <= 6) {
      stats.movement += 1;
    } else if (val <= 15) {
      stats.fa += 1;
    } else if (val <= 19) {
      stats.fa += 2;
    } else if (val === 20) {
      stats.strength += 3;
    }

    // chance for a SFA
    if (roll() > 9) stats.sfa = 1;
  }

  // Age 4
  if (selectedTier >= 4) {
    const val = roll() + roll();
    if (val === 2) {
      stats.fa += 5;
    } else if (val <= 6) {
      stats.evasion += 1;
    } else if (val <= 15) {
      stats.luck += 1;
    } else if (val <= 19) {
      stats.speed += 1;
    } else if (val === 20) {
      stats.choose += 1;
    }

    // chance for a SFA
    if (roll() > 9) stats.sfa = 1;
  }

  return stats;
}

export function formatSurvivor(c: CharacterInfo): string {
  let character = "Survivor with: ";
  for (const key of Object.keys(c)) {
    if (c[key as keyof typeof c] > 0) {
      character += `+${c[key as keyof typeof c]} ${key},`;
    }
  }

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

function settlementHelper(title: string, val: number): string {
  return `<div class=settlementAttribute><h3 class=settlementTitle>${title}</h3><p class=settlementValue>${val}</p></div>`;
}

function settlementHelperCheck(title: string): string {
  return `<div class=settlementAttribute><h3 class=settlementTitle>${title}</h3><p class=settlementValue>✓</p></div>`;
}
