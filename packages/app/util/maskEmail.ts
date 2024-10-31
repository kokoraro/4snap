

function maskEmail(email: string){
    if(!validateEmail(email)){
        return email;
    }
    if(email.length > 15){
        const splited = email.split("@");
        const [f, l] = [splited[0].slice(0,3), splited[0].slice(-2)];
        const combo = `${f}****${l}@${splited[splited.length - 1]}`
        return combo;
    }
    return email;
}

export default maskEmail;

function validateEmail(email: string) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}