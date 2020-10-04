import { useEffect, useState } from 'react'

export const DarkMode = () => {
  const [theme, setTheme] = useState('party')
  const [componentMounted, setComponentMounted] = useState(false)

  const setMode = mode => {
    window.localStorage.setItem('theme', mode)
    setTheme(mode)
  }

  const toggleTheme = () => {
    if (theme === 'party') {
      setMode('dark')
    } else {
      setMode('party')
    }
  }

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme')
    if (localTheme) {
      setTheme(localTheme)
    } else {
      setMode('party')
    //   setTheme('party')
    //   window.localStorage.setItem('theme', 'party')
    }
    setComponentMounted(true)
  }, [])

  return [theme, toggleTheme, componentMounted]
}
