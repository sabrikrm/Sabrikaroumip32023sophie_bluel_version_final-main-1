// Fonction pour injecter le HTML de la modale dans le DOM


// Fonction pour gérer la modale d'édition
function editModal() {
  const addProject = document.getElementById("editModal");
  const inputFile = document.getElementById("filetoUpload");
  const selectCategory = document.getElementById("category");
  const editSection = document.querySelector("#editSection");
  const addToApi = document.getElementById("editWorks");
  const gallerySection = document.querySelector("#modalEdit");
  const previewModal = document.querySelector("#previewModal");

  let iCanSubmit = false;

  addProject.onclick = () => {
    gallerySection.style.display = "none";
    editSection.style.display = "";
    previewModal.style.display = "initial";
  };

  previewModal.onclick = () => {
    gallerySection.style.display = "";
    editSection.style.display = "none";
    previewModal.style.display = "none";
  };

  inputFile.addEventListener("change", addPicture);

  if (!selectCategory.options.length) {
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    selectCategory.appendChild(emptyOption);

    categories.forEach(({ id, name }) => {
      const option = document.createElement("option");
      option.textContent = name;
      option.setAttribute("data-id", id);
      selectCategory.appendChild(option);
    });
  }

  editSection.addEventListener("input", () => {
    const title = document.querySelector("#title").value;
    const category = selectCategory.value;
    const image = inputFile.files[0];
    const submitForm = document.querySelector("#editWorks input[type=submit]");

    document.getElementById("errorImg").textContent = !image ? "Veuillez selectionnez une image" : "";
    document.getElementById("ErrorTitleSubmit").textContent = !title ? "Ajoutez un titre" : "";
    document.getElementById("ErrorCategorySubmit").textContent = !category ? "Choisissez une catégorie" : "";

    iCanSubmit = image && title && category;
    submitForm.style.background = iCanSubmit ? "#1d6154" : "grey";
  });

  addToApi.onsubmit = e => {
    e.preventDefault();
    if (!iCanSubmit) return console.log("Formulaire invalide !!!");

    const image = inputFile.files[0];
    const title = document.querySelector("#title").value;
    const category = parseInt(selectCategory.selectedOptions[0].getAttribute("data-id"));

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    fetch(api + "works", {
      method: "POST",
      headers: { Accept: "application/json", Authorization: "Bearer " + token },
      body: formData,
    })
      .then(response => {
        if (!response.ok) throw new Error("Erreur POST");
        return response.json();
      })
      .then(data => {
        console.log("Ajout réussi:", data);
        fetchApiWorks();
        workDisplay();
        closeModal();
        inputFile.value = "";
      })
      .catch(err => console.error("Erreur:", err));
  };
}

const addPicture = () => {
  const inputFile = document.getElementById("filetoUpload");
  const file = inputFile.files[0];
  const maxSize = 4 * 1024 * 1024;

  if (file.size > maxSize) {
    document.getElementById("errorImg").textContent = "Votre image est trop volumineuse";
  }
};

const displayModal = () => {
  const modal = document.querySelector("#modal");
  modal.style.display = ""; 
  document.getElementById("closeModal").onclick = closeModal;
  window.onclick = e => { if (e.target === modal) closeModal(); };
  document.body.classList.add("modalOpen");
};

const closeModal = () => {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  document.body.classList.remove("modalOpen");
};
