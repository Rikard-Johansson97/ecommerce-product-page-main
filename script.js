// TODO | DECLARE Selectors

// OPENS AND CLOSES SIDEMENU
const sideMenu = document.querySelector(".side-menu");
const darkOverlay = document.querySelector(".cover");

// OPENS AND CLOSES CART MENU
const cartMenu = document.querySelector(".cart");
const cartContainer = document.querySelector(".cart-item-container");

// zooms in on image
const largerImageContainer = document.querySelector(
    ".larger-picture-container"
);
// Main page product text
const displayLargeImg = document.querySelector(".top-img");
const displayThumbnail = document.querySelector(".thumbnail");
const displayCompanyName = document.querySelector(".company-name");
const displayShoeName = document.querySelector(".shoe-name");
const displayShoeInfo = document.querySelector(".shoe-info");
const displayCurrentPrice = document.querySelector(".current-price");
const displayDiscount = document.querySelector(".discount-percentage");
const displayOrdinaryPrice = document.querySelector(".ordinary-price");
const displayQuantityCount = document.querySelector(".quantity-count");
// Cart container
const cartItem = document.querySelector(".cart-items-container");
const displayCartCount = document.querySelector(".cart-count");

// Counter for witch shoe that displays
let shoeIndex = 0;
let quantityCount = 0; //? quantity to add to cart
let cartCount = 0;
let imageIndex = 0;

// TODO | Functions here
const toggleSideMenu = (check) => {
    sideMenu.classList.toggle("show-side-menu");
};
const toggleDarkOverlay = () => {
    darkOverlay.classList.toggle("covering");
};
const toggleCartMenu = () => {
    cartContainer.classList.toggle("show-cart");
};
// TODO | Fetch() json file
const fetchProductData = async () => {
    const response = await fetch("products.json");
    if (response.status !== 200) throw new Error("Could not fetch data");
    const productData = await response.json();
    return productData;
};

//? displays product on main page!
const displayProduct = async (i, imgIdx) => {
    const productData = await fetchProductData();
    let shoe = productData.shoes[i];
    displayLargeImg.src = shoe.img.large[imgIdx];
    displayThumbnail.innerHTML = shoe.img.thumbnail[imgIdx];
    displayCompanyName.innerHTML = shoe.company;
    displayShoeName.innerHTML = shoe.name;
    displayShoeInfo.innerHTML = shoe.info;
    displayCurrentPrice.innerHTML = `$${
        shoe.price.ordinary - shoe.price.ordinary * shoe.price.discount
    }`;
    displayDiscount.innerHTML = `${shoe.price.discount * 100} %`;
    displayOrdinaryPrice.innerHTML = `$${shoe.price.ordinary}`;
    displayQuantityCount.innerHTML = `${quantityCount}`;
};

//? Adds current item on main page to cart. i = shoeIndex | j = quantityCount;
const addToCart = async (i, q) => {
    if (0 >= q) return;
    cartCount++;
    displayCartCount.textContent = cartCount;
    const productData = await fetchProductData();
    console.log(productData.shoes[i]);
    const item = productData.shoes[i];
    let price = item.price.ordinary - item.price.ordinary * item.price.discount;
    cartItem.innerHTML += `
    <div class="cart-item">
        <img
            class="item-thumbnail"
            src="${item.img.thumbnail[i]}"
            alt="cart-img" />
        <div class="cart-item-text">
            <h5 class="cart-item-name">
                ${item.name}
            </h5>
            <p class="item-cart-price">
            $<span class="item-price">${price}</span> x
                <span class="item-amount">${q}</span> = 
                $<span class="item-total">${price * q}</span>
            </p>
        </div>
        <button class="delete-item-btn">
            <img id="delete-item-btn" src="/images/icon-delete.svg" alt="" />
        </button>
    </div>`;
    quantityCount = 0;
    displayProduct(shoeIndex, imageIndex);
};

// TODO | Event listners here
window.addEventListener("resize", () => {
    if (
        window.innerWidth > 768 &&
        sideMenu.classList.contains("show-side-menu")
    ) {
        toggleDarkOverlay();
        toggleSideMenu();
    }
});

// TODO |
document.body.addEventListener("click", (e) => {
    console.log(e.target);
    switch (e.target.id) {
        case "open-menu-id": //? Opens side menu
            toggleSideMenu();
            toggleDarkOverlay();
            break;
        case "open-cart-btn": //? Show cart content
            toggleCartMenu();
            break;
        case "active-img-btn": //? Zooms in on product
            largerImageContainer.classList.toggle("active");
            toggleDarkOverlay();
            break;
        case "minus-icon": //? Decrease quantity to add to cart
            if (quantityCount <= 0) break;
            quantityCount--;
            displayProduct(shoeIndex, imageIndex);
            break;
        case "plus-icon": //? Increase quantity to add to cart
            quantityCount++;
            displayProduct(shoeIndex, imageIndex);
            break;
        case "add-cart-btn":
            addToCart(shoeIndex, quantityCount);
            break;
        case "delete-item-btn": //? Deletes cart item
            e.target.parentElement.parentElement.remove();
            cartCount--;
            displayCartCount.textContent = cartCount;
            break;
        default:
            break;
    }
});

displayProduct(shoeIndex, imageIndex);
