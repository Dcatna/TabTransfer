
import { createClient } from '@supabase/supabase-js';

let supabase = createClient(
    'https://jdimaknvdhxpcbvcctem.supabase.co', 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaW1ha252ZGh4cGNidmNjdGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMDY2MjcsImV4cCI6MjA1MDY4MjYyN30.V1nhLL5fNaaI7CClwHoGKNiVFiKaAr_l9h993MGUXDk"
);


document.addEventListener("DOMContentLoaded", async () => {
    let user = await supabase.auth.getUser()
    

    console.log(user, "USER")
    // Assign user data if session exists
    let user_id = user.data.id || null;

    // Save Tabs Button
    const saveTabsButton = document.getElementById("saveTabs");
    if (saveTabsButton) {
        saveTabsButton.addEventListener("click", () => {
            if (!user) {
                alert("User not logged in!");
                return;
            }

            console.log("HELLO");
            let date = new Date().toISOString();
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                const tabUrls = tabs.map((tab) => tab.url);

                // Save tabs locally
                chrome.storage.local.set({ savedTabs: tabUrls }, () => {
                    alert("Tabs saved!");
                });

                // Insert tabs into Supabase
                tabs.forEach((tab) => {
                    supabase.from("Tabs").insert({
                        "user_id": user_id, // Use user.id directly
                        "created_at": date,
                        "url": tab.url,
                        "favicon_url": tab.favIconUrl || null, // Use tab.favIconUrl for favicon
                    }).then(({ error }) => {
                        if (error) {
                            console.error("Error inserting tab:", error.message);
                        }
                    });
                });
            });
        });
    }

    // Restore Tabs Button
    const restoreTabsButton = document.getElementById("restoreTabs");
    if (restoreTabsButton) {
        restoreTabsButton.addEventListener("click", () => {
            chrome.storage.local.get("savedTabs", (data) => {
                const list = document.getElementById("savedTabList");
                if (list) {
                    list.innerHTML = ""; // Clear the list
                    if (data.savedTabs) {
                        data.savedTabs.forEach((url) => {
                            const li = document.createElement("li");
                            li.textContent = url;
                            list.appendChild(li);
                        });
                    }
                }
            });
        });
    }
})