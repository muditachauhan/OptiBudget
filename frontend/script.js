const BASE = "http://localhost:5000/api";

function showToast(message){
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(()=>{
    toast.classList.remove("show");
  }, 2500);
}

/* ================= NAVIGATION ================= */
function goLogin(){ window.location="login.html"; }
function goRegister(){ window.location="register.html"; }

/* ================= LOGIN ================= */

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

      showToast("Login Successful 🎉");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("email", data.email);
      localStorage.setItem("budget", data.budget || 10000);

      setTimeout(()=>{
        window.location="dashboard.html";
      },1000);

    } else {
      showToast("Invalid Email or Password ❌");
    }
  });
}

/* ================= REGISTER ================= */


function register(){

  fetch(`${BASE}/auth/register`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      budget: document.getElementById("budget").value
    })
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.error){
      showToast("User already exists ❌");
    } else {
      showToast("Registered Successfully 🎉");

      setTimeout(()=>{
        window.location="login.html";
      },1000);
    }
  });
}

/* ================= LOGOUT ================= */
function logout(){
  localStorage.clear();
  window.location="index.html";
}

/* ================= ADD EXPENSE ================= */
function addExpense(){
  const userId = localStorage.getItem("userId");

  if(!userId){
    alert("Please login first");
    return;
  }

  fetch(`${BASE}/expenses`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      userId,
      title: document.getElementById("title").value,
      amount: document.getElementById("amount").value,
      category:"General"
    })
  })
  .then(()=>{
    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    loadExpenses();
  })
  .catch(err=>{
    console.log("ADD ERROR:", err);
  });
}

/* ================= LOAD EXPENSES ================= */
function loadExpenses(){
  const userId = localStorage.getItem("userId");

  if(!userId){
    console.log("User not logged in ❌");
    return;
  }

  fetch(`${BASE}/expenses/${userId}`)
  .then(res=>res.json())
  .then(data=>{
    console.log("EXPENSE DATA:", data);

    let html = "", total = 0;

    data.forEach(e=>{
      total += Number(e.amount);
      html += `<p>💸 ${e.title} - ₹${e.amount}</p>`;
    });

    document.getElementById("list").innerHTML =
      html || "<p>No expenses yet</p>";

    document.getElementById("total").innerText = "₹" + total;

    // 🔥 Budget system
    const budget = Number(localStorage.getItem("budget")) || 10000;

    document.getElementById("remaining").innerText =
      "₹" + (budget - total);

    // 🔔 Alerts
    if(total > budget){
      document.getElementById("alerts").innerText =
        "⚠ Budget exceeded!";
    } else {
      document.getElementById("alerts").innerText =
        "✔ Safe";
    }

    // 📊 Charts only if data exists
    if(data.length > 0){
      renderCharts(data);
    }

    // 👤 Profile
    document.getElementById("emailDisplay").innerText =
      localStorage.getItem("email") || "Not logged";

    document.getElementById("budgetDisplay").innerText =
      budget;

  })
  .catch(err=>{
    console.log("LOAD ERROR:", err);
  });
}

/* ================= CHARTS ================= */
function renderCharts(data){
  const titles = data.map(e=>e.title);
  const amounts = data.map(e=>Number(e.amount));

  // Clear previous charts (important fix)
  document.getElementById("pieChart").innerHTML = "";
  document.getElementById("barChart").innerHTML = "";

  new Chart(document.getElementById("pieChart"), {
    type:"pie",
    data:{
      labels:titles,
      datasets:[{
        data:amounts,
        backgroundColor:[
          "#ff6384","#36a2eb","#ffce56","#4bc0c0","#9966ff"
        ]
      }]
    }
  });

  new Chart(document.getElementById("barChart"), {
    type:"bar",
    data:{
      labels:titles,
      datasets:[{
        data:amounts,
        backgroundColor:"#36a2eb"
      }]
    }
  });
}

/* ================= AUTO LOAD ================= */
if(window.location.href.includes("dashboard")){
  loadExpenses();
}

/* ================= SIDEBAR ================= */
function showSection(sectionId){
  document.querySelectorAll(".section").forEach(sec=>{
    sec.style.display="none";
  });

  document.getElementById(sectionId).style.display="block";
}

function checkPassword(){
  const pass = document.getElementById("password").value;
  const strength = document.getElementById("strength");

  if(pass.length < 6){
    strength.innerText = "Weak 😢";
    strength.style.color = "red";
  }
  else if(pass.match(/[A-Z]/) && pass.match(/[0-9]/)){
    strength.innerText = "Strong 💪";
    strength.style.color = "green";
  }
  else{
    strength.innerText = "Medium 🙂";
    strength.style.color = "orange";
  }
}