import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
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
  // Original hooked blade profile with perforations, extruded and bevelled.
  const s = new THREE.Shape()
  s.moveTo(-0.02, 0.03)
  s.lineTo(0.02, 0.03)
  s.bezierCurveTo(0.03, -0.04, 0.03, -0.1, 0.0, -0.15)
  s.bezierCurveTo(-0.06, -0.22, -0.2, -0.25, -0.3, -0.235)
  s.bezierCurveTo(-0.335, -0.228, -0.34, -0.2, -0.325, -0.175)
  s.bezierCurveTo(-0.3, -0.14, -0.2, -0.13, -0.12, -0.11)
  s.bezierCurveTo(-0.05, -0.09, -0.025, -0.04, -0.02, 0.03)
  const holes = [[-0.04, -0.135, 0.012], [-0.09, -0.16, 0.014], [-0.145, -0.175, 0.014], [-0.2, -0.185, 0.013], [-0.255, -0.19, 0.011], [-0.012, -0.08, 0.009]]
  for (const [x, y, r] of holes) {
    const h = new THREE.Path()
    h.absellipse(x, y, r * 1.5, r, 0, Math.PI * 2, false, -0.3)
    s.holes.push(h)
  }
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.006, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 4, curveSegments: 48 })
  geo.translate(0, 0, -0.003)
  // Curve the blade face slightly (heel-to-toe hook).
  const p = geo.attributes.position
  for (let i = 0; i < p.count; i++) { const x = p.getX(i); p.setZ(i, p.getZ(i) + x * x * 0.45) }
  geo.computeVertexNormals()
  return geo
}

function gripTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 1024
  const g = c.getContext('2d')
  g.fillStyle = '#fff'; g.fillRect(0, 0, 256, 1024)
  for (let y = -256; y < 1280; y += 22) {
    g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 5
    g.beginPath(); g.moveTo(0, y); g.lineTo(256, y + 256); g.stroke()
  }
  for (let i = 0; i < 6000; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`; g.fillRect(Math.random() * 256, Math.random() * 1024, 2, 2) }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  return t
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.85
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    const key = new THREE.DirectionalLight(0xffffff, 2.5); key.position.set(1.5, 3, 2); key.castShadow = true
    key.shadow.mapSize.set(2048, 2048); key.shadow.camera.left = key.shadow.camera.bottom = -1; key.shadow.camera.right = key.shadow.camera.top = 1
    scene.add(key)

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.ShadowMaterial({ opacity: 0.35 }))
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.62; floor.receiveShadow = true
    scene.add(floor)

    const stick = new THREE.Group()
    stick.rotation.z = -0.3
    scene.add(stick)
    const cast = (m) => { m.castShadow = true; return m }

    // Tapered composite shaft: wider top, slimmer near the blade.
    const shaftMat = new THREE.MeshPhysicalMaterial({ roughness: 0.3, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.08 })
    const shaftMesh = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.0145, 0.0125, 0.8, 64, 1, true), shaftMat))
    shaftMesh.position.y = -0.02
    stick.add(shaftMesh)

    // Wrapped grip with texture, raised edge and end cap.
    const gripMat = new THREE.MeshStandardMaterial({ roughness: 0.85, map: gripTexture(), bumpMap: gripTexture(), bumpScale: 2 })
    const gripMesh = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.0168, 0.0158, 0.28, 64), gripMat))
    gripMesh.position.y = 0.5
    stick.add(gripMesh)
    const edgeMat = new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.5 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.0162, 0.0018, 12, 64), edgeMat)
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.36; stick.add(ring)
    const cap = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.0172, 0.018, 64), edgeMat))
    cap.position.y = 0.648; stick.add(cap)
    const capTop = new THREE.Mesh(new THREE.SphereGeometry(0.019, 48, 12, 0, Math.PI * 2, 0, Math.PI / 2), edgeMat)
    capTop.scale.y = 0.3; capTop.position.y = 0.657; stick.add(capTop)

    // Throat collar joining shaft and blade.
    const collar = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.0135, 0.016, 0.05, 48), edgeMat))
    collar.position.y = -0.43; stick.add(collar)

    const bladeMat = new THREE.MeshPhysicalMaterial({ roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.3, side: THREE.DoubleSide })
    const bladeMesh = cast(new THREE.Mesh(bladeGeometry(), bladeMat))
    bladeMesh.position.y = -0.44
    bladeMesh.rotation.y = 0.45
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
    p.gripMat.needsUpdate = true
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
