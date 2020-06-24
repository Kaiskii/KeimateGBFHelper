let sSkill = [];
let selectedCombatChara;

const showSkillCD = () => {
  if (!isCombat())
    return;

	//all charater skill nodes
	let charaSkillDetails = document.querySelectorAll('[ability-id]');
  let cdCharaSkills = []; //sorted into chara[index], skills

	for (let i = 0; i <= 3; i++) { //sorting
		let currentChara = {
			skills: []
    }

		for (let j = 0; j < charaSkillDetails.length; j++) {
			if ((charaSkillDetails[j].outerHTML.includes("ability-character-num-" + (i + 1)) === true)) {
        let availableSkill = charaSkillDetails[j].getAttribute("ability-recast");

				if (!isNullOrUndefined(availableSkill)) {
					currentChara.skills.push(availableSkill);
				}
			}
		}

		cdCharaSkills.push(currentChara);
	}
	let cdSkillMini = [];
  let partyAbilityStates = document.querySelectorAll('div.prt-ability-state');

	for (let i = 0; i < partyAbilityStates.length; i++) {
		if (i <= 3)
			cdSkillMini.push(partyAbilityStates[i]);
  }

	//looping each character, and its skills, to set its skill timer
	for (let i = 0; i < cdSkillMini.length; i++) {
		let skCount = 0;
    let stateChildren = document.querySelectorAll('div.prt-ability-state')[i].childNodes;

		for (let j = 0; j < stateChildren.length; j++) {
			if ((j % 2) === 1) {
				let coolDown = cdCharaSkills[i].skills[skCount];
				if (!isNullOrUndefined(coolDown)) {
					if (coolDown === '0') {
						coolDown = "";
					}
					stateChildren[j].innerHTML = '<p style="position: relative;color:black;font-weight:bold;font-size: 6px;text-align: center;top: -4px;text-shadow: 0 0 10px #ffffff, 0 0 10px #ffffff;">' + coolDown + '</p>';
				}
				skCount++;
			}
		}
	}
}

/**Keyboard Events**/
const pCA = () => {
	if (!isCombat())
		return

	let c = document.querySelector('div.btn-lock.lock1');
  let c1 = document.querySelector('div.btn-lock.lock0'); //no auto

	!isNullOrUndefined(c) ? simulateClick(c) : null;
	!isNullOrUndefined(c1) ? simulateClick(c1) : null;
}

/**Show Enemy HP**/
const showBossHP = () => {
	if (!isCombat()) {
		return
  }

	try {
		let a = stage.pJsnData.boss;
		let enemyId = -1;
    let combatField = document.querySelectorAll("div.prt-gauge-area")[0].childNodes;

		combatField.forEach((enemy, eIndex) => {
			if (!isNullOrUndefined(enemy.className) && enemy.classList.contains("prt-enemy-percent")) {
				enemyId++;
				let newStr = numberWithCommas(numberFormat(a.param[enemyId].hp, 1) + " / " + numberFormat(a.param[enemyId].hpmax), 1);
				let accPercHP = ((a.param[enemyId].hp / a.param[enemyId].hpmax) * 100).toFixed(1);
        let stillAlive = a.number;

				a.param.forEach((e, i) => {
					if (e.alive === 0) {
						stillAlive--;
					}
        });

				if (stillAlive > 1) {
					enemy.childNodes[1].innerText = accPercHP + "%" + "\n (" + newStr + ")";
					enemy.childNodes[1].style.cssText = "text-shadow: 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400; display: -webkit-box; margin: -34px 0 0 -20px; font-size:12px; width: 200px !important";
				} else {
					enemy.childNodes[1].innerText = accPercHP + "%" + "	(" + newStr + ")";
					enemy.childNodes[1].style.cssText = "text-shadow: 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400; display: -webkit-box; margin: -6px 0 0 70px; font-size:15px; width: 300px !important";
				}
			}
		});
	} catch (e) {
		// if (e instanceof ReferenceError)
      // console.log(e);
  }
}

// Returns the Currently Active Character
const getActiveCharacter = () => {
  if(!isCombat())
    return;

  let charaEle = document.getElementsByClassName('prt-command-chara');

  for(let i = 0; i < charaEle.length; i += 1) {
    if(window.getComputedStyle(charaEle[i]).display == 'block' && !(charaEle[i].classList.contains('anim-slide-command-right') || charaEle[i].classList.contains('anim-slide-command-left'))) {
      return charaEle[i];
    }
  }
}

// Depending on Index, Use the Index-ed Active Skill
const useActiveCharaSkill = (index) => {
  const currEle = getActiveCharacter();

  if(!currEle) {
    // console.log("No Character Selected!");
    return;
  }

  // 2 is ALWAYS prt-ability-list
  const currEleSkill = currEle.children[2];
  const selectedSkill = currEleSkill.children[index];

  if(selectedSkill.classList.contains("btn-ability-available")) {
    simulateClick(selectedSkill.children[0]);
  }
}

document.addEventListener('click', function (e) {
	// if (isCombat() && !isNullOrUndefined(e.target.parentNode) && !isNullOrUndefined(e.target.parentNode.getAttribute("pos"))) {
	// 	selectedCombatChara = {};
	// 	sSkill = [];
	// 	selectedCombatChara = e.target.parentNode;
	// 	setCharaSkill(selectedCombatChara.getAttribute("pos"));
  // }

  // console.log(e.clientX, e.clientY);
});

const ready = () => {
	if (isCombat()) {
		let abilityIds = document.querySelectorAll('[ability-id]');
		if (abilityIds.length > 0 && document.querySelectorAll("div.prt-gauge-area")[0].childNodes.length > 0) {
			for (let i = 0; i < abilityIds.length; i++) {
				observer.observe(abilityIds[i], {
					attributes: true,
					childList: true,
					characterData: true
				});
      }

			let enemyHPs = document.querySelectorAll("[id^=enemy-hp]");
			for (let i = 0; i < enemyHPs.length; i++) {
				observer.observe(enemyHPs[i], {
					attributes: true,
					childList: true,
					characterData: true
				});
      }

			try {
				// showSkillCD();
				showBossHP();
			} catch (e) {
				if (e instanceof ReferenceError) {
          console.log(e);
        };
			}
    }


	}
	window.requestAnimationFrame(ready);
};
window.requestAnimationFrame(ready);


const setCharaSkill = (index) => {
	sSkill = [];
	// document.querySelectorAll("div.prt-ability-list")[0].childNodes[1].className.includes("btn-ability-available")
	let prtAbilityList = document.querySelectorAll("div.prt-ability-list")[index].childNodes;

	sSkill = Object.values(prtAbilityList).filter((item) => {
		if (!isNullOrUndefined(item.className) && item.className.includes("btn-ability")) {
			return item;
		}
	});
}

const shortcutSelectChara = (index) => {
	try {
		simulateClick(document.querySelectorAll("div.lis-character" + index + ".btn-command-character")[0]);
		setCharaSkill(index);
	} catch (e) {}
}

const shortcutSkill = (index) => {
	try {
		if (sSkill[index].className.includes("btn-ability-available")) {
      // simulateClick(sSkill[index]);
      console.log(sSkill[index]);
		}
	} catch (e) {}
}