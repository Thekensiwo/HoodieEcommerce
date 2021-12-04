const jwt = require('jsonwebtoken')
const {Product, User, Order} = require('./Models.js')

const PRIVATE = "SRl@daes531lix50n"


// Authorization function
async function auth(req, res, next) {

    const token = req.cookies['Auth-token'] || null;
    req.user = null;

    try {

        if (token != null) {

            const verifiedToken = jwt.verify(token, PRIVATE)
            const user = await User.find({ _id: verifiedToken.id })

            if (user.length > 0) {

                const verifiedUser = {
                    userId: user[0]._id,
                    name: user[0].name,
                    lastName: user[0].lastName,
                    date: user[0].date,
                    email: user[0].email,
                    history: user[0].history,
                    permission: user[0].permission
                }

                req.user = verifiedUser;
            }
        }
    }
    catch (err) {
        console.log("err:", err)
    }

    next()
}





// Random product
async function randomProd(gender,item){

    const prods = await Product.find({gender: gender})
    const count = prods.length;
    const items = []

    while(items.length < 9){

        const random = Math.floor(Math.random() * count)
        
        if(!items.includes(prods[random]) && prods[random]._id.toString() != item._id.toString())
            items.push(prods[random])
    }

    
    return items
}






function generateCode(){

    let newCode = []
    const chars = 'QWERTYUIOPASDFGHJKLZXCVBNM'
    const nums = '1234567890'

    // Add letters
    for(let i = 0; i < 4; i++){
        const random = Math.round(Math.random() * chars.length)
        newCode.push(chars[random])
    }

    // Add -
    newCode.push('-')

    // Add numbers
    for(let i = 0; i < 3; i++){
        const random = Math.round(Math.random() * nums.length)
        newCode.push(nums[random])
    }

    newCode = newCode.join('')
    return newCode
}


async function getRevenue(){

    const income = await Order.find({})
    let today = 0, month = 0, total = 0;

    income.forEach(inc =>{
        
        total += inc.price

        const date = new Date(inc.date)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        
        // Day
        if(diff < 86400000){
            today += inc.price;
        }
        // Month
        if(diff < 2629800000){
            month += inc.price
        }
    })

    return {today,month,total}
}



module.exports = {
    generateCode,
    randomProd,
    auth,
    getRevenue
}