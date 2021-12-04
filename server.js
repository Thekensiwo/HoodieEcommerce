const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const schedule = require('node-schedule');
const {Product, Sale} = require('./Models.js')
const {auth} = require('./functions.js')
const router = require('./Router.js')


// Basic Middleware
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static('public'))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))



// Database Connection

const dburi = "mongodb://localhost:27017/shop";
mongoose.connect(dburi)
    .then(res => console.log("Connected to db"))
    .catch((err) => console.log(err))


    
// Choosing sale every 24 hours
schedule.scheduleJob('0 0 * * *', async function(){

    let mitems = await Product.find({gender: "male"})
    let fitems = await Product.find({gender: "female"})
    
    let mitems2 = [], fitems2 = [];
    let k = 0, j = 0;
    
    while(k < 2 && j < 2){
        let mrand = Math.floor(Math.random() * mitems.length)
        let frand = Math.floor(Math.random() * fitems.length)

        if(!mitems2.includes(mitems[mrand]) && k < 2){
            mitems2.push(mitems[mrand])
            k++;
        }
        
        if(!fitems2.includes(fitems[frand]) && j < 2){
            fitems2.push(fitems[frand])
            j++
        }
    }

    const upd = await Product.updateMany({salePrice: { $ne: null }}, {salePrice: undefined})
    const del = await Sale.deleteMany({})
    
    const newSale = new Sale({
        mitems: mitems2,
        fitems: fitems2
    })

    newSale.save().then(resp => console.log("added new sale"))

    const allitems = [...fitems2,...mitems2]
    allitems.forEach(async (item) =>{
        const prod = await Product.find({_id: item._id})
        const upd = await Product.updateOne({_id: item._id}, {isOnSale: true, salePrice: Math.floor(item.price * .8)})
    })
})



/* --- Routes --- */

app.use(auth)
app.use(router)
app.listen(process.env.PORT || 3000)