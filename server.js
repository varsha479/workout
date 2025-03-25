const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express();
app.use(express.json())

const port = process.env.PORT || 8000

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(()=>console.log(' MongoDB Connected Successfully'))
.catch((err)=>console.log(err))

app.get('/', (req,res)=>{
    console.log("MY API IS WORKING...")
    res.send("Bye..")
})



const workoutSchema = new mongoose.Schema({
    user : {
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required: true
    },
    date:{
        type:String,
        required:true
    },
    caliresburnt :{
        type:String,
        required:true
    }
    
})

const workout = mongoose.model("workout", workoutSchema)

app.post('/add', async (req,res)=>{
    const {user, date, caliresburnt, duration} = req.body

    if(!user || !date || !caliresburnt || !duration){
        return res.json({message : 'All fields are required'})
    }

    try {

        const workout = new workout({user, date, caliresburnt, duration})
        await workout.save()
        res.json(workout)
        

    } catch (error) {
        return res.json({message : error.message})
    }
})

app.get('/workout', async (req,res)=>{
    try {
        const workout = await workout.find({})
        res.json(workout);
    } catch (error) {
        return res.json({message : error.message})
    }
})

app.get('/getworkout/:id', async (req,res)=>{
    try {
        const {id} = req.params
        const myworkout = await workout.findById(id)
        res.status(200).json(myworkout)
    } catch (error) {
        return res.json({message :error.message})
    }
})


app.put('/updateworkout/:id', async (req,res)=>{
    try {
        const {id} = req.params
        const {user, duration, caliresburnt, date} = req.body

        const updatedworkout = await workout.findByIdAndUpdate(id, {user, date, duration, caliresburnt}, {new :true})

        if(!updatedworkout) return res.json({message : "workout Not Found"})
        
        res.status(200).json(updatedworkout);

    } catch (error) {
        return res.json({message : error.message})
    }
})

app.delete('/deleteworkout/:id', async (req,res)=>{
    try {
        const {id}  = req.params
        const deleteworkout = await workout.findByIdAndDelete(id)
        res.status(200).json({message : "User deleted Succesfully"})

    } catch (error) {
        return res.json({message: error.message})
    }
})

app.listen(port, (req,res)=>console.log(`Your app is running on http://localhost:${port}`))


