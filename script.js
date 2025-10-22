// Redirect to DDG automatically when query params are detected
const params = new URLSearchParams(window.location.search);
const q = params.get("q");
if (q) processSearch(q);

function constructUrl(rawQuery) {
    // encode the query so characters/spaces don't break the URL
    return "https://duckduckgo.com/?q=" + encodeURIComponent(rawQuery);
}

function processSearch(rawQuery) {
    url = constructUrl(rawQuery);
    window.location.assign(url);
}

document.addEventListener("DOMContentLoaded", function () {
    // #region search-bar
    // Detect platform using User-Agent Client Hints (modern) with UA fallback
    function isMacPlatform() {
        try {
            if (navigator.userAgentData && navigator.userAgentData.platform) {
                const p = navigator.userAgentData.platform.toLowerCase();
                return p.includes("mac");
            }
        } catch (e) { /* ignore */ }

        // Fallback for Safari or older browsers
        const ua = navigator.userAgent || "";

        // Include macOS and iPads
        return /\bMacintosh\b/.test(ua);
    }

    function isLinuxOrWindowsPlatform() {
        try {
            if (navigator.userAgentData && navigator.userAgentData.platform) {
                const p = navigator.userAgentData.platform.toLowerCase();
                return p.includes("linux") || p.includes("chrome os") || p.includes("windows");
            }
        } catch (e) { /* ignore */ }

        // Fallback for Gecko, WebKit, and other non-Chromium browsers
        const ua = navigator.userAgent || "";

        // Exclude Android explicitly, which include Linux in the user agent string
        if (/\bAndroid\b/i.test(ua)) return false;

        return /\bLinux\b|\bX11\b|\bWindows\b/.test(ua);
    }

    let placeholderText = "Search DuckDuckGo";
    if (isMacPlatform()) placeholderText = "⌘K to search DuckDuckGo";
    if (isLinuxOrWindowsPlatform()) placeholderText = "Ctrl+K to search DuckDuckGo";
    document.getElementById("search-bar").setAttribute("placeholder", placeholderText);

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

    // #endregion search-bar

    // #region display-time
    function updateClock() {
        const clock = document.getElementById("clock");
        if (!clock) return;

        const now = new Date();
        const formatted = new Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23",
            hour12: false
        }).format(now);

        clock.innerHTML = formatted;
    }

    function startClock() {
        updateClock();
        setInterval(updateClock, 1000);
    }

    startClock();
    // #endregion display-time
});
