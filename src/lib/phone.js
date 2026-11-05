// Phone helpers for the login form.
// To add a country, add one entry to COUNTRIES:
//   dial           country calling code, without "+"
//   trunkPrefix    the leading digit(s) used only inside the country ("0" in Nigeria),
//                  removed before adding the country code; "" if none
//   nationalLength allowed digit counts after the trunk prefix is removed
//   placeholder    example shown in the input, in the local format people type
export const COUNTRIES = [
  { iso: "MX", name: "Mexico", dial: "52", trunkPrefix: "", nationalLength: [10], placeholder: "55 1234 5678" },
  { iso: "NG", name: "Nigeria", dial: "234", trunkPrefix: "0", nationalLength: [10], placeholder: "0803 123 4567" },
];

// The store is Mexican, so Mexico is the default.
export const DEFAULT_COUNTRY = "MX";

export function getCountry(iso) {
  return COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0];
}

// Turns what the customer typed into the international form the API expects.
//   parsePhone("0803 123 4567", "NG")  -> { international: "+2348031234567", error: null }
//   parsePhone("55 1234 5678", "MX")   -> { international: "+525512345678", error: null }
//   parsePhone("+234 803 123 4567", "NG") also works (pasted international form).
// Returns { international: null, error: "message" } when the number can't be valid.
export function parsePhone(input, iso) {
  const country = getCountry(iso);
  // Remove spaces, dashes, brackets and dots.
  let digits = String(input ?? "").trim().replace(/[\s\-().]/g, "");

  if (!digits) return { international: null, error: "Phone number is required" };

  // Already international ("+234…" or "00234…")?
  let hadCountryCode = false;
  if (digits.startsWith("+")) {
    digits = digits.slice(1);
    hadCountryCode = true;
  } else if (digits.startsWith("00")) {
    digits = digits.slice(2);
    hadCountryCode = true;
  }

  if (!/^\d+$/.test(digits)) return { international: null, error: "Only numbers are allowed" };

  if (hadCountryCode) {
    if (!digits.startsWith(country.dial)) {
      return {
        international: null,
        error: `This number doesn't start with +${country.dial}. Choose the right country.`,
      };
    }
    digits = digits.slice(country.dial.length);
  }

  // Remove one leading trunk prefix (e.g. the 0 in 0803…), also after "+234 0803…".
  if (country.trunkPrefix && digits.startsWith(country.trunkPrefix)) {
    digits = digits.slice(country.trunkPrefix.length);
  }

  if (!country.nationalLength.includes(digits.length)) {
    return {
      international: null,
      error: `Enter a valid ${country.name} number, e.g. ${country.placeholder}`,
    };
  }

  return { international: `+${country.dial}${digits}`, error: null };
}

// "+2348031234567" with dial "234" -> "+234 *** 567"
export function maskPhone(international, dial) {
  const digits = String(international ?? "").replace(/\D/g, "");
  const last = digits.slice(-3);
  if (dial && digits.startsWith(dial)) return `+${dial} *** ${last}`;
  return `*** ${last}`;
}
