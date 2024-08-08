import { populateCountries } from './ui/countryUtils.js';
import { setupEventListeners } from './eventHandlers/eventHandlers.js';
import { setupSwitchButton } from './switch/switch.js';
import { initializeTimezone } from './timezone/timezone.js';
import { formatDate, calculateBusinessDays } from './dateUtils/dateUtils.js'; // Import date functions

document.addEventListener('DOMContentLoaded', () => {
    const defaultServiceType = 'expressPaid'; // Default service type

    // Initialize Semantic UI dropdowns
    $('.ui.dropdown').dropdown();

    // Populate countries dropdown and fetch holidays based on default serviceType
    populateCountries(defaultServiceType).then(() => {
        $('#countrySelect').dropdown('refresh');
    });

    // Setup event listeners for UI elements
    setupEventListeners(); 
    setupSwitchButton(); 
    initializeTimezone(); 

    // Initialize date pickers
    initializeDatePickers();
});

function initializeDatePickers() {
    $('.ui.calendar').calendar({
        type: 'date',
        endCalendar: null,
        text: {
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
    });

    $('#calculateButton').on('click', handleCalculateButtonClick);
    $('#couponCalculateButton').on('click', handleCouponCalculateButtonClick);
}

function handleCalculateButtonClick() {
    const startDate = $('#startDate').calendar('get date');
    const businessDays = $('#businessDays').val().split(',').map(Number);
    const holidays = []; // Replace with actual holiday data if available

    if (startDate) {
        const endDate = calculateBusinessDays(startDate, businessDays[0], holidays);
        $('#result').val(formatDate(endDate));
    } else {
        alert('Please select a start date.');
    }
}

function handleCouponCalculateButtonClick() {
    const couponDate = $('#couponDate').calendar('get date');
    const addDays = parseInt($('#addDays').val(), 10);
    const removeExtraDay = $('#cbx-43').is(':checked');

    if (couponDate) {
        let resultDate = new Date(couponDate);
        resultDate.setDate(resultDate.getDate() + addDays);
        
        if (removeExtraDay) {
            resultDate.setDate(resultDate.getDate() - 1);
        }

        $('#couponResult').val(formatDate(resultDate));
    } else {
        alert('Please select a coupon date.');
    }
}
