---
name: doc-to-interactive-web
description: Transforms static documentation into high-fidelity, interactive web experiences using Next.js and modern design principles.
---

# Document to Interactive Web

## 📋 Overview
This skill transforms static documentation (Markdown, PDF, Text) into high-fidelity, interactive web experiences. It focuses on converting linear text into structured, engaging, and visually stunning web applications using modern web technologies.

## 🏗️ Architecture & Stack
- **Framework**: Next.js 16+ (App Router)
- **Styling**: Vanilla CSS or Tailwind CSS (if requested)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Typography**: Modern Google Fonts (Inter, Outfit)
- **Content Parsing**: React-Markdown, Gray-matter

## 💻 Design Principles
1. **Visual Excellence**: Use glassmorphism, subtle gradients, and a curated color palette (e.g., Slate + Indigo).
2. **Interactivity**: 
   - **TOC**: Sticky table of contents with scroll spy.
   - **Interactive Elements**: Replace static lists with cards or accordions.
   - **Data Visualization**: Convert numerical data into Recharts.
   - **Animations**: Smooth transitions between sections and hover effects.
3. **Responsive**: Mobile-first design that scales beautifully to desktop.

## 🔧 Transformation Workflow

### 1. Structure Analysis
- Identify headings to create a navigation hierarchy.
- Detect "Steps" or "Sequences" to convert into a Timeline or Stepper component.
- Detect "Key Features" or "Benefits" to convert into a Grid of Cards.
- Detect "Code Blocks" to enhance with copy-to-clipboard and syntax highlighting.

### 2. Component Mapping
| Static Element | Interactive Component |
|----------------|-----------------------|
| Table of Contents | Sticky Sidebar / ScrollSpy |
| Sequential List | Stepper / Vertical Timeline |
| Feature List | Hover-active Cards |
| Complex Data | Interactive Dashboard / Charts |
| FAQ Section | Animated Accordions |
| Callouts/Notes | Styled Alerts with Icons |

### 3. Implementation Patterns
- Use `framer-motion` for entry animations: `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}`.
- Implement "Glassmorphism" for cards: `background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);`.
- Add a progress bar at the top of the page.

## ⚠️ Guidelines
- Do not just render markdown. **Deconstruct** it.
- Ensure high contrast and accessibility.
- Keep the design clean and "Apple-esque" — plenty of white space and premium typography.

## 📖 Example Usage
**Input**: A markdown file with headers and lists.
**Output**: A Next.js page with a sidebar, animated sections, and interactive feature cards.
