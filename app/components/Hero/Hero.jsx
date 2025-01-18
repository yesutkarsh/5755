import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"

import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";



import styles from './styles.module.css'
export default async function Hero() {

    const {getUser} = getKindeServerSession();
    const user = await getUser();
    console.log(user);
  return (
    <>
    <div className={styles.hero}>
        {user && 
        <div className={styles.heroContent}>
            <span>Hi, {user.given_name}</span>
            <p>One app, all your traffic solutions—streamline, 
            navigate, and arrive smarter!</p>
        </div>
        }

        {!user &&

        <div className={styles.account}>
            <button> 
            <i className="ri-google-fill"></i>
            <i className="ri-apple-fill"></i>
            <i className="ri-microsoft-fill"></i>
                 
            <LoginLink postLoginRedirectURL="/">Sign in</LoginLink>

            <RegisterLink postLoginRedirectURL="/">Sign up</RegisterLink>

                 
                 </button>
                 <p>Sign Up or Sign In with your Google or Apple Account</p>

        </div>
        }
        <div className={styles.services}>
        <div className={styles.crasoul}>
            <span><i style={{color:"#f0de3f"}} className="ri-taxi-fill"></i> Get Taxi</span>
            <span><i className="ri-timer-2-fill"></i> Watch List</span>
            <span><i className="ri-timer-2-fill"></i> Explore </span>
        </div>
        <div className={styles.crasoul}>
            <span className={styles.brandSponser} >
            <img src="https://res.cloudinary.com/dpcvcblbt/image/upload/v1737160183/5755/kyj6wtodyz313cjsoomq.png" alt="" />
            <img src="https://res.cloudinary.com/dpcvcblbt/image/upload/v1737160234/5755/t0vihgw7d0dfa99shyvl.png" alt="" />
            </span>
            <span><i className="ri-restaurant-line"></i> Order Food</span>
            <span><i className="ri-slideshow-3-fill"></i> Meeting </span>

        </div>
        </div> 
    </div>
    </>
  )
}
