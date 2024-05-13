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
                <p>Underkategori: ${menuItem.subcategory}</p>
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

//RADERA ITEM!
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

//LÄGG TILL ITEM!
const categorySelect = document.getElementById("category");
const subcategorySelect = document.getElementById("subcategory");

// En lista med kategorier och underkategorier
const subcategories = {
    mat: ["maki", "nigiri", "ramen", "mix"],
    dryck: ["läsk", "sake", "öl", "te"],
    dessert: ["glass", "bakverk", "choklad"]
};

//Byter listan med underkategorier utifrån vald kategori
categorySelect.addEventListener("change", updateSubcategories);

function updateSubcategories() {
    const selectedCategory = categorySelect.value;
    const subcategoriesForCategory = subcategories[selectedCategory];
    
    // Rensa befintliga alternativ
    subcategorySelect.innerHTML = "";
    
    // Lägg till nya alternativ baserat på vald kategori
    subcategoriesForCategory.forEach(subcategory => {
        const option = document.createElement("option");
        option.value = subcategory;
        option.textContent = subcategory;
        subcategorySelect.appendChild(option);
    });
}

// Kör updateSubcategories vid sidans laddning för att fylla i underkategorier
updateSubcategories();


//Länkar till knappen i formulär och lägger på event listener
const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", submitForm)

//Funktion för att lägga till data till API/server från formuläret
function submitForm() {
    const form = document.getElementById("menuForm");
    const formData = new FormData(form);

    //Hämta väg till felmeddelande
    const errorMsgEl = document.getElementById("errorMsg");

    //Hämtar värdena från formulärets olika inputfält
    const name = formData.get("itemName");
    const category = formData.get("category");
    const subcategory = formData.get("subcategory");
    const price = formData.get("price");
    const description = formData.get("description");

    //Felmeddelande om något av de obligatoriska fälten inte är ifyllda
    if (!name.trim() || !category.trim() || !subcategory.trim() || !price.trim() || !description.trim()) {
        errorMsgEl.innerText = "Vänligen fyll i alla fält.";
        return;
    } else {
        errorMsgEl.innerText = ""; // Töm felmeddelandet om alla fält är ifyllda korrekt
    }

    //Använder formulärdatan och kör den i funktionen createWorkexperience
    createMenuItem(name, category, price, description);

    //rensar formuläret vid lyckat anrop
    form.reset();
}

//Skapa ny jobberfarenhet
async function createMenuItem(name, category, price, description) {

    const url = "https://projektapi-backend2.onrender.com/api/menu";

    let menuItem = {
        name: name,
        category: category,
        price: price,
        description: description
    }

    await fetch(url, {

        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "content-type": "Application/json"
        },
        body: JSON.stringify(menuItem)
    })

    window.location.reload();

}
