import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Beaker, FlaskConical, Atom, Microscope, TestTube, Thermometer, Droplet, Target, Battery, Cpu, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import save from '../assets/save.png'
import visual from '../assets/3d-modeling.png'
import score from '../assets/digital-score.png'
import experiment from '../assets/experiment.png'
import image from '../assets/image.png'
import logo from '../assets/Reactron_Logo.png'
import { useEffect, useState } from 'react';

// Orbit Component (same as before)
const OrbitLayout = () => {
  const [containerSize, setContainerSize] = useState(550); // default desktop size
  const circles = [
    { radiusRatio: 0.4, count: 5, size: "w-16 h-16", color: "bg-white/10", offset: 0 },
    { radiusRatio: 0.3, count: 1, size: "w-14 h-14", color: "bg-white/10", offset: 45 },
    { radiusRatio: 0.2, count: 3, size: "w-12 h-12", color: "bg-white/10", offset: 30 },
    { radiusRatio: 0.1, count: 1, size: "w-10 h-10", color: "bg-white/10", offset: -30 },
  ];

  const icons = [
  <Beaker className="h-7 w-7 text-blue-400" />,        // Lab beaker
  <FlaskConical className="h-7 w-7 text-purple-400" />, // Conical flask
  <Atom className="h-7 w-7 text-green-400" />,          // Atom / molecules
  <Microscope className="h-7 w-7 text-yellow-400" />,   // Microscope
  <TestTube className="h-7 w-7 text-pink-400" />,       // Test tube
  <Thermometer className="h-7 w-7 text-indigo-400" />,  // Thermometer
  <Droplet className="h-7 w-7 text-teal-400" />,        // Liquid / reagent droplet
  <Target className="h-7 w-7 text-emerald-400" />,      // Target / experiment goal
  <Battery className="h-7 w-7 text-orange-400" />,      // Energy / reaction
  <Cpu className="h-7 w-7 text-red-400" />,             // Simulation / computing
];

  let iconIndex = 0;

  useEffect(() => {
    const handleResize = () => {
      // Keep container 90% of viewport width for mobile, max 550px for desktop
      const size = Math.min(window.innerWidth * 0.9, 550);
      setContainerSize(size);
    };

    handleResize(); // initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
  className="relative mx-auto"
  style={{
    width: containerSize < 300 ? containerSize * 0.8 : containerSize,
    height: containerSize < 300 ? containerSize * 0.8 : containerSize,
  }}
>
  {circles.map((circle, cIndex) => {
    const items = [];
    const responsiveRadius =
      typeof window !== "undefined" && window.innerWidth < 640
        ? circle.radiusRatio * containerSize * 0.7
        : circle.radiusRatio * containerSize;

    for (let i = 0; i < circle.count; i++) {
      const angle = ((i / circle.count) * 2 * Math.PI) + (circle.offset * Math.PI / 180);
      const x = Math.cos(angle) * responsiveRadius;
      const y = Math.sin(angle) * responsiveRadius;

      // Responsive size
      const sizeClass = typeof window !== "undefined" && window.innerWidth < 640 
        ? "w-6 h-6" // small on mobile
        : circle.size; // default size

      items.push(
        <div
          key={`${cIndex}-${i}`}
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            transform: `translate(-50%, -50%)`,
          }}
          className={`absolute ${sizeClass} ${circle.color} rounded-full flex items-center justify-center shadow-lg backdrop-blur-md`}
        >
          {icons[iconIndex++]}
        </div>
      );
    }

    return (
      <div
        key={cIndex}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: responsiveRadius * 2,
          height: responsiveRadius * 2,
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "50%",
        }}
      >
        {items}
      </div>
    );
  })}

  {/* Center */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
    <div className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white">20k+</div>
    <div className="text-gray-300 text-sm sm:text-lg md:text-xl">Specialists</div>
  </div>
</div>

  );
};

