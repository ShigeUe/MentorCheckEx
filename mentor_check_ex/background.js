"use strict";

fetch('../manifest.json')
  .then(response => response.json())
  .then((local) => {
    chrome.storage.sync.set({ version: local.version });
  });
