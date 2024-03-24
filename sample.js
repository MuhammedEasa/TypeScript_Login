"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = require('path');
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
// Authentication service class
class AuthService {
    constructor() {
        this.users = [
            { username: 'user', password: 'pass' }
        ];
    }
    // Method to register a new user
    registerUser(user) {
        this.users.push(user);
        console.log(`User "${user.username}" registered successfully.`);
    }
    // Method to authenticate a user
    authenticateUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.users.find((u) => u.username === username && u.password === password);
            return !!user;
        });
    }
}
// Dependency Injection
const authService = new AuthService();
// Express app
const app = (0, express_1.default)();
const port = 3000;
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Middleware to parse form data
app.use(body_parser_1.default.urlencoded({ extended: true }));
//session
app.use((0, express_session_1.default)({
    secret: 'your-secret-key', // Change this to a strong and secure secret
    resave: false,
    saveUninitialized: true,
}));
let user;
// Routes
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    }
    else {
        console.log(req.session.user);
        res.render('login');
    }
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (yield authService.authenticateUser(username, password)) {
        // res.send(`Welcome, ${username}!`);\
        user = username;
        req.session.user = username;
        res.redirect('/home');
    }
    else {
        res.send('Invalid username or password. Please try again.');
    }
}));
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { user });
    }
    else {
        res.redirect('/');
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
