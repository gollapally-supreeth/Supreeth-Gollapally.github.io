import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Extend TextGeometry for R3F
import { extend } from '@react-three/fiber';
extend({ TextGeometry });

// Helper to load font (we'll use a standard google font JSON from CDN for simplicity in this demo)
const FONT_URL = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json';

const Particles = ({ symbol, isHovered }) => {
    const pointsRef = useRef();
    const [font, setFont] = useState(null);

    useEffect(() => {
        new FontLoader().load(FONT_URL, (loadedFont) => {
            setFont(loadedFont);
        });
    }, []);

    const { positions, randomPositions } = useMemo(() => {
        if (!font) return { positions: [], randomPositions: [] };

        // Dynamic size sizing
        const size = Math.min(1.5, 3.5 / Math.max(2, symbol.length));

        const textGeo = new TextGeometry(symbol, {
            font: font,
            size: size,
            height: 0,
            curveSegments: 12,
            bevelEnabled: false,
        });

        textGeo.center();

        // --- Surface Sampling Logic ---
        const posAttribute = textGeo.attributes.position;
        const indexAttribute = textGeo.index;

        const triangleCount = indexAttribute ? indexAttribute.count / 3 : posAttribute.count / 3;
        const positionsArr = [];

        // Helper to get vertex
        const getVertex = (i) => {
            return new THREE.Vector3().fromBufferAttribute(posAttribute, i);
        };

        // Calculate triangle areas to weight sampling
        const areas = [];
        let totalArea = 0;

        for (let i = 0; i < triangleCount; i++) {
            let idx0, idx1, idx2;
            if (indexAttribute) {
                idx0 = indexAttribute.getX(i * 3);
                idx1 = indexAttribute.getX(i * 3 + 1);
                idx2 = indexAttribute.getX(i * 3 + 2);
            } else {
                idx0 = i * 3;
                idx1 = i * 3 + 1;
                idx2 = i * 3 + 2;
            }

            const v0 = getVertex(idx0);
            const v1 = getVertex(idx1);
            const v2 = getVertex(idx2);

            // Area = 0.5 * length(cross(v1-v0, v2-v0))
            const edge1 = new THREE.Vector3().subVectors(v1, v0);
            const edge2 = new THREE.Vector3().subVectors(v2, v0);
            const cross = new THREE.Vector3().crossVectors(edge1, edge2);
            const area = 0.5 * cross.length();

            areas.push(area);
            totalArea += area;
        }

        // Target particle count - increased for solidity
        const PARTICLE_COUNT = 4000;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // 1. Pick random triangle weighted by area
            const r = Math.random() * totalArea;
            let accumulated = 0;
            let triangleIndex = 0;

            for (let j = 0; j < areas.length; j++) {
                accumulated += areas[j];
                if (accumulated >= r) {
                    triangleIndex = j;
                    break;
                }
            }

            // 2. Sample random point in triangle (Barycentric coordinates)
            let alpha = Math.random();
            let beta = Math.random();

            if (alpha + beta > 1) {
                alpha = 1 - alpha;
                beta = 1 - beta;
            }
            const gamma = 1 - alpha - beta;

            let idx0, idx1, idx2;
            if (indexAttribute) {
                idx0 = indexAttribute.getX(triangleIndex * 3);
                idx1 = indexAttribute.getX(triangleIndex * 3 + 1);
                idx2 = indexAttribute.getX(triangleIndex * 3 + 2);
            } else {
                idx0 = triangleIndex * 3;
                idx1 = triangleIndex * 3 + 1;
                idx2 = triangleIndex * 3 + 2;
            }

            const v0 = getVertex(idx0);
            const v1 = getVertex(idx1);
            const v2 = getVertex(idx2);

            const px = alpha * v0.x + beta * v1.x + gamma * v2.x;
            const py = alpha * v0.y + beta * v1.y + gamma * v2.y;
            const pz = alpha * v0.z + beta * v1.z + gamma * v2.z;

            positionsArr.push(px, py, pz);
        }

        const randomPos = new Float32Array(positionsArr.length);
        for (let i = 0; i < positionsArr.length; i++) {
            randomPos[i] = (Math.random() - 0.5) * 12; // Wider scatter
        }

        return {
            positions: new Float32Array(positionsArr),
            randomPositions: randomPos
        };
    }, [font, symbol]);

    // Current positions buffer
    const currentPositions = useMemo(() => {
        return new Float32Array(randomPositions.length);
    }, [randomPositions]);

    // Copy initial random positions
    useEffect(() => {
        if (randomPositions.length > 0) {
            currentPositions.set(randomPositions);
        }
    }, [randomPositions, currentPositions]);

    useFrame((state) => {
        if (!pointsRef.current || positions.length === 0) return;

        const target = isHovered ? positions : randomPositions;

        // Lerp animation
        const speed = isHovered ? 0.08 : 0.03;

        for (let i = 0; i < currentPositions.length; i++) {
            currentPositions[i] += (target[i] - currentPositions[i]) * speed;

            // Add subtle noise/float when formed
            if (isHovered) {
                currentPositions[i] += Math.sin(state.clock.elapsedTime * 3 + i) * 0.003;
            } else {
                // Slower float when dispersed
                currentPositions[i] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.005;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    if (!font) return null;

    return (
        <Center>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={currentPositions.length / 3}
                        array={currentPositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.035}
                    color="#C7FB38"
                    sizeAttenuation={true}
                    depthWrite={false}
                    transparent={true}
                    opacity={0.9}
                />
            </points>
        </Center>
    );
};

const ParticleImage = ({ symbol, isHovered }) => {
    return (
        <div className="w-full h-full absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <Particles symbol={symbol} isHovered={isHovered} />
            </Canvas>
        </div>
    );
};

export default ParticleImage;
