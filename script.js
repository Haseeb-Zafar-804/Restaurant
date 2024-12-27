document.addEventListener("DOMContentLoaded", function () {
    // Smooth scrolling functionality
    const smoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                const targetId = this.getAttribute("href").substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70, // Adjust offset as needed
                        behavior: "smooth",
                    });
                }
            });
        });
    };

    // Highlight active navbar link
    const highlightNavbar = () => {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (window.scrollY >= sectionTop - sectionHeight / 3) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    };

    // Debounce function for efficient event handling
    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    // Open/Close Cart Sidebar functionality
    const openCartButton = document.getElementById('open-cart');
    const closeCartButton = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsList = document.getElementById('cart-items');
    const totalAmountEl = document.getElementById('total-amount');
    const confirmOrderButton = document.getElementById('confirm-order');
    const clearCartButton = document.getElementById('clear-cart'); // Clear Cart Button

    if (!openCartButton || !closeCartButton || !cartSidebar) {
        console.warn('Cart buttons or sidebar not found.');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalAmount = calculateTotalAmount(cart);

    function calculateTotalAmount(cart) {
        return cart.reduce((total, item) => total + (typeof item.price === 'number' ? item.price : 0), 0);
    }

    // Initialize the cart display
    updateCart();

    openCartButton.addEventListener('click', () => {
        cartSidebar.style.right = '0';
    });

    closeCartButton.addEventListener('click', () => {
        cartSidebar.style.right = '-300px';
    });

    // Add items to cart
    const orderButtons = document.querySelectorAll('.order-button');
    orderButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const menuItem = button.closest('.menu-item');
            if (menuItem) {
                const itemName = menuItem.querySelector('h3').textContent;
                const itemPrice = parseInt(menuItem.querySelector('.menu-price').textContent.replace('Rs ', ''), 10);

                addToCart(itemName, itemPrice);
            }
        });
    });

    function addToCart(itemName, itemPrice) {
        const cartItem = { name: itemName, price: itemPrice };
        cart.push(cartItem);
        updateCart();
        saveCartToLocalStorage();
    }

    function updateCart() {
        cartItemsList.innerHTML = ''; // Clear the current cart list
        totalAmount = calculateTotalAmount(cart);

        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - Rs ${item.price}`;
            cartItemsList.appendChild(li);
        });

        totalAmountEl.textContent = totalAmount;
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Confirm order functionality
    confirmOrderButton.addEventListener('click', () => {
        if (cart.length > 0) {
            alert(`Order confirmed! Total amount: Rs ${totalAmount}`);
            cart = []; // Clear the cart after confirmation
            updateCart();
            saveCartToLocalStorage(); // Update local storage
            cartSidebar.style.right = '-300px'; // Close the cart after confirmation
        }
    });

    // Clear cart functionality
    clearCartButton.addEventListener('click', () => {
        cart = []; // Clear the cart
        updateCart(); // Update the display
        localStorage.removeItem('cart'); // Remove from local storage
    });

    // Initialize the functions
    smoothScroll();
    highlightNavbar();
});
