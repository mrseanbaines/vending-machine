const products = [
  { code: 'A1', price: 2.5 },
  { code: 'A2', price: 1.75 },
  { code: 'A3', price: 2 },
  { code: 'A4', price: 3.25 },
  { code: 'B1', price: 2.5 },
  { code: 'B2', price: 1.75 },
  { code: 'B3', price: 2 },
  { code: 'B4', price: 3.25 },
  { code: 'C1', price: 2.5 },
  { code: 'C2', price: 1.75 },
  { code: 'C3', price: 2 },
  { code: 'C4', price: 3.25 },
  { code: 'D1', price: 2.5 },
  { code: 'D2', price: 1.75 },
  { code: 'D3', price: 2 },
  { code: 'D4', price: 3.25 }
];

let myCoins = [
  { name: '£2', value: 2, quantity: 1 },
  { name: '£1', value: 1, quantity: 1 },
  { name: '50p', value: 0.5, quantity: 1 },
  { name: '20p', value: 0.2, quantity: 1 },
  { name: '10p', value: 0.1, quantity: 1 },
  { name: '5p', value: 0.05, quantity: 1 },
  { name: '2p', value: 0.02, quantity: 1 },
  { name: '1p', value: 0.01, quantity: 1 },
];

let vendorsCoins = [
  { name: '£2', value: 2, quantity: 1 },
  { name: '£1', value: 1, quantity: 1 },
  { name: '50p', value: 0.5, quantity: 1 },
  { name: '20p', value: 0.2, quantity: 1 },
  { name: '10p', value: 0.1, quantity: 1 },
  { name: '5p', value: 0.05, quantity: 1 },
  { name: '2p', value: 0.02, quantity: 1 },
  { name: '1p', value: 0.01, quantity: 1 },
];

let myItems = [
  { code: 'A1', price: 2.5 }
];

let amountPaid = 0;
let amountDue = null;
let itemSelected = null;

const vendingMachine = document.getElementById('vending-machine');
const display = document.getElementById('display');
const displayItem = document.getElementById('display-item');
const displayPaid = document.getElementById('display-paid');
const displayDue = document.getElementById('display-due');
const wallet = document.getElementById('wallet');
const items = document.getElementById('items');
const buttons = document.getElementsByClassName('product');
const coinButtons = document.getElementsByClassName('coin');
const topUp = document.getElementById('top-up');

// Render products in vending machine
const updateProducts = () => {
  let productList = '';

  products.map(product => {
    productList +=
    `
      <div class="xs-c3 xs-pad-y1">
        <button
          class="xs-pad-y6 xs-pad-x2 text-white text-center rounded product"
          data-code="${product.code}"
          data-price="${product.price}"
        >
          <h2>${product.code}</h2>
          <p>£${product.price.toFixed(2)}</p>
        </button>
      </div> <!-- .c -->
    `
  })

  vendingMachine.innerHTML = productList;
  // Handle product click events
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', ev => {
      let el = ev.target.closest('.product').dataset.code;
      displayProduct(selectedItem(el)[0]);
      amountDue = selectedItem(el)[0].price - amountPaid;
      itemSelected = selectedItem(el)[0];
      updateDue();
    });
  }
};
updateProducts();

// Render my coins
const updateMyCoins = () => {
  let myMoney = '';

  myCoins.map(coin => {
    myMoney +=
    `
      <div class="xs-c4 xs-pad-y1">
        <button
          class="xs-pad-y6 xs-pad-x2 text-white text-center rounded coin"
          data-name="${coin.name}"
          data-value="${coin.value}"
          data-quantity="${coin.quantity}"
        >
          <h2>${coin.name}</h2>
        </button>
      </div> <!-- .c -->
    `
  })

  wallet.innerHTML = myMoney;
  // Handle coin click events
  for (var i = 0; i < coinButtons.length; i++) {
    coinButtons[i].addEventListener('click', ev => {
      let el = Number(ev.target.closest('.coin').dataset.value);
      handlePayment(selectedCoin(el)[0], vendorsSelectedCoin(el)[0]);
    });
  }
};
updateMyCoins();

// Render my items
const updateMyItems = () => {
  let itemList = '';

  myItems.map(product => {
    itemList +=
    `
      <div class="xs-c3 xs-pad-y1">
        <button
          class="xs-pad-y6 xs-pad-x2 text-white text-center rounded my-product"
          data-code="${product.code}"
          data-price="${product.price}"
        >
          <h2>${product.code}</h2>
          <p>£${product.price.toFixed(2)}</p>
        </button>
      </div> <!-- .c -->
    `
  })

  items.innerHTML = itemList;
};
updateMyItems();

// Find product with selected code
const selectedItem = code => products.filter(product => product.code === code);

// Find coin with selected value
const selectedCoin = value => myCoins.filter(coin => coin.value === value);

// Find vendor's coin with selected value
const vendorsSelectedCoin = value => vendorsCoins.filter(coin => coin.value === value);

// Display amount of selected item to the user
const displayProduct = item => {
  displayItem.innerHTML =
    `
      ${item.code}
    `;
};

// Update amount due
const updateDue = () => {
  if (itemSelected) {
    if (amountDue >= 0) {
      displayDue.innerHTML =
        `
          Amount due: £${amountDue.toFixed(2)}
        `
    } else {
      displayDue.innerHTML =
        `
          Change due: £${(-amountDue).toFixed(2)}
        `
    }
    if (amountDue <= 0 && itemSelected) {
      returnProduct(itemSelected);
      giveChange(Number((-amountDue).toFixed(2)));

    }
  }
};

// Update amount paid
const updatePaid = () => {
  displayPaid.innerHTML =
  `
    Amount paid: £${amountPaid.toFixed(2)}
  `;
};

// Handle payment
const handlePayment = (myCoin, vendorsCoin) => {
  if (myCoin.quantity > 0) {
    amountPaid += myCoin.value;
    amountDue -= myCoin.value;
    myCoin.quantity--;
    vendorsCoin.quantity++;
    updateMyCoins();
  }

  updatePaid();
  updateDue();
}

// Return product
const returnProduct = () => {
  products.splice(products.indexOf(itemSelected), 1);
  myItems.push(itemSelected);
  updateProducts();
  updateMyItems();
};

topUp.addEventListener('click', (ev) => {
  ev.preventDefault();
  myCoins.map(coin => {
    coin.quantity++;
    updateMyCoins();
  })
})

const giveChange = (amount) => {
  let remainder = amount;
  for (var i = 0; i < myCoins.length; i++) {
    if (remainder >= myCoins[i].value) {
      console.log(Math.floor(amount / myCoins[i].value));
      myCoins[i].quantity += Math.floor(amount / myCoins[i].value);
      remainder = amount % myCoins[i].value;
    }
  }
  updateMyCoins();
  itemSelected = null;
  amountPaid = 0;
  amountDue = 0;
  updatePaid();
  updateDue();
};
