## TOPFLIX

Topflix is a Netflix-inspired web app built with **Next.js 13/14 (App Router)**, **TypeScript**, **Prisma**, and **MongoDB**. It lets you explore, search, and manage movies and TV shows, with authentication, user profiles, and favorites—all in a modern, scalable architecture.

### Main Features

- **Modern UI**: Netflix-like, responsive, and optimized.
- **Authentication**: NextAuth with support for multiple user profiles.
- **Movies & TV Shows Management**: Listings, details, favorites, and bulk seeding.
- **REST API**: Protected routes for admin and data consumption.
- **Server Components**: Efficient data loading from the server.
- **Tailwind CSS**: Fast, customizable styling.
- **Prisma + MongoDB**: Robust ORM and NoSQL database.

### Project Structure

- `/app`: Main routes, layouts, and UI components (movies, TV shows, profiles, auth, etc).
- `/app/api`: Endpoints for authentication, movies, TV shows, favorites, seeding, etc.
- `/models` & `/prisma`: Data models and Prisma schema.
- `/lib`: Utilities, authentication, and DB connection.
- `/hooks`: Custom hooks for state and data management.
- `/public`: Static assets and images.
- `tailwind.config.ts`, `postcss.config.js`: Styling configuration.
- `tsconfig.json`: TypeScript configuration.

### Core Technologies

- **Next.js** (App Router)
- **TypeScript**
- **Prisma** (ORM)
- **MongoDB**
- **NextAuth**
- **Tailwind CSS**
- **Zustand** (global state)
- **Axios**, **SWR** (fetching)
- **React Icons**, **React Toastify**

### Getting Started

1. **Clone the repository**  
   ```bash
   git clone https://github.com/youruser/topflix.git
   cd topflix
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file with your MongoDB connection string and NextAuth secrets.

4. **Generate Prisma client**  
   ```bash
   npx prisma generate
   ```

5. **Run the development server**  
   ```bash
   npm run dev
   ```

6. **Open the app**  
   Go to [http://localhost:3000](http://localhost:3000) in your browser.

### Useful Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run start`: Start the app in production mode.
- `npm run lint`: Lint the codebase.
- `npx prisma studio`: Visual DB interface.

### Database Schema

The project uses models for **users**, **profiles**, **movies**, and **TV shows**, with relations and fields tailored for a Netflix-like experience.

### License

MIT