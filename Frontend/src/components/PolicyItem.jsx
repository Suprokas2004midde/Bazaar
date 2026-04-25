import React from "react";

const PolicyItem = ({ icon: Icon, title, para }) => {
  return (
    <div>
      <Icon className="w-12 h-12 m-auto mb-5 text-gray-700" />
      <p className="font-semibold">{title}</p>
      <p className="text-gray-400">{para}</p>
    </div>
  );
};

export default PolicyItem;
