const sliderInner = document.querySelector('.slider-inner')
const slides = document.querySelectorAll('.slide')
const dots = document.querySelectorAll('.dot')
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')

let i = 0;


// Managing slider dots
dots.forEach(dot => {

    dot.addEventListener('click', e => {

        resetCountdown()

        const num = parseInt(dot.dataset.num);
        i = num;

        dots.forEach(ddot => {
            if (ddot.classList.contains('dot-active')) {
                ddot.classList.remove('dot-active')
                return
            }
        })

        dot.classList.add('dot-active')
        sliderInner.style.transform = `translateX(-${100 * num}%)`
    })
})



// Prev
prev.addEventListener('click', e => {

    resetCountdown()

    if (i > 0)
        i -= 1;
    else
        i = slides.length - 1

    sliderInner.style.transform = `translateX(-${100 * i}%)`
    dotCheck()
})



// Next
next.addEventListener('click', e => {

    resetCountdown()

    if (i < slides.length - 1) {
        i += 1;
        sliderInner.style.transform = `translateX(-${100 * i}%)`
    }
    else {
        i = 0
        sliderInner.style.transform = `translateX(0%)`
    }
    dotCheck()
})



// Auto Sliding

let t;
startCountdown();


function startCountdown() {

    t = setInterval(() => {

        updateSlider()
    }, 4000)
}


function resetCountdown() {

    clearInterval(t)
    startCountdown()
}


function updateSlider() {

    if (i < slides.length - 1)
        i += 1;
    else
        i = 0;

    sliderInner.style.transform = `translateX(-${100 * i}%)`
    dotCheck()
}



function dotCheck() {

    dots.forEach(dot => {

        if (dot.dataset.num == i)
            dot.classList.add('dot-active')
        else if (dot.classList.contains('dot-active'))
            dot.classList.remove('dot-active')
    })
}


/* --- Slider on mobile --- */
const touchDevice = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement);
let direction, startPos = 0, endPos = 0, moving = false;


if(touchDevice){

    sliderInner.addEventListener('touchstart', e =>{
        moving = true
        startPos = e.touches[0].pageX;
    })


    sliderInner.addEventListener('touchmove', e =>{
        endPos = e.touches[0].pageX;
    })


    sliderInner.addEventListener('touchend', e =>{

        resetCountdown()

        if(moving){
            if(endPos < startPos)
                direction = "right"
            else if(startPos < endPos)
                direction = "left"
        }

        moving = false

        if(direction == "left"){
            i--

            if(i < 0)
                i = slides.length-1
                
        }
        else{
            i++

            if(i > slides.length-1)
                i = 0
                
        }

        sliderInner.style.transform = `translateX(${-i * 100}%)`
        dotCheck()
    })
}




/* --- Sale timer --- */
const date = new Date()
const targetdate = new Date(date.getYear(),date.getMonth(),date.getDate(),23,59,59)
const timer = document.querySelector('.timer')

function setTimer(){

    const date = new Date()

    let h = Math.abs(date.getHours() - targetdate.getHours())
    let m = Math.abs(date.getMinutes() - targetdate.getMinutes())
    let s = Math.abs(date.getSeconds() - targetdate.getSeconds())

    if(h < 10)
        h = `0${h}`
    if(m < 10)
        m = `0${m}`
    if(s < 10)
        s = `0${s}`

    timer.innerHTML = `${h} : ${m} : ${s}`
}

setTimer()
setInterval(setTimer,1000)