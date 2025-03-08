const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

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

document.addEventListener("DOMContentLoaded", function () {
    // Add click event to each product to navigate to sproduct.html
    document.querySelectorAll(".pro").forEach(product => {
        product.addEventListener("click", function() {
            const productId = this.getAttribute("data-id");
            if(productId){
                window.location.href = `sproduct.html?id=${productId}`;
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    // Function to get product ID from URL
    function getProductIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

    // Product data
    const products = [
        { id: 1, name: "Coppercoat Vanguard", price: "$19", image: "img/MTG/mat-1-coppercoat-vanguard.jpg", description: "A strong card for your collection." },
        { id: 2, name: "Deification", price: "$19", image: "img/MTG/mat-2-deification.jpg", description: "A powerful enchantment to boost your deck." },
        { id: 3, name: "Harnessed Snubhorn", price: "$19", image: "img/MTG/mat-3-harnessed-snubhorn.jpg", description: "A resilient creature with great abilities." },
        { id: 4, name: "Metropolis Reformer", price: "$19", image: "img/MTG/mat-4-metropolis-reformer.jpg", description: "A resilient creature with great abilities." },
        { id: 5, name: "Spark Rupture", price: "$19", image: "img/MTG/mat-5-spark-rupture.jpg", description: "A resilient creature with great abilities." },
        { id: 6, name: "Tazri, Stalwart Survivor", price: "$19", image: "img/MTG/mat-6-tazri-stalwart-survivor.jpg", description: "A resilient creature with great abilities." },
        { id: 7, name: "Filter Out", price: "$19", image: "img/MTG/mat-7-filter-out.jpg", description: "A resilient creature with great abilities." },
        { id: 8, name: "Tolarian Contempt", price: "$19", image: "img/MTG/mat-8-tolarian-contempt.jpg", description: "A resilient creature with great abilities." }
    ];

    function displayProductDetails() {
        const productId = getProductIdFromUrl();
        const product = products.find(p => p.id == productId);

        if (product) {
            document.getElementById("product-image").src = product.image;
            document.getElementById("product-name").textContent = product.name;
            document.getElementById("product-price").textContent = product.price;
            document.getElementById("product-description").textContent = product.description;
        } else {
            document.getElementById("prodetails").innerHTML = "<h2>Product not found</h2>";
        }
    }

    displayProductDetails();
});

// Load product details when the page loads
window.onload = displayProductDetails;