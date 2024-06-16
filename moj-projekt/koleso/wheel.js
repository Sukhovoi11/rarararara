function createWheel() {
    const numSegmentsInput = document.getElementById('numSegments');
    const numSegments = parseInt(numSegmentsInput.value);

    if (isNaN(numSegments) || numSegments < 1 || numSegments > 9999) {
        alert('Please enter a valid number of segments between 1 and 9999.');
        return;
    }

    const wheel = document.getElementById('wheel');
    wheel.innerHTML = ''; // Очистить предыдущие секторы

    const degrees = 360 / numSegments;

    // Добавить секторы на колесо с заданным количеством сегментов
    for (let i = 0; i < numSegments; i++) {
        const sector = document.createElement('div');
        sector.classList.add('sector');
        sector.style.transform = `rotate(${i * degrees}deg)`;
        sector.textContent = (Math.floor(Math.random() * 9999) + 1).toString(); // Рандомное число от 1 до 9999
        wheel.appendChild(sector);
    }
}

function spinWheel() {
    const wheel = document.getElementById('wheel');
    const resultElement = document.getElementById('result');
    const numSegmentsInput = document.getElementById('numSegments');

    const numSegments = parseInt(numSegmentsInput.value);

    if (isNaN(numSegments) || numSegments <= 0) {
        alert('Please enter a valid number of segments.');
        return;
    }

    const degrees = 360 / numSegments;
    const randomNumber = Math.floor(Math.random() * numSegments) + 1;

    // Удалить transition перед началом вращения
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)'; // Сбросить поворот колеса

    // Выполнить вращение с анимацией
    setTimeout(() => {
        wheel.style.transition = 'transform 2s ease-out'; // Установить анимацию на 2 секунды
        const spinAngle = 3600 + (randomNumber - 1) * degrees; // Поворот на 3600 градусов + случайное число
        wheel.style.transform = `rotate(${spinAngle}deg)`;

        // Отобразить результат после остановки колеса
        setTimeout(() => {
            resultElement.textContent = `The wheel landed on ${randomNumber}!`;
        }, 2000); // Время анимации колеса (2 секунды)
    }, 100); // Небольшая задержка перед вращением
}