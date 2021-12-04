const express = require('express')
const jwt = require('jsonwebtoken')
const {ObjectID} = require('mongodb')
const bcrypt = require('bcrypt')
const upload = require('./storage.js')
const {Product, User, Order, Sale} = require('./Models.js')
const {generateCode, randomProd, getRevenue} = require('./functions.js')

const PRIVATE = "SRl@daes531lix50n"
const colors ={
    white: "eff2f7",
    black: "000000",
    blue: "1877f2",
    purple: "8f00ff"
}
const allColors = ["purple","white","black","blue"]
const allSizes = ["S","M","L","XL"]
let visits = 0;

const router = express.Router();

router.get('/', async (req, res) => {

    const newestMale = await Product.find({gender: "male"}).sort({date: 1}).limit(3)
    const newestFemale = await Product.find({gender: "female"}).sort({date: 1}).limit(3)
    const bestSellMale = await Product.find({gender: "male"}).sort({soldCount: -1}).limit(3)
    const bestSellFemale = await Product.find({gender: "female"}).sort({soldCount: -1}).limit(3)
    let sale = await Sale.find({})
    sale = sale[0]


    if(!req.cookies['visited']){
        visits++;
        res.cookie("visited","true",{httpOnly: true})
    }
    
    res.render('landing', { user: req.user, male: newestMale, female: newestFemale, bsMale: bestSellMale, bsFemale: bestSellFemale, sale})
})


router.get('/login', (req, res) => {
    res.render('login', { user: req.user })
})


router.get('/register', (req, res) => {
    res.render('register', { user: req.user })
})


router.get('/dashboard', async (req, res) => {

    if(req.user.permission == "admin"){
        const allUsers = await User.find({})
        const totalItems = await Product.find({})
        const lastOrders = await Order.find({}).limit(10)
        const {today,month,total} = await getRevenue()

        res.render('dashboard',
            {allUsers, totalUsers: allUsers.length, visits,
             totalItems: totalItems.length,lastOrders, today,month,total,
             firstN: req.user.name,
             lastN: req.user.lastName})
    }
    else{
        res.redirect('/')
    }
})



router.post('/addprod', upload.fields([{name: 'mainimg', maxCount: 1}, { name: 'sideimgs[]', maxCount: 5}]), async (req, res) =>{

    req.body.colours = req.body.colours.split(',')
    req.body.sizes = req.body.sizes.split(',')

    // Generate new code
    let newCode;

    while(true){

        newCode = generateCode()
        
        if(!await Product.findOne({code: newCode}))
            break
    }

    // Create main img and side imgs references
    const newPath = `${req.files['mainimg'][0].filename}`
    let sideImages = req.files['sideimgs[]']
    
    if(sideImages != undefined){
        sideImages = sideImages.map(img =>{
            return `${img.filename}`
        })
    }

    // Add new product
    const newProd = {
        ...req.body,
        date: new Date().getTime(),
        mainImg: newPath,
        sideImgs: sideImages,
        code: newCode,
        isBestSeller: false,
        salePrice: req.body.price
    }
    const prod = new Product(newProd);

    try{
        const saveProd = await prod.save()
        res.send(true)
    }
    catch(err){
        console.log("saving failed")
        res.send(false)
    }
})



router.get('/items', async (req, res) => {
    
    let page = req.query.page || null;
    let sizes = req.query.sizes || null;
    let colors = req.query.colors || null;
    let minPrice = req.query.minp || 0;
    let maxPrice = req.query.maxp || 10000;
    let gender = req.query.gender;
    let Items;


    /* --- Page --- */
    if(page == 0 || page == null)
        page = 1;


    /* --- Items --- */
    
    if(sizes != null)
        sizes = sizes.split(',')
    else
        sizes = allSizes
    
    if(colors != null)
        colors = colors.split(',')
    else
        colors = allColors
    
        
    try{
        Items = await Product.find({gender: gender})

        Items = Items.filter(i =>{

            let colorsn = 0;
            let sizesn = 0;

            colors.forEach(col =>{
                if(i.colours.includes(col))
                    colorsn++
            })

            sizes.forEach(siz =>{
                if(i.sizes.includes(siz))
                    sizesn++
            })

            if(colorsn > 0 && sizesn > 0 && i.price >= minPrice && i.price <= maxPrice){
                return true
            }
        })
    }
    catch(err){
        console.log(err)
    }

    // New Male items - contains up to 50 items on choosed page
    let newItems = []
    const prodStart = (page-1) * 50;

    // Get items for page (f.e if page == 2, then start from Items[50], and search 50 products up to Items[100])
    for(let i = prodStart; i < prodStart + 50; i++){
        if(Items[i] != undefined)
            newItems.push(Items[i])
    }

    const numOfProds = Items.length
    
    res.render('items', { user: req.user, newItems, numOfProds, currPage: page == null ? 1 : page, sizes, colors, minPrice, maxPrice, gender })
})





router.delete('/deleteitem', async (req,res) =>{

    const itemCode = req.query.code;
    const prod = await Product.deleteOne({code: itemCode});

    if(prod.deletedCount > 0)
        res.send(true)
    else
        res.send(false)
})





router.get('/searchItems', async (req, res) => {

    const val = req.query.val.toLowerCase();
    let items = await Product.find({})

    items = items.filter(item =>{
        return item.name.toLowerCase().indexOf(val) !== -1
    })
    
    res.json(items)
})



