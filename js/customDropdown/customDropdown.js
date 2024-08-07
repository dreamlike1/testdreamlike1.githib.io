// js/customDropdown/customDropdown.js

// Function to initialize custom dropdowns
export function initializeCustomDropdowns() {
    // Get all select elements with the custom-dropdown class
    const selectElements = document.querySelectorAll('select.custom-dropdown');
    
    // Check if selectElements is iterable
    if (selectElements.length === 0) {
        console.warn('No elements found for custom dropdown initialization.');
        return;
    }

    // Iterate over NodeList safely
    selectElements.forEach((selectElement) => {
        // Check if the element is an actual <select> element
        if (selectElement instanceof HTMLSelectElement) {
            // Apply custom styles or functionality to the select element
            selectElement.style.backgroundImage = 'none'; // Example: Remove default dropdown arrow
            // Add any other custom styles or functionality here
        } else {
            console.warn('Expected HTMLSelectElement but found:', selectElement);
        }
    });
}

// Initialize custom dropdowns on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeCustomDropdowns);
