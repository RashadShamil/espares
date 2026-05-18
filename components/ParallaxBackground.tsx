export default function ParallaxBackground({ 
  imageUrl = '/parallax-light.png', 
  opacity = 100,
  washOpacity = 40
}: {
  imageUrl?: string;
  opacity?: number;
  washOpacity?: number;
}) {
  return (
    <div className="fixed inset-0 -z-20 pointer-events-none w-full h-full bg-[#F8F9FA]">
      <div 
        className="absolute inset-0 bg-cover bg-[center_30%] md:bg-center mix-blend-multiply"
        style={{ 
          backgroundImage: `url('${imageUrl}')`,
          opacity: opacity / 100 
        }}
      ></div>
      {/* Light Wash Overlay for Readability */}
      <div 
        className="absolute inset-0 bg-white"
        style={{ opacity: washOpacity / 100 }}
      ></div>
    </div>
  );
}
