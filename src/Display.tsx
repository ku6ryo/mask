import React, { useEffect, useRef, useState } from "react"
import style from "./Display.scss"
import { RenderingEngine } from "./Engine"

type Props = {
  selectedImage: HTMLImageElement | null
}

export function Display({
  selectedImage
}: Props) {
  const engineRef = useRef<RenderingEngine|null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const engine = new RenderingEngine()
    engine.init()
    engineRef.current = engine
  }, [])
  useEffect(() => {
    if (frameRef.current) {
      frameRef.current.append(engineRef.current!.getCanvas())
    }
  }, [frameRef.current])
  useEffect(() => {
    if (engineRef.current && selectedImage) {
      engineRef.current.setImage(selectedImage)
    }
  }, [selectedImage])
  return (
    <div
      className={style.frame}
      ref={frameRef}
    >
    </div>
  )
}