

  import { renderBooks, renderCategories } from "./helper.js";
import { loadbooks } from "./bridge.js";

const displayCategories_API = "http://127.0.0.1:8000/categories/";
const searchBooks_API = "http://127.0.0.1:8000/books/search/by";

loadbooks();

async function loadcategories() {
  const response = await fetch(displayCategories_API);
  const data = await response.json();
  

  renderCategories(data);
}

loadcategories();

async function searchBooks() {
  const search_query = document.getElementById("search_query").value;
  if (!search_query) {
    alert("Search field empty!");
    loadbooks();
    return;
    
  }

  const query = new URLSearchParams({ query: search_query }).toString();
  const response = await fetch(`${searchBooks_API}?${query}`);
  const data = await response.json();
  renderBooks(data);
}



document.getElementById("searchBtn").addEventListener("click", searchBooks);