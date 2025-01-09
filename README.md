# Odin-Book

Odin-Book is a full-stack social media application where users can post, follow, comment, and explore other profiles. It includes user authentication and a visitor mode for browsing without signing in.
Description

## Technologies used

### Backend

#### Node.js with Express

- for a scalable, event driven architecture, perfect for handling numerous requests, such as user authentication and data fetching

#### PostgreSQL with Prisma ORM

- offers a robust relational database for structured data like user and post interactions
- prisma simplifies database interactions, offering type safety and rapid development

#### Authentication (Passport.js)

- passport.js is a versatile middleware for handling secure user authentication

#### Cloudinary and multer for image management

- cloudinary handles image uploads with easiness, ensuring optimized image delivery. multer integrates it with express for handling multipart form data

### Frontend

#### React with TailwindCSS

- react's component based architecture simplifies building reusable UI elements, while Tailwind provides a modern, utility-first approach for styling, enabling faster, consistent designs

## Planning

Data models diagram

![alt text](<Odin-Book (1).png>)

## Dependencies

### Backend

- passport-google-oidc - Sign In With Google
- register app with Google, done with API & Services at Google Cloud Platform with OAuth2
- cloudinary.v2 + multer to upload image to posts/profile picture
- data modeling

#### npm packages:

- bcrypt, dotenv, cors, express-session, path, express-async-handler, express-validator, multer, cloudinaryStorage

### Frontend

- React
- Tailwind

#### Basic page structure

![alt text](image.png)

#### Layout:

- Footer and header are always displayed
- Dynamic page content is rendered based on the current route

## Challenges faced

- CORS errors, between the `backend(localhost:3000)` and frontend `(localhost:5173)`
- complex data relationships ( many to many, followers/following)
- visitor mode logic (without compromising security or user experience posed unique challenges in middleware and state management)
- responsive design (for all devices)

## Features for improvement

- better design
- small frontend tweaking for visitor
- WebSocket for real time notifications
- direct private conversations between users
- google log in and signup finalisation
- deploy
