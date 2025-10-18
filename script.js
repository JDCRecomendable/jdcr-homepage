function constructUrl(rawQuery) {
    // encode the query so characters/spaces don't break the URL
    return "https://duckduckgo.com/?q=" + encodeURIComponent(rawQuery);
}

function processSearch(rawQuery) {
    url = constructUrl(rawQuery);
    window.location.assign(url);
}

document.addEventListener("DOMContentLoaded", function () {
    // Detect platform using User-Agent Client Hints (modern) with UA fallback
    function isApplePlatform() {
        try {
            if (navigator.userAgentData && navigator.userAgentData.platform) {
                const p = navigator.userAgentData.platform.toLowerCase();
                // Values often like "macOS", "iOS", "Windows", "Linux", "Android", "Chrome OS"
                return p.includes("mac") || p.includes("ios");
            }
        } catch (e) { /* ignore */ }

        // Fallback: parse userAgent string (works with Safari UA override)
        const ua = navigator.userAgent || "";
        // Covers macOS and iOS devices; iPadOS on Safari may report as "Macintosh" but is fine here
        return /\bMacintosh\b|\biPhone\b|\biPad\b|\biPod\b/.test(ua);
    }

    const macLike = isApplePlatform();
    document.getElementById("search-bar").setAttribute("placeholder", macLike
        ? "⌘K to search DuckDuckGo"
        : "Ctrl+K to search DuckDuckGo"
    );

    // Redirect to DDG appropriately on submit
    document.getElementById("form").addEventListener("submit", function (event) {
        event.preventDefault();
        console.log(event);
        processSearch(document.getElementById("search-bar").value);
    });

    // Add keyboard shortcut: Cmd/Ctrl+K focuses the search bar
    document.addEventListener("keydown", function (event) {
        const key = event.key ? event.key.toLowerCase() : "";
        if (key === "k" && (event.ctrlKey || event.metaKey)) {
            // Don't hijack the shortcut when typing in an input/textarea/contenteditable
            const active = document.activeElement;
            const tag = active && active.tagName ? active.tagName.toLowerCase() : "";
            const isEditable = active && (active.isContentEditable || tag === "input" || tag === "textarea");
            if (isEditable) return;

            event.preventDefault();
            const search = document.getElementById("search-bar");
            if (search) {
                search.focus();
                if (typeof search.select === "function") search.select();
            }
        }
    });

    document.getElementById("search-bar").focus();

    // Redirect to DDG automatically when query params are detected
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) processSearch(q);
});
