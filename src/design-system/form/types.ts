import type { SelectOption } from '../atoms/Select/Select'

export type FieldType = 'text' | 'email' | 'select' | 'textarea' | 'checkbox'

export type FieldValues = Record<string, string | boolean>

export type VisibleWhen = {
  field: string
  equals: string
}

export type FormField = {
  name: string
  type: FieldType
  label: string
  hint?: string
  placeholder?: string
  options?: SelectOption[]
  span?: 'half' | 'full'
  required?: boolean
  maxLength?: number
  inputMode?: 'text' | 'email' | 'numeric' | 'tel'
  autoComplete?: string
  visibleWhen?: VisibleWhen
}

export type FormLayoutClasses = {
  grid: string
  spanHalf: string
  spanFull: string
  actions: string
}
