document.getElementById("saveTabs").addEventListener("click", () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const tabUrls = tabs.map((tab) => tab.url);
        chrome.storage.local.set({ savedTabs: tabUrls }, () => {
            alert("Tabs saved!");
        });
    });
 });
 
 document.getElementById("restoreTabs").addEventListener("click", () => {
    chrome.storage.local.get("savedTabs", (data) => {
        const list = document.getElementById("savedTabList");
        list.innerHTML = ""; // Clear the list
        if (data.savedTabs) {
            data.savedTabs.forEach((url) => {
                const li = document.createElement("li");
                li.textContent = url;
                list.appendChild(li);
            });
        }
    });
 });
 