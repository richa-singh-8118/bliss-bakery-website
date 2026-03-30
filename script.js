document.addEventListener('DOMContentLoaded', () => {

    // ================= DESIGN & DOM LOGIC =================

    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Mobile Hamburger
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a:not(.nav-btn)');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
            }
        });
    });

    // Fade-in Animation
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));

    // Dynamic Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Setup dummy contact form
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message!');
        e.target.reset();
    });

    // ================= AUTHENTICATION LOGIC =================
    
    let currentUser = null; // { name: '...', email: '...' }

    const authOverlay = document.getElementById('auth-overlay');
    const loginBtns = document.querySelectorAll('.login-btn');
    const logoutBtns = document.querySelectorAll('.logout-btn');
    const closeAuthBtn = document.getElementById('close-auth');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    const authControlsDesktop = document.getElementById('auth-controls-desktop');
    const userControlsDesktop = document.getElementById('user-controls-desktop');
    const navUserNameDisplay = document.querySelector('.nav-user-name');

    // Open/Close Auth Modal
    loginBtns.forEach(btn => btn.addEventListener('click', () => {
        if(currentUser) return; // shouldn't happen, but safe
        authOverlay.classList.add('active');
    }));
    closeAuthBtn.addEventListener('click', () => authOverlay.classList.remove('active'));
    authOverlay.addEventListener('click', (e) => {
        if(e.target === authOverlay) authOverlay.classList.remove('active');
    });

    // Tab Switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Reset active states
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Set new active state
            tab.classList.add('active');
            const targetForm = document.getElementById(`${tab.dataset.tab}-form`);
            targetForm.classList.add('active');
        });
    });

    // Simulate Login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const name = email.split('@')[0]; // simple name derived from email
        
        simulateLogin(name, email);
    });

    // Simulate Signup
    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        
        simulateLogin(name, email);
    });

    function simulateLogin(name, email) {
        currentUser = { name, email };
        authOverlay.classList.remove('active');
        
        // Update nav UI
        authControlsDesktop.classList.add('hidden');
        userControlsDesktop.classList.remove('hidden');
        navUserNameDisplay.textContent = name;
        
        // Hide mobile login button
        loginBtns.forEach(btn => { if(btn.classList.contains('mobile-only')) btn.style.display = 'none'; });

        // reset forms
        document.getElementById('login-form').reset();
        document.getElementById('signup-form').reset();
        
        alert(`Welcome, ${name}!`);
    }

    // Logout
    logoutBtns.forEach(btn => btn.addEventListener('click', () => {
        currentUser = null;
        
        authControlsDesktop.classList.remove('hidden');
        userControlsDesktop.classList.add('hidden');
        
        loginBtns.forEach(btn => { if(btn.classList.contains('mobile-only')) btn.style.display = 'flex'; });
        
        alert("You have been logged out.");
    }));


    // ================= E-COMMERCE LOGIC =================

    const products = [
        { id: 1, name: "Decadent Chocolate Cake", priceUSD: 24.00, priceINR: 1990, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop" },
        { id: 2, name: "Butter Croissant", priceUSD: 4.50, priceINR: 375, image: "https://images.unsplash.com/photo-1621236378699-8597faf6a176?q=80&w=800&auto=format&fit=crop" },
        { id: 3, name: "Artisan Cappuccino", priceUSD: 4.00, priceINR: 330, image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop" },
        { id: 4, name: "Blueberry Muffin", priceUSD: 3.75, priceINR: 310, image: "https://images.unsplash.com/photo-1612203985729-70726954388c?q=80&w=800&auto=format&fit=crop" },
        { id: 5, name: "French Macarons (6)", priceUSD: 15.00, priceINR: 1250, image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=800&auto=format&fit=crop" },
        { id: 6, name: "Classic Cinnamon Roll", priceUSD: 5.00, priceINR: 415, image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?q=80&w=800&auto=format&fit=crop" }
    ];

    let cart = [];
    let currentCurrency = 'USD';

    const menuGrid = document.getElementById('menu-grid');
    const currencySelect = document.getElementById('currency-select');
    const cartCountEls = [document.getElementById('cart-count'), document.getElementById('mobile-cart-count')];
    
    if (!menuGrid) return; // safety

    function renderProducts() {
        menuGrid.innerHTML = '';
        products.forEach(p => {
            const priceText = currentCurrency === 'USD' ? `$${p.priceUSD.toFixed(2)}` : `₹${p.priceINR}`;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu-item fade-in appear';
            itemDiv.innerHTML = `
                <div class="menu-img">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                </div>
                <div class="menu-info">
                    <div>
                        <h3>${p.name}</h3>
                        <p class="price">${priceText}</p>
                    </div>
                    <button class="add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
                </div>
            `;
            menuGrid.appendChild(itemDiv);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                addToCart(id);
            });
        });
    }

    currencySelect.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        renderProducts();
        updateCartUI();
    });

    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    const openCart = () => { cartOverlay.classList.add('active'); cartSidebar.classList.add('active'); };
    const closeCart = () => { cartOverlay.classList.remove('active'); cartSidebar.classList.remove('active'); };

    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('mobile-cart-btn').addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function addToCart(id) {
        const item = cart.find(i => i.id === id);
        if (item) item.quantity += 1;
        else cart.push({ id, quantity: 1 });
        updateCartUI();
        
        const btn = document.querySelector(`.add-to-cart-btn[data-id="${id}"]`);
        if(btn) {
            btn.innerHTML = 'Added! ✓';
            btn.style.backgroundColor = 'var(--success)';
            btn.style.color = 'white';
            btn.style.borderColor = 'var(--success)';
            setTimeout(() => {
                btn.innerHTML = 'Add to Cart';
                btn.style.cssText = '';
            }, 1000);
        }
    }

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let totalItems = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty. Please add items to order.</div>';
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            
            cart.forEach((cartItem) => {
                const product = products.find(p => p.id === cartItem.id);
                totalItems += cartItem.quantity;
                const itemPrice = currentCurrency === 'USD' ? product.priceUSD : product.priceINR;
                totalPrice += (itemPrice * cartItem.quantity);
                const priceText = currentCurrency === 'USD' ? `$${itemPrice.toFixed(2)}` : `₹${itemPrice}`;

                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${product.name}</div>
                        <div class="cart-item-price">${priceText}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn dec" data-id="${product.id}">-</button>
                            <span>${cartItem.quantity}</span>
                            <button class="qty-btn inc" data-id="${product.id}">+</button>
                            <button class="remove-item" data-id="${product.id}">Remove</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(div);
            });
        }

        const totalText = currentCurrency === 'USD' ? `$${totalPrice.toFixed(2)}` : `₹${totalPrice}`;
        cartTotalEl.textContent = totalText;
        cartCountEls.forEach(el => el.textContent = totalItems);

        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const isInc = e.target.classList.contains('inc');
                const cartItem = cart.find(i => i.id === id);
                if(isInc) cartItem.quantity++;
                else { 
                    cartItem.quantity--; 
                    if(cartItem.quantity <= 0) cart = cart.filter(i => i.id !== id);
                }
                updateCartUI();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                cart = cart.filter(i => i.id !== id);
                updateCartUI();
            });
        });
    }

    // ================= CHECKOUT LOGIC =================

    const checkoutModal = document.getElementById('checkout-overlay');
    const closeCheckoutBtn = document.getElementById('close-checkout');
    const paymentForm = document.getElementById('payment-form');
    const checkoutAmountEl = document.getElementById('checkout-amount');
    const formSection = document.getElementById('checkout-form-section');
    const successSection = document.getElementById('payment-success');
    const payNowBtn = document.getElementById('pay-now-btn');

    checkoutBtn.addEventListener('click', () => {
        closeCart();
        
        // Auto-fill logged in user info
        if (currentUser) {
            document.getElementById('checkout-name').value = currentUser.name;
            document.getElementById('checkout-email').value = currentUser.email;
        }

        checkoutAmountEl.textContent = cartTotalEl.textContent;
        formSection.classList.remove('hidden');
        successSection.classList.add('hidden');
        checkoutModal.classList.add('active');
    });

    const closeCheckout = () => checkoutModal.classList.remove('active');
    closeCheckoutBtn.addEventListener('click', closeCheckout);
    
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', (e) => {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originalText = payNowBtn.innerHTML;
        payNowBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        payNowBtn.disabled = true;

        setTimeout(() => {
            formSection.classList.add('hidden');
            successSection.classList.remove('hidden');
            cart = [];
            updateCartUI();
            payNowBtn.innerHTML = originalText;
            payNowBtn.disabled = false;
        }, 1500);
    });

    document.getElementById('back-to-home').addEventListener('click', () => {
        closeCheckout();
    });

    renderProducts();

});
