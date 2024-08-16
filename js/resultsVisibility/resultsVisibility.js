// js/resultsVisibility.js

export function initializeResultsVisibility() {
    $('#serviceType').on('change', handleVisibilityChange);
    $('#countrySelect').on('change', handleVisibilityChange);
}

function handleVisibilityChange() {
    const serviceType = $('#serviceType').val();
    const country = $('#countrySelect').val();

    if (serviceType === 'Standard' && country === 'United States') {
        $('#standardResultField').removeClass('hidden');
    } else {
        $('#standardResultField').addClass('hidden');
    }
}
