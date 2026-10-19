import { useState, useRef, type ReactNode, type MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  maxTilt?: number;
  glareOpacity?: number;
  style?: React.CSSProperties;
}

export default function TiltCard({
  children,
  className = '',
  onClick,
  maxTilt = 12,
  glareOpacity = 0.25,
  style = {},
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    const rotateX = -normY * maxTilt;
    const rotateY = normX * maxTilt;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt((prev) => ({
      ...prev,
      x: 0,
      y: 0,
      isHovered: false,
    }));
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${
          tilt.isHovered ? 1.02 : 1
        }, ${tilt.isHovered ? 1.02 : 1}, 1)`,
        transition: tilt.isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}

      {/* Dynamic Specular Glare Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(circle 280px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,${
            tilt.isHovered ? glareOpacity : 0
          }) 0%, transparent 80%)`,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
          zIndex: 3,
        }}
      />
    </div>
  );
}
