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
    const container = document.getElementById("card-container"); // homepage
    const productList = document.getElementById("product-list"); // shop page
    const paginationLinks = document.getElementById("pagination-links");

    // ✅ Homepage logic
    if (container) {
        console.log("Loading featured cards for homepage...");

        const { data: cards, error } = await supabase.from('cards').select('*').limit(8);

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

    //SProduct Logic
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

        console.log("Fetching card with ID:", cardId);

        const { data: card, error } = await supabase
            .from("cards")
            .select("*")
            .eq("id", cardId)
            .single();

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

        // ✅ Featured cards (excluding current)
        const featuredContainer = document.querySelector("#product1 .pro-container");
        if (featuredContainer && cardId) {
            const { data: featuredCards, error: featuredError } = await supabase
                .from("cards")
                .select("*")
                .neq("id", cardId)
                .limit(4);

            if (featuredError) {
                console.error("Error fetching featured cards:", featuredError.message);
            } else {
                featuredCards.forEach(featured => {
                    const imageUrl = featured.cardimageurl || "img/default.jpg";
                    const cardElement = document.createElement("div");
                    cardElement.classList.add("pro");
                    cardElement.setAttribute("data-id", featured.id);
                    cardElement.innerHTML = `
                        <img src="${imageUrl}" alt="${featured.name}">
                        <div class="des">
                            <span>Magic the Gathering</span>
                            <h5>${featured.name}</h5>
                            <div class="star">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i>
                                <i class="fas fa-star"></i><i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <h4>$${featured.price}</h4>
                        </div>
                        <a href="#"><i class="fal fa-shopping-cart cart"></i></a>
                    `;
                    cardElement.addEventListener("click", () => {
                        window.location.href = `sproduct.html?id=${featured.id}`;
                    });
                    featuredContainer.appendChild(cardElement);
                });
            }
        }
    }
});
