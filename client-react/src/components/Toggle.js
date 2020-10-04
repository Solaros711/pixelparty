import React from 'react'
import { func, string } from 'prop-types'
import styled from 'styled-components'
import { ReactComponent as NightIcon } from '../night-1.svg'
// import { ReactComponent as PartyIcon } from '../party-1.svg';
import { ToggleContainer } from './Toggle.styled'
import SVG from 'react-inlinesvg'

export default function Toggle ({ theme, toggleTheme }) {
  const isParty = theme === 'party'
  const PartyIcon = () => <SVG src={require('../party-2.svg')} />

  return (

    <ToggleContainer partyTheme={isParty} onClick={toggleTheme}>
      <PartyIcon />
      <NightIcon />
    </ToggleContainer>

  )
}

Toggle.propTypes = {
  theme: string.isRequired,
  toggleTheme: func.isRequired
}
