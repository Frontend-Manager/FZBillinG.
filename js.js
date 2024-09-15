document.addEventListener('DOMContentLoaded', () => {
    const tableOrders = {};
    for (let i = 1; i <= 20; i++) {
        tableOrders[`Table ${i}`] = [];
    }

    let currentTable = 'Table 1';
    let tableSelected = false;

    function updateTableUI() {
        document.querySelectorAll('.table-buttons button').forEach(button => {
            button.classList.remove('selected');
            if (button.dataset.table === currentTable) {
                button.classList.add('selected');
            }
        });
        updateOrderSummary();
    }
    

    function formatPrice(price) {
        return `₹${price.toFixed(2)}`;
    }

    function updateOrderSummary() {
        const orderSummary = document.querySelector('#bill-items');
        const totalPriceElement = document.querySelector('#total-price');
        orderSummary.innerHTML = '';

        const orders = tableOrders[currentTable];
        if (orders.length === 0) {
            orderSummary.innerHTML = '<tr><td colspan="4">No items ordered.</td></tr>';
            totalPriceElement.textContent = formatPrice(0);
            document.getElementById('finalizeOrder').style.display = 'none'; // Hide finalize button if no orders
            return;
        }

        let total = 0;
        orders.forEach((item) => {
            total += item.price * item.quantity;
            const orderItem = document.createElement('tr');
            orderItem.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price)}</td>
                <td>${formatPrice(item.price * item.quantity)}</td>
            `;
            orderSummary.appendChild(orderItem);
        });

        totalPriceElement.textContent = formatPrice(total);
        document.getElementById('finalizeOrder').style.display = 'block'; // Show finalize button if there are orders
    }

    window.addDish = function(dishId, dishName, dishPrice) {
        if (!tableSelected) {
            alert('Please select a table first.');
            return;
        }

        // Check if the dish already exists in the current table's order
        const existingDish = tableOrders[currentTable].find(item => item.id === dishId);
        if (existingDish) {
            // If dish exists, increment the quantity
            existingDish.quantity += 1;
        } else {
            // Add new dish with quantity 1
            tableOrders[currentTable].push({ id: dishId, name: dishName, price: dishPrice, quantity: 1 });
        }

        updateOrderSummary();
    };

    document.querySelectorAll('.add-to-order').forEach(button => {
        button.addEventListener('click', (event) => {
            const dishElement = event.target.closest('.dish');
            const dishName = dishElement.querySelector('p').textContent.split(' - ')[0];
            const dishPrice = parseFloat(dishElement.querySelector('p').textContent.split(' - ')[1]);
            const dishId = dishElement.dataset.id;
            addDish(dishId, dishName, dishPrice);
        });
    });

    document.querySelectorAll('.table-buttons button').forEach(button => {
        button.addEventListener('click', (event) => {
            currentTable = event.target.dataset.table;
            tableSelected = true;
            updateTableUI();
        });
    });

    document.querySelector('#category-select').addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        const dishes = document.querySelectorAll('#menu .dish');

        dishes.forEach(dish => {
            if (selectedCategory === 'all' || dish.dataset.category === selectedCategory) {
                dish.style.display = 'block';
            } else {
                dish.style.display = 'none';
            }
        });
    });

    document.getElementById('goToDashboard').addEventListener('click', () => {
        window.location.href = 'http://192.168.232.18:5500/Dashboard.html';
    });

    document.getElementById('finalizeOrder').addEventListener('click', () => {
        if (!tableSelected) {
            alert('Please select a table first.');
            return;
        }
        localStorage.setItem('currentTable', currentTable);
        localStorage.setItem('tableOrders', JSON.stringify(tableOrders[currentTable]));
        window.location.href = 'http://192.168.232.18:5500/Bill.html';
    });

    updateTableUI();
});

document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu');

    // Load existing dishes from localStorage and display them
    const storedItems = JSON.parse(localStorage.getItem('menuItems')) || [];

    storedItems.forEach(item => addMenuItem(item));

    // Function to dynamically add new items to the menu
    window.addMenuItem = function(item) {
        const dishDiv = document.createElement('div');
        dishDiv.classList.add('dish');
        dishDiv.setAttribute('data-category', item.category);
        dishDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name} - ₹${item.price.toFixed(2)}</p>
            <button class="add-to-order">Add to Order</button>
        `;
        menuContainer.appendChild(dishDiv);
    };
});
