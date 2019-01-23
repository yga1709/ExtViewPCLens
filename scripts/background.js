var scrollLevel;
var currentURL;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  console.log(sender);
  console.log(sendResponse);
  scrollLevel = request.scrollLevel;
  currentURL = request.currentURL;
});
