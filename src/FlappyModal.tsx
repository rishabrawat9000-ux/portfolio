import { useEffect, useRef, useState } from 'react'
import './FlappyModal.css'

type FlappyModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function FlappyModal({ isOpen, onClose }: FlappyModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const gameStateRef = useRef(gameState)
  const highScoreRef = useRef(highScore)
  const onCloseRef = useRef(onClose)

  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let birdY = canvas.height / 2
    let birdVelocity = 0
    const gravity = 0.38
    const jump = -7.2
    let pipes: { x: number; topHeight: number; bottomHeight: number; passed: boolean }[] = []
    let frameCount = 0
    let currentScore = 0
    let isPlaying = false
    const updateGameState = (next: typeof gameState) => {
      gameStateRef.current = next
      setGameState(next)
    }

    const resetGame = () => {
      birdY = canvas.height / 2
      birdVelocity = 0
      pipes = []
      frameCount = 0
      currentScore = 0
      setScore(0)
      updateGameState('playing')
      isPlaying = true
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        if (!isPlaying) {
          resetGame()
        } else {
          birdVelocity = jump
        }
      }
      if (e.code === 'Escape') {
            onCloseRef.current()
      }
    }

    const handleClick = () => {
      if (!isPlaying) {
        resetGame()
      } else {
        birdVelocity = jump
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    canvas.addEventListener('click', handleClick)

    const drawPixelCat = (x: number, y: number) => {
      ctx.save()
      ctx.translate(x, y)
      // Body
      ctx.fillStyle = '#f3c756'
      ctx.fillRect(-14, -10, 28, 20)
      // Ears
      ctx.fillStyle = '#e10600'
      ctx.fillRect(-12, -16, 6, 6)
      ctx.fillRect(6, -16, 6, 6)
      // Eyes
      ctx.fillStyle = '#111'
      ctx.fillRect(-6, -6, 4, 6)
      ctx.fillRect(2, -6, 4, 6)
      // Tongue out / cute nose
      ctx.fillStyle = '#e10600'
      ctx.fillRect(-2, 0, 4, 6)
      ctx.restore()
    }

    const gameLoop = () => {
      // Clear canvas (Sky blue background)
      ctx.fillStyle = '#3bc2f5'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Background decorative clouds/grid
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.fillRect(50, 40, 60, 20)
      ctx.fillRect(220, 80, 80, 25)

      if (isPlaying) {
        birdVelocity += gravity
        birdY += birdVelocity

        // Spawn pipes
        if (frameCount % 90 === 0) {
          const gap = 110
          const minHeight = 50
          const maxHeight = canvas.height - 150 - gap
          const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight
          pipes.push({
            x: canvas.width,
            topHeight,
            bottomHeight: canvas.height - topHeight - gap - 40, // leave room for ground
            passed: false,
          })
        }

        // Move pipes
        pipes.forEach(pipe => {
          pipe.x -= 3.2
        })

        // Remove offscreen pipes
        pipes = pipes.filter(pipe => pipe.x > -60)

        // Collision detection & scoring
        pipes.forEach(pipe => {
          // Pipe dimensions
          const pipeWidth = 52
          const birdX = 80
          const birdRadius = 12

          // Check if bird passes pipe
          if (!pipe.passed && pipe.x + pipeWidth < birdX) {
            pipe.passed = true
            currentScore += 1
            setScore(currentScore)
            setHighScore(prev => {
              const next = Math.max(prev, currentScore)
              highScoreRef.current = next
              return next
            })
          }

          // Collision with top or bottom pipe
          if (
            birdX + birdRadius > pipe.x &&
            birdX - birdRadius < pipe.x + pipeWidth
          ) {
            if (birdY - birdRadius < pipe.topHeight || birdY + birdRadius > canvas.height - pipe.bottomHeight - 40) {
              isPlaying = false
              updateGameState('gameover')
            }
          }
        })

        // Floor and ceiling collision
        if (birdY + 12 >= canvas.height - 40 || birdY - 12 <= 0) {
          isPlaying = false
          updateGameState('gameover')
        }

        frameCount++
      }

      // Draw Pipes (Retro green pixel pipes)
      pipes.forEach(pipe => {
        const pipeWidth = 52
        ctx.fillStyle = '#4ba33d'
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight)
        // Top pipe lip
        ctx.fillStyle = '#38802d'
        ctx.fillRect(pipe.x - 4, pipe.topHeight - 16, pipeWidth + 8, 16)

        // Bottom pipe
        ctx.fillStyle = '#4ba33d'
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight - 40, pipeWidth, pipe.bottomHeight + 40)
        // Bottom pipe lip
        ctx.fillStyle = '#38802d'
        ctx.fillRect(pipe.x - 4, canvas.height - pipe.bottomHeight - 40, pipeWidth + 8, 16)
      })

      // Draw Ground (Green turf + pink striped base)
      ctx.fillStyle = '#ded895'
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40)
      ctx.fillStyle = '#4ba33d'
      ctx.fillRect(0, canvas.height - 40, canvas.width, 10)

      // Ground stripes
      ctx.fillStyle = '#e10600'
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect((i - (frameCount * 3.2) % 20), canvas.height - 30, 10, 30)
      }

      // Draw Bird (Cat character!)
      drawPixelCat(80, birdY)

      // Draw UI Overlays
      if (!isPlaying && gameStateRef.current === 'idle') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 22px "DM Mono", monospace'
        ctx.textAlign = 'center'
        ctx.fillText('FLAPPY CAT EASTER EGG', canvas.width / 2, canvas.height / 2 - 30)
        ctx.font = '13px "DM Mono", monospace'
        ctx.fillText('Click or Press SPACE to Start', canvas.width / 2, canvas.height / 2 + 10)
      } else if (!isPlaying && gameStateRef.current === 'gameover') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#e10600'
        ctx.font = 'bold 26px "DM Mono", monospace'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 35)
        ctx.fillStyle = '#fff'
        ctx.font = '15px "DM Mono", monospace'
        ctx.fillText(`Score: ${currentScore}   High: ${highScoreRef.current}`, canvas.width / 2, canvas.height / 2 + 5)
        ctx.font = '12px "DM Mono", monospace'
        ctx.fillText('Click or SPACE to Play Again', canvas.width / 2, canvas.height / 2 + 42)
      }

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keydown', handleKeyDown)
      canvas.removeEventListener('click', handleClick)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="flappy-modal-backdrop" onClick={onClose}>
      <div className="flappy-modal-content" onClick={e => e.stopPropagation()}>
        <div className="flappy-modal-header">
          <span>FLAPPY CAT / EASTER EGG</span>
          <button onClick={onClose} aria-label="Close game">×</button>
        </div>
        <div className="flappy-canvas-wrap">
          <canvas ref={canvasRef} width={420} height={520} />
        </div>
        <div className="flappy-modal-footer">
          <span><b>SPACE / CLICK</b> to flap</span>
          <span>Score: <b>{score}</b></span>
          <span>High: <b>{highScore}</b></span>
        </div>
      </div>
    </div>
  )
}
