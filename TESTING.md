# Testing — v0.9.2.1

## Built-in Testkonto

Use this account for repeated QA without registering a new account:

- E-mail: `test@galizischebahn.de`
- Password: `GBTest092!`

On the login screen, **Testkonto einsetzen** fills both fields. The account is compiled into the development client, so it is available again on a fresh local state. It is not a production credential.

## Automated QA

Run from the release root:

```bash
node qa-v092.mjs
```

Final internal results for this patch:

- **60 / 60** logic/static checks
- **20 / 20** full regression browser checks
- **5 / 5** targeted built-in-Testkonto browser checks

The regression coverage includes GB Konto registration/sign-in, password verifier behavior, Live Journey lifecycle states, developer clock controls, San Juan del Río border chronology, official rail routing and responsive widths from 320 to 430 px.

## Manual Safari checks recommended before deployment

1. Open GB Konto and use **Testkonto einsetzen**.
2. Sign in, sign out, then sign in again with the same test account.
3. Clear website/PWA data and confirm the built-in Testkonto is still offered after reopening the fresh build.
4. Create a separate local account and confirm both the local account and built-in Testkonto remain usable.
5. Verify German, Spanish and English text, dark mode, keyboard behavior and PWA update behavior.

All railway status and payment data are simulated. Do not use real banking data or a real personal password in the demo.
