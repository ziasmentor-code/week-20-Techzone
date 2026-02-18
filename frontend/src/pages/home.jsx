import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { 
  Smartphone,  Laptop, 
   Watch, Headphones,Star
} from "lucide-react";

const heroSlides = [
  {
    id: 1,
    image: "/images/heroImg.jpg", 
    titleSmall: "vivo",
    titleBig: "X300 5G",
    spec: "12GB | 512GB",
    price: "₹70,299*",
    oldPrice: "₹81,999",
  },
  {
    id: 2,
    image: "/images/heroImg2.jpg",
    titleSmall: "samsung",
    titleBig: "Galaxy S23",
    spec: "8GB | 256GB",
    price: "₹65,000*",
    oldPrice: "₹75,000",
  },
  {
    id: 3,
    image: "/images/heroImg3.jpg",
    titleBig: "One plus 13",
    spec: "6GB | 128GB",
    price: "₹79,999*",
    oldPrice: "₹89,999",
  },
    {
    id: 4,
    image: "/images/headst.png",
    titleBig: "Headset",
    price: "₹8,000*",
    oldPrice: "₹10,000",
  },
   
    {
    id: 5,
    image: "/images/watch.jpg",
    titleBig: "Watch",
    price: "₹12,000*",
    oldPrice: "₹18,000",
  },
];

const categories = [
  { id: 1, name: "Mobiles", icon: <Smartphone size={35}/>},
  
  { id: 2, name: "Laptops", icon: <Laptop size={35}/>},


  { id: 3, name: "Watch", icon: <Watch size={35}/>},
  { id: 4, name: "Headphones", icon: <Headphones size={35}/>}
];

const TheLatest=[

  
    {
    id: 1,
    title: "Accessibility",
    desc: "Truly Wireless Earbuds allow you to answer calls and control your music directly from the Earphones without needing to use your phone. Some models offer mono mode, allowing for the use of a single earbud at a time. Newer models are equipped with Voice Assistants as well as multi-device pairing.",
    image: "/images/img7.png",
  },
     {
    id: 2,
    title: "Wireless Technology",
    desc: "Whether it's Bluetooth or NFC, Truly Wireless Earbuds are extremely easy to pair and set up. After being paired the first time, Bluetooth Earphones pair automatically each time they're turned on and in range. Bluetooth 5.0 also ensures excellent audio quality and response time.",
    image: "/images/img9.png",
  },
      {
     id: 3,
    title: "Convenience",
    desc:"Tired of cables getting in the way when you’re working out, cooking, or just walking around? Truly Wireless Earphones eliminate this hassle altogether, with no wires to worry about. Use a charging case to power up your Earphones on the go.",
    image: "/images/image11.png", 
    
  },
  

]

const hotDeals = [
  {
    id: 1,
    title: "Pixel 9a 5G",
    image: "/images/heroImg4.jpg", 
    price: "₹32,924*",
    oldPrice: "₹49,999",
    tag: "Inclusive of all Offers"
  },
  {
    id: 2,
    title: "55\" & Above Google TVs",
    image: "/images/heroImg5.jpg",
    price: "Starting at ₹26,099*",
    tag: "Bank Offers Available"
  },
  {
    id: 3,
    title: "Ideapad Laptops",
    image: "/images/lap.png",
    price: "Starting at ₹10,990*",
    tag: "Inclusive of all Offers"
  },
  {
    id: 4,
    title: "Smart Watch",
    image: "/images/watchwatch.jpg",
    price: "Starting at ₹7,990*",
    tag: "Easy EMI Available"
  }
];

