var swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
        nextEl: "#next",
        prevEl: "#previous",
    },
});


const cartIcon = document.querySelector('.cart-icon');
const cartTap = document.querySelector('.cart-tap');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-manu');
const bars = document.querySelector('.fa-bars')


cartIcon.addEventListener('click', () => cartTap.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', () => cartTap.classList.remove('cart-tab-active'));
hamburger.addEventListener('click', ()=> {
    mobileMenu.classList.toggle('mobile-manu-active');
    bars.classList.toggle('fa-bars');
    bars.classList.toggle('fa-xmark');
});


let productList = [];
let cartProduct = [];

const showCards = () => {

    productList.forEach(product => {

        console.log(product.image);
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card')

        orderCard.innerHTML = `
          
        <div class="card-image">
            <img src="${product.image}">
            </div>
            <h4>${product.name}</h4>
            <h4 class="price">${product.price}</h4>
            <a href="#" class="btn card-btn">Add to Cart</a>
            `;

        cardList.appendChild(orderCard);

        const cardBtn = orderCard.querySelector('.card-btn');
        cardBtn.addEventListener('click', (e) => {
            e.preventDefault();

            addToCart(product);
        });
    });
};

const addToCart = (product) => {

    const existingProduct = cartProduct.find(item => item.id === product.id);
    if(existingProduct){

        alert('Item already in your cart');
        return;
    }

    cartProduct.push(product);

    let quantity = 1;

    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem.innerHTML = `
     <div class="item-image">
            <img src="${product.image}">
        </div>
        <div class="detail">
            <h4>${product.name}</h4>
            <h4 class="item-total">${product.price}</h4>
        </div>
        <div class="flex">
            <a href="#" class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
            </a>
            <h4 class="quantity-value">${quantity}</h4>
            <a href="#" class="quantity-btn plus">
                <i class="fa-solid fa-plus"></i>
            </a>
        </div>
    `;

    cartList.appendChild(cartItem);


    const plusBtn = cartItem.querySelector('.plus')
    const minusBtn = cartItem.querySelector('.minus')
    const quantityValue = cartItem.querySelector('.quantity-value');
    const itemTotal = cartItem.querySelector('.item-total');
    const basePrice = parseFloat(product.price.replace('$', ''));
    


    plusBtn.addEventListener('click' , (e)=>{
        e.preventDefault();
        quantity++;
        quantityValue.textContent = quantity;
        itemTotal.textContent = '$' + (basePrice * quantity).toFixed(2);
        updateCartTotal();
    })

    minusBtn.addEventListener('click' , (e)=>{
        e.preventDefault();
        if(quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
            itemTotal.textContent = '$' + (basePrice * quantity).toFixed(2);
            updateCartTotal();
        } else {
            // Remove item from cart if quantity reaches 0
            cartItem.classList.add('slide-out');
            setTimeout(()=>{
                cartItem.remove();
                const index = cartProduct.findIndex(item => item.id === product.id);
                if(index > -1) {
                    cartProduct.splice(index, 1);
                }
                updateCartTotal();
            }, 500);
        }
    })

    updateCartTotal();
}

const updateCartTotal = () => {
    const cartTotal = document.querySelector('.cart-total');
    let total = 0;

    cartList.querySelectorAll('.item-total').forEach(priceElement => {
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        total += price;
    });

    cartTotal.textContent = '$' + total.toFixed(2);
    updateCartValue();
};

const updateCartValue = () => {
    const cartValue = document.querySelector('.cart-value');
    let totalQuantity = 0;

    cartList.querySelectorAll('.quantity-value').forEach(quantityElement => {
        const quantity = parseInt(quantityElement.textContent);
        totalQuantity += quantity;
    });

    cartValue.textContent = totalQuantity;
};

const initApp = () => {

    fetch('products.json').then
        (response => response.json()).then
        (data => {

            productList = data;
            showCards();
        })
}

initApp();