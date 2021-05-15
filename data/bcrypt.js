const data = require('./users');
const bcrypt = require('bcrypt');
const saltRounds = 16;
async function hashing(pswd){
    const password = pswd;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash
}
async function checker(userid, password){
         for(let i = 0; i<data.length; i++){
             if(data[i].username == userid){
                let user = await bcrypt.compare(password, data[i].hashedpassword);
                if(user == false) throw 'Wrong password'
                if(user == true){
                    return data[i];
                }

             }
         }

}

module.exports=
    {  
     checker,
     hashing
    }