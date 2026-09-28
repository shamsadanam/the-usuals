---
title: "useFormattedProperties"
description: "Formats object properties into Start Case labels with date formatting and fallback values."
---

# useFormattedProperties

`useFormattedProperties` formats source object properties for clean display in UI tables or description lists.

## Features

- **Start Case Conversion**: Transforms `snake_case` or `camelCase` keys into human-readable labels (e.g. `first_name` &rarr; `First Name`).
- **Omit Keys**: Removes specified internal or sensitive properties.
- **Date Formatting**: Processes specified date keys using a custom `dateFormatter`.
- **Fallback String**: Replaces `null` or `undefined` values with a customizable fallback string (default: `"N/A"`).

## Usage Example

```ts
const rawUser = ref({
  id: "usr_123",
  first_name: "Alex",
  created_at: "2026-03-15T09:45:00Z",
  phone: null,
  secret: "hidden"
})

const formatted = useFormattedProperties(rawUser, {
  omitKeys: ["secret", "id"],
  dateKeys: ["created_at"],
  dateFormatter: (val) => new Date(val).toLocaleDateString(),
  fallback: "Not Provided"
})
// Result: { "First Name": "Alex", "Created At": "3/15/2026", "Phone": "Not Provided" }
```
