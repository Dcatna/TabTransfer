import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    'https://jdimaknvdhxpcbvcctem.supabase.co', 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaW1ha252ZGh4cGNidmNjdGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMDY2MjcsImV4cCI6MjA1MDY4MjYyN30.V1nhLL5fNaaI7CClwHoGKNiVFiKaAr_l9h993MGUXDk"
);
const user = supabase.auth.getUser()
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "uploadTabs") {
        const {error} = supabase.from("Tabs").insert(message.tabs.map((tab) => ({
            user_id: user.id,
            url: tab
        })))
        if (error) {
            console.log(error)
            sendResponse({success:false, error})

        }else{
            sendResponse({success:true})
        }
    }
})
