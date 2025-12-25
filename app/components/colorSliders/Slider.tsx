'use client'
import { useState } from 'react'
import './styles.css'

interface SliderProps {
  disabled?: boolean
  min?: number
  max?: number
  thumbBackground: string
  trackBackground: string
  value: number
  handleMoveSlider: (value: number) => void
}

const trackHeight = 1.8
const thumbDiameterSmall = 1.8
const thumbDiameterBig = 2

export function Slider(props: SliderProps) {
  const [sliderIsBeingTouched, setSliderIsBeingTouched] = useState(false)
  const [sliderThumbIsBeingTouched, setSliderThumbIsBeingTouched] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handleMoveSlider(parseInt(event.target.value))
    if (sliderIsBeingTouched) setSliderThumbIsBeingTouched(true)
  }

  const handleTouchStart = () => {
    setSliderIsBeingTouched(true)
  }

  const handleTouchEnd = () => {
    setSliderIsBeingTouched(false)
    setSliderThumbIsBeingTouched(false)
  }

  const currentThumbDiameter = sliderThumbIsBeingTouched
    ? thumbDiameterBig
    : thumbDiameterSmall

  return (
    <input
      type="range"
      className={`color-slider ${props.disabled ? 'disabled' : ''}`}
      style={
        {
          '--thumb-size': `${currentThumbDiameter}em`,
          '--thumb-bg': props.disabled ? '#ddd' : props.thumbBackground,
          '--track-bg': props.disabled ? '#ddd' : props.trackBackground,
          '--track-height': `${trackHeight}em`,
          '--thumb-size-big': `${thumbDiameterBig}em`,
        } as React.CSSProperties
      }
      value={props.value}
      disabled={props.disabled}
      min={props.min}
      max={props.max}
      onChange={handleChange}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  )
}
