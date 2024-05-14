"use strict";


const token = localStorage.getItem("token");
const editMenuEl = document.getElementById("editMenu");
const logInEl = document.getElementById("logIn");
const logOutEl = document.getElementById("logOut");

document.addEventListener("DOMContentLoaded", () => {

    if (token) {
        editMenuEl.style.display = "block";
        logInEl.style.display = "none";
        logOutEl.style.display = "block";
        logOutEl.addEventListener("click", logOutUser);

    } else {
        editMenuEl.style.display = "none";
        logInEl.style.display = "block";
        logOutEl.style.display = "none";
    }

    getData();
});

//Hämtar in data från databasen
async function getData() {
    const url = "https://projektapi-backend2.onrender.com/api/menu";

    try {
        const response = await fetch(url);
        const data = await response.json();
        const matContainer = document.getElementById("mat");
        const dryckContainer = document.getElementById("dryck");
        const dessertContainer = document.getElementById("dessert");


        if (response.ok) {
            //Loopa igenom datan och skapa article- element för varje jobberfrenhet
            data.forEach(menuItem => {
                const article = document.createElement("article");
                article.dataset._id = menuItem._id; //Ger articlen samma ID som jobberfarenheten
                article.innerHTML = `
                <h3>${menuItem.name}</h3>
                <p>${menuItem.description}</p>
                <p><strong>Pris: ${menuItem.price}</strong></p>
                `;

                // Lägger till menyobjektet i rätt kategori-container
                if (menuItem.category === "mat") {
                    matContainer.appendChild(article);
                } else if (menuItem.category === "dryck") {
                    dryckContainer.appendChild(article);
                } else if (menuItem.category === "dessert") {
                    dessertContainer.appendChild(article);
                }
            });
        }

    } catch (error) {
        console.error("Något gick fel: ", error);
    }
}

function logOutUser() {
    // Ta bort token från localStorage
    localStorage.removeItem("token");

    // Återgå till startsidan
    location.reload();
}

