function isNullOrUndefined(a) {
  return (a === null) || (a === undefined);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numberFormat(labelValue, i) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9 ?
    i === 0 ? parseFloat((Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2)) : parseFloat((Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2)) + " b"
    // Six Zeroes for Millions
    :
    Math.abs(Number(labelValue)) >= 1.0e+6 ?
    i === 0 ? parseFloat((Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2)) : parseFloat((Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2)) + " m"
    // Three Zeroes for Thousands
    :
    Math.abs(Number(labelValue)) >= 1.0e+3 ?
    i === 0 ? parseFloat((Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2)) : parseFloat((Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2)) + " k" :
    Math.abs(Number(labelValue));
}

function random(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isCombat() {
  return window.location.href.indexOf("http://game.granbluefantasy.jp/#raid_multi/") > -1 || window.location.href.indexOf("http://game.granbluefantasy.jp/#raid/") > -1;
}

var simulateClick = function (elem) {
  try {
    var rect = elem.getBoundingClientRect(),
      topEnter = rect.top,
      leftEnter = rect.left,
      topMid = random(rect.bottom, rect.top),
      leftMid = random(rect.right, rect.left),
      ddelay = (rect.height + rect.width) * 0.1,
      ducInit = {
        bubbles: true,
        clientX: leftMid,
        clientY: topMid
      },
      mover = new MouseEvent('mouseover', {
        bubbles: true,
        clientX: leftEnter,
        clientY: topEnter
      }),
      mdown = new MouseEvent('mousedown', ducInit),
      mup = new MouseEvent('mouseup', ducInit),
      mclick = new MouseEvent('click', ducInit);
    elem.dispatchEvent(mover);
    window.setTimeout(function () {
      elem.dispatchEvent(mdown)
    }, ddelay);
    window.setTimeout(function () {
      elem.dispatchEvent(mup);
      elem.dispatchEvent(mclick);
    }, ddelay * random(.99, 1.2)); //default 1.2x
  } catch (e) {}
}

/**Keyboard Events**/
function pCA() {
  if (!isCombat()) {
    return
  };
  var c = document.querySelector('div.btn-lock.lock1');
  var c1 = document.querySelector('div.btn-lock.lock0'); //no auto
  !isNullOrUndefined(c) ? simulateClick(c) : null;
  !isNullOrUndefined(c1) ? simulateClick(c1) : null;
}

function pResetBonus() {
  var resetMarkBtn = document.querySelector("div.prt-bonus-reset-button.btn-bonus-reset.weapon");
  !isNullOrUndefined(resetMarkBtn) ? simulateClick(resetMarkBtn) : null;
}

function pSpaceBar(e) {
  var buttons = ['div.btn-usual-ok', //normal ok button
    'div.btn-usual-ok.btn-summon-use',
    'div.btn-settle', //upgrade button step 1
    'div.btn-synthesis', //upgrade button step 2
    'div.btn-usual-text.exchange', //casino
    'div.btn-usual-text.buy', //all shops
    'div.btn-evolution.active',
    'div.btn-use-item',
    'div.btn-follow-again', //uncapping
    'div.btn-usual-exchange', //reset btn
    "div.btn-move-division", //arcarum move button
    "div.btn-usual-close" //close button
  ];
  var elem;
  var queue = [];
  for (var i = 0; i < buttons.length; i++) {
    var a = document.querySelector(buttons[i]);
    if (!isNullOrUndefined(a)) {
      if (i === 0) {
        queue.unshift(buttons[i]); ////okbutton takes no.1 priority
      } else {
        queue.push(buttons[i]);
      }
    }
  }

  if (queue.length > 0) {
    //prioritize ok btn in queue
    if (queue[0] === buttons[0] && !isNullOrUndefined(document.querySelector(queue[0]))) {
      elem = document.querySelector(queue[0]).className.includes("btn-usual-ok") ?
        document.querySelector(queue[0]) : document.querySelectorAll(queue[0])[1];
    } else {
      for (var i = 0; i < queue.length; i++) {
        if (!isNullOrUndefined(document.querySelector(queue[i]))) {
          elem = document.querySelector(queue[i]);
        } else if (value === "div.btn-evolution.active") {
          elem = document.querySelector("#btn-evolution");
        }
      }
    }
  }
  //var ignore = ['div.btn-usual-ok.btn-summon-use', 'div.btn-usual-ok.btn-ability-use', 'div.onm-anim-mask']
  if (!isNullOrUndefined(elem)) {
    isNullOrUndefined(document.querySelector('div.onm-anim-mask')) ? simulateClick(elem) :
      getComputedStyle(document.querySelector('div.onm-anim-mask')).getPropertyValue('display') === "none" ? simulateClick(elem) :
      simulateClick(document.querySelector('div.onm-anim-mask'));
  }

}
/**Show Skill Cooldowns**/
function showSkillCD() {
  if (!isCombat()) {
    return
  };
  //all charater skill nodes
  var charaSkillDetails = document.querySelectorAll('[ability-id]');
  var cdCharaSkills = []; //sorted into chara[index], skills
  for (i = 0; i <= 3; i++) { //sorting
    var currentChara = {
      skills: []
    }
    for (var i = 0; i < charaSkillDetails.length; i++) {
      if (charaSkillDetails[i].outerHTML === document.querySelector("div.btn-usual-ok.btn-ability-use").outerHTML) {} else if ((charaSkillDetails[i].outerHTML.includes("ability-character-num-" + (i + 1)) === true)) {
        if (!isNullOrUndefined(charaSkillDetails[i].getAttribute("ability-recast"))) {
          currentChara.skills.push(charaSkillDetails[i].getAttribute("ability-recast"));
        }
      }
    }
    cdCharaSkills.push(currentChara);
  }
  var cdSkillMini = [];
  var abilityStates = document.querySelectorAll('div.prt-ability-state');
  for (var i = 0; i < abilityStates.length; i++) {
    if (index <= 3) {
      cdSkillMini.push(value);
    }
  }
  //looping each character, and its skills, to set its skill timer
  for (var i = 0; i < cdSkillMini.length; i++) {
    var skCount = 0;
    var childNodes = document.querySelectorAll('div.prt-ability-state')[i].childNodes;
    for (var j = 0; j < childNodes.length; j++) {
      if ((j % 2) === 1) {
        var coolDown = cdCharaSkills[i].skills[skCount];
        if (!isNullOrUndefined(coolDown)) {
          if (coolDown === '0') {
            coolDown = "";
          }
          childNodes[j].innerHTML = '<p style="position: relative;color:black;font-weight:bold;font-size: 6px;text-align: center;top: -4px;text-shadow: 0 0 10px #ffffff, 0 0 10px #ffffff;">' + coolDown + '</p>';
        }
        skCount++;
      }
    }
  }
}
/**Show Enemy HP**/
function showBossHP() {
  if (!isCombat()) {
    return
  };
  try {
    var a = stage.pJsnData.boss;
    var enemyId = -1;
    var hpBars = document.querySelectorAll("div.prt-gauge-area")[0].childNodes;
    for (var i = 0; i < hpBars.length; i++) {
      if (!isNullOrUndefined(hpBars[i].className) && hpBars[i].classList.contains("prt-enemy-percent")) {
        enemyId++;
        var newStr = numberWithCommas(numberFormat(a.param[enemyId].hp, 1) + " / " + numberFormat(a.param[enemyId].hpmax), 1);
        var accPercHP = ((a.param[enemyId].hp / a.param[enemyId].hpmax) * 100).toFixed(1);
        var stillAlive = a.number;
        var remaining = a.param;
        for(var j = 0; j< remaining.length;j++){
          if (e.alive === 0) {
            stillAlive--;
          }
        }
        if (stillAlive > 1) {
          hpBars[i].childNodes[1].innerText = accPercHP + "%" + "\n (" + newStr + ")";
          hpBars[i].childNodes[1].style.cssText = "text-shadow: 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400; display: -webkit-box; margin: -34px 0 0 -20px; font-size:12px; width: 200px !important";
        } else {
          hpBars[i].childNodes[1].innerText = accPercHP + "%" + "	(" + newStr + ")";
          hpBars[i].childNodes[1].style.cssText = "text-shadow: 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400; display: -webkit-box; margin: -6px 0 0 70px; font-size:15px; width: 300px !important";
        }
      }
    }
  } catch (e) {
    if (e instanceof ReferenceError) {}
  }
}

var sSkill = [];
var selectedCombatChara;

document.addEventListener('click', function (e) {
  if (isCombat() && !isNullOrUndefined(e.target.parentNode) && !isNullOrUndefined(e.target.parentNode.getAttribute("pos"))) {
    selectedCombatChara = {};
    sSkill = [];
    selectedCombatChara = e.target.parentNode;
    setCharaSkill(selectedCombatChara.getAttribute("pos"));
  }
});

//Keypress handler
document.addEventListener('keydown', function (e) {
  if (e.which === 32) {
    var typing = true;
    var textAreas = document.querySelectorAll("textarea");
    for(var i = 0; i<textAreas.length;i++){
      if (!isNullOrUndefined(textAreas[i].getAttribute("disabled") && textAreas[i].getAttribute("disabled") == true)) {
        typing = false;
      }
    }
    if (!typing) {
      pSpaceBar(e);
      e.preventDefault();
      e.stopPropagation();
    } else {
      return true;
    }
  }
  if (e.keyCode === 67) {
    pCA();
  }
  if (e.keyCode === 82) {
    pResetBonus();
  }
  if (e.key === "Escape" || e.key === "Esc") {
    if (!isCombat()) {
      return;
    }
    var backButton = document.querySelectorAll("div.btn-command-back");
    selectedCombatChara = {};
    sSkill = [];
    if (backButton.length > 0 && !isNullOrUndefined(backButton[0])) {
      simulateClick(backButton[0]);
    }
  }

  //qwer -> 113,119,101,114 (skill) || QWER -> 81, 87, 69, 82 (skill)
  var combat = [81, 87, 69, 82];
  //1234 -> 49, 50, 51, 52 (character)
  var combat2 = [49, 50, 51, 52];

  if (combat2.includes(e.keyCode)) {
    if (!isCombat()) {
      return
    };
    var index = combat2.indexOf(e.keyCode);
    shortcutSelectChara(index)
  }

  if (combat.includes(e.keyCode)) {
    if (!isCombat()) {
      return
    };
    var index = combat.indexOf(e.keyCode);
    shortcutSkill(index);
  }

});

function setCharaSkill(index) {
  sSkill = [];
  // document.querySelectorAll("div.prt-ability-list")[0].childNodes[1].className.includes("btn-ability-available")
  var abilityChildNodes = document.querySelectorAll("div.prt-ability-list")[index].childNodes;
  for(var i = 0; i<abilityChildNodes.length;i++){
    if (!isNullOrUndefined(abilityChildNodes[i].className) && abilityChildNodes[i].className.includes("btn-ability")) {
      sSkill.push(abilityChildNodes[i]);
    }
  }
}

function shortcutSelectChara(index) {
  try {
    simulateClick(document.querySelectorAll("div.lis-character" + index + ".btn-command-character")[0]);
    setCharaSkill(index);
  } catch (e) {}
}

function shortcutSkill(index) {
  try {
    if (sSkill[index].className.includes("btn-ability-available")) {
      simulateClick(sSkill[index]);
    }
  } catch (e) {}
}


var observer = new MutationObserver(function (mutations) {
  try {
    showSkillCD();
    showBossHP();
  } catch (e) {
    if (e instanceof ReferenceError) {};
  }
});
var config = {
  attributes: true,
  childList: true,
  characterData: true
};

var ready = function () {
  /* if(document.querySelectorAll("body.jssdk").length>0){
  	var trackerBar = document.createElement("div");
  	trackerBar.className = "keimateItemTracker";
  	document.querySelector("body.jssdk").appendChild(trackerBar);
  	return;
  } */
  if (isCombat()) {
    if (document.querySelectorAll('[ability-id]').length > 0 && document.querySelectorAll("div.prt-gauge-area")[0].childNodes.length > 0) {
      var abiltiyIds = document.querySelectorAll('[ability-id]');
      for (var i = 0; i < abiltiyIds.length; i++) {
        observer.observe(abiltiyIds[i], {
          attributes: true,
          childList: true,
          characterData: true
        })
      }
      var enemyHpBars = document.querySelectorAll("[id^=enemy-hp]");
      for (var i = 0; i < enemyHpBars.length; i++) {
        observer.observe(enemyHpBars[i], {
          attributes: true,
          childList: true,
          characterData: true
        })
      }
      var enemiesA = document.querySelectorAll("a");
      for (var i = 0; i < enemiesA.length; i++) {
        if (val.className.includes("enemy")) {
          val.style.cssText = "display: inline-block;cursor:pointer;";
        }
      }

      try {
        showSkillCD();
        showBossHP();
      } catch (e) {
        if (e instanceof ReferenceError) {};
      }
    }
  } else if (window.location.href === "http://game.granbluefantasy.jp/#item" && document.querySelectorAll("div.lis-item.se").length > 0) {
    //loadTracker("Supply");
    return;
  }
  window.requestAnimationFrame(ready);
};
window.requestAnimationFrame(ready);