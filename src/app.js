const express=require("express")

const app=express();

app.use("/hello",(req,res)=>{
    res.send("Hello from hello")
})
app.use("/test",(req,res)=>{
    res.send("Hello from the test");
})
app.use((req,res)=>{
    res.send("Hello from ther server");
})
app.listen(3000,()=>{
    console.log("Server is listening on port number 3000..")
});