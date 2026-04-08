import { renderBooks } from "./helper.js";

const displayBooks_API = "http://127.0.0.1:8000/books/";
const deleteBooks_API = "http://127.0.0.1:8000/books/delete";
const filterBooks_API = "http://127.0.0.1:8000/books/filter/";

export async function loadbooks() {
  const response = await fetch(displayBooks_API);
  const data = await response.json();
  renderBooks(data);
}

export async function deleteBooks(book_id) {
  const answer = confirm("Are you sure you want to delete this book?");
  if (!answer) return;

  const response = await fetch(`${deleteBooks_API}/${book_id}`, {
    method: "DELETE",
  });

  if (response.ok) {   
    await loadbooks();
     
   
    alert("Book deleted successfully!");
    

    
  } else {
    const error = await response.json();
    alert(error.detail || "Error deleting book");
  }
}

function getSelectedCategoryIds() {
  return Array.from(
    document.querySelectorAll(".categoryBtns:checked")
  ).map(input => input.value);
}

export async function filterBooks() {
  const selectedCategories = getSelectedCategoryIds();

  if (selectedCategories.length === 0) {
    alert("Please select at least one category.");
    return;
  }

  const query = new URLSearchParams();
  selectedCategories.forEach(id => query.append("category_id", id));

  const response = await fetch(`${filterBooks_API}?${query.toString()}`);
  const data = await response.json();


  const message = document.querySelector(".message")
  const booksDiv = document.getElementById("books");

  if (data.length === 0){   

    message.classList.remove("hide-content")
    message.classList.add("show-content")    
    booksDiv.innerHTML = "";
    
    return;
  }

  message.classList.add("hide-content")
  message.classList.remove("show-content")   
  renderBooks(data);

  
}
