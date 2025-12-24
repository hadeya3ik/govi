'use client'
import { useState } from 'react'
import './slider.css'

interface SliderProps {
  disabled?: boolean
  thumbBackground: string
  trackBackground: string
  value: number
  handleMoveSlider: (value: number) => void
}

const trackHeight = 0.88
const thumbDiameterSmall = 1.4
const thumbDiameterBig = 1.6

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
      onChange={handleChange}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  )
}

export interface Color {
  h: number
  s: number
  l: number
  a: number
}

interface HueSliderProps {
  disabled?: boolean
  color: Color
  handleChangeColor: (newColor: Color) => void
}

export function HueSlider(props: HueSliderProps) {
  const handleMoveSlider = (value: number) => {
    props.handleChangeColor({
      h: value * 3.6,
      s: props.color.s,
      l: props.color.l,
      a: props.color.a,
    })
  }

  return (
    <Slider
      disabled={props.disabled}
      thumbBackground={`hsl(${props.color.h}, 100%, 50%)`}
      trackBackground="linear-gradient(to right,
        rgb(255,0,0),
        rgb(255,255,0),
        rgb(0,255,0),
        rgb(0,255,255),
        rgb(0,0,255),
        rgb(255,0,255),
        rgb(255,0,0)
      )"
      value={props.color.h / 3.6}
      handleMoveSlider={handleMoveSlider}
    />
  )
}

export function LightnessSlider(props: HueSliderProps) {
  const handleMoveSlider = (value: number) => {
    props.handleChangeColor({
      h: props.color.h,
      s: props.color.s,
      l: value,
      a: props.color.a,
    })
  }

  return (
    <Slider
      disabled={props.disabled}
      thumbBackground={`hsl(${props.color.h}, 100%, ${props.color.l}%)`}
      trackBackground={`linear-gradient(to right, hsl(${props.color.h}, 100%, 0%),  hsl(${props.color.h}, 100%, 50%), hsl(${props.color.h}, 100%, 100%))`}
      value={props.color.l}
      handleMoveSlider={handleMoveSlider}
    />
  )
}

export function SaturationSlider(props: HueSliderProps) {
  const handleMoveSlider = (value: number) => {
    props.handleChangeColor({
      h: props.color.h,
      s: value,
      l: props.color.l,
      a: props.color.a,
    })
  }

  return (
    <Slider
      disabled={props.disabled}
      thumbBackground={`hsl(${props.color.h}, ${props.color.s}%, 50%)`}
      trackBackground={`linear-gradient(to right, hsl(${props.color.h}, 0%, 50%),  hsl(${props.color.h}, 100%, 50%))`}
      value={props.color.s}
      handleMoveSlider={handleMoveSlider}
    />
  )
}