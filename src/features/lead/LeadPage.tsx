import { useEffect, useRef, useState, type RefObject } from 'react'
import { Button } from '../../design-system/atoms/Button/Button'
import { DynamicForm } from '../../design-system/form/DynamicForm'
import type { FieldValues } from '../../design-system/form/types'
import { isFieldVisible } from '../../design-system/form/visibility'
import { coerceLeadValue, leadFields, toFormFields } from './leadConfig'
import type { LeadField } from './leadConfig'
import styles from './LeadPage.module.css'
import { submitLead } from './submitLead'
import { validateLead } from './validateLead'

const formFields = toFormFields(leadFields)

function emptyValues(fields: LeadField[]): FieldValues {
  return Object.fromEntries(fields.map((field) => [field.name, field.type === 'checkbox' ? false : '']))
}

export function LeadPage() {
  const [values, setValues] = useState<FieldValues>(() => emptyValues(leadFields))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<FieldValues | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [formError, setFormError] = useState('')
  const valuesRef = useRef(values)
  const touchedRef = useRef<Record<string, boolean>>({})
  const submittingRef = useRef(false)
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  const focusNameOnReset = useRef(false)

  useEffect(() => {
    if (status === 'success') successHeadingRef.current?.focus()
    if (status === 'idle' && focusNameOnReset.current) {
      focusNameOnReset.current = false
      document.getElementById('fullName')?.focus()
    }
  }, [status])

  function handleChange(name: string, value: string | boolean) {
    const field = leadFields.find((item) => item.name === name)
    const nextValue = field ? coerceLeadValue(field, value) : value
    const nextValues = { ...valuesRef.current, [name]: nextValue }
    valuesRef.current = nextValues
    setValues(nextValues)
    setFormError('')
    setErrors(errorsForTouched(validateLead(leadFields, nextValues), touchedRef.current))
  }

  function handleBlur(name: string) {
    const current = valuesRef.current[name]
    let nextValues = valuesRef.current
    if (typeof current === 'string' && current !== current.trim()) {
      nextValues = { ...nextValues, [name]: current.trim() }
      valuesRef.current = nextValues
      setValues(nextValues)
    }

    const nextTouched = { ...touchedRef.current, [name]: true }
    touchedRef.current = nextTouched
    setErrors(errorsForTouched(validateLead(leadFields, nextValues), nextTouched))
  }

  async function handleSubmit() {
    if (submittingRef.current) return

    const currentValues = trimValues(valuesRef.current)
    valuesRef.current = currentValues
    setValues(currentValues)
    const nextErrors = validateLead(leadFields, currentValues)
    const visible = leadFields.filter((field) => isFieldVisible(field, currentValues))
    const nextTouched = { ...touchedRef.current }
    for (const field of visible) nextTouched[field.name] = true
    touchedRef.current = nextTouched
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = visible.find((field) => nextErrors[field.name])
      const target = firstInvalid ? document.getElementById(firstInvalid.name) : null
      target?.focus()
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' })
      return
    }

    const result: FieldValues = {}
    for (const field of visible) result[field.name] = currentValues[field.name]

    submittingRef.current = true
    setStatus('submitting')
    setFormError('')

    try {
      const saved = await submitLead(result)
      setSubmitted(saved)
      setStatus('success')
    } catch {
      setFormError("We couldn't submit your inquiry. Please try again.")
      setStatus('idle')
    } finally {
      submittingRef.current = false
    }
  }

  function startAnother() {
    const nextValues = emptyValues(leadFields)
    valuesRef.current = nextValues
    touchedRef.current = {}
    focusNameOnReset.current = true
    setValues(nextValues)
    setErrors({})
    setSubmitted(null)
    setFormError('')
    setStatus('idle')
  }

  const submitting = status === 'submitting'

  return (
    <main className={status === 'success' ? styles.page : `${styles.page} ${styles.pageWithDock}`}>
      <div className={styles.card}>
        {status === 'success' && submitted ? (
          <SuccessState values={submitted} headingRef={successHeadingRef} onAnother={startAnother} />
        ) : (
          <>
            <header className={styles.header}>
              <p className={styles.eyebrow}>Lead capture</p>
              <h1 className={styles.title}>Tell us how to reach you</h1>
              <p className={styles.intro}>Share a few details and we will follow up about your inquiry.</p>
            </header>
            {formError ? (
              <p className={styles.formError} role="alert">
                {formError}
              </p>
            ) : null}
            <p className={styles.srOnly} aria-live="polite">
              {submitting ? 'Submitting inquiry' : ''}
            </p>
            <DynamicForm
              fields={formFields}
              values={values}
              errors={errors}
              submitLabel={submitting ? 'Submitting...' : 'Submit lead'}
              disabled={submitting}
              busy={submitting}
              layout={{
                grid: styles.grid,
                spanHalf: styles.spanHalf,
                spanFull: styles.spanFull,
                actions: styles.actions,
              }}
              onValueChange={handleChange}
              onFieldBlur={handleBlur}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </main>
  )
}

function trimValues(current: FieldValues): FieldValues {
  const next: FieldValues = {}
  for (const [key, value] of Object.entries(current)) {
    next[key] = typeof value === 'string' ? value.trim() : value
  }
  return next
}

function errorsForTouched(nextErrors: Record<string, string>, touchedMap: Record<string, boolean>) {
  const shown: Record<string, string> = {}
  for (const [key, message] of Object.entries(nextErrors)) {
    if (touchedMap[key]) shown[key] = message
  }
  return shown
}

function SuccessState({
  values,
  headingRef,
  onAnother,
}: {
  values: FieldValues
  headingRef: RefObject<HTMLHeadingElement | null>
  onAnother: () => void
}) {
  const visible = leadFields.filter((field) => field.name in values)

  return (
    <section className={styles.success} aria-live="polite">
      <p className={styles.eyebrow}>Lead capture</p>
      <svg className={styles.check} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 20.5l5 5 11-11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h1 className={styles.title} tabIndex={-1} ref={headingRef}>
        Lead received
      </h1>
      <p className={styles.intro}>
        Thanks for reaching out. We've received your inquiry and will follow up shortly.
      </p>
      <div className={styles.summary}>
        <h2 className={styles.summaryTitle}>Inquiry details</h2>
        <dl className={styles.summaryList}>
          {visible.map((field) => (
            <div key={field.name} className={styles.summaryRow}>
              <dt>{field.label}</dt>
              <dd>{displayValue(field, values[field.name])}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className={styles.another}>
        <Button type="button" variant="secondary" label="Submit another inquiry" onClick={onAnother} />
      </div>
    </section>
  )
}

function displayValue(field: LeadField, value: string | boolean) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  const option = field.options?.find((item) => item.value === value)
  return option?.label ?? value
}
