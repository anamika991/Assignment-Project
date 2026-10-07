import type { FieldValues } from '../../design-system/form/types'

const SUBMIT_DELAY_MS = 700

export function submitLead(values: FieldValues) {
  return new Promise<FieldValues>((resolve, reject) => {
    window.setTimeout(() => {
      if (Object.keys(values).length === 0) {
        reject(new Error('The inquiry was empty.'))
        return
      }
      resolve(values)
    }, SUBMIT_DELAY_MS)
  })
}
