export function describedByIds(
  id: string,
  options: { hint?: boolean; error?: boolean; count?: boolean },
) {
  return [options.hint ? `${id}-hint` : '', options.count ? `${id}-count` : '', options.error ? `${id}-error` : '']
    .filter(Boolean)
    .join(' ') || undefined
}
