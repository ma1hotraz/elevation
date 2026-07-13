function optionalUrl(value: string | undefined) {
  const clean = value?.trim();
  if (!clean) return "";
  try {
    const url = new URL(clean);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

const phoneDisplay = process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY?.trim() || "";
const phoneE164 = process.env.NEXT_PUBLIC_CONTACT_PHONE_E164?.trim() || "";
const configuredSiteUrl = optionalUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const siteConfig = {
  name: "Elevation Coaching Institute",
  description:
    "Canada-based coaching institute for offline Physics, Chemistry and Math, hybrid IELTS, and online French classes.",
  siteUrl: configuredSiteUrl || "http://localhost:3000",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  phoneDisplay,
  phoneHref: phoneE164 ? `tel:${phoneE164.replace(/[^+\d]/g, "")}` : "",
  location: process.env.NEXT_PUBLIC_CONTACT_LOCATION?.trim() || "Canada based",
  socialLinks: [
    { label: "Facebook", href: optionalUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL) },
    { label: "Instagram", href: optionalUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL) },
    { label: "YouTube", href: optionalUrl(process.env.NEXT_PUBLIC_YOUTUBE_URL) },
    { label: "LinkedIn", href: optionalUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL) },
  ].filter((item) => item.href),
};
