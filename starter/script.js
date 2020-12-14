'use strict';

// BANKIST APP
// Data

const account1 = {
  owner: 'Greta Mat',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Tom McGivern',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (acc, sort = false) {
  //empty the container first - retuns everything and we set it to empty
  containerMovements.innerHTML = '';

  const sortmovs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  sortmovs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    //adding a date element
    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${movement.toFixed(2)}💶</div>
  </div>`;

    //adding html to ui
    //1. position where we attach html
    //2. string containing html that we want to insert
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//calculating the total of movements
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}💶`;
};

//calculating display summary of ins and outs by using the chaining of methods
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}💶`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  //math.abs takes out - sign again
  labelSumOut.textContent = `${Math.abs(outcomes.toFixed(2))}💶`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}💶`;
};

//computing users - username is initials
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

createUserNames(accounts);

const updateUI = function (acc) {
  //calculate and display movements
  displayMovements(acc);
  //calculate and display balance
  calcDisplayBalance(acc);
  //calculate and display summary
  calcDisplaySummary(acc);
};

//Event Handlers
let currentAccount;

//FAKE LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting - page being refreshed
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  ); //getting value out of input
  console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    //display UI and welcome message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }🤩`;
    containerApp.style.opacity = 100;

    //setting the current date
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hour = now.getHours();
    const minute = now.getMinutes();
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

    //clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    //take cursor away from pin
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

//transfer - find method
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const transferAmount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  //confitions for the transfer
  //1. more than zero and more than in your current account
  //2. that it's going to a different user
  //3. that receiver exists - receiver.Account?
  if (
    transferAmount > 0 &&
    receiverAccount &&
    currentAccount.balance >= transferAmount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    //updating the figures
    currentAccount.movements.push(-transferAmount);
    receiverAccount.movements.push(transferAmount);

    //add transfer dadte
    currentAccount.movementsDates.push(new Date());
    receiverAccount.movementsDates.push(new Date());
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//requesting a loan - some method
//bank will only grant a loan if there is at least one deposit with atleast 10% of the requested loan amount
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    //Add Movemenet
    currentAccount.movements.push(loanAmount);

    //Add Loan Date
    currentAccount.movementsDates.push(new Date());
    //Update UI
    updateUI(currentAccount);
  }
});
//closing the account - findIndex
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  //checking if credentials are correct
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    //will use splice method to delete
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = '';
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

//sorting
//preserving sorted state
let sorted = false;

btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
