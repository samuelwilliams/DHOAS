"use strict";

// Return Number as decimal currency formatted string. E.g. (1508.30).toCurrencyString returns "$1,508.30".
Number.prototype.toCurrencyString = function() {
    return '$' + this.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Bind the event listeners.
document.calculator.addEventListener('submit', CalculateSubsidy);
document.calculator.calculate.addEventListener('click', CalculateSubsidy);
Array.from(document.calculator.tier).forEach(function(tier) {
    tier.addEventListener('change', radioChangeEvent);
});

function radioChangeEvent(event) {
    let principal = parseFloat(document.calculator.principal.value || '0');
    let rate = parseFloat(document.calculator.interestRate.value || '0');

    if (principal === 0 || rate === 0) {
        clearResults();
        return;
    }

    return CalculateSubsidy(event);
}

function clearResults() {
    document.getElementById('subsidy').innerHTML = '';
    document.getElementById('subsidyLimit').innerHTML = '';
}

function CalculateSubsidy(event) {
    event.preventDefault();

    // Get the input values.
    let principal = parseFloat(document.calculator.principal.value || '0');
    let rate = parseFloat(document.calculator.interestRate.value || '0');
    let tier = parseInt(document.querySelector('input[name="tier"]:checked').value);

    // get the elements to hold the results
    let rmra, interest, subsidyLimit, loanCapital;
    let medianHousePrice = 750608; //Correct at 01 July 2020
    let n = 300; //Number of compounding periods (25 years * 12 months).

    switch (tier) {
        case 1:
            subsidyLimit = 0.4 * medianHousePrice;
            break;
        case 2:
            subsidyLimit = 0.6 * medianHousePrice;
            break;
        case 3:
            subsidyLimit = 0.8 * medianHousePrice;
            break;
        default:
            window.alert('No subsidy tier has been selected.');
            clearResults();
            return;
    }

    // Check the input is valid and, if not, display an alert.
    if (rate > 8.95) {
        window.alert('The interest rate cannot be higher than 8.95%');
        clearResults();
        return;
    }

    if (principal === 0 || rate === 0) {
        window.alert('No values for Loan amount and/or interest rate.');
        clearResults();
        return;
    }

    // The Loan Capital is the lesser of the 1) principal; or 2) subsidised loan limit.
    loanCapital = (principal < subsidyLimit) ? principal : subsidyLimit;

    // Convert annual interest rate to rate per month.
    rate = rate / 1200;

    // Calculate the Required Monthly Repayment Amount (RMRA)
    rmra = loanCapital * (rate / (1 - Math.pow(1 + rate, -n)));

    // Calculate the average monthly interest
    interest = (rmra * n - loanCapital) / n;

    // Render results
    document.getElementById('subsidy').innerHTML = (0.375 * interest).toCurrencyString() +' per month';
    document.getElementById('subsidyLimit').innerHTML = subsidyLimit.toCurrencyString();
}


