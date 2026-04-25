console.log("OptiBudget Extension Running 🚀");

setTimeout(() => {

  const priceElement = document.querySelector(".a-price-whole");

  if(!priceElement){
    console.log("❌ Price not found");
    return;
  }

  const price = priceElement.innerText.replace(",", "");

  console.log("💰 Price Detected:", price);

  // 🔥 BUTTON CREATE
  const btn = document.createElement("button");
  btn.innerText = "Add to OptiBudget 💰";

  btn.style.position = "fixed";
  btn.style.top = "120px";
  btn.style.right = "20px";
  btn.style.padding = "10px 15px";
  btn.style.background = "#ff758c";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "8px";
  btn.style.zIndex = "9999";
  btn.style.cursor = "pointer";

  // 🔥 CLICK EVENT
  btn.onclick = () => {
    sendToBackend(price);
  };

  document.body.appendChild(btn);

}, 3000);


// 🔥 FUNCTION TO SEND DATA
function sendToBackend(price){

  chrome.storage.local.get(["token"], function(result) {

    const token = result.token;

    if(!token){
      alert("❌ Please login first");
      return;
    }

    fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({
        title: "Online Shopping",
        amount: Number(price),
        category: "Shopping"
      })
    })
    .then(res => res.json())
    .then(data => {
      alert("✅ Added to OptiBudget!");
    });
  });

  if(!token){
    alert("❌ Please login first");
    return;
  }

  fetch("http://localhost:5000/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      title: "Online Shopping",
      amount: Number(price),
      category: "Shopping"
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Added to OptiBudget!");
  })
  .catch(err => {
    console.log("ERROR:", err);
  });

}