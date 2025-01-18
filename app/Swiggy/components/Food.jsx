import React from 'react'
import styles from './styles.module.css'
import item from '@/app/api/nearbyResturant/FoodItems/items'
import { useDispatch, useSelector } from "react-redux";
import { toggleMenuVisibility } from "@/utils/slice/ToggleSlice";
import { addItem, removeItem, updateQuantity, clearCart  } from '@/utils/slice/foodCartSlice';

export default function Food(props) {
    const dispatch = useDispatch();
    let toggleMenu = () => {
        dispatch(toggleMenuVisibility());
    };


    const { items, totalPrice } = useSelector((state) => state.foodCart);
  return (
        <>
    <div className={styles.foodList}>
        <button className={styles.close} onClick={toggleMenu}>
    <i className="ri-close-large-line" > Cose</i>
        </button>
        <div className={styles.resName}>{props.resName}</div>
        <p className={styles.resAddress}>{props.resAddress}</p>
        {item.map((item,index)=>{
            return (
                <div key={index} className={styles.foodItem}>
                    <div className={styles.foodInfo}>
                        <h3>{item.itemName}</h3>
                        <p>{item.description}</p>
                        <div className={styles.rating}>
                            <span>{item.ratings}</span>
                            <br />
                            <span style={{color:"#d6ab52"}}>{item.reviews}</span>
                        </div>
                    </div>
                    <div className={styles.foodImage}>
                    <img src={item.image} alt="" />
                    <button>ADD</button>
                    </div>
                </div>
            )
        })}
    </div>
                </>
  )
}
