import React from "react";
import { Card, CardContent } from "./ui/card";

const PolicyItem = ({ icon: Icon, title, para }) => {
  return (
    <Card className="hover:border-[var(--primary-accent)]/80 transition-all duration-300 group">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <div className="p-4 rounded-full bg-[var(--secondary-accent)]/15 text-[var(--primary-accent)] group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-base text-[var(--text-main)]">{title}</h3>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">{para}</p>
      </CardContent>
    </Card>
  );
};

export default PolicyItem;
