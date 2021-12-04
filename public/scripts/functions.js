function parseCookies(){

    const cookies = document.cookie;
    const cookies2 = cookies.slice(5)
    let cart
    

    if(cookies2.indexOf("%2C") != -1)
        cart = cookies2.split("%2C")
    else
        cart = cookies2.split(",")


    if(cart[0] == '')
        cart.shift()


    cart = cart.map(c =>{

        if(c.indexOf("%3D") !== -1){

            let newStr = "";
            c = c.split("%3D")
            
            c.forEach(str =>{
                if(str !== "%3D")
                    newStr += str;
            })

            c = JSON.parse(atob(newStr))
        }
        else
            c = JSON.parse(atob(c))

        return c
    })
    
    return cart
}



function rgbToHex (rgb) { 

    var hex = Number(rgb).toString(16);

    if (hex.length < 2) {
            hex = "0" + hex;
    }
    return hex;
};

function fullColorHex(r,g,b) {   

    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);

    return red+green+blue;
};


export {parseCookies, rgbToHex, fullColorHex}