// Glass Card Component
const GlassCard = ({ title, description, icon }) => (
  <Card className="bg-white/30 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-full">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
);

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Gradient Top Section */}
      <div className="bg-gradient-to-br from-[#f9b84c] via-[#845ec2] to-[#2c73d2] text-white">
        
       {/* Header */}
        <header className="container mx-auto py-6 flex justify-between items-center px-4">
          {/* Logo on the left */}
          <img
            src={logo}
            alt="Logo"
            className="h-12 cursor-pointer"
            onClick={() => navigate('/')}
          />

  {/* Buttons / Mobile message on the right */}
  <div className="flex items-center">
    {/* Desktop buttons */}
    <div className="hidden md:flex space-x-4">
      {user ? (
        <div className="relative group">
          <button className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-800">
              <div className="relative z-10 flex items-center space-x-2">
                <span
                  className="transition-all duration-500 group-hover:translate-x-1"
                  onClick={() => navigate('/lab')}
                >
                  Enter Lab
                </span>
                <svg
                  className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
            </span>
          </button>
        </div>
      ) : (
        <div className="relative group">
          <button className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-600 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-800">
              <div className="relative z-10 flex items-center space-x-2">
                <span
                  className="transition-all duration-500 group-hover:translate-x-1"
                  onClick={() => navigate('/auth')}
                >
                  Let's Get Started
                </span>
                <svg
                  className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
            </span>
          </button>
        </div>
      )}
    </div>

          {/* Mobile message */}
          <div className="block md:hidden text-right text-gray-400 text-sm ml-2">
            Lab is not available on mobile. Please use PC or tablet.
          </div>
        </div>
      </header>


        {/* Hero Section */}
        <main className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-snug mb-6">
              Unlock Top Chemistry Learning Tools
              <br />
              You Thought Were Out of Reach —
              <br />
              <span className="text-yellow-300">Now Just One Click Away!</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-200 mb-8">
              Explore a fully interactive virtual chemistry lab with advanced tools, guided lessons, 
              and thousands of reactions to experiment safely and effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate(user ? '/lab' : '/auth')}
                className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:bg-gray-200 w-full sm:w-auto"
              >
                {user ? 'Enter Lab' : 'Start Learning'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
                className="bg-transparent border border-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl hover:bg-white hover:text-black w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="flex justify-center mt-8 md:mt-0">
            <OrbitLayout />
          </div>
        </main>

      </div>

     {/* About Us */}
<div className="container mx-auto px-6 py-16">
  <motion.div
    className="rounded-2xl p-10 shadow-xl bg-gray-50"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    {/* About Us Section */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

      {/* Left Side - Image */}
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <img
          src="https://www.euroschoolindia.com/blogs/wp-content/uploads/2024/01/why-is-chemistry-important-jpg.webp"
          alt="About us"
          className="rounded-2xl shadow-lg w-full object-cover"
        />

        {/* Badge */}
        <motion.div
          className="absolute bottom-4 left-4 bg-white px-3 py-1.5 rounded-full shadow flex items-center gap-2"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex -space-x-2">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" className="w-7 h-7 rounded-full border" alt="" />
            <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-7 h-7 rounded-full border" alt="" />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-7 h-7 rounded-full border" alt="" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">Join 350+ learners</span>
        </motion.div>
      </motion.div>

      {/* Right Side - Content */}
      <motion.div
        className="text-center md:text-left"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4">
          Where Chemistry Sparks Curiosity
        </h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base md:text-base">
          We are on a mission to make chemistry education accessible, interactive, and fun. 
          Our virtual science lab provides a safe environment where students can explore 
          complex chemical reactions, learn theoretical concepts, and practice experiments 
          without real-world risks.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition"
        >
          Read More →
        </motion.button>

        {/* Features */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <motion.div
            className="bg-white rounded-xl p-4 sm:p-6 shadow text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-indigo-600 text-3xl mb-2">🔒</div>
            <h3 className="font-semibold text-lg">Safe Learning</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Practice experiments without real-world hazards in a secure environment.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-4 sm:p-6 shadow text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-indigo-600 text-3xl mb-2">🌍</div>
            <h3 className="font-semibold text-lg">Accessible</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Designed for everyone, making science education easy and inclusive.
            </p>
          </motion.div>
        </div>
      </motion.div>

    </section>
  </motion.div>
</div>


{/* Futuristic Thematic Virtual Lab Features Section */}
<section className="relative py-20 px-6 md:px-12 bg-gradient-to-br from-indigo-900 via-gray-900 to-black overflow-hidden">
  <div className="max-w-7xl mx-auto relative">

    {/* Overall Glassy Background Panel */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl pointer-events-none -z-10"></div>

    {/* Section Header */}
    <div className="text-center mb-16 relative z-10">
      <span className="px-4 py-1 text-sm md:text-base font-medium bg-white/10 text-white rounded-full border border-white/20">
        BETA
      </span>

      <h2 className="text-3xl md:text-5xl font-bold mt-4 text-white leading-snug tracking-wide">
        Welcome to the <span className="text-purple-400">Futuristic Virtual Lab</span>
      </h2>

      <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto">
        Dive into an immersive, interactive 3D environment to explore chemistry experiments, track progress, and learn like never before.
      </p>
    </div>

    {/* Features Grid */}
    <div className="grid grid-cols-1 md:grid-cols-6 gap-10 md:gap-8 rounded-3xl p-8 md:p-16 
                    bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl shadow-black/50">

      {/* Main Wide Card: Virtual Experiments */}
      <div className="md:col-span-4 rounded-3xl p-8 bg-white/10 backdrop-blur-3xl border border-white/30 shadow-lg shadow-black/40
                      text-white flex flex-col justify-between hover:scale-105 hover:bg-white/20 hover:shadow-2xl transition-all duration-300">
        <h3 className="text-2xl font-semibold mb-3 tracking-wide">Virtual Experiments</h3>
        <p className="text-white/80 text-base md:text-lg">
          Conduct, simulate, and visualize chemical reactions safely in a fully interactive 3D virtual lab. Learn without limits or risks.
        </p>

        <button 
          onClick={() => navigate(user ? '/lab' : '/auth')} 
          className="mt-6 w-36 mx-auto bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white px-6 py-2 rounded-full font-medium hover:scale-105 hover:shadow-lg transition-all duration-300">
          Start Lab →
        </button>

        <img
          src={experiment}
          alt="Lab Flask"
          className="w-36 mx-auto mt-6 opacity-90 animate-pulse"
        />
      </div>

      {/* Secondary Card: High-Impact Visuals */}
      <div className="md:col-span-2 rounded-2xl p-6 md:p-8 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg shadow-black/40
                      text-white flex flex-col justify-between hover:scale-105 hover:bg-white/20 hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl md:text-2xl font-semibold mb-3 tracking-wide">High-Impact Visuals</h3>
        <p className="text-white/80 text-base">
          Experience 3D molecules, animations, and interactive lab environments optimized for engagement and attention.
        </p>

        <button 
          onClick={() => navigate(user ? '/lab' : '/auth')} 
          className="mt-6 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 mx-auto w-36 text-white px-4 py-2 rounded-full font-medium hover:scale-105 hover:shadow-lg transition-all duration-300">
          Try Now →
        </button>

        <img
          src={visual}
          alt="Atom"
          className="w-20 mx-auto mt-6 opacity-90 animate-bounce"
        />
      </div>

      {/* Task Saving */}
      <div className="md:col-span-2 rounded-2xl p-6 md:p-8 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg shadow-black/40
                      text-white flex flex-col items-center hover:scale-105 hover:bg-white/20 hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl md:text-2xl font-semibold mb-3">Task Saving</h3>
        <p className="text-white/80 text-center text-base">
          Save your lab progress securely across sessions for uninterrupted learning.
        </p>

        <img
          src={save}
          alt="Molecule"
          className="w-20 mt-6 opacity-90 animate-pulse"
        />
      </div>

      {/* Score Board */}
      <div className="md:col-span-2 rounded-2xl p-6 md:p-8 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg shadow-black/40
                      text-white flex flex-col items-center hover:scale-105 hover:bg-white/20 hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl md:text-2xl font-semibold mb-3">Score Board</h3>
        <p className="text-white/80 text-center text-base">
          Track points and performance in real time with our dynamic scoreboard system.
        </p>

        <div className="flex justify-center mt-6">
          <img
            src={score}
            alt="Scoreboard"
            className="w-16 h-16 opacity-90 animate-bounce"
          />
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="md:col-span-2 rounded-2xl p-6 md:p-8 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg shadow-black/40
                      text-white flex flex-col items-center hover:scale-105 hover:bg-white/20 hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl md:text-2xl font-semibold mb-3">Progress Tracking</h3>
        <p className="text-white/80 text-center text-base">
          Visualize your learning journey with real-time progress insights and detailed tracking.
        </p>

        <div className="flex items-end justify-center gap-2 mt-6 w-full h-24">
          {[14,24,16,20,10,24,10,20,14,12,24,8].map((h,i) => (
            <div key={i} className={`w-2 bg-white/60 rounded-full`} style={{ height: `${h}px` }}></div>
          ))}
        </div>
      </div>

    </div>
  </div>
</section>


      {/* What We Do Section */}
<section className="container mx-auto px-4 py-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg max-w-4xl">
  <h2 className="text-3xl font-bold mb-8 text-center">What We Do</h2>

  <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-3">
    <GlassCard
      title="Interactive Experiments"
      description="Engage in immersive, hands-on virtual labs that simulate real-world reactions with instant visual feedback and accuracy insights."
      icon={<FlaskConical className="h-6 w-6 text-yellow-400" />}
    />

    <GlassCard
      title="Detailed Lessons"
      description="Explore comprehensive tutorials crafted to simplify complex chemistry concepts through visuals, examples, and guided explanations."
      icon={<BookOpen className="h-6 w-6 text-yellow-400" />}
    />

    <GlassCard
      title="Performance Tracking"
      description="Stay motivated with real-time analytics that monitor your learning curve, highlight strengths, and suggest targeted improvements."
      icon={<Users className="h-6 w-6 text-yellow-400" />}
    />
  </div>
</section>


<div className="w-full px-6 sm:px-12 py-12">
  {/* Overall Card Background */}
  <motion.div
    className="rounded-3xl bg-gradient-to-b from-gray-50 to-gray-100 shadow-2xl p-8 sm:p-12 space-y-16"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    viewport={{ once: true }}
  >

    {/* Full-width Hero Section */}
    <motion.div
      className="text-center max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">
        Explore the Future of Learning with Our <span className="text-purple-500">Virtual Chemistry Lab</span>
      </h1>
      <p className="text-gray-700 text-base sm:text-lg">
        Discover a safer, interactive, and immersive approach to chemistry learning. Conduct experiments virtually, visualize molecules in 3D, and track data in real-time.
      </p>
    </motion.div>

    {/* Features + Image Two-column Section */}
    <section className="flex flex-col-reverse md:flex-row items-center gap-10 max-w-6xl mx-auto">
      
      {/* Left Features */}
      <motion.div
        className="w-full md:w-1/2 grid gap-4"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {[
          "⚗️ Simulate 50+ Chemistry Experiments Safely",
          "🧪 Interactive 3D Molecules and Reactions",
          "📊 Real-Time Lab Data Tracking",
          "🌐 Unlimited Access",
          "📄 Detailed Reports & Analytics"
        ].map((feature, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 shadow hover:shadow-lg flex items-start gap-3 border-l-4 border-purple-400 transition">
            <span className="text-xl">{feature.split(" ")[0]}</span>
            <p className="text-gray-700">{feature.slice(feature.indexOf(" ") + 1)}</p>
          </div>
        ))}
      </motion.div>

      {/* Right Image */}
      <motion.div
        className="w-full md:w-1/2 relative"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <img
          src={image}
          alt="Virtual Chemistry Lab"
          className="rounded-3xl shadow-2xl w-full object-cover"
        />
        <motion.div
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 sm:left-4 sm:translate-x-0 bg-white px-4 py-2 rounded-full shadow flex items-center gap-2"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex -space-x-2">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" className="w-8 h-8 rounded-full border" alt="" />
            <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-8 h-8 rounded-full border" alt="" />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-8 h-8 rounded-full border" alt="" />
          </div>
          <span className="text-sm font-medium text-gray-700">Trusted by 350+ learners</span>
        </motion.div>
      </motion.div>
    </section>

    {/* Full-width Bottom Section */}
    <motion.div
      className="max-w-4xl mx-auto text-center space-y-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold">
        Transforming Education with Virtual Labs
      </h2>
      <p className="text-gray-700 text-base sm:text-lg text-justify">
        Our Virtual Chemistry Lab leverages advanced simulation technology to provide realistic, hands-on learning experiences. Students can explore complex reactions, practice lab techniques, and understand concepts deeply—without physical constraints.
      </p>
      
    </motion.div>
  </motion.div>
</div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-12 text-center text-gray-500">
        © 2025 REACTRON. Empowering the next generation of chemists.
      </footer>
    </div>
  );
};

export default Index;
