import styles from '../control.module.css'
import inputStyles from './TextInput.module.css'

type TextInputProps = {
  id: string
  name: string
  label: string
  value: string
  type?: 'text' | 'email'
  placeholder?: string
  inputMode?: 'text' | 'email' | 'numeric' | 'tel'
  autoComplete?: string
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
  onChange: (value: string) => void
  onBlur: () => void
}

export function TextInput({
  id,
  name,
  label,
  value,
  type = 'text',
  placeholder,
  inputMode,
  autoComplete,
  required = false,
  disabled = false,
  invalid = false,
  describedBy,
  onChange,
  onBlur,
}: TextInputProps) {
  return (
    <input
      className={`${styles.control} ${inputStyles.input} ${invalid ? styles.invalid : ''}`}
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      inputMode={inputMode}
      autoComplete={autoComplete}
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
