import React from 'react'
import './Home.css'
import { delay, easeOut, motion, useAnimation} from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef,useEffect } from 'react'

const Home = () => {
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const boxInView = useInView(ref1,{once:true})
  const box2InView = useInView(ref2,{once:true})
  const controls = useAnimation();
  const Variants1 = {
    visible: { opacity: 1,y:0 },
    hidden: { opacity: 0, y:-250 }
  };
  const variants2 = {
    visible:{opacity:1,x:0,transition:{ duration: 0.6,delay:0.2,easeOut:0.5}},
    hidden:{opacity:0,x:250}
  }
  useEffect(() => {
    if (boxInView) {
      controls.start("visible");
    }
  }, [controls, boxInView]);

  useEffect(()=>{
    if(box2InView){
      controls.start("visible")
    }
  },[controls,box2InView])
  return (
    <div className='home'>
      <div className='secondary-container'>
        <motion.section className='box1' ref={ref1} initial='hidden' variants={Variants1} animate={controls} transition={{ duration:0.6,delay:0.1,ease:easeOut}}><motion.p transition={{duration:0.6,delay:0.5,ease:easeOut}} initial='hidden' variants={Variants1} animate={controls} style={{fontSize:'32px'}} >Welcome To Taskify</motion.p>
        <div className='hostContainer'><motion.div initial='hidden' variants={Variants1} animate={controls} transition={{duration:0.6,delay:1,ease:easeOut}} className="host">Sponsors</motion.div><motion.div initial='hidden' variants={Variants1} animate={controls} transition={{duration:0.6,delay:1.5,ease:easeOut}}  className="host">Docs</motion.div></div></motion.section>
        <motion.section className='box2' ref={ref2} initial='hidden' variants={variants2} animate={controls} >Lorem ipsum dolor sit amet consectetur.</motion.section>
      </div>
      
    </div>
  )
}

export default Home
