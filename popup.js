import { createClient } from '@supabase/supabase-js';

let supabase = createClient(
    'https://jdimaknvdhxpcbvcctem.supabase.co', 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaW1ha252ZGh4cGNidmNjdGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMDY2MjcsImV4cCI6MjA1MDY4MjYyN30.V1nhLL5fNaaI7CClwHoGKNiVFiKaAr_l9h993MGUXDk"
);

document.addEventListener("DOMContentLoaded", async () => {
    const { data: { session } } = await supabase.auth.getSession(); //check if user is already authenticated

    if (session) {
        console.log("User is already logged in:", session.user);
        window.location.href = "home.html";
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
                    console.log("User session: ", data);
                    window.location.href = "home.html"
                }
            }
        });
    }

    
});
