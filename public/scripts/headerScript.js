const iconConts = document.querySelectorAll('.icon-cont')
const modals = document.querySelectorAll('.modal')
const modalBg = document.querySelector('.modal-bg')
const cartModal = document.querySelector('.cart-modal')
const searchModal = document.querySelector('.search-modal')
const userModal = document.querySelector('.user-modal')
const burgerModal = document.querySelector('.burger-modal')
const notLoggedIn = document.querySelector('.user-modal-notLogged') || undefined;
const touchDevice = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement);


// Opening destop modals when clicking on icon
iconConts.forEach(cont => {
    cont.addEventListener('click', e => {

        // If user not logged in, show login/register mini container
        if(cont.dataset.type == "user" && notLoggedIn != undefined){
            notLoggedIn.classList.toggle('notLogged-off')
            return;
        }

        // Show modal
        modals.forEach(modal => {
            if (modal.classList.contains(cont.dataset.type)) {
                modal.classList.toggle('modal-on')
                modalBg.classList.add('modal-bg-toggle')
                return;
            }
        })
    })
})





/* --- Exiting Modal when clicking on modalBg --- */

modalBg.addEventListener('click', e => {

    modals.forEach(modal => {
        if (modal.classList.contains('modal-on')){
            modal.classList.remove('modal-on')
        }
    })

    modalBg.classList.remove('modal-bg-toggle')

    if (burgerModal.classList.contains('modal-on'))
        burgerModal.classList.remove('modal-on')
})




/* --- Burger --- */

const burger = document.querySelector('.burger')

burger.addEventListener('click', e => {

    burgerModal.classList.add('modal-on')
    modalBg.classList.add('modal-bg-toggle')
    burgerModal.classList.remove('modal-hidden')
})



/* --- Burger Modal Mobile --- */

let start = 0, curr = 0, moving = false;
let currentModal = null;

function slideStart(e){

    if (e.target.classList.contains('modal-content')) {
        start = e.touches[0].clientX

        const target = `${e.srcElement.classList[0]}`
        currentModal = document.querySelector("." + target)
        
        moving = true
    }
}

function slideMove(e){
    if (moving)
        curr = e.touches[0].clientX
}

function slideEnd(e){
    if (curr > start) {
        currentModal.classList.add('modal-hidden')
        currentModal.classList.remove('modal-on')
        modalBg.classList.remove('modal-bg-toggle')

        curr = 0;
        start = 0;

        if(e.target.classList[0] == "user-modal"){
            burgerModal.classList.add('modal-hidden')
            burgerModal.classList.remove('modal-on')
        }
    }

    moving = false
}

burgerModal.addEventListener('touchstart', slideStart)
burgerModal.addEventListener('touchmove', slideMove)
burgerModal.addEventListener('touchend', slideEnd)

if(touchDevice){
    userModal.addEventListener('touchstart', slideStart)
    userModal.addEventListener('touchmove', slideMove)
    userModal.addEventListener('touchend', slideEnd)
}



// Burger modal options

const accountInfo = document.querySelector('.account-info-link')

accountInfo.addEventListener('click', e =>{
    userModal.classList.toggle('modal-on')
    userModal.classList.remove('modal-hidden')
    userModal.classList.add('modal-on')
    modalBg.classList.add('modal-bg-toggle')
})




/* --- Search --- */

// Mobile Search button
const mobileSearchBtn = document.querySelector('.search-link')

mobileSearchBtn.addEventListener('click', e =>{
    burgerModal.classList.remove('modal-on') 
    searchModal.classList.add('modal-on') 
})

const searchInp = document.querySelector('.searchInp')
const results = document.querySelector('.search-results')
let loadingAnim = document.querySelector('.loader')

let x = false, tim = null;

searchInp.addEventListener('input', e =>{


    // If value isn't typed for 1500ms, then search
    loadingAnim.classList.remove('loader-off')
    const val = searchInp.value;
    
    if(tim != null) clearInterval(tim)    
    

    tim = setTimeout(() =>{
        
        if(val == ''){

            // If value is empty, then results container should only contain loading div
            results.innerHTML = `
                <div class="loader">
                    <div class="loader-dot ldot1"></div>
                    <div class="loader-dot ldot2"></div>
                    <div class="loader-dot ldot3"></div>
                </div>
            `
            loadingAnim = results.childNodes[1];

            // Reset timeout and turn off loading animation
            tim = null;
            loadingAnim.classList.add('loader-off')
        }
        else{

            fetch(`/searchItems?val=${val}`)
            .then(res => res.json())
            .then(data =>{

                // Clear previous results
                results.innerHTML = `
                <div class="loader">
                    <div class="loader-dot ldot1"></div>
                    <div class="loader-dot ldot2"></div>
                    <div class="loader-dot ldot3"></div>
                </div>
                `
                loadingAnim = results.childNodes[1];

                
                // Add new results
                data.forEach(item =>{

                    const div = document.createElement('a')
                    div.setAttribute('class','search-result')
                    div.setAttribute('href',`item?id=${item._id.toString()}`)

                    div.innerHTML = `
                        <div class="result-item-img-cont">
                            <img src='/prodImgs/${item.mainImg}' alt='' />
                        </div>
                        <div class="result-item-title">${item.name}</div>
                        <div class="result-item-price">${item.isOnSale ? item.salePrice : item.price}$</div>
                    `

                    results.append(div)
                })

                // Reset timeout and turn off loading animation
                tim = null;
                loadingAnim.classList.add('loader-off')
            })
        }
    },1000)
})