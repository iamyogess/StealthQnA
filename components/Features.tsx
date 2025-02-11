import { Lock, LucideIcon, MessageCircle, Shield, Sparkles } from "lucide-react";
import React from "react";

interface FeatureCardProps {
    icon: LucideIcon; 
    title: string;
    description: string;
  }
  
  const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center p-4 md:p-6 rounded-xl bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-gray-200/20 dark:border-white/10 hover:border-gray-200/30 dark:hover:border-white/20 transition-all">
      <Icon className="w-6 h-6 md:w-8 md:h-8 mb-3 md:mb-4 text-purple-500 dark:text-purple-400" />
      <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-xs md:text-sm text-gray-600 dark:text-zinc-400 text-center">{description}</p>
    </div>
  );
const Features = () => {
  return (
    <div className="max-w-6xl mx-auto w-full px-4 lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 -mt-32">
      <FeatureCard
        icon={Shield}
        title="Anonymous"
        description="Send messages without revealing your identity"
      />
      <FeatureCard
        icon={Lock}
        title="Secure"
        description="End-to-end encrypted messaging"
      />
      <FeatureCard
        icon={MessageCircle}
        title="Custom Links"
        description="Create your unique profile link"
      />
      <FeatureCard
        icon={Sparkles}
        title="Interactive"
        description="Engage with threaded conversations"
      />
    </div>
  );
};

export default Features;
