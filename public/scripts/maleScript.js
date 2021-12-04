const modal2 = document.querySelector('.modal2')
const modalBg2 = document.querySelector('.modal-bg2')
const filters = document.querySelector('.filters-btn')


filters.addEventListener('click', e => {

    modalBg2.classList.remove('off')
    modal2.classList.remove('off')
})


modalBg2.addEventListener('click', e => {

    modalBg2.classList.add('off')
    modal2.classList.add('off')
})





/* --- Filters --- */
let sizes = [];
let colors = [];
let minPrice = 0;
let maxPrice = 10000;
let min = 0;
let max = 1000;

const sizesC = document.querySelectorAll('.size-cont')
const colorsC = document.querySelectorAll('.color-cont')

const sizesCM = document.querySelectorAll('.size-cont-modal')
const colorsCM = document.querySelectorAll('.color-cont-modal')

const minInp = document.querySelector('.price-from')
const maxInp = document.querySelector('.price-to')

const minInpM = document.querySelector('.price-from-mobile')
const maxInpM = document.querySelector('.price-to-mobile')

const find = document.querySelectorAll('.findBtn')

sizesC.forEach(s =>{
    s.addEventListener('click', e =>{

        const size = s.childNodes[3].innerHTML;
        s.childNodes[1].classList.toggle('active-checkbox')
        
        if(s.childNodes[1].classList.contains('active-checkbox'))
            sizes.push(size)
        else
            sizes.splice(sizes.indexOf(size),1)
    })
})

colorsC.forEach(c =>{
    c.addEventListener('click', e =>{

        const color = c.childNodes[3].innerHTML;
        c.childNodes[1].classList.toggle('active-checkbox')

        if(c.childNodes[1].classList.contains('active-checkbox'))
            colors.push(color.toLowerCase())
        else
            colors.splice(colors.indexOf(color.toLowerCase()),1)
    })
})

find.forEach(f =>{
    
    f.addEventListener('click', e => {
        
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        let currPage = params.page;

        if(f.classList.contains('modal-find')){
            minPrice = minInpM.value;
            maxPrice = maxInpM.value;
        }
        else{
            minPrice = minInp.value;
            maxPrice = maxInp.value;
        }

        // Remove duplicates
        colors = new Set([...colors])
        colors = [...colors]

        sizes = new Set([...sizes])
        sizes = [...sizes]

        document.location = `/items?gender=${params.gender}&sizes=${sizes}&colors=${colors}&minp=${minPrice}&maxp=${maxPrice}&page=1`
    })
})


/* --- Price inputs --- */

const priceInps = document.querySelectorAll('.price-inp')

priceInps.forEach(inp =>{
    inp.addEventListener('click', (e) =>{
        
        e.target.value = ''
    })
})