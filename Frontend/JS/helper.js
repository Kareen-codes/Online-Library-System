import { deleteBooks, filterBooks, loadbooks } from "./bridge.js";

//Render books logic


export function renderBooks(data){
  
  if (!Array.isArray(data)) {
    console.error("Expected array, got:", data);
    alert("Failed to load books.");
    return;
  }

   const container = document.getElementById("books");

    container.innerHTML = ""



    data.forEach(book=>{
            
        const article = document.createElement("article");

        
        const img = document.createElement("img");
        img.src = book.cover_url || "https://miblart.com/wp-content/uploads/2020/01/crime-and-mystery-cover-scaled-1.jpeg";
        img.alt = "Book image";


        const details = document.createElement("div");
        details.className = "book_details";

        
      const authors =   book.authors?.length
        ? book.authors.map(a => a.name).join(", ")
        : "Unknown";


        details.innerHTML = `
            <p><strong>Title:</strong> ${book.title}</p>
            <p><strong>Author:</strong> ${authors}</p>
            <p><strong>Category:</strong><br>${book.category?.name || "Uncategorized"}</p>
            <p><strong>Description:</strong><br>${book.description || ""}</p>
             
        `;


        const buttons = document.createElement("div");
        buttons.className = "buttons";

        const editBtn = document.createElement("button");
        editBtn.className = "btn";
        editBtn.textContent = "Edit";
        editBtn.type = "button"
        editBtn.dataset.bookId = book.book_id

        editBtn.addEventListener("click", () => {
          const book_id = editBtn.dataset.bookId;
          window.location.href = `edit.html?book_id=${book_id}`;
        });

      //DELETE FUNCTIONALITY
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.type = "button";
     
        deleteBtn.dataset.bookId = book.book_id;

        deleteBtn.addEventListener("click", ()=>{
             const book_id = deleteBtn.dataset.bookId;
             deleteBooks(book_id)
        })

        buttons.append(editBtn, deleteBtn);

        
        article.append(img, details, buttons);


        container.appendChild(article);

    });
}

//render categories logic



export function renderCategories(data){
   const container = document.getElementById("category");
  container.innerHTML = "";


  const div = document.createElement("div");
  div.className = "filter";

  const h2 = document.createElement("h2");
  h2.textContent = "Filter";

  const i = document.createElement("i");
  i.className = "fa fa-filter";
  i.setAttribute("aria-hidden", "true");
  i.id = "filtering_btn";
   i.addEventListener("click", filterBooks);
  


  div.append(h2, i);


  const form = document.createElement("form");
  form.className = "categories";

  const allBtn = document.createElement("button");
  allBtn.textContent = "ALL";
  allBtn.type = "button";

  allBtn.addEventListener("click", ()=>{
   document.querySelectorAll(".categoryBtns").forEach(cb=> cb.checked = false);
   const message = document.querySelector(".message")
   if( message.classList.contains("show-content")){
    message.classList.add("hide-content")
     message.classList.remove("show-content") 
   }
    loadbooks();
   })
 
  form.appendChild(allBtn);  

  


  //Only "categories" form loops
  data.forEach(category => {
    const categoryDiv = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = category.name;
    checkbox.id = category.name;
    checkbox.className = "categoryBtns";
    checkbox.value = category.category_id;

    const label = document.createElement("label");
    label.htmlFor = category.name;
    label.textContent = category.name;

    categoryDiv.append(checkbox, label);
    form.appendChild(categoryDiv);
  });

 /*
  const new_cat_btn = document.createElement("button");
  new_cat_btn.className = "btn";
  new_cat_btn.textContent = "New Category";*/

  
  container.append(div, form);


 
 
}
