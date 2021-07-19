function constructUrl(rawQuery) {
    return "https://duckduckgo.com/?q=" + rawQuery;
}

function processSearch() {
    var rawQuery = document.getElementById("search-bar").value;
    url = constructUrl(rawQuery);
    window.open(url);
}
