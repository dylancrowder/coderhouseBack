const socket = io();

let product;
document.getElementById("form-products").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("input-title");
  const description = document.getElementById("input-description");
  const thumbnail = document.getElementById("input-thumbnail");
  const code = document.getElementById("input-code");
  const stock = document.getElementById("input-stock");

  const newProduct = {
    title: title.value,
    description: description.value,
    thumbnail: thumbnail.value,
    code: code.value,
    stock: stock.value
  };

  // Emitir el nuevo producto al servidor a través del socket
  socket.emit("new-product", newProduct);

  // Limpiar los campos del formulario
  title.value = "";
  description.value = "";
  thumbnail.value = "";
  code.value = "";
  stock.value = "";
  stock.focus();
  description.focus();
  code.focus();
  stock.focus();
});

/* ------------------------------------------------------------------ */
/* Recibe la lista de productos desde el socket y la muestra en la página */
socket.on("product-list", (productsData) => {
  const listProducts = document.getElementById("listProducts");
  listProducts.innerHTML = ""; // Limpiar la lista antes de agregar los nuevos productos

  productsData.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.className = "product";

    const title = document.createElement("h3");
    title.innerText = product.title;

    const description = document.createElement("p");
    description.innerText = product.description;

    const thumbnail = document.createElement("img");
    thumbnail.src = product.thumbnail;

    const code = document.createElement("p");
    code.innerText = `Código: ${product.code}`;

    const stock = document.createElement("p");
    stock.innerText = `Stock: ${product.stock}`;

    const id = document.createElement("p");
    id.innerText = `id: ${product.id}`;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Eliminar";
    deleteButton.addEventListener("click", () => {
      // Emitir el evento de eliminación al servidor con el ID del producto
      socket.emit("delete-product", product.id);
    });

    listProducts.appendChild(productElement);
    productElement.appendChild(title);
    productElement.appendChild(description);
    productElement.appendChild(thumbnail);
    productElement.appendChild(code);
    productElement.appendChild(stock);
    productElement.appendChild(id);
    productElement.appendChild(deleteButton);
    listProducts.appendChild(productElement);
  });
});
