"use strict";

document.getElementById('FONT_CHECK_BUTTON').addEventListener('click', async (evt) => {
  evt.preventDefault();

  // クリックされたタブを取得
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const debuggee = { tabId: tab.id };
  console.log("debuggee", debuggee);

  // Debuggerにアタッチ
  try {
    await chrome.debugger.attach(debuggee, '1.3');
  }
  catch (e) {
    console.error(e);
  }
  const { root } = await chrome.debugger.sendCommand(debuggee, 'DOM.getDocument');
  await chrome.debugger.sendCommand(debuggee, 'CSS.enable');
  const elements = await chrome.debugger.sendCommand(debuggee, 'DOM.querySelectorAll', { nodeId: root.nodeId, selector: '*' });
  const allFonts = {};
  for (let nodeId of elements.nodeIds) {
    const { fonts } = await chrome.debugger.sendCommand(debuggee, "CSS.getPlatformFontsForNode", { nodeId });
    if (!fonts.length) {
      continue;
    }

    for (let font of fonts) {
      if (!font.isCustomFont) {
        await chrome.debugger.sendCommand(debuggee, 'DOM.setAttributeValue', {
          nodeId,
          name: 'style',
          value: 'background-color: rgba(255,0,0,0.7)'
        });
        allFonts[font.familyName + ' - ローカルフォント'] = font.isCustomFont;
      }
      else {
        allFonts[font.familyName + ' - Webフォント'] = font.isCustomFont;
      }
    }
  }
  console.log(allFonts);

  try {
    await chrome.debugger.detach(debuggee);
  }
  catch (e) {
    console.error(e);
  }

  const FONT_CHECK_RESULT = document.getElementById('FONT_CHECK_RESULT');
  for (let key in allFonts) {
    FONT_CHECK_RESULT.value += key + "\n";
  }
  return false;
});
