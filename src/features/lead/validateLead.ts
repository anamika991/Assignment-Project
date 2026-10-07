import { isFieldVisible } from '../../design-system/form/visibility'
import type { FieldValues } from '../../design-system/form/types'
import type { LeadField, ValidationRule } from './leadConfig'

export function validateLead(fields: LeadField[], values: FieldValues) {
  const errors: Record<string, string> = {}

  for (const field of fields) {
    if (!isFieldVisible(field, values)) continue

    const value = values[field.name]

    for (const rule of field.validations) {
      const message = runRule(rule, value)
      if (message) {
        errors[field.name] = message
        break
      }
    }

    if (!errors[field.name] && field.type === 'select' && !isAllowedOption(field, value)) {
      errors[field.name] = 'Select a valid option.'
    }
  }

  return errors
}

function isAllowedOption(field: LeadField, value: string | boolean | undefined) {
  const selected = text(value)
  if (selected === '') return true
  return field.options?.some((option) => option.value === selected) ?? false
}

function runRule(rule: ValidationRule, value: string | boolean | undefined) {
  switch (rule.type) {
    case 'required':
      if (typeof value === 'boolean') return value ? null : rule.message
      return text(value) === '' ? rule.message : null
    case 'email': {
      const email = text(value)
      if (email === '') return null
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null : rule.message
    }
    case 'minLength': {
      const trimmed = text(value)
      if (trimmed === '') return null
      return trimmed.length >= rule.min ? null : rule.message
    }
    case 'digits': {
      const digits = text(value)
      if (digits === '') return null
      return new RegExp(`^\\d{${rule.length}}$`).test(digits) ? null : rule.message
    }
    case 'maxLength':
      if (typeof value !== 'string') return null
      return value.length <= rule.max ? null : rule.message
    default: {
      const unreachable: never = rule
      return unreachable
    }
  }
}

function text(value: string | boolean | undefined) {
  return typeof value === 'string' ? value.trim() : ''
}
