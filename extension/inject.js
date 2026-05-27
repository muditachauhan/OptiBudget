// 🔥 RUN INSIDE PAGE CONTEXT
const token = localStorage.getItem("token");

if (token) {
  window.postMessage({
    type: "FROM_PAGE_TOKEN",
    token: token
  }, "*");
}