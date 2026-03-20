function addExpense() {
  let group = document.getElementById("group").value;
  let amount = document.getElementById("amount").value;

  fetch("http://127.0.0.1:5000/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ group, amount })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    document.getElementById("group").value = "";
    document.getElementById("amount").value = "";
  });
}