# Design Brief

## Direction
Limra Diagnostic Center — A clean, professional medical platform with light cool aesthetics, deep ocean blue accents, and refined typography for patient appointments and doctor management.

## Tone
Spa-like calm with precision: airy light background and subtle shadows create serene trust, complemented by sharp medical professionalism through typography and structured layout.

## Differentiation
Appointment wizard with visual step indicators and deep-ocean blue primary color distinguish this from generic healthcare UIs; gradient hero and card elevation create memorable depth.

## Color Palette

| Token            | OKLCH          | Role                                   |
|------------------|----------------|----------------------------------------|
| background       | 0.98 0.008 230 | Primary surface (cool off-white)       |
| foreground       | 0.18 0.015 230 | Primary text (dark cool grey)           |
| card             | 1 0 0          | Elevated surfaces (pure white)          |
| primary          | 0.42 0.14 240  | CTAs, active states (deep ocean blue)  |
| accent           | 0.6 0.15 170   | Highlights, secondary actions (teal)   |
| muted            | 0.94 0.01 230  | Subtle backgrounds (very light blue)   |
| success          | 0.6 0.16 150   | Approval, positive feedback (green)    |
| destructive      | 0.55 0.22 25   | Cancellation, errors (red)             |

## Typography
- Display: Space Grotesk — modern geometric sans-serif for headings, hero text, and strong hierarchy
- Body: Inter — highly legible humanist sans-serif for form labels, descriptions, appointment details
- Mono: Geist Mono — clean fixed-width for doctor credentials and code elements
- Scale: hero `text-5xl md:text-6xl font-bold tracking-tight`, h2 `text-3xl font-semibold`, label `text-sm font-medium`, body `text-base`

## Elevation & Depth
Subtle layering via white cards (background: pure white) on cool off-white, soft `shadow-medical` (2px offset, 12px blur, 8% blue opacity) for breathing space, no harsh shadows.

## Structural Zones

| Zone    | Background        | Border                      | Notes                                                          |
|---------|-------------------|-----------------------------|----------------------------------------------------------------|
| Header  | bg-card/bg-primary | border-b border-border      | White header with primary accent bar or logo area              |
| Content | bg-background     | —                           | Cool off-white main area; alternate sections use bg-muted/40   |
| Cards   | bg-card           | border border-border/200    | White elevated surfaces with subtle border for definition       |
| Footer  | bg-muted/30       | border-t border-border      | Light muted background with top border, 4-column layout        |

## Spacing & Rhythm
Spacious 12–16px card padding, 24–32px section gaps, 8px micro-spacing for form fields and badge icons; visual rhythm prioritizes breathing room for medical context.

## Component Patterns
- Buttons: `btn-primary` (primary blue background, white text, 12px radius, hover opacity 90%), `btn-outline` (white background, primary border, blue text)
- Cards: `medical-card` (white background, 16px radius, subtle medical shadow, hover lift +0.5px)
- Badges: `appointment-step` (12px radius, semantic colors), muted inactive, primary active
- Forms: `form-card` (8px padding, clean label/input layout)

## Motion
- Entrance: fade-in (0.4s ease-out) on page load, slide-up (0.5s ease-out) on appointment steps
- Hover: shadow elevation (medical → medical-lg), -translate-y-0.5 for cards, opacity 90% for buttons
- Decorative: float (3s ease-in-out) for accent elements, slide-in (0.3s ease-out) for form transitions

## Constraints
- No dark mode (light-mode-only for medical safety and clarity)
- Pricing hidden until login (authentication required)
- All tokens use OKLCH (no hex, no named colors, no opacity mixing)
- Font display variable from CSS `--font-display`; body/mono via `--font-body`, `--font-mono`

## Signature Detail
Gradient hero (deep ocean blue 240° → teal 170°) creates memorable entry point while maintaining medical serenity; appointment wizard step indicators use primary-to-muted progression for intuitive progress feedback.
