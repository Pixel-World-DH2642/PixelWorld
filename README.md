# Pixel World

### Description

PixelWorld is a web application that encourages creativity and sharing through pixel art. Users explore a 2D world where they receive a “quote of the day” as inspiration for a 32×32 pixel painting. If they like the quote, they can attach it to their artwork (only one quote per painting). Users can also refresh the quote to find new inspiration. The environment’s weather is determined by the user’s actual geolocation, adding a dynamic touch to the experience.

When ready, users can visit the Museum to browse and appreciate paintings uploaded by others, each showcasing its quote and a personal description from the artist. Users can also upload their own paintings to share their art and inspiration with the community.

### Core functionalities

- **Quote of the Day**: Users receive a daily quote to inspire their pixel art creations.
- **Dynamic Weather**: The environment's weather reflects the user's actual geolocation, enhancing immersion.
- **Drawing Your Painting**: Users can create pixel art on a 32×32 canvas, using a simple drawing tool.
- **Painting Submission**: Users can upload their own pixel art, attaching a quote and personal description.
- **Museum**: A gallery where users can like and comment on paintings created by others, each with its own quote and description. The likes and comments are real-time updated.
- **User Profile**: Users can view their own paintings, along with their profile information.

### Architecture

- [React](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Redux](https://react-redux.js.org/)
- [React Router](https://reactrouter.com/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material UI](https://mui.com/material-ui/)
- [P5.js](https://p5js.org/)
- [P5-wrapper/react](https://github.com/P5-wrapper/react)
- [Vite](https://vite.dev/)
- [David](https://gits-15.sys.kth.se/dsegal)'s micro game engine

1. The persistence layer of the application state is located in the Firebase server, which is completely isolated from the views and state management and only interacted with through Redux actions. The application state is managed through Redux slices.
2. The container components act as presenters connecting the Redux state to the corresponding views.
3. The views are purely presentational components, rednerring the user interface. There is no direct state management or persistence in the viesws. Each view is responsible for one page.
   MuseumPage.jsx: Gallery display
   DetailPage.jsx: Single painting view
   WorldPage.jsx: Game canvas
   ProfilePage.jsx: User profile

MicroEngine
We created a tiny component based game engine called MicroEngine that helps compartmentalize game features and enforce good data structures. The engine has rudimentary built in components for game structure, animation, rendering, and physics but also alows for composing custom components. We have integrated p5.js as a third party user-visible component which is used by MicroEngine to aid complex canvas rendering tasks. Additionally the scribble.js library is used for some special rendering purposes.

We are using connect instead of custom hooks which further improves the separation of concerns and makes the state management framework independent.

### User experience

Our target group consists of creative individuals—primarily younger users—who are familiar with digital aesthetics and enjoy engaging in short bursts of creative activity. We aim to offer an experience that is stimulating yet not overwhelming, providing just enough tools and structure to inspire creativity without creating pressure or complexity. Users are free to explore at their own pace: a painting can take three minutes or three hours, depending on how deeply they want to engage. The goal is to encourage creativity in a relaxed, low-stakes environment that fits easily into their daily routines. Additionally, we aim to foster social connection and a sense of accomplishment by showcasing users’ artwork in a community museum, where they can view, like, and comment on each other’s paintings.

In the prototyping stage we had user testing with 3 participants using the prototype cretaed in Figma.
The key insights were the following:

Based on those we implemented the following changes:

### Web APIs and persistence

We are using the following external APIs:

- Quote API: Provides daily inspiration through random quotes
- Weather API: Fetches real-time weather data based on user's geolocation
- Firebase Services: Handles data persistence and authentication

All API calls are done through Redux thunks and error handling and loading states are managed uniformly.

The application state is persisted in Firebase using the following collections:

1. Paintings Collection:

   - Stores user-created artwork
   - Includes metadata (author, title, timestamp)
   - Contains quote association and color matrix
   - Tracks likes and comments

2. Users Collection

   - User profiles and preferences
   - Authentication details
   - Painting history and interactions
   - Personal gallery information

3. Likes Collection
   - association between paintings and users using IDs
   - each intearction os timestamped

We are using Firebase for user authentication as well allowing sign-in and registration with email and password or with Google account.

### What we have done - 2025.04.14

- Skeleton files and stubs created for the whole structure of the app including [redux toolkit](https://redux-toolkit.js.org/) slices, mapping from redux store to the view and the views
- Basic navigation using [react router](https://reactrouter.com/)
- Using [P5-wrapper/react](https://github.com/P5-wrapper/react) to P5 canvas into a react app
- A micro game engine done by [David](https://gits-15.sys.kth.se/dsegal) to provide basic functionalities in the canvas element
- Using [tailwindcss](https://tailwindcss.com/) to style the view
- Deployed on Firebase [Link](https://pixelworld-45efc.web.app/)
- Introduced a quote API fetch

### What we plan to do - 2025.04.14

- [ ] Implement all the data slices for redux toolkit
- [ ] Introduce a weather API fetch
- [ ] Authentication using Firebase
- [ ] User persistence using Firebase
- [ ] A page for signing up
- [ ] Complete the drawing of the world space aka the P5 canvas and all the elements inside (the player, the quote board, the painting stand, the museum entrance)
- [ ] Complete the styling of all pages
- [ ] Have a nicer welcome page to introduce the idea

### File structure

```
dsegal-kbiro-kiryluk-zhuan-vt25-Project/
├── index.html                  # Root HTML entry point
├── package.json                # Project dependencies and scripts
├── vite.config.js              # Vite build configuration
├── firebase.json               # Firebase hosting configuration
├── .firebaserc                 # Firebase project configuration
├── .gitignore                  # Git ignore patterns
├── .prettierrc                 # Code formatting rules
├── .vscode/                    # VS Code configuration
│   └── settings.json           # Editor settings
└── src/                        # Application source code
    ├── index.jsx               # Main React entry point with router
    ├── app/                    # Application core
    │   └── store.js            # Redux store configuration
    ├── styles/                 # Styling
    │   └── global.css          # Global CSS with Tailwind imports
    ├── components/             # Reusable UI components
    │   ├── Sketch.jsx          # P5.js sketch component
    │   └── SubmitModal.jsx     # Painting submission modal
    ├── containers/             # Redux connected components
    │   ├── Detail.jsx          # Detail page container
    │   ├── Login.jsx           # Login page container
    │   ├── Museum.jsx          # Museum page container
    │   ├── Profile.jsx         # Profile page container
    │   └── World.jsx           # World page container
    ├── pages/                  # Page components
    │   ├── DetailPage.jsx      # Individual painting view
    │   ├── LoginPage.jsx       # Authentication page
    │   ├── MuseumPage.jsx      # Gallery of paintings
    │   ├── ProfilePage.jsx     # User profile page
    │   ├── WelcomePage.jsx     # Landing page
    │   └── WorldPage.jsx       # Main interactive world canvas
    └── utils/                  # Utility functions and modules
        └── engine/             # Custom game engine
            ├── actors.js       # Actor definitions for the world
            ├── instantiator.js # World object creator
            └── microEngine.js  # Core game engine implementation
```