const techzoneExclusives = [
  {
    id: 1,
    title: "Techzone 127cm (50 inch) 4K Ultra HD LED Smart Google TV",
    image:  "/images/vdio1.gif",
    price: "₹24,990.00",
    oldPrice: "₹48,000.00",
    rating: 4,
  },
  {
    id: 2,
    title: "Techzone 80 cm (32 inch) HD LED Google TV with Dolby",
    image: "/images/vdio1.gif",
    price: "₹9,990.00",
    oldPrice: "₹18,000.00",
    rating: 5,
  },
  {
    id: 3,
    title: "Techzone 80 cm (32 inch) QLED Smart Google TV 5.0",
    image: "/images/vdio2.mp4",
    price: "₹10,990.00",
    oldPrice: "₹18,000.00",
    rating: 4,
    isVideo: true
  },
  {
    id: 4,
    title: "Techzone 109 cm (43 inch) LED 4K Ultra HD Smart Google TV",
    image: "/images/video5.mp4",
    price: "₹19,490.00",
    oldPrice: "₹25,000.00",
    rating: 4,
    isVideo: true
  }
];
const featuredvideo={
    title:"Every watch has a soul and a story to be told.",
    subtitle:"TIMEX Continental Black Round Dial Analog Men's Watch",
    videoUrl:"/images/watch1.mp4"

}
const popularCategories=[
    {id:1, name:"Best Sellers", image:"/images/balman.webp"},
    {id:2, name:"Automatic",image:"/images/watches10.webp"},
    {id:3, name:"Digital",image:"images/watch14.webp"},
    {id:4, name:"Chronograph", image:"images/watches10.webp"}
]


