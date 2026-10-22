import { useEffect, useRef } from 'react'
import './TextCursor.css'

type TextCursorProps = {
  text?: string
  fontSize?: number
  spacing?: number
  maxPoints?: number
  color?: string
  className?: string
}

const TextCursor = ({
  text = 'Hello',
  fontSize = 28,
  spacing = 88,
  maxPoints = 7,
  color = 'currentColor',
  className = '',
}: TextCursorProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const layer = layerRef.current
    if (!root || !layer) return

    const points: Array<{ x: number; y: number; angle: number }> = []
    let lastPoint: { x: number; y: number } | null = null
    let raf = 0
    let pointer = { x: 0, y: 0, angle: 0 }

    const render = () => {
      raf = 0
      points.forEach((point, index) => {
        const rank = index / Math.max(1, points.length - 1)
        const item = layer.children[index] as HTMLElement
        if (!item) return
        item.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) rotate(${point.angle}rad) scale(${1 - rank * 0.5})`
        item.style.opacity = String(1 - rank * 0.6)
      })
    }

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      const next = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      const dx = next.x - (lastPoint?.x ?? next.x)
      const dy = next.y - (lastPoint?.y ?? next.y)
      const distance = Math.hypot(dx, dy)
      if (distance < spacing && points.length) return
      pointer = { ...next, angle: Math.atan2(dy, dx) }
      points.unshift(pointer)
      while (points.length > maxPoints) points.pop()
      while (layer.children.length < points.length) {
        const item = document.createElement('span')
        item.className = 'text-cursor__item'
        item.textContent = text
        layer.appendChild(item)
      }
      while (layer.children.length > points.length) layer.lastElementChild?.remove()
      lastPoint = next
      if (!raf) raf = requestAnimationFrame(render)
    }

    root.addEventListener('pointermove', onMove)
    return () => {
      root.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [maxPoints, spacing, text])

  return <div ref={rootRef} className={`text-cursor ${className}`.trim()}><div ref={layerRef} className="text-cursor__layer" aria-hidden="true" style={{ color, fontSize }} /></div>
}

export default TextCursor
