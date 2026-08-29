import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function ProductBox() {
  return (
    <mesh rotation={[0, 0.5, 0]}>
      <boxGeometry args={[2, 2.8, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

function ThreeDemo() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        Explore MegaSale in 3D
      </h2>

      <div className="h-96 w-full">
        <Canvas>
          <ambientLight intensity={1} />

          <directionalLight
            position={[5, 5, 5]}
            intensity={2}
          />

          <ProductBox />

          <OrbitControls />
        </Canvas>
      </div>
    </section>
  );
}

export default ThreeDemo;