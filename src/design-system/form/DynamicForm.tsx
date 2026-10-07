import type { ReactNode } from 'react'
import { Button } from '../atoms/Button/Button'
import { Checkbox } from '../atoms/Checkbox/Checkbox'
import { Select } from '../atoms/Select/Select'
import { Textarea } from '../atoms/Textarea/Textarea'
import { TextInput } from '../atoms/TextInput/TextInput'
import { describedByIds } from '../molecules/Field/describedBy'
import { Field } from '../molecules/Field/Field'
import type { FieldValues, FormField, FormLayoutClasses } from './types'
import { isFieldVisible } from './visibility'

type DynamicFormProps = {
  fields: FormField[]
  values: FieldValues
  errors: Record<string, string | undefined>
  submitLabel: string
  layout: FormLayoutClasses
  disabled?: boolean
  busy?: boolean
  onValueChange: (name: string, value: string | boolean) => void
  onFieldBlur: (name: string) => void
  onSubmit: () => void
}

export function DynamicForm({
  fields,
  values,
  errors,
  submitLabel,
  layout,
  disabled = false,
  busy = false,
  onValueChange,
  onFieldBlur,
  onSubmit,
}: DynamicFormProps) {
  const visibleFields = fields.filter((field) => isFieldVisible(field, values))

  return (
    <form
      noValidate
      aria-busy={busy || undefined}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className={layout.grid}>
        {visibleFields.map((field) => {
          const error = errors[field.name]
          const rawValue = values[field.name]
          const textValue = typeof rawValue === 'string' ? rawValue : ''
          const count =
            field.maxLength != null ? { value: textValue.length, max: field.maxLength } : undefined

          return (
            <div
              key={field.name}
              className={field.span === 'full' ? layout.spanFull : layout.spanHalf}
            >
              <Field
                id={field.name}
                label={field.label}
                hint={field.hint}
                error={error}
                required={field.required}
                count={count}
                variant={field.type === 'checkbox' ? 'inline' : 'stack'}
              >
                {renderControl(
                  field,
                  textValue,
                  values[field.name] === true,
                  Boolean(error),
                  disabled,
                  onValueChange,
                  onFieldBlur,
                )}
              </Field>
            </div>
          )
        })}
      </div>
      <div className={layout.actions}>
        <Button type="submit" label={submitLabel} disabled={disabled} busy={busy} />
      </div>
    </form>
  )
}

function renderControl(
  field: FormField,
  textValue: string,
  checked: boolean,
  invalid: boolean,
  disabled: boolean,
  onValueChange: (name: string, value: string | boolean) => void,
  onFieldBlur: (name: string) => void,
): ReactNode {
  const describedBy = describedByIds(field.name, {
    hint: Boolean(field.hint),
    count: field.maxLength != null,
    error: invalid,
  })

  switch (field.type) {
    case 'text':
    case 'email':
      return (
        <TextInput
          id={field.name}
          name={field.name}
          label={field.label}
          type={field.type}
          value={textValue}
          placeholder={field.placeholder}
          inputMode={field.inputMode}
          autoComplete={field.autoComplete}
          required={field.required}
          disabled={disabled}
          invalid={invalid}
          describedBy={describedBy}
          onChange={(value) => onValueChange(field.name, value)}
          onBlur={() => onFieldBlur(field.name)}
        />
      )
    case 'textarea':
      return (
        <Textarea
          id={field.name}
          name={field.name}
          label={field.label}
          value={textValue}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          required={field.required}
          disabled={disabled}
          invalid={invalid}
          describedBy={describedBy}
          onChange={(value) => onValueChange(field.name, value)}
          onBlur={() => onFieldBlur(field.name)}
        />
      )
    case 'select':
      return (
        <Select
          id={field.name}
          name={field.name}
          label={field.label}
          value={textValue}
          options={field.options ?? []}
          placeholder={field.placeholder}
          required={field.required}
          disabled={disabled}
          invalid={invalid}
          describedBy={describedBy}
          onChange={(value) => onValueChange(field.name, value)}
          onBlur={() => onFieldBlur(field.name)}
        />
      )
    case 'checkbox':
      return (
        <Checkbox
          id={field.name}
          name={field.name}
          label={field.label}
          value={checked}
          required={field.required}
          disabled={disabled}
          invalid={invalid}
          describedBy={describedBy}
          onChange={(value) => onValueChange(field.name, value)}
          onBlur={() => onFieldBlur(field.name)}
        />
      )
    default: {
      const unreachable: never = field.type
      return unreachable
    }
  }
}
