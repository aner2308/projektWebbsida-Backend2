"use strict";


const token = localStorage.getItem("token");
const editMenuEl = document.getElementById("editMenu");

document.addEventListener("DOMContentLoaded", () => {

    if (token) {
        editMenuEl.style.display = "block";
    } else {
        editMenuEl.style.display = "none";
    }

    getData();
});

//Hämtar in data från databasen
async function getData() {
    const url = "https://projektapi-backend2.onrender.com/api/menu";

    try {
        const response = await fetch(url);
        const data = await response.json();
        const menuContainer = document.getElementById("menuContainer");
        

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
                menuContainer.appendChild(article);
            });
        }

    } catch (error) {
        console.error("Något gick fel: ", error);
    }
}