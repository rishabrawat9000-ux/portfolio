import { useEffect, useRef } from 'react'
import './ShapeGrid.css'

type ShapeGridProps = { cellSize?: number; speed?: number; lineColor?: string; hoverColor?: string; fillOpacity?: number; backgroundColor?: string; className?: string }

const ShapeGrid = ({ cellSize = 42, speed = .35, lineColor = 'rgba(17,17,17,.12)', hoverColor = '#e10600', fillOpacity = .12, backgroundColor = 'transparent', className = '' }: ShapeGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current, root = rootRef.current, ctx = canvas?.getContext('2d')
    if (!canvas || !root || !ctx) return
    const state = { width: 0, height: 0, ratio: 1, offset: 0, pointerX: -1, pointerY: -1, raf: 0, last: 0, trail: [] as { x: number; y: number; time: number }[], cascades: [] as { x: number; y: number; time: number }[] }
    const resize = () => { state.width = root.clientWidth; state.height = root.clientHeight; state.ratio = Math.min(devicePixelRatio || 1, 2); canvas.width = state.width * state.ratio; canvas.height = state.height * state.ratio }
    const move = (event: PointerEvent) => { const rect = root.getBoundingClientRect(); state.pointerX = event.clientX - rect.left; state.pointerY = event.clientY - rect.top; const last = state.trail[state.trail.length - 1]; if (!last || Math.hypot(state.pointerX - last.x, state.pointerY - last.y) > 5) state.trail.push({ x: state.pointerX, y: state.pointerY, time: performance.now() }); if (state.trail.length > 32) state.trail.shift() }
    const leave = () => { state.pointerX = -1; state.pointerY = -1 }
    const click = (event: PointerEvent) => { const rect = root.getBoundingClientRect(); if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) state.cascades.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, time: performance.now() }) }
    const draw = (now: number) => {
      const styles = getComputedStyle(root)
      const darkMode = Boolean(document.querySelector('.theme-dark'))
      root.dataset.dark = darkMode ? 'true' : 'false'
      const themeCellSize = darkMode ? 28 : parseFloat(styles.getPropertyValue('--shape-cell-size')) || cellSize
      const themeLineColor = darkMode ? 'rgba(255,255,255,.34)' : styles.getPropertyValue('--shape-line-color').trim() || lineColor
      const themeHoverColor = darkMode ? '#e10600' : styles.getPropertyValue('--shape-hover-color').trim() || hoverColor
      const themeFillOpacity = parseFloat(styles.getPropertyValue('--shape-fill-opacity')) || fillOpacity
      const driftSpeed = darkMode ? Math.max(speed, .85) : speed
      const dt = Math.min(.05, (now - state.last) / 1000 || 0); state.last = now; state.offset = (state.offset + driftSpeed * 24 * dt) % themeCellSize
      root.style.setProperty('--shape-grid-offset', `${state.offset}px`)
      ctx.setTransform(state.ratio, 0, 0, state.ratio, 0, 0); ctx.clearRect(0, 0, state.width, state.height); ctx.globalAlpha = darkMode ? 0 : 1; ctx.lineWidth = 1; ctx.strokeStyle = lineColor; ctx.beginPath()
      ctx.strokeStyle = themeLineColor
      for (let x = -themeCellSize + state.offset; x <= state.width + themeCellSize; x += themeCellSize) { ctx.moveTo(x, 0); ctx.lineTo(x, state.height) }
      for (let y = -themeCellSize + state.offset; y <= state.height + themeCellSize; y += themeCellSize) { ctx.moveTo(0, y); ctx.lineTo(state.width, y) }
      ctx.stroke()
      ctx.globalAlpha = 1
      state.trail = state.trail.filter(point => now - point.time < 2800)
      state.trail.forEach(point => { const age = (now - point.time) / 2800, fade = Math.max(0, 1 - age) ** 0.65, origin = -themeCellSize + state.offset, column = Math.floor((point.x - origin) / themeCellSize), row = Math.floor((point.y - origin) / themeCellSize); for (let x = column - 1; x <= column + 1; x++) for (let y = row - 1; y <= row + 1; y++) { const left = origin + x * themeCellSize, top = origin + y * themeCellSize, strength = fade * Math.max(0, 1 - Math.hypot(point.x - (left + themeCellSize / 2), point.y - (top + themeCellSize / 2)) / themeCellSize / 1.8); if (!strength) continue; ctx.fillStyle = themeHoverColor; ctx.globalAlpha = strength * themeFillOpacity; ctx.fillRect(left, top, themeCellSize, themeCellSize); ctx.globalAlpha = strength; ctx.strokeStyle = themeHoverColor; ctx.strokeRect(left, top, themeCellSize, themeCellSize) } }); ctx.globalAlpha = 1
      state.cascades = state.cascades.filter(cascade => now - cascade.time < 1400)
      state.cascades.forEach(cascade => { const age = (now - cascade.time) / 1000, radius = age * 250; ctx.strokeStyle = themeHoverColor; ctx.globalAlpha = Math.max(0, 1 - age / 1.4); ctx.strokeRect(cascade.x - radius, cascade.y - radius, radius * 2, radius * 2) }); ctx.globalAlpha = 1
      state.raf = requestAnimationFrame(draw)
    }
    const observer = new ResizeObserver(resize); observer.observe(root); window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerdown', click, { passive: true }); window.addEventListener('blur', leave); resize(); state.raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(state.raf); observer.disconnect(); window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', click); window.removeEventListener('blur', leave) }
  }, [backgroundColor, cellSize, fillOpacity, hoverColor, lineColor, speed])
  return <div ref={rootRef} className={`shape-grid ${className}`.trim()} style={{ backgroundColor }} aria-hidden="true"><canvas ref={canvasRef} /></div>
}

export default ShapeGrid
