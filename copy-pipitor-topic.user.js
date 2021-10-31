// ==UserScript==
// @name        Copy Pipitor topic
// @namespace   https://github.com/U-cauda-elongata
// @match       https://twitter.com/*
// @match       https://tweetdeck.twitter.com/*
// @match       https://www.youtube.com/channel/*
// @match       https://www.youtube.com/c/*
// @match       https://www.youtube.com/user/*
// @grant       GM_setClipboard
// @version     0.2.0
// @updateURL   https://raw.githubusercontent.com/U-cauda-elongata/copy-pipitor-topic-user-js/master/copy-pipitor-topic.user.js
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
  menuitem.label = 'Copy Pipitor topic';
  menuitem.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAACZFBMVEX////9+/3Jgrq6YafKhrz8/fjx9+P+//342+y+aKvFfLbGe7a+bK3c2t7k5ub//v/2+u7Q5qC12Wzn0cXrSaXTNpfCWqXJgbq4ZKPNo5ra0c3k9e39/v72+uy+3Hu83XnccJPtSKXtVqzlRZ7rwtjeh4vqXizbr5NYyJeH1rLm9u/+/v/g7tzz++r4td3tWqPvd4XtYVLve1DsYjDtUx6WjFZSx5RZxpRLwYu35tD+/v7J4vOirb/wmHr1sJbwhGDqWCPqUxzpUBnqUh3rVB/MbTlts4B7061Ev4bO7uPf4OCawNian63pWifqUx3qUx7qVB/taz3wiGPuc0jqViHsUx7Ce1BUvZI0uKdjxfDW19fZ3d7U2d7uo4nrVyLwglv73NH85Nzxi2fnWil+pqZgxu09t+/W19je3+Dd1MHptZrrWCXqVyP4xrT0qY/rXiv0o4b5z8DrWyjsUx2ulZJbxffe1MLlt2jyqjDzp2LrWij3vKjxj2ztbUD5xLLsXivtUx2qjIBksr1qw+j4yn32qiv4wGH0nSjsYSbtb0HtbkDqUhzvcEPgxrTXZTXrZjbwrmv0v2D35L/85b/3tkv5yHb1pybxhz3qViTsWSTcoIJVxbBarJBor5S30Kb01pv/+vP73az1rTX5ynr057rmolPoaS7sXTbwUT+mopknuaBv0cFFw65aybf3/Pz+9un97M///fvt9bXc3mPmYELwZW7sLz7OQEpjv65kzbo5vqat5Nr+//r48dztSVbvXGjvXWnuSFb+9PTM7+mQ2870+/r/+vzwanTsPUrsPErwZXD/+PnzZlTSAAABAklEQVQY02NgAAFGJmZmFkYGKGBlY+fg5OLm4eXjB/MFBIWERUTFxCUkpaRlQAKycvIKikrKKqpq6hqaWkABbR1dPX0DQyNjE1MzcwtLBitrG1s7ewdHJ2cXVzd3D08GL28fXz//gMCg4JDQsPCISIao6JjYOP/4hITEJL/klNQ0hvSMzKzsnNy8/ILCouKS0jSGsvKKyqqQ6hqn2rr6hsamZoaW1rb2Dv/Oru6e3r7+CRMnMUyeMnXa9BnOfjNnzZ4zd978BQwMCxctXrJ02fIVK1etXrN2HdBh6zds3LR5y9Zt23fs3LUb6r09e/ftP3Dw0OEjR2EePnb8xMlTp8FMAJB0U8CDvt8wAAAAAElFTkSuQmCC';
  menuitem.setAttribute('disabled', '');
  menu.appendChild(menuitem);

  function enableMenuTwitter(id, screenName, name) {
    menuitem.label = `Copy Pipitor topic for "${name}"`;
    menuitem.dataset.text = `Twitter ${id}, -- @${screenName} ${name}`;
    menuitem.removeAttribute('disabled');
  }

  function disableMenu() {
    menuitem.label = 'Copy Pipitor topic';
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
        enableMenuTwitter(id, screenName, name);
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
          enableMenuTwitter(id, screenName, name);
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
      enableMenuTwitter(id, screenName, name);
    } else {
      disableMenu();
    }
  }

  switch (location.host) {
    case 'twitter.com':
      document.body.addEventListener('contextmenu', twitterHandler);
      break;
    case 'tweetdeck.twitter.com':
      document.body.addEventListener('contextmenu', tweetDeckHandler);
      break;
    case 'www.youtube.com':
      const name = document.querySelector('meta[itemprop="name"]').content;
      const id = document.querySelector('meta[itemprop="channelId"]').content;
      menuitem.label = `Copy Pipitor topic for "${name}"`;
      menuitem.dataset.text = `youtube "${id}", -- ${name}`;
      menuitem.removeAttribute('disabled');
      break;
    default:
      throw new Error('Unreachable');
  }

  menuitem.addEventListener('click', e => {
    GM_setClipboard(e.target.dataset.text, 'text');
  });
})();
