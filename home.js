
import { createClient } from '@supabase/supabase-js';

let supabase = createClient(
    'https://jdimaknvdhxpcbvcctem.supabase.co', 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaW1ha252ZGh4cGNidmNjdGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMDY2MjcsImV4cCI6MjA1MDY4MjYyN30.V1nhLL5fNaaI7CClwHoGKNiVFiKaAr_l9h993MGUXDk"
);



document.addEventListener("DOMContentLoaded", async () => {
    let user = await supabase.auth.getUser()
    let user_id = user.data.user.id || null;

    async function getUserLists() {
        const {data, error } = await supabase.from("Groups").select("*").eq("user_id", user_id)
        if(error) {
            console.log(error, "ERROR")
            return []
        }
        return data
    }

    async function renderUserLists() {
        const userListsContainer = document.getElementById("userLists");
        const lists = await getUserLists();

        if (lists.length === 0) {
            userListsContainer.innerHTML = "<p>No lists found.</p>";
            return;
        }

        userListsContainer.innerHTML = ""; // Clear existing content

        lists.forEach(list => {
            const listElement = document.createElement("div");
            listElement.style.border = "1px solid #ccc";
            listElement.style.padding = "10px";
            listElement.style.marginBottom = "10px";
            listElement.style.borderRadius = "5px";
            listElement.style.backgroundColor = "#f9f9f9";

            listElement.innerHTML = `
                <h3>${list.group_name}</h3>
                <p>${list.description || "No description available"}</p>
            `;

            userListsContainer.appendChild(listElement);
        });
    }

    renderUserLists();

    console.log(user, "USER")
    // Assign user data if session exists
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

            const {data: latestTabs, error} = await supabase.from("Tabs").select("*").eq("user_id", user_id).order("created_at", {ascending: false})
            console.log(latestTabs)
            if (error) {
                console.error("Error inserting tab:", error.message);
                return
            } 
            if (latestTabs.length > 0 && latestTabs) {
                console.log(latestTabs)
                let most_recent = latestTabs[0].created_at

                const {data, error } = await supabase.from("Tabs").select("url").eq("user_id", user_id).eq("created_at", most_recent)

                if (error ) {
                    console.error("Error fetching tbas", error.message)
                    return
                }

                data.forEach((tab) => {
                    chrome.tabs.create({url: tab.url})
                })
            }
        });
    }
})