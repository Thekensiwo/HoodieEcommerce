import {parseCookies, rgbToHex, fullColorHex} from './functions.js'

(async function (){


// Get hex values for all avaiable colors

const res = await fetch('/getcolors')
let hexcolors = await res.json()


// Displaying items in cart
try{
(async function(){

const cartItems = document.querySelector('.cart-items')
const cart = parseCookies()

// If cart is empty
if(cart.length == 0){

    const p = document.createElement('p')
    p.innerHTML = "You don't have any items in the cart."

    document.querySelector('.total-cont').remove()
    document.querySelector('.btns').remove()
    document.querySelector('.discount-cont').remove()
    document.querySelector('h5').remove()
    
    cartItems.append(p)
}
else{
cart.forEach((item,i) =>{

    fetch(`/getItem?id=${item.id}`)
    .then(res => res.json())
    .then(data =>{
        
        // Create new div element and set attributes
        const div = document.createElement('div')

        div.setAttribute('class','cart-item')
        div.setAttribute('data-itemId',data._id.toString())
        div.setAttribute('data-itemUId',item.uId)
        div.setAttribute('data-colors',data.colours)
        div.setAttribute('data-sizes',data.sizes)

        // Create string containing all sizes and colors of the item to display them later
        let sizesOptionsStr = ""
        let colorsOptionsStr = ""

        data.colours.forEach(col =>{
            colorsOptionsStr += `<div class='item-color-option' style='background:#${hexcolors[col]}'></div>`
        })
        data.sizes.forEach(size =>{
            sizesOptionsStr += `<div class="item-size-option">${size}</div>`
        })


        if(data.name.length > 15)
            data.name = `${data.name.slice(0,10)}...`
    
        div.innerHTML = `
        <a class="item-img" href="/item?id=${data._id.toString()}">
            <img src="prodImgs/${data.mainImg}" alt="img" />
        </a>
        <a href="/item?id=${data._id.toString()}" title="${data.name}">${data.name}</a>
        <div class="price-changes-cont">
        
            <div class="item-price">${data.isOnSale ? data.salePrice : data.price}$</div>

            <div class="choosed-size-cont">
                <div class="choosed-size">${item.size}</div>
                <div class="item-sizes-choose off">
                    ${sizesOptionsStr}
                </div>
            </div>

            <div class="choosed-color-cont" style='background:#${hexcolors[item.color]}'>
                <div class="item-colors-choose off">
                    ${colorsOptionsStr}
                </div>
            </div>

        </div>
        <div class="quantity-cont">

            <div class="minus">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 10H24V14H0V10Z" fill="black"/>
                </svg>                        
            </div>

            <div class="quant-value">${item.quant}</div>
            
            <div class="plus">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 10H14V0H10V10H0V14H10V24H14V14H24V10Z" fill="black"/>
                </svg>
            </div>

            <div class="quant-select quantity-select-off">
                <a href="#">1</a>
                <a href="#">2</a>
                <a href="#">3</a>
                <a href="#">4</a>
                <a href="#">5</a>
                <a href="#">6</a>
                <a href="#">7</a>
                <a href="#">8</a>
                <a href="#">9</a>
            </div>
        </div>
        <div class="delete-item">
            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path
                        d="M14.6724 8.33294C14.3749 8.33294 14.1338 8.57406 14.1338 8.87158V19.0519C14.1338 19.3492 14.3749 19.5905 14.6724 19.5905C14.9699 19.5905 15.2111 19.3492 15.2111 19.0519V8.87158C15.2111 8.57406 14.9699 8.33294 14.6724 8.33294Z"
                        fill="#6D7074" />
                    <path
                        d="M8.31647 8.33294C8.01896 8.33294 7.77783 8.57406 7.77783 8.87158V19.0519C7.77783 19.3492 8.01896 19.5905 8.31647 19.5905C8.61399 19.5905 8.85511 19.3492 8.85511 19.0519V8.87158C8.85511 8.57406 8.61399 8.33294 8.31647 8.33294Z"
                        fill="#6D7074" />
                    <path
                        d="M3.68412 6.84724V20.1182C3.68412 20.9026 3.97175 21.6392 4.4742 22.1678C4.97433 22.6978 5.67036 22.9987 6.39878 22.9999H16.59C17.3186 22.9987 18.0147 22.6978 18.5146 22.1678C19.017 21.6392 19.3047 20.9026 19.3047 20.1182V6.84724C20.3035 6.58213 20.9507 5.61721 20.8171 4.59232C20.6833 3.56764 19.8103 2.80113 18.7768 2.80092H16.019V2.12762C16.0221 1.56142 15.7983 1.01773 15.3974 0.617743C14.9966 0.217972 14.4521 -0.00463827 13.8859 -9.33576e-06H9.10292C8.53672 -0.00463827 7.99219 0.217972 7.59136 0.617743C7.19054 1.01773 6.96667 1.56142 6.96982 2.12762V2.80092H4.21203C3.17852 2.80113 2.30554 3.56764 2.17172 4.59232C2.03811 5.61721 2.68532 6.58213 3.68412 6.84724ZM16.59 21.9226H6.39878C5.47783 21.9226 4.7614 21.1315 4.7614 20.1182V6.89458H18.2274V20.1182C18.2274 21.1315 17.511 21.9226 16.59 21.9226ZM8.0471 2.12762C8.04353 1.84715 8.15378 1.5772 8.35282 1.3792C8.55166 1.18121 8.82224 1.07243 9.10292 1.07727H13.8859C14.1666 1.07243 14.4371 1.18121 14.636 1.3792C14.835 1.57699 14.9453 1.84715 14.9417 2.12762V2.80092H8.0471V2.12762ZM4.21203 3.8782H18.7768C19.3122 3.8782 19.7463 4.31227 19.7463 4.84775C19.7463 5.38323 19.3122 5.8173 18.7768 5.8173H4.21203C3.67655 5.8173 3.24248 5.38323 3.24248 4.84775C3.24248 4.31227 3.67655 3.8782 4.21203 3.8782Z"
                        fill="#6D7074" />
                    <path
                        d="M11.4947 8.33294C11.1972 8.33294 10.9561 8.57406 10.9561 8.87158V19.0519C10.9561 19.3492 11.1972 19.5905 11.4947 19.5905C11.7922 19.5905 12.0333 19.3492 12.0333 19.0519V8.87158C12.0333 8.57406 11.7922 8.33294 11.4947 8.33294Z"
                        fill="#6D7074" />
                </g>
                <defs>
                    <clipPath id="clip0">
                        <rect width="23" height="23" fill="white" />
                    </clipPath>
                </defs>
            </svg>

        </div>
        `

        cartItems.append(div)
    })
})
}
})()
}
catch(err){
    console.log("error: ", err);
    console.log("cart empty")
}








/* --- Quantity control and deleting item --- */

setTimeout(() =>{

    const quantities = document.querySelectorAll('.quant-value') || null

    // if (quantities.length > 0 && quantities !== null) {
    if (quantities !== null) {
        
        
        /* -- Quantity dropdown -- */
        
        quantities.forEach(quant => {
            quant.addEventListener('click', e => {
                
                // Turn on/off clicked dropdown list
                const select = quant.parentElement.childNodes[7];
                select.classList.toggle('quantity-select-off')
                quant.parentElement.classList.toggle('quant-cont-border')

                // Turn off every other dropdown list
                quantities.forEach(quant2 =>{
                    
                    const select = quant2.parentElement.childNodes[7];
                    
                    if(quant2 != quant && !select.classList.contains('quantity-select-off')){
                        select.classList.add('quantity-select-off')
                        select.parentElement.classList.remove('quant-cont-border')
                    }
                })
            })
        })

        
        /* --- Clicking on quantity dropdown numbers --- */
        const quantSelects = document.querySelectorAll('.quant-select')

        quantSelects.forEach(sel =>{

            // Quantity dropdown numbers
            let nums = [...sel.childNodes].filter(item => item.localName == "a");

            // Quantity value
            const val = sel.parentElement.childNodes[3]

            nums.forEach(num =>{
                num.addEventListener('click', e =>{

                    val.innerHTML = num.innerHTML;
                    sel.classList.toggle('quantity-select-off')
                })
            })
        })


        
        /* --- Quantity btns --- */
        
        const min = document.querySelectorAll('.minus')
        const plus = document.querySelectorAll('.plus')

        min.forEach(m =>{
            
            // Item quantity
            const quant = m.parentElement.childNodes[3];

            m.addEventListener('click', e =>{

                const val = parseInt(quant.innerHTML);
                if(val > 1){
                    quant.innerHTML = val - 1;
                    updateCookies(quant,quant.innerHTML,"num")
                }
            })
        })

        plus.forEach(p =>{

            // Item quantity
            const quant = p.parentElement.childNodes[3];

            p.addEventListener('click', e =>{

                const val = parseInt(quant.innerHTML);
                if(val < 9){
                    quant.innerHTML = val + 1;
                    updateCookies(quant,quant.innerHTML,"num")
                }
            })
        })

        function updateCookies(item,value,type){

            const itemCont = item.parentElement.parentElement;
            const cookies = parseCookies()
        
            if(type == "color"){
                
                const keys = Object.keys(hexcolors)
                
                // Get the name of hex color
                for(let key of keys){
                    if(hexcolors[key] == value){
                        value = key
                        break
                    }
                }
                
                // Search for item in cookies and change its color
                for(let cok of cookies){
                    if(cok.uId == itemCont.dataset.itemuid){
                        cok.color = value;
                        break
                    }
                }
            }
            else if(type == "size"){
                
                for(let cok of cookies){
                    if(cok.uId == itemCont.dataset.itemuid){
                        cok.size = value;
                        break
                    }
                }
            }
            else if(type == "num"){
                for(let cok of cookies){
                    if(cok.uId == itemCont.dataset.itemuid){
                        cok.quant = parseInt(value)
                        break
                    }
                }
            }
            // Save to cookies
            let str = ""
            cookies.forEach(cok =>{
                str += btoa(JSON.stringify(cok)) + '%2C'
            })
        
            // Cut of last %2C
            str = str.slice(0,str.length-3)
            document.cookie = `cart=${str}`
        }

        
        /* --- Delete --- */
        const deleteBtns = document.querySelectorAll('.delete-item');

        deleteBtns.forEach(item =>{
            item.addEventListener('click', e =>{

                // Get item id
                const itemUId = item.parentElement.dataset.itemuid;

                // Get cart from cookies
                let newCartCookies = parseCookies()
                let iterate = true;


                newCartCookies.forEach((item,i) =>{
                    if(item.uId == itemUId && iterate){
                        newCartCookies.splice(i,1)
                        iterate = false;
                        return
                    }
                })

                // Encode objects to Base64 string
                let str = ""
                newCartCookies.forEach(item =>{
                    str += btoa(JSON.stringify(item)) + '%2C'
                })

                // Cut off last comma
                str = str.slice(0,str.length-3)

                // Save new cart without deleted items to cookies and delete it from DOM
                document.cookie = `cart=${str}`
                item.parentElement.remove()

                // If number of items == 0 then delete cart-total and cart-btns
                if(parseCookies().length == 0){
                    document.querySelector('.cart-total-cont').remove()
                    document.querySelector('.cart-btns').remove()
                }
            })
        })

        /* --- Delete all --- */

        const deleteAll = document.querySelector('.delete') || null

        if(deleteAll != null){
            deleteAll.addEventListener('click', e =>{
                document.cookie = 'cart=; Max-Age=0; path=/; domain=' + location.hostname;
                window.location.reload()
            })
        }


        /* --- Changing color and size --- */


        // Changing size
        const colorChangers = document.querySelectorAll('.choosed-color-cont')
        const sizeChangers = document.querySelectorAll('.choosed-size-cont')

        sizeChangers.forEach(item =>{
            item.addEventListener('click', e =>{

                // Get item's sizes container
                const sizesToChooseCont = item.childNodes[3]

                // Get item's sizes
                let sizesToChoose = [...sizesToChooseCont.childNodes]
                sizesToChoose = sizesToChoose.filter(s => {return s.nodeName != "#text"})

                // Show item's sizes container
                const actualSize = item.childNodes[1]
                sizesToChooseCont.classList.toggle('off')

                // On click of one of the sizes, change item's size to it and update cookies
                sizesToChoose.forEach(size =>{
                    size.addEventListener('click', e =>{
                        actualSize.innerHTML = size.innerHTML;
                        updateCookies(item,size.innerHTML,"size")
                    })
                })

            })
        })


        // Changing color
        colorChangers.forEach(item =>{
            item.addEventListener('click', e =>{

                // container of item's colors
                const colorsToChooseCont = item.childNodes[1]

                // item's colors
                let colorsToChoose = [...colorsToChooseCont.childNodes]
                colorsToChoose = colorsToChoose.filter(s => {return s.nodeName != "#text"})
                
                // show container of item's colors
                colorsToChooseCont.classList.toggle('off')

                // after click on one of item's colors, change the item's color to clicked color
                colorsToChoose.forEach(color =>{
                    color.addEventListener('click', e =>{
                        
                        // Get rgb value, Slice non numbers, delete white spaces and split with ,
                        let parsedRgb = window.getComputedStyle(color).backgroundColor
                        parsedRgb = parsedRgb.slice(4,parsedRgb.length-1).replace(/\s/g, "").split(',')
                        
                        // Get hex number
                        parsedRgb = fullColorHex(...parsedRgb)
                        
                        // Set item's color to clicked color and update cookies
                        item.style.backgroundColor = `#${parsedRgb}`
                        item.dataset.bcolor = `${parsedRgb}`
                        updateCookies(item,parsedRgb,"color")
                    })
                })

            })
        })
    }

},500)


// Change cart modal depending on number of cart items
const cartLength = parseCookies()

if(!cartLength.length > 0){

    const totals = document.querySelector('.cart-total-cont') || null
    const cartBtns = document.querySelector('.cart-btns') || null

    if(totals != null){
        totals.remove()
        cartBtns.remove()
    }
}
if(cartLength.length > 3){
    
    const needHelp = document.querySelector('.cart-help') || null

    if(needHelp != null){
        needHelp.remove()
    }
}
if(cartLength.length > 4){
    document.querySelector('.cart-items').classList.add('cartItems-restricted')
}
})()