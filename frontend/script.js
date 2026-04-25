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
      const d = e.date ? new Date(e.date) : new Date();

      const formattedDate = d.toLocaleDateString("en-IN");
      const formattedTime = d.toLocaleTimeString("en-IN", {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Today logic
      const today = new Date();
      let label = formattedDate;

      if(today.toDateString() === d.toDateString()){
        label = "Today";
      }

      html += `
        <div class="expense-card">
          <p>💸 ${e.title} - ₹${e.amount}</p>
          <small>📅 ${label} | 🕒 ${formattedTime}</small>
        </div>
      `;
    });

    document.getElementById("list").innerHTML =
      html || "<p>No expenses yet</p>";

    document.getElementById("total").innerText = "₹" + total;

    const budget = Number(localStorage.getItem("budget")) || 0;

    document.getElementById("remaining").innerText =
      "₹" + (budget - total);

    if(total > budget){
      document.getElementById("alerts").innerText =
        "⚠ Budget exceeded!";
    } else {
      document.getElementById("alerts").innerText =
        "✔ Safe";
    }

    if(data.length > 0){
      renderCharts(data);
    }

    document.getElementById("emailDisplay").innerText =
      localStorage.getItem("email") || "Not logged";

    loadProfile();

    // 🔥 FIXED ML CALL
    setTimeout(() => {
      loadPrediction();
    }, 300);

  })
  .catch(err=>{
    console.log("LOAD ERROR:", err);
  });
}

/* ================= CHARTS ================= */
function renderCharts(data){

  const titles = data.map(e=>e.title);
  const amounts = data.map(e=>Number(e.amount));

  // 🔥 MONTHLY LOGIC
  const monthly = Array(12).fill(0);

  data.forEach(e=>{
    const d = e.date ? new Date(e.date) : new Date();
    const month = d.getMonth();
    monthly[month] += Number(e.amount);
  });

  // 🔵 PIE CHART
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

  // 🔵 BAR CHART
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

  // 🔥 NEW LINE CHART (MONTHLY)
  new Chart(document.getElementById("lineChart"), {
    type:"line",
    data:{
      labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets:[{
        label:"Monthly Expenses ₹",
        data:monthly,
        borderColor:"#ff758c",
        backgroundColor:"rgba(255,117,140,0.2)",
        fill:true
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

  if(sectionId === "profile"){
    loadProfile();
  }
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

/* ================= UPDATE BUDGET ================= */
function updateBudget(){
  const newBudget = document.getElementById("newBudget").value;

  if(!newBudget){
    showToast("Enter budget first ❌");
    return;
  }

  localStorage.setItem("budget", Number(newBudget));

  showToast("Budget updated 💖");

  // 🔥 reload dashboard data
  loadExpenses();
  loadProfile();
}


/* ================= LOAD PROFILE ================= */
function loadProfile(){

  const email = localStorage.getItem("email") || "Not set";
  const name = localStorage.getItem("name") || "User";
  const budget = Number(localStorage.getItem("budget")) || 0;

  document.getElementById("emailDisplay").innerText = email;
  document.getElementById("nameDisplay").innerText = name;

  // 🔥 show current budget
  document.getElementById("newBudget").value = budget;

  // 🔥 calculate remaining
  const totalText = document.getElementById("total").innerText || "₹0";
  const total = Number(totalText.replace("₹","")) || 0;

  document.getElementById("remainingProfile").innerText =
    "₹" + (budget - total);
}


/* ================= RESET BUDGET ================= */
function resetBudget(){
  localStorage.setItem("budget", 0);

  showToast("Budget reset 🔄");

  loadExpenses();
  loadProfile();
}


/* ================= RESET DATA ================= */
function resetData(){
  const userId = localStorage.getItem("userId");

  fetch(`${BASE}/expenses/reset/${userId}`, {
    method:"DELETE"
  })
  .then(()=>{
    showToast("All expenses deleted ❌");

    // 🔥 important: reload everything
    loadExpenses();
    loadProfile();
  });
}

function loadPrediction(){
  setTimeout(() => {

    fetch("http://localhost:8000/predict")
    .then(res=>res.json())
    .then(data=>{
      console.log("ML DATA:", data);

      const el = document.getElementById("prediction");

      if(el){
        el.innerText = "₹" + data.predicted_expense;
      } else {
        console.log("Prediction element not found ❌");
      }
    })
    .catch(err=>{
      console.log("ML ERROR:", err);
    });

  }, 500); // 🔥 delay
}