router.get('/item', async (req, res) => {

    try{
        const id = new ObjectID(req.query.id);
        const item = await Product.findOne({_id: id})
        const relatedItems = await randomProd(item.gender,item)
        
        res.render('item', { user: req.user, item, relatedItems })
    }
    catch(err){
        console.log(err)
    }
})



router.get('/order', (req, res) => {
    res.render('order', { user: req.user })
})



router.get('/lastOrders', async (req, res) => {

    const lOrders = await Order.find({userId: req.user.userId}).limit(5)

    res.render('lastOrders', { user: req.user, orders: lOrders })
})



router.get('/getcolors', (req, res) =>{
    
    res.json(colors)
})



router.post('/placeorder', async (req, res) =>{

    let cooks = req.cookies['cart'].split(',')
    let price = 0;

    const orderData = req.body;

    // Get array of products
    cooks = cooks.map(item =>{
        item = JSON.parse(Buffer.from(item,'base64').toString())
        price += parseFloat(item.price * item.quant);
        return item
    })
    
    // Create new order object and save it to db
    const newOrderInfo = {
        orderData,
        userId: req.user.userId,
        date: new Date().toISOString(),
        deliveryMethod: req.body.delivery_method,
        paymentMethod: req.body.payment_method,
        price,
        user: req.user,
        items: cooks
    }

    let newOrder = new Order(newOrderInfo)
    newOrder.save().then(res => console.log("\n\n\n ---- ORDER PLACED ---- \n"))


    // Increment soldCount on purchased items
    cooks.forEach(async (item,i) =>{

        const id = item.id
        const prod = await Product.findOne({_id: id})
        const actualSoldCount = parseInt(prod.soldCount);

        await Product.updateOne({_id: id}, {soldCount: actualSoldCount + (1  * parseInt(item.quant))})

        if(i == cooks.length - 1){
            const updateUser = await User.updateOne({_id: req.user.userId}, {$push: {history: newOrderInfo}})
    
            res.cookie("cart","",{maxAge: 0})
            res.render("orderDone",{order: newOrderInfo})
        }
    })
})



router.get('/toCart', async (req, res) => {
    
    const itemId = req.query.id;
    const size = req.query.size;
    const color = req.query.color;
    const price = req.query.price;
    const mainImg = req.query.mainImg;

    const item = {
        uId: `${new Date().getTime()}`,
        id: itemId,
        mainImg,
        size,
        color,
        price,
        quant: 1
    }

    const encoded = Buffer.from(JSON.stringify(item)).toString('base64')


    if(req.cookies['cart'] === undefined){
        res.cookie("cart",`${encoded}`).redirect(`/item?id=${itemId}`);
    }
    else if(req.cookies['cart'] !== undefined){
        res.cookie("cart",`${req.cookies['cart']},${encoded}`).redirect(`/item?id=${itemId}`);
    }
})


router.get("/getItem", async (req, res) => {
    
    const id = req.query.id;
    
    try{
        const item = await Product.findOne({_id: id});
        res.json(item)
    }
    catch(err){
        console.log("error:", err)
    }
})


router.get("/getItems", async (req, res) => {
    
    let {sizes, colors, gender} = req.query;
    
    sizes = sizes.split(',')
    colors = colors.split(',')

    if(colors[0] == '')
        colors = allColors
    if(sizes[0] == '')
        sizes = allSizes
    
    try{
        let items = await Product.find({gender});

        items = items.filter(i =>{

            let colorsn = 0;
            let sizesn = 0;

            colors.forEach(col =>{
                if(i.colours.includes(col))
                    colorsn++
            })

            sizes.forEach(siz =>{
                if(i.sizes.includes(siz))
                    sizesn++
            })

            if(colorsn > 0 && sizesn > 0){
                return true
            }
        })
        
        res.json(items).redirect(`/${gender}?sizes=${sizes}&colors=${colors}`)
    }
    catch(err){
        console.log(err)
    }
})


/* --- Login --- */

router.get('/logout', (req, res) => {

    if(req.user !== null){
        res.clearCookie("Auth-token").redirect('/')
    }
})

router.post('/login', async (req, res) => {

    const data = req.body;
    const exists = await User.find({ email: data.email })

    if (exists.length > 0) {
        if (await bcrypt.compare(data.password, exists[0].password)) {

            const token = jwt.sign({ id: exists[0]._id }, PRIVATE)
            res.cookie("Auth-token", token, { httpOnly: true }).redirect('/')
        }
        else
            res.render('login')
    }
    else
        res.render('login')
})

router.post('/register', async (req, res) => {

    const data = req.body;
    const users = await User.find({ email: data.email })

    if (users.length === 0) {

        // Hashing password
        data.password = await bcrypt.hash(data.password, 10)

        // Creating new user
        if(data.permission) data.permission = "user"
        const newUser = new User(data)

        // Adding date and permission to new user
        const d = data.date.split("-")
        const newDate = `${d[0]}-${d[1]}-${d[2]}`

        newUser.permission = "user"
        newUser.date = newDate;

        // Saving user
        newUser.save(newUser).then(res => {
            console.log(res)
        })

        // Sending token
        const token = jwt.sign({ id: newUser._id }, PRIVATE)
        res.cookie("Auth-token", token, { httpOnly: true }).redirect('/')
    }
})

module.exports = router;