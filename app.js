const form = document.querySelector("#form");
const cardsContainer = document.querySelector("#cards-container");
const filterByMonthForm = document.querySelector("#filter-by-month");
const monthInput = document.querySelector("#month-select");
const totalInMonthOutput = document.querySelector("#output-text");
const sortForm = document.querySelector("#sort-select");
const categoryInput = document.querySelector("#category-selected");
const categoryOutputText = document.querySelector("#output-category");
const resetBtn = document.querySelector(".reset-button");

const category = document.querySelector("#category-input");
const categoriesValue = [...category.options].map((category) => category.value);
const categoriesText = [...category.options].map((category) => category.text);

let cards = [];

//Getting values from the user and saving to cards array, sending to localStorage
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
    notes: notesInput.toUpperCase(),
  });

  saveCardsToStorage();
  renderPage();
  form.reset();
});

//Function to send data to localStorage
const saveCardsToStorage = () => {
  localStorage.setItem("budget", JSON.stringify(cards));
};

//Filtering data by month, year and category and sending total amount for chosen month
filterByMonthForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formFilterData = new FormData(filterByMonthForm);

  const selectedMonth = parseInt(formFilterData.get("month"), 10);
  const selectedYear = parseInt(formFilterData.get("year"), 10);
  const selectedCategory = formFilterData.get("category-selected-name");

  cards = cards.filter((card) => {
    const date = new Date(card.date);
    const matchesCategory =
      selectedCategory === "Alle" || card.category === selectedCategory;
    return (
      date.getMonth() === selectedMonth &&
      date.getFullYear() === selectedYear &&
      matchesCategory
    );
  });
  const totalAmount = cards.reduce(
    (acc, currentValue) => acc + Number(currentValue.amount),
    0
  );

  totalInMonthOutput.textContent =
    totalAmount === 0
      ? `Ingen registrerte utgifter denne måneden`
      : `Totalt utgifter for valgt periode og kategori: ${totalAmount}`;
  buildPage(cards);
});

//Sorting data by date in ascending or decending order
sortForm.addEventListener("change", () => {
  const sortSelected = sortForm.value;

  let sortedCards = [...cards];

  if (sortSelected === "date-asc") {
    sortedCards.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortSelected === "date-desc") {
    sortedCards.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  buildPage(sortedCards);
});

//Function that builds the page
const buildPage = (cards) => {
  cardsContainer.replaceChildren();

  cards.forEach((card) => {
    const { date, amount, category, notes } = card;

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    //Date
    const dateEl = document.createElement("input");
    dateEl.type = "date";
    dateEl.name = "date-output";
    dateEl.readOnly = "true";
    dateEl.value = date;

    //Category
    const categoryOutput = document.createElement("span");
    categoryOutput.textContent = category;
    categoryOutput.style.display = "inline-block";

    const selectEl = document.createElement("select");
    selectEl.name = "ny-category-name";
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
    amountEl.name = "amount-output";
    amountEl.readOnly = true;
    amountEl.value = amount;

    //Notes
    const notesEl = document.createElement("input");
    notesEl.type = "text";
    notesEl.name = "notes-output";
    notesEl.readOnly = true;
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

//Function to edit chosen data
const editButton = (card, date, category, selectForm, amount, notes) => {
  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.textContent = "Rediger";

  editButton.addEventListener("click", () => {
    if (date.readOnly) {
      // EDIT MODE
      date.readOnly = false;
      amount.readOnly = false;
      notes.readOnly = false;

      category.style.display = "none";
      selectForm.style.display = "inline-block";

      editButton.textContent = "Lagre";
    } else {
      // SAVE MODE
      card.date = date.value;
      card.amount = amount.value;
      card.notes = notes.value;
      const newCategorySelected = selectForm;
      card.category = newCategorySelected.value;
      category.textContent =
        newCategorySelected.options[newCategorySelected.selectedIndex].text;
      date.readOnly = true;
      amount.readOnly = true;
      notes.readOnly = true;

      category.style.display = "inline-block";
      selectForm.style.display = "none";

      editButton.textContent = "Rediger";
      saveCardsToStorage();
    }
  });
  return editButton;
};

//Reset all filters and getting the original data from localStorage
resetBtn.addEventListener("click", () => {
  totalInMonthOutput.textContent = "";
  renderPage();
});

//Function to delete chosen data
const deleteButton = (card) => {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "Slett";

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

//Render page function that gets data from localStorage
renderPage = () => {
  const storedCards = localStorage.getItem("budget");

  if (storedCards) {
    cards = JSON.parse(storedCards);
  }

  buildPage(cards);
};

renderPage();
