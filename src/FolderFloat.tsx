import { useId, useRef } from 'react'
import './FolderFloat.css'

type FolderFloatProps = {
  items: string[]
  label: string
  sublabel?: string
  folderColor: string
  frontColor: string
  paperColor?: string
  itemColor?: string
  itemTextColor?: string
  open: boolean
  onToggle: () => void
  onHoverOpen: () => void
}

const FolderFloat = ({
  items,
  label,
  sublabel,
  folderColor,
  frontColor,
  paperColor = '#f5f5f5',
  itemColor = '#f5f5f5',
  itemTextColor = '#18181b',
  open,
  onToggle,
  onHoverOpen,
}: FolderFloatProps) => {
  const pointerType = useRef<string | null>(null)
  const skillsDescriptionId = useId()
  return <button type="button" className={`folder-float ${open ? 'is-open' : ''}`} aria-expanded={open} aria-label={`${label}: ${open ? 'hide' : 'show'} skills`} aria-describedby={skillsDescriptionId} onPointerDown={event => { pointerType.current = event.pointerType }} onClick={event => { if (event.detail === 0 || pointerType.current !== 'mouse') onToggle(); else if (!open) onHoverOpen(); pointerType.current = null }} onPointerEnter={event => { if (event.pointerType === 'mouse') onHoverOpen() }} style={{ '--folder-color': folderColor, '--front-color': frontColor, '--paper-color': paperColor, '--item-color': itemColor, '--item-ink': itemTextColor } as React.CSSProperties}>
    <span id={skillsDescriptionId} className="folder-float__sr-only">Skills: {items.join(', ')}</span>
    <div className="folder-float__items">{items.map((item, index) => <span className="folder-float__item" key={item} style={{ '--item-index': index } as React.CSSProperties}>{item}</span>)}</div>
    <div className="folder-float__folder"><span className="folder-float__back" /><span className="folder-float__paper" /><span className="folder-float__front"><strong>{label}</strong><small>{sublabel || `${items.length} skills`}</small></span></div>
  </button>
}

export default FolderFloat
