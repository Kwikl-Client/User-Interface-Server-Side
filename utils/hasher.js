import bcrypt from 'bcryptjs';

export const encrypt = async (text) => {
    try {
        const salt = await bcrypt.genSalt(10);
        let encryptedText = await bcrypt.hash( text, salt );
        return encryptedText;
    }
    catch (error){
        throw new Error();
    }
};

export const verifyPwd = async (enteredPwd, hashedPwd) => {
    try {
        let status = await bcrypt.compare(enteredPwd, hashedPwd);
        return status;
    }
    catch (error) {
        return false
    }
};

export const genPassword = () => {
    let requiredParams = {
        chars : process.env.APPROVAL_KEY,
        passwordLength : 12,
        password : "",
    }

    for (let i = 0; i <= requiredParams.passwordLength; i++) {
        let randomNumber = Math.floor(Math.random() * requiredParams.chars.length);
        requiredParams.password = requiredParams.password + requiredParams.chars.substring(randomNumber, randomNumber +1);
    }
    return requiredParams.password;
 };