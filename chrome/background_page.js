/*
var iToolbarId;
*/
const DEBUG = false;
chrome.contextMenus.create({
    type: "normal",
    title: "print part",
    id: "print",
    onclick: goPrint
});
chrome.browserAction.onClicked.addListener(function (a) {
    if (a.url.indexOf("https://chrome.google.com/") == 0 || a.url.indexOf("http") != 0) {
        alert(chrome.i18n.getMessage("savethetrees_error_invalid_url"))
    } else {
        function popAndStart() {
            chrome.browserAction.setPopup({
                tabId: a.id,
                popup: 'chrome/infobar.html'
            });
            chrome.tabs.sendRequest(a.id, {command: "start"});
        }

        if (chrome.safari && !localStorage.installed) {
            alert(chrome.i18n.getMessage("savethetrees_error_install"));
            localStorage.installed = "true"
        }
        chrome.tabs.executeScript(a.id,
            {
                code: 'if(!window.contentLoaded){alert("' + chrome.i18n.getMessage("savethetrees_error_install") + '")}'
            },
            popAndStart)
    }
});
var printing = false;
chrome.extension.onRequest.addListener(function (c, b, a) {
    if (c.command) {
        chrome.tabs.getSelected(null, function (d) {
            switch (c.command) {
                case"display":
                    chrome.tabs.getSelected(null, function (e) {
                        chrome.tabs.sendRequest(e.id, c)
                    });
                    break;
                case"screenshot":
                    chrome.windows.getLastFocused(function (e) {
                        chrome.windows.create({
                            type: "popup",
                            top: e.top,
                            left: e.left,
                            width: chrome.settings.get("panel.width"),
                            height: chrome.settings.get("panel.height"),
                            url: "chrome/screenshot.html#" + d.id
                        }, function (f) {
                        })
                    });
                    break;
                case"print":
                    printing = true;
                    chrome.tabs.sendRequest(d.id, {command: "select"}, function () {
                        chrome.tabs.sendRequest(d.id, {command: "print"}, function () {
                            DEBUG && console.log("printed");
                            printing = false;
                            chrome.tabs.sendRequest(d.id, {command: "stop"}, function () {
                            })
                        })
                    });
                    break;
                case"cancel":
                    chrome.tabs.sendRequest(d.id, {command: "stop"}, function () {
                    });
                    break;
                case"close":
                    if (!printing) {
                        chrome.tabs.sendRequest(d.id, {command: "stop"}, function () {
                        })
                    }
                    break
            }
        })
    }
});
if (chrome.settings.has("printplusId")) {
    try {
        chrome.management.getAll(function (a) {
            if (a.some(function (b) {
                    return b.id == chrome.settings.get("printplusId")
                })) {
                chrome.management.setEnabled(chrome.settings.get("printplusId"), false)
            }
        })
    } catch (err) {
    }
};

function goPrint() {
    chrome.tabs.getSelected(null, function (d) {
        printing = true;
        chrome.tabs.sendRequest(d.id, {command: "select"}, function () {
            chrome.tabs.sendRequest(d.id, {command: "print"}, function () {
                DEBUG && console.log("printed");
                printing = false;
                chrome.tabs.sendRequest(d.id, {command: "stop"}, function () {
                })
            })
        });
    });
}