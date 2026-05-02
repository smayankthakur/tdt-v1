# Paywall Control Configuration

This file controls when the subscription system activates and how trial logic behaves.

---

## 🔑 MAIN VARIABLE

PAYWALL_START_DATE is the key control.

Current value:

PAYWALL_START_DATE = "2026-07-15T00:00:00Z"

---

## 🟢 FREE ACCESS PERIOD

Before this date:
- All users get unlimited free access
- No trial
- No subscription required

---

## 🔴 AFTER THIS DATE

System automatically:

1. Starts 3-day free trial for new users
2. After 3 days:
   - Blocks access
   - Shows subscription paywall

---

## ✏️ HOW TO CHANGE PAYWALL DATE

Edit:

config/paywall.js

Change:

export const PAYWALL_START_DATE = "YYYY-MM-DDT00:00:00Z";

---

## 📌 EXAMPLES

### Start immediately:
Set date to past:

"2026-01-01T00:00:00Z"

---

### Delay paywall:
Set future date:

"2026-08-01T00:00:00Z"

---

## 🔁 TRIAL DURATION CHANGE

Edit:

export const TRIAL_DURATION_DAYS = 3;

---

## 💰 PRICE CHANGE

Edit:

export const SUBSCRIPTION_PRICE = 199;

---

## ⚠️ IMPORTANT NOTES

- Do NOT hardcode dates in multiple places
- Always use PAYWALL_START_DATE
- All logic must reference central config

---

## ✅ TESTING CHECKLIST

- Before date → free access works
- After date → trial starts
- After 3 days → paywall triggers
- Subscription overrides all restrictions