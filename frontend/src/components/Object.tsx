import React from "react";

type ObjectProps = {
  title: string;
  description: string;
};

const Object: React.FC<ObjectProps> = ({ title, description }) => {
  return (
    <div className="min-w-0">
      <h3 className="text-sm font-semibold text-slate-900 truncate">{title}</h3>
      <p className="text-xs text-slate-600 line-clamp-2">{description}</p>
    </div>
  );
};

export default Object;
