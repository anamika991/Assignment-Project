import styles from '../control.module.css'
import areaStyles from './Textarea.module.css'

type TextareaProps = {
  id: string
  name: string
  label: string
  value: string
  placeholder?: string
  maxLength?: number
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
  onChange: (value: string) => void
  onBlur: () => void
}

export function Textarea({
  id,
  name,
  label,
  value,
  placeholder,
  maxLength,
  required = false,
  disabled = false,
  invalid = false,
  describedBy,
  onChange,
  onBlur,
}: TextareaProps) {
  return (
    <textarea
      className={`${styles.control} ${areaStyles.area} ${invalid ? styles.invalid : ''}`}
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      rows={4}
      maxLength={maxLength}
      disabled={disabled}
      aria-label={label}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
    />
  )
}
