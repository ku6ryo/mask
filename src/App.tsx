import React, { useState } from "react"
import { Display } from "./Display"
import { ImageSelector } from "./ImageSelector"

export function App () {
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)
  return (
    <div>
      <Display selectedImage={selectedImage}/>
      <ImageSelector onSelect={setSelectedImage}/>
    </div>
  )
}