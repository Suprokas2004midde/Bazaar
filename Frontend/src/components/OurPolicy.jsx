import React from "react";
import Title from "./Title";
import PolicyItem from "./PolicyItem";
import { RefreshCw, ShieldCheck, Headphones } from "lucide-react";

const OurPolicy = () => {
  return (
    <section className="my-16 text-center">
      <Title text1={"OUR"} text2={"POLICY"} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <PolicyItem
          icon={RefreshCw}
          title={"Easy Exchange Policy"}
          para={"We offer hassle-free exchange policy on all products"}
        />
        <PolicyItem
          icon={ShieldCheck}
          title={"7 Days Return Policy"}
          para={"We provide 7 days free return guarantee"}
        />
        <PolicyItem
          icon={Headphones}
          title={"Best Customer Support"}
          para={"We provide 24/7 dedicated customer support"}
        />
      </div>
    </section>
  );
};

export default OurPolicy;
