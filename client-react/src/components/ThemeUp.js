import React from 'react'
import { ThemeProvider } from 'styled-components' // added for theme
import { partyTheme, darkTheme } from '../theme' // added for theme
import { GlobalStyles } from '../global' // added for theme
import { DarkMode } from './DarkMode' // added for theme
import Toggle from './Toggle' // added for theme

function ThemeUp () {
  const [theme, toggleTheme, componentMounted] = DarkMode()

  const themeMode = theme === 'party' ? partyTheme : darkTheme

  if (!componentMounted) {
    return <div />
  }

  return (
    <ThemeProvider theme={themeMode}>

      <>
        {/* <h6><span style={{fontSize:"12px", fontStyle:"italic", fontWeight: "900"}}>{theme === 'party' ? 'Party theme' : 'Dark theme'}!</span></h6> */}
        <GlobalStyles />
        <Toggle theme={theme} toggleTheme={toggleTheme} />
        <h6><span style={{ fontSize: '12px' }}>{theme === 'party' ? 'Party theme' : 'Dark theme'}!</span></h6>
      </>
    </ThemeProvider>
  )
}

export default ThemeUp
