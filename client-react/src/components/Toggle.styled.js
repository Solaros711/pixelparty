import styled from 'styled-components'

export const ToggleContainer = styled.button`
  background: ${({ theme }) => theme.gradient};
  border: 2px solid ${({ theme }) => theme.toggleBorder};
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  font-size: 0.5rem;
  justify-content: space-between;
  margin: 0 auto;
  // margin-left: 44.5%;
  overflow: hidden;
  padding: 0.5rem;
  // position: relative;
  width: 7rem;
  width: 10%;
  height: 3rem;

  svg {
    height: auto;
    
    width: 2.5rem;
    transition: all 0.5s linear;
    
    // party icon
    &:first-child {
      transform: ${({ partyTheme }) => partyTheme ? 'translateY(0)' : 'translateY(100px)'};
    }
    
    // night icon
    &:nth-child(2) {
      transform: ${({ partyTheme }) => partyTheme ? 'translateY(-100px)' : 'translateY(0)'};

      
    }
  }
`
