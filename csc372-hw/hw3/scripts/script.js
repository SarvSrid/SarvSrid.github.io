// Dish Information Description
const dishDescriptions = {
    "chickfila-sandwich": {
        name: "Chick-fil-A Chicken Sandwich",
        description: "A boneless breast of chicken seasoned to perfection, freshly breaded, pressure cooked in 100% refined peanut oil, and served on a toasted, buttered bun.",
        price: "$4.25"
    },
    "chickfila-nuggets": {
        name: "Chick-fil-A Nuggets",
        description: "Bite-sized pieces of tender chicken breast, seasoned, hand-breaded, and pressure cooked to perfection.",
        price: "$3.95"
    },
    "chickfila-fries": {
        name: "Waffle Fries",
        description: "Crispy waffle-cut potatoes cooked to perfection.",
        price: "$2.25"
    },
    "bww-honeybbq": {
        name: "Honey BBQ Wings",
        description: "Juicy wings covered in honey BBQ sauce with a perfect balance of sweet and savory.",
        price: "$9.95"
    },
    "bww-cheese-curds": {
        name: "Cheddar Cheese Curds",
        description: "Golden, crispy cheddar cheese curds served with your choice of dip.",
        price: "$5.95"
    },
    "bww-chicken-sandwich": {
        name: "Buffalo Ranch Chicken Sandwich",
        description: "Crispy chicken breast topped with Swiss cheese, ranch dressing, and zesty buffalo sauce, served on a toasted bun.",
        price: "$8.99"
    },
    "salsaritas-burrito": {
        name: "Chicken Burrito",
        description: "A large flour tortilla stuffed with grilled chicken, rice, beans, and your choice of salsa and toppings.",
        price: "$7.50"
    },
    "salsaritas-tacos": {
        name: "Beef Tacos",
        description: "Three soft tacos filled with seasoned beef, cheese, lettuce, and pico de gallo.",
        price: "$6.75"
    },
    "salsaritas-quesadilla": {
        name: "Quesadilla",
        description: "A grilled tortilla filled with melted cheese, chicken or beef, and your choice of toppings.",
        price: "$7.00"
    }
};

document.querySelectorAll('.dish').forEach(item => {
    item.addEventListener('click', (event) => {
        const dishId = event.target.getAttribute('data-dish');
        const dish = dishDescriptions[dishId];
        const descriptionSection = document.getElementById('dish-description');
        descriptionSection.innerHTML = `<strong>${dish.name}</strong><br>${dish.description}<br><strong>Price:</strong> ${dish.price}`;
    });
});

// Meal Plan Calculator
document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.add-btn');
    const selectedDishes = document.getElementById('selected-dishes');
    const totalCostElement = document.getElementById('total-cost');
    let totalCost = 0;

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dishName = button.parentElement.textContent.split(' - ')[0];
            const dishPrice = parseFloat(button.getAttribute('data-price'));

            let existingItem = Array.from(selectedDishes.children).find(li => li.dataset.name === dishName);

            if (existingItem) {

                let quantityElement = existingItem.querySelector('.quantity');
                let quantity = parseInt(quantityElement.textContent);
                quantity++;
                quantityElement.textContent = quantity;

                let itemPriceElement = existingItem.querySelector('.item-price');
                let newPrice = dishPrice * quantity;
                itemPriceElement.textContent = `$${newPrice.toFixed(2)}`;


                totalCost += dishPrice;
                totalCostElement.textContent = totalCost.toFixed(2);
            } else {
                const li = document.createElement('li');
                li.dataset.name = dishName;
                li.innerHTML = `${dishName} - <span class="item-price">$${dishPrice.toFixed(2)}</span> (<span class="quantity">1</span>) `;
                
                const addButton = document.createElement('button');
                addButton.textContent = '+';
                addButton.classList.add('add-more-btn');
                addButton.setAttribute('data-price', dishPrice);
                addButton.style.marginRight = '10px';
                li.appendChild(addButton);

                const removeButton = document.createElement('button');
                removeButton.textContent = '-';
                removeButton.classList.add('remove-btn');
                removeButton.setAttribute('data-price', dishPrice);
                removeButton.style.marginLeft = '10px';
                li.appendChild(removeButton);

                selectedDishes.appendChild(li);

                // Update the total cost
                totalCost += dishPrice;
                totalCostElement.textContent = totalCost.toFixed(2);


                addButton.addEventListener('click', () => {
                    let quantityElement = li.querySelector('.quantity');
                    let quantity = parseInt(quantityElement.textContent);
                    quantity++;
                    quantityElement.textContent = quantity;

                    let itemPriceElement = li.querySelector('.item-price');
                    let newPrice = dishPrice * quantity;
                    itemPriceElement.textContent = `$${newPrice.toFixed(2)}`;


                    totalCost += dishPrice;
                    totalCostElement.textContent = totalCost.toFixed(2);
                });


                removeButton.addEventListener('click', () => {
                    let quantityElement = li.querySelector('.quantity');
                    let quantity = parseInt(quantityElement.textContent);

                    if (quantity > 1) {
                        quantity--;
                        quantityElement.textContent = quantity;

                        let itemPriceElement = li.querySelector('.item-price');
                        let newPrice = dishPrice * quantity;
                        itemPriceElement.textContent = `$${newPrice.toFixed(2)}`;


                        totalCost -= dishPrice;
                        totalCostElement.textContent = totalCost.toFixed(2);
                    } else {
                        selectedDishes.removeChild(li);
                        totalCost -= dishPrice;
                        totalCostElement.textContent = totalCost.toFixed(2);
                    }
                });
            }
        });
    });
});