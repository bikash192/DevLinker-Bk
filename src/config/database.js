const mongoose=require('mongoose');

const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://dashappy192:BikashProject@cluster0.tvnt2vh.mongodb.net/devLinkerDb");
}

// connectDB()

module.exports=connectDB;








