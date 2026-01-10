# iTracksy Branding Guidelines

## Brand Overview

iTracksy is a powerful desktop application for tracking activities and managing projects efficiently. Our brand identity reflects our commitment to productivity, organization, and user-friendly design.

## Color Palette

### Primary Colors

| Color              | HSL                      | Hex     | Usage                                                    |
| ------------------ | ------------------------ | ------- | -------------------------------------------------------- |
| Primary            | hsl(222.2, 47.4%, 11.2%) | #121C2D | Main brand color, primary buttons, important UI elements |
| Primary Foreground | hsl(210, 40%, 98%)       | #F5F9FC | Text on primary color backgrounds                        |

### Secondary Colors

| Color                | HSL                      | Hex     | Usage                               |
| -------------------- | ------------------------ | ------- | ----------------------------------- |
| Secondary            | hsl(210, 40%, 96.1%)     | #EDF2F7 | Secondary UI elements, backgrounds  |
| Secondary Foreground | hsl(222.2, 47.4%, 11.2%) | #121C2D | Text on secondary color backgrounds |

### Accent Colors

| Color             | HSL                      | Hex     | Usage                            |
| ----------------- | ------------------------ | ------- | -------------------------------- |
| Accent            | hsl(210, 40%, 96.1%)     | #EDF2F7 | Highlights, focus states         |
| Accent Foreground | hsl(222.2, 47.4%, 11.2%) | #121C2D | Text on accent color backgrounds |

### Semantic Colors

| Color                  | HSL                      | Hex     | Usage                                 |
| ---------------------- | ------------------------ | ------- | ------------------------------------- |
| Destructive            | hsl(0, 84.2%, 60.2%)     | #EF4444 | Error states, delete actions          |
| Destructive Foreground | hsl(210, 40%, 98%)       | #F5F9FC | Text on destructive color backgrounds |
| Muted                  | hsl(210, 40%, 96.1%)     | #EDF2F7 | Subtle backgrounds, disabled states   |
| Muted Foreground       | hsl(215.4, 16.3%, 46.9%) | #64748B | Secondary text, helper text           |
| Border                 | hsl(214.3, 31.8%, 91.4%) | #E2E8F0 | Borders, dividers                     |

### Dark Mode Colors

| Color             | HSL                      | Hex     | Usage                           |
| ----------------- | ------------------------ | ------- | ------------------------------- |
| Background (Dark) | hsl(222.2, 84%, 4.9%)    | #030712 | Main background in dark mode    |
| Foreground (Dark) | hsl(210, 40%, 98%)       | #F5F9FC | Main text in dark mode          |
| Primary (Dark)    | hsl(210, 40%, 98%)       | #F5F9FC | Primary elements in dark mode   |
| Secondary (Dark)  | hsl(217.2, 32.6%, 17.5%) | #1E293B | Secondary elements in dark mode |

## Typography

### Font Family

- **Primary Font**: Inter (Google Fonts)
- **Weights Used**: Regular (400), Medium (500), Bold (700)
- **CSS Variable**: `--font-sans`

### Type Scale

| Element | Size            | Weight  | Line Height | Usage                    |
| ------- | --------------- | ------- | ----------- | ------------------------ |
| h1      | 2.25rem (36px)  | Bold    | 1.2         | Main page headings       |
| h2      | 1.875rem (30px) | Bold    | 1.2         | Section headings         |
| h3      | 1.5rem (24px)   | Bold    | 1.3         | Sub-section headings     |
| h4      | 1.25rem (20px)  | Bold    | 1.4         | Card headings            |
| Body    | 1rem (16px)     | Regular | 1.5         | Main text content        |
| Small   | 0.875rem (14px) | Regular | 1.5         | Secondary text, captions |

## Logo Usage

- **Minimum Size**: 32px height
- **Clear Space**: Maintain padding of at least 1/4 of the logo height around the logo
- **Background**: Preferably used on white or very light backgrounds
- **Dark Mode**: Use inverted version on dark backgrounds

## UI Elements

### Buttons

- **Border Radius**: 0.5rem (8px)
- **Padding**: 0.5rem 1rem (8px 16px)
- **Transitions**: 0.2s ease-out for all hover/active states

### Cards

- **Border Radius**: 0.5rem (8px)
- **Border**: 1px solid Border color
- **Shadow**: Subtle shadow for depth (0 2px 4px rgba(0,0,0,0.05))

### Form Elements

- **Input Height**: 2.5rem (40px)
- **Border Radius**: 0.5rem (8px)
- **Focus State**: Ring color with 2px outline

## Implementation Notes

- Use HSL color values for consistency across the application
- Implement dark mode using the `.dark` class selector
- Maintain accessibility standards with proper contrast ratios
- Use the Tailwind CSS utility classes for consistent implementation

## File Formats

- SVG preferred for icons and logo
- PNG with transparency as fallback
- Use WebP for optimized image assets

## Resources

- Font files location: `/assets/fonts/`
- Logo files: [Add location when available]
- Icon set: Font Awesome (imported in globals.css)
