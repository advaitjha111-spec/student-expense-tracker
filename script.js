// Student Budget Tracker JavaScript
class BudgetTracker {
    constructor() {
        this.transactions = [];
        this.currentEditId = null;
        this.charts = {};
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupDateDefaults();
        this.updateDashboard();
        this.renderTransactions();
        this.initializeCharts();
        this.applyTheme();
    }

    // Data Management
    loadData() {
        const savedData = localStorage.getItem('budgetTrackerData');
        if (savedData) {
            try {
                this.transactions = JSON.parse(savedData);
            } catch (error) {
                console.error('Error loading data:', error);
                this.transactions = [];
            }
        }
    }

    saveData() {
        try {
            localStorage.setItem('budgetTrackerData', JSON.stringify(this.transactions));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Error saving data', 'error');
        }
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Modal controls
        document.getElementById('add-income-btn').addEventListener('click', () => this.openModal('income-modal'));
        document.getElementById('add-expense-btn').addEventListener('click', () => this.openModal('expense-modal'));

        // Close modal buttons
        document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal || e.target.closest('[data-modal]')?.dataset.modal;
                if (modalId) this.closeModal(modalId);
            });
        });

        // Form submissions
        document.getElementById('income-form').addEventListener('submit', (e) => this.handleIncomeSubmit(e));
        document.getElementById('expense-form').addEventListener('submit', (e) => this.handleExpenseSubmit(e));
        document.getElementById('edit-form').addEventListener('submit', (e) => this.handleEditSubmit(e));

        // Filter and export controls
        document.getElementById('filter-category').addEventListener('change', (e) => this.filterTransactions(e.target.value));
        document.getElementById('export-csv').addEventListener('click', () => this.exportCSV());
        document.getElementById('import-csv-btn').addEventListener('click', () => document.getElementById('import-csv').click());
        document.getElementById('import-csv').addEventListener('change', (e) => this.importCSV(e));

        // Settings
        document.getElementById('clear-data-btn').addEventListener('click', () => this.clearAllData());

        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Form validation on input
        this.setupFormValidation();
    }

    setupFormValidation() {
        const forms = ['income-form', 'expense-form', 'edit-form'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            const inputs = form.querySelectorAll('input, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    setupDateDefaults() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('income-date').value = today;
        document.getElementById('expense-date').value = today;
    }

    // Navigation
    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show corresponding content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');

        // Update charts if switching to analytics
        if (tabName === 'analytics') {
            setTimeout(() => this.updateCharts(), 100);
        }
    }

    // Theme Management
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = document.querySelector('#theme-toggle i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Update charts with new theme
        setTimeout(() => this.updateCharts(), 100);
    }

    applyTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const icon = document.querySelector('#theme-toggle i');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        
        // Focus first input
        const firstInput = modal.querySelector('input, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        
        // Reset form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            this.clearFormErrors(form);
        }
        
        // Reset edit state
        this.currentEditId = null;
        this.setupDateDefaults();
    }

    // Form Validation
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id.split('-').pop();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'description':
                if (!value) {
                    errorMessage = 'Description is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Description must be at least 2 characters';
                    isValid = false;
                }
                break;
            
            case 'amount':
                const amount = parseFloat(value);
                if (!value) {
                    errorMessage = 'Amount is required';
                    isValid = false;
                } else if (isNaN(amount) || amount <= 0) {
                    errorMessage = 'Amount must be greater than 0';
                    isValid = false;
                } else if (amount > 1000000) {
                    errorMessage = 'Amount seems too large';
                    isValid = false;
                }
                break;
            
            case 'category':
                if (!value) {
                    errorMessage = 'Please select a category';
                    isValid = false;
                }
                break;
            
            case 'date':
                if (!value) {
                    errorMessage = 'Date is required';
                    isValid = false;
                } else {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                    
                    if (selectedDate > today) {
                        errorMessage = 'Date cannot be in the future';
                        isValid = false;
                    } else if (selectedDate < oneYearAgo) {
                        errorMessage = 'Date cannot be more than a year ago';
                        isValid = false;
                    }
                }
                break;
        }

        this.showFieldError(field, errorMessage, !isValid);
        return isValid;
    }

    showFieldError(field, message, show) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.toggle('show', show);
        }
        field.classList.toggle('error', show);
    }

    clearFieldError(field) {
        this.showFieldError(field, '', false);
    }

    clearFormErrors(form) {
        form.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
            error.textContent = '';
        });
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
    }

    validateForm(form) {
        const fields = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Transaction Management
    handleIncomeSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);
        const transaction = {
            id: this.generateId(),
            type: 'income',
            description: document.getElementById('income-description').value.trim(),
            amount: parseFloat(document.getElementById('income-amount').value),
            category: 'income',
            date: document.getElementById('income-date').value,
            timestamp: new Date().toISOString()
        };

        this.addTransaction(transaction);
        this.closeModal('income-modal');
        this.showNotification('Income added successfully!', 'success');
    }

    handleExpenseSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm(e.target)) {
            return;
        }

        const transaction = {
            id: this.generateId(),
            type: 'expense',
            description: document.getElementById('expense-description').value.trim(),
            amount: parseFloat(document.getElementById('expense-amount').value),
            category: document.getElementById('expense-category').value,
            date: document.getElementById('expense-date').value,
            timestamp: new Date().toISOString()
        };

        this.addTransaction(transaction);
        this.closeModal('expense-modal');
        this.showNotification('Expense added successfully!', 'success');
    }

    handleEditSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm(e.target)) {
            return;
        }

        const id = document.getElementById('edit-transaction-id').value;
        const updatedTransaction = {
            id: id,
            description: document.getElementById('edit-description').value.trim(),
            amount: parseFloat(document.getElementById('edit-amount').value),
            category: document.getElementById('edit-category').value,
            date: document.getElementById('edit-date').value,
            type: document.getElementById('edit-category').value === 'income' ? 'income' : 'expense'
        };

        this.updateTransaction(id, updatedTransaction);
        this.closeModal('edit-modal');
        this.showNotification('Transaction updated successfully!', 'success');
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.saveData();
        this.updateDashboard();
        this.renderTransactions();
        this.updateCharts();
    }

    updateTransaction(id, updatedData) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            this.transactions[index] = { ...this.transactions[index], ...updatedData };
            this.saveData();
            this.updateDashboard();
            this.renderTransactions();
            this.updateCharts();
        }
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveData();
            this.updateDashboard();
            this.renderTransactions();
            this.updateCharts();
            this.showNotification('Transaction deleted successfully!', 'success');
        }
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;

        // Populate edit form
        document.getElementById('edit-transaction-id').value = transaction.id;
        document.getElementById('edit-description').value = transaction.description;
        document.getElementById('edit-amount').value = transaction.amount;
        document.getElementById('edit-category').value = transaction.category;
        document.getElementById('edit-date').value = transaction.date;

        this.currentEditId = id;
        this.openModal('edit-modal');
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Dashboard Updates
    updateDashboard() {
        const totals = this.calculateTotals();
        
        document.getElementById('total-income').textContent = this.formatCurrency(totals.income);
        document.getElementById('total-expenses').textContent = this.formatCurrency(totals.expenses);
        document.getElementById('current-balance').textContent = this.formatCurrency(totals.balance);

        // Update balance card color based on positive/negative
        const balanceCard = document.querySelector('.balance-card');
        const balanceAmount = document.getElementById('current-balance');
        
        if (totals.balance < 0) {
            balanceCard.style.borderLeft = '4px solid var(--danger-color)';
            balanceAmount.style.color = 'var(--danger-color)';
        } else {
            balanceCard.style.borderLeft = '4px solid var(--primary-color)';
            balanceAmount.style.color = 'var(--text-primary)';
        }

        this.updateRecentTransactions();
    }

    updateRecentTransactions() {
        const recentContainer = document.getElementById('recent-transactions-list');
        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);

        if (recentTransactions.length === 0) {
            recentContainer.innerHTML = '<p class="no-data">No transactions yet. Add your first income or expense!</p>';
            return;
        }

        recentContainer.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-description">${this.escapeHtml(transaction.description)}</div>
                    <div class="transaction-meta">
                        <span class="category-badge ${transaction.category}">${transaction.category}</span>
                        • ${this.formatDate(transaction.date)}
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).join('');
    }

    calculateTotals() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expenses,
            balance: income - expenses
        };
    }

    // Transaction Rendering
    renderTransactions() {
        const tbody = document.getElementById('transactions-tbody');
        const filterValue = document.getElementById('filter-category').value;
        
        let filteredTransactions = this.transactions;
        if (filterValue !== 'all') {
            filteredTransactions = this.transactions.filter(t => t.category === filterValue);
        }

        // Sort by date (newest first)
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filteredTransactions.length === 0) {
            tbody.innerHTML = '<tr class="no-data-row"><td colspan="5">No transactions found</td></tr>';
            return;
        }

        tbody.innerHTML = filteredTransactions.map(transaction => `
            <tr>
                <td>${this.formatDate(transaction.date)}</td>
                <td>${this.escapeHtml(transaction.description)}</td>
                <td><span class="category-badge ${transaction.category}">${transaction.category}</span></td>
                <td class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </td>
                <td class="transaction-actions">
                    <button class="edit-btn" onclick="budgetTracker.editTransaction('${transaction.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="budgetTracker.deleteTransaction('${transaction.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    filterTransactions(category) {
        this.renderTransactions();
    }

    // Charts
    initializeCharts() {
        this.createExpensePieChart();
        this.createMonthlyTrendsChart();
    }

    createExpensePieChart() {
        const ctx = document.getElementById('expense-pie-chart').getContext('2d');
        
        this.charts.expensePie = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#f59e0b', // food
                        '#3b82f6', // transport
                        '#8b5cf6', // books
                        '#ec4899', // entertainment
                        '#64748b'  // others
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = this.formatCurrency(context.raw);
                                const percentage = ((context.raw / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createMonthlyTrendsChart() {
        const ctx = document.getElementById('monthly-trends-chart').getContext('2d');
        
        this.charts.monthlyTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Income',
                        data: [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Expenses',
                        data: [],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    },
                    y: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                            callback: (value) => this.formatCurrency(value)
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        this.updateExpensePieChart();
        this.updateMonthlyTrendsChart();
    }

    updateExpensePieChart() {
        const expensesByCategory = {};
        
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(transaction => {
                expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
            });

        const labels = Object.keys(expensesByCategory);
        const data = Object.values(expensesByCategory);

        if (this.charts.expensePie) {
            this.charts.expensePie.data.labels = labels;
            this.charts.expensePie.data.datasets[0].data = data;
            this.charts.expensePie.update();
        }
    }

    updateMonthlyTrendsChart() {
        const monthlyData = {};
        
        this.transactions.forEach(transaction => {
            const month = transaction.date.substring(0, 7); // YYYY-MM
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expenses: 0 };
            }
            
            if (transaction.type === 'income') {
                monthlyData[month].income += transaction.amount;
            } else {
                monthlyData[month].expenses += transaction.amount;
            }
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        const incomeData = sortedMonths.map(month => monthlyData[month].income);
        const expenseData = sortedMonths.map(month => monthlyData[month].expenses);
        const labels = sortedMonths.map(month => {
            const date = new Date(month + '-01');
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });

        if (this.charts.monthlyTrends) {
            this.charts.monthlyTrends.data.labels = labels;
            this.charts.monthlyTrends.data.datasets[0].data = incomeData;
            this.charts.monthlyTrends.data.datasets[1].data = expenseData;
            this.charts.monthlyTrends.update();
        }
    }

    // CSV Export/Import
    exportCSV() {
        if (this.transactions.length === 0) {
            this.showNotification('No transactions to export', 'warning');
            return;
        }

        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
        const csvContent = [
            headers.join(','),
            ...this.transactions.map(t => [
                t.date,
                `"${t.description.replace(/"/g, '""')}"`,
                t.category,
                t.type,
                t.amount
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `budget-tracker-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('Data exported successfully!', 'success');
    }

    importCSV(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');
                const headers = lines[0].split(',');
                
                // Validate headers
                const expectedHeaders = ['Date', 'Description', 'Category', 'Type', 'Amount'];
                if (!expectedHeaders.every(header => headers.includes(header))) {
                    throw new Error('Invalid CSV format. Expected headers: ' + expectedHeaders.join(', '));
                }

                const newTransactions = [];
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    const values = this.parseCSVLine(line);
                    if (values.length !== headers.length) continue;

                    const transaction = {
                        id: this.generateId(),
                        date: values[0],
                        description: values[1].replace(/^"|"$/g, '').replace(/""/g, '"'),
                        category: values[2],
                        type: values[3],
                        amount: parseFloat(values[4]),
                        timestamp: new Date().toISOString()
                    };

                    // Validate transaction
                    if (transaction.date && transaction.description && transaction.category && 
                        transaction.type && !isNaN(transaction.amount)) {
                        newTransactions.push(transaction);
                    }
                }

                if (newTransactions.length > 0) {
                    this.transactions.push(...newTransactions);
                    this.saveData();
                    this.updateDashboard();
                    this.renderTransactions();
                    this.updateCharts();
                    this.showNotification(`Imported ${newTransactions.length} transactions successfully!`, 'success');
                } else {
                    this.showNotification('No valid transactions found in CSV', 'warning');
                }
            } catch (error) {
                console.error('CSV import error:', error);
                this.showNotification('Error importing CSV: ' + error.message, 'error');
            }
        };

        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    // Settings
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            if (confirm('This will permanently delete all your transactions. Are you absolutely sure?')) {
                this.transactions = [];
                this.saveData();
                this.updateDashboard();
                this.renderTransactions();
                this.updateCharts();
                this.showNotification('All data cleared successfully!', 'success');
            }
        }
    }

    // Utility Functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageElement = notification.querySelector('.notification-message');
        const iconElement = notification.querySelector('.notification-icon');
        
        // Set message and type
        messageElement.textContent = message;
        notification.className = `notification ${type}`;
        
        // Set appropriate icon
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        iconElement.className = `notification-icon ${icons[type] || icons.success}`;
        
        // Show notification
        notification.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.budgetTracker = new BudgetTracker();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to close modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            window.budgetTracker.closeModal(activeModal.id);
        }
    }
    
    // Ctrl/Cmd + I for add income
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        window.budgetTracker.openModal('income-modal');
    }
    
    // Ctrl/Cmd + E for add expense
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        window.budgetTracker.openModal('expense-modal');
    }
});

// Handle window resize for charts
window.addEventListener('resize', () => {
    if (window.budgetTracker && window.budgetTracker.charts) {
        Object.values(window.budgetTracker.charts).forEach(chart => {
            if (chart) chart.resize();
        });
    }
});
