import React, { useEffect, useState } from "react"
import kabukiUrl from "./images/kabuki.jpg"
import style from "./ImageSelector.scss"

type Props = {
  onSelect: (img: HTMLImageElement) => void
}

export function ImageSelector ({
  onSelect
}: Props) {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  useEffect(() => {
    const kabukiImg = new Image()
    kabukiImg.onload = () => {
      setImages([kabukiImg])
    }
    kabukiImg.src = kabukiUrl
  }, [])
  const onImageClick: React.MouseEventHandler<HTMLImageElement> = (e) => {
    onSelect(e.currentTarget)
  }
  return (
    <div className={style.frame}>
      {images.map((img) => {
        return (
          <img src={img.src} onClick={onImageClick}/>
        )
      })}
    </div>
  )
}