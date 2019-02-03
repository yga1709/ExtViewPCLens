main = () => {
  let bg = chrome.extension.getBackgroundPage();
  let scrollLevel = bg.scrollLevel;
  let currentURL = bg.currentURL;
  let mode = bg.mode;
  let modeStr = "";
  if (mode) {
    modeStr = "on";
  } else {
    modeStr = "off";
  }
  let showMessage = `URL:${currentURL} <br>数値:${scrollLevel} mode:${modeStr}`;
  document.getElementById("view").innerHTML = showMessage;
  //console.log(showMessage);
};
main();

document.getElementById("TrueExtSwc").onclick = () => {
  chrome.storage.local.set({ ext: true }, data => {
    //console.log("ONにしました");
  });
};

document.getElementById("FalseExtSwc").onclick = () => {
  chrome.storage.local.set({ ext: false }, function() {
    //console.log("OFFにします");
  });
};
