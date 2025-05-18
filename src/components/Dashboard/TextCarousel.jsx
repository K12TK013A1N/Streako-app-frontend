import React from 'react'
import useTextCarousel from '../../hooks/useTextCarousel.js'

export default function TextCarousel() {
  const text = useTextCarousel([
    'Build your group',
    'Ask your friends to join',
    'Maintain streak together'
  ], 4000)

  return <h2 style={{ margin: '1.5rem 0', textAlign: 'center' }}>{text}</h2>
}