// ==UserScript==
// @name         Help with research
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automate some tedious tasks
// @author       You
// @match        https://www.google.com/search*
// @match        http://*/*
// @match        https://*/*
// @grant           GM_getValue
// @grant           GM_setValue
// ==/UserScript==


let idx = 0;

function get_state() {
    return GM_getValue('state', 0);
}

function run() {
    let state = get_state();
    if (state == 1 || button.value.startsWith('Finish')) stop();
    else if (state == 0) start();
}

function start() {
    idx = 0;
    GM_setValue('state', 1);
    GM_setValue('vals', '[]');
    scan();
}

function vals() {
    return JSON.parse(GM_getValue('vals', '[]'));
}

function csv(v) {
    let r = ""+v;
    r = r.replace('\t', ' ');
    r = r.replace('"', '""');
    return '"' + r + '"';
}

function stop() {
    GM_setValue('state', 0);
    let x = vals();
    let res = "";
    x.forEach(function (val) {
        res += csv(val[0]) + "\t" + csv(val[1]) + "\t" + csv(val[2]) + "\t" + csv(val[3]) + "\n";
    });
    copyToClipboard(res);
}

function copyToClipboard(x) {
  const el = document.createElement('textarea');
  el.value = x;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

let urls = []
function scan() {
    let more = []
    document.querySelectorAll('.r > a').forEach(function(el){
        if (el.children[0].innerText != "") urls.push(el.href);
    });
    button.value = "Finish [" + vals().length + "]";
}

function closeTab(){
    window.open('', '_self', '');
    window.close();
}

let totalSel = '';
function copyText() {
    let selection = window.getSelection().toString();
    if (selection != "") {
        totalSel += "\n\n" + selection;
    } else {
        let nr = GM_getValue('nr');
        let me = [nr, document.title, window.location.toString(), totalSel];
        let more = [me];
        GM_setValue('vals', JSON.stringify(vals().concat(more)));
        closeTab();
    }
}

function onFocus(){
  if (get_state() == 1) button.value = "Finish [" + vals().length + "]";
};

var button;

let basepage = 0;

(function() {
    'use strict';

    if (!GM_info.isIncognito) {
        let state = get_state();

        if (window.location.hostname == "www.google.com") {
            button = document.createElement("input");
            button.type = "button";
            button.value = state == 0 ? "Start recording" : "Finish";
            button.onclick = run;
            button.setAttribute("style", "font-size:18px;position:fixed;top:60px;right:40px;z-index:999;");
            document.body.appendChild(button);

            basepage = document.querySelector('#nav .cur').innerText;

            window.onfocus = onFocus;
        }

        document.addEventListener('keydown', function(e) {
            // pressed ctrl+g
            if (e.keyCode == 81 && !e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) {
                if (window.location.hostname == "www.google.com") {
                    if (get_state() == 1) {
                        if (urls.length <= idx) {
                            window.location = document.querySelector('#pnnext').href;
                        } else {
                            console.log(urls[idx]);
                            GM_setValue('nr', (basepage-1)*10 + idx + 1);
                            window.open(urls[idx]);
                            idx += 1;
                        }
                    }
                } else {
                    copyText();
                }
            }
        }, false);

        if (state == 1) {
            scan();
        }
    }
})();


