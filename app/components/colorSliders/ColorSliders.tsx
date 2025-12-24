'use client'
import {Slider} from './Slider'

interface Color {
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

export function TemperatureSlider(props: any) {
const handleMoveSlider = (value: number) => {
    props.handleChangeColor({
      h: props.color.h,
      s: value,
      l: props.color.l,
      a: props.color.a,
    })
  }
{
  return (
    <Slider
      disabled={props.disabled}
      value={props.color.s}
      thumbBackground="white"
      trackBackground="linear-gradient(to right,
        rgb(255, 210, 157),
        rgb(255, 255, 255),
        rgb(141, 205, 251)
      )"
    //   min={2700}
    //   max={6500}
    //   step={1}
      handleMoveSlider={handleMoveSlider}
    />
  )
}}

