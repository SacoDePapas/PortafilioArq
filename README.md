# Nube García — Architecture Portfolio

A responsive portfolio based on the supplied reference image. The interface uses React Native components rendered for the web with React Native Web; a small Express server supplies profile data and stores social interaction counts while it is running.

## Run locally

1. Install Node.js (version 20 or newer).
2. Run `npm install`.
3. Run `npm run dev` and open the Vite address shown in the terminal.

The development command starts the website and API together. The API runs on port 3001, and Vite forwards `/api` requests to it. For a production build, run `npm run build`, then set `NODE_ENV=production` and run `npm start`.

The profile and project copy, contact details, and portfolio imagery are sample content based on the reference and can be edited in `src/main.jsx`. Project cards open `/proyectos/la-mesa` and `/proyectos/renova`; the featured publication opens `/publicaciones/redensificacion-la-mesa`.
