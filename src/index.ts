import './styles.css';
console.log('Ready to Party With Some TypeScript!');

// 1. Find important things

const buttonGroup: HTMLInputElement[] = [
    document.getElementById('button-10-pct') as HTMLInputElement,
    document.getElementById('button-15-pct') as HTMLInputElement,
    document.getElementById('button-20-pct') as HTMLInputElement
];
const billEnteredElem = document.getElementById('bill-entered') as HTMLInputElement;

const billAmountElem = document.getElementById('bill-amount') as HTMLSpanElement;
const tipPercentageElem = document.getElementById('tip-percentage') as HTMLSpanElement;
const tipAmountElem = document.getElementById('tip-amount') as HTMLSpanElement;
const totalAmountElem = document.getElementById('total-amount') as HTMLSpanElement;

document.getElementById('button-20-pct').setAttribute('disabled', 'disabled');
const billReset = 0.0;
let tipPercent = 20;
let previousAmountText = '0.00';
updateAll(billReset, tipPercent);

// 1.1 Update all fields
function updateAll(bill: number, tipPct: number) {
    const tip = bill * tipPct / 100.0;
    const total = bill + tip;

    billAmountElem.innerText = bill.toFixed(2);
    tipPercentageElem.innerText = tipPct.toString();
    tipAmountElem.innerText = tip.toString();
    totalAmountElem.innerText = total.toFixed(2);
}

// 2. Hook up events

billEnteredElem.addEventListener('keyup', handleKeyUp);
buttonGroup.forEach(btn => btn.addEventListener('click', handleClick));

function handleKeyUp() {
    const amountText = billEnteredElem.value;
    console.log(`${amountText}`);
    if (amountText.match(/^[+-]{0,1}[0-9]{1,}[.]{0,1}[0-9]{0,2}$/) !== null) {
        // accept input, like "+100.20"
        if (amountText.match(/^-/) !== null) {
            billEnteredElem.classList.add('red-border');
            // previousAmountText = amountText;
            updateAll(billReset, tipPercent);
            document.getElementById('leading-dollar').focus();
        } else {
            billEnteredElem.classList.remove('red-border');
            previousAmountText = amountText;
            updateAll(parseFloat(previousAmountText), tipPercent);
        }
    } else {
        // reject last input character, like "100.003", "100.0a"
        billEnteredElem.value = previousAmountText;
        updateAll(parseFloat(previousAmountText), tipPercent);
    }
}

function handleClick() {
    const buttonId = this.id;
    console.log(`button clicked: ${buttonId}`);
    tipPercent = parseInt(buttonId.replace('button-', '').replace('-pct', ''), 10);
    console.log(`tip percentage: ${tipPercent}%`);
    buttonGroup.forEach(btn => {
        if (btn.id === buttonId) {
            document.getElementById(`${btn.id}`).setAttribute('disabled', 'disabled');
        } else {
            document.getElementById(`${btn.id}`).removeAttribute('disabled');
        }
    });
    updateAll(parseFloat(previousAmountText), tipPercent);
}

