/* eslint-disable react/no-unknown-property */
import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas} from '@react-three/fiber';

import { Loader } from '@react-three/drei';
import Effects from '../components/Effects';

import state from '../utils/state';
import Content from '../components/Content'; // ✅ Ensure this is imported

export default function AboutTestPage() {
  const scrollArea = useRef();
  const onScroll = (e) => (state.top = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);

  const [pages, setPages] = useState(0);

  return (
    <>
      <Canvas camera={{ position: [0, 0, 10], far: 1000 }} onCreated={({ gl }) => gl.setClearColor('#f5f5f5')}>
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <ambientLight intensity={0.4} />
        <spotLight
          castShadow
          angle={0.3}
          penumbra={1}
          position={[0, 10, 20]}
          intensity={5}
          shadow-mapSize={[1024, 1024]} // ✅ Fixed
        />
        <Suspense fallback={null}>
          <Content onReflow={setPages} />
        </Suspense>
        <Effects />
      </Canvas>
      <div ref={scrollArea} onScroll={onScroll}>
        <div style={{ height: `${pages * 100}vh` }} />
      </div>
      <Loader />
    </>
  );
}
