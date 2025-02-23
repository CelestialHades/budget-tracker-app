// Get elements
let balanceElement = document.getElementById("balance");
let descriptionInput = document.getElementById("description");
let amountInput = document.getElementById("amount");
let typeInput = document.getElementById("type");
let transactionList = document.getElementById("transaction-list");
let chartCanvas = document.getElementById("chart");

// Load transactions
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;

// Display transactions
function displayTransactions() {
    transactionList.innerHTML = "";
    let balance = 0;
    let income = 0;
    let expenses = 0;

    transactions.forEach((transaction, index) => {
        let li = document.createElement("li");
        li.classList.add("transaction");
        if (transaction.type === "expense") {
            li.classList.add("expense");
            expenses += transaction.amount;
        } else {
            income += transaction.amount;
        }
        balance = income - expenses;

        li.innerHTML = `
            ${transaction.description} - $${transaction.amount.toFixed(2)}
            <button onclick="deleteTransaction(${index})">X</button>
        `;
        transactionList.appendChild(li);
    });

    balanceElement.innerText = balance.toFixed(2);
    updateChart(income, expenses);
}

// Add transaction
function addTransaction() {
    let description = descriptionInput.value.trim();
    let amount = parseFloat(amountInput.value);
    let type = typeInput.value;

    if (description && amount > 0) {
        transactions.push({ description, amount, type });
        descriptionInput.value = "";
        amountInput.value = "";
        updateLocalStorage();
        displayTransactions();
    }
}

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateLocalStorage();
    displayTransactions();
}

// Update local storage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize Chart
function initChart() {
    chart = new Chart(chartCanvas, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                data: [0, 0],
                backgroundColor: ["#28a745", "#f44336"]
            }]
        }
    });
}

// Update Chart
function updateChart(income, expenses) {
    chart.data.datasets[0].data = [income, expenses];
    chart.update();
}

// Initialize app
initChart();
displayTransactions();