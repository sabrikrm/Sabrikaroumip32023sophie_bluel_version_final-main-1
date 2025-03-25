// Fonction pour injecter le HTML de la modale dans le DOM
const modalHTML = () => {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <aside id="modal" class="modal" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
      <div id="modalContainer">
        <i id="closeModal" class="fa-solid fa-xmark"></i>
        <i id="previewModal" class="fa-solid fa-arrow-left"></i>

        <!-- GALERIE PHOTO -->
        <section class="modalTemplate" id="modalEdit">
          <div id="editionGallery">
            <h2 class="modalTitle">Galerie photo</h2>
            <div id="modalGrid"></div>
          </div>
          <div class="footerModal">
            <hr>
            <input type="submit" value="Ajouter une photo" id="editModal">
            
          </div>
        </section>

        <!-- section photo modification-->
        <section class="modalTemplate" id="editSection" style="display:none">
          <h2 class="modalTitle">Ajout photo</h2>
          <form id="editWorks">
            <div id="addImageContainer">
              <i class="fa-solid fa-image"></i>
              <div id="inputFile">
                <label for="filetoUpload" class="fileLabel">
                  <span>+ Ajouter une photo</span>
                  <input type="file" id="filetoUpload" name="image" accept="image/png, image/jpeg" class="file-input">
                </label>
              </div>
              <span class="filesize">jpg, png : 4mo max</span>
              <span id="errorImg"></span>
            </div>

            <div class="inputEdit" id="addTitle">
              <label for="title">Titre</label>
              <input type="text" name="title" id="title" class="inputCss" required>
              <span id="ErrorTitleSubmit" class="errormsg"></span>
            </div>

            <div class="inputEdit" id="addCategory">
              <label for="category">Catégorie</label>
              <select name="category" id="category" data-id="" class="inputCss"></select>
              <span id="ErrorCategorySubmit" class="errormsg"></span>
            </div>

            <div class="footerModal editFooter">
              <hr>
              <input type="submit" value="Valider">
            </div>
          </form>
        </section>
      </div>
    </aside>
    `
  );
};

// Fonction pour gérer la modale d'édition
function editModal() {
  const addProject = document.getElementById("editModal");// btn ajouter photo
  const inputFile = document.getElementById("filetoUpload");//input img
  const selectCategory = document.getElementById("category");//selection categorie
  const editSection = document.querySelector("#editSection");
  const addToApi = document.getElementById("editWorks");//formulaire photo
  const gallerySection = document.querySelector("#modalEdit");//galerie existante
  const previewModal = document.querySelector("#previewModal");// btn retour

  let iCanSubmit = false;

  addProject.onclick = () => { // au click sur ajouter
    gallerySection.style.display = "none";
    editSection.style.display = ""; //formulaire ajout
    previewModal.style.display = "initial";
  };

  previewModal.onclick = () => { // au click sur fleche
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
    const title = document.querySelector("#title").value; //recup titre
    const category = selectCategory.value;//recup valeur cetgorie
    const image = inputFile.files[0];//recupere fichiuer image
    const submitForm = document.querySelector("#editWorks input[type=submit]");

    document.getElementById("errorImg").textContent = !image ? "Veuillez selectionnez une image" : "";
    document.getElementById("ErrorTitleSubmit").textContent = !title ? "Ajoutez un titre" : "";
    document.getElementById("ErrorCategorySubmit").textContent = !category ? "Choisissez une catégorie" : "";

    iCanSubmit = image && title && category;
    submitForm.style.background = iCanSubmit ? "#1d6154" : "grey"; // changement couleur si valide ou pas
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

    fetch(api + "works", { //requete post avec token
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
        fetchApiWorks();//reload cards
        workDisplay();//maj gallery
        closeModal();
        inputFile.value = "";
      })
      .catch(err => console.error("Erreur:", err));
  };
}

const addPicture = () => {
  const inputFile = document.getElementById("filetoUpload");
  const viewImage = document.getElementById("addImageContainer");
  const file = inputFile.files[0];
  const maxSize = 4 * 1024 * 1024;

  if (file.size > maxSize) { // verif taille photo
    document.getElementById("errorImg").textContent = "Votre image est trop volumineuse";
    return;
  }

  
};

const displayModal = () => {
  const modal = document.querySelector("#modal");
  document.getElementById("closeModal").onclick = closeModal;
  window.onclick = e => { if (e.target === modal) closeModal(); }; // ferme modal si click en dehors
  document.body.classList.add("modalOpen");
};

const closeModal = () => {
  document.getElementById("modal").remove(); // supprime element modale et css
  document.body.classList.remove("modalOpen");
};
