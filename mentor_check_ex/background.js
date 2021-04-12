const changeIcon = function (url) {
  if (/^https:\/\/techacademy\.jp\/mentor\/all\/reports/.test(url)) {
    chrome.action.setIcon({ path: "img/icon-16.png" });
  }
  else {
    chrome.action.setIcon({ path: "img/icon-16-disabled.png" });
  }
};

chrome.tabs.onActivated.addListener(function (object) {
  chrome.tabs.get(object.tabId, function (tab) {
    changeIcon(tab.url);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  changeIcon(tab.url);
});
