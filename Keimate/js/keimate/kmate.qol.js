const CopyToClipboard = (text) => {
  let dummy = document.createElement("textarea");
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  // dummy.style.display = 'none'
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

// Main Function for Copying Raid ID
const CopyRaidID = () => {
  if (isCombat()) {
    let idEle = document.getElementsByClassName('prt-battle-id');

    if(idEle[0]) {
      console.log("Copied to Clipboard!");

      CopyToClipboard(idEle[0].textContent);
    }
  }
}