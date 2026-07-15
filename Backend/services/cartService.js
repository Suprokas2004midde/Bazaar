import { findUserRepository, updateCartRepository } from "../repository/cartRepository.js";
import { findProductIdRepository } from "../repository/productRepository.js"


export const addToCartService = async(userId, itemId, size)=>{

    //Fetching the userdata
    const userdata = await findUserRepository(userId);

    //Extracting the cartdata of the user
    let cartData = await userdata.cartData;

    //Updating the cart using the received Props
    if(cartData[itemId]){
        if(cartData[itemId][size]){
            cartData[itemId][size] +=1;
        }
        else{
            cartData[itemId][size] = 1;
        }
    }
    else{
        cartData[itemId] = {}
        cartData[itemId][size] = 1
    }

    //Calling the Repository layer for updating the final cart into the DB
    const response = await updateCartRepository(userId, {cartData});
    return response;
}

export const updateCartService = async (userId, itemId, size, quantity)=>{

    const userdata = await findUserRepository(userId);
    let cartData = await userdata.cartData;

    if (quantity === 0) {
        // Remove the specific size entry
        if (cartData[itemId]) {
            delete cartData[itemId][size];
            // If no sizes left for this item, remove the item entirely
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        }
    } else {
        // Guard against itemId not existing in DB cart
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        cartData[itemId][size] = quantity;
    }

    const response = await updateCartRepository(userId, {cartData});
    return response;
}
export const getUserCartService = async (userId)=>{
    const userdata = await findUserRepository(userId);
    let cartData = await userdata.cartData;
    return cartData;
}