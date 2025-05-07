// Navigation bar toggle
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

// ✅ Supabase Setup
const supabaseUrl = 'https://ezmppukfhgzsfekakkix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXBwdWtmaGd6c2Zla2Fra2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjY2MDgsImV4cCI6MjA2MjA0MjYwOH0.0FJr4AhMbyImCTlNmqMykiKnNRYeXYT5soMS8O4POYA';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ✅ Wait until DOM is ready
document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("card-container");
    if (!container) {
        console.warn("Card container not found.");
        return;
    }

    console.log("Fetching cards from Supabase...");
    const { data: cards, error } = await supabase
        .from('cards')
        .select('*');

    if (error) {
        console.error("Supabase error:", error.message);
        container.innerHTML = "<p style='color:red;'>Failed to load cards. Check console for details.</p>";
        return;
    }

    console.log("Cards fetched:", cards);

    if (!cards || cards.length === 0) {
        container.innerHTML = "<p>No cards available right now. Please check back later.</p>";
        return;
    }

    // Clear old content
    container.innerHTML = "";

    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("pro");
        cardElement.setAttribute("data-id", card.id);

        const imageUrl = card.image_url || 'img/mat-1-coppercoat-vanguard.jpg';

        cardElement.innerHTML = `
            <img src="${card.cardimageurl}" alt="${card.name}">
            <div class="des">
                <span>Magic the Gathering</span>
                <h5>${card.name}</h5>
                <div class="star">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <h4>$${card.price}</h4>
            </div>
            <a href="#"><i class="fal fa-shopping-cart cart"></i></a>
        `;

        if (!card.image_url) {
            console.warn(`Card "${card.name}" has no image_url!`);
          }

        cardElement.addEventListener("click", () => {
            window.location.href = `sproduct.html?id=${card.id}`;
        });

        container.appendChild(cardElement);
    });
});


/*const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

//
const supabaseUrl = 'https://ezmppukfhgzsfekakkix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXBwdWtmaGd6c2Zla2Fra2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjY2MDgsImV4cCI6MjA2MjA0MjYwOH0.0FJr4AhMbyImCTlNmqMykiKnNRYeXYT5soMS8O4POYA';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("card-container");
    if (!container) return;

    const { data: cards, error } = await supabase
        .from('cards')
        .select('*');

        console.log(cards, error);

    if (error) {
        console.error("Error fetching cards:", error);
        container.innerHTML = "<p>Failed to load cards.</p>";
        return;
    }

    container.innerHTML = ""; // Clear placeholder

    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("pro");
        cardElement.setAttribute("data-id", card.id);
        cardElement.innerHTML = `
            <img src="${card.image_url}" alt="${card.name}">
            <div class="des">
                <span>Magic the Gathering</span>
                <h5>${card.name}</h5>
                <div class="star">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
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
});*/

//  

