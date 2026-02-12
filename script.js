const form = document.getElementById("form");
const list = document.getElementById("list");
const search = document.getElementById("search");
const filterType = document.getElementById("filterType");

const person = document.getElementById("person");
const purpose = document.getElementById("purpose");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const date = document.getElementById("date");
const dueDate = document.getElementById("dueDate");

let transactions = JSON.parse(localStorage.getItem("financeData")) || [];

function saveData(){
  localStorage.setItem("financeData", JSON.stringify(transactions));
}

form.addEventListener("submit", function(e){
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    person: person.value,
    purpose: purpose.value,
    amount: Number(amount.value),
    type: type.value,
    date: date.value
  };

  transactions.push(transaction);
  saveData();
  render();
  form.reset();
});

function render(){
  list.innerHTML="";
  let income=0, expense=0, lent=0, borrowed=0;

  transactions
    .filter(t => filterType.value==="all" || t.type===filterType.value)
    .filter(t => t.person.toLowerCase().includes(search.value.toLowerCase()))
    .forEach(t=>{

      if(t.type==="income") income+=t.amount;
      if(t.type==="expense") expense+=t.amount;
      if(t.type==="lent") lent+=t.amount;
      if(t.type==="borrowed") borrowed+=t.amount;

      const row = `
        <tr>
          <td>${t.type}</td>
          <td>${t.person}</td>
          <td>${t.purpose}</td>
          <td>₹${t.amount}</td>
          <td>${t.date}</td>
          <td><button class="delete" onclick="deleteTrans(${t.id})">Delete</button></td>
        </tr>
      `;
      list.innerHTML += row;
    });

  const balance = income - expense - lent + borrowed;

  document.getElementById("balance").innerText=balance;
  document.getElementById("income").innerText=income;
  document.getElementById("expense").innerText=expense;
  document.getElementById("lent").innerText=lent;
  document.getElementById("borrowed").innerText=borrowed;
}

function deleteTrans(id){
  transactions = transactions.filter(t=>t.id!==id);
  saveData();
  render();
}

search.addEventListener("input",render);
filterType.addEventListener("change",render);

render();

function calculateReport(filterFunction) {
  let income=0, expense=0, lent=0, borrowed=0;

  transactions
    .filter(filterFunction)
    .forEach(t => {
      if(t.type==="income") income+=t.amount;
      if(t.type==="expense") expense+=t.amount;
      if(t.type==="lent") lent+=t.amount;
      if(t.type==="borrowed") borrowed+=t.amount;
    });

  const balance = income - expense - lent + borrowed;

  return {income, expense, lent, borrowed, balance};
}

function generateWeeklyReport(){
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate()-7);

  const report = calculateReport(t => {
    if(!t.date) return false;
    const d = new Date(t.date);
    return d >= weekAgo && d <= now;
  });

  showReport("Last 7 Days", report);
}

function generateMonthlyReport(){
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const report = calculateReport(t => {
    if(!t.date) return false;
    const d = new Date(t.date);
   return {expense, lent};
  });

  showReport("Current Month", report);
}

function showReport(title, data){
  const totalSpent = data.expense + data.lent;

  document.getElementById("reportContent").innerHTML = `
    <strong>${title}</strong><br><br>
    Total Expense: ₹${data.expense}<br>
    Total Udhaar Diya: ₹${data.lent}<br>
    <hr>
    <strong>Total Kharcha: ₹${totalSpent}</strong>
  `;
}