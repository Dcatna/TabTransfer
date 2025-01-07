
import { createClient } from '@supabase/supabase-js';

let supabase = createClient(
    'https://jdimaknvdhxpcbvcctem.supabase.co', 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaW1ha252ZGh4cGNidmNjdGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMDY2MjcsImV4cCI6MjA1MDY4MjYyN30.V1nhLL5fNaaI7CClwHoGKNiVFiKaAr_l9h993MGUXDk"
);


document.addEventListener("DOMContentLoaded", async () => {
    let user = await supabase.auth.getUser()
    

    console.log(user, "USER")
    // Assign user data if session exists
    let user_id = user.data.user.id || null;
    console.log(user_id)
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
        restoreTabsButton.addEventListener("click", async () => {

            const {data, error} = await supabase.from("Tabs").select("url").eq("user_id", user_id).order("created_at", {ascending: false}).limit(1)
            console.log(data)
            if (error) {
                console.error("Error inserting tab:", error.message);
                return
            } 
            if (data.length > 0) {
                let most_recent = data[0].created_at

                const {data, error } = await supabase.from("Tabs").select("url").eq("user_id").eq("created_at", most_recent)

                if (error ) {
                    console.error("Error fetching tbas")
                    return
                }

                data.forEach((tab) => {
                    chrome.tabs.create({url: tab.url})
                })
            }
        });
    }
})