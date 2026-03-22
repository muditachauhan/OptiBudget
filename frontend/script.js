const BASE = "http://localhost:5000/api";

/* NAVIGATION */
function goLogin(){ window.location="login.html"; }
function goRegister(){ window.location="register.html"; }

/* LOGIN */
function login(){
  fetch(`${BASE}/auth/login`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.token){
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("email", data.email);
      window.location="dashboard.html";
    } else alert("Login failed");
  });
}

/* REGISTER */
function register(){
  fetch(`${BASE}/auth/register`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(()=>{ alert("Registered!"); window.location="login.html"; });
}

/* LOGOUT */
function logout(){
  localStorage.clear();
  window.location="index.html";
}

/* ADD EXPENSE */
function addExpense(){
  const userId = localStorage.getItem("userId");

  fetch(`${BASE}/expenses`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      userId,
      title: document.getElementById("title").value,
      amount: document.getElementById("amount").value,
      category:"General"
    })
  }).then(()=> loadExpenses());
}

/* LOAD EXPENSES */
function loadExpenses(){
  const userId = localStorage.getItem("userId");

  fetch(`${BASE}/expenses/${userId}`)
  .then(res=>res.json())
  .then(data=>{
    let html="", total=0;

    data.forEach(e=>{
      total += Number(e.amount);
      html += `<p>${e.title} - ₹${e.amount}</p>`;
    });

    document.getElementById("list").innerHTML = html;
    document.getElementById("total").innerText = "₹"+total;

    document.getElementById("remaining").innerText =
      "₹" + (10000 - total);

    if(total > 5000){
      document.getElementById("alerts").innerHTML =
        "⚠ Budget exceeded!";
    }

    renderCharts(data);
  });
}

/* CHARTS */
function renderCharts(data){
  const titles = data.map(e=>e.title);
  const amounts = data.map(e=>Number(e.amount));

  new Chart(document.getElementById("pieChart"), {
    type:"pie",
    data:{
      labels:titles,
      datasets:[{ data:amounts }]
    }
  });

  new Chart(document.getElementById("barChart"), {
    type:"bar",
    data:{
      labels:titles,
      datasets:[{ data:amounts }]
    }
  });
}

/* AUTO LOAD */
if(window.location.href.includes("dashboard")){
  loadExpenses();
}