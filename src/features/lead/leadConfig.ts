import type { FormField } from '../../design-system/form/types'

export type ValidationRule =
  | { type: 'required'; message: string }
  | { type: 'email'; message: string }
  | { type: 'minLength'; min: number; message: string }
  | { type: 'digits'; length: number; message: string }
  | { type: 'maxLength'; max: number; message: string }

export type LeadField = FormField & {
  validations: ValidationRule[]
}

export const leadFields: LeadField[] = [
  {
    name: 'fullName',
    type: 'text',
    label: 'Full name',
    placeholder: 'Ada Lovelace',
    autoComplete: 'name',
    span: 'half',
    validations: [
      { type: 'required', message: 'Enter your full name.' },
      { type: 'minLength', min: 2, message: 'Enter at least 2 characters.' },
    ],
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'ada@example.com',
    autoComplete: 'email',
    inputMode: 'email',
    span: 'half',
    validations: [
      { type: 'required', message: 'Enter your email address.' },
      { type: 'email', message: 'Enter a valid email address.' },
    ],
  },
  {
    name: 'leadType',
    type: 'select',
    label: 'Lead type',
    placeholder: 'Select a type',
    span: 'half',
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'company', label: 'Company' },
    ],
    validations: [{ type: 'required', message: 'Select a lead type.' }],
  },
  {
    name: 'companyName',
    type: 'text',
    label: 'Company name',
    placeholder: 'Analytical Engines',
    autoComplete: 'organization',
    span: 'half',
    visibleWhen: { field: 'leadType', equals: 'company' },
    validations: [
      { type: 'required', message: 'Enter the company name.' },
      { type: 'minLength', min: 2, message: 'Enter at least 2 characters.' },
    ],
  },
  {
    name: 'phone',
    type: 'text',
    label: 'Phone',
    placeholder: '9876543210',
    hint: 'A 10-digit phone number.',
    autoComplete: 'tel',
    inputMode: 'numeric',
    span: 'full',
    validations: [
      { type: 'required', message: 'Enter a phone number.' },
      { type: 'digits', length: 10, message: 'Enter a 10-digit phone number.' },
    ],
  },
  {
    name: 'notes',
    type: 'textarea',
    label: 'Notes',
    placeholder: 'Anything we should know before we call',
    hint: 'Optional.',
    span: 'full',
    validations: [
      { type: 'maxLength', max: 200, message: 'Keep notes to 200 characters or fewer.' },
    ],
  },
  {
    name: 'consent',
    type: 'checkbox',
    label: 'I agree to be contacted about this inquiry.',
    span: 'full',
    validations: [{ type: 'required', message: 'Agree to be contacted before submitting.' }],
  },
]

export function toFormFields(fields: LeadField[]): FormField[] {
  return fields.map((field) => {
    const { validations, ...rest } = field
    const maxRule = validations.find((rule) => rule.type === 'maxLength')

    return {
      ...rest,
      required: validations.some((rule) => rule.type === 'required'),
      maxLength: maxRule?.type === 'maxLength' ? maxRule.max : undefined,
    }
  })
}

export function coerceLeadValue(field: LeadField, value: string | boolean) {
  if (typeof value !== 'string') return value

  const digitsRule = field.validations.find((rule) => rule.type === 'digits')
  if (digitsRule?.type === 'digits') {
    return value.replace(/\D/g, '').slice(0, digitsRule.length)
  }

  const maxRule = field.validations.find((rule) => rule.type === 'maxLength')
  if (maxRule?.type === 'maxLength') return value.slice(0, maxRule.max)

  return value
}
