"use client";

import styles from './styles.module.css';
import Link from "next/link";
import MapAnalytics from "./components/MapAnalytics";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUser } from "@/utils/slice/userSlice";
import ServiceCards from '../ServicesOffer/ServicessOffer';

export default function Hero() {
    const dispatch = useDispatch();
    // Get the entire user object from the store
    const user = useSelector((state) => state.user);

    useEffect(() => {
        // Only fetch if essential user data is missing
        const isUserDataMissing = !user.id || !user.email;
        
        async function fetchUser() {
            if (isUserDataMissing) {
                try {
                    const response = await fetch('/api/GetUser');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const userData = await response.json();
                    console.log('Fetched user data:', userData);
                    dispatch(setUser(userData));
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        }

        fetchUser();
    }, [dispatch, user.id, user.email]); // Dependencies changed to specific fields

    // Debug logging
    console.log('Current user state:', user);

    return (
        <div className={styles.hero}>
            {user.given_name && (
                <div className={styles.heroContent}>
                    <span>Hi, {user.given_name}</span>
                    <p>One app, all your traffic solutions—streamline, 
                    navigate, and arrive smarter!</p>
                </div>
            )}
          

            <div className={styles.services}>
                <div className={styles.crasoul}>
                    <Link href="/SOS">
                    <span style={{backgroundColor:"red"}}>
                    <i class="ri-base-station-line"></i> SOS
                    </span>
                    </Link>
                    <span>
                        <Link href="/SOSADMIN">
                        <i style={{color:"#f0de3f"}} className="ri-taxi-fill"></i> SOS ADMIN
                        </Link>
                    </span>
                    <span>
                        <i className="ri-timer-2-fill"></i> Watch List
                    </span>
                    <Link href="/EntHub">
                    <span>
                        <i className="ri-timer-2-fill"></i> Entertainment Hub
                    </span>
                    </Link>
                    <Link href="/Account">
                        <span>
                            <i className="ri-user-3-fill"></i> Account
                        </span>
                    </Link>
                </div>
                
                <div className={styles.crasoul}>
                    <Link href="/GetTraffic">
                    <span className={styles.brandSponser}>
                        <img src="https://res.cloudinary.com/dpcvcblbt/image/upload/v1737160183/5755/kyj6wtodyz313cjsoomq.png" alt="Sponsor 1" />
                        <img src="https://res.cloudinary.com/dpcvcblbt/image/upload/v1737160234/5755/t0vihgw7d0dfa99shyvl.png" alt="Sponsor 2" />
                         Explore Places
                    </span>
                    </Link>
                    <Link href="/Swiggy">
                        <span>
                            <i className="ri-restaurant-line"></i> Order Food
                        </span>
                    </Link>
                    <Link href="/meet">
                    <span>
                        <i className="ri-slideshow-3-fill"></i> Meeting
                    </span>
                    </Link>
                    <Link href="/Analytics">
                    <span>
                        <i style={{color:"red"}} className="ri-alarm-warning-fill"></i> Accidents Data
                    </span>
                    </Link>
                </div>
            </div>

            <MapAnalytics />
            <br />
            <br />
            <ServiceCards/>
        </div>
    );
}