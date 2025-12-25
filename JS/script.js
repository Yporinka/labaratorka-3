// =================== ЧАСТЬ 1: УПРАВЛЕНИЕ ДАННЫМИ В ТАБЛИЦЕ ===================

class TableManager {
    constructor() {
        // Инициализация данных таблицы
        this.initialData = [
            { name: "Иван Иванов", email: "ivan@example.com", phone: "+7 (999) 123-45-67" },
            { name: "Мария Петрова", email: "maria@example.ru", phone: "+7 (999) 234-56-78" },
            { name: "Алексей Сидоров", email: "alex@example.com", phone: "+7 (999) 345-67-89" }
        ];
        
        // Элементы DOM для таблицы
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.addButton = document.getElementById('add-btn');
        this.tableBody = document.getElementById('table-body');
        this.tableStatus = document.getElementById('table-status');
        
        // Загрузка данных из localStorage или инициализация начальными данными
        this.tableData = JSON.parse(localStorage.getItem('tableData'));
        if (!this.tableData || this.tableData.length === 0) {
            this.tableData = this.initialData;
            this.saveToLocalStorage();
        }
        
        // Инициализация обработчиков событий
        this.initEventListeners();
        
        // Отрисовка таблицы
        this.renderTable();
    }
    
    // Функция сохранения данных в localStorage
    saveToLocalStorage() {
        localStorage.setItem('tableData', JSON.stringify(this.tableData));
        this.tableStatus.textContent = 'Данные сохранены в localStorage';
        this.tableStatus.style.color = '#27ae60';
        
        // Через 2 секунды возвращаем обычный статус
        setTimeout(() => {
            this.tableStatus.textContent = 'Данные сохраняются автоматически в localStorage';
            this.tableStatus.style.color = '#7f8c8d';
        }, 2000);
    }
    
