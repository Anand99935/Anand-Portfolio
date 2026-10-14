/* Single source of truth for owner identity and contact details.
   Leave github / linkedin empty to hide every button that points at them. */
export const SITE = {
  name: "Anand Mandloi",
  firstName: "Anand",
  lastName: "Mandloi",
  initial: "A",
  role: "Full-Stack Software Engineer",
  email: "anandmandloi2018@gmail.com",
  phone: "+91 9993516100",
  resume: "/assets/Anand_Mandloi_Resume.pdf",
  github: "",
  linkedin: "",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://anandmandloi.vercel.app",
} as const;

export const MAILTO = `mailto:${SITE.email}`;
export const TEL = `tel:${SITE.phone.replace(/\s+/g, "")}`;
