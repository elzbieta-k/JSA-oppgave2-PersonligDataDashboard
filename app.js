const form = document.querySelector("#form");
const cardsContainer = document.querySelector("#cards-container");

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

    //Amount
    const amountParagraph = document.createElement("p");
    amountParagraph.textContent = "Beløp:";

    const amountEl = document.createElement("input");
    amountEl.type = "number";
    amountEl.readOnly = "true";
    amountEl.value = amount;

    amountParagraph.append(amountEl);

    //Category
    const categorySelect = document.querySelector("#category");
    categorySelect.disabled = "true";

    cardContainer.append(dateEl, amountParagraph);

    cardsContainer.append(cardContainer);
  });
};

renderPage = () => {
  const storedCards = localStorage.getItem("budget");

  if (storedCards) {
    cards = JSON.parse(storedCards);
  }

  buildPage(cards);
};

renderPage();
