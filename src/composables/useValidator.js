import { reactive } from 'vue'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const strongPassword = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

const messages = {
  fullNameRequired: 'សូមបំពេញឈ្មោះរបស់អ្នក',
  fullNameMin: 'ឈ្មោះត្រូវតែមានយ៉ាងហោចណាស់ 2 តួអក្សរ',

  emailRequired: 'សូមបំពេញអាស័យដ្ឋានអុីមែលរបស់អ្នក',
  emailInvalid: 'សូមបំពេញអុីមែលឱ្យបានត្រឹមត្រូវ',

  passwordRequired: 'សូមបំពេញពាក្យសម្ងាត់របស់អ្នក',
  passwordMin: 'ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 8 តួអក្សរ',
  passwordWeak: 'ពាក្យសម្ងាត់ត្រូវតែមានអក្សរធំ (A-Z) លេខ (0-9) និងតួអក្សរពិសេស (!@#$%...)',

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
    if (field in errors) errors[field] = ''
  }

  const clearErrors = () => {
    Object.keys(errors).forEach((field) => { errors[field] = '' })
  }

  const hasErrors = () => Object.values(errors).some(Boolean)

  // ── Login ──────────────────────────────────────────────
  const validateLogin = (form) => {
    clearErrors()

    if (!form.email.trim()) {
      errors.email = messages.emailRequired
    } else if (!emailPattern.test(form.email.trim())) {
      errors.email = messages.emailInvalid
    }

    if (!form.password) {
      errors.password = messages.passwordRequired
    } else if (form.password.length < 8) {
      errors.password = messages.passwordMin
    }

    return !hasErrors()
  }

  // ── Register ───────────────────────────────────────────
  const validateRegister = (form) => {
    clearErrors()

    // Full name
    if (!form.fullName.trim()) {
      errors.fullName = messages.fullNameRequired
    } else if (form.fullName.trim().length < 2) {
      errors.fullName = messages.fullNameMin
    }

    // Email
    if (!form.email.trim()) {
      errors.email = messages.emailRequired
    } else if (!emailPattern.test(form.email.trim())) {
      errors.email = messages.emailInvalid
    }

    // Password — ✅ check strength ផងដែរ
    if (!form.password) {
      errors.password = messages.passwordRequired
    } else if (form.password.length < 8) {
      errors.password = messages.passwordMin
    } else if (!strongPassword.test(form.password)) {
      errors.password = messages.passwordWeak
    }

    // Confirm password
    if (!form.passwordConfirmation) {
      errors.passwordConfirmation = messages.passwordConfirmRequired
    } else if (form.password !== form.passwordConfirmation) {
      errors.passwordConfirmation = messages.passwordMismatch
    }

    // Terms
    if (!form.acceptedTerms) {
      errors.acceptedTerms = messages.termsRequired
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
  }
}