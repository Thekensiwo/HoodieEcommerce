const navItems = document.querySelectorAll('.item-info-nav a')
const navUnderline = document.querySelector('.nav-underline')
const navDesc = document.querySelector('.nav-desc')
const desc = document.querySelector('.desc')
const delivery = document.querySelector('.delivery')
const returns = document.querySelector('.returns')
const price = document.querySelector('.item-price').dataset.price



/* --- Item Details Nav --- */

navUnderline.style.width = `${navDesc.offsetWidth}px`
navUnderline.style.left = `${navDesc.offsetLeft}px`

navItems.forEach(item => {

    item.addEventListener('click', e => {

        // Move underline
        navUnderline.style.width = `${e.target.offsetWidth}px`
        navUnderline.style.left = `${e.target.offsetLeft}px`

        // Change Font Color
        navItems.forEach(i => { i.style.color = '#EFF2F7' })
        item.style.color = '#1877F2'

        // Show Content
        if (e.target.dataset.type == "Delivery") {
            returns.style.display = 'none'
            desc.style.display = 'none'
            delivery.style.display = 'block'
        }
        if (e.target.dataset.type == "Returns") {
            delivery.style.display = 'none'
            desc.style.display = 'none'
            returns.style.display = 'block'
        }
        if (e.target.dataset.type == "Description") {
            returns.style.display = 'none'
            delivery.style.display = 'none'
            desc.style.display = 'block'
        }
    })
})


/* --- Slider --- */
const track = document.querySelector('.track')
const slider = document.querySelector('.slider')
const arrows = document.querySelectorAll('.track-btn')

var isTouchDevice = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement);

if (isTouchDevice) {

    track.style.overflowX = `auto`
    arrows.forEach(arr => { arr.classList.add('arr-hidden') })
}
else {

    track.style.overflow = `hidden`
    arrows.forEach(arr => { arr.classList.remove('arr-hidden') })

    let slider = tns({
        container: '.slider',
        slideItems: document.querySelectorAll('.item'),
        items: 6,
        nav: false,
        prevButton: '.left',
        nextButton: '.right',
        loop: true,
        slideBy: 2
    })
}



/* --- Colors --- */

const colors = document.querySelectorAll('.color-cont')
const sizes = document.querySelectorAll('.size-cont')
let activeColor, activeSize;


// Choosing color / size
function toggling(elems, type){

    elems.forEach(elem =>{
        elem.addEventListener('click', e =>{
    
            // Reset previous actives
            elems.forEach(elem2 =>{
                if(elem2.classList.contains('active-option') && elem2 != elem){
                    
                    elem2.classList.remove('active-option');

                    if(type == "sizes")
                        elem2.classList.remove('active-color')
                }
            })
    
            // Add active class to clicked element
            if(!elem.classList.contains('sizeOff'))
                elem.classList.toggle('active-option');
                        
            // Set active color/size

            if(type == "colors"){

                if(elem.dataset.color == activeColor)
                    activeColor = null
                else
                    activeColor = elem.dataset.color;
            }
            else if(type == "sizes" && !elem.classList.contains('sizeOff')){
                elem.classList.toggle('active-color')

                if(elem.dataset.size == activeSize)
                    activeSize = null
                else
                    activeSize = elem.dataset.size;
            }
        })
    })
}



toggling(colors, "colors")
toggling(sizes, "sizes")








/* --- Side Imgs --- */

const sideImgs = document.querySelectorAll('.item-img img')
const mainImg = document.querySelector('.main-img-cont img')

sideImgs.forEach(item =>{
    item.addEventListener('click', e =>{
        
        mainImg.src = e.target.src;

        sideImgs.forEach(item2 =>{

            if(item2.classList.contains('active-img') && item2 != item)
                item2.classList.remove('active-img');
        })

        item.classList.add('active-img')
    })
})




/* --- Add item to cart --- */

const addItem = document.querySelector('.addToCart-Btn')

addItem.addEventListener('click', e =>{

    if(activeColor != undefined && activeSize != undefined){
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        let mainImg = document.querySelector('.mainimg').src
        mainImg = mainImg.slice(mainImg.indexOf("prodImgs"))

        document.location = `/toCart?id=${params.id}&size=${activeSize}&color=${activeColor}&price=${price}&mainImg=${mainImg}`
    }
})