import { useState } from 'react'
import './ElasticSlider.css'

type ElasticSliderProps = { defaultValue?: number; onChange?: (value: number) => void }

const ElasticSlider = ({ defaultValue = 58, onChange }: ElasticSliderProps) => {
  const [value, setValue] = useState(defaultValue)
  const update = (next: number) => { setValue(next); onChange?.(next) }
  return <label className="elastic-slider"><span className="elastic-slider__value">{value}%</span><span className="elastic-slider__row"><span aria-hidden="true">◖</span><input type="range" min="0" max="100" value={value} onChange={event => update(Number(event.target.value))} style={{ '--volume': `${value}%` } as React.CSSProperties} aria-label="Music volume" /><span aria-hidden="true">◗</span></span></label>
}

export default ElasticSlider
