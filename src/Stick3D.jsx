import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function textTexture(text, accent) {
  const c = document.createElement('canvas')
  c.width = 1024; c.height = 64
  const g = c.getContext('2d')
  g.fillStyle = '#1c1c1c'; g.fillRect(0, 0, c.width, c.height)
  g.fillStyle = accent; g.fillRect(0, 28, c.width, 8)
  if (text) {
    g.fillStyle = '#1c1c1c'; g.fillRect(380, 0, 264, 64)
    g.fillStyle = '#fff'; g.font = 'bold 44px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'
    g.fillText(text, 512, 34)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function bladeGeometry() {
  // Side profile of a hooked blade, extruded to thickness.
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.lineTo(0.035, 0)
  s.bezierCurveTo(0.05, -0.12, 0.02, -0.2, -0.08, -0.24)
  s.bezierCurveTo(-0.18, -0.27, -0.3, -0.26, -0.33, -0.23)
  s.bezierCurveTo(-0.34, -0.2, -0.3, -0.18, -0.22, -0.17)
  s.bezierCurveTo(-0.1, -0.15, -0.03, -0.1, -0.035, 0)
  s.lineTo(0, 0)
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 3, curveSegments: 32 })
  geo.translate(0, 0, -0.006)
  return geo
}

export default function Stick3D({ shaft, blade, grip, text, shape, accent }) {
  const mount = useRef(null)
  const parts = useRef(null)

  useEffect(() => {
    const el = mount.current
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 50)
    camera.position.set(1.0, 0.2, 2.7)
    scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1.6))
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(2, 3, 2); scene.add(key)
    const rim = new THREE.DirectionalLight(0xffffff, 1); rim.position.set(-2, 1, -2); scene.add(rim)

    const stick = new THREE.Group()
    stick.rotation.z = -0.35
    scene.add(stick)

    const shaftMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.2 })
    const shaftMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.75, 48, 1, true), shaftMat)
    stick.add(shaftMesh)

    const gripMat = new THREE.MeshStandardMaterial({ roughness: 0.9 })
    const gripMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.0165, 0.0165, 0.3, 48), gripMat)
    gripMesh.position.y = 0.52
    stick.add(gripMesh)
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.0175, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), gripMat)
    cap.position.y = 0.67
    stick.add(cap)

    const bladeMat = new THREE.MeshStandardMaterial({ roughness: 0.45, side: THREE.DoubleSide })
    const bladeMesh = new THREE.Mesh(bladeGeometry(), bladeMat)
    bladeMesh.position.y = -0.375
    bladeMesh.rotation.y = Math.PI / 2
    stick.add(bladeMesh)

    // If a custom model exists at /models/stick.glb, use it instead of the built-in stick.
    new GLTFLoader().load('/models/stick.glb', (gltf) => {
      const model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3())
      const k = 1.1 / Math.max(size.x, size.y, size.z)
      model.scale.setScalar(k)
      model.position.sub(center.multiplyScalar(k))
      stick.clear(); stick.rotation.z = 0; stick.add(model)
    }, undefined, () => {})

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 0.6
    controls.maxDistance = 4
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.2
    controls.addEventListener('start', () => { controls.autoRotate = false })

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(el)

    let raf
    const loop = () => { controls.update(); renderer.render(scene, camera); raf = requestAnimationFrame(loop) }
    loop()

    parts.current = { shaftMat, shaftMesh, gripMat, bladeMat, controls, camera }
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const p = parts.current; if (!p) return
    p.shaftMat.map?.dispose()
    const tex = textTexture(text, shaft.color)
    tex.rotation = Math.PI / 2; tex.center.set(0.5, 0.5)
    p.shaftMat.map = tex; p.shaftMat.needsUpdate = true
    p.gripMat.color.set(grip.color)
    p.bladeMat.color.set(blade.color)
    p.shaftMesh.scale.set(shape === 'Oval' ? 1.3 : 1, 1, shape === 'Oval' ? 0.8 : 1)
  }, [shaft, blade, grip, text, shape, accent])

  const resetView = () => {
    const p = parts.current; if (!p) return
    p.camera.position.set(1.0, 0.2, 2.7); p.controls.target.set(0, 0, 0); p.controls.autoRotate = true
  }

  return <div style={{ position: 'absolute', inset: 0 }}>
    <div ref={mount} style={{ position: 'absolute', inset: 0, cursor: 'grab' }} />
    <button onClick={resetView} style={{ position: 'absolute', bottom: 16, left: 16, background: 'none', color: '#aaa', border: '1px solid #444', borderRadius: 4, padding: '6px 10px', cursor: 'pointer', fontSize: 12 }}>Reset view</button>
    <div style={{ position: 'absolute', bottom: 20, right: 16, color: '#666', fontSize: 11 }}>Drag to rotate · scroll to zoom</div>
  </div>
}
