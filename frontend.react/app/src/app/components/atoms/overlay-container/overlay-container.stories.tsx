import OverlayContainer, { Overlay } from '.'

export default {
  title: 'atoms/overlay-container',
  component: OverlayContainer
}

export function DefaultOverlay() {
  return (
    <div style={{height: '300px', width: '200px'}}>
      <OverlayContainer>
        <div style={{height: '100%', width: '100%', background: 'lightgray'}}>
          background
        </div>
        <Overlay>
          <div style={{height: '20px', width: '180px', background: 'red'}}>
            overlay
          </div>
        </Overlay>
      </OverlayContainer>
    </div>
  )
}