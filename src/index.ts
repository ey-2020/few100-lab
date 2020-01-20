import './styles.css';

// 1) Find important things
const buttonGroup: HTMLInputElement[] = [
    document.getElementById('button-10-pct') as HTMLInputElement,
    document.getElementById('button-15-pct') as HTMLInputElement,
    document.getElementById('button-20-pct') as HTMLInputElement
];
const tipLabelElem = document.getElementById('tip-label') as HTMLSpanElement;

const billEnteredElem = document.getElementById('bill-entered') as HTMLInputElement;
const billAmountElem = document.getElementById('bill-amount') as HTMLSpanElement;
const tipPercentageElem = document.getElementById('tip-percentage') as HTMLSpanElement;
const tipAmountElem = document.getElementById('tip-amount') as HTMLSpanElement;
const totalAmountElem = document.getElementById('total-amount') as HTMLSpanElement;

const personsLabelElem = document.getElementById('persons-label') as HTMLSpanElement;
const averageAmountElem = document.getElementById('average-amount') as HTMLSpanElement;
const personsEnteredElem = document.getElementById('persons-entered') as HTMLInputElement;
const eachPayingElem = document.getElementById('each-paying') as HTMLDivElement;

class Invoice {
    public billText: string;
    public bill: number;
    public tipRate: number;
    public personsText: string;
    public personsCount: number;
    constructor(billText: string, bill: number, tipRate: number, personsCount: number) {
        this.billText = billText;
        this.bill = bill;
        this.tipRate = tipRate;
        this.personsCount = personsCount;
    }
}
const defaultText = '';
const defaultAmount = 0.0;
const defaultRate = 20;
const defaultCount = 1;
let invoice = new Invoice(defaultText, defaultAmount, defaultRate, defaultCount);
updateTipSelection('button-' + defaultRate.toString() + '-pct');
updateAmountDisplay(invoice);
updateSplitAmountDisplay(invoice);

// 2) Update invoice states
// 2.1) Update tip rate
function updateTipRate(tipRate: number, currentInvoice: Invoice) {
    currentInvoice.tipRate = tipRate;
    return currentInvoice;
}

// 2.2) Update invoice amount
function updateAmount(textEntered: string, currentInvoice: Invoice): Invoice {
    if (textEntered.match(/^[+-]{0,1}[0-9]{1,}[.]{0,1}[0-9]{0,2}$/) !==
        null) {
        // accept input, like "+100.20"|"-100.20"
        currentInvoice.billText = textEntered;
        currentInvoice.bill = parseFloat(invoice.billText);
    } else if (textEntered.match(/^[+-]{1}$/)) {
        // initial blank field or later reset
        currentInvoice.billText = textEntered;
        currentInvoice.bill = 0.0;
    } else if (textEntered.match(/^$/)) {
        // initial blank field or later reset
        currentInvoice.billText = '';
        currentInvoice.bill = 0.0;
    } else {
        // reject last input character, like in "100.."|"100.003"|"100.0a"
    }
    return currentInvoice;
}

// 2.3) Update persons to split the bill
function updatePersons(textEntered: string, currentInvoice: Invoice): Invoice {
    if (textEntered.match(/^[1-9]{1}[0-9]{0,}$/) !== null) {
        // accept input, like "10"
        currentInvoice.personsText = textEntered;
        currentInvoice.personsCount = parseInt(currentInvoice.personsText, 10);
    } else if (textEntered.match(/^$/)) {
        // initial blank field or later reset
        currentInvoice.personsText = textEntered;
        currentInvoice.personsCount = 1;
    } else {
        // reject last input character, like in "0"|"+10"|"-10"|"1a"
    }
    return currentInvoice;
}

// 3. update displays
// 3.1 update tip button display
function updateTipSelection(buttonId: string) {
    buttonGroup.forEach(btn => {
        if (btn.id === buttonId) {
            document.getElementById(`${btn.id}`).setAttribute('disabled', 'disabled');
        } else {
            document.getElementById(`${btn.id}`).removeAttribute('disabled');
        }
    });
    tipLabelElem.innerText = buttonId.replace('button-', '').replace('-pct', '');
}

// 3.2 refresh amount input text
function refreshAmountEntered(currentInvoice: Invoice) {
    billEnteredElem.value = invoice.billText;
    if (currentInvoice.billText.match(/^-/) !== null) {
        billEnteredElem.classList.add('red-border');
        // have to set focus elsewhere to make red-border seen
        personsEnteredElem.focus();
    } else {
        billEnteredElem.classList.remove('red-border');
    }
}

// 3.3 update amount display
function updateAmountDisplay(currentInvoice: Invoice) {
    const bill = (currentInvoice.bill < 0) ? 0.0 : invoice.bill;
    const tip = bill * currentInvoice.tipRate / 100.0;
    const total = bill + tip;

    billAmountElem.innerText = bill.toFixed(2);
    tipPercentageElem.innerText = currentInvoice.tipRate.toString();
    tipAmountElem.innerText = tip.toFixed(2);
    totalAmountElem.innerText = total.toFixed(2);
}

// 3.4 refresh persons input text
function refreshPersonsEntered(currentInvoice: Invoice) {
    personsEnteredElem.value = currentInvoice.personsText;
}

// 3.5 update split amount display
function updateSplitAmountDisplay(currentInvoice: Invoice) {
    const bill = (currentInvoice.bill < 0.0) ? 0.0 : currentInvoice.bill;
    const tip = bill * currentInvoice.tipRate / 100.0;
    const total = bill + tip;

    personsLabelElem.innerText = currentInvoice.personsCount.toString();
    averageAmountElem.innerHTML = (total / currentInvoice.personsCount).toFixed(2);
    if (currentInvoice.personsCount > 1) {
        eachPayingElem.classList.add('darkred-text');
        eachPayingElem.classList.remove('each-paying-hidden');
        eachPayingElem.classList.add('each-paying-shown');
    } else {
        eachPayingElem.classList.remove('darkred-text');
        eachPayingElem.classList.remove('each-paying-shown');
        eachPayingElem.classList.add('each-paying-hidden');
    }
}

// 4. Hook up events
billEnteredElem.addEventListener('keyup', handleBillKeyUp);
buttonGroup.forEach(btn => btn.addEventListener('click', handleClick));
personsEnteredElem.addEventListener('keyup', handlePersonsKeyUp);

function handleBillKeyUp() {
    const amountText = billEnteredElem.value;
    invoice = updateAmount(amountText, invoice);
    refreshAmountEntered(invoice);
    updateAmountDisplay(invoice);
    updateSplitAmountDisplay(invoice);
}

function handleClick() {
    const buttonId = this.id;
    const tipRate = parseInt(buttonId.replace('button-', '').replace('-pct', ''), 10);
    // update tip rate
    invoice = updateTipRate(tipRate, invoice);
    // update tip button display
    updateTipSelection(buttonId);
    updateAmountDisplay(invoice);
    updateSplitAmountDisplay(invoice);
}

function handlePersonsKeyUp() {
    const personsText = personsEnteredElem.value;
    invoice = updatePersons(personsText, invoice);
    refreshPersonsEntered(invoice);
    updateSplitAmountDisplay(invoice);
}
