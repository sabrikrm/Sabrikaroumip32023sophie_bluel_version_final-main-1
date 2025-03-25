async function fetchApiWorks() {
  try {
    const res = await fetch(api + "works");
    cards = await res.json();
    const btnTitle = getButtonTitles(cards);
    filtersBtn(btnTitle);
    workDisplay();
  } catch (error) {
    console.log("Erreur fetchApiWorks:", error);
  }
}

async function fetchApiCategories() {
  try {
    const res = await fetch(api + "categories");
    categories = await res.json();
  } catch (error) {
    console.log("Erreur fetchApiCategories:", error);
  }
}

function getButtonTitles(cards) {
  return [...new Set(cards.map(card => card.category.name))];
}

function filtersBtn(btnTitles) {
  filterButtons.className = "filter";
  filterButtons.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.className = "btn active";
  allButton.textContent = "Tous";
  filterButtons.append(allButton);

  [allButton, ...btnTitles.map(name => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = name;
    filterButtons.append(btn);
    return btn;
  })].forEach(btn => {
    btn.onclick = e => {
      categoryIdValue = e.target.textContent;
      document.querySelectorAll(".btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      workDisplay();
    };
  });
}
