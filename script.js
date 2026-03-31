let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = null;

// ADD
$("#expenseForm").submit(function(e){
  e.preventDefault();

  let expense = {
    desc: $("#desc").val(),
    amount: Number($("#amount").val()),
    category: $("#category").val(),
    date: $("#date").val()
  };

  if(editIndex === null){
    expenses.push(expense);
  } else {
    expenses[editIndex] = expense;
    editIndex = null;
  }

  localStorage.setItem("expenses", JSON.stringify(expenses));
  this.reset();
  display();
});

// DISPLAY
function display(){
  let table = $("#expenseTable");
  table.html("");
  let total = 0;

  let filter = $("#filter").val();

  expenses.forEach((exp,i)=>{
    if(filter !== "All" && exp.category !== filter) return;

    total += exp.amount;

    table.append(`
      <tr>
        <td>${exp.desc}</td>
        <td>₹${exp.amount}</td>
        <td>${exp.category}</td>
        <td>${exp.date}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="edit(${i})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="remove(${i})">Delete</button>
        </td>
      </tr>
    `);
  });

  $("#total").text(total);

  updateCharts();
}

// DELETE
function remove(i){
  expenses.splice(i,1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  display();
}

// EDIT
function edit(i){
  let e = expenses[i];
  $("#desc").val(e.desc);
  $("#amount").val(e.amount);
  $("#category").val(e.category);
  $("#date").val(e.date);
  editIndex = i;
}

// FILTER
$("#filter").change(display);

// THEME
$("#toggleTheme").click(()=>{
  $("body").toggleClass("light-mode");
});

// CHARTS
let pie, bar;

function updateCharts(){
  let categories = {};
  
  expenses.forEach(e=>{
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });

  let labels = Object.keys(categories);
  let data = Object.values(categories);

  if(pie) pie.destroy();
  if(bar) bar.destroy();

  pie = new Chart(document.getElementById("pieChart"), {
    type: 'pie',
    data: { labels, datasets: [{ data }] }
  });

  bar = new Chart(document.getElementById("barChart"), {
    type: 'bar',
    data: { labels, datasets: [{ data }] }
  });
}

// PDF EXPORT
function downloadPDF(){
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  doc.text("Expense Report", 20, 20);

  let y = 30;
  expenses.forEach(e=>{
    doc.text(`${e.desc} - ₹${e.amount} (${e.category})`, 20, y);
    y += 10;
  });

  doc.save("expenses.pdf");
}

// INIT
display();