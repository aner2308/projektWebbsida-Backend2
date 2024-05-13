"use strict";

const token = localStorage.getItem("token");
const editMenuEl = document.getElementById("editMenu");

document.addEventListener("DOMContentLoaded", () => {

    if (token){
        window.location.href = referer || "index.html";
    }

    editMenuEl.style.display = "none";

});

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://projektapi-backend2.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        let data = await response.json();

        if (response.ok) {
            // Hantera lyckad inloggning
            const token = data.response.token;
            console.log(token);
            localStorage.setItem("token", token);

            // Hämta refererande sidan från header eller sessionStorage om den finns
            const referer = sessionStorage.getItem("referer") || document.referrer;

            // Om det finns en refererande sida, gå tillbaka dit, annars till index.html
            window.location.href = referer || "index.html";
        } else {
            // Hantera misslyckad inloggning
            alert("Fel användarnamn eller lösenord!");
        }
    } catch (error) {
        console.error("Error:", error);
        // Hantering av andra typer av fel
        alert("Ett fel uppstod. Försök igen senare.");
    }
});

