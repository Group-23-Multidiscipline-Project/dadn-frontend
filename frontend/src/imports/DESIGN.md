# Design System Document: Precision Agriculture & The Living Canvas

## 1. Overview & Creative North Star
### The Creative North Star: "The Digital Greenhouse"
This design system moves beyond the "industrial spreadsheet" look of traditional ag-tech. Our goal is to create a **Living Canvas**—an interface that feels as organic and responsive as the crops it monitors. We achieve this through **Atmospheric Depth**, where the UI isn't a flat plane, but a series of layered, translucent surfaces that mimic the clarity of a high-end greenhouse. 

By utilizing **intentional asymmetry**—such as offset data visualizations and wide-margin editorial layouts—we break the "template" feel. We prioritize breathing room over density, ensuring that high-stakes agricultural data is consumed with calm, professional focus.

---

## 2. Colors & The Surface Manifesto
The palette is rooted in the "Ideal State" (Emerald). However, we move beyond flat fills by using a sophisticated Material-based tonal scale.

### The Palette
- **Primary (Emerald):** `#006c49` (Action/Success). Use `primary_container` (`#31c98f`) for soft backgrounds of healthy data cards.
- **Secondary (Royal Blue):** `#0051d5` (Watering/Dynamics). Reserved for active mechanical processes like pumps or irrigation schedules.
- **Tertiary (Amber):** `#855300` (Recovery/Warning). Used sparingly to draw the eye to physiological stress in crops.

### The "No-Line" Rule
**Strict Mandate:** Prohibit the use of 1px solid borders for sectioning. 
Structure is defined through **Tonal Shifts**. To separate a sidebar from a main feed, transition from `surface` (`#f7f9fb`) to `surface_container_low` (`#f2f4f6`). 

### The "Glass & Gradient" Rule
To elevate the "out-of-the-box" feel, use **Glassmorphism** for floating overlays (e.g., quick-action pump controls). 
*   **Implementation:** Use a semi-transparent `surface_container_lowest` (White at 80% opacity) with a `backdrop-filter: blur(12px)`.
*   **Signature Textures:** Apply a subtle linear gradient from `primary` to `primary_container` on main CTA buttons to provide "soul" and a tactile, premium depth.

---

## 3. Typography: Editorial Authority
We pair **Manrope** (Display) for its geometric, modern character with **Inter** (Body) for its unparalleled legibility at small scales.

*   **Display & Headlines (Manrope):** Used for high-level metrics (e.g., "98% Soil Health"). The wide aperture of Manrope conveys transparency and modernism.
*   **Body & Labels (Inter):** Used for granular data and functional text. The neutral nature of Inter ensures that the agricultural data—not the font—is the hero.
*   **Hierarchy Tip:** Use `display-lg` for single "Hero Metrics" to create an editorial, high-contrast look that feels like a premium print magazine.

---

## 4. Elevation & Depth: The Layering Principle
We reject the standard "drop shadow on everything" approach. Instead, we use **Tonal Layering**.

*   **Stacking Surfaces:** Place a `surface_container_lowest` (#ffffff) card on top of a `surface_container` (#eceef0) background. This creates a natural, soft "lift" without visual clutter.
*   **Ambient Shadows:** For floating elements (like a weather forecast pop-over), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(25, 28, 30, 0.06)`. Note the use of `on_surface` color for the shadow tint to keep it natural.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` (#bdcabc) at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components
### Buttons & Chips
*   **Primary Button:** Uses the Emerald `primary` fill with `on_primary` text. Apply a `xl` (1.5rem) or `full` (9999px) roundedness for a friendly, modern touch.
*   **Action Chips:** Use `secondary_container` for "Active Watering" states. The text should be `on_secondary_fixed_variant` to maintain a high-contrast, professional tone.

### Input Fields & Controls
*   **Inputs:** Utilize `surface_container_highest` for the field background. Forbid the traditional bottom-line or full-outline. Use a subtle `md` (0.75rem) corner radius.
*   **Checkboxes/Radios:** Use `primary` for the selected state. The transition should be an organic "bloom" animation rather than a hard snap.

### Cards & Data Lists
*   **The "No-Divider" Rule:** In sensor lists (moisture, light, PH), never use horizontal lines. Use **Vertical Spacing Scale `5` (1.7rem)** or a subtle shift to `surface_container_low` to distinguish between different rows.
*   **Ag-Specific Component: "The Vitality Gauge":** A custom horizontal bar chart using a gradient from `tertiary_container` to `primary` to show the recovery of a plant from a warning state to an ideal state.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use whitespace as a functional tool. If a screen feels "empty," increase the `display-lg` font size of the primary metric rather than adding borders.
*   **DO** use `surface_bright` to highlight the most critical "Active" sensor in a grid.
*   **DO** use the `spacing-10` (3.5rem) token for outer page margins to create a "gallery" feel.

### Don't
*   **DON'T** use pure black (#000000) for text. Always use `on_surface` (#191c1e) to maintain a soft, premium contrast.
*   **DON'T** use standard 4px "rounded corners." Stick to the **Roundedness Scale `lg` (1rem) or `xl` (1.5rem)** to ensure the UI feels modern and approachable.
*   **DON'T** use high-saturation red for errors. Use the `error` token (#ba1a1a) which is tuned to sit harmoniously alongside the Emerald and Royal Blue.

---

## 7. Motion & Interaction
*   **Organic Growth:** When cards load, they should use a "fade-in and slide-up" motion with a `cubic-bezier(0.2, 0.8, 0.2, 1)` easing. This mimics the upward growth of a plant.
*   **Haptic Color:** When a pump is activated (Secondary Blue), the button should subtly pulse with a `secondary_fixed` glow to indicate "active flow."