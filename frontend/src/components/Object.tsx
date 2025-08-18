import React from "react";

type ObjectProps = {
  title: string;
  description: string;
};

const Object: React.FC<ObjectProps> = ({ title, description }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-3 h-3 mt-1.5 rounded-full bg-green-400" />
      <div>
        <h3 className="text-sm font-semibold text-blue-800">{title}</h3>
        <p className="text-xs text-blue-500/80 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default Object;
