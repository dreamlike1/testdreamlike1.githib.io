// js/main.js

import { populateCountries } from './ui/countryUtils.js'; // Import country population and holiday fetching functions
import { setupEventListeners } from './eventHandlers/eventHandlers.js'; // Import the event handlers
import { setupSwitchButton } from './switch/switch.js'; // Import the switch button setup function
import { initializeTimezone } from './timezone/timezone.js'; // Import the timezone initialization function

document.addEventListener('DOMContentLoaded', () => {
    const serviceTypeElement = document.getElementById('serviceType');
    const defaultServiceType = serviceTypeElement ? serviceTypeElement.value : 'default'; // Use 'default' if serviceType is not set

    populateCountries(defaultServiceType); // Populate countries dropdown and fetch holidays based on default serviceType
    setupEventListeners(); // Setup event listeners for UI elements
    setupSwitchButton(); // Initialize the switch button functionality
    initializeTimezone(); // Initialize the timezone functionality

    // Initialize Select2 for the country select element
    $('#countrySelect').select2({
        theme: 'default', // Keeps the default styling which can be customized
        placeholder: 'Select a country',
        width: 'resolve' // Ensure it fits the container
    });
});
