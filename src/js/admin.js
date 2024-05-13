"use strict";

const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {

    if (!token) {
        window.location.href = "index.html";
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

                //Hämtar endast datumet(och inte tiden) från menuItem.created
                const datum = new Date(menuItem.created);
                const formateratDatum = datum.toISOString().split('T')[0];

                article.innerHTML = `
                <h3>${menuItem.name}</h3>
                <p>Tillagd: ${formateratDatum}</p>
                <p>Beskrivning: ${menuItem.description}</p>
                <p>Kategori: ${menuItem.category}</p>
                <p><strong>Pris: ${menuItem.price}</strong></p>
                <button class="deleteBtn">Radera</button>`;

                //Lägger till menyobjektet i min menuContainer
                menuContainer.appendChild(article);

                //Lägger till eventListener för delete knappen i articlen
                const deleteBtn = article.querySelector(".deleteBtn");
                deleteBtn.addEventListener("click", () => deleteMenuItem(menuItem._id));
            });
        }

    } catch (error) {
        console.error("Något gick fel: ", error);
    }
}

async function deleteMenuItem(_id) {
    const deleteUrl = `https://projektapi-backend2.onrender.com/api/menu/${_id}`;
    const token = localStorage.getItem("token");
    
    try {
        const response = await fetch(deleteUrl, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            // Tar bort articlen
            const articleToDelete = document.querySelector(`article[data-_id="${_id}"]`);
            if (articleToDelete) {
                articleToDelete.remove();
                console.log(`Menyobjekt med id ${_id} har raderats`);
            } else {
                console.error(`Kunde inte hitta article med id ${_id} i DOM:en.`);
            }
        } else {
            throw new Error(`Fel vid radering av menyobjekt med id ${_id}.`);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
