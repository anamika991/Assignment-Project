import styles from './Checkbox.module.css'

type CheckboxProps = {
  id: string
  name: string
  label: string
  value: boolean
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
  onChange: (value: boolean) => void
  onBlur: () => void
}

export function Checkbox({
  id,
  name,
  label,
  value,
  required = false,
  disabled = false,
  invalid = false,
  describedBy,
  onChange,
  onBlur,
}: CheckboxProps) {
  return (
    <input
      className={`${styles.input} ${invalid ? styles.invalid : ''}`}
      id={id}
      name={name}
      type="checkbox"
      checked={value}
      disabled={disabled}
      aria-label={label}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.checked)}
      onBlur={onBlur}
    />
  )
}
