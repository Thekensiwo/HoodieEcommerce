const steps = document.querySelectorAll('.step')
const conts = document.querySelectorAll('.main-cont')
import {parseCookies, rgbToHex, fullColorHex} from './functions.js'


steps.forEach(step => {

    step.addEventListener('click', e => {

        steps.forEach(step2 => {
            if (step2.classList.contains('active-step'))
                step2.classList.remove('active-step')
        })
        step.classList.add('active-step')

        
        conts.forEach(cont => {

            if (cont.dataset.num != step.dataset.num)
                cont.classList.remove('active-cont')

            if (cont.dataset.num == step.dataset.num && !cont.classList.contains('active-cont')) {
                setTimeout(() => {
                    cont.classList.add('active-cont')
                }, 200)
            }
        })
    })
})




/* --- Buttons --- */

const deliveryBtn = document.querySelector('.delivery-btn')
const paymentBtn = document.querySelector('.payment-section-btn')
const payBtn = document.querySelector('.pay-now')

const btns = [deliveryBtn, paymentBtn, payBtn]

deliveryBtn.addEventListener('click', () => { showSection(deliveryBtn.dataset.num) })
paymentBtn.addEventListener('click', () => { showSection(paymentBtn.dataset.num) })



function showSection(num) {

    conts.forEach(cont => {

        updateSteps(num)

        if (cont.classList.contains('active-cont') && cont.dataset.num != num)
            cont.classList.remove('active-cont')
        else if (cont.dataset.num == num)
            cont.classList.add('active-cont')
    })
}


function updateSteps(num) {
    steps.forEach(step => {
        if (step.classList.contains('active-step') && step.dataset.num != num) {
            step.classList.remove('active-step')
        }
        else if (step.dataset.num == num) {
            step.classList.add('active-step')
        }
    })
}




/* --- Radio Inputs --- */

const deliveryRadios = document.querySelectorAll('.delivery-method')
const paymentRadios = document.querySelectorAll('.payment-method')
const methods = {
    delivery: "Standard",
    payment: "Paypal"
}

radioCheck(deliveryRadios, "delivery")
radioCheck(paymentRadios, "payment")


function radioCheck(radios, type) {

    radios.forEach(radio => {
        radio.parentElement.addEventListener('click', e => {

            const val = radio.dataset.val;
            methods[type] = val

            radios.forEach(radio2 => {
                if (radio2.dataset.val != val) {
                    radio2.classList.remove('active-radio')
                }
                else {
                    radio2.classList.add('active-radio')
                }
            })
        })
    })
}


/* --- Delete all --- */

const deleteAll = document.querySelector('.remove-all')

deleteAll.addEventListener('click', e =>{
    document.cookie = 'cart=; Max-Age=0; path=/; domain=' + location.hostname;
    window.location.reload()
})





/* --- Submit order --- */

const btns2 = document.querySelectorAll('button')

// Prevent default for all btns except for pay now to prevent submitting form
btns2.forEach(btn =>{
    btn.addEventListener('click', e =>{
        if(!btn.classList.contains('pay-now')){
           e.preventDefault() 
        }
    })
})


const payNowBtn = document.querySelector('.pay-now')
const form = document.querySelector('form')

form.addEventListener('submit', function(e){
    
    if(parseCookies().length == 0)
        e.preventDefault()
    
    // Create hidden inputs
    const inp1 = document.createElement('input')
    inp1.setAttribute('name','payment_method')
    inp1.setAttribute('value', methods.payment)
    inp1.setAttribute('class', "invisible")

    const inp2 = document.createElement('input')
    inp2.setAttribute('name','delivery_method')
    inp2.setAttribute('value', methods.delivery)
    inp2.setAttribute('class', "invisible")

    this.append(inp1)
    this.append(inp2)
})