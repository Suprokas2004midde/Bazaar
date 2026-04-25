import React from "react";
import Title from "./Title";
import PolicyItem from "./PolicyItem";
import { RiExchangeFundsFill } from "react-icons/ri";
import { TbTruckReturn } from "react-icons/tb";
import { RiCustomerService2Fill } from "react-icons/ri";

const OurPolicy = () => {
  return (
    <div className="text-center text-3xl">
      <Title text1={"OUR"} text2={"POLICY"} />
      <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md::text-base text-gray-600">
        <PolicyItem
          icon={RiExchangeFundsFill}
          title={"Easy Exchange Policy"}
          para={"We offer hassel free exchange policy"}
        />
        <PolicyItem
          icon={TbTruckReturn}
          title={"7 Days Return Policy"}
          para={"We provide 7 days free return policy"}
        />
        <PolicyItem
          icon={RiCustomerService2Fill}
          title={"Best customer support"}
          para={"We provide 24/7 customer support"}
        />
      </div>
    </div>
  );
};

export default OurPolicy;
