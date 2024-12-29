import { createClient } from '@supabase/supabase-js';

let supabase = createClient(
    'https://jdimaknvdhxpcbvcctem.supabase.co', 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaW1ha252ZGh4cGNidmNjdGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMDY2MjcsImV4cCI6MjA1MDY4MjYyN30.V1nhLL5fNaaI7CClwHoGKNiVFiKaAr_l9h993MGUXDk"
);

document.addEventListener("DOMContentLoaded", () => {
    // Save Tabs Button
    const saveTabsButton = document.getElementById("saveTabs");
    if (saveTabsButton) {
        saveTabsButton.addEventListener("click", () => {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                const tabUrls = tabs.map((tab) => tab.url);
                chrome.storage.local.set({ savedTabs: tabUrls }, () => {
                    alert("Tabs saved!");
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

    // Login Button
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", async () => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            const status = document.getElementById("status");
            if (status) {
                if (error) {
                    status.textContent = "Login failed: " + error.message;
                    console.log(error);
                } else {
                    status.textContent = "Login successful!";
                    console.log("User session:", data);
                }
            }
        });
    }
});
