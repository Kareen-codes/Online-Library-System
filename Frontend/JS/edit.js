const updateBook_API = "http://127.0.0.1:8000/books/update";
const loadThisBook_API = "http://127.0.0.1:8000/books";
const categories_API = "http://127.0.0.1:8000/categories/";

const form = document.querySelector("form");
const cancelBtn = document.querySelector(".cancel");
const errorBox = document.getElementById("form-error");



form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const success = await updatebooks();
  if (success) {
    alert("Book updated successfully!");
    window.location.href = "/Frontend/index.html";
  }
});

cancelBtn.addEventListener("click", () => {
  if (confirm("Discard changes?")) {
    window.location.href = "/Frontend/index.html";
  }
});



function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = "block";
}

function clearError() {
  errorBox.textContent = "";
  errorBox.style.display = "none";
}



async function loadCategories(selectedCategoryId = null) {
  const response = await fetch(categories_API);
  const categories = await response.json();

  const select = document.getElementById("category_id");
  select.innerHTML = "";

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.category_id;
    option.textContent = cat.name;

    if (Number(cat.category_id) === Number(selectedCategoryId)) {
      option.selected = true;
    }

    select.appendChild(option);
  });
}



async function loadThisBook(book_id) {
  const response = await fetch(`${loadThisBook_API}/${book_id}`);
  const book = await response.json();

  document.getElementById("title").value = book.title ?? "";
  document.getElementById("authors").value =
    book.authors?.map((a) => a.name).join(", ") ?? "";
  document.getElementById("isbn").value = book.isbn ?? "";
  document.getElementById("description").value = book.description ?? "";
  document.getElementById("published_date").value =
    book.published_date ? book.published_date.slice(0, 10) : "";

  await loadCategories(book.category_id);
}



const params = new URLSearchParams(window.location.search);
const book_id = params.get("book_id");

if (!book_id) {
  alert("Invalid book id!");
  window.location.href = "/Frontend/index.html";
} else {
  loadThisBook(book_id);
}



async function updatebooks() {
  clearError();

  const title = document.getElementById("title").value.trim();
  const authorsInput = document.getElementById("authors").value.trim();
  const isbn = document.getElementById("isbn").value.trim();
  const description = document.getElementById("description").value || null;
  const published_date = document.getElementById("published_date").value || null;
  const category_id = document.getElementById("category_id").value;



  if (title.length < 2) {
    showError("Title must be at least 2 characters long.");
    return false;
  }

  const authors = authorsInput
    .split(",")
    .map((a) => a.trim())
    .filter((a) => a.length > 1);

  if (authors.length === 0) {
    showError("Please enter at least one valid author.");
    return false;
  }

  const cleanISBN = isbn.replace(/[-\s]/g, "").toUpperCase();
  const isbnRegex = /^(?:\d{13}|\d{9}[0-9X])$/;

  if (!cleanISBN) {
    showError("ISBN is required.");
    return false;
  }

  if (!isbnRegex.test(cleanISBN)) {
    showError("ISBN must be a valid ISBN-10 or ISBN-13.");
    return false;
  }

  if (published_date) {
    const selected = new Date(published_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected > today) {
      showError("Publication date cannot be in the future.");
      return false;
    }
  }

  if (!category_id) {
    showError("Please select a category.");
    return false;
  }

  const payload = {
    title,
    authors,
    isbn,
    description,
    published_date,
    category_id: Number(category_id),
  };

  const response = await fetch(`${updateBook_API}/${book_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return true;
  } else {
    const error = await response.json();
    showError(error.detail || "Error updating book");
    return false;
  }
}