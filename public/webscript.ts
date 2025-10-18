import {
  generateTier,
  formatItem,
  formatSettlementDetails,
  formatSurvivor,
} from "./generator.js";

const form = document.querySelector("form");
const monster = document.querySelector("#monsterDetails");
const survivors = document.querySelector("#survivorDetails");
const gear = document.querySelector("#gearDetails");
const settlement = document.querySelector("#settlementDetails");
const hunt = document.querySelector("#huntOr");

if (form) {
  form.addEventListener("submit", (event) => {
    const data = new FormData(form);

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
