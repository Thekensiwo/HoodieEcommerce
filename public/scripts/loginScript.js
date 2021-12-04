/* -- Placeholders -- */

const placeholers = document.querySelectorAll('.placeholder')
const inputs = document.querySelectorAll('input');
const form = document.querySelector('form')

inputs.forEach(inp => {

    inp.addEventListener('click', e => {

        if (inp.value == '')
            inp.previousElementSibling.classList.add('placeholder-on')

        inputs.forEach(inp2 => {
            if (inp2.value == '' && inp2 != inp)
                inp2.previousElementSibling.classList.remove('placeholder-on')
        })
    })
})



// Input click animation
window.addEventListener('click', e => {

    if (e.target.nodeName == "INPUT") return

    inputs.forEach(inp => {

        if (inp.value == '')
            inp.previousElementSibling.classList.remove('placeholder-on')
    })
})



// Check for password

form.addEventListener('submit', e =>{

    const p1 = document.querySelector('.password')
    const p2 = document.querySelector('.password-repeat')

    if(p1 != null && p2 != null){
        if(p1.value != p2.value){
            e.preventDefault()
            alert("Passwords should match")
        }
    }
})