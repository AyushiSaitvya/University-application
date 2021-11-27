const Validator = require("validator");
const isEmpty = require("is-empty");


module.exports=function validateResetPassword(data){
    let errors = {};
    data.password = !isEmpty(data.password) ? data.password : "";
  
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
      }
    return {
      errors,
      isValid: isEmpty(errors)
    };
   
  }