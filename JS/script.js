// Константы и начальные данные
const initialData = [
    { name: "Иван Иванов", email: "ivan@example.com", phone: "+7 (999) 123-45-67" },
    { name: "Мария Петрова", email: "maria@example.ru", phone: "+7 (999) 987-65-43" },
    { name: "Алексей Смирнов", email: "alex@example.com", phone: "+7 (999) 456-78-90" }
];

// Основной класс приложения
class TableManager {
    constructor() {
        this.tableData = [];
        this.initialize();
    }

    // Инициализация приложения
    initialize() {
        this.loadData();
        this.setupEventListeners();
        this.renderTable();
    }

    // Загрузка данных из localStorage
    loadData() {
        const storedData = localStorage.getItem('tableData');
        
        if (storedData) {
            this.tableData = JSON.parse(storedData);
        } else {
            this.tableData = [...initialData];
            this.saveData();
        }
    }

    // Сохранение данных в localStorage
    saveData() {
        localStorage.setItem('tableData', JSON.stringify(this.tableData));
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        const form = document.getElementById('dataForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Обработка отправки формы
    handleFormSubmit(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim()
        };

        if (this.validateFormData(formData)) {
            this.addRecord(formData);
            this.resetForm();
            this.showStatus('Запись успешно добавлена', 'success');
        }
    }

    // Валидация данных формы
    validateFormData(data) {
        let isValid = true;
        this.clearErrors();

        // Валидация имени
        if (!data.name) {
            this.showError('name', 'Имя обязательно для заполнения');
            isValid = false;
        }

        // Валидация email
        if (!data.email) {
            this.showError('email', 'Email обязателен для заполнения');
            isValid = false;
        } else if (!this.isValidEmail(data.email)) {
            this.showError('email', 'Введите корректный email (пример: user@example.com)');
            isValid = false;
        }

        // Валидация телефона
        if (!data.phone) {
            this.showError('phone', 'Телефон обязателен для заполнения');
            isValid = false;
        }

        return isValid;
    }

    // Проверка валидности email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Отображение ошибки для поля
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        field.classList.add('error');
        errorElement.textContent = message;
    }

    // Очистка ошибок
    clearErrors() {
        // Удаляем класс error у всех полей ввода
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('error');
        });
        
        // Очищаем сообщения об ошибках
        document.querySelectorAll('.error-message').forEach(element => {
            element.textContent = '';
        });
    }

    // Сброс формы
    resetForm() {
        document.getElementById('dataForm').reset();
    }

    // Добавление новой записи
    addRecord(data) {
        this.tableData.push(data);
        this.saveData();
        this.renderTable();
    }

    // Удаление записи
    deleteRecord(index) {
        this.tableData.splice(index, 1);
        this.saveData();
        this.renderTable();
        this.showStatus('Запись удалена', 'success');
    }

    // Отображение таблицы
    renderTable() {
        const tableBody = document.getElementById('tableBody');
        const emptyMessage = document.getElementById('emptyMessage');
        const dataTable = document.getElementById('dataTable');

        tableBody.innerHTML = '';

        if (this.tableData.length === 0) {
            dataTable.style.display = 'none';
            emptyMessage.style.display = 'block';
            return;
        }

        dataTable.style.display = 'table';
        emptyMessage.style.display = 'none';

        this.tableData.forEach((record, index) => {
            const row = tableBody.insertRow();
            
            // Добавляем ячейки с данными
            const nameCell = row.insertCell();
            const emailCell = row.insertCell();
            const phoneCell = row.insertCell();
            const actionCell = row.insertCell();
            
            nameCell.textContent = record.name;
            emailCell.textContent = record.email;
            phoneCell.textContent = record.phone;
            
            // Создаем кнопку удаления
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.className = 'btn btn-danger';
            deleteButton.onclick = () => this.deleteRecord(index);
            
            actionCell.appendChild(deleteButton);
        });
    }

    // Отображение статусного сообщения
    showStatus(message, type = 'info') {
        const statusElement = document.getElementById('statusMessage');
        
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        
        // Автоматическое скрытие сообщения через 3 секунды
        setTimeout(() => {
            statusElement.className = 'status-message';
        }, 3000);
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new TableManager();
});