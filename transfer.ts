import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    'https://jdimaknvdhxpcbvcctem.supabase.co', 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaW1ha252ZGh4cGNidmNjdGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMDY2MjcsImV4cCI6MjA1MDY4MjYyN30.V1nhLL5fNaaI7CClwHoGKNiVFiKaAr_l9h993MGUXDk"
);

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "uploadTabs") {
   
      const { data: user, error: userError } = await supabase.auth.getUser()
  
      if (userError || !user) {
        sendResponse({ success: false, error: "User not logged in or error fetching user" })
        return
      }
  
      if (!Array.isArray(message.tabs)) {
        sendResponse({ success: false, error: "Invalid tabs data" })
        return
      }
  
      try {
        const { error } = await supabase.from("Tabs").insert(
          message.tabs.map((tab) => ({
            user_id: user.user.id,
            url: tab,
          }))
        )
  
        if (error) {
          console.error("Error inserting tabs:", error)
          sendResponse({ success: false, error })
        } else {
          sendResponse({ success: true })
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        sendResponse({ success: false, error: err.message })
      }
  
      return true
    }
  });
  