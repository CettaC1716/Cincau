import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Beaker } from 'lucide-react';
import * as THREE from 'three';
import { playPopSound, playCheerSound } from '../utils/audioEffects';

interface Cincau3DLabModalProps {
  onClose: (earnedFood: number, earnedStars: number) => void;
}

export const Cincau3DLabModal: React.FC<Cincau3DLabModalProps> = ({ onClose }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [mixedColor, setMixedColor] = useState<string>('Emerald Cincau (Hijau)');
  const [mixCount, setMixCount] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1e1b4b'); // deep indigo lab

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2, 20);
    pointLight.position.set(2, 5, 3);
    scene.add(pointLight);

    // Lab Table Surface
    const tableGeo = new THREE.BoxGeometry(8, 0.3, 4);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -0.15;
    scene.add(tableMesh);

    // 3D Glass Flask Main
    const flaskGeo = new THREE.CylinderGeometry(1.2, 1.8, 2.5, 24);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
    });
    const flaskMesh = new THREE.Mesh(flaskGeo, glassMat);
    flaskMesh.position.set(0, 1.25, 0);
    scene.add(flaskMesh);

    // 3D Liquid Level Inside Flask
    const liquidGeo = new THREE.CylinderGeometry(1.1, 1.7, 1.8, 24);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981, // Emerald Cincau initial
      transmission: 0.4,
      opacity: 0.9,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.set(0, 0.9, 0);
    scene.add(liquidMesh);

    // Test Tube 1 (Red Strawberry)
    const tube1Geo = new THREE.CylinderGeometry(0.3, 0.3, 1.6, 16);
    const tube1Mat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.2 });
    const tube1 = new THREE.Mesh(tube1Geo, tube1Mat);
    tube1.position.set(-2.2, 0.8, 0.5);
    scene.add(tube1);

    // Test Tube 2 (Yellow Banana / Mango)
    const tube2Mat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.2 });
    const tube2 = new THREE.Mesh(tube1Geo, tube2Mat);
    tube2.position.set(2.2, 0.8, 0.5);
    scene.add(tube2);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Liquid subtle swirl animation
      liquidMesh.rotation.y = elapsedTime * 0.5;
      liquidMesh.scale.y = 1 + Math.sin(elapsedTime * 3) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  const handlePourColor = (colorHex: number, name: string) => {
    playPopSound();
    playCheerSound();
    setMixedColor(name);
    setMixCount((prev) => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg bg-indigo-950 text-white rounded-3xl shadow-2xl border-4 border-indigo-400 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Sains & Kimia 3D
            </span>
            <h3 className="text-lg font-extrabold tracking-tight mt-0.5 flex items-center gap-1.5">
              <span>🧪 Lab Kimia & Warna 3D</span>
            </h3>
          </div>
          <button
            onClick={() => onClose(1, 5)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Lab Viewport */}
        <div className="relative w-full h-[240px] bg-slate-900 overflow-hidden">
          <div ref={mountRef} className="w-full h-full" />

          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-indigo-400/40 text-xs font-bold flex items-center gap-2">
            <Beaker className="w-4 h-4 text-purple-300" />
            <span>Formulasi Agar-Agar:</span>
            <span className="text-emerald-300 font-extrabold">{mixedColor}</span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="p-4 bg-indigo-900 border-t border-indigo-800 space-y-3">
          <span className="text-xs font-bold text-indigo-200 block text-center">
            Campurkan cairan berwarna di bawah untuk melihat reaksi wujud benda!
          </span>

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handlePourColor(0xef4444, 'Sirup Merah Delima (Merah)')}
              className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              🍓 Tuang Merah
            </button>
            <button
              onClick={() => handlePourColor(0xeab308, 'Ekstrak Kunyit & Nanas (Kuning)')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              🍌 Tuang Kuning
            </button>
            <button
              onClick={() => handlePourColor(0x06b6d4, 'Cairan Cincau Murni (Cyan)')}
              className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              🌿 Tuang Cincau
            </button>
          </div>

          <button
            onClick={() => onClose(1, 5)}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Hasil Reaksi Selesai! Ambil Hadiah 🥣 +1 & ⭐ +5</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
