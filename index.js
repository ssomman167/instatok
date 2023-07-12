const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const app=express()
require("dotenv").config()
app.use(express.json())
app.use(express.text())
app.use(cors())
const authRoute=require("./routes/authRoutes")
const postRoute=require("./routes/postRoutes")

const connection=async ()=>{ 
    try{
     await mongoose.connect(process.env.MONGO_URI)
     console.log("connected")
    }
    catch(err){
        console.log(err)
    }
}
app.get("/",(req,res)=>{
    res.send("Welcome to HomePage")
})
app.post('/refresh-token', async (req, res) => {
    const refreshToken = req.body.refreshToken;
  
    // Check if the refresh token exists
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }
  
    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, 'refreshSecretKey');
  
      // Generate a new access token
      const accessToken = jwt.sign({ userId: decoded.userId }, 'secretKey', { expiresIn: '1h' });
  
      return res.status(200).json({ token: accessToken });
    } catch (error) {
      console.error('Error refreshing token:', error);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  });
  
app.use("/user",authRoute)
app.use("/post",postRoute)

app.listen(process.env.PORT,()=>{
    connection()
    console.log(process.env.PORT)
})