    // Функция отрисовки таблицы
    renderTable() {
        this.tableBody.innerHTML = '';
        
        this.tableData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td class="actions-cell">
                    <button class="btn btn-delete" data-index="${index}">Удалить</button>
                </td>
            `;
            this.tableBody.appendChild(row);
        });
        
        // Добавляем обработчики событий для кнопок удаления
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.deleteRow(index);
            });
        });
    }
    
    // Функция валидации формы
    validateForm() {
        let isValid = true;
        const name = this.nameInput.value.trim();
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        
        // Сброс предыдущих ошибок
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('input').forEach(el => el.classList.remove('error'));
        
        // Валидация имени
        if (!name) {
            document.getElementById('name-error').textContent = 'Поле "Имя" обязательно для заполнения';
            this.nameInput.classList.add('error');
            isValid = false;
        }
        
        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            document.getElementById('email-error').textContent = 'Поле "Email" обязательно для заполнения';
            this.emailInput.classList.add('error');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            document.getElementById('email-error').textContent = 'Введите корректный email (например: example@domain.com)';
            this.emailInput.classList.add('error');
            isValid = false;
        }
        
        // Валидация телефона
        if (!phone) {
            document.getElementById('phone-error').textContent = 'Поле "Телефон" обязательно для заполнения';
            this.phoneInput.classList.add('error');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Функция добавления новой строки
    addRow() {
        if (!this.validateForm()) return;
        
        const newRow = {
            name: this.nameInput.value.trim(),
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim()
        };
        
        this.tableData.push(newRow);
        this.saveToLocalStorage();
        this.renderTable();
        
        // Очистка формы
        this.nameInput.value = '';
        this.emailInput.value = '';
        this.phoneInput.value = '';
        
        // Сброс ошибок
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('input').forEach(el => el.classList.remove('error'));
        
        // Фокус на первое поле
        this.nameInput.focus();
    }
    
    // Функция удаления строки
    deleteRow(index) {
        this.tableData.splice(index, 1);
        this.saveToLocalStorage();
        this.renderTable();
    }
    
    // Инициализация обработчиков событий
    initEventListeners() {
        this.addButton.addEventListener('click', () => this.addRow());
        
        // Добавление по Enter
        [this.nameInput, this.emailInput, this.phoneInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addRow();
                }
            });
        });
    }
}

// =================== ЧАСТЬ 2: КАСТОМНЫЙ СЛАЙДЕР ===================

class CustomSlider {
    constructor() {
        // Данные слайдов
        this.slidesData = [
            {
                title: "Слайд 1",
                content: "Это первый слайд нашего кастомного слайдера. Он создан без использования сторонних библиотек."
            },
            {
                title: "Слайд 2",
                content: "Второй слайд демонстрирует плавные переходы между изображениями или текстовыми блоками."
            },
            {
                title: "Слайд 3",
                content: "Третий слайд показывает, как реализована навигация с помощью кнопок и точек."
            },
            {
                title: "Слайд 4",
                content: "Четвертый слайд замыкает кольцо слайдера. При переходе вперед с этого слайда откроется первый."
            }
        ];
        
        // Элементы DOM для слайдера
        this.slider = document.getElementById('slider');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.dotsContainer = document.getElementById('dots-container');
        this.autoToggle = document.getElementById('auto-toggle');
        this.currentSlideEl = document.getElementById('current-slide');
        this.totalSlidesEl = document.getElementById('total-slides');
        this.sliderStatus = document.getElementById('slider-status');
        
        // Переменные состояния слайдера
        this.currentSlideIndex = 0;
        this.slideInterval = null;
        this.slideDuration = 5000; // 5 секунд
        
        // Инициализация слайдера
        this.initSlider();
        this.initEventListeners();
    }
    
    // Функция инициализации слайдера
    initSlider() {
        // Очищаем слайдер
        this.slider.innerHTML = '';
        this.dotsContainer.innerHTML = '';
        
        // Создаем слайды и точки
        this.slidesData.forEach((slide, index) => {
            // Создаем слайд
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            slideElement.innerHTML = `
                <h3>${slide.title}</h3>
                <p>${slide.content}</p>
            `;
            this.slider.appendChild(slideElement);
            
            // Создаем точку навигации
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('data-index', index);
            this.dotsContainer.appendChild(dot);
            
            // Добавляем обработчик события для точки
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Устанавливаем общее количество слайдов
        this.totalSlidesEl.textContent = this.slidesData.length;
        
        // Обновляем позицию слайдера
        this.updateSliderPosition();
        
        // Запускаем автоматическое переключение
        this.startAutoSlide();
    }
    
    // Функция обновления позиции слайдера
    updateSliderPosition() {
        this.slider.style.transform = `translateX(-${this.currentSlideIndex * 100}%)`;
        
        // Обновляем активную точку
        document.querySelectorAll('.dot').forEach((dot, index) => {
            if (index === this.currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Обновляем номер текущего слайда
        this.currentSlideEl.textContent = this.currentSlideIndex + 1;
    }
    
    // Функция перехода к конкретному слайду
    goToSlide(index) {
        this.currentSlideIndex = index;
        this.updateSliderPosition();
        this.resetAutoSlide();
    }
    
    // Функция перехода к следующему слайду
    nextSlide() {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slidesData.length;
        this.updateSliderPosition();
        this.resetAutoSlide();
    }
    
    // Функция перехода к предыдущему слайду
    prevSlide() {
        this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slidesData.length) % this.slidesData.length;
        this.updateSliderPosition();
        this.resetAutoSlide();
    }
    
    // Функция запуска автоматического переключения
    startAutoSlide() {
        if (this.autoToggle.checked) {
            this.slideInterval = setInterval(() => this.nextSlide(), this.slideDuration);
            this.updateSliderStatus('Автопрокрутка включена');
        }
    }
    
    // Функция остановки автоматического переключения
    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
            this.updateSliderStatus('Автопрокрутка выключена');
        }
    }
    
    // Функция сброса автоматического переключения
    resetAutoSlide() {
        this.stopAutoSlide();
        if (this.autoToggle.checked) {
            this.startAutoSlide();
        }
    }
    
    // Обновление статуса слайдера
    updateSliderStatus(status) {
        this.sliderStatus.innerHTML = `${status}. Текущий слайд: <span id="current-slide">${this.currentSlideIndex + 1}</span> из <span id="total-slides">${this.slidesData.length}</span>`;
    }
    
    // Инициализация обработчиков событий
    initEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.autoToggle.addEventListener('change', () => {
            if (this.autoToggle.checked) {
                this.startAutoSlide();
            } else {
                this.stopAutoSlide();
            }
        });
        
        // Пауза автоматического переключения при наведении мыши на слайдер
        this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.slider.addEventListener('mouseleave', () => {
            if (this.autoToggle.checked) {
                this.startAutoSlide();
            }
        });
        
        // Поддержка клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
}

// =================== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ===================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем менеджер таблицы
    const tableManager = new TableManager();
    
    // Инициализируем слайдер
    const slider = new CustomSlider();
    
    // Добавляем информацию о перезагрузке
    console.log('Приложение инициализировано. Данные загружены из localStorage.');
});