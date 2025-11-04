# 🎯 Task 2 – Donation Card with Progress  
**Volunteer:** Apurbo Dey Mishu  
**Organization:** York Region Educational Services (YRES)  
**Goal:** Build a reusable, responsive, and accessible Donation Card that visually matches the York Education donation page and integrates the CanadaHelps donation link.

---

## 📘 Overview
This component is a **self-contained React JSX component** styled with **Tailwind CSS and daisyUI**.  
It communicates YRES's mission, displays fundraising progress with a visual progress bar, and includes a high-contrast "Donate Now" call-to-action button that opens the CanadaHelps donation form in a new tab.

The component follows the **York Education brand palette**:
- **Primary:** YRES Teal `#3D96AB`  
- **Background:** White card on neutral container
- **Text:** Gray body text (`text-gray-700`) with darker headings (`text-gray-900`)  

It meets **WCAG AA accessibility** standards with ARIA roles, logical heading structure (h2→h3→h4), keyboard navigation support, and live regions for screen reader announcements.

---

## 🧱 Features
- ✅ **Editable Content:** All text strings (title, subtitle, mission, progress labels, CTA) fully configurable via props
- ✅ **Dynamic Progress Bar:** Reflects `raised / goal` ratio, visually capped at 100%, formatted in Canadian currency
- ✅ **Edge Case Handling:** If goal=0, shows 0%; if raised>goal, caps visual bar at 100% but displays true dollar amounts
- ✅ **CTA Button:** "Donate Now" opens the configurable CanadaHelps link in a new tab with visible hover/focus states
- ✅ **Accessibility:** 
  - Progress bar uses `role="progressbar"` with proper ARIA attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`)
  - Progress caption wrapped in `aria-live="polite"` for screen reader updates
  - Keyboard accessible with clear focus rings
  - WCAG AA color contrast verified
- ✅ **Responsive Layout:** Full-width on mobile (≤480px), centered with comfortable margins on tablet/desktop, max-width constrained for readability
- ✅ **Performance:** No layout shifts (reserved heights), no console errors, isolated component styles

---

## 🚀 Getting Started

To clone, install, and run locally:
```bash
# 1️⃣ Clone the repository
git clone https://github.com/mishu2424/U-Toastmasters.git

# 2️⃣ Navigate to the Donation Card project folder
cd "U-Toastmasters/1st Project/Donation-Card"

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start the development server
npm run dev
```

The component will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## 📝 Configuration

### Basic Usage
```jsx
import DonationCard from './DonationCard';

function App() {
  return <DonationCard raised={5000} goal={20000} />;
}
```

### All Available Props
```jsx
<DonationCard
  // Fundraising amounts
  raised={2500}                    // Amount raised in dollars
  goal={15000}                     // Goal amount in dollars
  
  // Content (all optional with defaults)
  title="Donate"
  subtitle="Make an Impact with YRES"
  missionHeading="Our Mission"
  missionBody={[
    "Paragraph one...",
    "Paragraph two..."
  ]}
  progressHeading="We've Raised…"
  ctaText="Donate Now"
  ctaHref="https://www.canadahelps.org/YOUR-ORG-URL"  // Update this!
/>
```

### Quick Configuration Guide
- **Change fundraising amounts:** Update `raised` and `goal` props
- **Update donation link:** Replace `ctaHref` with your actual CanadaHelps URL
- **Customize text:** Pass any prop to override defaults (title, subtitle, etc.)

---

## ✅ Acceptance Criteria Met

| Requirement | Status |
|-------------|--------|
| Matches York Education look and feel | ✅ YRES teal (#3D96AB), rounded corners, subtle shadow, spacing |
| All content sections present and editable | ✅ Title, subtitle, mission, progress, CTA all configurable |
| Progress bar reflects configured values | ✅ Dynamic with Canadian currency formatting |
| CTA opens in new tab | ✅ `target="_blank"` with `rel="noopener noreferrer"` |
| Keyboard/focus states and ARIA support | ✅ Focus rings, progressbar role, live regions |
| Responsive on mobile/tablet/desktop | ✅ Full-width mobile, centered tablet/desktop, no overflow |
| Clean code with header comment | ✅ Organized, commented "Task 2 – Donation Card with Progress" |

---

## 🔧 Technical Notes

- **Dependencies:** Tailwind CSS and daisyUI must be configured in your project
- **Browser Support:** Modern browsers with ES6+ support
- **Currency Format:** Uses `en-CA` locale for Canadian dollar formatting ($2,500 format)
- **Layout Isolation:** Component is self-contained; parent page controls outer container/background

---

## 📄 License & Credits

Component built for **York Region Educational Services (YRES)** as part of volunteer work.  
Volunteer: Apurbo Dey Mishu