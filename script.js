// Navigation toggle
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => nav.classList.add('active'));
}
if (close) {
    close.addEventListener('click', () => nav.classList.remove('active'));
}

// Supabase setup
const supabaseUrl = 'https://ezmppukfhgzsfekakkix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXBwdWtmaGd6c2Zla2Fra2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjY2MDgsImV4cCI6MjA2MjA0MjYwOH0.0FJr4AhMbyImCTlNmqMykiKnNRYeXYT5soMS8O4POYA';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ DOM fully loaded");
    const container = document.getElementById("card-container"); // homepage
    const productList = document.getElementById("product-list"); // shop page
    const paginationLinks = document.getElementById("pagination-links");

    // ✅ Homepage logic
    if (container) {
        console.log("Loading featured cards for homepage...");

        const { data: cards, error } = await supabase.from('cards').select('*').gt('quantity', 0).limit(8);

        if (error) {
            console.error("Supabase error:", error.message);
            container.innerHTML = "<p style='color:red;'>Failed to load cards.</p>";
            return;
        }

        container.innerHTML = "";
        cards.forEach(card => {
            const imageUrl = card.cardimageurl || 'img/default.jpg';
            const cardElement = document.createElement("div");
            cardElement.classList.add("pro");
            cardElement.setAttribute("data-id", card.id);
            cardElement.innerHTML = `
                <img src="${imageUrl}" alt="${card.name}">
                <div class="des">
                    <span>Magic the Gathering</span>
                    <h5>${card.name}</h5>
                    <div class="star">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i>
                        <i class="fas fa-star"></i><i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <h4>$${card.price}</h4>
                </div>
                <a href="#"><i class="fal fa-shopping-cart cart"></i></a>
            `;
            cardElement.addEventListener("click", () => {
                window.location.href = `sproduct.html?id=${card.id}`;
            });
            container.appendChild(cardElement);
        });
    }

    // ✅ Shop page logic with pagination
    if (productList && paginationLinks) {
        console.log("Found product list and pagination. Initializing...");

        const productsPerPage = 12;
        let currentPage = 1;

        async function loadPage(page) {
            const start = (page - 1) * productsPerPage;
            const end = start + productsPerPage - 1;

            console.log("Querying cards with range:", start, end);

            productList.innerHTML = "<p>Loading...</p>";
            paginationLinks.innerHTML = "";

            const { data: cards, error, count } = await supabase
                .from("cards")
                .select("*", { count: "exact" })
                .gt("quantity", 0)
                .range(start, end);

            console.log("Supabase result:", cards, error, count);

            if (error) {
                console.error("Error fetching cards:", error.message);
                productList.innerHTML = "<p style='color:red;'>Failed to load cards.</p>";
                return;
            }

            productList.innerHTML = "";
            cards.forEach(card => {
                const imageUrl = card.cardimageurl || 'img/default.jpg';
                const cardDiv = document.createElement("div");
                cardDiv.classList.add("pro");
                cardDiv.setAttribute("data-id", card.id);
                cardDiv.innerHTML = `
                    <img src="${imageUrl}" alt="${card.name}">
                    <div class="des">
                        <span>Magic the Gathering</span>
                        <h5>${card.name}</h5>
                        <div class="star">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i>
                            <i class="fas fa-star"></i><i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <h4>$${card.price}</h4>
                    </div>
                    <a href="#"><i class="fal fa-shopping-cart cart"></i></a>
                `;
                cardDiv.addEventListener("click", () => {
                    window.location.href = `sproduct.html?id=${card.id}`;
                });
                productList.appendChild(cardDiv);
            });

            // Pagination links
            const totalPages = Math.ceil(count / productsPerPage);
            for (let i = 1; i <= totalPages; i++) {
                const pageLink = document.createElement("a");
                pageLink.href = "#";
                pageLink.classList.add("page-link");
                pageLink.textContent = i;
                if (i === page) pageLink.classList.add("active");

                pageLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    currentPage = i;
                    loadPage(currentPage);
                });

                paginationLinks.appendChild(pageLink);
            }
        }

        loadPage(currentPage);
    }

    const productName = document.getElementById("product-name");
    const productPrice = document.getElementById("product-price");
    const productDescription = document.getElementById("product-description");
    const productImage = document.getElementById("product-image");

    if (productName && productPrice && productDescription && productImage) {
        const params = new URLSearchParams(window.location.search);
        const cardId = params.get("id");

        if (!cardId) {
            console.error("No card ID found in URL.");
            return;
        }

        const result = await supabase
            .from("cards")
            .select("*")
            .eq("id", cardId)
            .gt("quantity", 0)
            .single();

        const card = result.data;
        const error = result.error;

        if (error || !card) {
            console.error("Failed to fetch card:", error?.message || "No data returned.");
            productName.textContent = "Card not found.";
            return;
        }

        const imageUrl = card.cardimageurl || "img/default.jpg";
        productName.textContent = card.name;
        productPrice.textContent = `$${card.price}`;
        productDescription.textContent = card.description || "No description available.";
        productImage.src = imageUrl;
        productImage.alt = card.name;

        // ✅ Now that card is available, set up "Add to Cart"
        const addToCartBtn = document.querySelector("button.normal");
        const qtyInput = document.querySelector(".single-pro-details input");

        console.log("Cart button:", addToCartBtn);
        console.log("Qty input:", qtyInput);

        if (addToCartBtn && qtyInput) {
            console.log("✅ Add to Cart button found");

            addToCartBtn.addEventListener("click", () => {
                console.log("🛒 Button clicked!");

                const qty = parseInt(qtyInput.value) || 1;
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existing = cart.find(p => p.id === card.id);

                if (existing) {
                    existing.quantity += qty;
                } else {
                    cart.push({
                        id: card.id,
                        name: card.name,
                        price: card.price,
                        image: imageUrl,
                        quantity: qty
                    });
                }

                console.log("📦 Adding to cart:", cart);

                localStorage.setItem("cart", JSON.stringify(cart));
                alert(`${card.name} added to cart!`);
            });
        }

        // ✅ Featured Products (unchanged)
        const featuredContainer = document.querySelector("#product1 .pro-container");
        if (featuredContainer) {
            const { data: featuredCards, error: featuredError } = await supabase
                .from("cards")
                .select("*")
                .neq("id", cardId)
                .gt("quantity", 0)
                .limit(4);

            if (!featuredError && featuredCards) {
                featuredCards.forEach(featured => {
                    const img = featured.cardimageurl || "img/default.jpg";
                    const div = document.createElement("div");
                    div.classList.add("pro");
                    div.innerHTML = `
                        <img src="${img}" alt="${featured.name}">
                        <div class="des">
                            <span>Magic the Gathering</span>
                            <h5>${featured.name}</h5>
                            <div class="star">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i>
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                            <h4>$${featured.price}</h4>
                        </div>
                        <a href="#"><i class="fal fa-shopping-cart cart"></i></a>
                    `;
                    div.addEventListener("click", () => {
                        window.location.href = `sproduct.html?id=${featured.id}`;
                    });
                    featuredContainer.appendChild(div);
                });
            }
        }
    }

    //Cart page Logic
    // ✅ Cart Page
    const cartBody = document.getElementById("cart-body");
    const subtotalDisplay = document.querySelector("#subtotal table");

    if (cartBody) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            cartBody.innerHTML = "<tr><td colspan='6'>Your cart is empty.</td></tr>";
            if (subtotalDisplay) subtotalDisplay.innerHTML = `<tr><td>Total</td><td>$0</td></tr>`;
            return;
        }

        let total = 0;
        cartBody.innerHTML = "";
        cart.forEach(item => {
            const row = document.createElement("tr");
            const itemTotal = item.quantity * item.price;
            total += itemTotal;
            row.innerHTML = `
                <td><a href="#" class="remove-item" data-id="${item.id}"><i class="far fa-times-circle"></i></a></td>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td><input type="number" class="cart-qty" data-id="${item.id}" value="${item.quantity}" min="1"></td>
                <td>$${itemTotal}</td>
            `;
            cartBody.appendChild(row);
        });

        if (subtotalDisplay) {
            subtotalDisplay.innerHTML = `
                <tr><td>Cart Subtotal</td><td>$${total}</td></tr>
                <tr><td>Shipping</td><td>Free</td></tr>
                <tr><td><strong>Total</strong></td><td><strong>$${total}</strong></td></tr>
            `;
        }

        document.querySelectorAll(".cart-qty").forEach(input => {
            input.addEventListener("change", (e) => {
                const id = parseInt(e.target.dataset.id);
                const newQty = parseInt(e.target.value);
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const item = cart.find(p => p.id === id);
                if (item) {
                    item.quantity = newQty;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    location.reload();
                }
            });
        });

        document.querySelectorAll(".remove-item").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const id = parseInt(link.dataset.id);
                const newCart = cart.filter(p => p.id !== id);
                localStorage.setItem("cart", JSON.stringify(newCart));
                location.reload();
            });
        });
    }

    // ✅ Checkout Page Logic
    const checkoutBody = document.getElementById("checkout-body");
    const checkoutSubtotal = document.querySelector("#checkoutTable table");

    if (checkoutBody) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            checkoutBody.innerHTML = "<tr><td colspan='5'>Your cart is empty.</td></tr>";
            if (checkoutSubtotal) {
                checkoutSubtotal.innerHTML = `
                    <tr><td>Cart Subtotal</td><td>$0</td></tr>
                    <tr><td>Shipping</td><td>Free</td></tr>
                    <tr><td><strong>Total</strong></td><td><strong>$0</strong></td></tr>
                `;
            }
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${itemTotal}</td>
            `;
            checkoutBody.appendChild(row);
        });

        if (checkoutSubtotal) {
            checkoutSubtotal.innerHTML = `
                <tr><td>Cart Subtotal</td><td>$${total}</td></tr>
                <tr><td>Shipping</td><td>Free</td></tr>
                <tr><td><strong>Total</strong></td><td><strong>$${total}</strong></td></tr>
            `;
        }

        const placeOrderBtn = document.getElementById("place-order-btn");

        if (placeOrderBtn) {
            placeOrderBtn.addEventListener("click", async () => {
                const cart = JSON.parse(localStorage.getItem("cart")) || [];

                if (cart.length === 0) {
                    alert("Your cart is empty.");
                    return;
                }

                for (const item of cart) {
                    // Get current quantity
                    const { data: current, error: fetchError } = await supabase
                        .from("cards")
                        .select("quantity")
                        .eq("id", item.id)
                        .single();

                    if (fetchError) {
                        alert(`Error retrieving ${item.name}: ${fetchError.message}`);
                        return;
                    }

                    const newQty = current.quantity - item.quantity;
                    if (newQty < 0) {
                        alert(`Not enough stock for ${item.name}.`);
                        return;
                    }

                    // Update quantity in database
                    const { error: updateError } = await supabase
                        .from("cards")
                        .update({ quantity: newQty })
                        .eq("id", item.id);

                    if (updateError) {
                        alert(`Error updating ${item.name}: ${updateError.message}`);
                        return;
                    }
                }

                // Clear the cart and show confirmation
                localStorage.removeItem("cart");
                alert("✅ Order placed successfully!");

                // Optional redirect
                 window.location.href = "index.html";
            });
        }

    }
});
