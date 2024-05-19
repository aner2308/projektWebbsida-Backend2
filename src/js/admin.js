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
        const matContainer = document.getElementById("mat");
        const dryckContainer = document.getElementById("dryck");
        const dessertContainer = document.getElementById("dessert");

        if (response.ok) {
            // Loopa igenom datan och skapa article-element för varje menuItem
            data.forEach(menuItem => {
                const article = document.createElement("article");
                article.dataset._id = menuItem._id; // Ger articlen samma ID som menuItem

                // Hämtar endast datumet (och inte tiden) från menuItem.created
                const datum = new Date(menuItem.created);
                const formateratDatum = datum.toISOString().split('T')[0];

                article.innerHTML = `
                    <h3><span class="name">${menuItem.name}</span></h3>
                    <p><strong>Tillagd: </strong>${formateratDatum}</p>
                    <p><strong>Beskrivning: </strong><span class="description">${menuItem.description}</span></p>
                    <p><strong>Kategori: </strong><span class="category">${menuItem.category}</span></p>
                    <p><strong>Underkategori: </strong><span class="subcategory">${menuItem.subcategory}</span></p>
                    <p><strong>Pris: </strong><span class="price">${menuItem.price}</span></p>
                    <button class="deleteBtn" type="button">Radera</button>
                    <button class="editBtn" type="button">Redigera</button>`;

                // Lägger till menyobjektet i rätt kategori-container
                if (menuItem.category === "mat") {
                    matContainer.appendChild(article);
                } else if (menuItem.category === "dryck") {
                    dryckContainer.appendChild(article);
                } else if (menuItem.category === "dessert") {
                    dessertContainer.appendChild(article);
                }

                // Lägg till eventListener för delete-knappen i article
                const deleteBtn = article.querySelector(".deleteBtn");
                deleteBtn.addEventListener("click", () => deleteMenuItem(menuItem._id));

                // Lägg till eventListener för edit-knappen i article
                const editBtn = article.querySelector(".editBtn");
                editBtn.addEventListener("click", () => {
                    const token = localStorage.getItem("token");

                    if (token) {
                        editBtn.style.display = "none";
                        const name = article.querySelector(".name");
                        const description = article.querySelector(".description");
                        const price = article.querySelector(".price");
                        const category = article.querySelector(".category");
                        const subcategory = article.querySelector(".subcategory");

                        name.innerHTML = `<input type="text" class="editName" value="${menuItem.name}">`;
                        description.innerHTML = `<input type="text" class="editDescription" value="${menuItem.description}">`;
                        price.innerHTML = `<input type="number" class="editPrice" value="${menuItem.price}">`;
                        category.innerHTML = `<input type="text" class="editCategory" value="${menuItem.category}">`;
                        subcategory.innerHTML = `<input type="text" class="editSubcategory" value="${menuItem.subcategory}">`;

                        const saveBtn = document.createElement("button");
                        saveBtn.textContent = "Spara";
                        saveBtn.classList.add("saveBtn");
                        saveBtn.type = "button";

                        // Händelselyssnare för att spara ändringar
                        saveBtn.addEventListener("click", () => {
                            const newItem = {
                                name: article.querySelector(".editName").value,
                                description: article.querySelector(".editDescription").value,
                                price: article.querySelector(".editPrice").value,
                                category: article.querySelector(".editCategory").value,
                                subcategory: article.querySelector(".editSubcategory").value,
                            };

                            updateItem(article.dataset._id, newItem)
                                .then(() => {
                                    name.textContent = newItem.name;
                                    description.textContent = newItem.description;
                                    price.textContent = newItem.price;
                                    category.textContent = newItem.category;
                                    subcategory.textContent = newItem.subcategory;

                                    saveBtn.remove();
                                    editBtn.style.display = "block";
                                })
                                .catch(error => {
                                    console.error("Ett fel uppstod vid uppdatering av menyobjektet...", error);

                                    // Återställer sidan med de gamla värdena om uppdateringen misslyckas
                                    name.textContent = menuItem.name;
                                    description.textContent = menuItem.description;
                                    price.textContent = menuItem.price;
                                    category.textContent = menuItem.category;
                                    subcategory.textContent = menuItem.subcategory;

                                    saveBtn.remove();
                                    editBtn.style.display = "inline-block";
                                });
                        });
                        article.appendChild(saveBtn);
                    } else {
                        console.log("Logga in för att redigera ett menyobjekt.");
                    }
                });
            });
        }

    } catch (error) {
        console.error("Något gick fel: ", error);
    }
}



//logga ut admin
const logOutEl = document.getElementById("logOut");
logOutEl.addEventListener("click", logOutUser);

function logOutUser() {
    localStorage.removeItem("token");
    location.reload();
}


//UPPDATERA ITEM!
async function updateItem(itemId, newItem) {
    let updateUrl = `https://projektapi-backend2.onrender.com/api/menu/${itemId}`;
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(updateUrl, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newItem)
        });

        if (response.ok) {
            console.log("Menyobjektet med id: " + itemId + " har uppdaterats!")
        } else {
            throw new Error(`Fel vid uppdatering av menyobjekt med id ${itemId}.`);
        }
    } catch (error) {
        console.error("Error:", error);
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

//LÄGG TILL ITEM VIA FORMULÄR!
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
    const form = document.getElementById("menuFormAdmin");
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
    createMenuItem(name, category, subcategory, price, description);

    //rensar formuläret vid lyckat anrop
    form.reset();
}

//Skapar nytt menuItem
async function createMenuItem(name, category, subcategory, price, description) {

    const url = "https://projektapi-backend2.onrender.com/api/menu";

    let menuItem = {
        name: name,
        category: category,
        subcategory: subcategory,
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

//Funktion för min hamburgermeny
const toggleMenu = document.getElementById("menuToggle");
const toggleOff = document.getElementById("toggleOff");

toggleMenu.addEventListener("click", toggleMobileMenu);
toggleOff.addEventListener("click", toggleMobileMenu);

function toggleMobileMenu() {
    const mobileMenuEl = document.getElementById("mobileMenu");

    if (mobileMenuEl.style.width === "0px" || mobileMenuEl.style.width === "") {
        mobileMenuEl.style.width = "80%"; 
    } else {
        mobileMenuEl.style.width = "0px"; 
    }
}

