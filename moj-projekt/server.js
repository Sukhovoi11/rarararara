const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Парсим данные application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Используем сессии в Express
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Вместо хранения пользователей в памяти (нужно использовать БД для реального приложения)
let users = [];

// Указываем статические файлы для каждой директории
app.use('/liczba', express.static(path.join(__dirname, 'liczba')));
app.use('/koleso', express.static(path.join(__dirname, 'koleso')));
app.use('/regist', express.static(path.join(__dirname, 'regist')));

// Главная страница по умолчанию - страница регистрации или авторизации
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'regist', 'kwer.html'));
});

// Обработка регистрации
app.post('/register', async (req, res) => {
    const { username, email, password, password_confirm } = req.body;

    // Простая проверка пароля (можно расширить)
    if (password !== password_confirm) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        // Хэшируем пароль перед сохранением
        const hashedPassword = await bcrypt.hash(password, 10); // 10 - степень хэширования

        // Проверяем, что пользователь с таким email не зарегистрирован (это простой пример)
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).send('User with this email already exists');
        }

        // Создаем пользователя (здесь должно быть добавление в базу данных)
        const newUser = {
            username,
            email,
            password: hashedPassword
        };
        users.push(newUser);

        // Сохраняем пользователя в сессии (для примера)
        req.session.user = newUser;

        // Отправляем пользователя на страницу с генератором случайных чисел (основной сайт)
        return res.redirect('/liczba/123123.html');
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).send('Internal Server Error');
    }
});

// Обработка авторизации
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        // Проверка пароля с использованием bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Invalid email or password');
        }

        req.session.user = user;
        return res.redirect('/liczba/123123.html');
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).send('Internal Server Error');
    }
});

// Проверка авторизации при доступе к /liczba/123123.html
app.get('/liczba/123123.html', (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/'); // Если пользователь не авторизован, перенаправляем на страницу регистрации
    }

    // В реальном приложении здесь может быть логика для отображения страницы

    // Отправляем HTML страницу с генератором случайных чисел
    return res.sendFile(path.join(__dirname, 'liczba', '123123.html'));
});

// Проверка авторизации при доступе к /koleso/wheel-of-fortune.html
app.get('/koleso/wheel-of-fortune.html', (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/'); // Если пользователь не авторизован, перенаправляем на страницу регистрации
    }

    // В реальном приложении здесь может быть логика для отображения страницы

    // Отправляем HTML страницу с колесом фортуны
    return res.sendFile(path.join(__dirname, 'koleso', 'wheel-of-fortune.html'));
});

// Роут для выхода
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/liczba/123123.html');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Профиль пользователя (для примера)
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.render('profile', { username: req.session.user.username });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});