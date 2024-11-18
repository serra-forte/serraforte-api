function test(){
    let x = 5;
    let y = 10;

    let verification = false;

    while(!verification){
        console.log('if x == 4')
        if(x == 4){
            console.log("verificação false")
            return verification = true;
        } 

        console.log('if y == 2')
        if(y == 2){
            console.log("verificação false")
            return verification = true;
        } 

        console.log('if y == 10')
        if(y == 10){
            console.log("verificação true")
            return verification = true;
        }

        console.log('if x == 1')
        if(x == 1){
            console.log("verificação false")
            return verification = true;
        }
        
        return console.log('Box disponível para uso!')
    }
}
test()