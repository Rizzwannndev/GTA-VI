import React, { useState } from 'react'
import gsap from "gsap"
import { useGSAP } from '@gsap/react'
import 'remixicon/fonts/remixicon.css'

function App() {
  let [showContent, setShowContent] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.to(".vi-mask-group",{
      rotate: 10,
      duration: 2,
      ease: "Power4.easeInOut",
      transformOrigin: "50%, 50%"
    })
    .to(".vi-mask-group",{
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
      transformOrigin: "50%, 50%",
      opacity: 0,
      onUpdate: function(){
        if(this.progress() >= 0.9){
          document.querySelector(".svg").remove();
          setShowContent(true);
          this.kill();
        }
      }
    });
  });

  useGSAP(() => {
  if (!showContent) return;

  gsap.fromTo(
    ".main",
    { scale: 1.7, rotate: -10 },
    { scale: 1, rotate: 0, duration: 2, delay: -1, ease: "expo.inOut" },
  );
  
  gsap.fromTo(
  ".bg",
    { scale: 1.7, rotate: -3},
    {scale: 1.1, rotate: 0, duration: 2, delay: -0.8, ease: "expo.inOut"}
  );
  
  gsap.fromTo(
  ".characters",
    { scale: 1.9, rotate: -10, opacity: 0},
    {scale: 0.82, rotate: 0, opacity: 1, duration: 2, delay: -1, ease: "expo.inOut"}
  );
  
  gsap.fromTo(
  ".gta6",
    { scale: 1.6, rotate: -10},
    {scale: 1, rotate: 0, duration: 2, delay: -0.95, ease: "expo.inOut"}
  );
  
  gsap.fromTo(
  ".logo18",
    { opacity: 0.1},
    {opacity: 1, duration: 2, delay: -0.5, ease: "expo.inOut"}
  );
}, [showContent]);

  useGSAP(() => {
  gsap.set(".main .gta6", {
    xPercent: -50,   
    yPercent: -95,   
    x: -40,          
    y: 10,           
  });
  const main = document.querySelector(".main");
  main?.addEventListener("mousemove", function (e) {
    const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
    gsap.to(".main .gta6", {
      x: -40 + xMove * 0.2 * (window.innerWidth / 100),
    });
    gsap.to(".bg", {
      x: xMove * 1.7,
    });
  });
}, [showContent]);

  return (
    <>
      <div className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-[#000]">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="vi-Mask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="250"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="Arial Black"
                >
                  VI
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="./bg.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#vi-Mask)"
          />
        </svg>
      </div>

      {showContent && <div className="main w-full ">
        <div className="landing overflow-hidden relative w-full h-screen bg-black">
          <div className="navbar absolute top-0 left-0 z-[10] w-full py-10 px-10">
            <div className="logo flex gap-4">
              <div className="lines flex flex-col gap-[5px] z-[150]">
                <div className="line w-13 h-[4.5px] bg-white"></div>
                <div className="line w-8 h-[5px] bg-white"></div>
                <div className="line w-5 h-[4.5px] bg-white"></div>
              </div>
              <h3 className='text-4xl leading-none text-white -mt-[10px]' style={{WebkitTextStroke: "0.3px black"}}>Rockstar</h3>
            </div>
          </div>
          <div className="imageDiv relative w-full h-screen  overflow-hidden">
            <img src="./bg.png" className="bg absolute scale-[1.1] top-0 left-0 w-full h-full object-cover" />
            <img 
              src="./gta6.png" 
              className="gta6 absolute h-[430px]" 
              style={{
                top: '50%',
                left: '50%',
                marginTop: '-40px',
                marginLeft: '-calc(50% + 40px)',
                transform: 'translate(calc(-50% - 40px), calc(-95% + 10px))'
              }}
            />
            <img src="./characters.png" className="characters absolute -bottom-25  scale-[.82] w-full h-full object-cover" />
          </div>
          <div className="btm-bar absolute bottom-0 left-0 w-full py-15 px-10 bg-gradient-to-t from-black to-transparent">
            <div className='logo18 flex items-center gap-2 text-white absolute top-1/2 left-30 -translate-x-1/2 -translate-y-1/2 h-[65px]'>
              <i className ="ri-arrow-down-line text-3xl"></i>
              <h3 className ='font-[Poppins] text-xl'>Scroll Down</h3>
            </div>
            <img src="./ps5.png" className='logo18 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[70px]'/>
            <img src="./logo18.png" className='logo18 absolute  right-7 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70px]'/>
          </div>
        </div>
        <div className="w-full h-screen flex items-center justify-center bg-black overflow-hidden">
            <div className="container flex text-white w-full h-[80%] gap-7">
              <div className="limg relative w-1/2 h-full">
                <img
                  className="absolute scale-[1.1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  src="./imag.png"
                  alt=""
                />
              </div>
            <div className="right-sec text-white w-[43%]">
              <h1 className='text-7xl mt-[60px]'>Still Running,</h1>
              <h1 className='text-7xl'>Not Hunting</h1>
              <div className="steam flex flex-row items-center justify center">
                <h1 className='text-4xl mt-[30px] text-[#66c0f4]'>Powered By Steam</h1>
                 <img src="./steam2.png" className='h-[50px] mt-6 ml-6' />
              </div>
              <p className="mt-9 text-[15px] font-[Poppins]">
                  Grand Theft Auto VI takes players back to the neon-soaked streets of Vice City, delivering Rockstar’s most immersive open-world experience yet.
                </p>
                <p className="mt-2 text-[15px] font-[Poppins]">
                  Step into a gripping crime story filled with fast cars, underground deals, and unpredictable encounters.
                </p>
                <p className="mt-2 text-[15px] font-[Poppins]">
                  Dive into a pulse-pounding crime saga packed with daring heists, roaring engines, shadowy alliances, and twists that strike when you least expect them.
                </p>
                <div className="btns flex gap-5">
                <button className="btn bg-yellow-500 px-10 py-5 text-black mt-10 text-2xl">
                  Download Now
                </button>
                <button className="btn-steam bg-[#66c0f4] px-16 py-5 text-black mt-10 text-2xl">
                  Get on Steam
                </button>
                </div>
            </div>
          </div>
          <p className="license absolute bottom-6 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-[Poppins] text-[18px]">&copy; <span  className='font-[priceDown]'> 2026 License | Rockstar Games | Made By <a target='_blank' href="www.linkedin.com/in/rizwan-waseem">Rizwan Waseem</a></span></p>
        </div>
      </div>}
    </>
  )
}

export default App