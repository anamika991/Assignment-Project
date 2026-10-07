import type { FormField, FieldValues } from './types'

export function isFieldVisible(field: Pick<FormField, 'visibleWhen'>, values: FieldValues) {
  if (!field.visibleWhen) return true
  return values[field.visibleWhen.field] === field.visibleWhen.equals
}
