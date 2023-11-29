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
  await chrome.debugger.sendCommand(debuggee, 'DOM.enable');
  await chrome.debugger.sendCommand(debuggee, 'CSS.enable');
  const { root } = await chrome.debugger.sendCommand(debuggee, 'DOM.getDocument', { depth: -1 });
  
  const allFonts = {};
  const findNodesThatContainText = async (node) => {
    if (!node.nodeValue && !node.childNodeCount) {
      return;
    }
    if (node.nodeValue && node.nodeName != '#comment') {
      const { fonts } = await chrome.debugger.sendCommand(debuggee, "CSS.getPlatformFontsForNode", { nodeId: node.nodeId });
      if (fonts.length) {
        for (let font of fonts) {
          if (!font.isCustomFont) {
            await chrome.debugger.sendCommand(debuggee, 'DOM.setAttributeValue', {
              nodeId: node.parentId,
              name: 'style',
              value: 'background-color: rgba(255,0,0,0.5)'
            });
            allFonts[font.familyName + ' - ローカルフォント'] = font.isCustomFont;
          }
          else {
            allFonts[font.familyName + ' - Webフォント'] = font.isCustomFont;
          }
        }
      }
    }
    if (node.childNodeCount) {
      for (let i = 0; i < node.childNodeCount; i++) {
        await findNodesThatContainText(node.children[i]);
      }
    }
  };

  for (let node of root.children) {
    await findNodesThatContainText(node);
  }
  
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
