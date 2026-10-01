'use client';

export default function ApraLogo({ className = "w-10 h-10", variant = "default" }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-full shadow-xs shrink-0 aspect-square select-none bg-white ${className}`}>
      <img
        src="/images/logo.jpg"
        alt="APRA Official Logo"
        className="w-full h-full object-cover object-center rounded-full pointer-events-none"
        loading="eager"
      />
    </div>
  );
}

