// Generates A Collection Of Information To Represent A Character
import { items } from "./data/Items.js";
import { monsters } from "./data/Monsters.js";

interface item {
  name: string;
  type: string[];
  tier: number;
}

interface monster {
  name: string;
  tier: number[];
}

interface ItemsType {
  Armour: item[];
  Accessory: item[];
  Support: item[];
  Weapon: item[];
  Tank: item[];
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
  },
  Monsters: [],
};
const tiers: tier[] = [T0, T1, T2, T3, T4];

// Create the storage for all tiers and types
for (const i of items) {
  for (const type of i.type) {
    switch (type) {
      case "Accessory":
        tiers[i.tier].Items.Accessory.push(i);
        break;
      case "Armour":
        tiers[i.tier].Items.Armour.push(i);
        break;
      case "Support":
        tiers[i.tier].Items.Support.push(i);
        break;
      case "Weapon":
        tiers[i.tier].Items.Weapon.push(i);
        break;
      case "Tank":
        tiers[i.tier].Items.Tank.push(i);
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

console.log(generateTier(2));

function generateTier(selectedTier: number): string {
  const loadouts: string[] = [];

  // generate 4 armour sets and 4 weapons
  loadouts.push(generateItem(selectedTier, "Armour"));
  loadouts.push(generateItem(selectedTier, "Armour"));
  loadouts.push(generateItem(selectedTier, "Armour"));
  loadouts.push(generateItem(selectedTier, "Armour"));
  loadouts.push(generateItem(selectedTier, "Weapon"));
  loadouts.push(generateItem(selectedTier, "Weapon"));
  loadouts.push(generateItem(selectedTier, "Weapon"));
  loadouts.push(generateItem(selectedTier, "Weapon"));

  switch (selectedTier) {
    case 0:
      loadouts.push(generateItem(selectedTier, "Accessory"));
      break;
    case 1:
      loadouts.push(generateItem(selectedTier, "Accessory"));
      loadouts.push(generateItem(selectedTier, "Accessory"));
      loadouts.push(generateItem(selectedTier, "Accessory"));
      break;
    default:
      loadouts.push(generateItem(selectedTier, "Accessory"));
      loadouts.push(generateItem(selectedTier, "Accessory"));
      loadouts.push(generateItem(selectedTier, "Accessory"));
      loadouts.push(generateItem(selectedTier, "Accessory"));
      loadouts.push(generateItem(selectedTier, "Accessory"));
      loadouts.push(generateItem(selectedTier, "Support"));
      loadouts.push(generateItem(selectedTier, "Tank"));
      break;
  }
  let val = `${generateMonster(selectedTier)}\n`;
  for (const i of loadouts) {
    val += `${i}, `;
  }

  val += `\n${generateSurvivor(selectedTier)}\n${generateSurvivor(
    selectedTier
  )}\n${generateSurvivor(selectedTier)}\n${generateSurvivor(selectedTier)}`;
  return val;
}

function roll(): number {
  return Math.floor(Math.random() * 10) + 1;
}

function generateItem(selectedTier: number, type: keyof ItemsType): string {
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
    return "";
  }

  // find the random index
  const entry = Math.floor(Math.random() * tiers[itemTier].Items[type].length);

  return tiers[itemTier].Items[type][entry].name;
}

function generateMonster(selectedTier: number): string {
  // find the random index
  const entry = Math.floor(Math.random() * tiers[selectedTier].Monsters.length);

  return tiers[selectedTier].Monsters[entry];
}

// generate a player with ages completed
function generateSurvivor(selectedTier: number): string {
  const stats = {
    strength: 0,
    evasion: 0,
    accuracy: 0,
    luck: 0,
    movement: 0,
    speed: 0,
    fa: 0,
    choose: 0,
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
  }

  let character = "Survivor with: ";
  for (const key of Object.keys(stats)) {
    if (stats[key as keyof typeof stats] > 0) {
      character += `+${stats[key as keyof typeof stats]} ${key},`;
    }
  }

  return character;
}
