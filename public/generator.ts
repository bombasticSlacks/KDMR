// Generates A Collection Of Information To Represent A Character
import { items } from "./data/Items.js";

interface item {
  name: string;
  type: string[];
  tier: number;
}

interface tier {
  Armour: item[];
  Accessory: item[];
  Support: item[];
  Weapon: item[];
  Tank: item[];
}

const tiers = new Array<tier>(5);

// Create the storage for all tiers and types
for (const i of items) {
  for (const type of i.type) {
    switch (type) {
      case "Accessory":
        tiers[i.tier].Accessory.push(i);
        break;
      case "Armour":
        tiers[i.tier].Armour.push(i);
        break;
      case "Support":
        tiers[i.tier].Support.push(i);
        break;
      case "Weapon":
        tiers[i.tier].Weapon.push(i);
        break;
      case "Tank":
        tiers[i.tier].Tank.push(i);
        break;
    }
  }
}

let loadouts = "";

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

  return "";
}

function generateItem(selectedTier: number, type: keyof tier): string {
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

  // find the random index
  const entry = Math.floor(Math.random() * tiers[itemTier][type].length);

  return tiers[itemTier][type][entry].name;
}
