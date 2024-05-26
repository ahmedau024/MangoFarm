"use client";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="
    mx-auto
    contianer
    px-5
    "
    >
      {children}
    </div>
  );
};

export default Container;