function Home() {
  const [current, setCurrent] = useState(0);
  const [activeCat,setActiveCat]=useState(popularCategories[0]);
  const navigate=useNavigate();

  const goToProduct=()=>{
    navigate("/product");
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="w-full bg-black min-h-screen pb-20 text-white font-sans selection:bg-[#00e676] selection:text-black">
      
      <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden group flex justify-center pt-5">
        <div className="w-[95%] md:w-[94%] h-full relative overflow-hidden rounded-[2rem] shadow-2xl border border-white/5">
          <img
            src={heroSlides[current].image}
            alt={heroSlides[current].titleBig}
            className="w-full h-full object-cover transition-all duration-1000 transform scale-100 group-hover:scale-105"
            onError={(e) => { e.target.src = "https://placehold.co/1200x500/1a1a1a/white?text=Techzone+Deals"; }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-20">
            <h2 className="text-xl md:text-3xl font-light mb-1 italic text-[#00e676] tracking-wider uppercase">
              {heroSlides[current].titleSmall}
            </h2>
            <h1 className="text-4xl md:text-8xl font-black mb-4 tracking-tighter uppercase leading-none">
              {heroSlides[current].titleBig}
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl md:text-5xl font-bold text-white drop-shadow-md">
                {heroSlides[current].price}
              </span>
              <span className="text-xl line-through text-gray-500 decoration-red-500/50">
                {heroSlides[current].oldPrice}
              </span>
            </div>
            <button onClick={goToProduct} className="w-fit bg-[#00e676] hover:bg-white text-black font-black py-4 px-14 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,230,118,0.4)]">
              SHOP NOW
            </button>
          </div>
        </div>

        <button onClick={prevSlide} className="absolute left-12 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#00e676] p-4 rounded-full backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100 z-20"> &larr; </button>
        <button onClick={nextSlide} className="absolute right-12 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#00e676] p-4 rounded-full backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100 z-20"> &rarr; </button>
      </div>


      <div className="w-full px-6 py-16">
        <div className="flex flex-row items-center justify-start md:justify-center gap-8 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center group cursor-pointer min-w-[100px]">
              <div className="w-20 h-20 bg-[#111] rounded-[2rem] flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-[#00e676] group-hover:rotate-[10deg] border border-white/5 group-hover:border-transparent shadow-xl">
                <span className="text-white group-hover:text-black transition-colors">{cat.icon}</span>
              </div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

     
      <div className="w-full px-6 md:px-14 mb-20">
        <div className="flex items-center gap-4 mb-10">
           <div className="h-10 w-2 bg-[#00e676] rounded-full shadow-[0_0_15px_#00e676]"></div>
           <h2 className="text-white text-4xl font-black tracking-tight uppercase">What's Hot</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotDeals.map((item) => (
            <div key={item.id} className="group relative bg-[#0a0a0a] rounded-[2.5rem] p-8 flex flex-col items-center border border-white/5 hover:border-[#00e676]/30 transition-all duration-500 cursor-pointer overflow-hidden">
              <div className="text-center z-10">
                <h3 className="text-white text-xl font-bold leading-snug group-hover:text-[#00e676] transition-colors line-clamp-2 min-h-[3rem]">
                  {item.title}
                </h3>
              </div>
              <div className="relative w-full h-48 flex items-center justify-center my-6 transform group-hover:scale-110 transition-transform duration-700 z-10">
                <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" 
                   onError={(e) => { e.target.src = "https://placehold.co/300x300/1a1a1a/00e676?text=Techzone"; }} />
              </div>
              <div className="text-center w-full z-10">
                <span className="text-gray-500 line-through text-sm block mb-1">{item.oldPrice}</span>
                <span className="text-[#00e676] text-3xl font-black">{item.price}</span>
                <div className="mt-5 py-2 px-5 bg-white/5 rounded-full border border-white/5 group-hover:bg-[#00e676]/10 transition-all">
                   <p className="text-[10px] text-gray-400 group-hover:text-white font-black uppercase tracking-widest">{item.tag}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="w-full px-6 md:px-14">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <div className="h-10 w-2 bg-[#00e676] rounded-full shadow-[0_0_15px_#00e676]"></div>
             <h2 className="text-white text-4xl font-black tracking-tight uppercase">Techzone Exclusives</h2>
          </div>
          <button onClick={goToProduct} className="text-[#00e676] font-bold border-b-2 border-[#00e676]/30 hover:border-[#00e676] transition-all">VIEW ALL</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {techzoneExclusives.map((prod) => (
            <div key={prod.id} className="group bg-[#111] rounded-[2rem] overflow-hidden border border-white/5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all flex flex-col">
              <div className="relative h-64 overflow-hidden bg-black">
                {prod.isVideo ? (
                   <video src={prod.image} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                )}
                <div className="absolute top-4 left-4 bg-[#00e676] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">Exclusive</div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < prod.rating ? "#00e676" : "none"} color={i < prod.rating ? "#00e676" : "#333"} />
                  ))}
                </div>
                <h3 className="text-white font-bold text-lg leading-tight mb-4 group-hover:text-[#00e676] transition-colors line-clamp-2">
                  {prod.title}
                </h3>
                <div className="mt-auto">
                  <span className="text-gray-500 line-through text-xs">{prod.oldPrice}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-2xl font-black text-white">{prod.price}</span>
                    <button onClick={goToProduct} className="bg-white/10 hover:bg-[#00e676] p-3 rounded-xl transition-all group/btn">
                      <Smartphone size={18} className="group-hover/btn:text-black" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-6 md:px-14 py-8">
  <div className="relative w-full min-h-[500px] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row items-center hero-gradient border border-white/5">
    
    {/* Left Side: Image */}
    <div className="flex-1 p-10 flex justify-center items-center">
      <div className="relative group">
        <img 
          src="/images/simg.png" // നിങ്ങളുടെ ഇമേജ് പാത്ത് ഇവിടെ നൽകുക
          alt="Redme Features" 
          className="w-full h-[600px] max-w-[850px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700"
        />
        {/* Unboxed Badge */}
        <div className="absolute top-0 left-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <span className="text-white font-black text-xl">UNBOXED</span>
          <p className="text-[10px] text-gray-400">BY TECHZONE</p>
        </div>
      </div>
    </div>

    {/* Right Side: Content */}
    <div className="flex-1 p-10 md:pr-24 text-left">
      <h2 className="text-white text-5xl md:text-7xl font-black leading-tight mb-6">
        Google Pixel 9a, 256 GB, 8 GB RAM, Obsidian, Mobile Phone <br /> 
        <span className="text-gray-400">features that make it a worthy upgrade</span>
      </h2>
      <p className="text-xl text-gray-400 mb-10 font-medium">Drool-worthy features</p>
      
      <button 
        onClick={() => navigate("/product")}
        className="bg-[#00e676] hover:bg-white text-black font-black py-4 px-10 rounded-xl transition-all flex items-center gap-3 group"
      >
        Read Now
        <span className="group-hover:translate-x-2 transition-transform">→</span>
      </button>
    </div>

  </div>
</div>

<div className="w-full px-6 md:px-14 py-20 bg-black">
  <div className="flex items-center gap-4 mb-16">
    <div className="h-10 w-2 bg-[#00e676] rounded-full shadow-[0_0_15px_#00e676]"></div>
    <h2 className="text-white text-4xl font-black tracking-tight uppercase">The Latest</h2>
  </div>

  <div className="space-y-24">
    {TheLatest.map((item, index) => (
      <div 
        key={item.id} 
        className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}
      >

        <div className="flex-1 space-y-6">
          <h3 className="text-[#00e676] text-3xl md:text-5xl font-black uppercase tracking-tighter">
            {item.title}
          </h3>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl">
            {item.desc}
          </p>
          <button onClick={goToProduct} className="border-b-2 border-[#00e676] text-[#00e676] pb-1 font-bold hover:text-white hover:border-white transition-all">
            LEARN MORE
          </button>
        </div>

      
        <div className="flex-1 w-full">
          <div className="relative group">
   
            <div className="absolute -inset-4 bg-[#00e676]/10 rounded-[3rem] blur-2xl group-hover:bg-[#00e676]/20 transition-all duration-700"></div>
            
            <img 
              src={item.image} 
              alt={item.title} 
              className="relative rounded-[2rem] w-full h-[300px] md:h-[450px] object-cover border border-white/10 shadow-2xl"
              onError={(e) => { e.target.src = "https://placehold.co/600x400/111/white?text=Techzone+Innovation"; }}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

<div className="w-full py-12"> 
  <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden group">
    
    <video
      src={featuredvideo.videoUrl} 
      autoPlay     
      loop
      muted        
      playsInline  
      className="absolute inset-0 w-full h-full object-cover" 
    
    />
    
 
    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8 md:px-24">
      
      <div className="max-w-4xl text-left">
        <h4 className="text-[#00e676] font-bold tracking-[0.3em] uppercase mb-4 animate-pulse">
          Featured Tech
        </h4>
        <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]">
          {featuredvideo.title}
        </h2>
        <p className="text-gray-200 text-lg md:text-2xl font-medium mb-10 max-w-2xl opacity-90">
          {featuredvideo.subtitle}
        </p>
        <button onClick={goToProduct} className="bg-[#00e676] text-black font-black py-4 px-12 rounded-full hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl">
          DISCOVER MORE
        </button>
      </div>
    </div>
  </div>
</div>
<div className="bg-white min-h-screen">


  <div className="w-full px-6 md:px-24 py-24 bg-white text-black flex flex-col md:flex-row items-center justify-between gap-16">
    

    <div className="flex-1 flex flex-col gap-6">
      <p className="text-gray-400 font-bold uppercase tracking-[0.3em] mb-4 text-sm">
        Popular Categories
      </p>
      
      {popularCategories.map((cat) => (
        <div 
          key={cat.id}
          onClick={() => setActiveCat(cat)} 
          onMouseEnter={() => setActiveCat(cat)}
          className="group flex items-center gap-6 cursor-pointer"
        >
          <h2 className={`text-4xl md:text-7xl font-black transition-all duration-500 uppercase tracking-tighter ${
            activeCat.id === cat.id 
              ? 'text-black translate-x-6' 
              : 'text-gray-200 hover:text-gray-400'
          }`}>
            {cat.name}
          </h2>
          
          {activeCat.id === cat.id && (
            <span className="text-4xl text-[#00e676] animate-bounce-right">→</span>
          )}
        </div>
      ))}
    </div>

<div className="flex-1 w-full flex justify-center">
 
  <div className="relative w-full max-w-[500px] aspect-[4/5] overflow-hidden rounded-xl bg-gray-100">


    <img
      src={activeCat?.image || "https://via.placeholder.com/400x500"} 
      alt={activeCat?.name || "Cat image"}
      className="absolute inset-0 w-full h-full object-cover"
    />


    <div className="absolute inset-0 border-[12px] border-gray-100 pointer-events-none"></div>

  </div>
</div>



  </div>
</div>

      <div className="grid grid-cols-1 md:grid-cols-3 h-auto md:h-64 text-white">
        <div className="bg-[#e03e3e] flex items-center justify-around p-8 cursor-pointer group">
          <h2 className="text-4xl font-black italic tracking-tighter">macOS</h2>
          <img 
            src="https://m.media-amazon.com/images/I/71TPda7cwUL._SL1500_.jpg" 
            alt="Macbook" 
            className="w-40 -rotate-12 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <div className="bg-[#1f9e54] flex items-center justify-around p-8 border-l border-white/10 cursor-pointer group">
          <h2 className="text-4xl font-black italic tracking-tighter">Windows</h2>
          <img 
            src="https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Computers%20Peripherals/Laptop/Images/317372_0_LpblAnmMx.png?updatedAt=1766431149778?tr=w-400" 
            alt="Windows Laptop" 
            className="w-48 group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <div className="bg-[#2e8b91] flex items-center justify-around p-8 border-l border-white/10 cursor-pointer group">
          <h2 className="text-4xl font-black italic tracking-tighter text-center">ChromeOS</h2>
          <img 
            src="https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Computers%20Peripherals/Laptop/Images/320095_0_3MqG-OMje.png?updatedAt=1766404418458?tr=w-400https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Computers%20Peripherals/Laptop/Images/315874_0_vyYytdChQ.png?updatedAt=1770706496631?tr=w-400https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Computers%20Peripherals/Laptop/Images/320095_0_3MqG-OMje.png?updatedAt=1766404418458?tr=w-400" 
            alt="Chromebook" 
            className="w-44 group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>

     
      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex items-center gap-4 mb-10">
           <div className="h-10 w-2 bg-[#00e676] rounded-full shadow-[0_0_15px_#00e676]"></div>
           <h2 className="text-white text-4xl font-black tracking-tight uppercase">Your Laptop, Your Use</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer relative h-72 border border-white/5">
             <img 
               src="https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Computers%20Peripherals/Laptop/Images/315367_0_L8SqpdqXa.png?updatedAt=1758638361381?tr=w-640" 
               className="object-cover w-full h-full group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
             <div className="absolute bottom-6 left-6">
                <div className="text-[#00e676] text-xs font-black uppercase tracking-widest mb-1">High Performance</div>
                <div className="text-white text-2xl font-black uppercase">Gaming</div>
             </div>
          </div>

     
          <div className="rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer relative h-72 border border-white/5">
             <img 
               src="https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Computers%20Peripherals/Laptop/Images/314123_0_xa42dw.png?tr=w-400" 
               className="object-cover w-full h-full group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
             <div className="absolute bottom-6 left-6">
                <div className="text-[#00e676] text-xs font-black uppercase tracking-widest mb-1">New Gen</div>
                <div className="text-white text-2xl font-black uppercase">AI & Tech</div>
             </div>
          </div>

          <div className="rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer relative h-72 border border-white/5">
             <img 
               src="https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Computers%20Peripherals/Laptop/Images/320129_1_0tarw43YAd.png?updatedAt=1766587608663?tr=w-400" 
               className="object-cover w-full h-full group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
             <div className="absolute bottom-6 left-6">
                <div className="text-[#00e676] text-xs font-black uppercase tracking-widest mb-1">Movies & Chill</div>
                <div className="text-white text-2xl font-black uppercase">Entertainment</div>
             </div>
          </div>

          
          <div className="rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer relative h-72 border border-white/5">
             <img 
               src="https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Computers%20Peripherals/Laptop/Images/315874_0_vyYytdChQ.png?updatedAt=1770706496631?tr=w-400" 
               className="object-cover w-full h-full group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
             <div className="absolute bottom-6 left-6">
                <div className="text-[#00e676] text-xs font-black uppercase tracking-widest mb-1">Home & Office</div>
                <div className="text-white text-2xl font-black uppercase">Everyday Use</div>
             </div>
          </div>
        </div>
      </div>
    
      <section className="w-full bg-[#111] mt-20">
        <div className="flex flex-col md:flex-row min-h-[500px]">
   
          <div className="flex-1 bg-black flex flex-col justify-center p-10 md:p-20">
            <span className="text-gray-400 text-sm font-medium mb-2">One For All</span>
            <h2 className="text-white text-4xl md:text-5xl font-semibold mb-10 tracking-tight">
              OnePlus Ensemble
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-sm leading-relaxed">
              Seamlessly connect all the Techzone products to one another for a smart and smooth experience.
            </p>
            <button onClick={goToProduct} className="text-white border-b border-white w-fit pb-1 text-sm hover:text-[#00e676] hover:border-[#00e676] transition-all">
              Learn More
            </button>
          </div>

         
          <div className="flex-[2] relative overflow-hidden">
            <img 
              src="/images/phone lap watch.jpg" 
              alt="OnePlus Ensemble" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>


      <section className="w-full bg-black">
        <div className="flex justify-between items-center px-6 md:px-14 py-6">
          <h2 className="text-white text-2xl font-medium tracking-wider">Red Cable Club</h2>
          <button onClick={goToProduct} className="text-gray-400 hover:text-[#00e676] text-sm flex items-center gap-1 transition-colors uppercase font-bold tracking-widest">
            Join the Club <span className="text-lg">›</span>
          </button>
        </div>

  
        <div className="relative w-full h-[80vh] md:h-screen overflow-hidden group">
          <video
            src="/images/mobile.mp4" 
            autoPlay
            loop
            muted
            playsInline
          
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
          />
          
          
          <div className="absolute inset-0 bg-black/40"></div>
          
          
          <div className="absolute inset-0 flex flex-col justify-center items-end p-10 md:p-24 z-10">
            <div className="max-w-4xl text-right">
                <h3 className="text-white text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
                  One community, <br />
                  <span className="text-[#00e676]">limitless</span> passion
                </h3>
                <p className="text-gray-300 text-lg md:text-xl font-medium opacity-80 max-w-md ml-auto">
                    Experience the synergy of technology and community like never before.
                </p>
            </div>
          </div>
        </div>
      </section>

    <footer className="w-full bg-[#0a0a0a] text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-14">
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
         
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter text-[#00e676]">TECHZONE</h2>
            <p className="text-gray-400 leading-relaxed">
              Premium tech destination for the latest gadgets. Experience the future of technology today.
            </p>
            <div className="flex gap-4">
              {['FB', 'IG', 'TW', 'YT'].map((social) => (
                <div key={social} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00e676] hover:text-black transition-all cursor-pointer font-bold text-xs">
                  {social}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-widest">Products</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-[#00e676] cursor-pointer transition-colors">Laptops & PC</li>
              <li className="hover:text-[#00e676] cursor-pointer transition-colors">Smart Watches</li>
              <li className="hover:text-[#00e676] cursor-pointer transition-colors">Headphones & Audio</li>
              <li className="hover:text-[#00e676] cursor-pointer transition-colors">Smart LED TVs</li>
              <li className="hover:text-[#00e676] cursor-pointer transition-colors">Mobile Phones</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-widest">Support</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-[#00e676] cursor-pointer transition-colors">Order Status</li>
              <li className="hover:text-[#00e676] cursor-pointer transition-colors">Service Centers</li>
              <li className="hover:text-[#00e676] cursor-pointer transition-colors">Warranty Policy</li>
              <li className="hover:text-[#00e676] cursor-pointer transition-colors">Contact Us</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-widest">Newsletter</h4>
            <p className="text-gray-400 mb-4 text-sm">Get the latest deals and tech news right in your inbox.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white/5 border border-white/10 py-3 px-4 rounded-xl focus:outline-none focus:border-[#00e676] transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00e676] text-black px-4 py-1.5 rounded-lg font-bold text-sm">
                GO
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© 2026 Techzone India. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Use</span>
          </div>
        </div>

      </div>
    </footer>
</div>

  );
}

export default Home;