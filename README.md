# Pixel World

### Description

PixelWorld is a web application that encourages creativity and sharing through pixel art. Users explore a 2D world where they receive a “quote of the day” as inspiration for a 32×32 pixel painting. If they like the quote, they can attach it to their artwork (only one quote per painting). Users can also refresh the quote to find new inspiration. The environment’s weather is determined by the user’s actual geolocation, adding a dynamic touch to the experience.

When ready, users can visit the Museum to browse and appreciate paintings uploaded by others, each showcasing its quote and a personal description from the artist. Users can also upload their own paintings to share their art and inspiration with the community.

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
