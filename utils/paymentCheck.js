// module.exports = function (number, exp, cvc) {
//     const isExpired = (arg) => {
//         if (+arg.slice(0, 2) > 12 || +arg.slice(0, 2) < 1) {
//             return false;
//         }

//         if (+arg.slice(2) < +String(new Date().getFullYear()).slice(2)) {
//             return false;
//         }

//         if (
//             +arg.slice(2) === +String(new Date().getFullYear()).slice(2) &&
//             +arg.slice(0, 2) < +String(new Date().getMonth()) + 1
//         ) {
//             return false;
//         }

//         return true;
//     };

//     const isValidStr = (str, length) => {
//         if (typeof str !== "string") {
//             return false;
//         }
//         const editedStr = str.trim().replaceAll(" ", "");

//         if (length === 4 && !isExpired(editedStr)) {
//             return false;
//         }

//         const reg = new RegExp(`\\d{${length}}`);
//         return editedStr.length === length && reg.test(editedStr);
//     };


    
//     if (!number || !exp || !cvc) {
//         return false;
//     }

//     if (!isValidStr(number, 16) || !isValidStr(exp, 4) || !isValidStr(cvc, 3)) {
//         return false;
//     }

//     return true;
// };


class CardValidator {
    constructor(number, exp, cvc) {
        this.number = number;
        this.exp = exp;
        this.cvc = cvc;
        this.errors = {};
    }

    static isValidNumber(number) {
        if(typeof number !== 'string') return {valid: false, error: 'Card number must be a string value'};
        const sanitizedNumber = number.trim().replaceAll(' ', '');
        if(sanitizedNumber.length !== 16 || !/^\d{16}$/.test(sanitizedNumber)) {
            return {valid: false, error: 'Card number must be 16 digits'}; 
        }

        return {valid: true}
    }

    static isValidExpiration(exp) {
        if(typeof exp !== 'string') return {valid: false, error: 'Expiration date must be a string value'};
        const sanitizedExp = exp.trim().replaceAll(' ', '');
        // if (sanitizedExp.length !== 4 || !/^\d{4}$/.test(sanitizedExp)) return false;
        if(sanitizedExp.length !== 4 || !/^\d{4}$/.test(sanitizedExp)) {
            return {valid: false, error: 'Expiration date number must be 4 digits (MMYY)'}; 
        }
        
        const month = +sanitizedExp.slice(0, 2);
        const year = +sanitizedExp.slice(2);
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear() % 100;

        if(month < 1 || month > 12) return {valid: false, error: 'Month must be between 01 and 12'}; 
        if(year < currentYear) return {valid: false, error: 'Card has expired'}; 
        if(year === currentYear && month < currentMonth) return {valid: false, error: 'Card has expired'}; 

        return {valid: true}
    }

    static isValidCVC(cvc) {
        if(typeof cvc !== 'string') return {valid: false, error: 'CVC must be a string value'};
        const sanitizedCVC = cvc.trim().replaceAll(' ', '');
        // return sanitizedCVC.length === 3 && /^\d{3}$/.test(sanitizedCVC);
        if(sanitizedCVC.length !== 3 || !/^\d{3}$/.test(sanitizedCVC)) {
            return {valid: false, error: 'CVC must be 3 digits'}; 
        }
        
        return {valid: true}
    }

    validate() {
        this.errors = {};

        const numberValidation = CardValidator.isValidNumber(this.number);
        if(!numberValidation.valid) this.errors.number = numberValidation.error;

        const expirationValidation = CardValidator.isValidExpiration(this.exp);
        if(!expirationValidation.valid) this.errors.exp = expirationValidation.error;

        const cvcValidation = CardValidator.isValidCVC(this.cvc);
        if(!cvcValidation.valid) this.errors.cvc = cvcValidation.error;

        return Object.keys(this.errors).length === 0;
    }

    getErrors() {
        return this.errors;
    }
}


module.exports = (number, exp, cvc) => {
    const validator = new CardValidator(number, exp, cvc);
    const isValid = validator.validate();

    return {isValid, errors: validator.getErrors()}
}