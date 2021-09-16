import React from "react"
import ReactDOM from "react-dom"
import "sanitize.css"
import style from "./index.scss"
import { App } from "./App"
import { RenderingEngine } from "./Engine"
import kabuki from "./images/kabuki.jpg"

const root = document.createElement("div")
document.body.appendChild(root)
ReactDOM.render(
  <div
    className={style.container}
  >
    <App />
  </div>,
  root
)

/*
const en = new RenderingEngine()
const can = document.createElement("canvas")
can.width = 100
can.height = 100
document.body.appendChild(can)
en.init()
en.setCanvas(can)
const img = new Image()
img.src = kabuki
img.onload = () => {
  en.setImage(img)
}
*/