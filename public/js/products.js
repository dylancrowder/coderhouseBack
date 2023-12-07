(function () {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM content loaded");

    const buyButtons = document.querySelectorAll("button[data-product-id]");
    buyButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = button.getAttribute("data-product-id");
        buyProduct(productId);
      });
    });
  });

  async function buyProduct(productId) {
    try {
      console.log("Product ID to be purchased:", productId);

      const responseProduct = await fetch(`/api/products/${productId}`);

      if (!responseProduct.ok) {
        throw new Error("Failed to fetch product data");
      }

      const dataProduct = await responseProduct.json();

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataProduct)
      };

      const responseCart = await fetch(
        `/api/carts/656808add3f301ce9f870753/products/${productId}`,
        options
      );

      if (!responseCart.ok) {
        throw new Error("Failed to add product to the cart");
      }

      const dataCart = await responseCart.json();

      console.log("Response from Cart API:", dataCart);
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  }
})();
