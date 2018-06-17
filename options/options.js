document.getElementById("regex-submit").addEventListener("click", function() {
    var desc = document.getElementById("regex-desc-field").value;
    var regex = document.getElementById("regex-field").value;

    if (!desc) {
        desc = "Untitled"
    }
    if (!regex) {
        warning("Must enter RegEx.");
        return
    }

    chrome.storage.local.get('patterns', function(results) {
        var patterns = results.patterns || [];

        // Check if regex exists
        if (patterns.find(o => o.reg === regex)) {
            warning("Regex Exists.");
            return;
        }

        patterns.push({
            reg: regex,
            desc: desc
        })
        chrome.storage.local.set({
            patterns: patterns
        });
    });
});


// Refresh List when storage changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace == "local" && changes.hasOwnProperty("patterns")) {
        refreshList(changes.patterns.newValue)
    }
})

// Refresh List at start.
chrome.storage.local.get("patterns", function(result) {
    console.log(result)
    refreshList(result.patterns)
})

function refreshList(patterns) {
    var list = document.getElementById("list")
    list.innerHTML = "";

    patterns.forEach((pattern) => {
        let item = document.createElement("li")
        let reg = document.createElement("span")
        let desc = document.createElement("span")

        reg.classList.add("list-regex")
        desc.classList.add("list-desc")

        reg.innerHTML = pattern.reg
        desc.innerHTML = pattern.desc

        item.appendChild(desc)
        item.appendChild(reg)

        list.appendChild(item)
    })
}

function warning(text) {
    console.log(text)
}