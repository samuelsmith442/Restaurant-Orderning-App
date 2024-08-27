// Import the menu data from another file
import { menuArray } from './data.js';

// Get references to important elements in our HTML
const menuSection = document.getElementById('menu');
const orderSection = document.getElementById('section-order');
const modalSection = document.getElementById('section-modal');
const confirmationSection = document.getElementById('section-confirmation');
const orderForm = document.getElementById('form');

// This array will hold the items in our order
let orderItems = [];

// Function to display our menu items
function renderMenu() {
    // Create HTML for each menu item and join them together
    menuSection.innerHTML = menuArray.map(item => `
        <div class="menu-wrapper">
            <div class="menu-emoji">${item.emoji}</div>
            <div class="menu-info">
                <h3>${item.name}</h3>
                <p>${item.ingredients.join(', ')}</p>
                <h3>$${item.price}</h3>
            </div>
            <button class="btn-add-item" data-id="${item.id}">+</button>
        </div>
    `).join('');
}

// Function to add an item to our order
function addToOrder(id) {
    // Find the item in our menu array
    const itemToAdd = menuArray.find(item => item.id === +id);
    if (itemToAdd) {
        // Add the item to our order
        orderItems.push(itemToAdd);
        // Update the order display
        renderOrder();
    }
}

// Function to display our order
function renderOrder() {
    // If there are no items in the order, hide the order section
    if (orderItems.length === 0) {
        orderSection.style.display = 'none';
        return;
    }

    // If there are items, show the order section and update its content
    orderSection.style.display = 'block';
    orderSection.innerHTML = `
        <h2>Your order</h2>
        ${orderItems.map(item => `
            <div class="order-item-wrapper">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <button class="btn-remove-item" data-id="${item.id}">remove</button>
                </div>
                <h3>$${item.price}</h3>
            </div>
        `).join('')}
        <div class="total-price-wrapper">
            <h3>Total price:</h3>
            <h3>$${calculateTotal()}</h3>
        </div>
        <button class="btn btn-complete-order">Complete order</button>
    `;
}

// Function to calculate the total price of the order
function calculateTotal() {
    // Add up the prices of all items in the order
    return orderItems.reduce((total, item) => total + item.price, 0);
}

// Listen for clicks on the entire document
document.addEventListener('click', function(e) {
    // If the add button was clicked, add the item to the order
    if (e.target.classList.contains('btn-add-item')) {
        addToOrder(e.target.dataset.id);
    } 
    // If the remove button was clicked, remove the item from the order
    else if (e.target.classList.contains('btn-remove-item')) {
        removeFromOrder(e.target.dataset.id);
    } 
    // If the complete order button was clicked, show the payment modal
    else if (e.target.classList.contains('btn-complete-order')) {
        showModal();
    }
});

// Function to remove an item from the order
function removeFromOrder(id) {
    // Filter out the item with the matching id
    orderItems = orderItems.filter(item => item.id !== id);
    // Update the order display
    renderOrder();
}

// Function to show the payment modal
function showModal() {
    modalSection.classList.remove('modal-active');
}

// Listen for the form submission
if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        // Prevent the form from submitting normally
        e.preventDefault();
        // Get the form data
        const formData = new FormData(orderForm);
        // Get the name from the form data
        const name = formData.get('name');
        // Process the order
        processOrder(name);
    });
}

// Function to process the order and show confirmation
function processOrder(name) {
    // Hide the modal
    modalSection.classList.add('modal-active');
    // Show the confirmation section
    confirmationSection.style.display = 'block';
    // Update the confirmation message
    confirmationSection.innerHTML = `
        <div class="order-complete">
            <p class="order-complete-message">Thanks, ${name}! Your order is on its way!</p>
        </div>
    `;
    // Clear the order
    orderItems = [];
    // Update the order display
    renderOrder();
}

// Call renderMenu when the page loads to show our menu
renderMenu();
