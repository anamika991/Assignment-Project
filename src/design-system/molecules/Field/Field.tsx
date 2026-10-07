import type { ReactNode } from 'react'
import styles from './Field.module.css'

type FieldProps = {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  count?: { value: number; max: number }
  variant?: 'stack' | 'inline'
  children: ReactNode
}

export function Field({
  id,
  label,
  hint,
  error,
  required = false,
  count,
  variant = 'stack',
  children,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const countId = count ? `${id}-count` : undefined

  return (
    <div className={variant === 'inline' ? styles.inline : styles.stack}>
      {variant === 'stack' ? (
        <label className={styles.label} htmlFor={id}>
          {label}
          {required ? <RequiredMark /> : null}
        </label>
      ) : null}
      <div className={variant === 'inline' ? styles.controlInline : undefined}>{children}</div>
      {variant === 'inline' ? (
        <label className={`${styles.label} ${styles.labelInline}`} htmlFor={id}>
          {label}
          {required ? <RequiredMark /> : null}
        </label>
      ) : null}
      {hint || count ? (
        <div className={styles.meta}>
          {hint ? (
            <p id={hintId} className={styles.hint}>
              {hint}
            </p>
          ) : (
            <span />
          )}
          {count ? (
            <p id={countId} className={count.value >= count.max ? styles.countFull : styles.count}>
              <span aria-hidden="true">
                {count.value} / {count.max}
              </span>
              <span className={styles.srOnly}>
                {count.value} of {count.max} characters
              </span>
            </p>
          ) : null}
        </div>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error} aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function RequiredMark() {
  return (
    <span aria-hidden="true" className={styles.star}>
      *
    </span>
  )
}

