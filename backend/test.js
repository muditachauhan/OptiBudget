const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:admin123@cluster0.phvyd4f.mongodb.net/optibudget?retryWrites=true&w=majority")
.then(() => {
    console.log("✅ TEST SUCCESS - Mongo Connected");
})
.catch(err => {
    console.log("❌ TEST FAILED", err);
});