if(bar){
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if(close){
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

/*document.addEventListener("DOMContentLoaded", function () {
    // Add click event to each product to navigate to sproduct.html
    document.querySelectorAll(".pro").forEach(product => {
        product.addEventListener("click", function() {
            const productId = this.getAttribute("data-id");
            if(productId){
                window.location.href = `sproduct.html?id=${productId}`;
            }
        });
    });
});*/


/*document.addEventListener("DOMContentLoaded", function () {
    // Handle navigation from shop.html and index.html to sproduct.html
    document.querySelectorAll(".pro").forEach(product => {
        product.addEventListener("click", function() {
            const productId = this.getAttribute("data-id");
            if (productId) {
                window.location.href = `sproduct.html?id=${productId}`;
            }
        });
    });

    // Function to display product details in sproduct.html
    function getProductIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

    function displayProductDetails() {
        const products = [
            { id: "1", name: "Coppercoat Vanguard", price: "$19", image: "img/MTG/mat-1-coppercoat-vanguard.jpg", description: "A strong card for your collection." },
            { id: "2", name: "Deification", price: "$25", image: "img/MTG/mat-2-deification.jpg", description: "A powerful enchantment to boost your deck." },
            { id: "3", name: "Harnessed Snubhorn", price: "$15", image: "img/MTG/mat-3-harnessed-snubhorn.jpg", description: "A resilient creature with great abilities." },
            { id: "4", name: "Metropolis Reformer", price: "$19", image: "img/MTG/mat-4-metropolis-reformer.jpg", description: "A resilient creature with great abilities." },
            { id: "5", name: "Spark Rupture", price: "$19", image: "img/MTG/mat-5-spark-rupture.jpg", description: "A resilient creature with great abilities." },
            { id: "6", name: "Tazri, Stalwart Survivor", price: "$19", image: "img/MTG/mat-6-tazri-stalwart-survivor.jpg", description: "A resilient creature with great abilities." },
            { id: "7", name: "Filter Out", price: "$19", image: "img/MTG/mat-7-filter-out.jpg", description: "A resilient creature with great abilities." },
            { id: "8", name: "Tolarian Contempt", price: "$19", image: "img/MTG/mat-8-tolarian-contempt.jpg", description: "A resilient creature with great abilities." },
            { id: "9", name: "Training Grounds", price: "$19", image: "img/MTG/mat-9-training-grounds.jpg", description: "A resilient creature with great abilities." },
            { id: "10", name: "Vesuvan Drifter", price: "$19", image: "img/MTG/mat-10-vesuvan-drifter.jpg", description: "A resilient creature with great abilities." },
            { id: "11", name: "Ayara's Oathsworn", price: "$19", image: "img/MTG/mat-11-ayara-s-oathsworn.jpg", description: "A resilient creature with great abilities." },
            { id: "12", name: "Blot Out", price: "$19", image: "img/MTG/mat-12-blot-out.jpg", description: "A resilient creature with great abilities." },
            { id: "13", name: "Death-Rattle Oni Out", price: "$19", image: "img/MTG/mat-13-death-rattle-oni.jpg", description: "A resilient creature with great abilities." },
            { id: "14", name: "Markov Baron Out", price: "$19", image: "img/MTG/mat-14-markov-baron.jpg", description: "A resilient creature with great abilities." },
            { id: "15", name: "Urborg Scavengers", price: "$19", image: "img/MTG/mat-15-urborg-scavengers.jpg", description: "A resilient creature with great abilities." },
            { id: "16", name: "Arni Metalbrow", price: "$19", image: "img/MTG/mat-16-arni-metalbrow.jpg", description: "A resilient creature with great abilities." }
        ];

        const productId = getProductIdFromUrl();
        const product = products.find(p => p.id === productId);

        if (product) {
            document.getElementById("product-image").src = product.image;
            document.getElementById("product-name").textContent = product.name;
            document.getElementById("product-price").textContent = product.price;
            document.getElementById("product-description").textContent = product.description;
        } else {
            document.getElementById("prodetails").innerHTML = "<h2>Product not found</h2>";
        }
    }

    // Check if we're on sproduct.html
    if (document.getElementById("product-image")) {
        displayProductDetails();
    }

    // Product data

    if (document.getElementById("product-list")) {
        const products = [
            { id: 1, name: "Coppercoat Vanguard", price: "$19", image: "img/MTG/mat-1-coppercoat-vanguard.jpg", description: "A strong card for your collection." },
            { id: 2, name: "Deification", price: "$19", image: "img/MTG/mat-2-deification.jpg", description: "A powerful enchantment to boost your deck." },
            { id: 3, name: "Harnessed Snubhorn", price: "$19", image: "img/MTG/mat-3-harnessed-snubhorn.jpg", description: "A resilient creature with great abilities." },
            { id: 4, name: "Metropolis Reformer", price: "$19", image: "img/MTG/mat-4-metropolis-reformer.jpg", description: "A resilient creature with great abilities." },
            { id: 5, name: "Spark Rupture", price: "$19", image: "img/MTG/mat-5-spark-rupture.jpg", description: "A resilient creature with great abilities." },
            { id: 6, name: "Tazri, Stalwart Survivor", price: "$19", image: "img/MTG/mat-6-tazri-stalwart-survivor.jpg", description: "A resilient creature with great abilities." },
            { id: 7, name: "Filter Out", price: "$19", image: "img/MTG/mat-7-filter-out.jpg", description: "A resilient creature with great abilities." },
            { id: 8, name: "Tolarian Contempt", price: "$19", image: "img/MTG/mat-8-tolarian-contempt.jpg", description: "A resilient creature with great abilities." },
            { id: 9, name: "Training Grounds", price: "$19", image: "img/MTG/mat-9-training-grounds.jpg", description: "A resilient creature with great abilities." },
            { id: 10, name: "Vesuvan Drifter", price: "$19", image: "img/MTG/mat-10-vesuvan-drifter.jpg", description: "A resilient creature with great abilities." },
            { id: 11, name: "Ayara's Oathsworn", price: "$19", image: "img/MTG/mat-11-ayara-s-oathsworn.jpg", description: "A resilient creature with great abilities." },
            { id: 12, name: "Blot Out", price: "$19", image: "img/MTG/mat-12-blot-out.jpg", description: "A resilient creature with great abilities." },
            { id: 13, name: "Death-Rattle Oni Out", price: "$19", image: "img/MTG/mat-13-death-rattle-oni.jpg", description: "A resilient creature with great abilities." },
            { id: 14, name: "Markov Baron Out", price: "$19", image: "img/MTG/mat-14-markov-baron.jpg", description: "A resilient creature with great abilities." },
            { id: 15, name: "Urborg Scavengers", price: "$19", image: "img/MTG/mat-15-urborg-scavengers.jpg", description: "A resilient creature with great abilities." },
            { id: 16, name: "Arni Metalbrow", price: "$19", image: "img/MTG/mat-16-arni-metalbrow.jpg", description: "A resilient creature with great abilities." }
        ];

        const productsPerPage = 8;
        let currentPage = 1;

        function loadProducts(page) {
            const start = (page - 1) * productsPerPage;
            const end = start + productsPerPage;
            const productList = document.getElementById("product-list");

            // Clear previous products
            productList.innerHTML = "";

            // Loop through the selected products
            products.slice(start, end).forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("pro");
                productDiv.setAttribute("data-id", product.id);
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="">
                    <div class="des">
                        <span>Magic the Gathering</span>
                        <h5>${product.name}</h5>
                        <div class="star">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <h4>${product.price}</h4>
                    </div>
                `;

                // Add click event to navigate to product page
                productDiv.addEventListener("click", function() {
                    window.location.href = `sproduct.html?id=${product.id}`;
                });

                productList.appendChild(productDiv);
            });
        }

        // Load initial page
        loadProducts(currentPage);

        // Pagination Click Event
        document.querySelectorAll(".page-link").forEach(link => {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                const page = parseInt(this.getAttribute("data-page"));
                if (page) {
                    currentPage = page;
                    loadProducts(page);
                }
            });
        });
    }

});*/

document.addEventListener("DOMContentLoaded", function () {
    const mainImage = document.getElementById("product-image");
    const smallImages = document.querySelectorAll(".small-img");

    smallImages.forEach(img => {
        img.addEventListener("click", function() {
            mainImage.src = this.src;
        });
    });
});


// Load product details when the page loads
//window.onload = displayProductDetails;