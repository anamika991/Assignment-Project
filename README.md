# Lead capture form

A lead form that renders from a config array, with a small design system underneath. React and TypeScript. Plain CSS modules. No component library.

## Install and run

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

## Folder layout

```
src/
  design-system/
    tokens/          color, spacing, type, breakpoints
    atoms/           text input, textarea, select, checkbox, button
    molecules/Field/ label, control, hint, and error
    form/            config types and the dynamic form
  features/lead/     lead config, validation, and the page
  App.tsx            mounts the lead page
```

Atoms take a value, a label, and events. They do not know what a lead is. Adding a field means adding an entry to the config. The form maps each `type` to an atom.

## Where things live

| Piece | File |
| --- | --- |
| Tokens | `src/design-system/tokens/tokens.css` |
| Atoms | `src/design-system/atoms/` |
| Field molecule | `src/design-system/molecules/Field/` |
| Dynamic form | `src/design-system/form/DynamicForm.tsx` |
| Lead config | `src/features/lead/leadConfig.ts` |
| Validation rules | `src/features/lead/validateLead.ts` |
| Submit action | `src/features/lead/submitLead.ts` |
| Lead page | `src/features/lead/LeadPage.tsx` |

`validateLead` is a pure function. It takes the config and the current values and returns field errors. Hidden fields are skipped, so company name is required only when lead type is Company.

## Layout

Desktop and mobile layout live in `src/features/lead/LeadPage.module.css`.

- Over 1024px: two columns inside a centered card. Full name and email share a row. Notes and consent span the full width. The submit button sits on the left edge of the form.
- Under 768px: one column, full-width inputs, and a submit button fixed to the bottom of the screen.
- Tablet (768px to 1024px) keeps the single column, inside the same card, with the button aligned to the form.

Breakpoint values are declared in `src/design-system/tokens/tokens.css`. The media queries in the layout file use those same pixel values.
