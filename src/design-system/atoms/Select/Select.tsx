import styles from '../control.module.css'
import selectStyles from './Select.module.css'

export type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  id: string
  name: string
  label: string
  value: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
  onChange: (value: string) => void
  onBlur: () => void
}

export function Select({
  id,
  name,
  label,
  value,
  options,
  placeholder = 'Select',
  required = false,
  disabled = false,
  invalid = false,
  describedBy,
  onChange,
  onBlur,
}: SelectProps) {
  return (
    <select
      className={`${styles.control} ${selectStyles.select} ${value === '' ? selectStyles.placeholder : ''} ${invalid ? styles.invalid : ''}`}
      id={id}
      name={name}
      value={value}
      disabled={disabled}
      aria-label={label}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
