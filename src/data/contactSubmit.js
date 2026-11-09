// Reproduces the submit request from src/components/Contact.jsx (handleSubmit).

// Web3Forms public access key — safe to ship in client code; it only allows sending to the owner's inbox.
// (Hardcoded in Contact.jsx; copied as-is.)
const WEB3FORMS_ACCESS_KEY = 'd6f81333-9a41-4a2b-a847-b2195c6d9c05'

/**
 * @param {{ name: string, email: string, message: string }} values
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function submitContact(values) {
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `[Portfolio] New message from ${values.name}`,
        from_name: 'Portfolio Contact Form',
        ...values,
      }),
    })
    const data = await res.json().catch(() => ({}))
    const ok = Boolean(res.ok && data.success)
    return ok ? { ok: true } : { ok: false, error: data.message || `Request failed (${res.status})` }
  } catch (err) {
    return { ok: false, error: err?.message || 'Network error' }
  }
}
