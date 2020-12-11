import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Roboto:wght@400;500&display=swap');
  ${normalize};

  body {
    font-size: 18px;
    font-family: 'Roboto', Arial, sans-serif;
    color: #776e65;
    /** Disable eslastic scrolling on mobile */
    overflow: hidden;
    overscroll-behavior: none;
  }
`;

export default GlobalStyle;
