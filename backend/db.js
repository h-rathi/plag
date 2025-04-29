const mongoose=require('mongoose');

const run= async ()=>{
     await mongoose.connect('mongodb+srv://thehimanshurathi:thehimanshurathi@cluster0.skfs9.mongodb.net/')
     console.log("connected")
}
module.exports=run;
