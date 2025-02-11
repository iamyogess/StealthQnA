import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ThemeProvider } from "./ThemeProvider";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;