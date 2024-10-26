// inventory_input_tab.js
// Create a new tab in your HTML interface to manage inventory input
const newTabHtml = `
<div class="container" id="inventory-tab" style="display:none;">
    <h2>Inventory Management - Input New Items</h2>
    <div id="input-section">
        <label for="item-category">Category:</label>
        <select id="item-category">
            <option value="medical">Medical & Communication Equipment</option>
            <option value="tools">Tools & Equipment</option>
            <option value="weaponry">Weaponry & Ammunition</option>
            <option value="food">Food Inventory</option>
            <option value="water">Water Inventory</option>
        </select>

        <label for="item-name">Item Name:</label>
        <input type="text" id="item-name" placeholder="Enter item name">

        <label for="item-quantity">Quantity:</label>
        <input type="number" id="item-quantity" min="1" placeholder="Enter quantity">

        <button onclick="addNewItem()">Add Item</button>
        <p id="feedback-message" style="color: red; visibility: hidden;"></p>
    </div>
</div>`;

// Append this HTML to the main document when the new tab is selected
document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector("body");
    container.insertAdjacentHTML('beforeend', newTabHtml);
});

// JavaScript logic to add new items to respective inventory based on the inputs
let medicalInventory = [];
let toolsInventory = [];
let weaponryInventory = [];
let foodInventory = [];
let waterInventory = [];

function addNewItem() {
    const category = document.getElementById("item-category").value;
    const itemName = document.getElementById("item-name").value.trim();
    const itemQuantity = parseInt(document.getElementById("item-quantity").value);
    const feedbackMessage = document.getElementById("feedback-message");

    if (itemName === "" || isNaN(itemQuantity) || itemQuantity <= 0) {
        feedbackMessage.innerText = "Please enter a valid item name and quantity.";
        feedbackMessage.style.visibility = "visible";
        return;
    }

    feedbackMessage.style.visibility = "hidden";
    const newItem = { name: itemName, quantity: itemQuantity };

    switch (category) {
        case "medical":
            medicalInventory.push(newItem);
            break;
        case "tools":
            toolsInventory.push(newItem);
            break;
        case "weaponry":
            weaponryInventory.push(newItem);
            break;
        case "food":
            foodInventory.push(newItem);
            break;
        case "water":
            waterInventory.push(newItem);
            break;
        default:
            break;
    }

    updateInventoryDisplay(category);
}

function updateInventoryDisplay(category) {
    let inventory;
    switch (category) {
        case "medical":
            inventory = medicalInventory;
            break;
        case "tools":
            inventory = toolsInventory;
            break;
        case "weaponry":
            inventory = weaponryInventory;
            break;
        case "food":
            inventory = foodInventory;
            break;
        case "water":
            inventory = waterInventory;
            break;
        default:
            return;
    }

    // Here, you can add logic to update the specific inventory table to show the latest data.
    console.log(`Updated ${category} inventory:`, inventory);
    // Note: We will expand this to render updates in the UI tables.
}

// New button event to switch to the new tab
document.getElementById("new-inventory-tab-btn").addEventListener("click", function () {
    document.getElementById("inventory-tab").style.display = "block";
    // Hide other tabs as needed
});
