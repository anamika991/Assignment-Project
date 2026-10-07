import styles from './Button.module.css'

type ButtonProps = {
  label: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  busy?: boolean
  onClick?: () => void
}

export function Button({
  label,
  type = 'button',
  variant = 'primary',
  disabled = false,
  busy = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${variant === 'secondary' ? styles.secondary : ''}`}
      type={type}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
