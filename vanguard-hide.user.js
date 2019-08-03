// ==UserScript==
// @name         hide some vanguard accounts
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @namespace    me.stefanheule.com
// @version      1.0
// @include      *
// @grant        none
// ==/UserScript==

// document.getElementsByTagName('video')[0].playbackRate = 1;

// alert('ok')
this.$ = this.jQuery = jQuery.noConflict(true);

function readBalance(el) {
  return +el.innerText.substr(1).replace(',','');
}
function writeBalance(el, val) {
  val = val.toLocaleString('en');
  return el.innerText = '$' + val;
}

function run(callNr) {
    console.log('hello');
  if (document.location.href == "https://personal.vanguard.com/my-accounts/account-overview/K/balances") {


    // find account to hide:
    let links = document.querySelectorAll('.accountInfo > a');
    let idx = -1;
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
      let match = /[^0-9]([0-9]*)\*/.exec(link.innerText);
      if (match && match[1] == "16735878") {
        idx = i;
        break;
      }
    }

    if (idx >= 0) {
      let balances = document.querySelectorAll('.balance');
      let ignore = balances[idx + 1];

      // fix balance
      let headingTotal = document.querySelector('#sncPortfolioBalance');
      let totals = [balances[0], balances[balances.length-1], headingTotal];
      let val = readBalance(ignore);
      let totalVal = readBalance(totals[0]);
      for (let total of totals) {
        writeBalance(total, totalVal - val);
      }

      // change color
      ignore.style.color = '#ddd';
      links[idx].style.color = '#ddd';

      return;
    }

     // run again
    if (callNr > 0) {
      setTimeout(function(){
        run(callNr - 1);
      }, 500);
    }
  }
}

$( document ).ready(function() {
  run(10);
});
