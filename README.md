# Student Budget Tracker

A comprehensive web-based budget tracking application designed specifically for students to manage their finances effectively.

## Features

### Core Functionality
- **Income & Expense Tracking**: Add, edit, and delete financial transactions
- **Real-time Dashboard**: View total income, expenses, and current balance
- **Category Management**: Organize expenses by categories (Food, Transport, Books, Entertainment, Others)
- **Transaction History**: Complete list of all transactions with filtering options

### Advanced Features
- **Data Visualization**: 
  - Pie chart showing expense breakdown by category
  - Line chart displaying monthly income and expense trends
- **Data Management**:
  - CSV export for backup and analysis
  - CSV import for bulk data entry
  - Local storage persistence
- **User Experience**:
  - Light/Dark theme toggle
  - Responsive design for all devices
  - Form validation with helpful error messages
  - Keyboard shortcuts (Ctrl+I for income, Ctrl+E for expense)
  - Notifications for user actions

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: CSS Grid, Flexbox, CSS Variables for theming
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome
- **Storage**: Browser localStorage

## Installation & Setup

1. Download all project files to a directory
2. Open `index.html` in a modern web browser
3. No additional setup or dependencies required!

## File Structure

```
student-budget-tracker/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # Application logic and functionality
└── README.md           # Project documentation
```

## Usage Guide

### Getting Started
1. Open the application in your web browser
2. Use the "Add Income" and "Add Expense" buttons on the dashboard
3. Fill in the required information and submit

### Adding Transactions
- **Income**: Description, amount, and date
- **Expenses**: Description, amount, category, and date
- All fields include validation to ensure data quality

### Viewing Data
- **Dashboard**: Overview of financial status with recent transactions
- **Transactions**: Complete list with filtering and search options
- **Analytics**: Visual charts showing spending patterns
- **Settings**: Data management and application preferences

### Data Management
- **Export**: Download your data as CSV for external analysis
- **Import**: Upload CSV files to bulk import transactions
- **Clear Data**: Reset all data (with confirmation prompts)

## Features Overview

### Dashboard
- Total income, expenses, and balance cards
- Quick action buttons for adding transactions
- Recent transactions preview
- Visual indicators for negative balance

### Transaction Management
- Add income and expenses through modal forms
- Edit existing transactions
- Delete transactions with confirmation
- Filter by category
- Sort by date (newest first)

### Analytics
- Expense breakdown pie chart by category
- Monthly trends line chart showing income vs expenses
- Responsive charts that adapt to theme changes

### Accessibility Features
- Keyboard navigation support
- ARIA labels for screen readers
- High contrast mode support
- Focus indicators for keyboard users
- Reduced motion support for users with vestibular disorders

### Responsive Design
- Mobile-first approach
- Optimized for smartphones, tablets, and desktop
- Touch-friendly interface elements
- Collapsible navigation on smaller screens

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- All modern browsers with ES6 support

## Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Data persists across browser sessions
- Can be cleared manually through settings

## Keyboard Shortcuts

- `Ctrl/Cmd + I`: Add Income
- `Ctrl/Cmd + E`: Add Expense
- `Escape`: Close active modal

## Contributing

This is an educational project. Feel free to:
- Fork and modify for your needs
- Add new features
- Improve the design
- Fix bugs

## Future Enhancements

Potential features for future versions:
- Multiple budget categories
- Recurring transactions
- Budget goals and alerts
- Data synchronization across devices
- Advanced reporting features
- Integration with banking APIs

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Ensure you're using a modern browser
3. Clear browser cache if experiencing issues
4. Check that JavaScript is enabled

---

**Student Budget Tracker v1.0** - Helping students take control of their finances, one transaction at a time.
