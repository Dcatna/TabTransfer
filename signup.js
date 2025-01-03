import { createClient } from '@supabase/supabase-js';

let supabase = createClient(
    'https://jdimaknvdhxpcbvcctem.supabase.co', 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaW1ha252ZGh4cGNidmNjdGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMDY2MjcsImV4cCI6MjA1MDY4MjYyN30.V1nhLL5fNaaI7CClwHoGKNiVFiKaAr_l9h993MGUXDk"
);

document.addEventListener("DOMContentLoaded", () => {
    const signupButton = document.getElementById("signupButton")
    if (signupButton) {
        signupButton.addEventListener("click", async () => {
            const email = document.getElementById("signupemail").value
            const password = document.getElementById("signuppassword").value
            console.log(email, password)
            if (!email || !password) {
                if (status) status.textContent = "Email and password are required.";
                return;
            }
            const {data, error} = await supabase.auth.signUp({email, password})
            const status = document.getElementById("signupstatus")
            if (status) {
                if(error) {
                    status.textContent = "Signup Failed: " + error.message
                    console.log(error)
                } else {
                    status.textContent = "Signup Successful"
                    console.log("User Session: ", data)
                }
            }
        })
    }
})