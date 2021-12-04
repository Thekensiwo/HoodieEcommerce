const mongoose = require('mongoose')

/* -- Schemas -- */

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    date: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    history: { type: Array, default: [] },
    permission: { type: String, required: true }
})

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Number},
    price: { type: Number, required: true },
    colours: { type: Array, required: true },
    sizes: { type: Array, required: true },
    mainImg: { type: String, required: true },
    sideImgs: { type: Array, required: true },
    description: { type: String },
    code: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    isBestSeller: { type: Boolean, required: true },
    isOnSale: { type: Boolean, required: false},
    salePrice: { type: Number, required: false, default: null },
    soldCount: {type: Number, default: 0}
})

const ordersSchema = new mongoose.Schema({
    orderData: {type: Object, required: true},
    userId: { type: String, required: true},
    date: { type: String, required: true},
    deliveryMethod: { type: String, required: true},
    paymentMethod: { type: String, required: true},
    price: { type: Number, required: true},
    user: {type: Object, required: true},
    items: { type: Array, required: true}
})

const saleSchema = new mongoose.Schema({
    mitems: {type: Array},
    fitems: {type: Array}
})



/* -- Models -- */

const Product = mongoose.model("products", productSchema)
const User = mongoose.model("users", userSchema)
const Order = mongoose.model("orders", ordersSchema)
const Sale = mongoose.model("sales", saleSchema)


module.exports = {
    Product,
    User,
    Order,
    Sale
}