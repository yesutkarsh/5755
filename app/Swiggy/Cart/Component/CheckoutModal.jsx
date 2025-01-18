"use client"
import { useEffect, useState } from 'react';
import styles from './styles.module.css'
import { useSelector, useDispatch } from 'react-redux';
import { toggleCheckoutVisibility } from '@/utils/slice/ToggleSlice';
import { getDatabase, ref, push } from "firebase/database"; // Changed back to push
import { initializeApp } from 'firebase/app';

// Initialize Firebase with minimal config since rules are public
const app = initializeApp({
  databaseURL: "https://project-8269032991113480607-default-rtdb.firebaseio.com/"
});
const db = getDatabase(app);

export default function CheckoutModal({totalPrice}) {
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    const cartData = useSelector((state) => state.foodCart);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const email = event.target.email.value;
        // Convert email to valid Firebase key by replacing '.' with ','
        const emailKey = email.replace(/\./g, ',');

        try {
            const orderData = {
                name: event.target.name.value,
                email: email,
                phone: event.target.phone.value,
                address: event.target.address.value,
                items: cartData.items,
                totalPrice: cartData.totalPrice,
                timestamp: new Date().toISOString(),
            };

            // Create reference to user's orders
            const userOrdersRef = ref(db, `orders/${emailKey}`);
            // Push will create a new unique key under the user's email
            await push(userOrdersRef, orderData);
            
            console.log('Order submitted successfully');
            dispatch(toggleCheckoutVisibility());
        } catch (error) {
            console.error('Error submitting order:', error);
        }
    };

    const toggleCheckout = () => {
        dispatch(toggleCheckoutVisibility());
    };

    const getUser = async () => {
        try {
            const response = await fetch('/api/GetUser');
            if (!response.ok) throw new Error('Failed to fetch user');
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className={styles.modal}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Name" 
                    defaultValue={user?.given_name && user?.family_name ? `${user.given_name} ${user.family_name}` : ""} 
                    required 
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    defaultValue={user?.email || ""} 
                    required 
                />
                <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Phone" 
                    required 
                />
                <textarea 
                    name="address" 
                    placeholder="Address" 
                    required
                ></textarea>
                <button type="submit">PAY {totalPrice}</button>
                <span onClick={toggleCheckout}>Close</span>
            </form>
        </div>
    );
}