// js/resultsVisibility.js

export function initializeResultsVisibility() {
    $('#serviceType').on('change', handleVisibilityChange);
    $('#countrySelect').on('change', handleVisibilityChange);
}

function handleVisibilityChange() {
    const serviceType = $('#serviceType').val();
    const country = $('#countrySelect').val();

    let resultText = '';

    // Adjust conditions and result text as needed
    if (serviceType === 'standard') {
        if (country === 'United States') {
            resultText = 'Result for 5-8 Business Days';
        } else {
            resultText = 'Result for 6-7 Business Days';
        }
        $('#standardResultField').removeClass('hidden');
        $('#resultText').removeClass('hidden');
    } else {
        $('#standardResultField').addClass('hidden');
        $('#resultText').addClass('hidden');
    }

    // Set the text content based on the resultText variable
    $('#resultTextMessage').text(resultText);
}
