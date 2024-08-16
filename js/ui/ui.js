import { populateCountries } from './countryUtils.js';
import { getBusinessDays } from './businessDaysUtils.js';
import { calculateBusinessDate } from './dateCalculation.js';

export function populateBusinessDays() {
    const serviceType = document.getElementById('serviceType').value;
    const country = document.getElementById('countrySelect').value;
    const businessDaysInput = document.getElementById('businessDays');

    businessDaysInput.value = getBusinessDays(serviceType, country);
}

export function setupEventListeners() {
    document.getElementById('serviceType').addEventListener('change', () => {
        populateCountries();
        populateBusinessDays();
    });

    document.getElementById('countrySelect').addEventListener('change', populateBusinessDays);
    document.getElementById('calculateButton').addEventListener('click', calculateBusinessDate);

    // Event listener for the result field
    document.getElementById('result').addEventListener('click', () => {
        const resultField = document.getElementById('result');
        navigator.clipboard.writeText(resultField.value).then(() => {
            const copyMessageCalculator = document.getElementById('copyMessageCalculator');
            copyMessageCalculator.style.display = 'block';
            setTimeout(() => {
                copyMessageCalculator.style.display = 'none';
            }, 2000);
        }).catch(err => console.error('Failed to copy text: ', err));
    });

    // Event listener for the standardResult field
    document.getElementById('standardResult').addEventListener('click', () => {
        const standardResultField = document.getElementById('standardResult');
        if (standardResultField.value) {
            navigator.clipboard.writeText(standardResultField.value).then(() => {
                const copyMessageStandardResult = document.getElementById('copyMessageStandardResult');
                copyMessageStandardResult.style.display = 'block';
                setTimeout(() => {
                    copyMessageStandardResult.style.display = 'none';
                }, 2000);
            }).catch(err => console.error('Failed to copy text: ', err));
        } else {
            console.error('No value to copy');
        }
    });
}
