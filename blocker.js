$(document).ready(async function() {
    var patterns = (await storageGet("patterns")).patterns
    console.log(patterns)

    $(document).on("input", ":input:not(.pif-exclude)", function() {
        var text = $(this).val() + ""
        var input = $(this)

        // Iterate over patterns, check if they match.
        patterns.forEach(function(pattern) {
            console.log(pattern)
            if (text.match(pattern.reg)) {
                blockWithPattern(pattern, text, input);
            }
        })
    })
})

function blockWithPattern(pattern, text, input) {
    // TODO: the blocking bit

    $("body").append("<div id='pif-block'>");

    // Add Blocking div, preventing mouse use.
    var block = $("#pif-block")

    block.append(`

    <div id='pif-box'>
        <h3>Oh No!</h3>
        <span id='pif-info'>You typed a banned phrase, remove it or enter the password.</span>
        <span id="pif-phrase-name">Blocking Filter: ${pattern.desc}</span>
        <input class='pif-exclude' type="password" id='pif-pass' placeholder="password" />
        <div>
            <button id="pif-remove">Remove</button>
        </div>
    </div>

    `)

    $("#pif-remove").click(function() {
        input.val(text.replace(pattern.reg, "[removed]"))
        block.remove();
    })

    $("#pif-pass").on("input", function() {
        var text = $(this).val();
    })

    // Draw Focus from the page.
    $("#pif-pass").focus();
}

function storageGet(pattern) {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(pattern, function(result) {
            resolve(result)
        })
    });
}