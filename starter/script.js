'use strict';

// BANKIST APP
//account objects

const account1 = {
  owner: 'Greta Mat',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Laura Ziup',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Tom McGivern',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Rose Blackburn',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
  //empty the container first - retuns everything and we set it to empty
  containerMovements.innerHTML = '';

  const sortmovs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  sortmovs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${movement}💶</div>
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
  labelBalance.textContent = `${acc.balance}💶`;
};

//calculating display summary of ins and outs by using the chaining of methods
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}💶`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  //math.abs takes out - sign again
  labelSumOut.textContent = `${Math.abs(outcomes)}💶`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}💶`;
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

const updateUI = function (currentAccount) {
  //calculate and display movements
  displayMovements(currentAccount.movements);
  //calculate and display balance
  calcDisplayBalance(currentAccount);
  //calculate and display summary
  calcDisplaySummary(currentAccount);
};

//Event Handlers
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting - page being refreshed
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  ); //getting value out of input
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }🤩`;
    containerApp.style.opacity = 100;

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
  const transferAmount = Number(inputTransferAmount.value);
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
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//requesting a loan - some method
//bank will only grant a loan if there is at least one deposit with atleast 10% of the requested loan amount
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    //Add Movemenet
    currentAccount.movements.push(loanAmount);
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
    Number(inputClosePin.value) === currentAccount.pin
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
