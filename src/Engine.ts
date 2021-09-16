import {
  Scene,
  Engine,
  Vector3,
  HemisphericLight,
  Color4,
  PBRMetallicRoughnessMaterial,
  Texture,
  VertexData,
  Mesh,
  Camera
} from "babylonjs"
import * as tf from "@tensorflow/tfjs-core"
import "@tensorflow/tfjs-backend-webgl"
import * as detection from "@tensorflow-models/face-landmarks-detection"
import { TRIANGLES } from "./triangle"
import { UVs } from "./uv"

export class RenderingEngine {
  private faceMaterial: PBRMetallicRoughnessMaterial
  private scene: Scene
  private engine: Engine
  private resultCanvas: HTMLCanvasElement
  private babylonCanvas: HTMLCanvasElement

  constructor() {
    this.babylonCanvas = document.createElement("canvas")
    this.engine = new Engine(this.babylonCanvas, true, {preserveDrawingBuffer: true, stencil: true})
    this.scene = new Scene(this.engine)
    this.scene.clearColor = new Color4(0, 0, 0, 0)
    this.faceMaterial = new PBRMetallicRoughnessMaterial("standard", this.scene)
    this.faceMaterial.roughness = 1
    this.faceMaterial.metallic = 0
    this.resultCanvas = document.createElement("canvas")
    this.resultCanvas.width = 400
    this.resultCanvas.height = 800
  }

  setImage(img: HTMLImageElement) {
    const canvas = document.createElement("canvas")
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    canvas.getContext("2d")?.drawImage(img, 0, 0)
    this.faceMaterial.baseTexture = new Texture(canvas.toDataURL(), this.scene)
    this.faceMaterial.baseTexture.hasAlpha = true
  }

  getCanvas() {
    return this.resultCanvas
  }

  async init () {
    const videoCnavas = document.createElement("canvas")
    const camera = new Camera("camera", new Vector3(0, 0, 0), this.scene)
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA
    camera.attachControl(this.babylonCanvas, false)
    camera.maxZ = 500
    camera.minZ = 0
    new HemisphericLight("HemiLight", new Vector3(0, 1, 0), this.scene)
    new HemisphericLight("HemiLight", new Vector3(0, -1, 0), this.scene)

    const face = new Mesh("spring", this.scene)
    face.position.set(0, 0, 40)
    face.material = this.faceMaterial

    await tf.setBackend("webgl")
    const model = await detection.load(detection.SupportedPackages.mediapipeFacemesh)
    const vertexData = new VertexData()
    const update = async () => {
      try {
        const predictions = await model.estimateFaces({
          input: videoCnavas
        })
        if (predictions.length > 0) {
          const prediction = predictions[0]
          const mesh = (prediction as any).scaledMesh as number[][]
          mesh.forEach((v, i) => {
            positions[3 * i] = v[0] - 320
            positions[3 * i + 1] = - v[1] + 240
            positions[3 * i + 2] = v[2]
          })
          const normals = [] as number[]
          VertexData.ComputeNormals(positions, TRIANGLES, normals)
          vertexData.positions = positions
          vertexData.indices = TRIANGLES
          vertexData.normals = normals
          vertexData.uvs = uvs
          vertexData.applyToMesh(face)
        }
      } catch (e) {
        console.error(e)
      }
    }
    const videoElem = document.createElement("video")
    videoElem.autoplay = true
    videoElem.addEventListener("playing", () => {
      const vw = videoElem.videoWidth
      const vh = videoElem.videoHeight
      const va = vh / vw
      this.babylonCanvas.width = vw
      this.babylonCanvas.height = vh
      videoCnavas.width = vw
      videoCnavas.height = vh
      const videoContext = videoCnavas.getContext("2d")
      if (!videoContext) {
        throw new Error("no video contex")
      }
      videoContext.translate(vw, 0)
      videoContext.scale(-1, 1)
      this.engine.runRenderLoop(async () => {
        videoContext.drawImage(videoElem, 0, 0)
        await update()
        this.scene.render()
        if (this.resultCanvas) {
          const ctx = this.resultCanvas.getContext("2d")
          const cw = this.resultCanvas.width
          const ch = this.resultCanvas.height
          const ca = ch / cw
          let sourceX = 0
          let sourceY = 0
          let sourceH = vh
          let sourceW = vw
          if (ca > va) {
            sourceW = vh / ca
            sourceX = (vw - sourceW) / 2
          } else {
            sourceH = vw * ca
            sourceY = (vh - sourceH) / 2
          }
          ctx?.drawImage(videoCnavas, sourceX, sourceY, sourceW, sourceH, 0, 0, cw, ch)
          ctx?.drawImage(this.babylonCanvas, sourceX, sourceY, sourceW, sourceH, 0, 0, cw, ch)
        }
        console.log(this.engine.getFps())
      })
    })
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user"
      }
    })
    videoElem.srcObject = stream

    const positions = new Float32Array(468 * 3)
    const uvs = new Float32Array(468 * 2)
    for (let j = 0; j < 468; j++) {
      uvs[j * 2] = UVs[j][0]
      uvs[j * 2 + 1] = 1 - UVs[j][1]
    }
  }
}