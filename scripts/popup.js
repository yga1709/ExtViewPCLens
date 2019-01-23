main = () => {
  let bg = chrome.extension.getBackgroundPage();
  let scrollLevel = bg.scrollLevel;
  let currentURL = bg.currentURL;
  let showMessage = `URL:${currentURL} <br>数値:${scrollLevel}`;
  document.getElementById("view").innerHTML = showMessage;
  console.log(showMessage);
};
main();
