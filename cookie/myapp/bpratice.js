// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//     bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
//         console.log(result);
//     });
//     bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
//         console.log(result);
//     });
// });
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
function gen() {
    return new Promise((resolve, reject) => {
        bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}


// 在其他地方验证
gen()
.then((hash)=>{

    bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
        console.log(result); // true 或 false，根据匹配情况
    });

    bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        console.log(result); // true 或 false，根据匹配情况
    });
    }
)


