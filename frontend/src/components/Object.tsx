import React from "react";

type ObjectProps = {
  title: string;
  description: string;
};

const Object: React.FC<ObjectProps> = ({ title, description }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-blue-800">{title}</h3>
      <p className="text-xs text-blue-500/80 line-clamp-2">{description}</p>
    </div>
  );
};

export default Object;
