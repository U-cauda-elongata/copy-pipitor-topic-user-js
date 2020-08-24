// ==UserScript==
// @name        Copy Twitter profile as Pipitor manifest entry
// @namespace   https://github.com/U-cauda-elongata
// @match       https://twitter.com/*
// @match       https://tweetdeck.twitter.com/*
// @grant       GM_setClipboard
// @version     0.1.0
// @updateURL   https://raw.githubusercontent.com/U-cauda-elongata/twitter-pipitor-helper/master/twitter-pipitor-helper.user.js
// @author      Yu 'The Long-tailed Bear' Onaga
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

const defaultMenuID = 'gm-uce-twitter-pipitor-helper';

(() => {
  'use strict';

  let menu;
  const menuID = document.body.getAttribute('contextmenu');
  if (! menuID) {
    menu = document.createElement('menu');
    menu.id = defaultMenuID;
    menu.type = 'context';
    document.body.setAttribute('contextmenu', defaultMenuID);
    document.body.appendChild(menu);
  } else {
    menu = document.getElementById(menuID);
  }

  const menuitem = document.createElement('menuitem');
  menuitem.label = 'Copy Pipitor manifest entry';
  menuitem.icon = 'https://twitter.com/favicon.ico';
  menu.appendChild(menuitem);

  function enableMenu(id, screenName, name) {
    menuitem.label = `Copy Pipitor manifest entry for "${name}"`;
    menuitem.dataset.id = id;
    menuitem.dataset.screenName = screenName;
    menuitem.dataset.name = name;
    menuitem.removeAttribute('disabled');
  }

  function disableMenu() {
    menuitem.label = 'Copy Pipitor manifest entry';
    menuitem.setAttribute('disabled', '');
  }

  function twitterHandler(e) {
    const n = e.target;

    const popupProfileImage = document.querySelector('#layers a[role="link"][aria-hidden="true"]');
    if (popupProfileImage) {
      // Take data from popup profile content.
      const id = popupProfileImage?.nextSibling?.firstChild?.dataset?.testid?.
        match(/^(\d+)-(?:un)?follow$/)?.[1];
      const screenName = popupProfileImage?.attributes?.href?.textContent?.slice(1);
      const name = popupProfileImage?.querySelector('img')?.alt;
      if (id && screenName && name) {
        enableMenu(id, screenName, name);
        return;
      }
    } else {
      // Take data from profile page content.
      const profilePageFollowButton = document.querySelector('[data-testid="placementTracking"]');
      const id = profilePageFollowButton?.firstChild?.firstChild?.dataset?.testid?.
        match(/^(\d+)-(?:un)?follow$/)?.[1];
      const nodes = profilePageFollowButton?.parentNode?.parentNode?.nextSibling?.
        querySelectorAll('div > span:first-of-type');
      if (nodes) {
        const [nameNode, screenNameNode] = nodes;
        const screenName = screenNameNode?.textContent?.slice(1);
        const name = nameNode?.textContent;
        if (id && screenNameNode && name) {
          enableMenu(id, screenName, name);
          return;
        }
      }
    }
    disableMenu();
  }

  function tweetDeckHandler(e) {
    const n = e.target.closest('.js-tweet, .prf');
    if (n) {
      const id = n.querySelector('[data-user-id]').dataset.userId;
      const screenName = n.querySelector('.username').firstChild.textContent.slice(1);
      const name = n.querySelector('.fullname').innerText;
      enableMenu(id, screenName, name);
    } else {
      disableMenu();
    }
  }

  document.body.addEventListener('contextmenu', location.host == 'twitter.com' ? twitterHandler : tweetDeckHandler);

  menuitem.addEventListener('click', e => {
    const id = e.target.dataset.id;
    const screenName = e.target.dataset.screenName;
    const name = e.target.dataset.name;
    const text = `Twitter ${id}, -- @${screenName} ${name}`;
    GM_setClipboard(text, 'text');
  });
})();
