let purchaseCount = 1;

document.getElementById('add-purchase').addEventListener('click', addPurchase);
document.getElementById('calculate').addEventListener('click', calculate);
document.getElementById('reset').addEventListener('click', reset);

// Add initial rows
reset();

// Function to remove default "0" on focus
function clearDefaultValueOnFocus(input) {
  input.addEventListener('focus', function () {
    if (this.value === "0") {
      this.value = "";
    }
  });
  
  input.addEventListener('blur', function () {
    if (this.value === "") {
      this.value = "0";
    }
  });
}

function addPurchase() {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>Trade ${purchaseCount + 1}</td>
    <td><input type="number" id="quantity-${purchaseCount + 1}" value="0"></td>
    <td><input type="number" id="price-${purchaseCount + 1}" value="0"></td>
    <td id="amount-invested-${purchaseCount + 1}">0</td>
    <td><button class="delete-row">Delete</button></td>
  `;
  document.getElementById('purchase-body').appendChild(newRow);
  purchaseCount++;

  // Attach event listener to the delete button
  newRow.querySelector('.delete-row').addEventListener('click', function() {
    this.parentElement.parentElement.remove();
    updateRowNumbers();
    calculate();
    checkDeleteButton();
  });

  // Attach focus listeners to the new inputs
  clearDefaultValueOnFocus(newRow.querySelector(`#quantity-${purchaseCount}`));
  clearDefaultValueOnFocus(newRow.querySelector(`#price-${purchaseCount}`));

  updateRowNumbers();
  checkDeleteButton();
}

function calculate() {
  let totalQuantity = 0;
  let totalAmountInvested = 0;
  let averagePrice = 0;

  const rows = document.getElementById('purchase-body').rows;
  for (let i = 0; i < rows.length; i++) {
    const quantity = parseInt(rows[i].cells[1].children[0].value) || 0;
    const price = parseInt(rows[i].cells[2].children[0].value) || 0;
    totalQuantity += quantity;
    totalAmountInvested += quantity * price;
    rows[i].cells[3].textContent = (quantity * price).toLocaleString();
  }

  averagePrice = totalQuantity > 0 ? (totalAmountInvested / totalQuantity) : 0;
  document.getElementById('total-quantity').textContent = totalQuantity.toLocaleString();
  document.getElementById('total-amount-invested').textContent = totalAmountInvested.toLocaleString();
  document.getElementById('average-price').textContent = averagePrice.toLocaleString();
}

function reset() {
  document.getElementById('purchase-body').innerHTML = `
    <tr>
      <td>Trade 1</td>
      <td><input type="number" id="quantity-1" value="0"></td>
      <td><input type="number" id="price-1" value="0"></td>
      <td id="amount-invested-1" style="color: grey;">0</td>
      <td><button class="delete-row">Delete</button></td>
    </tr>
    <tr>
      <td>Trade 2</td>
      <td><input type="number" id="quantity-2" value="0"></td>
      <td><input type="number" id="price-2" value="0"></td>
      <td id="amount-invested-2" style="color: grey;">0</td>
      <td><button class="delete-row">Delete</button></td>
    </tr>
  `;
  document.getElementById('total-quantity').textContent = '0';
  document.getElementById('total-amount-invested').textContent = '0';
  document.getElementById('average-price').textContent = '0';
  purchaseCount = 2; // Start from 2 since reset adds two rows

  // Attach delete listeners for initial rows
  attachDeleteListeners();
  checkDeleteButton();

  // Attach focus listeners to initial inputs
  clearDefaultValueOnFocus(document.getElementById('quantity-1'));
  clearDefaultValueOnFocus(document.getElementById('price-1'));
  clearDefaultValueOnFocus(document.getElementById('quantity-2'));
  clearDefaultValueOnFocus(document.getElementById('price-2'));
}

function updateRowNumbers() {
  const rows = document.getElementById('purchase-body').rows;
  for (let i = 0; i < rows.length; i++) {
    rows[i].cells[0].textContent = `Trade ${i + 1}`;
    rows[i].cells[1].children[0].id = `quantity-${i + 1}`;
    rows[i].cells[2].children[0].id = `price-${i + 1}`;
    rows[i].cells[3].id = `amount-invested-${i + 1}`;
  }
  purchaseCount = rows.length;
}

function checkDeleteButton() {
  const rows = document.getElementById('purchase-body').rows;
  const deleteButtons = document.getElementsByClassName('delete-row');

  // Show delete buttons for each row if more than 2 rows exist
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].style.display = rows.length > 2 ? 'inline' : 'none';
  }

  // Disable delete button for the last row if there's only one row
  if (rows.length === 1) {
    deleteButtons[0].disabled = true;
  }
}

// Attach event listeners to delete buttons for initial rows
function attachDeleteListeners() {
  const deleteButtons = document.getElementsByClassName('delete-row');
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', function() {
      this.parentElement.parentElement.remove();
      updateRowNumbers();
      calculate();
      checkDeleteButton();
    });
  }
}

// Call checkDeleteButton() initially to set the state of the delete button
checkDeleteButton();
