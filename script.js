document.addEventListener('DOMContentLoaded', function() {

    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.querySelector('.filter-btn.active').classList.remove('active');
            this.classList.add('active');
            const filterValue = this.getAttribute('data-filter');
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    let cart = JSON.parse(localStorage.getItem('cartData')) || [];
    const cartIcon = document.getElementById('cart-icon');
    const cartModalOverlay = document.getElementById('cart-modal-overlay');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountEl = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.buy-btn');

    function openCartModal() {
        cartModalOverlay.classList.add('show');
        updateCartUI();
    }

    function closeCartModal() {
        cartModalOverlay.classList.remove('show');
    }

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">ตะกร้าของคุณว่างเปล่า</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                totalItems += item.quantity;
                
                const cartItemHTML = `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">${item.price.toLocaleString()} ฿</p>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-controls">
                                <button class="quantity-btn" data-action="decrease">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn" data-action="increase">+</button>
                            </div>
                            <button class="remove-item-btn"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemHTML;
            });
        }
        
        cartTotalEl.innerText = `${total.toLocaleString()} ฿`;
        cartCountEl.innerText = totalItems;
        localStorage.setItem('cartData', JSON.stringify(cart));
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
    }
    
    function handleCartActions(event) {
        const target = event.target;
        const cartItemDiv = target.closest('.cart-item');
        if (!cartItemDiv) return;
        
        const productId = cartItemDiv.dataset.id;
        const itemInCart = cart.find(item => item.id === productId);

        if (!itemInCart) return;

        if (target.classList.contains('quantity-btn')) {
            const action = target.dataset.action;
            if (action === 'increase') {
                itemInCart.quantity++;
            } else if (action === 'decrease') {
                if (itemInCart.quantity > 1) {
                    itemInCart.quantity--;
                } else {
                    cart = cart.filter(item => item.id !== productId);
                }
            }
        }

        if (target.closest('.remove-item-btn')) {
             cart = cart.filter(item => item.id !== productId);
        }

        updateCartUI();
    }

    cartIcon.addEventListener('click', openCartModal);
    closeCartBtn.addEventListener('click', closeCartModal);
    cartModalOverlay.addEventListener('click', (event) => {
        if (event.target === cartModalOverlay) closeCartModal();
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.product-card');
            const product = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseInt(card.dataset.price),
                img: card.dataset.img
            };
            addToCart(product);
        });
    });
    
    cartItemsContainer.addEventListener('click', handleCartActions);

    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        } else {
            alert('ตะกร้าของคุณว่างเปล่า กรุณาเลือกสินค้าก่อน');
        }
    });

    updateCartUI();
});
// checkout.js
document.addEventListener('DOMContentLoaded', function() {
    
    const summaryItemsContainer = document.getElementById('summary-items');
    const subtotalEl = document.getElementById('summary-subtotal');
    const grandtotalEl = document.getElementById('summary-grandtotal');
    const checkoutForm = document.getElementById('checkout-form');
    const cartData = JSON.parse(localStorage.getItem('cartData'));

    function renderOrderSummary() {
        if (!cartData || cartData.length === 0) {
            summaryItemsContainer.innerHTML = '<p>ไม่มีสินค้าในรายการ</p>';
            subtotalEl.innerText = '0 ฿';
            grandtotalEl.innerText = '0 ฿';
            document.querySelector('.place-order-btn').disabled = true;
            return;
        }

        summaryItemsContainer.innerHTML = '';
        let subtotal = 0;

        cartData.forEach(item => {
            subtotal += item.price * item.quantity;
            const itemHTML = `
                <div class="summary-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="summary-item-info">
                        <h4>${item.name}</h4>
                        <p>จำนวน: ${item.quantity}</p>
                    </div>
                    <span class="summary-item-price">${(item.price * item.quantity).toLocaleString()} ฿</span>
                </div>
            `;
            summaryItemsContainer.innerHTML += itemHTML;
        });

        subtotalEl.innerText = `${subtotal.toLocaleString()} ฿`;
        grandtotalEl.innerText = `${subtotal.toLocaleString()} ฿`;
    }

    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(checkoutForm);
        const customerData = {
            fullname: formData.get('fullname'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            paymentMethod: formData.get('payment'),
        };

        alert(`ขอบคุณคุณ ${customerData.fullname} สำหรับการสั่งซื้อ!\nเราได้รับออเดอร์ของคุณแล้ว และจะรีบดำเนินการจัดส่ง`);
        
        localStorage.removeItem('cartData');
        window.location.href = 'index.html';
    });

    renderOrderSummary();
});