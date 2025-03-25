const checkToken = () => {
  localStorage.getItem("token") ? (console.log("Mode admin ACTIVÉ"), adminEdition()) : console.log("Mode admin DESACTIVÉ");
};

const removeToken = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("deletedImages");
};

window.addEventListener("unload", removeToken); // reload suppression token

const adminEdition = () => {
  adminHTML();
  document.getElementById("titleProjectRemove").onclick = async e => {
    e.preventDefault();
    await fetchApiWorks(); // cards
    modalHTML();
    displayModal();
    openModal();
    editModal();
  };

  document.querySelector("body > div > button")?.addEventListener("click", e => {
    e.preventDefault();
    functionDeleteWorksApi();
  });
};

const adminHTML = () => {
  const body = document.body;
  const flagEditor = document.createElement("div");
  flagEditor.className = "flagEditor";

  const createSpan = (id = "") => {
    const span = document.createElement("span");
    span.className = "projectRemove";
    if (id) span.id = id;
    span.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Mode édition`;
    return span;
  };

  const logout = document.querySelector("body > header > nav > ul > li:nth-child(3)");
  logout.innerHTML = ""; //suppression mot login
  const logoutLink = Object.assign(document.createElement("a"), { href: "./index.html", textContent: "logout" });
  logout.append(logoutLink);
  logoutLink.onclick = e => {
    e.preventDefault();
    removeToken();//supp token
    window.location.assign("index.html");//redirection meme page mais sans token
  };

  flagEditor.append(createSpan());
  body.prepend(flagEditor);
  
  document.querySelector("#portfolio > h2").append(createSpan("titleProjectRemove"));
  body.classList.add("marginTop");
  filterButtons?.remove(); // pas de filtrage en mode admin
};

const openModal = () => {
  const gallery = document.getElementById("modalGrid");
  gallery.innerHTML = "";
  const deletedImages = {};

  if (!cards.length) {
    console.warn("pas de works");
    return;
  }
//parcourte chaque cards pour creer element figure
  cards.forEach(card => {
    const figure = document.createElement("figure");
    figure.dataset.cardId = card.id;//stock id dans dataset

    figure.innerHTML = `
      <img src="${card.imageUrl}" alt="${card.title}">
     
    `;

    const iconDelete = document.createElement("i");
    iconDelete.className = "fa-solid fa-trash-can iconModal";
    iconDelete.id = "deleteIcon";

    iconDelete.onclick = () => {
      figure.remove();//retire figure du dom
      deletedImages[card.id] = true;//id supprime dans deletedimages
      sessionStorage.setItem("deletedImages", JSON.stringify(deletedImages));//met a jour session storage
    };

    figure.appendChild(iconDelete);
    gallery.appendChild(figure);
  });

  
};
