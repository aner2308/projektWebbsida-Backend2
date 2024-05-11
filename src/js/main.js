"use strict";


const token = localStorage.getItem("token");
const editMenuEl = document.getElementById("editMenu");

document.addEventListener("DOMContentLoaded", () => {

    if (token) {
        editMenuEl.style.display = "block";
    } else {
        editMenuEl.style.display = "none";
    }
});