import {
  generateTier,
  formatItem,
  formatSettlementDetails,
  formatSurvivor,
  generateExpansionList,
  load,
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

// gen expansion list
if (expansionList) expansionList.innerHTML = generateExpansionList();

if (generator) {
  generator.addEventListener("submit", (event) => {
    const data = new FormData(generator);

    const challenge = generateTier(Number(data.get("tier")));

    if (monster && challenge.monster && hunt) {
      if (challenge.monster.nemesis) {
        hunt.innerHTML = `They Are Hunted By`;
      } else {
        hunt.innerHTML = `They Hunt`;
      }
      monster.innerHTML = `Level ${challenge.monster.tier} ${challenge.monster.name}`;
    }

    if (survivors)
      survivors.innerHTML = `<div class="character"><p>${formatSurvivor(
        challenge.survivors[0]
      )}</p></div> <div class="character"><p>${formatSurvivor(
        challenge.survivors[1]
      )}</p></div> <div class="character"><p>${formatSurvivor(
        challenge.survivors[2]
      )}</p></div> <div class="character"><p>${formatSurvivor(
        challenge.survivors[3]
      )}</p></div>`;

    let gearHTML = "";
    for (const i of challenge.items) {
      gearHTML += `<div class="gear"> ${formatItem(i)} </div>`;
    }
    if (gear) gear.innerHTML = gearHTML;

    if (settlement && challenge.settlement)
      settlement.innerHTML = formatSettlementDetails(challenge.settlement);

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

if (options && optionsMenu) {
  options.addEventListener("click", (event) => {
    (optionsMenu as HTMLElement).style.visibility === "visible"
      ? ((optionsMenu as HTMLElement).style.visibility = "collapse")
      : ((optionsMenu as HTMLElement).style.visibility = "visible");
  });
}
