# 🎯 Task 2 – Donation Card with Progress  
**Volunteer:** Apurbo Dey Mishu  
**Organization:** York Region Educational Services (YRES)  
**Project Goal:** Create a reusable, responsive Donation Card component that visually matches the York Education donation page and integrates with the CanadaHelps donation link.

---

## 📘 Overview
This project contains a **self-contained React component** built using **Tailwind CSS** that displays YRES’s donation mission, fundraising progress, and a clear call-to-action button (“Donate Now”).  
The component follows YRES brand guidelines (teal primary, white background, gray body text) and accessibility best practices (WCAG AA, ARIA roles, keyboard focus, logical headings).

---

## 🧱 Features
- **Mission Section:** Displays the YRES mission statement (editable).
- **Progress Tracker:** Visual progress bar dynamically reflects `raised / goal` ratio.
- **CTA Button:** “Donate Now” button opens the CanadaHelps donation form in a new tab.
- **Responsive Design:** Works seamlessly on mobile, tablet, and desktop.
- **Accessible:**  
  - Keyboard and screen-reader friendly.  
  - WCAG AA color contrast.  
  - Progress bar uses `role="progressbar"` with ARIA attributes.
- **Brand Consistency:** Uses YRES teal (`#3D96AB`), Catamaran font, white/neutral background, and gray text.

---

## 🚀 Getting Started

Follow these steps to clone and run the project locally:

```bash
# 1️⃣ Clone the repository
git clone https://github.com/<your-username>/<your-project-name>.git

# 2️⃣ Navigate into the project folder
cd <your-project-name>

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start the local development server
npm run dev
