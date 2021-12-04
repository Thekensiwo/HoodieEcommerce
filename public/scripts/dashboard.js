const modalBg = document.querySelector('.modal-bg');
const modals = document.querySelectorAll('.modal')

const showUsers = document.querySelector('.show-users-btn')
const usersModal = document.querySelector('.list-of-users-modal')

const addProdBtn = document.querySelector('.add-product-btn')
const addProdModal = document.querySelector('.add-product-modal')

const delProdBtn = document.querySelector('.delete-product-btn')
const delProdModal = document.querySelector('.delete-product-modal')



modalBg.addEventListener('click', e =>{

    modalBg.classList.toggle('off')
    modals.forEach(modal => modal.classList.add('off'))
})


toggleModal(addProdBtn,addProdModal)
toggleModal(showUsers,usersModal)
toggleModal(delProdBtn,delProdModal)

function toggleModal(btn,modal){

    btn.addEventListener('click', e =>{
        modal.classList.remove('off')
        modalBg.classList.remove('off')
    })
}



/* --- Choosing Color from inputs--- */

const colorsDOM = document.querySelectorAll('.color-c')
const sizesDOM = document.querySelectorAll('.size-c')
const colorInp = document.querySelector('.color-inp')
const sizeInp = document.querySelector('.size-inp')

let colors = [];
let sizes = []


colorsDOM.forEach(color =>{
    color.addEventListener('click', e =>{

        
        if(colors.includes(color.dataset.color)){
            colors.splice(colors.indexOf(color.dataset.color),1)
            color.classList.remove('active-col')
        }
        else{
            colors.push(color.dataset.color)
            color.classList.add('active-col')
        }

        colorInp.value = `${colors}`
    })
})


/* --- Choosing size from inputs --- */

sizesDOM.forEach(size =>{
    size.addEventListener('click', e =>{
        
        if(sizes.includes(size.innerHTML)){
            sizes.splice(sizes.indexOf(size.innerHTML),1)
            size.classList.remove('active-col')
        }
        else{
            sizes.push(size.innerHTML)
            size.classList.add('active-col')
        }

        sizeInp.value = `${sizes}`
    })
})




/* --- File Inputs Handle --- */

const mainImg = document.querySelector('.mainimg')
const mainImgText = document.querySelector('.mainImgText')


mainImg.addEventListener('change', e =>{
    mainImgText.innerHTML = mainImg.files[0].name
})



const sideImgs = document.querySelector('.sideImgs')
const sideImgsText = document.querySelector('.sideImgsText')


sideImgs.addEventListener('change', e =>{

    const filesArray = [...sideImgs.files]

    filesArray.forEach(file =>{
        const div = document.createElement('div')
        div.innerHTML = file.name
        sideImgsText.append(div)
    })
})


const files = []

sideImgs.addEventListener('change', e =>{
    files.push(sideImgs.files[0])
})





/* --- Form Submit --- */

const addProdForm = document.querySelector('.add-product-modal')
const infoModal = document.querySelector('.info-modal')

addProdForm.addEventListener('submit', e =>{

    const fd = new FormData(e.target)

    files.forEach(file =>{
        fd.append("sideimgs[]", file)
    })


    fetch('/addprod', {
        method: "POST",
        body: fd
    })
    .then(res => res.text())
    .then(data =>{

        // If succeeded, close modal
        if(data == 'true'){
            infoModal.innerHTML = "Added product successfully"
            infoModal.classList.remove('off')
                    
            setTimeout(() =>{
                modalBg.classList.add('off')
                addProdForm.classList.add('off')
                infoModal.classList.add('off')
            },1500)
        }
        else{
            infoModal.innerHTML = "Adding product failed"
            infoModal.classList.remove('off')
                    
            setTimeout(() =>{
                modalBg.classList.add('off')
                infoModal.classList.add('off')
            },1500)
        }
    })
    
    e.preventDefault()
})



/* --- Delete item --- */
const deleteItemInp = document.querySelector('.delete-item-inp')
const deleteItemBtn = document.querySelector('.delete-item')
const deleteItemModal = document.querySelector('.delete-product-modal')

deleteItemBtn.addEventListener('click', e =>{

    // zamienic to na regexp
    if(deleteItemInp.length != '' && deleteItemInp.length != ' '){

        const val = deleteItemInp.value;


        fetch(`/deleteitem?code=${val}`, {
            method: 'DELETE'
        })
        .then(res => res.text())
        .then(data =>{

            // If succeeded, close modal
            if(data !== 'true'){
                infoModal.innerHTML = "Deleting item failed"

                infoModal.classList.remove('off')

                setTimeout(() => infoModal.classList.add('off'),1500)
            }
            else{
                infoModal.classList.remove('off')
            
                setTimeout(() =>{
                    modalBg.classList.add('off')
                    deleteItemModal.classList.add('off')
                    infoModal.classList.add('off')
                },1500)
            }
        })
    }
})