import express, { Request, Response } from 'express';
const path = require('path');
import bodyParser from 'body-parser';
import session, { SessionData } from 'express-session';
import nocache from 'nocache'


declare module 'express-session' {
  interface SessionData {
    user?: string;
  }
}

// User model
interface User {
  username: string;
  password: string;
}


// Authentication service class
class AuthService {
  private users: User[] = [
    { username: 'user', password: 'pass' }
  ];

  // Method to register a new user
  registerUser(user: User): void {
    this.users.push(user);
    console.log(`User "${user.username}" registered successfully.`);
  }

  // Method to authenticate a user
  async authenticateUser(username: string, password: string): Promise<boolean> {
    const user = this.users.find((u) => u.username === username && u.password === password);
    return !!user;
  }
}

// Dependency Injection
const authService = new AuthService();

// Express app
const app = express();
const port = 3000;


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
//session
app.use(
  session({
    secret: 'your-secret-key', // Change this to a strong and secure secret
    resave: false,
    saveUninitialized: true,
  })
);

app.use(nocache())

let user: string
// Routes
app.get('/', (req: Request, res: Response) => {
  if (req.session.user) {
    res.redirect('/home')
  } else {
    console.log(req.session.user);
    res.render('login');
  }
});

app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (await authService.authenticateUser(username, password)) {
    // res.send(`Welcome, ${username}!`);\
    user = username
    req.session.user = username
    res.redirect('/home')
  } else {
    res.send('Invalid username or password. Please try again.');
  }
});

app.get('/home', (req: Request, res: Response) => {
  if (req.session.user) {
    console.log(req.session.user);
    res.render('home', { user })
  } else {
    res.redirect('/')
  }
})
app.get('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 
