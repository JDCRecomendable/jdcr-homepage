function constructUrl(rawQuery) {
    // encode the query so characters/spaces don't break the URL
    return "https://duckduckgo.com/?q=" + encodeURIComponent(rawQuery);
}

function processSearch() {
    var rawQuery = document.getElementById("search-bar").value;
    url = constructUrl(rawQuery);
    window.location.assign(url);
}
