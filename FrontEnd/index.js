const api = "http://localhost:5678/api/";
const token = localStorage.getItem("token");//recupere token dans localstorage
let categoryIdValue = "Tous";
let categories = [];
let cards = [];

const filterButtons = document.createElement("div");
const portfolioSection = document.querySelector("#portfolio");
portfolioSection.querySelector("h2").after(filterButtons);

window.addEventListener("load", () => {
  fetchApiWorks();
  fetchApiCategories();
  checkToken();//check si token donc admin ou pas
});

function cardsTemplate(card) {
  const figure = document.createElement("figure");
  figure.dataset.cardId = card.id;
  figure.setAttribute("value", card.categoryId);

  const img = document.createElement("img");
  img.src = card.imageUrl;
  img.alt = "photo de " + card.title;

  const caption = document.createElement("figcaption");
  caption.textContent = card.title;

  figure.append(img, caption);
  return figure;
}

function workDisplay() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  cards.forEach(card => {
    if (categoryIdValue === "Tous" || card.category.name === categoryIdValue) {
      gallery.append(cardsTemplate(card));
    }
  });
}
