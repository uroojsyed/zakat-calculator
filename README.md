# Human Appeal Canada — Zakat Calculator

A responsive, interactive Zakat calculator designed to make charitable giving more accessible, transparent, and intuitive.

This project reimagines the existing [Human Appeal Canada Zakat Calculator](https://humanappeal.ca/zakat-calculator), focusing on simplifying the calculation process, improving the user experience, and providing greater visibility into how Zakat obligations are determined.

## Project Overview

Zakat is an annual charitable obligation for eligible Muslims, generally calculated at 2.5% of qualifying net wealth.

Traditional Zakat calculators can involve multiple steps, unclear calculations, and limited feedback. This project aims to address these challenges through a streamlined, user-centred interface that allows users to understand their financial inputs, view calculations in real time, and make informed giving decisions.

### Project Objectives

- **Transparency:** Clearly communicate how Zakat is calculated, including assets, liabilities, Nisab thresholds, and the resulting obligation.
- **Usability:** Reduce unnecessary steps and simplify financial data entry.
- **Accessibility:** Provide a responsive, easy-to-navigate experience across desktop and mobile devices.
- **Real-time feedback:** Update calculations automatically as users enter or modify values.
- **Informed giving:** Help users understand their Zakat eligibility and connect their calculations to charitable giving opportunities.

## Features

### Interactive Zakat Calculator

- Dynamic entry of eligible assets and liabilities.
- Support for multiple financial categories.
- Gold and silver valuation inputs.
- Automatic calculation of net Zakatable wealth.
- Real-time Zakat estimates using the 2.5% rate.
- Add, edit, and remove individual financial entries.
- Reset functionality to clear calculations.

### Nisab Threshold Comparison

- Gold and silver Nisab reference values.
- Visual comparison of net wealth against the selected threshold.
- Progress indicators to help users understand eligibility.
- Explanatory information about Nisab and Zakat obligations.

### Calculation Transparency

- Live calculation summaries.
- Breakdown of total assets, liabilities, and estimated Zakat.
- Visual indicators showing how entered financial information contributes to the final result.
- Contextual explanations for calculation categories.

### User Experience

- Responsive layouts for desktop, tablet, and mobile devices.
- Expandable guidance and frequently asked questions.
- Accessible form labels and navigation controls.
- Integrated Human Appeal Canada donation links.
- Print-friendly styling.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Styling, layouts, responsive design |
| JavaScript | Calculation logic and interactions |
| SVG | Scalable graphic assets |
| Google Fonts | Web typography |

The application uses vanilla HTML, CSS, and JavaScript without a front-end framework or build system.

## Project Structure

```text
human-appeal-zakat-calculator/
│
├── index.html
│
├── css/
│   ├── styles.css
│   └── responsive.css
│
├── js/
│   └── app.js
│
├── assets/
│   └── human-appeal-logo.svg
│
└── README.md
```

### File Descriptions

**`index.html`**

Contains the page markup, including navigation, calculator interface, informational sections, and footer.

**`css/styles.css`**

Contains the main visual styles, including typography, colours, forms, cards, buttons, and layout components.

**`css/responsive.css`**

Contains media queries for responsive layouts and print formatting.

**`js/app.js`**

Handles Zakat calculations, dynamic form rendering, input processing, updates to calculation summaries, and interactive UI behaviour.

**`assets/`**

Stores reusable visual assets, including the Human Appeal Canada SVG logo.

## How the Calculator Works

1. **Enter Assets:** Users input eligible financial assets, such as cash, savings, investments, and precious metals.
2. **Enter Liabilities:** Users record applicable outstanding financial obligations.
3. **Calculate Net Wealth:** The calculator subtracts eligible liabilities from Zakatable assets.
4. **Compare Against Nisab:** Net wealth is compared with the relevant Nisab threshold.
5. **Estimate Zakat:** Where applicable, the calculator calculates 2.5% of qualifying net wealth.
6. **Review Results:** Users can view updated totals, breakdowns, and donation options.

Calculations update dynamically as financial information changes.

## Design Approach

### User-Centred Design

The interface prioritizes clear information hierarchy, reduced cognitive load, and immediate feedback.

Financial categories are presented in manageable sections, while contextual guidance helps users understand unfamiliar terms without leaving the calculator.

### Transparency and Explainability

Rather than presenting only a final Zakat amount, the calculator exposes the underlying financial information and intermediate calculations.

This approach is intended to improve user confidence and help individuals understand how their entered values affect their obligations.

### Accessibility and Responsiveness

The application incorporates semantic HTML, labelled inputs, responsive layouts, and visual hierarchy to support usability across devices.

Further accessibility testing and validation would be required before claiming full WCAG compliance.

## Future Improvements

- Integrate live gold and silver market prices.
- Add automated exchange-rate conversion.
- Introduce optional user research and usability testing.
- Evaluate calculator interactions using privacy-conscious analytics.
- Add input validation and calculation unit tests.
- Improve accessible announcements for dynamically updated results.
- Support multilingual interfaces.
- Connect calculator results more directly to the donation process.

## Development Notes

This repository separates the original single-file HTML implementation into reusable HTML, CSS, JavaScript, and SVG files.

The original calculation logic, content, and functionality have been retained during restructuring.

The built-in HTML download functionality does not currently bundle external CSS, JavaScript, or asset files. For a fully functioning copy, use the complete project directory.

Google Fonts and Human Appeal Canada navigation and donation links require an internet connection.

## Disclaimer

This calculator provides an estimated Zakat obligation for informational purposes. Individual circumstances and interpretations of Zakat requirements may differ. Users should consult a qualified religious authority when necessary.

## Credits

**Project:** Human Appeal Canada — Zakat Calculator

**Organization:** [Human Appeal Canada](https://humanappeal.ca)

**Focus:** User Experience, Web Development, Information Transparency, and Digital Accessibility.

This is a proposed redesign and development project. It should not be interpreted as an officially deployed Human Appeal Canada product unless formally adopted by the organization.
