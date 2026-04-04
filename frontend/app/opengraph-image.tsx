import { ImageResponse } from 'next/og'

export const alt = 'Hiatus | AI Research Gap Finder'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#fdf8f0', // Cream/Warm background
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          border: '12px solid #5a3e1b10',
          position: 'relative',
        }}
      >
        {/* Subtle scholarly border deco */}
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          right: '30px',
          bottom: '30px',
          border: '1px solid #5a3e1b15',
          display: 'flex',
        }} />
        
        <div
          style={{
            fontSize: '120px',
            fontWeight: 'bold',
            color: '#b45309', // Amber (tailwind amber-700 approx)
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}
        >
          Hiatus
        </div>
        
        <div
          style={{
            fontSize: '32px',
            color: '#4b5563', // Gray (tailwind gray-600)
            fontWeight: 'normal',
            maxWidth: '800px',
            textAlign: 'center',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Find the gaps. Skip the noise.
        </div>

        <div style={{
          position: 'absolute',
          bottom: '100px',
          height: '2px',
          width: '60px',
          background: '#b4530930',
        }} />
      </div>
    ),
    {
      ...size,
    }
  )
}
