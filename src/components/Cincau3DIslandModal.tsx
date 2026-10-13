import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Award } from 'lucide-react';
import * as THREE from 'three';
import { playPopSound, playCheerSound } from '../utils/audioEffects';

interface Cincau3DIslandModalProps {
  onClose: (earnedFood: number, earnedStars: number) => void;
}

export const Cincau3DIslandModal: React.FC<Cincau3DIslandModalProps> = ({ onClose }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [starsFound, setStarsFound] = useState(0);
  const [currentFact, setCurrentFact] = useState<string>('Ketuk tombol Arah atau Geser Layar untuk menggelindingkan Cincau 3D di Pulau Floating!');

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 300;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#dbeafe'); // soft sky blue

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 10, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.2);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Island Base (Low-poly Floating Hexagon / Cylinder)
    const islandGeo = new THREE.CylinderGeometry(6, 4, 2, 7);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      roughness: 0.6,
      flatShading: true,
    });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.y = -1;
    scene.add(islandMesh);

    // Earth Underlayer
    const earthGeo = new THREE.CylinderGeometry(4, 2, 3, 7);
    const earthMat = new THREE.MeshStandardMaterial({ color: 0x78350f, flatShading: true });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.y = -3.2;
    scene.add(earthMesh);

    // Cincau 3D Jelly Character (Shiny sphere with soft squish)
    const cincauGeo = new THREE.SphereGeometry(0.9, 24, 24);
    const cincauMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4, // cyan jelly
      transmission: 0.6,
      opacity: 0.95,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      ior: 1.3,
    });
    const cincauMesh = new THREE.Mesh(cincauGeo, cincauMat);
    cincauMesh.position.set(0, 0.9, 0);
    scene.add(cincauMesh);

    // 3D Eyes for Cincau
    const eyeGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.3, 0.2, 0.85);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.3, 0.2, 0.85);
    cincauMesh.add(leftEye);
    cincauMesh.add(rightEye);

    // Floating Collectible Gems (Stars / Chests)
    const gemGeo = new THREE.OctahedronGeometry(0.4, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.4,
    });

    const gems: THREE.Mesh[] = [];
    const gemPositions = [
      { x: -3, z: -2 },
      { x: 3, z: -2 },
      { x: 0, z: 3 },
      { x: -2, z: 2 },
    ];

    gemPositions.forEach((pos) => {
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.set(pos.x, 0.8, pos.z);
      scene.add(gem);
      gems.push(gem);
    });

    // Decorative Low-Poly Trees
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 5);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, flatShading: true });
    const leavesGeo = new THREE.ConeGeometry(0.7, 1.2, 5);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x059669, flatShading: true });

    [
      { x: -4, z: -1 },
      { x: 4, z: 1 },
      { x: -1, z: -4 },
    ].forEach((pos) => {
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(pos.x, 0.4, pos.z);
      scene.add(trunk);
      const leaves = new THREE.Mesh(leavesGeo, leavesMat);
      leaves.position.set(pos.x, 1.2, pos.z);
      scene.add(leaves);
    });

    // Animation & Physics Loop
    let animId: number;
    let targetX = 0;
    let targetZ = 0;
    let clock = new THREE.Clock();

    const factsList = [
      '✨ Fakta Sains 3D: Cincau terbuat dari ekstrak daun Cincau hijau yang kaya serat alam!',
      '🌟 Fakta Nusantara: Indonesia memiliki lebih dari 17.000 pulau indah terbentang dari Sabang sampai Merauke!',
      '🚀 Fakta Alam Semesta: Cahaya Matahari membutuhkan waktu sekitar 8 menit untuk sampai ke Pulau Cincau!',
      '🌿 Fakta Satwa: Burung Cendrawasih menari di atas pepohonan Papua untuk menyapa temannya!',
    ];

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Cincau movement toward target
      cincauMesh.position.x += (targetX - cincauMesh.position.x) * 0.1;
      cincauMesh.position.z += (targetZ - cincauMesh.position.z) * 0.1;

      // Jelly Breathing / Wobble
      cincauMesh.scale.y = 1 + Math.sin(elapsedTime * 4) * 0.08;
      cincauMesh.scale.x = 1 - Math.sin(elapsedTime * 4) * 0.04;
      cincauMesh.scale.z = 1 - Math.sin(elapsedTime * 4) * 0.04;

      // Rotate Island & Gems
      gems.forEach((gem, idx) => {
        gem.rotation.y += 0.03;
        gem.position.y = 0.8 + Math.sin(elapsedTime * 3 + idx) * 0.15;

        // Check collision with Cincau
        const dist = cincauMesh.position.distanceTo(gem.position);
        if (dist < 1.2 && gem.visible) {
          gem.visible = false;
          playCheerSound();
          setStarsFound((prev) => {
            const next = prev + 1;
            setCurrentFact(factsList[next % factsList.length]);
            return next;
          });
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Interaction Touch / Click to Move 3D Cincau
    const handleMove = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;

      targetX = x * 4;
      targetZ = y * 4;
      playPopSound();
    };

    const onPointerDown = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('touchstart', onTouchStart);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('touchstart', onTouchStart);
      if (renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

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
        className="w-full max-w-lg bg-sky-900 text-white rounded-3xl shadow-2xl border-4 border-sky-400 overflow-hidden flex flex-col relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600 p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Petualangan 3D WebGL
            </span>
            <h3 className="text-lg font-extrabold tracking-tight mt-0.5 flex items-center gap-1.5">
              <span>🏝️ Taman Bermain 3D Cincau</span>
            </h3>
          </div>
          <button
            onClick={() => onClose(1, 5)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative w-full h-[280px] bg-sky-950 cursor-pointer overflow-hidden">
          <div ref={mountRef} className="w-full h-full" />

          {/* Floating HUD */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-sky-400/40 text-xs font-bold flex items-center gap-2">
            <span>⭐ Permata Bintang 3D:</span>
            <span className="text-amber-300 font-extrabold text-sm">{starsFound} / 4</span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 bg-sky-950/80 backdrop-blur-md p-3 rounded-2xl border border-sky-400/40 text-xs font-semibold leading-snug">
            {currentFact}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-sky-950 flex justify-between items-center border-t border-sky-800">
          <span className="text-xs text-sky-300 font-bold">Tekan pulau 3D untuk menggerakkan Cincau!</span>
          <button
            onClick={() => onClose(1, 5)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Kumpulkan Hadiah 🥣 +1 & ⭐ +5</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
