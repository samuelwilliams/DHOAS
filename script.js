Number.prototype.toCurrencyString = function() {
    return '$' + this.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

document.getElementById('calculate').addEventListener("click", CalculateSubsidy);
document.getElementById('subsidy-form').addEventListener("submit", CalculateSubsidy);
Array.from(document.calculator.tier).forEach(function(tier) {
    tier.addEventListener('change', radioChangeEvent);
});

function radioChangeEvent(event) {
    var loan = parseFloat(document.getElementById('loan').value || '0');
    var rate = parseFloat(document.getElementById('rate').value || '0');

    if (loan === 0.00 || rate === 0.00) {
        clearResults();
        return;
    }

    return CalculateSubsidy(event);
}

function clearResults() {
    document.getElementById('subsidy').innerHTML = '';
    document.getElementById('subsidyLimit').innerHTML = '';
}

function View() {
    this.loanCapital = document.getElementById('loan');
    this.annualInterest = document.getElementById('rate');
    this.subsidy = document.getElementById('subsidy');
    this.subsidyLimit = document.getElementById('subsidyLimit');
    this.getTierValue = function() {
        return parseInt(document.querySelector('input[name="tier"]:checked').value)
    };
}

function CalculateSubsidy(event) {
    event.preventDefault();

    // get the input values
    var loan = parseFloat(window.view.loanCapital.value || '0');
    var rate = parseFloat(window.view.annualInterest.value || '0');
    var tier = window.view.getTierValue();

    // get the elements to hold the results
    var rmra, interest, subsidyLimit;
    var medianHousePrice = 718071;
    var n = 300; //Number of compounding periods (25 years * 12 months).

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
            return;
    }

    // Check the input is valid and, if not, display an alert.
    if (rate > 8.95) {
        window.alert('The interest rate cannot be higher than 8.95%');
        return;
    }

    if (loan === 0.00 || rate === 0.00) {
        window.alert('No values for Loan amount and/or interest rate.');
        return;
    }

    //Convert annual interest rate to rate per month.
    rate = rate / 1200;

    //Calculate the Required Monthly Repayment Amount (RMRA)
    rmra = loan * (rate / (1 - Math.pow(1 + rate, -n)));

    //Calculate the average monthly interest
    interest = (rmra * n - loan) / n;

    //Render results
    window.view.subsidy.innerHTML = (0.375*interest).toCurrencyString() +' per month';
    window.view.subsidyLimit.innerHTML = subsidyLimit.toCurrencyString();
}

window.onload = function () {
    window.view = new View();
};

