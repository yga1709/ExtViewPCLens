var scrollLevel;
var currentURL;
var mode;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  console.log(sender);
  console.log(sendResponse);
  scrollLevel = request.scrollLevel;
  currentURL = request.currentURL;
  mode = request.mode;
});
