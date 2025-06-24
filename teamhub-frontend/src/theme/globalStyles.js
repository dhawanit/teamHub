import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow-x: hidden; /* ✅ Lock horizontal scroll */
  }
    
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }

  input, button {
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
  }
  @media (max-width: 768px) {
    .MuiDrawer-paper {
      width: 60px !important;
    }
  }
`;

export default GlobalStyles;