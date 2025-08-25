const form = document.querySelector("#form");
const cardsContainer = document.querySelector("#cards-container");

const category = document.querySelector("#category");
const categoriesValue = [...category.options].map((category) => category.value);
const categoriesText = [...category.options].map((category) => category.text);

let cards = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const dateInput = formData.get("date");
  const amountInput = formData.get("amount");
  const categoryInput = formData.get("category");
  const notesInput = formData.get("notes");

  cards.push({
    date: dateInput,
    amount: amountInput,
    category: categoryInput,
    notes: notesInput,
  });
  console.log(cards);
  saveCardsToStorage();
  renderPage();
});

const saveCardsToStorage = () => {
  localStorage.setItem("budget", JSON.stringify(cards));
};

const buildPage = (cards) => {
  cardsContainer.replaceChildren();

  cards.forEach((card) => {
    const { date, amount, category, notes } = card;

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    //Date
    const dateEl = document.createElement("input");
    dateEl.type = "date";
    dateEl.readOnly = "true";
    dateEl.value = date;

    //Category
    const categoryOutput = document.createElement("span");
    categoryOutput.textContent = category;
    categoryOutput.style.display = "inline-block";
    const selectEl = document.createElement("select");
    selectEl.style.display = "none";

    for (let i = 0; i < categoriesValue.length; i++) {
      const option = document.createElement("option");
      option.value = categoriesText[i];
      option.text = categoriesText[i];
      selectEl.appendChild(option);
    }

    //Amount
    const amountEl = document.createElement("input");
    amountEl.type = "number";
    amountEl.readOnly = "true";
    amountEl.value = amount;

    //Notes
    const notesEl = document.createElement("input");
    notesEl.type = "textarea";
    notesEl.readOnly = "true";
    notesEl.value = notes;

    cardContainer.append(
      dateEl,
      categoryOutput,
      selectEl,
      amountEl,
      notesEl,
      editButton(card, dateEl, categoryOutput, selectEl, amountEl, notesEl),
      deleteButton(card)
    );

    cardsContainer.append(cardContainer);
  });
};

const editButton = (card, date, category, selectForm, amount, notes) => {
  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.textContent = "Edit";

  editButton.addEventListener("click", () => {
    card.date = date.value;
    date.readOnly = !date.readOnly;

    category.style.display =
      category.style.display === "inline-block" ? "none" : "inline-block";
    selectForm.style.display =
      selectForm.style.display === "inline-block" ? "none" : "inline-block";

    card.category = selectForm.text;

    editButton.textContent = date.readOnly ? "Edit" : "Save";
    saveCardsToStorage();
  });
  return editButton;
};

const deleteButton = (card) => {
  const deleteButton = document.createElement("button");
  deleteButton.className.add = "delete-button";
  deleteButton.textContent = "X";

  deleteButton.addEventListener("click", () => {
    const cardIndex = cards.indexOf(card);
    if (cardIndex > -1) {
      cards.splice(cardIndex, 1);
    }

    saveCardsToStorage();
    renderPage();
  });

  return deleteButton;
};
renderPage = () => {
  const storedCards = localStorage.getItem("budget");

  if (storedCards) {
    cards = JSON.parse(storedCards);
  }

  buildPage(cards);
};

renderPage();
