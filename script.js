const searchProductInput = document.getElementById('search-product');
const productTable = document.getElementById('product-table');
const addProductButton = document.getElementById('add-product-button');
const sendSalesButton = document.getElementById('send-sales-button');

let products = [];

// Add event listeners
searchProductInput.addEventListener('keyup', filterProducts);
addProductButton.addEventListener('click', addProduct);
sendSalesButton.addEventListener('click', sendSalesToMongoDB);
const saleDateInput = document.getElementById('sale-date');
const saleDateInput2 = document.getElementById('sale-date2');
var selectedDate = '';
var nextDate = '';
saleDateInput.addEventListener('change', (event) => {
  selectedDate = event.target.value;
  getDetails(event.target.value);
  console.log('Selected date:', selectedDate);
});

saleDateInput2.addEventListener('change', (event) => {
  nextDate = event.target.value;
  if(nextDate == selectedDate) alert("next date should be next date of sale date!");
  console.log('Selected date:', nextDate);
});

//Function to get selected date details
function getDetails(dateSelected) {
  const dataToBeSend = {
    date : dateSelected
};
  const body = JSON.stringify(dataToBeSend);
  // xhr.send(body);

  
  fetch(`http://ec2-13-127-244-230.ap-south-1.compute.amazonaws.com:5000/getSaleData/${dateSelected}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      updateProductTable(data);
      products = data;
    })
    .catch(error => console.error(error));
}
// Function to filter products based on search term and selected date
function filterProducts() {
  const searchTerm = searchProductInput.value.toLowerCase();
  const filteredProducts = products.filter(product => {
    const productName = product.name.toLowerCase();
    return productName.includes(searchTerm);
  });

  updateProductTable(filteredProducts);
}

// Function to add a new product
function addProduct() {
  const productName = prompt('Enter product name:');
  if(productName != null) {
    console.log(productName);
    const quantity = parseInt(prompt('Enter quantity:'));
    if(quantity != null){
        console.log(quantity);

        const sale = parseInt(prompt('Enter sale amount:'));

        console.log(sale);
        // if (productName && quantity && sale) {
            console.log('inf oop')
        const newProduct = {
            name: productName,
            quantity: quantity,
            sale: sale,
        };
    
        products.push(newProduct);
        updateProductTable(products);
        console.log(products);
    // }
  }
}
}

// Function to update the product table with the given products
function updateProductTable(products) {
  const productTableBody = productTable.getElementsByTagName('tbody')[0];
  productTableBody.innerHTML = '';
    console.log(products);
  products.forEach(product => {
    const productRow = productTableBody.insertRow();
    const productNameCell = productRow.insertCell();
    const quantityCell = productRow.insertCell();
    const saleCell = productRow.insertCell();
    const actionCell = productRow.insertCell();

    productNameCell.textContent = product.name;
    quantityCell.textContent = product.quantity;
    saleCell.textContent = product.sale;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editProduct(product));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteProduct(product));

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
  });
}

// Function to edit an existing product
function editProduct(product) {
  const updatedProductName = prompt('Enter updated product name:', product.name);
  const updatedQuantity = parseInt(prompt('Enter updated quantity:', product.quantity));
  const updatedSale = parseInt(prompt('Enter updated sale amount:', product.sale));

  if (updatedProductName && updatedQuantity && updatedSale) {
    product.name = updatedProductName;
    product.quantity = updatedQuantity;
    product.sale = updatedSale;

    updateProductTable(products);
  }
}

// Function to delete a product
function deleteProduct(product) {
  products = products.filter(p => p !== product);
  updateProductTable(products);
}

// Function to send sales data to MongoDB
function sendSalesToMongoDB() {
  // Implement logic to send sales data to MongoDB
  // Replace this with your actual MongoDB connection and data insertion code
  if(nextDate == ''){
    alert("select next date to proceed!");
    return;
  }
  const dataToBeSend = {
    dataSource: "",
  database: "mrf",
  collection: "tyres",
  nextDate: nextDate,
  document: {
    date:  selectedDate,
    data: products
  }
};
  const body = JSON.stringify(dataToBeSend);
  // xhr.send(body);

  
  fetch('http://ec2-13-127-244-230.ap-south-1.compute.amazonaws.com:5000/sendSaleData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  })
    .then(response => response.json())
    .then(data => alert("data Sent!"))
    .catch(error => alert("error Sending Data!"));
  
  console.log('Sending sales data to MongoDB...');
}

