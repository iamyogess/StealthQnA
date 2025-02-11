"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Shield,
  Lock,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

interface FeatureCardProps {
  icon: LucideIcon; // Ensures 'icon' is a valid Lucide React icon
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex flex-col items-center p-4 md:p-6 rounded-xl bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-gray-200/20 dark:border-white/10 hover:border-gray-200/30 dark:hover:border-white/20 transition-all">
    <Icon className="w-6 h-6 md:w-8 md:h-8 mb-3 md:mb-4 text-purple-500 dark:text-purple-400" />
    <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="text-xs md:text-sm text-gray-600 dark:text-zinc-400 text-center">
      {description}
    </p>
  </div>
);

const LandingPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <div className="w-full bg-gray-50 dark:bg-black">
        <AuroraBackground className="bg-white/50 dark:bg-zinc-950/50">
          {/* Hero Section */}
          <section className="pt-20 pb-12 md:pt-24 md:pb-16 px-4 relative">
            <div className="max-w-6xl mx-auto w-full">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-6 text-center lg:text-left">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600">
                      Share Secrets
                    </span>
                    <br />
                    <span className="text-gray-900 dark:text-white">
                      Stay Anonymous
                    </span>
                  </h1>
                  <p className="text-base md:text-lg text-gray-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0">
                    Express yourself freely with our anonymous messaging
                    platform. Connect authentically without revealing your
                    identity.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    {session ? (
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                      >
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                        >
                          Get Started
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-white/5 dark:text-white"
                        >
                          How It Works
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Features Grid */}
                <div className=" hidden lg:grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
            </div>
          </section>
        </AuroraBackground>
      </div>
    </>
  );
};

export default LandingPage;
