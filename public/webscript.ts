import {
  generateTier,
  formatItem,
  formatSettlementDetails,
  formatSurvivor,
  generateExpansionList,
  load,
  formatWeaponList,
  getWeapon,
  getItem,
} from "./generator.js";

const generator = document.querySelector("#generator") as HTMLFormElement;
const optionsForm = document.querySelector("#optionsForm") as HTMLFormElement;
const optionsMenu = document.querySelector("#options");
const options = document.querySelector("#optionsButton");
const expansionList = document.querySelector("#expansionList");
const monster = document.querySelector("#monsterDetails");
const survivors = document.querySelector("#survivorDetails");
const gear = document.querySelector("#gearDetails");
const settlement = document.querySelector("#settlementDetails");
const hunt = document.querySelector("#huntOr");
const weaponSelect = document.querySelector("#weaponSelect");
const weaponResult = document.querySelector("#weaponResult");
const armourSelect = document.querySelector("#armourSelect");
const armourResult = document.querySelector("#armourResult");
const accessorySelect = document.querySelector("#accessorySelect");
const accessoryResult = document.querySelector("#accessoryResult");
const endeavorCount = document.querySelector("#endeavorCount");

let currentTier = 0;

const endeavorTitle = "🜂 You Each May Endeavor At Camp Before Departing: ";

// gen expansion list
if (expansionList) expansionList.innerHTML = generateExpansionList();

if (generator) {
  generator.addEventListener("submit", (event) => {
    if (weaponResult) weaponResult.innerHTML = "";
    const data = new FormData(generator);

    currentTier = Number(data.get("tier"));

    const challenge = generateTier(
      Number(data.get("tier")),
      Number(data.get("count"))
    );

    if (monster && challenge.monster && hunt) {
      if (challenge.monster.nemesis) {
        hunt.innerHTML = `They Are Hunted By`;
      } else {
        hunt.innerHTML = `They Hunt`;
      }

      let attributes = "";

      for (const a of challenge.monster.attributes) {
        attributes += `${a}, `;
      }

      monster.innerHTML = `<h3>Level ${challenge.monster.tier} ${challenge.monster.name}</h3><p>${attributes}</p>`;
    }

    if (survivors) {
      let survivorHTML = "";
      let i = 1;
      for (const s of challenge.survivors) {
        survivorHTML += `<div id="S${i}" class="settlementAttribute">${formatSurvivor(
          s
        )}</div>`;
        i++;
      }
      survivors.innerHTML = survivorHTML;
    }

    let gearHTML = "";
    for (const i of challenge.items) {
      gearHTML += `<div class="gear"> ${formatItem(i)} </div>`;
    }
    if (gear) gear.innerHTML = gearHTML;

    if (settlement && challenge.settlement)
      settlement.innerHTML = formatSettlementDetails(challenge.settlement);

    // generate weapon list for replacement
    if (weaponSelect) {
      weaponSelect.innerHTML = formatWeaponList(Number(data.get("tier")));
    }

    // update endeavor count if scouts present
    if (endeavorCount) {
      let stars = "";
      for (let i = 0; i < Number(data.get("count")); i++) {
        stars += "✪";
      }
      endeavorCount.innerHTML = endeavorTitle + stars;
    }

    event.preventDefault();
  });
}

if (optionsForm) {
  optionsForm.addEventListener("submit", (event) => {
    const expansionData = new FormData(optionsForm);

    const expansions: string[] = [];

    expansionData.forEach((value, key) => {
      expansions.push(key);
    });

    //reload with these expansions
    load(expansions);

    event.preventDefault();
  });
}

if (weaponSelect && weaponResult) {
  weaponSelect.addEventListener("change", (event) => {
    weaponResult.innerHTML = getWeapon(
      currentTier,
      (event as any).target.value
    );
  });
}

if (options && optionsMenu) {
  options.addEventListener("click", (event) => {
    (optionsMenu as HTMLElement).style.visibility === "visible"
      ? ((optionsMenu as HTMLElement).style.visibility = "collapse")
      : ((optionsMenu as HTMLElement).style.visibility = "visible");
  });
}

if (armourResult && armourSelect) {
  armourSelect.addEventListener("click", (event) => {
    armourResult.innerHTML = getItem(currentTier, "Armour");
  });
}

if (accessoryResult && accessorySelect) {
  accessorySelect.addEventListener("click", (event) => {
    accessoryResult.innerHTML = getItem(currentTier, "Accessory");
  });
}
