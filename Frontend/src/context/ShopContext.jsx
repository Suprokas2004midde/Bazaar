import { createContext } from "react"
import { productsDummyData } from "../assets/asset";

export const ShopContext = createContext()

export const ShopContextProvider = (props) =>{

    const CurrencySym = "₹";
    const DeliveryFees = 50;

    const value = {
        productsDummyData, CurrencySym, DeliveryFees,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

