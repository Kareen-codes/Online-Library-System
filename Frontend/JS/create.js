/*const createBook_API = "http://127.0.0.1:8000/books"


const form = document.querySelector("form");
const cancelBtn = document.querySelector(".cancel")
form.addEventListener("submit", e => {
  e.preventDefault();
  if(addbooks()){
     window.location.href = "/Frontend/index.html";
  }
});


cancelBtn.addEventListener("click", () => {
  
  const confirmCancel = confirm("Cancel book creation?");

  if (confirmCancel) {
    window.location.href = "/Frontend/index.html";
  }

});




async function addbooks(){
  
   
  //const image = document.getElementById("cover").value || null;


   const title = document.getElementById("title").value
   const authors = document.getElementById("authors").value.split(",").map(a => a.trim()).filter(a => a.length > 0)
   const isbn = document.getElementById("isbn").value
   const description = document.getElementById("description").value || null;
   const published_date = document.getElementById("published_date").value || null;
   const category_id = Number(document.getElementById("category_id").value);
   
   const payload={
     title,authors, isbn, description, published_date, category_id
   }

   const response = await fetch(createBook_API, {
    method: "POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(payload)
   });

   if (response.ok){
      alert(`${title} added successfully!`)

      window.location.href="./index.html";
   }    

    else{
        
        const error = await response.json();
        alert(error.detail || "Error adding book");

    }

   

}
*/


const createBook_API = "http://127.0.0.1:8000/books";
const categories_API = "http://127.0.0.1:8000/categories/";

const form = document.querySelector("form");
const cancelBtn = document.querySelector(".cancel");
const errorBox = document.getElementById("form-error");

form.addEventListener("submit", async (e) => {
  
  e.preventDefault();

  const success = await addbooks();

  if (success) {
    alert("Book added successfully!");
    window.location.href = "/Frontend/index.html";
  }


 

});

cancelBtn.addEventListener("click", () => {
  if (confirm("Cancel book creation?")) {
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

/* ✅ Load categories into dropdown */
async function loadCategories() {
  const response = await fetch(categories_API);
  const categories = await response.json();

  const select = document.getElementById("category_id");

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.category_id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", loadCategories);

async function addbooks() {
  clearError();

  const title = document.getElementById("title").value.trim();
  const authorsInput = document.getElementById("authors").value.trim();
  const isbn = document.getElementById("isbn").value.trim();
  const description = document.getElementById("description").value || null;
  const published_date = document.getElementById("published_date").value || null;
  const category_id = document.getElementById("category_id").value;

  // ✅ Validation
  if (title.length < 2) {
    showError("Title must be at least 2 characters long.");
    return;
  }

  const authors = authorsInput
    .split(",")
    .map(a => a.trim())
    .filter(a => a.length > 1);

  if (authors.length === 0) {
    showError("Please enter at least one valid author.");
    return;
  }

  
const cleanISBN = isbn.replace(/[-\s]/g, "").toUpperCase();

if (!cleanISBN) {
  showError("ISBN is required.");
  return;
}

const isbnRegex = /^(?:\d{13}|\d{9}[0-9X])$/;

if (!isbnRegex.test(cleanISBN)) {
  showError("ISBN must be a valid ISBN-10 or ISBN-13.");
  return;
}


  if (published_date) {
    
  const selected = new Date(published_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  if (selected > today) {
    showError("Publication date cannot be in the future.");
    return;
  }

  }

  if (!category_id) {
    showError("Please select a category.");
    return;
  }

  const payload = {
    title,
    authors,
    isbn,
    description,
    published_date,
    category_id: Number(category_id)
  };

  const response = await fetch(createBook_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    return true;
    
  } else {
    const error = await response.json();
    showError(error.detail || "Error adding book");
  }
}
