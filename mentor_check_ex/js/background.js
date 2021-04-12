chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const ret = {};
  const l = localStorage;

  for (i = 0; i < l.length; i++) {
    const item = {};
    ret[l.key(i)] = l.getItem(l.key(i));
  }
  sendResponse(ret);
});
