"use strict";

const token = localStorage.getItem("token");
const editMenuEl = document.getElementById("editMenu");
const logInEl = document.getElementById("logIn");
const logOutEl = document.getElementById("logOut");
const menuLink = document.getElementById("menuLink");
const aboutLink = document.getElementById("aboutLink");
const findUsLink = document.getElementById("findUsLink");

document.addEventListener("DOMContentLoaded", () => {

        menuLink.addEventListener("click", (event) => {
            event.preventDefault();
            const menuElement = document.getElementById("menu");
            const offset = 120;
            const elementPosition = menuElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        });

        aboutLink.addEventListener("click", (event) => {
            event.preventDefault();
            const aboutElement = document.getElementById("aboutUs");
            const offset = 120;
            const elementPosition = aboutElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        });

        findUsLink.addEventListener("click", (event) => {
            event.preventDefault();
            const findUsElement = document.getElementById("findUs");
            const offset = 120;
            const elementPosition = findUsElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        });

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
    openMenu(event, 'mat');
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
            // Skapa ett objekt för att lagra menyobjekt grupperade efter kategori och subkategori
            const menuData = {
                mat: {},
                dryck: {},
                dessert: {}
            };

            // Gruppera menyobjekt efter kategori och subkategori
            data.forEach(menuItem => {
                if (!menuData[menuItem.category][menuItem.subcategory]) {
                    menuData[menuItem.category][menuItem.subcategory] = [];
                }
                menuData[menuItem.category][menuItem.subcategory].push(menuItem);
            });

            // Funktion för att skapa artikel-element för varje menyobjekt
            const createMenuItemElement = (menuItem) => {
                const article = document.createElement("article");
                article.dataset._id = menuItem._id;
                article.innerHTML = `
                    <h3>${menuItem.name}</h3>
                    <p>${menuItem.description}</p>
                    <p><strong>Pris: ${menuItem.price}</strong></p>
                `;
                return article;
            };

            // Funktion för att skapa subkategori-sektioner
            const createSubcategorySection = (subcategoryName, items) => {
                const section = document.createElement("section");
                const header = document.createElement("h4");
                header.textContent = subcategoryName;
                section.appendChild(header);
                items.forEach(item => section.appendChild(createMenuItemElement(item)));
                return section;
            };

            // Lägg till menyobjekt i respektive kategori-container
            for (const category in menuData) {
                for (const subcategory in menuData[category]) {
                    const section = createSubcategorySection(subcategory, menuData[category][subcategory]);
                    if (category === "mat") {
                        matContainer.appendChild(section);
                    } else if (category === "dryck") {
                        dryckContainer.appendChild(section);
                    } else if (category === "dessert") {
                        dessertContainer.appendChild(section);
                    }
                }
            }
        }

    } catch (error) {
        console.error("Något gick fel: ", error);
    }
}

//logga ut admin
function logOutUser() {
    localStorage.removeItem("token");
    location.reload();
}

//Hämtar in knapparna för mina matflikar
document.getElementById("matBtn").addEventListener("click", (event) => openMenu(event, 'mat'));
document.getElementById("dryckBtn").addEventListener("click", (event) => openMenu(event, 'dryck'));
document.getElementById("dessertBtn").addEventListener("click", (event) => openMenu(event, 'dessert'));

//Bläddrar mellan menyerna
function openMenu(event, menuName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(menuName).style.display = "block";
    event.currentTarget.className += " active";
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
