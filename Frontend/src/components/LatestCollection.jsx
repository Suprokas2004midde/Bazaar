import {useContext} from 'react'
import { ShopContext } from '../context/ShopContext.jsx'

const LatestCollection = () => {

    const { productsDummyData } = useContext(ShopContext);
    console.log(productsDummyData);

  return (
    <div>
      
    </div>
  )
}

export default LatestCollection
