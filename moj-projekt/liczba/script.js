let history = [];

// Функция для проверки авторизации и обновления интерфейса
async function checkAuthentication() {
    try {
        const response = await fetch('/api/check-auth'); // Подставьте URL вашего API для проверки авторизации
        const data = await response.json();

        if (data.authenticated) {
            // Пользователь авторизован
            const username = data.user.username; // Предполагается, что данные о пользователе содержат username
            const profilePopup = document.getElementById('profilePopup');
            const usernameElement = profilePopup.querySelector('#username');
            const logoutLink = profilePopup.querySelector('.btn-logout');

            // Отображаем всплывающее окно профиля
            profilePopup.style.display = 'block';
            profilePopup.style.left = `${profileIcon.offsetLeft}px`; // Выравниваем окно по горизонтали с иконкой профиля
            profilePopup.style.top = `${profileIcon.offsetTop + profileIcon.offsetHeight}px`; // Размещаем окно ниже иконки

            // Устанавливаем имя пользователя
            usernameElement.textContent = `Привет, ${username}!`;

            // Устанавливаем обработчик на кнопку "Выход"
            logoutLink.setAttribute('href', '/logout'); // Убедитесь, что href указывает на ваш роут для выхода

        } else {
            // Пользователь не авторизован
            const profilePopup = document.getElementById('profilePopup');
            profilePopup.style.display = 'none'; // Скрываем всплывающее окно профиля, если пользователь не авторизован
        }
    } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
    }
}

// Функция для генерации случайного числа
function generateRandomNumber() {
    const min = parseInt(document.getElementById('min').value);
    const max = parseInt(document.getElementById('max').value);
    const resultContainer = document.getElementById('result');
    const previousRequestsContainer = document.getElementById('previousRequestsContainer');

    if (isNaN(min) || isNaN(max)) {
        resultContainer.textContent = 'Please enter valid numbers.';
        return;
    }

    if (min >= max) {
        resultContainer.textContent = 'Min should be less than max.';
        return;
    }

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    resultContainer.textContent = `Random number: ${randomNumber}`;

    // Добавляем текущий результат в историю
    history.unshift(randomNumber);

    // Ограничиваем историю только тремя последними значениями
    if (history.length > 3) {
        history.pop(); // Удаляем старый результат, если история длиннее трех элементов
    }

    // Отображаем список предыдущих запросов
    previousRequestsContainer.innerHTML = '';
    history.forEach((item, index) => {
        const inputElement = document.createElement('div');
        inputElement.textContent = `Previous result was: ${item}`;
        previousRequestsContainer.appendChild(inputElement);
    });

    if (history.length >= 3) {
        previousRequestsContainer.style.display = 'block';
    }
}

// Функция для отображения и скрытия всплывающего окна профиля
function toggleProfilePopup() {
    const profilePopup = document.getElementById('profilePopup');
    const profileIcon = document.getElementById('profileIcon');
    const usernameElement = profilePopup.querySelector('#username');
    const logoutLink = profilePopup.querySelector('.btn-logout');

    // Устанавливаем имя пользователя и обработчик на кнопку "Выход"
    if (profilePopup.style.display === 'none') {
        profilePopup.style.display = 'block';
        profilePopup.style.left = `${profileIcon.offsetLeft}px`; // Выравниваем окно по горизонтали с иконкой профиля
        profilePopup.style.top = `${profileIcon.offsetTop + profileIcon.offsetHeight}px`; // Размещаем окно ниже иконки
        checkAuthentication(); // Проверяем авторизацию при открытии всплывающего окна
    } else {
        profilePopup.style.display = 'none';
    }
}

// Функция для инициализации скрипта после загрузки страницы
function init() {
    checkAuthentication(); // Проверяем авторизацию при загрузке страницы

    // Добавляем обработчик на кнопку "Сгенерировать"
    const generateButton = document.getElementById('generateButton');
    generateButton.addEventListener('click', generateRandomNumber);

    // Добавляем обработчик на иконку профиля для отображения/скрытия всплывающего окна
    const profileIcon = document.getElementById('profileIcon');
    profileIcon.addEventListener('click', toggleProfilePopup);

    // Закрываем всплывающее окно профиля при клике вне его области
    document.addEventListener('click', function(event) {
        const profilePopup = document.getElementById('profilePopup');
        if (!profilePopup.contains(event.target) && event.target !== profileIcon) {
            profilePopup.style.display = 'none';
        }
    });
}

// Вызываем функцию инициализации после загрузки страницы
document.addEventListener('DOMContentLoaded', init);