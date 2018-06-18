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

    add({
        reg: regex,
        desc: desc
    })
});


// Refresh List when storage changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace == "local" && changes.hasOwnProperty("patterns")) {
        refreshList(changes.patterns.newValue)
    }
})

// Refresh List at start.
chrome.storage.local.get("patterns", function(result) {
    refreshList(result.patterns)
})

// Removal
$("#list").on("click", ".list-remove", function(){
    var filter = $(this).parent();
    var regex = filter.find(".list-regex").text();
    console.log(regex)
    remove(regex)    
})

function remove(regex){
    chrome.storage.local.get('patterns', function(results) {
        var patterns = results.patterns || [];

        newPatterns = patterns.filter(function(el) {
            return el.reg !== regex;
        });

        chrome.storage.local.set({
            patterns: newPatterns
        });
    });
}

function add(pattern){
    chrome.storage.local.get('patterns', function(results) {
        var patterns = results.patterns || [];

        // Check if regex exists
        if (patterns.find(o => o.reg === pattern.reg)) {
            warning("Regex Exists.");
            return;
        }

        patterns.push(pattern)

        chrome.storage.local.set({
            patterns: patterns
        });
    });
}

function refreshList(patterns) {
    var list = document.getElementById("list")
    list.innerHTML = "";

    patterns.forEach((pattern) => {
        let item = document.createElement("li")
        let reg = document.createElement("span")
        let desc = document.createElement("span")
        let remove = document.createElement("button")

        reg.classList.add("list-regex")
        desc.classList.add("list-desc")
        remove.classList.add("list-remove")


        reg.innerHTML = pattern.reg
        desc.innerHTML = pattern.desc
        remove.innerHTML = "X"

        item.appendChild(remove)
        item.appendChild(desc)
        item.appendChild(reg)

        list.appendChild(item)
    })
}

function warning(text) {
    console.log(text)
}
