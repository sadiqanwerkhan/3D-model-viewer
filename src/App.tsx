import { Canvas } from "@react-three/fiber";

export default function App() {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight />
      </Canvas>
    </div>
  );
}
