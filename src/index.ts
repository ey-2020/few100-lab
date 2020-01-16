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
const billAmount = 0.0;
let tipPercent = 20;
let previousAmountText = '0.00';
updateAll(billAmount, tipPercent);

// 1.1 Update all fields
function updateAll(bill: number, tipPct: number) {
    // billAmount = parseFloat(previousAmountText);
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
    let amount = billEnteredElem.value;
    console.log(`${amount}`);
    if (amount.match(/^[+-]{0,1}[0-9]*[.]{0,1}[0-9]{0,2}$/) !== null) {
        if (amount.match(/^-/) !== null) {
            billEnteredElem.classList.add('redBorder');
            amount = '0.0';
        } else {
            billEnteredElem.classList.remove('redBorder');
        }
        previousAmountText = amount;
    } else {
        billEnteredElem.value = previousAmountText;
    }
    updateAll(parseFloat(previousAmountText), tipPercent);
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
    tipPercentageElem.innerText = tipPercent.toString();
    updateAll(parseFloat(previousAmountText), tipPercent);
}

