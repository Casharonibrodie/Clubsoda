/* eslint-disable react/no-unknown-property */
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { WaterPass } from './shaders/WaterPass'
import state from '../utils/state'

extend({ EffectComposer, ShaderPass, RenderPass, WaterPass })

export default function Effects() {
  const composer = useRef()
  const water = useRef()
  const { gl, size, camera, scene } = useThree()

  useEffect(() => {
    if (composer.current) {
      composer.current.setSize(size.width, size.height)
    }
  }, [size])

  let last = state.top
  let index = 0
  let values = new Array(10).fill(0)

  useFrame(() => {
    const { top } = state
    values[index] = Math.abs(top - last)
    const normalize = values.reduce((a, b) => a + b) / values.length

    if (water.current) {
      water.current.factor = THREE.MathUtils.lerp(water.current.factor, normalize / 20, 0.1)
    }

    last = top
    index = (index + 1) % 10
    gl.autoClear = true

    if (composer.current) {
      composer.current.render()
    }
  }, 1)

  return (
    <>
      {/* eslint-disable react/no-unknown-property */}
      <primitive ref={composer} object={new EffectComposer(gl)}>
        <primitive object={new RenderPass(scene, camera)} />
        <primitive ref={water} object={new WaterPass()} />
        <primitive object={new ShaderPass(GammaCorrectionShader)} />
      </primitive>
      {/* eslint-enable react/no-unknown-property */}
    </>
  )
}
