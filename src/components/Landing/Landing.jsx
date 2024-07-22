import React from "react";
import WithSubnavigation from "./NavBar";
import HeroSection from "./Hero";
import Historia from "./Historia";
import Testim from "./Testimonios1";
import LargeWithAppLinksAndSocial from "../Foot";
import { BiBorderRadius } from "react-icons/bi";
import SignInBtn from "../Autenticacion/signInBtn";
import LogInBtn from "../Autenticacion/LogInBtn";






const Landing =()=>{
    return(
        <div >
        <WithSubnavigation/>
<div className="cont-landing">
        <HeroSection style={{BiBorderRadius:"12px"}}/>
        <Historia/>
        <Testim/>
        <div style={{display:"flex", width:"100%", justifyContent:"center", alignItems:"center", padding:"1rem", gap:"2rem"}}>
        <SignInBtn/>
        <LogInBtn/>
        </div>
</div>

        <LargeWithAppLinksAndSocial/>
    
        </div>
  
    )
}

export default Landing;

