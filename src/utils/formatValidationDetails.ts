export function formatValidationDetails(details: unknown): string | null {
  if (details == null) return null;

  if (Array.isArray(details)) {
    const lines = details
      .map((item) => {
        if (item && typeof item === 'object') {
          const field =
            'field' in item && typeof item.field === 'string' ? item.field : null;
          const message =
            'message' in item && typeof item.message === 'string'
              ? item.message
              : JSON.stringify(item);
          return field ? `${field}: ${message}` : message;
        }
        return String(item);
      })
      .filter(Boolean);
    return lines.length > 0 ? lines.join('\n') : null;
  }

  if (typeof details === 'object') {
    const entries = Object.entries(details as Record<string, unknown>);
    if (entries.length === 0) return null;
    return entries.map(([k, v]) => `${k}: ${String(v)}`).join('\n');
  }

  return String(details);
}
