 import { reactive } from 'vue'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const messages = {
  fullNameRequired: 'សូមបំពេញឈ្មោះរបស់អ្នក',
  fullNameMin: 'ឈ្មោះត្រូវតែមានយ៉ាងហោចណាស់ 2 តួអក្សរ',
  emailRequired: 'សូមបំពេញអុីមែល​ឱ្យបានត្រឹមត្រូវ',
  emailInvalid: 'សូមបំពេញអាស័យដ្ឋានអុីមែលរបស់អ្នក',

  passwordRequired: 'ពាក្យសម្ងាត់ត្រូវតែមានអក្សរធំមួយ​ លេខមួយ និង តួអក្សរពិសេសមួយ',
  passwordMin: 'សូមបំពេញពាក្យសម្ងាត់របស់អ្នក',
  passwordConfirmRequired: 'សូមបំពេញពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់របស់អ្នក',
  passwordMismatch: 'ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវ',

  termsRequired: 'សូមជ្រើសរើសប្រើប្រាស់កម្មវិធី',
  
}

export function useValidator(fields = []) {
  const errors = reactive(
    fields.reduce((result, field) => {
      result[field] = ''
      return result
    }, {}),
  )

  const clearFieldError = (field) => {
    if (field in errors) {
      errors[field] = ''

    }
  }
  

  const clearErrors = () => {
    Object.keys(errors).forEach((field) => {
      errors[field] = ''

    })
  }

  const hasErrors = () => Object.values(errors).some(Boolean)

  const validateLogin = (form) => {
    clearErrors()

    if (!form.email.trim()) {
      errors.email = messages.emailInvalid

    } else if (!emailPattern.test(form.email.trim())) {
      errors.email = messages.emailRequired

    }

    if (!form.password) {
      errors.password = messages.passwordMin

    }else if(form.password.length < 8){
      errors.password = messages.passwordRequired
      
    }

    return !hasErrors()
  }

  const validateRegister = (form) => {
    clearErrors()

    if (!form.fullName.trim()) {
      errors.fullName = messages.fullNameRequired

    }else if (form.fullName.length < 2) {

      errors.fullName = messages.fullNameMin

    }

    if (!form.email.trim()) {
      
      errors.email = messages.emailInvalid

    } else if (!emailPattern.test(form.email.trim())) {

      errors.email = messages.emailRequired

    }

    if (!form.password) {
       errors.password = messages.passwordMin

    } else if (form.password.length < 8) {
    
       errors.password = messages.passwordRequired
    }

    if (!form.passwordConfirmation) {
      errors.passwordConfirmation = messages.passwordConfirmRequired

    } else if (form.password !== form.passwordConfirmation) {
      errors.passwordConfirmation = messages.passwordMismatch
    }

    if (!form.acceptedTerms) {

      errors.acceptedTerms = messages.termsRequired

    }

    return !hasErrors()
  }

  const validateForgetPassword = (form) => {
    clearErrors()

    if (!form.email.trim()) {
      errors.email = messages.emailInvalid
    } else if (!emailPattern.test(form.email.trim())) {
      errors.email = messages.emailRequired
    }

    return !hasErrors()
  }

  const validateResetPassword = (form) => {
    clearErrors()

    if (!form.password) {
      errors.password = messages.passwordMin
    } else if (form.password.length < 8) {
      errors.password = messages.passwordRequired
    }

    if (!form.passwordConfirmation) {
      errors.passwordConfirmation = messages.passwordConfirmRequired
    } else if (form.password !== form.passwordConfirmation) {
      errors.passwordConfirmation = messages.passwordMismatch
    }

    return !hasErrors()
  }

  return {
    errors,
    hasErrors,
  
    clearFieldError,
    clearErrors,
    validateLogin,
    validateRegister,
    validateForgetPassword,
    validateResetPassword,
  }
}
