"use strict";

const token = localStorage.getItem("token");
const editMenuEl = document.getElementById("editMenu");
const editMenuEl2 = document.getElementById("editMenu2");
const logInEl = document.getElementById("logIn");
const logOutEl = document.getElementById("logOut");

//Länkarna i mina menyer
const links = [
    { link: "menuLink", target: "menu" },
    { link: "aboutLink", target: "aboutUs" },
    { link: "findUsLink", target: "findUs" },
    { link: "menuLink2", target: "menu" },
    { link: "aboutLink2", target: "aboutUs" },
    { link: "findUsLink2", target: "findUs" }
];

document.addEventListener("DOMContentLoaded", () => {

    //Scrollfunktion till rätt rubrik på min webbsida
    const offset = 120;

    function scrollToElement(event, targetId) {
        event.preventDefault();
        const targetElement = document.getElementById(targetId);
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }

    links.forEach(({ link, target }) => {
        const element = document.getElementById(link);
        if (element) {
            element.addEventListener("click", (event) => scrollToElement(event, target));
        }
    });

    // Döljer/visar objekt beroende på om man har token
    if (token) {
        editMenuEl.style.display = "block";
        editMenuEl2.style.display = "block";
        logInEl.style.display = "none";
        logOutEl.style.display = "block";
        logOutEl.addEventListener("click", logOutUser);

    } else {
        editMenuEl.style.display = "none";
        editMenuEl2.style.display = "none";
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
