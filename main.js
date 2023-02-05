toBlure = [""]
isNeedToRunHandler = true
length = 0;

function load() {
    try {
        chrome.storage.sync.get(['toBlure'], (result) => {
            if (result && result.toBlure)
                toBlure = result.toBlure;
        });
    } catch { }
    try {
        tmp = browser.storage.sync.get('toBlure')
        if (tmp)
            toBlure = tmp;
    } catch { }
}

function save(toBlure) {
    try {
        chrome.storage.sync.set({ toBlure: toBlure });
    } catch { }
    try {
        browser.storage.sync.set({ toBlure: toBlure });
    } catch { }
}

function findImageByDismissible(dismissible) {
    return dismissible.getElementsByClassName("style-scope ytd-thumbnail")[0].firstElementChild.firstElementChild
}

function blure(dismissible) {
    try {
        findImageByDismissible(dismissible).setAttribute("style", "filter: blur(12px);")
    } catch {
    }
}

function unblure(dismissible) {
    try {
        findImageByDismissible(dismissible).setAttribute("style", "filter: blur(0px);")
    } catch {
    }
}

function addButton(dismissible) {
    textElement = dismissible.getElementsByClassName("yt-simple-endpoint style-scope yt-formatted-string")[0]
    containerToAddButton = textElement
        .parentElement.parentElement.parentElement.parentElement.parentElement

    btn = document.createElement("img")
    btn.src = chrome.runtime.getURL('images/logo.png');
    let id = self.crypto.getRandomValues(new Uint32Array(1))[0];
    btn.id = id
    btn.addEventListener("click", (e) => {
        e.stopPropagation()
        let channelName = document.getElementById(id)
            .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
            .querySelectorAll("#dismissible")[0]
            .getElementsByClassName("yt-simple-endpoint style-scope yt-formatted-string")[0].text
        try {
            filtered = toBlure.filter((v) => v != channelName)
        } catch {
            toBlure = [""]
            filtered = [""]
        }
        if (filtered.length != toBlure.length)
            toBlure = filtered
        else
            toBlure.push(channelName)
        isNeedToRunHandler = true
    })
    containerToAddButton.appendChild(btn)
}

function isNeedToAddButton(dismissible) {
    textElement = dismissible.getElementsByClassName("yt-simple-endpoint style-scope yt-formatted-string")[0]
    if (!textElement)
        return false
    let channelName = textElement.text
    if (!channelName)
        return false
    containerToAddButton = textElement
        .parentElement.parentElement.parentElement.parentElement.parentElement
    if (containerToAddButton.lastChild.tagName == "IMG")
        return false
    return true
}

function addNewButtons(dismissibles) {
    for (dismissible of dismissibles)
        if (isNeedToAddButton(dismissible))
            addButton(dismissible)
}

function handle(dismissibles) {
    for (dismissible of dismissibles) {
        textElement = dismissible.getElementsByClassName("yt-simple-endpoint style-scope yt-formatted-string")[0]
        if (!textElement)
            continue
        let channelName = textElement.text
        if (!channelName)
            continue
        
        if (!toBlure)
            toBlure = [""]  

        if (toBlure.includes(channelName)) {
            blure(dismissible)
        } else {
            unblure(dismissible)
        }
    }
}

load()
setInterval(function () {
    dismissibles = document.querySelectorAll("#dismissible")
    if (length != dismissibles.length)
        addNewButtons(dismissibles)
    if (isNeedToRunHandler) {
        handle(dismissibles)
        isNeedToRunHandler = false;
    }
}, 500);    

