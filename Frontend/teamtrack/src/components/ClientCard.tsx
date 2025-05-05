import React from "react";

interface ClientCardProps {
  imageUrl: string;
  title: string;
}

export const ClientCard: React.FC<ClientCardProps> = ({ imageUrl, title }) => {
  return (
<div className="flex items-center justify-between w-[230px] h-[100px] p-6 bg-white rounded-xl shadow-md border border-gray-200">
  <div className="flex items-center justify-center w-14 h-14 bg-white rounded">
    <img
      src={imageUrl}
      alt={title}
      className="w-12 h-12 object-contain aspect-square"
    />
  </div>
  <h2 className="text-xl font-medium pl-10">{title}</h2>
</div>
  );
};