import React from "react";
import WithSubnavigation from "./NavBar";
import HeroSection from "./Hero";
import Historia from "./Historia";
import Testim from "./Testimonios1";
import LargeWithAppLinksAndSocial from "../Foot";
import { BiBorderRadius } from "react-icons/bi";






const Landing =()=>{
    return(
        <div >
        <WithSubnavigation/>
<div className="cont-landing">
        <HeroSection style={{BiBorderRadius:"12px"}}/>
        <Historia/>
        <Testim/>
</div>

        <LargeWithAppLinksAndSocial/>
        </div>
  
    )
}

export default Landing;

