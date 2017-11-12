
window.addEventListener("load", function () {
    chrome.i18n.process(document);
    chrome.extension.onRequest.addListener(function (d, c, b) {
        console.warn(d, d.command);
        if (typeof d == "object" && d.command == "stop") {
            b();
            window.close()
        }
    });
    if (document.querySelector("select")) {
        document.querySelector("select").addEventListener("change", function a(b) {
            chrome.extension.sendRequest({
                command: b.target.getAttribute("name"),
                arguments: [b.target.value]
            }, function (c) {
                if (c) {
                    window.close()
                }
            })
        }, false)
    }
    document.addEventListener("click", function a(b) {
        if (["BUTTON", "INPUT"].indexOf(b.target.tagName) != -1) {
            chrome.extension.sendRequest({
                command: b.target.getAttribute("name"),
                arguments: [b.target.value]
            }, function (c) {
                if (c) {
                    window.close()
                }
            });
            if (b.target.getAttribute("name") == "cancel") {
                window.close();
                return true
            }
            if (b.target.getAttribute("name") == "screenshot") {
                window.close();
                return true
            }
        }
    }, false)
}, false);