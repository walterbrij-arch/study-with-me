import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Beaker, 
  Zap, 
  Triangle, 
  Eye, 
  Sparkles, 
  Gauge, 
  RefreshCw, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  Calculator,
  Compass,
  Lightbulb,
  Scale,
  Activity,
  Wind,
  Layers,
  Flame,
  Play,
  RotateCcw,
  BookOpen
} from "lucide-react";

interface VirtualLabProps {
  isDarkMode: boolean;
  searchQuery?: string;
}

type LabId = 
  | "newton" 
  | "ohm" 
  | "buoyancy" 
  | "refraction" 
  | "pythagoras" 
  | "titration" 
  | "pendulum" 
  | "gas" 
  | "trigo" 
  | "equations"
  | "kirchhoff"
  | "faraday"
  | "probability"
  | "greenhouse"
  | "lens"
  | "decay"
  | "spring"
  | "electrolysis"
  | "fourier"
  | "projectile"
  | "freefall"
  | "stoichiometry"
  | "newton3"
  | "waves"
  | "atomic"
  | "geology_earth"
  | "geology_tectonics"
  | "biology_photosynthesis"
  | "biology_respiration"
  | "biology_differentiation";

interface LabMetadata {
  id: LabId;
  title: string;
  subtitle: string;
  category: "فيزياء" | "كيمياء" | "رياضيات" | "علوم طبيعية";
  curriculum: string; // e.g. "السنة الرابعة متوسط", "السنة الثالثة ثانوي"
  description: string;
  image: string;
  gallery: {
    url: string;
    caption: string;
  }[];
}

// Resilient Laboratory Image renderer with category-aware colored fallback gradients & icons
const LabImageWithFallback = ({
  src,
  alt,
  id,
  category,
  className = "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
}: {
  src?: string;
  alt?: string;
  id: string;
  category: string;
  className?: string;
}) => {
  const [hasError, setHasError] = useState(false);

  const getFallbackIcon = () => {
    switch (id) {
      case "newton": return <Gauge className="w-5 h-5 text-blue-400" />;
      case "ohm": return <Zap className="w-5 h-5 text-amber-400" />;
      case "buoyancy": return <Wind className="w-5 h-5 text-sky-400" fill="currentColor" fillOpacity={0.1} />;
      case "refraction": return <Eye className="w-5 h-5 text-indigo-400" />;
      case "pythagoras": return <Triangle className="w-5 h-5 text-emerald-400" fill="currentColor" fillOpacity={0.1} />;
      case "titration": return <Beaker className="w-5 h-5 text-rose-450" />;
      case "pendulum": return <Layers className="w-5 h-5 text-teal-400" />;
      case "gas": return <Flame className="w-5 h-5 text-orange-400" />;
      case "trigo": return <Compass className="w-5 h-5 text-cyan-405" />;
      case "equations": return <Layers className="w-5 h-5 text-purple-400" />;
      default: return <Beaker className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getFallbackGradient = () => {
    switch (category) {
      case "فيزياء": return "from-blue-600/30 via-indigo-650/15 to-purple-800/10 border-blue-500/20";
      case "كيمياء": return "from-rose-600/30 via-amber-655/15 to-orange-800/10 border-rose-500/20";
      case "رياضيات": return "from-emerald-600/30 via-cyan-655/15 to-teal-800/10 border-emerald-500/20";
      default: return "from-gray-600/30 to-slate-800/15 border-gray-500/20";
    }
  };

  if (hasError || !src) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${getFallbackGradient()} flex flex-col items-center justify-center p-1.5 select-none text-center border overflow-hidden`}>
        {getFallbackIcon()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      onError={() => setHasError(true)}
      className={className}
      referrerPolicy="no-referrer"
    />
  );
};

export default function VirtualLab({ isDarkMode, searchQuery = "" }: VirtualLabProps) {
  const [isLabLaunched, setIsLabLaunched] = useState<boolean>(false);
  const [activeLab, setActiveLab] = useState<LabId>("newton");
  const [stageMode, setStageMode] = useState<"simulation" | "gallery">("simulation");
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number>(0);
  const [launcherIndex, setLauncherIndex] = useState<number>(0);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);

  const playSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime); // high elegant ping
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // safe
    }
  };

  useEffect(() => {
    setSelectedGalleryIndex(0);
  }, [activeLab]);

  // --- EXPERIMENTAL LAB STATES ---

  // 1. Newton's Second Law State
  const [mass, setMass] = useState<number>(5); // kg
  const [force, setForce] = useState<number>(25); // N
  const [isNewtonRunning, setIsNewtonRunning] = useState<boolean>(false);
  const [newtonPosition, setNewtonPosition] = useState<number>(0);
  const newtonAnimRef = useRef<number | null>(null);

  // 2. Ohm's Law State
  const [voltage, setVoltage] = useState<number>(12); // V
  const [resistance, setResistance] = useState<number>(50); // Ohm

  // 3. Buoyancy/Density State
  const [objDensity, setObjDensity] = useState<number>(0.8); // g/cm³
  const [liqDensity, setLiqDensity] = useState<number>(1.0); // g/cm³ (water = 1.0)

  // 4. Snell's Law / Refraction State
  const [incidenceAngle, setIncidenceAngle] = useState<number>(45); // degrees
  const [n2Index, setN2Index] = useState<number>(1.5); // Refraction Index of Medium 2 (e.g. glass)

  // 5. Pythagoras Theorem State
  const [baseA, setBaseA] = useState<number>(6); // cm
  const [heightB, setHeightB] = useState<number>(8); // cm

  // 6. Acid-Base Titration State (المعايرة حمض أساس)
  const [acidVolume, setAcidVolume] = useState<number>(15); // ml in flask
  const [titrantVolume, setTitrantVolume] = useState<number>(0); // ml added from buret (0 to 30)
  const [titrantConcentration, setTitrantConcentration] = useState<number>(0.1); // M (NaOH)
  const [analyteConcentration, setAnalyteConcentration] = useState<number>(0.1); // M (HCl)

  // 7. Simple Pendulum State (النواس البسيط)
  const [pendulumLength, setPendulumLength] = useState<number>(2.5); // m
  const [pendulumMass, setPendulumMass] = useState<number>(1.0); // kg
  const [isPendulumRunning, setIsPendulumRunning] = useState<boolean>(true);
  const [pendulumAngle, setPendulumAngle] = useState<number>(30); // Max Amplitude degrees
  const [pendulumTime, setPendulumTime] = useState<number>(0);
  const pendulumAnimRef = useRef<number | null>(null);

  // 8. Ideal Gas Law State (الغازات المثالية)
  const [gasVolume, setGasVolume] = useState<number>(30); // L
  const [gasTemp, setGasTemp] = useState<number>(300); // Kelvin
  const [gasMoles, setGasMoles] = useState<number>(1.5); // moles

  // 9. Trigonometric Circle (الدائرة المثلثية)
  const [trigoAngle, setTrigoAngle] = useState<number>(45); // degrees 0-360

  // 10. Balancing Equations (موازنة المعادلات الكيميائية)
  const [coefCH4, setCoefCH4] = useState<number>(1);
  const [coefO2, setCoefO2] = useState<number>(1);
  const [coefCO2, setCoefCO2] = useState<number>(1);
  const [coefH2O, setCoefH2O] = useState<number>(1);
  const [equationFeedback, setEquationFeedback] = useState<{ isBalanced: boolean; message: string } | null>(null);

  // 11. Kirchhoff's Laws States
  const [voltageK, setVoltageK] = useState<number>(12); // V
  const [resistanceR1, setResistanceR1] = useState<number>(10); // Ohm
  const [resistanceR2, setResistanceR2] = useState<number>(20); // Ohm

  // 12. Faraday's Law / Induction States
  const [magnetPos, setMagnetPos] = useState<number>(30); // 10% to 90%
  const [coilLoops, setCoilLoops] = useState<number>(3); // 1 to 5 loops

  // 13. Probability / Counting Jar States
  const [redBalls, setRedBalls] = useState<number>(5);
  const [blueBalls, setBlueBalls] = useState<number>(3);
  const [greenBalls, setGreenBalls] = useState<number>(2);
  const [drawnBall, setDrawnBall] = useState<string | null>(null);

  // 14. Greenhouse Effect States
  const [co2Level, setCo2Level] = useState<number>(400); // ppm
  const [solarRadiation, setSolarRadiation] = useState<number>(1500); // W/m2

  // 15. Thin Optical Lens States
  const [lensFocal, setLensFocal] = useState<number>(10); // cm
  const [lensDistance, setLensDistance] = useState<number>(20); // cm

  // 16. Radioactive Decay / Half Life States
  const [halfLifePeriod, setHalfLifePeriod] = useState<number>(10); // seconds
  const [elapsedTimeDecay, setElapsedTimeDecay] = useState<number>(0); // seconds

  // 17. Spring Hooke Oscillator States
  const [springK, setSpringK] = useState<number>(40); // N/m
  const [springMass, setSpringMass] = useState<number>(200); // grams

  // 18. Water Electrolysis States
  const [electrolysisCurrent, setElectrolysisCurrent] = useState<number>(2); // Amperes
  const [electrolysisTime, setElectrolysisTime] = useState<number>(30); // minutes

  // 19. Fourier wave Synthesis States
  const [fourierTerms, setFourierTerms] = useState<number>(3); // 1 to 8 sine harmonics
  const [fourierType, setFourierType] = useState<string>("square"); // "square" | "triangle"

  // 20. Projectile Motion Mechanics States
  const [projSpeed, setProjSpeed] = useState<number>(25); // m/s
  const [projAngle, setProjAngle] = useState<number>(45); // degrees

  // 21. Free Fall States
  const [freefallMass, setFreefallMass] = useState<number>(5); // kg
  const [freefallHeight, setFreefallHeight] = useState<number>(50); // meters
  const [freefallAirResistance, setFreefallAirResistance] = useState<boolean>(false);
  const [isFreefallRunning, setIsFreefallRunning] = useState<boolean>(false);
  const [freefallTime, setFreefallTime] = useState<number>(0);

  // 22. Stoichiometry States
  const [stoichSubstance, setStoichSubstance] = useState<string>("H2O"); // "H2O", "CO2", "NaCl", "C6H12O6", "Fe"
  const [stoichGrams, setStoichGrams] = useState<number>(50); // grams

  // 23. Newton's 3rd Law States
  const [newtonMassA, setNewtonMassA] = useState<number>(5); // kg
  const [newtonMassB, setNewtonMassB] = useState<number>(5); // kg
  const [newtonForce, setNewtonForce] = useState<number>(40); // Newtons
  const [isNewtonAnimated, setIsNewtonAnimated] = useState<boolean>(false);

  // 24. Wave Superposition States
  const [waveAmp1, setWaveAmp1] = useState<number>(3);
  const [waveFreq1, setWaveFreq1] = useState<number>(1.5);
  const [waveAmp2, setWaveAmp2] = useState<number>(3);
  const [waveFreq2, setWaveFreq2] = useState<number>(1.5);
  const [wavePhaseDiff, setWavePhaseDiff] = useState<number>(0); // 0 = construct, 180 = destruct

  // 25. Atomic Structure States
  const [atomicProtons, setAtomicProtons] = useState<number>(3); // 1-6
  const [atomicNeutrons, setAtomicNeutrons] = useState<number>(4); // 1-8
  const [atomicElectrons, setAtomicElectrons] = useState<number>(3); // 1-6

  // 26. Earth's Internal Structure States (البنية الداخلية للكرة الأرضية)
  const [earthDepth, setEarthDepth] = useState<number>(100); // km

  // 27. Plate Tectonics States (حركة الصفائح التكتونية)
  const [plateMoveType, setPlateMoveType] = useState<"convergent" | "divergent">("convergent");
  const [plateSpeed, setPlateSpeed] = useState<number>(4); // cm/year

  // 28. Photosynthesis States (آلية التركيب الضوئي)
  const [photoLight, setPhotoLight] = useState<number>(60); // %
  const [photoCO2, setPhotoCO2] = useState<number>(400); // ppm
  const [photoTemp, setPhotoTemp] = useState<number>(25); // °C

  // 29. Cellular Respiration vs Fermentation States (التنفس الخلوي مقابل التخمر)
  const [respOxygenAvailable, setRespOxygenAvailable] = useState<boolean>(true);
  const [respGlucoseAmount, setRespGlucoseAmount] = useState<number>(50); // mg

  // 30. Cell Differentiation & Growth States (التمايز الخلوي ونمو الخلايا)
  const [growthTime, setGrowthTime] = useState<number>(3); // days
  const [differentiationType, setDifferentiationType] = useState<"stem" | "sieve" | "xylem" | "hair">("stem");

  // --- METADATA FOR THE 10 ALGERIAN CURRICULUM LABS ---
  const algerianLabs: LabMetadata[] = [
    {
      id: "newton",
      title: "قانون نيوتن الثاني",
      subtitle: "ميكانيك الحركة والتحريض العام بوجود قوة ثابتة المفعول",
      category: "فيزياء",
      curriculum: "الثانية والثالثة ثانوي (شعبة علوم تجريبية / رياضيات)",
      description: "يدرس العلاقة الطردية بين القوة المؤثرة وتسارع الجملة الميكانيكية، والعلاقة العكسية مع كتلة العربة.",
      image: "https://images.unsplash.com/photo-1549880181-56a44cf8a4a1?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1549880181-56a44cf8a4a1?q=80&w=600&auto=format&fit=crop",
          caption: "تطبيق قوى الاحتراق وتسارع الآلات في حقول هندسة الطيران والنقل المستدام."
        },
        {
          url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
          caption: "المخططات البيانية لحركة المقذوفات وتحليل المسار الميكانيكي للأجسام في الفضاء الخارجي."
        },
        {
          url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
          caption: "معدات قياس التسارع وعزم القصور الذاتي للكتل ضمن مختبرات ميكانيك النقطة المادية."
        }
      ]
    },
    {
      id: "ohm",
      title: "قانون أوم والتوصيل الكهربائي",
      subtitle: "المقاومة الكهربائية والتوتر وشق التيار المستمر",
      category: "فيزياء",
      curriculum: "السنة الثالثة متوسط والطور الثانوي عامة",
      description: "يبين كيف يدفع التوتر الكهربائي للبطارية الشحنات، وكيف تقوم المقاومة الضوئية أو الأومية للمصباح بقدح التيار.",
      image: "https://images.unsplash.com/photo-1631553127989-106429f9df3a?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1631553127989-106429f9df3a?q=80&w=600&auto=format&fit=crop",
          caption: "تركيب الدارات الإلكتروديناميكية الدقيقة وحساب المقاومات الضوئية والأومية لتقليل فاقد الطاقة."
        },
        {
          url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop",
          caption: "اختبار الفولتية ومراقبة انخفاض الجهد باستخدام أجهزة راسم الاهتزاز المهبطي وجهاز الأمبيرمتر."
        },
        {
          url: "https://images.unsplash.com/photo-1620283085439-d96200d9d5b4?q=80&w=600&auto=format&fit=crop",
          caption: "الإلكترونيات المتقدمة وقياس الكفاءة الحرارية المصاحبة لوحدات مقاومة نقل تيار الكهرباء."
        }
      ]
    },
    {
      id: "buoyancy",
      title: "دافعة أرخميدس في السوائل",
      subtitle: "دراسة حركة الأجسام العائمة والمغمورة وقوة الطفو",
      category: "فيزياء",
      curriculum: "السنة الرابعة متوسط (الظواهر الميكانيكية والاتصال السوائلي)",
      description: "يستعرض شروط طفو الأجسام الخشبية أو الفلينية وغرق المعادن بمقارنة الكثافة الحجمية للجسم مع كثافة السائل المضيف.",
      image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop",
          caption: "ديناميكا غوص الغواصات البحرية والتحكم في خزانات الصب لضبط توازن الارتفاع والطفو."
        },
        {
          url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=600&auto=format&fit=crop",
          caption: "قوارب النقل الكبيرة تطفو رغم وزنها الفولاذي الضخم بفضل حجم إزاحتها السائل الهائل."
        },
        {
          url: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=600&auto=format&fit=crop",
          caption: "ظاهرة التوازن المائي للأحياء المائية التي تعدل كثافتها الحجمية الذاتية للتكيف مع عمق الوسط المائي."
        }
      ]
    },
    {
      id: "refraction",
      title: "انكسار الضوء (المجاهر والعدسات)",
      subtitle: "قانون سنيل-ديكارت في السطح الفاصل والانتشار المستقيم",
      category: "فيزياء",
      curriculum: "السنة الأولى والثانية ثانوي (الظواهر الضوئية والمرايا العاكسة)",
      description: "يوضح زاوية انحراف الخط الضوئي لليزر عند الانتقال اللحظي بين الهواء والماء أو زجاج العدسات المحدبة.",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
          caption: "تشتت الضوء الأبيض من خلال موشور زجاجي وإظهار طيف قوس قزح بفضل اختلاف زاوية الانكسار لكل لون."
        },
        {
          url: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=600&auto=format&fit=crop",
          caption: "الأنظمة البصرية الدقيقة والعدسات متعددة الطبقات المستخدمة في تلسكوبات الرصد الفلكي والمسح الكوني."
        },
        {
          url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop",
          caption: "تطبيق ليزر القياس وانحرافه المباشر لدراسة معاملات نقاء المواد والمحاليل الكيميائية في مراقبة الجودة."
        }
      ]
    },
    {
      id: "pythagoras",
      title: "علاقة فيثاغورس الهندسية",
      subtitle: "برهان حساب المسافات في علم المثلثات القائمة",
      category: "رياضيات",
      curriculum: "الطور المتوسط (السنة الثالثة والرابعة متوسط)",
      description: "يُمكِّن الطالب من تغيير طول ضلعين وملاحظة مطابقة مجموع مربعي الضلعين مع مربع الوتر المتشكل ميكانيكياً.",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
          caption: "تطبيقات علم المثلثات في الملاحة البحرية ورسم الخرائط الجغرافية بدقة فائقة."
        },
        {
          url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
          caption: "أصول الهندسة الإقليدية ومخططات البناء التي تعتمد على زوايا القائمه الثابتة لحفظ تماسك الهياكل."
        },
        {
          url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=600&auto=format&fit=crop",
          caption: "الرفع والتصميم الهندسي ثلاثي الأبعاد المعتمد كلياً على خوارزميات فيثاغورس لحساب الأطراف والمسافات."
        }
      ]
    },
    {
      id: "titration",
      title: "المعايرة حمض-أساس كيميائياً",
      subtitle: "تحديد تركيز مجهول باعتماد الكواشف الملونة ونقطة التكافؤ",
      category: "كيمياء",
      curriculum: "السنة الثالثة ثانوي والسنة الثانية ثانوي (المادة وتحولاتها)",
      description: "قم بسكب قطرات هيدروكسيد الصوديوم على حمض الكلور لترى تغير اللون من الأصفر للأخضر، وقفزة الـ pH التكافؤية.",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
          caption: "مراقبة درجة التركيز الكيميائي وعلاقة الـ pH بالحموضة الكلية للمنتجات صيدلانية والغذائية."
        },
        {
          url: "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?q=80&w=600&auto=format&fit=crop",
          caption: "عملية التقطير والتحييد بالحمض والقاعدة وتحديد التكافؤ الكيميائي بدقة متناهية."
        },
        {
          url: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=600&auto=format&fit=crop",
          caption: "الأواني الزجاجية المختبرية والمحاليل الكاشفة الملونة مثل الفينول فتالين في البيئة العملية."
        }
      ]
    },
    {
      id: "pendulum",
      title: "النواس البسيط والحركة الاهتزازية",
      subtitle: "استنتاج الدور الذاتي للجمل وتأثير الجاذبية الأرضية",
      category: "فيزياء",
      curriculum: "الطور الثانوي (ميكانيك اهتزازي ومجالات الطاقة)",
      description: "غير طول الخيط والكتلة المعلقة لترى كيف يتغير زمن الذبذبة الواحدة (الدور) بصفة مستقلة تماماً عن كتلة الثقل.",
      image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600&auto=format&fit=crop",
          caption: "تبادل الطاقة الحركية والكامنة في حركة النواس وتفسير مبادئ انحفاظ الطاقة الميكانيكية."
        },
        {
          url: "https://images.unsplash.com/photo-1510074377623-8cf13fb86408?q=80&w=600&auto=format&fit=crop",
          caption: "مهود نيوتن والمؤثرات المتذبذبة الحركية المستخدمة لتطبيق قوانين الحركة وبقاء الزخم."
        },
        {
          url: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=600&auto=format&fit=crop",
          caption: "اشتقاق المعادلات النواسية والاهتزازات الجيبية المقررة لمستوى الطور الثانوي كعصب للفيزياء الميكانيكية."
        }
      ]
    },
    {
      id: "gas",
      title: "قانون الغازات المثالية (P V = n R T)",
      subtitle: "مراقبة درجة الحرارة والضغط والاصطدامات الجزيئية",
      category: "فيزياء",
      curriculum: "السنة الثانية ثانوي ع.ت (قياس الغاز والضغط الحجمي)",
      description: "اضغط على الغرفة لتقليص الحجم وزد درجة الحرارة لترى جزيئات الغاز تسرِّع حركتها مولّدةً قيمة ضغط هائلة ومقاسة.",
      image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=600&auto=format&fit=crop",
          caption: "مستشعرات الضغط البخاري وغلايات التبريد العملاقة التي تعتمد على الحجم المتغير مع درجات الغليان الساخن."
        },
        {
          url: "https://images.unsplash.com/photo-1542060748-10c28b629f6f?q=80&w=600&auto=format&fit=crop",
          caption: "تطبيقات قياس الضغط الجوي والمقاومة الهوائية في الأنظمة الميكانيكية البسيطة والمحركات الحرارية."
        },
        {
          url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
          caption: "الصمامات والمكابس التي تحول طاقة تمدد الغاز الساخن إلى شغل ميكانيكي حركي في الصناعة الحديثة."
        }
      ]
    },
    {
      id: "trigo",
      title: "الدائرة المثلثية للزوايا والنسب",
      subtitle: "تفصيل محاور الجيب وجيب التمام وظل الـ trigonometric arc",
      category: "رياضيات",
      curriculum: "الأولى والثانية ثانوي (المجال العددي والمثلثات)",
      description: "تحرك بالزاوية كيفما تشاء لترى الإسقاط البياني لحظة بلحظة على المحور الأفقي (السينوس) والمحور العمودي (الكسينوس).",
      image: "https://images.unsplash.com/photo-1453733190148-c44698c26588?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1453733190148-c44698c26588?q=80&w=600&auto=format&fit=crop",
          caption: "الكفاءة العالية لحساب الدور في الموجات الجيبية والكهربائية المتناوبة المأخوذة مباشرة من الدائرة المثلثية."
        },
        {
          url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop",
          caption: "موجات الصوت والاتصالات والتعديل الترددي (FM) الذي يبنى أساساً على دورات الاقتران الدائري."
        },
        {
          url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
          caption: "شرح الهندسة الفضائية المعقدة وعمود الإشعاع في الدراسات العليا وعلم النواقل المتعددة للفضاء المتعامد."
        }
      ]
    },
    {
      id: "equations",
      title: "موازنة المعادلات الكيميائية",
      subtitle: "قانون انحفاظ الكتلة والذرات نوعاً وعدداً (جدول التقدم)",
      category: "كيمياء",
      curriculum: "الطور المتوسط والثانوي (العالم المجهري والعياني والتحولات)",
      description: "زن كفتي التفاعل الكيميائي لغاز الميثان بضبط المعاملات الستوكيومترية ومطابقة الذرات على ميزان كفتين حقيقي.",
      image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=600&auto=format&fit=crop",
          caption: "التمثيل المجهري ثلاثي الأبعاد لجزيئات الغازات (C, H, O) المنخرطة في تفاعل احتراق المركبات الهيدروكربونية."
        },
        {
          url: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=600&auto=format&fit=crop",
          caption: "قوانين انحفاظ الذرات والمادة كما أسسها لافوازييه، لضمان قيام التفاعلات دون فقدان غريب للوزن الحجمي."
        },
        {
          url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=600&auto=format&fit=crop",
          caption: "الاستعمال الفعال للنماذج الذرية والجداول النسبية في مختبرات المدارس لتقريب علم الكيمياء العملي."
        }
      ]
    },
    {
      id: "kirchhoff",
      title: "قوانين كيرشوف للشبكات الكهربائية",
      subtitle: "تحليل شدة التيارات وقانون العروات في الحلقات المغلقة",
      category: "فيزياء",
      curriculum: "الثالثة ثانوي والجامعي (دراسة ثنائي القطب والدارة المتفرعة)",
      description: "تحقق من صحة قانون العروات وقانون العقد في دارة متفرعة بتغيير تغذية المولد ومقاومات الفروع وملاحظة التيارات المارة بكل فرع.",
      image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=600&auto=format&fit=crop",
          caption: "توزيع التيار على المكونات الإلكترونية في اللوحات المطبوعة لتفادي فرط الاحترار."
        }
      ]
    },
    {
      id: "faraday",
      title: "التحريض الكهرومغناطيسي لـ فاراداي",
      subtitle: "توليد القوة المحركة الكهربائية بتغير الدفق المغناطيسي",
      category: "فيزياء",
      curriculum: "الثالثة ثانوي (التحريض الكهرومغناطيسي والنواقل)",
      description: "حرك الحقل المغناطيسي بالقرب من وشيعة نحاسية وشاهد كيف يرتفع التوتر الكهربائي لحظياً لتوهج المصباح.",
      image: "https://images.unsplash.com/photo-1620283085439-d96200d9d5b4?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1620283085439-d96200d9d5b4?q=80&w=600&auto=format&fit=crop",
          caption: "مبدأ توليد الطاقة النظيفة في المولدات وتطبيق المغناطيسية الفعالة."
        }
      ]
    },
    {
      id: "probability",
      title: "حساب الاحتمالات وسحب الكريات",
      subtitle: "تعيين الأمل الرياضياتي والتواتر النسبي للتجربة العشوائية",
      category: "رياضيات",
      curriculum: "الثانية والثالثة ثانوي (الإحصاء والجبر)",
      description: "اضبط عدد الكريات المتجانسة حسب لونها واسحب كرة عشوائية من الصندوق لمقارنة الاحتمالات النظرية والنتائج الواقعية المتكررة.",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1549880181-56a44cf8a4a1?q=80&w=600&auto=format&fit=crop",
          caption: "حساب الاحتمالات الرياضية في السحب المتتابع مع الإعادة أو بدونها."
        }
      ]
    },
    {
      id: "greenhouse",
      title: "الاحتباس الحراري وغازات الدفيئة",
      subtitle: "أثر تخلخل الغلاف الجوي وارتفاع معدلات الحرارة السطحية",
      category: "كيمياء",
      curriculum: "الأولى والثانية ثانوي (علم البيئة الحيوية والأنظمة)",
      description: "ساعد الكوكب على قياس احتباس الطاقة الحرارية بزيادة نسبة غاز ثاني أكسيد الكربون ومراقبة حرارة المحيط واليابسة والذبذبات الناتجة.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop",
          caption: "تراكم انبعاثات الكربون وصناع القرار في الطاقات البديلة لتفادي تدهور المناخ."
        }
      ]
    },
    {
      id: "lens",
      title: "العدسات الرقاقة والبعد البؤري f'",
      subtitle: "الإنشاء الهندسي للصورة الحقيقية والوهمية بقانون ديكارت",
      category: "فيزياء",
      curriculum: "الأولى ثانوي (الظواهر الضوئية المتقدمة)",
      description: "حرك موضع الشمعة المضيئة أمام العدسة المجمعة لترى كيف تتلاقى الأشعة لتشكل صورة مقلوبة ومكبّرة على لوح القياس.",
      image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=600&auto=format&fit=crop",
          caption: "الانكسار الضوئي في الكاميرات المعاصرة وأجهزة التقريب العسكرية والمجاهر الإلكترونية."
        }
      ]
    },
    {
      id: "decay",
      title: "النشاط الإشعاعي وعمر النصف t½",
      subtitle: "تناقص الأنوية غير المستقرة والتحول النووي التلقائي",
      category: "فيزياء",
      curriculum: "الثالثة ثانوي (التحولات النووية)",
      description: "اضبط ثابت الإشعاع أو زمن عمر النصف وراقب تضاؤل الأنوية المشعة مع مرور الزمن البياني لحساب الأنوية المتبقية والنشاطية النووية A(t).",
      image: "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?q=80&w=600&auto=format&fit=crop",
          caption: "تأثير الإشعاعات الكونية والذرية في إنتاج طاقات نظيفة وتصوير طبي نووي دقيق."
        }
      ]
    },
    {
      id: "spring",
      title: "النابض المرن وقانون هوك F = -k·x",
      subtitle: "ثابت الصلابة، قوة التوتر، ودراسة الحركة الاهتزازية الجيبية",
      category: "فيزياء",
      curriculum: "الثانية والثالثة ثانوي (ميكانيك - النواس المرن وحفظ الطاقة)",
      description: "علق كتلة مناسبة بالنابض الحلزوني واضبط ثابت القوة k لملاحظة الاستطالة الساكنة وتحليل دور الحركة والاهتزاز وحفظ الطاقة الميكانيكية.",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
          caption: "مخمدات الصدمات في نواس السيارات ومنشآت امتصاص الزلازل السيزمية المعاصرة."
        }
      ]
    },
    {
      id: "electrolysis",
      title: "التحليل الكهربائي البسيط للماء H₂O",
      subtitle: "التفاعلات عند المهبط والمصعد وقانون فاراداي للكهرباء",
      category: "كيمياء",
      curriculum: "الرابعة متوسط والأولى ثانوي (التحولات الكيميائية للمحاليل)",
      description: "مرر تياراً مستمراً في وعاء فولطا به ماء محمض بحمض الكبريت وراقب معدل انطلاق غازي ثنائي الهيدروجين وغاز ثنائي الأكسجين كيميائياً بالمعادلات الكيميائية.",
      image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=600&auto=format&fit=crop",
          caption: "إنتاج وقود الهيدروجين الأخضر عالي النقاوة لحماية الكوكب من الانبعاثات."
        }
      ]
    },
    {
      id: "fourier",
      title: "تركيب الموجات وسلاسل فورييه Fourier",
      subtitle: "بناء الموجات المركبة عبر تراكب وتجميع الإشارات الجيبية الهارمونية",
      category: "رياضيات",
      curriculum: "الثالثة ثانوي والجامعي (الرياضيات التطبيقية والتحليل الموجي والسبراني)",
      description: "اختر نوع الموجة المستهدفة (مربعة أو مثلثية) وقم بزيادة عدد التوافقات الجيبية وشاهد كيف يتحد تجميع الموجات البسيطة لتمثيل إشارة دقيقة.",
      image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=600&auto=format&fit=crop",
          caption: "معالجة الإشارات الرقمية، الرادارات وهندسة الاتصالات الحديثة والاتصالات الفضائية."
        }
      ]
    },
    {
      id: "projectile",
      title: "حركة القذف والمقذوفات في الفضاء",
      subtitle: "مسار الحركة المنحنية واستقلال الحركات الأفقية والعمودية وتسارع الجاذبية",
      category: "فيزياء",
      curriculum: "الأولى والثالثة ثانوي (دراسة حركات القذائف والمدى والأوج)",
      description: "أطلق المقذوف بزاوية رمي خاصة وسرعة ابتدائية لتحلل الخط المنحني القطعي المكافئ لحساب المدى الأفقي والذروة والزمن الكلي للرحلة.",
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop",
          caption: "حساب مدارات الأقمار والمقذوفات الفضائية وإطلاق الصواريخ وحركة المقذوفات الرياضية."
        }
      ]
    },
    {
      id: "freefall",
      title: "تجربة السقوط الحر (Free Fall)",
      subtitle: "دراسة تأثير الجاذبية والارتفاع والكتلة على حركة الأجسام الساقطة",
      category: "فيزياء",
      curriculum: "الطور الثانوي (الميكانيك والحركة اللامتناهية في الفراغ)",
      description: "افهم العلاقة بين غياب الهواء، كتلة الجسم، وزمن السقوط. تحكم بالارتفاع والكتلة لترى إثبات تسارع السقوط الموحد (g ≈ 9.81 م/ث²).",
      image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop",
          caption: "تثبت هذه المحاكاة أنه في غياب مقاومة الهواء تسقط جميع الأجسام بتسارع ثابت مستقل عن الكتلة."
        }
      ]
    },
    {
      id: "stoichiometry",
      title: "حساب المادة المولية (Stoichiometry)",
      subtitle: "العلاقة التناسبية بين كمية المادة والمولات والكتلة بالجرام",
      category: "كيمياء",
      curriculum: "الطور المتوسط والثانوي (العلاقات والحسابات الكيميائية والمولات)",
      description: "اختر المادة الكيميائية وحدد كتلتها بالجرامات ليتم تلقائياً حساب عدد المولات (n = m/M) وتبسيط رهبة العمليات الحسابية للكيمياء.",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
          caption: "حساب كمية المادة يحول الجرامات إلى مولات بناء على الكتلة المولية الجزيئية لكل مركب."
        }
      ]
    },
    {
      id: "newton3",
      title: "مبدأ الفعل ورد الفعل (قوانين نيوتن)",
      subtitle: "ملاحظة التفاعل المتبادل المباشر وتناظر قوى التصادم للجسم المضاد",
      category: "فيزياء",
      curriculum: "الطور المتوسط والثانوي (مبادئ الميكانيك وقانون نيوتن الثالث)",
      description: "تحكم في كتلة وسرعة سيارتين ودعهما تصطدمان لترى بالتدريج كيف تتساوى قوى التأثير المتبادل دائماً في الفعل ورد الفعل مهما اختلفت كتل الأجسام المتصادمة.",
      image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop",
          caption: "مبدأ الفعل ورد الفعل: لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه."
        }
      ]
    },
    {
      id: "waves",
      title: "تراكب وتداخل الموجات (Waves Interferences)",
      subtitle: "التراكب الرياضي وملاحظة التداخل البناء والتداخل الهدام بصرياً",
      category: "فيزياء",
      curriculum: "الثالثة ثانوي ورابعة متوسط (الموجات الميكانيكية والضوئية)",
      description: "اضبط سعة الموجات وترددها لرسم مسارات التداخل وإثبات تكون قمم مضاعفة (التداخل البنّاء) أو زوال الحركة تماماً (التداخل الهدام) رياضياً وبيانياً.",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
          caption: "تداخل بناء عندما تكونان على توافق في الطور، وتداخل هدام عندما تكونان على تعاكس في الطور."
        }
      ]
    },
    {
      id: "atomic",
      title: "بنية الذرة والنظائر (Atomic Structure & Isotopes)",
      subtitle: "عائلة العناصر والخصائص الكيميائية وتوزيع الإلكترونات في المدارات",
      category: "كيمياء",
      curriculum: "الأولى ثانوي ورابعة متوسط (المادة وتحولاتها ووصف بنية الذرة)",
      description: "أضف البروتونات لتغيير هوية العنصر الكيميائي بالجدول الدوري، وزد النيوترونات لتكوين النظائر المختلفة للبروتونات، وتحكم بالمسارات المدارية للإلكترونات.",
      image: "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?q=80&w=600&auto=format&fit=crop",
          caption: "يتحدد اسم العنصر بعدد البروتونات الفريد له، في حين يساهم عدد النيوترونات في تحديد نظير هذا العنصر ثقلياً."
        }
      ]
    },
    {
      id: "geology_earth",
      title: "البنية الداخلية للكرة الأرضية (Earth's Internal Structure)",
      subtitle: "محاكاة طبقات الأرض وتغير درجة الحرارة والضغط والفيزياء الأرضية مع العمق",
      category: "علوم طبيعية",
      curriculum: "السنة الأولى ثانوي (منهج الجيولوجيا والعلوم الطبيعية)",
      description: "اكتشف تركيب باطن الأرض عبر اختراق طبقاتها الأربعة: القشرة، الرداء (الوشاح)، النواة الخارجية، والنواة الداخلية. راقب بالتفصيل تغير مؤشرات الضغط ودرجة الحرارة والحالة الفيزيائية للمادة تبعاً للعمق بالكيلومتر.",
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop",
          caption: "بنية الكرة الأرضية: تنخفض الكثافة تدريجياً كلما اتجهنا للخارج، بينما يشتد الضغط والحرارة إلى أقصاه بنواة الأرض المركزة."
        }
      ]
    },
    {
      id: "geology_tectonics",
      title: "حركة الصفائح التكتونية (Plate Tectonics)",
      subtitle: "محاكاة تصادم وتباعد الألواح الأرضية وتفسير نشأة البراكين والزلازل والسلاسل الجبلية",
      category: "علوم طبيعية",
      curriculum: "السنة الأولى ثانوي والثالثة متوسط (نشاط الكرة الأرضية)",
      description: "قارن التفاعلات الحركية عند الحدود التكتونية. استكشف الحدود التقاربية (حركات التصادم والغوص في الخنادق المحيطية والالتواءات الجبلية) والحدود التباعدية (توسع الظهرات وسط المحيطية وتدفق الحمم البازلتية).",
      image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=600&auto=format&fit=crop",
          caption: "تتشكل السلاسل الجبلية الملتوية والبراكين الانفجارية بفعل القوى التقاربية العنيفة وضغط ماغما الأستينوسفير الجوفية."
        }
      ]
    },
    {
      id: "biology_photosynthesis",
      title: "آلية التركيب الضوئي (Photosynthesis Mechanism)",
      subtitle: "محاكاة تحويل الطاقة الضوئية إلى طاقة كيميائية كامنة وعوامل زيادة وتيرة الإنتاج",
      category: "علوم طبيعية",
      curriculum: "السنة الأولى ثانوي (تحويل المادة وتدفق الطاقة في النظام البيئي)",
      description: "تحكم بشدة الإضاءة المسلطة، وتركيز غاز ثاني أكسيد الكربون CO₂ في الغرفة المخبرية، ودرجة الحرارة لمراقبة سرعة اصطناع الثغور الورقية للمادة العضوية (الجلوكوز) ونبض غاز الأكسجين النقي O₂.",
      image: "https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?q=80&w=600&auto=format&fit=crop",
          caption: "يقوم الكلوروفيل (الخضور) بامتصاص الإشعاعات الضوئية في الصانعات الخضراء لتشغيل التفاعلات ودمج الكربون غير العضوي."
        }
      ]
    },
    {
      id: "biology_respiration",
      title: "التنفس الخلوي مقابل التخمر (Cellular Respiration vs Fermentation)",
      subtitle: "دراسة الهدم الكلي والجزئي للمادة الغذائية لإنتاج الطاقة الحيوية ATP في ظروف مغلقة",
      category: "علوم طبيعية",
      curriculum: "السنة الأولى ثانوي (آليات الحصول على الطاقة الكيميائية الكامنة)",
      description: "استخدم خلايا الخميرة ومخزون الجلوكوز لمقارنة آليتي هدم السكر: التنفس في وجود الأكسجين (أكسدة كاملة تطلق غاز CO₂ ومبخار الماء وإنتاج طاقة عالية 38 ATP)، أو التخمر في غياب الأكسجين (أكسدة جزئية تنتج كحلاً وطاقة ضئيلة 2 ATP).",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
          caption: "تعتبر الميتوكوندريا هي مصنع التنفس الخلوي الأساسي بفضل السلسلة التنفسية، بينما يتم التخمر بدائياً في الهيولى الحرة."
        }
      ]
    },
    {
      id: "biology_differentiation",
      title: "التمايز الخلوي ونمو الخلايا (Cell Differentiation & Growth)",
      subtitle: "تطور الخلايا المرستيمية الجذعية إلى أنسجة متخصصة (خشب، لِحَاء، أوبار ماصة)",
      category: "علوم طبيعية",
      curriculum: "السنة الأولى ثانوي (آليات نمو الكائنات الحية وتجديد الخلايا)",
      description: "تتبع مسيرة الأيام لترى كيف تطرأ التغيرات الشكلية والخلية على الخلايا التأسيسية لتتحول إلى نسيج خشبي ناقل، نسيج غربالي (لحاء)، أو أوبار ماصة جذرية متخصصة في امتصاص الماء والمعادن.",
      image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=600&auto=format&fit=crop",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=600&auto=format&fit=crop",
          caption: "تفقد الخلايا الغربالية نواتها وبعض عضياتها لتسهيل جريان النسغ الكامل، بينما يتميز نسيج الخشب بتغلظه بالخشبين وفقدان جدرانه العرضية تماماً."
        }
      ]
    }
  ];

  // Filter list on search query
  const hasMatchedLabs = searchQuery && searchQuery.trim().length >= 2 && algerianLabs.some(lab => 
    lab.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lab.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentLabsList = hasMatchedLabs 
    ? algerianLabs.filter(lab => 
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lab.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : algerianLabs;

  const navigateLab = (direction: "prev" | "next") => {
    const currentIndex = currentLabsList.findIndex(l => l.id === activeLab);
    if (currentIndex === -1) return;
    let nextIndex = currentIndex;
    if (direction === "next") {
      nextIndex = (currentIndex + 1) % currentLabsList.length;
    } else {
      nextIndex = (currentIndex - 1 + currentLabsList.length) % currentLabsList.length;
    }
    playSound();
    setActiveLab(currentLabsList[nextIndex].id);
    
    // Smoothly scroll the newly selected tab into visual focus on small devices
    setTimeout(() => {
      const activeEl = document.getElementById(`lab-btn-${currentLabsList[nextIndex].id}`);
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }, 50);
  };

  useEffect(() => {
    if (searchQuery && searchQuery.trim().length >= 2) {
      const q = searchQuery.trim().toLowerCase();
      const matchedLab = algerianLabs.find(lab => 
        lab.title.toLowerCase().includes(q) ||
        lab.subtitle.toLowerCase().includes(q) ||
        lab.description.toLowerCase().includes(q)
      );
      if (matchedLab) {
        setActiveLab(matchedLab.id);
        setIsLabLaunched(true);
      }
    }
  }, [searchQuery]);

  // --- ACTIVE SIMULATIONS TIMERS & EFFECTS ---

  // Newton Simulation
  useEffect(() => {
    if (isNewtonRunning && activeLab === "newton") {
      const acceleration = force / mass;
      let lastTime = performance.now();
      let velocity = 0;
      let currentPos = 0;

      const run = (time: number) => {
        const dt = (time - lastTime) / 1000;
        lastTime = time;

        velocity += acceleration * dt * 25; // Visual speed coefficient
        currentPos += velocity * dt;

        if (currentPos > 240) {
          currentPos = 0;
          velocity = 0;
        }

        setNewtonPosition(currentPos);
        newtonAnimRef.current = requestAnimationFrame(run);
      };

      newtonAnimRef.current = requestAnimationFrame(run);
    } else {
      if (newtonAnimRef.current) cancelAnimationFrame(newtonAnimRef.current);
    }
    return () => {
      if (newtonAnimRef.current) cancelAnimationFrame(newtonAnimRef.current);
    };
  }, [isNewtonRunning, force, mass, activeLab]);

  // Pendulum Simulation Tick
  useEffect(() => {
    if (isPendulumRunning && activeLab === "pendulum") {
      let lastTime = performance.now();
      const run = (time: number) => {
        const dt = (time - lastTime) / 1000;
        lastTime = time;
        setPendulumTime((prev) => prev + dt);
        pendulumAnimRef.current = requestAnimationFrame(run);
      };
      pendulumAnimRef.current = requestAnimationFrame(run);
    } else {
      if (pendulumAnimRef.current) cancelAnimationFrame(pendulumAnimRef.current);
    }
    return () => {
      if (pendulumAnimRef.current) cancelAnimationFrame(pendulumAnimRef.current);
    };
  }, [isPendulumRunning, activeLab]);

  // Handle Balancing Validation on Change
  useEffect(() => {
    if (activeLab === "equations") {
      // Balance CH4 + 2 O2 -> CO2 + 2 H2O
      // We want to check if: coefCH4 == 1 and coefO2 == 2 and coefCO2 == 1 and coefH2O == 2
      // Let's count atoms:
      const reactantC = coefCH4 * 1;
      const reactantH = coefCH4 * 4;
      const reactantO = coefO2 * 2;

      const productC = coefCO2 * 1;
      const productH = coefH2O * 2;
      const productO = coefCO2 * 2 + coefH2O * 1;

      if (reactantC === productC && reactantH === productH && reactantO === productO) {
        setEquationFeedback({
          isBalanced: true,
          message: "🎉 أحسنت! المعادلة متوازنة تماماً. عدد الكربون والهيدروجين والأكسجين متطابق في الطرفين وعضلات التوازن متعادلة."
        });
      } else {
        setEquationFeedback({
          isBalanced: false,
          message: `⚠️ غير متوازنة! المتفاعلات: (C: ${reactantC}, H: ${reactantH}, O: ${reactantO}) | النواتج: (C: ${productC}, H: ${productH}, O: ${productO}). اضبط قيم المعاملات للوصول لعديل التكافؤ الأصلي.`
        });
      }
    }
  }, [coefCH4, coefO2, coefCO2, coefH2O, activeLab]);

  // Reset function
  const resetLab = () => {
    if (activeLab === "newton") {
      setMass(5);
      setForce(25);
      setNewtonPosition(0);
      setIsNewtonRunning(false);
    } else if (activeLab === "ohm") {
      setVoltage(12);
      setResistance(50);
    } else if (activeLab === "buoyancy") {
      setObjDensity(0.8);
      setLiqDensity(1.0);
    } else if (activeLab === "refraction") {
      setIncidenceAngle(45);
      setN2Index(1.5);
    } else if (activeLab === "pythagoras") {
      setBaseA(6);
      setHeightB(8);
    } else if (activeLab === "titration") {
      setTitrantVolume(0);
      setAnalyteConcentration(0.1);
      setTitrantConcentration(0.1);
    } else if (activeLab === "pendulum") {
      setPendulumLength(2.5);
      setPendulumMass(1.0);
      setPendulumAngle(30);
      setPendulumTime(0);
      setIsPendulumRunning(true);
    } else if (activeLab === "gas") {
      setGasVolume(30);
      setGasTemp(300);
      setGasMoles(1.5);
    } else if (activeLab === "trigo") {
      setTrigoAngle(45);
    } else if (activeLab === "equations") {
      setCoefCH4(1);
      setCoefO2(1);
      setCoefCO2(1);
      setCoefH2O(1);
    }
  };

  // Calculations for Titration
  const na_concentration = analyteConcentration; // HCl Molarity
  const va_volume = acidVolume; // HCl Volume in mL
  const nb_concentration = titrantConcentration; // NaOH Molarity
  // Equivalence volume V_eq = (Na * Va) / Nb
  const v_equivalence = (na_concentration * va_volume) / nb_concentration;
  
  // Custom simple pH calculation simulator
  // before equivalence: excess H+
  // after equivalence: excess OH-
  const getPHValue = () => {
    const v_b = titrantVolume;
    // exact equivalence
    if (Math.abs(v_b - v_equivalence) < 0.1) {
      return 7.0;
    }
    if (v_b < v_equivalence) {
      // pH slowly rises from 1 to ~3 then sharp jump
      const fraction = v_b / v_equivalence;
      const initialPH = 1.0;
      return +(initialPH + (-Math.log10(1 - fraction + 0.001))).toFixed(2);
    } else {
      // pH rises from 11/12 to 13
      const excessVolume = v_b - v_equivalence;
      const initialJump = 11.5;
      return +(initialJump + Math.log10(excessVolume + 0.01) * 0.8).toFixed(2);
    }
  };
  const titrationPH = getPHValue();

  // Color selection based on ph (bromothymol blue)
  // Yellow at acid (<6), Green at neutral (6-7.6), Blue at alkaline (>7.6)
  const getTitrationColor = () => {
    if (titrationPH <= 6.0) return "rgba(234, 179, 8, 0.4)"; // Yellow
    if (titrationPH > 6.0 && titrationPH <= 7.6) return "rgba(34, 197, 94, 0.45)"; // Green
    return "rgba(59, 130, 246, 0.5)"; // Blue
  };

  // Calculations for Ohm's law
  const current = voltage / resistance;

  // Snell's Law Calculations for Refraction
  const snellTheta1Rad = (incidenceAngle * Math.PI) / 180;
  const snellSinTheta2 = Math.sin(snellTheta1Rad) / n2Index;
  const snellTheta2Rad = snellSinTheta2 <= 1 ? Math.asin(snellSinTheta2) : Math.PI / 2;
  const refractionAngle = (snellTheta2Rad * 180) / Math.PI;

  // Buoyancy float calculations
  const isFloating = objDensity < liqDensity;
  const submergedRatio = Math.min(1, objDensity / liqDensity);
  const submergedPercent = (submergedRatio * 100).toFixed(1);

  // Pythagoras calculation
  const hypotenuse = Math.sqrt(baseA * baseA + heightB * heightB);
  const angleAlpha = (Math.atan(heightB / baseA) * 180) / Math.PI;
  const angleBeta = 90 - angleAlpha;

  // Ideal Gas Law calculations
  // P = nRT / V (R constant as proportional for simulator scaling)
  const RConstant = 8.314;
  const calculatedPressure = +(gasMoles * RConstant * gasTemp / gasVolume).toFixed(2);

  // Trigo points
  const trigoRad = (trigoAngle * Math.PI) / 180;
  const trigoX = Math.cos(trigoRad);
  const trigoY = Math.sin(trigoRad);

  const selectedLabMeta = algerianLabs.find((l) => l.id === activeLab);

  return (
    <section 
      id="virtual-lab-outer-section"
      className="mx-auto max-w-7xl px-4 sm:px-6 py-6"
    >
      <AnimatePresence mode="wait">
        {!isLabLaunched ? (
          /* Cover/Launcher layout (الواجهة الأساسية المغلقة المحفزة) */
          <motion.div
            key="sandbox-launcher"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`p-6 sm:p-10 rounded-3xl border text-right overflow-hidden relative ${
              isDarkMode 
                ? "bg-gradient-to-br from-[#0B0C1E] via-[#090A17] to-[#04050E] border-[#1E214B] text-white" 
                : "bg-gradient-to-br from-indigo-50/60 via-white to-slate-100 border-gray-200 text-gray-800 shadow-xl"
            }`}
          >
            {/* Ambient Background Glow glow */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-purple-600/5 rounded-full blur-[90px] pointer-events-none" />

            <div className="max-w-4xl relative z-10">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Beaker className="w-5 h-5 animate-bounce" />
                </span>
                <span className="text-xs font-extrabold text-indigo-500 uppercase tracking-widest bg-indigo-500/5 px-2.5 py-1 rounded-full border border-indigo-500/10">
                  التحصيل العلمي والبيئات التفاعلية
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                بيئة المحاكاة ومختبر التجارب الافتراضي 🔬
              </h2>
              <p className="text-sm sm:text-md text-gray-430 dark:text-gray-400 mt-3 max-w-2xl leading-relaxed">
                بوابة رقمية مخصصة للفيزياء والكيمياء والرياضيات متكاملة تماماً مع المنهاج التربوي الجزائري والأطوار الدراسية (التعليم المتوسط والتعليم الثانوي). غيّر الكتلة والسرعة، زن المعادلات، صب الأحماض والقلويات وشاهد النتيجة لحظياً لترسيخ علاقة السبب والأثر!
              </p>

              {/* Feature Tags Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  isDarkMode ? "bg-[#11132E]/40 border-[#20234E]" : "bg-white border-slate-200/80 shadow-sm"
                }`}>
                  <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400">عدد النماذج</div>
                    <div className="text-xs font-bold font-mono">25 تجربة متكاملة</div>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  isDarkMode ? "bg-[#11132E]/40 border-[#20234E]" : "bg-white border-slate-200/80 shadow-sm"
                }`}>
                  <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400">المنهاج المستهدف</div>
                    <div className="text-xs font-bold leading-none mt-0.5">المنهاج الجزائري</div>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  isDarkMode ? "bg-[#11132E]/40 border-[#20234E]" : "bg-white border-slate-200/80 shadow-sm"
                }`}>
                  <Calculator className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400">آلية الحلول</div>
                    <div className="text-xs font-bold">بصرية سبب ونتيجة</div>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  isDarkMode ? "bg-[#11132E]/40 border-[#20234E]" : "bg-white border-slate-200/80 shadow-sm"
                }`}>
                  <Zap className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400">التحديثات المستمرة</div>
                    <div className="text-xs font-bold">أرقام وحسابات دقيقة</div>
                  </div>
                </div>
              </div>

              {/* 10 Miniature Labs Preview Carousels represented as high-quality sliding cards with navigation arrows */}
              <div className="mt-8 relative select-none">
                <div className="flex items-center justify-between mb-4 border-b border-indigo-500/10 pb-2">
                  <h4 className="text-xs font-extrabold text-[#949EC3] dark:text-[#8C93B2] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>تصفح وتنقّل بين التجارب المخبرية التفاعلية:</span>
                  </h4>
                  
                  {/* Arrows for sliding navigation */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => {
                        playSound();
                        setLauncherIndex((prev) => (prev + 1) % currentLabsList.length);
                      }}
                      className={`p-1.5 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                        isDarkMode 
                          ? "bg-[#141635] border-[#2C2E5D] text-gray-300 hover:text-white hover:bg-indigo-600/20" 
                          : "bg-white border-gray-200 text-gray-700 hover:bg-slate-50"
                      }`}
                      title="التجربة التالية"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        playSound();
                        setLauncherIndex((prev) => (prev - 1 + currentLabsList.length) % currentLabsList.length);
                      }}
                      className={`p-1.5 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                        isDarkMode 
                          ? "bg-[#141635] border-[#2C2E5D] text-gray-300 hover:text-white hover:bg-indigo-600/20" 
                          : "bg-white border-gray-200 text-gray-700 hover:bg-slate-50"
                      }`}
                      title="التجربة السابقة"
                    >
                      <span className="w-4 h-4 flex items-center justify-center font-bold text-xs">▶</span>
                    </button>
                  </div>
                </div>

                {/* Grid window showing cards from launcherIndex */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(() => {
                    const cardsToRender = [];
                    const len = currentLabsList.length;
                    
                    // On desktop we show 3, tablet 2, mobile 1.
                    // We generate indexes so they feel continuous and wraparound.
                    for (let i = 0; i < 3; i++) {
                      const idx = (launcherIndex + i) % len;
                      cardsToRender.push({ lab: currentLabsList[idx], slotIndex: i });
                    }

                    return cardsToRender.map(({ lab, slotIndex }) => {
                      return (
                        <motion.div
                          key={`${lab.id}-${slotIndex}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2, delay: slotIndex * 0.05 }}
                          whileHover={{ scale: 1.02, translateY: -2 }}
                          onClick={() => {
                            playSound();
                            setActiveLab(lab.id);
                            setIsLabLaunched(true);
                          }}
                          className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 h-28 cursor-pointer select-none relative overflow-hidden group shadow-md ${
                            slotIndex === 1 ? "sm:flex" : slotIndex === 2 ? "hidden lg:flex" : "flex"
                          } ${
                            isDarkMode 
                              ? "bg-[#141635]/65 hover:bg-[#1C1F4D]/85 border-[#282B55] hover:border-indigo-500/40" 
                              : "bg-white hover:bg-slate-50 border-gray-200 hover:border-indigo-300 hover:shadow-lg"
                          }`}
                        >
                          <div className="absolute -left-10 -top-10 w-20 h-20 rounded-full bg-indigo-500/5 blur-lg group-hover:bg-indigo-500/10 transition-colors pointer-events-none"></div>
                          
                          <div className="flex-1 text-right min-w-0 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                                lab.category === "فيزياء" 
                                  ? "bg-blue-500/10 text-blue-400"
                                  : lab.category === "كيمياء"
                                    ? "bg-amber-500/10 text-amber-400"
                                    : lab.category === "رياضيات"
                                      ? "bg-purple-500/10 text-purple-400"
                                      : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {lab.category}
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                                {lab.curriculum.split(" ")[0]} {lab.curriculum.split(" ")[1] || ""}
                              </span>
                            </div>

                            <div className="space-y-0.5 mt-2">
                              <h5 className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-gray-100 group-hover:text-indigo-400 transition-colors leading-tight line-clamp-1">
                                {lab.title}
                              </h5>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {lab.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Decorative Image Thumbnail */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-indigo-500/10 shadow-sm bg-slate-900/40 relative">
                            <LabImageWithFallback 
                              src={lab.image} 
                              alt="" 
                              id={lab.id}
                              category={lab.category}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                          </div>
                        </motion.div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Play / Launch Button */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center">
                <button
                  onClick={() => setIsLabLaunched(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl shadow-indigo-600/35 transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 fill-white shrink-0" />
                  <span>دخول بيئة المحاكاة التفاعلية (25 تجربة ممتازة)</span>
                </button>
                <span className="text-xs text-gray-400">
                  ⚡ لا توجد قيود على الاستخدام، جميع المحاكاة تسير محلياً بنقاء 100٪.
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Simulator Workspace layout (المختبر الأساسي بعد الضغط) */
          <motion.div
            key="simulation-workspace"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            className={`p-5 sm:p-8 rounded-3xl border transition-all duration-300 ${
              isDarkMode 
                ? "bg-gradient-to-b from-[#0E1026] via-[#090A17] to-[#04050E] border-[#20234E] text-[#E0E2EE]" 
                : "bg-gradient-to-b from-white via-slate-50 to-slate-100 border-gray-200 text-gray-800 shadow-xl"
            }`}
          >
            {/* Header with Exit controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#20234E]/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLabLaunched(false)}
                  className={`p-2.5 rounded-xl border transition-all hover:scale-105 shrink-0 ${
                    isDarkMode 
                      ? "bg-[#1B1D3E] border-[#2B2E63] text-gray-300 hover:text-white hover:bg-[#252857]" 
                      : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                  }`}
                  title="العودة لشاشة البداية"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>مختبر بلعزوق للعلوم التفاعلية</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight">
                    بيئة التجارب الافتراضية (25 نموذج متكامل)
                  </h2>
                </div>
              </div>

              <div className="flex gap-2 self-start md:self-auto">
                <button 
                  onClick={resetLab}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                    isDarkMode 
                      ? "bg-[#1B1D3E] hover:bg-[#252857] text-[#B5BACF] hover:text-white border border-[#2D3169]" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                  title="إعادة تعيين قيم التجربة الحالية"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة ضبط المتغيرات</span>
                </button>

                <button
                  onClick={() => setIsLabLaunched(false)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                    isDarkMode 
                      ? "bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-600/20" 
                      : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>الرئيسية للمختبر</span>
                </button>
              </div>
            </div>

            {/* Quick Curriculum Highlight banner */}
            <div className={`p-4 rounded-2xl border mb-6 flex flex-col md:flex-row gap-4 items-center justify-between text-right ${
              isDarkMode ? "bg-indigo-950/20 border-indigo-500/20" : "bg-indigo-50/50 border-indigo-100"
            }`}>
              <div className="flex items-center gap-3">
                {/* Dynamically assigned real stock photo representing the science lab content */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-indigo-500/10 bg-slate-900/40 relative">
                  <LabImageWithFallback 
                    src={selectedLabMeta?.image} 
                    alt={selectedLabMeta?.title} 
                    id={selectedLabMeta?.id || ""}
                    category={selectedLabMeta?.category || ""}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold">
                      {selectedLabMeta?.category}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                      📚 {selectedLabMeta?.curriculum}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm mt-1">{selectedLabMeta?.title} - {selectedLabMeta?.subtitle}</h3>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 max-w-xl md:text-left text-right">
                {selectedLabMeta?.description}
              </p>
            </div>

            {/* Grid layout for Sidebar and Workstage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Scientific Lab Selector Sidebar - Contains 10 Items with flanking arrows for navigation */}
              <div className="lg:col-span-3 flex flex-col gap-2 relative">
                
                {/* Desktop Mini-Navigation Header */}
                <div className="hidden lg:flex items-center justify-between mb-1 text-right">
                  <h4 className="text-xs font-black text-[#949EC3] dark:text-[#8C93B2] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>تجارب المختبر الإلكتروني:</span>
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigateLab("prev")}
                      className={`p-1 rounded bg-[#101230] hover:bg-[#1C1F4D] border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer`}
                      title="التجربة السابقة"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigateLab("next")}
                      className={`p-1 rounded bg-[#101230] hover:bg-[#1C1F4D] border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer`}
                      title="التجربة التالية"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Relative scrollable layout with arrow overlays for tablet/mobile horizontal viewport */}
                <div className="relative flex items-center w-full group">
                  
                  {/* Flanking Arrow Left (Go to next item in Arabic RTL reading order) */}
                  <button
                    onClick={() => navigateLab("next")}
                    className={`absolute -left-2.5 lg:hidden z-10 p-2 rounded-full border shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer bg-indigo-950 text-white border-indigo-500 hover:bg-indigo-900`}
                    style={{ top: "calc(50% - 16px)" }}
                    title="التجربة التالية"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div 
                    ref={sidebarScrollRef}
                    className="flex-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none"
                  >
                    {currentLabsList.map((lab) => {
                      const isCurrent = activeLab === lab.id;
                      return (
                        <button
                          key={lab.id}
                          id={`lab-btn-${lab.id}`}
                          onClick={() => { playSound(); setActiveLab(lab.id); }}
                          className={`text-right p-2.5 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer border shrink-0 text-xs sm:text-sm ${
                            isCurrent
                              ? "bg-indigo-600 border-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/15"
                              : isDarkMode
                                ? "bg-[#131533]/50 border-[#22254B] text-gray-450 hover:bg-[#16193E] hover:text-white"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 animate-fade-in"
                          }`}
                        >
                          {/* Left circular miniature thumbnail container */}
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/20 bg-slate-900/40 relative">
                            <LabImageWithFallback 
                              src={lab.image} 
                              alt="" 
                              id={lab.id}
                              category={lab.category}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 text-right min-w-[130px]">
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-[11px] sm:text-xs leading-tight">{lab.title}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded inline-block leading-none ${
                                lab.category === "فيزياء" 
                                  ? "bg-blue-500/10 text-blue-400"
                                  : lab.category === "كيمياء"
                                    ? "bg-amber-500/10 text-amber-400"
                                    : lab.category === "رياضيات"
                                      ? "bg-purple-500/10 text-purple-400"
                                      : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {lab.category}
                              </span>
                            </div>
                            <div className="text-[9px] opacity-70 mt-0.5 line-clamp-1">{lab.subtitle}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Flanking Arrow Right (Go to previous item in Arabic RTL reading order) */}
                  <button
                    onClick={() => navigateLab("prev")}
                    className={`absolute -right-2.5 lg:hidden z-10 p-2 rounded-full border shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer bg-indigo-950 text-white border-indigo-500 hover:bg-indigo-900`}
                    style={{ top: "calc(50% - 16px)" }}
                    title="التجربة السابقة"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>
              </div>

              {/* Central Work Environment & Sliders */}
              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Control Panel for Scientific Values & Parameters */}
                <div className={`md:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${
                  isDarkMode ? "bg-[#090A17] border-[#1D1E3E]" : "bg-white border-gray-200 shadow-sm"
                }`}>
                  <div>
                    <h3 className="font-bold text-xs text-indigo-400 mb-4 flex items-center gap-1.5 border-b border-gray-800/20 pb-2">
                      <Calculator className="w-4 h-4" />
                      <span>التحكم في المتغيرات (السبب والأثر)</span>
                    </h3>

                    {/* Labs Sliders Condition Blocks */}
                    <AnimatePresence mode="wait">
                      
                      {/* 1. Newton's second law */}
                      {activeLab === "newton" && (
                        <motion.div
                          key="newton-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>الكتلة (m) - وزن الجسم</span>
                              <span className="text-indigo-400 font-mono">{mass} كغ</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              step="0.5"
                              value={mass}
                              onChange={(e) => {
                                setMass(parseFloat(e.target.value));
                                setNewtonPosition(0);
                              }}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>1 كغ (خفيف)</span>
                              <span>10 كغ (ثقيل)</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>قوة الدفع المؤثرة (F)</span>
                              <span className="text-indigo-400 font-mono">{force} نيوتن</span>
                            </div>
                            <input
                              type="range"
                              min="5"
                              max="50"
                              step="1"
                              value={force}
                              onChange={(e) => {
                                setForce(parseInt(e.target.value));
                                setNewtonPosition(0);
                              }}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>5 نيوتن (دفع خفيف)</span>
                              <span>50 نيوتن (دفع قوي جداً)</span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <button
                              onClick={() => setIsNewtonRunning(!isNewtonRunning)}
                              className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                isNewtonRunning
                                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30"
                              }`}
                            >
                              {isNewtonRunning ? "إيقاف الحركة" : "تشغيل بيئة الحركة"}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* 2. Ohm's Law */}
                      {activeLab === "ohm" && (
                        <motion.div
                          key="ohm-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>فرق الجهد الكهربائي (V)</span>
                              <span className="text-indigo-400 font-mono">{voltage} فولت</span>
                            </div>
                            <input
                              type="range"
                              min="1.5"
                              max="24"
                              step="1.5"
                              value={voltage}
                              onChange={(e) => setVoltage(parseFloat(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>1.5 فولت</span>
                              <span>24 فولت</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>المقاومة الأومية (R)</span>
                              <span className="text-indigo-400 font-mono">{resistance} أوم</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="150"
                              step="5"
                              value={resistance}
                              onChange={(e) => setResistance(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>10Ω (توصيل قوي)</span>
                              <span>150Ω (إعاقة وعرقلة)</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 3. Buoyancy / Density */}
                      {activeLab === "buoyancy" && (
                        <motion.div
                          key="buoyancy-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>كثافة المكعب الصلب (ρ_cube)</span>
                              <span className="text-indigo-400 font-mono">{objDensity.toFixed(2)} غ/سم³</span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="2.5"
                              step="0.05"
                              value={objDensity}
                              onChange={(e) => setObjDensity(parseFloat(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>0.1 (فلين/بلاستيك رغوي)</span>
                              <span>2.5 (كثيف الصلابة)</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>كثافة السائل الحاوي (ρ_liquid)</span>
                              <span className="text-indigo-400 font-mono">{liqDensity.toFixed(2)} غ/سم³</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="1.8"
                              step="0.05"
                              value={liqDensity}
                              onChange={(e) => setLiqDensity(parseFloat(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>0.5 (سائل خفيف)</span>
                              <span>1.8 (محلول مالح/جلسرين)</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 4. Snell's Law / Refraction */}
                      {activeLab === "refraction" && (
                        <motion.div
                          key="refraction-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>زاوية سقوط الشعاع (θ_1)</span>
                              <span className="text-indigo-400 font-mono">{incidenceAngle}° دَرَجَة</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="85"
                              step="1"
                              value={incidenceAngle}
                              onChange={(e) => setIncidenceAngle(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>0° (عمودي)</span>
                              <span>85° (مائل حاد)</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>معامل انكسار الوسط الثاني (n_2)</span>
                              <span className="text-indigo-400 font-mono">{n2Index.toFixed(2)}</span>
                            </div>
                            <input
                              type="range"
                              min="1.0"
                              max="2.4"
                              step="0.05"
                              value={n2Index}
                              onChange={(e) => setN2Index(parseFloat(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>1.0 (هواء)</span>
                              <span>2.4 (ماس عالي التشتيت)</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 5. Pythagoras */}
                      {activeLab === "pythagoras" && (
                        <motion.div
                          key="pythagoras-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>الضلع الأفقي المجاور (A)</span>
                              <span className="text-indigo-400 font-mono">{baseA} سم</span>
                            </div>
                            <input
                              type="range"
                              min="3"
                              max="12"
                              step="0.5"
                              value={baseA}
                              onChange={(e) => setBaseA(parseFloat(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>الضلع الرأسي المقابل (B)</span>
                              <span className="text-indigo-400 font-mono">{heightB} سم</span>
                            </div>
                            <input
                              type="range"
                              min="3"
                              max="12"
                              step="0.5"
                              value={heightB}
                              onChange={(e) => setHeightB(parseFloat(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 6. Titration (المعايرة حمض أساس) */}
                      {activeLab === "titration" && (
                        <motion.div
                          key="titration-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>الحجم المسكوب من السحاحة (V_b)</span>
                              <span className="text-indigo-300 font-mono font-bold text-sm bg-indigo-500/10 px-1.5 py-0.5 rounded">{titrantVolume} مل</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="30"
                              step="0.2"
                              value={titrantVolume}
                              onChange={(e) => setTitrantVolume(parseFloat(e.target.value))}
                              className="w-full accent-indigo-550 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>0 مل (بدء التجربة)</span>
                              <span>30 مل (نهاية التدفق)</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-800/20 border border-slate-700/30 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">تركيز الحمض (analyte):</span>
                              <span className="font-mono text-gray-250 font-bold">{analyteConcentration} M</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">تركيز الأساس الـ NaOH:</span>
                              <span className="font-mono text-gray-250 font-bold">{titrantConcentration} M</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 7. Simple Pendulum */}
                      {activeLab === "pendulum" && (
                        <motion.div
                          key="pendulum-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>طول الخيط المعلق (L)</span>
                              <span className="text-indigo-400 font-mono">{pendulumLength.toFixed(1)} متر</span>
                            </div>
                            <input
                              type="range"
                              min="1.0"
                              max="4.0"
                              step="0.1"
                              value={pendulumLength}
                              onChange={(e) => setPendulumLength(parseFloat(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>كتلة الثقل (m)</span>
                              <span className="text-indigo-400 font-mono">{pendulumMass.toFixed(1)} كغ</span>
                            </div>
                            <input
                              type="range"
                              min="0.2"
                              max="3.0"
                              step="0.1"
                              value={pendulumMass}
                              onChange={(e) => setPendulumMass(parseFloat(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setIsPendulumRunning(!isPendulumRunning)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isPendulumRunning ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"
                              }`}
                            >
                              {isPendulumRunning ? "تجميد التذبذب" : "مواصلة الحركة النواسية"}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* 8. Ideal Gas Law */}
                      {activeLab === "gas" && (
                        <motion.div
                          key="gas-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>درجة الحرارة المطلقة (T)</span>
                              <span className="text-indigo-400 font-mono">{gasTemp} كلفن ({gasTemp - 273}° م)</span>
                            </div>
                            <input
                              type="range"
                              min="150"
                              max="500"
                              step="10"
                              value={gasTemp}
                              onChange={(e) => setGasTemp(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>حجم الأنبوبة/الحجرة (V)</span>
                              <span className="text-indigo-400 font-mono">{gasVolume} لتر</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="50"
                              step="2"
                              value={gasVolume}
                              onChange={(e) => setGasVolume(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>ضغظ عالي (صغير)</span>
                              <span>ضغط منخفض (كبير)</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 9. Trigo Circle */}
                      {activeLab === "trigo" && (
                        <motion.div
                          key="trigo-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>الزاوية الدائرية (θ)</span>
                              <span className="text-indigo-400 font-mono">{trigoAngle}° d</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              step="1"
                              value={trigoAngle}
                              onChange={(e) => setTrigoAngle(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                              <span>0°</span>
                              <span>90° (π/2)</span>
                              <span>180° (π)</span>
                              <span>270° (3π/2)</span>
                              <span>360° (2π)</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 10. Balancing Equations */}
                      {activeLab === "equations" && (
                        <motion.div
                          key="equations-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-3"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1 p-2 rounded-xl bg-slate-800/10 border border-slate-700/20 text-center">
                              <label className="text-[10px] font-bold block text-gray-400">معامل غاز الميثان a</label>
                              <div className="flex items-center justify-center gap-2 mt-1">
                                <button onClick={() => setCoefCH4(Math.max(1, coefCH4 - 1))} className="p-1 rounded bg-slate-800 text-xs px-2">-</button>
                                <span className="font-bold text-indigo-400 font-mono text-sm">{coefCH4}</span>
                                <button onClick={() => setCoefCH4(Math.min(4, coefCH4 + 1))} className="p-1 rounded bg-slate-800 text-xs px-2">+</button>
                              </div>
                            </div>

                            <div className="space-y-1 p-2 rounded-xl bg-slate-800/10 border border-slate-700/20 text-center">
                              <label className="text-[10px] font-bold block text-gray-400">معامل غاز الأكسجين b</label>
                              <div className="flex items-center justify-center gap-2 mt-1">
                                <button onClick={() => setCoefO2(Math.max(1, coefO2 - 1))} className="p-1 rounded bg-slate-800 text-xs px-2">-</button>
                                <span className="font-bold text-indigo-400 font-mono text-sm">{coefO2}</span>
                                <button onClick={() => setCoefO2(Math.min(4, coefO2 + 1))} className="p-1 rounded bg-slate-800 text-xs px-2">+</button>
                              </div>
                            </div>

                            <div className="space-y-1 p-2 rounded-xl bg-slate-800/10 border border-slate-700/20 text-center">
                              <label className="text-[10px] font-bold block text-gray-400">معامل غاز الفحم c</label>
                              <div className="flex items-center justify-center gap-2 mt-1">
                                <button onClick={() => setCoefCO2(Math.max(1, coefCO2 - 1))} className="p-1 rounded bg-slate-800 text-xs px-2">-</button>
                                <span className="font-bold text-indigo-400 font-mono text-sm">{coefCO2}</span>
                                <button onClick={() => setCoefCO2(Math.min(4, coefCO2 + 1))} className="p-1 rounded bg-slate-800 text-xs px-2">+</button>
                              </div>
                            </div>

                            <div className="space-y-1 p-2 rounded-xl bg-slate-800/10 border border-slate-700/20 text-center">
                              <label className="text-[10px] font-bold block text-gray-400">معامل بخار الماء d</label>
                              <div className="flex items-center justify-center gap-2 mt-1">
                                <button onClick={() => setCoefH2O(Math.max(1, coefH2O - 1))} className="p-1 rounded bg-slate-800 text-xs px-2">-</button>
                                <span className="font-bold text-indigo-400 font-mono text-sm">{coefH2O}</span>
                                <button onClick={() => setCoefH2O(Math.min(4, coefH2O + 1))} className="p-1 rounded bg-slate-800 text-xs px-2">+</button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 11. Kirchhoff Slider Controls */}
                      {activeLab === "kirchhoff" && (
                        <motion.div
                          key="kirchhoff-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>قوة المولد الكهربائي (E)</span>
                              <span className="text-indigo-400 font-mono">{voltageK} فولت</span>
                            </div>
                            <input
                              type="range"
                              min="2"
                              max="24"
                              step="1"
                              value={voltageK}
                              onChange={(e) => setVoltageK(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>مقاومة الفرع الأول (R₁)</span>
                              <span className="text-indigo-400 font-mono">{resistanceR1} أوم</span>
                            </div>
                            <input
                              type="range"
                              min="2"
                              max="100"
                              step="2"
                              value={resistanceR1}
                              onChange={(e) => setResistanceR1(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>مقاومة الفرع الثاني (R₂)</span>
                              <span className="text-indigo-400 font-mono">{resistanceR2} أوم</span>
                            </div>
                            <input
                              type="range"
                              min="2"
                              max="100"
                              step="2"
                              value={resistanceR2}
                              onChange={(e) => setResistanceR2(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 12. Faraday Slider Controls */}
                      {activeLab === "faraday" && (
                        <motion.div
                          key="faraday-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>موضع المغناطيس الأفقي (X)</span>
                              <span className="text-indigo-400 font-mono">{magnetPos}%</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="90"
                              step="1"
                              value={magnetPos}
                              onChange={(e) => setMagnetPos(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>خارج الوشيعة (يسار)</span>
                              <span>خارج الوشيعة (يمين)</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>عدد لفات الوشيعة (N)</span>
                              <span className="text-indigo-400 font-mono">{coilLoops} حلقات</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              step="1"
                              value={coilLoops}
                              onChange={(e) => setCoilLoops(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 13. Probability Slider Controls */}
                      {activeLab === "probability" && (
                        <motion.div
                          key="probability-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-3"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-red-400">الكريات الحمراء</span>
                              <span className="font-mono">{redBalls}</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              step="1"
                              value={redBalls}
                              onChange={(e) => {
                                setRedBalls(parseInt(e.target.value));
                                setDrawnBall(null);
                              }}
                              className="w-full accent-red-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-blue-400">الكريات الزرقاء</span>
                              <span className="font-mono">{blueBalls}</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              step="1"
                              value={blueBalls}
                              onChange={(e) => {
                                setBlueBalls(parseInt(e.target.value));
                                setDrawnBall(null);
                              }}
                              className="w-full accent-blue-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-emerald-400">الكريات الخضراء</span>
                              <span className="font-mono">{greenBalls}</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              step="1"
                              value={greenBalls}
                              onChange={(e) => {
                                setGreenBalls(parseInt(e.target.value));
                                setDrawnBall(null);
                              }}
                              className="w-full accent-emerald-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <button
                            onClick={() => {
                              playSound();
                              const total = redBalls + blueBalls + greenBalls;
                              const rand = Math.random() * total;
                              let drawn = "green";
                              if (rand < redBalls) {
                                drawn = "red";
                              } else if (rand < redBalls + blueBalls) {
                                drawn = "blue";
                              }
                              setDrawnBall(drawn);
                            }}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer mt-1 animate-pulse"
                          >
                            <span>🎲</span>
                            <span>اسحب كريّة عشوائية من الوعاء</span>
                          </button>
                        </motion.div>
                      )}

                      {/* 14. Greenhouse Slider Controls */}
                      {activeLab === "greenhouse" && (
                        <motion.div
                          key="greenhouse-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>تركيز غاز CO₂ في الجو</span>
                              <span className="text-indigo-400 font-mono">{co2Level} ppm</span>
                            </div>
                            <input
                              type="range"
                              min="300"
                              max="1200"
                              step="50"
                              value={co2Level}
                              onChange={(e) => setCo2Level(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>300 ppm (مستوى نقي جداً)</span>
                              <span>1200 ppm (تلوث خطير)</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>شدة الإشعاع الشمسي (G)</span>
                              <span className="text-indigo-400 font-mono">{solarRadiation} واط/م²</span>
                            </div>
                            <input
                              type="range"
                              min="1000"
                              max="2000"
                              step="50"
                              value={solarRadiation}
                              onChange={(e) => setSolarRadiation(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 15. Lens Slider Controls */}
                      {activeLab === "lens" && (
                        <motion.div
                          key="lens-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>البعد البؤري للعدسة (f')</span>
                              <span className="text-indigo-400 font-mono">{lensFocal} سم</span>
                            </div>
                            <input
                              type="range"
                              min="5"
                              max="25"
                              step="1"
                              value={lensFocal}
                              onChange={(e) => setLensFocal(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>بعد الجسم المضيء (OA)</span>
                              <span className="text-indigo-400 font-mono">{lensDistance} سم</span>
                            </div>
                            <input
                              type="range"
                              min={lensFocal + 1}
                              max="40"
                              step="1"
                              value={lensDistance}
                              onChange={(e) => setLensDistance(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500">
                              <span>قريب (OA &gt; f')</span>
                              <span>بعيد جداً</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 16. Radioactive Decay Slider Controls */}
                      {activeLab === "decay" && (
                        <motion.div
                          key="decay-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>زمن عمر النصف للأنوية (t½)</span>
                              <span className="text-indigo-400 font-mono">{halfLifePeriod} ثانية</span>
                            </div>
                            <input
                              type="range"
                              min="2"
                              max="20"
                              step="1"
                              value={halfLifePeriod}
                              onChange={(e) => setHalfLifePeriod(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>الزمن المستغرق للتجربة (t)</span>
                              <span className="text-indigo-400 font-mono">{elapsedTimeDecay} ثانية</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="60"
                              step="1"
                              value={elapsedTimeDecay}
                              onChange={(e) => setElapsedTimeDecay(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => { playSound(); setElapsedTimeDecay(0); }}
                            className="w-full py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            🔄 إعادة تصفير عداد الزمن t=0
                          </button>
                        </motion.div>
                      )}

                      {/* 21. Free Fall Controls */}
                      {activeLab === "freefall" && (
                        <motion.div
                          key="freefall-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4 font-sans"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>ارتفاع السقوط الإجمالي (h)</span>
                              <span className="text-indigo-400 font-mono font-bold">{freefallHeight} متر</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="5"
                              value={freefallHeight}
                              onChange={(e) => {
                                setFreefallHeight(parseInt(e.target.value));
                                setFreefallTime(0);
                                setIsFreefallRunning(false);
                              }}
                              className="w-full accent-indigo-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>كتلة الجسم الساقط (m)</span>
                              <span className="text-amber-500 font-mono font-bold">{freefallMass} كجم</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="50"
                              step="1"
                              value={freefallMass}
                              onChange={(e) => setFreefallMass(parseInt(e.target.value))}
                              className="w-full accent-amber-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <span className="text-xs font-bold block">مقاومة الهواء للأنبوب:</span>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setFreefallAirResistance(false)}
                                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                                  !freefallAirResistance
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                                    : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                                }`}
                              >
                                📭 مفرغ تماماً (فراغ)
                              </button>
                              <button
                                type="button"
                                onClick={() => setFreefallAirResistance(true)}
                                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                                  freefallAirResistance
                                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/10"
                                    : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                                }`}
                              >
                                💨 مملوء بالهواء الطبيعي
                              </button>
                            </div>
                          </div>

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (isFreefallRunning) {
                                  setIsFreefallRunning(false);
                                  setFreefallTime(0);
                                } else {
                                  setFreefallTime(0);
                                  setIsFreefallRunning(true);
                                  playSound();
                                }
                              }}
                              className={`w-full py-2.5 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                                isFreefallRunning
                                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                              } cursor-pointer`}
                            >
                              {isFreefallRunning ? "⏹️ إعادة تعيين السقوط" : "🪂 إسقاط الجسم الآن"}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* 22. Stoichiometry Controls */}
                      {activeLab === "stoichiometry" && (
                        <motion.div
                          key="stoich-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4 font-sans"
                        >
                          <div className="space-y-1.5">
                            <span className="text-xs font-bold block">اختر النوع الكيميائي (عنصر ثنائي أو مركب):</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: "H2O", name: "الماء (H₂O)", formula: "H2O" },
                                { id: "CO2", name: "ثنائي أوكسيد الكربون (CO₂)", formula: "CO2" },
                                { id: "NaCl", name: "ملح الطعام (NaCl)", formula: "NaCl" },
                                { id: "C6H12O6", name: "الغلوكوز (C₆H₁₂O₆)", formula: "C6H12O6" },
                                { id: "Fe", name: "الحديد النقي (Fe)", formula: "Fe" },
                                { id: "O2", name: "غاز الأوكسجين (O₂)", formula: "O2" }
                              ].map((sub) => (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => setStoichSubstance(sub.id)}
                                  className={`p-2 text-right text-[10.5px] font-bold rounded-lg transition-all ${
                                    stoichSubstance === sub.id
                                      ? "bg-indigo-600 text-white shadow-md border border-indigo-505"
                                      : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-transparent"
                                  }`}
                                >
                                  <div className="font-sans leading-tight">{sub.name}</div>
                                  <span className="text-[9px] text-gray-400 font-mono block mt-0.5">{sub.id}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>كتلة المادة بالجرام (m)</span>
                              <span className="text-[#10B981] font-mono font-bold">{stoichGrams} جرام</span>
                            </div>
                            <input
                              type="range"
                              min="5"
                              max="500"
                              step="5"
                              value={stoichGrams}
                              onChange={(e) => setStoichGrams(parseInt(e.target.value))}
                              className="w-full accent-emerald-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 23. Newton's 3rd Law Controls */}
                      {activeLab === "newton3" && (
                        <motion.div
                          key="newton3-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4 font-sans"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-bold">
                                <span>كتلة السيارة الأولى m₁</span>
                                <span className="text-red-400 font-mono">{newtonMassA} kg</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={newtonMassA}
                                onChange={(e) => {
                                  setNewtonMassA(parseInt(e.target.value));
                                  setIsNewtonAnimated(false);
                                }}
                                className="w-full accent-red-500 cursor-ew-resize h-1 bg-gray-800 rounded-lg appearance-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-bold">
                                <span>كتلة السيارة الثانية m₂</span>
                                <span className="text-blue-400 font-mono">{newtonMassB} kg</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={newtonMassB}
                                onChange={(e) => {
                                  setNewtonMassB(parseInt(e.target.value));
                                  setIsNewtonAnimated(false);
                                }}
                                className="w-full accent-blue-500 cursor-ew-resize h-1 bg-gray-800 rounded-lg appearance-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>قوة الدفع المطبقة قبل اللحظة (F)</span>
                              <span className="text-amber-500 font-mono font-bold">{newtonForce} نيوتن</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="5"
                              value={newtonForce}
                              onChange={(e) => {
                                setNewtonForce(parseInt(e.target.value));
                                setIsNewtonAnimated(false);
                              }}
                              className="w-full accent-amber-500 cursor-ew-resize h-1.5 bg-gray-800 rounded-lg appearance-none"
                            />
                          </div>

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsNewtonAnimated(true);
                                playSound();
                                setTimeout(() => setIsNewtonAnimated(false), 2000);
                              }}
                              disabled={isNewtonAnimated}
                              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20 disabled:bg-gray-700 disabled:text-gray-400 cursor-pointer"
                            >
                              💥 إحداث التصادم المباشر ومراقبة القوى
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* 24. Wave Superposition Controls */}
                      {activeLab === "waves" && (
                        <motion.div
                          key="waves-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-4 font-sans"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] text-gray-400 block font-bold">الموجة الحمراء (1):</span>
                              <div className="space-y-1 bg-black/20 p-1.5 rounded-lg border border-gray-800">
                                <div className="flex justify-between text-[10px] font-medium text-red-400">
                                  <span>السعة (A)</span>
                                  <span className="font-mono">{waveAmp1}</span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="5"
                                  step="0.5"
                                  value={waveAmp1}
                                  onChange={(e) => setWaveAmp1(parseFloat(e.target.value))}
                                  className="w-full accent-red-500 h-1 bg-gray-850"
                                />
                                <div className="flex justify-between text-[10px] font-medium text-red-00 mt-1">
                                  <span>التردد (f):</span>
                                  <span className="font-mono">{waveFreq1} Hz</span>
                                </div>
                                <input
                                  type="range"
                                  min="0.5"
                                  max="3.0"
                                  step="0.1"
                                  value={waveFreq1}
                                  onChange={(e) => setWaveFreq1(parseFloat(e.target.value))}
                                  className="w-full accent-red-500 h-1 bg-gray-850"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] text-gray-400 block font-bold">الموجة الزرقاء (2):</span>
                              <div className="space-y-1 bg-black/20 p-1.5 rounded-lg border border-gray-800">
                                <div className="flex justify-between text-[10px] font-medium text-blue-400">
                                  <span>السعة (A)</span>
                                  <span className="font-mono">{waveAmp2}</span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="5"
                                  step="0.5"
                                  value={waveAmp2}
                                  onChange={(e) => setWaveAmp2(parseFloat(e.target.value))}
                                  className="w-full accent-blue-500 h-1 bg-gray-850"
                                />
                                <div className="flex justify-between text-[10px] font-medium text-blue-400 mt-1">
                                  <span>التردد (f):</span>
                                  <span className="font-mono">{waveFreq2} Hz</span>
                                </div>
                                <input
                                  type="range"
                                  min="0.5"
                                  max="3.0"
                                  step="0.1"
                                  value={waveFreq2}
                                  onChange={(e) => setWaveFreq2(parseFloat(e.target.value))}
                                  className="w-full accent-blue-500 h-1 bg-gray-850"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 pb-1">
                            <div className="flex justify-between text-xs font-bold text-sans">
                              <span>فارق الطور بين السلسلتين (φ)</span>
                              <span className="text-emerald-400 font-mono font-bold">
                                {wavePhaseDiff === 0 && "0° (توافق تام في الطور)"}
                                {wavePhaseDiff === 90 && "90° (إزاحة عمودية متوسطة)"}
                                {wavePhaseDiff === 180 && "180° (تعاكس تام في الطور)"}
                                {wavePhaseDiff !== 0 && wavePhaseDiff !== 90 && wavePhaseDiff !== 180 && `${wavePhaseDiff}°`}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              {[
                                { label: "تداخل بناء (0°)", value: 0 },
                                { label: "إزاحة طور (90°)", value: 90 },
                                { label: "تداخل هدام (180°)", value: 180 }
                              ].map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setWavePhaseDiff(opt.value)}
                                  className={`py-1 rounded text-[9.5px] font-bold ${
                                    wavePhaseDiff === opt.value
                                      ? "bg-indigo-650 text-white shadow-sm border border-indigo-500"
                                      : "bg-gray-800 text-gray-400"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="180"
                              step="15"
                              value={wavePhaseDiff}
                              onChange={(e) => setWavePhaseDiff(parseInt(e.target.value))}
                              className="w-full accent-indigo-500 h-1 bg-gray-800"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 25. Atomic Structure & Isotopes Controls */}
                      {activeLab === "atomic" && (
                        <motion.div
                          key="atomic-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-3.5 font-sans"
                        >
                          <div className="space-y-1 bg-red-950/20 p-2 rounded-xl border border-red-500/10">
                            <div className="flex justify-between text-xs font-bold text-red-400">
                              <span>عدد البروتونات النواتية (⁺p)</span>
                              <span className="font-mono font-bold text-sm">{atomicProtons} (بروتون)</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="6"
                              step="1"
                              value={atomicProtons}
                              onChange={(e) => {
                                const p = parseInt(e.target.value);
                                setAtomicProtons(p);
                                // balance neutrons/electrons loosely for a good default isotope
                                setAtomicElectrons(p);
                                if (p === 1) setAtomicNeutrons(1);
                                else if (p === 2) setAtomicNeutrons(2);
                                else if (p === 3) setAtomicNeutrons(4);
                                else if (p === 4) setAtomicNeutrons(5);
                                else if (p === 5) setAtomicNeutrons(6);
                                else if (p === 6) setAtomicNeutrons(6);
                              }}
                              className="w-full accent-red-500 h-1 cursor-ew-resize bg-gray-800 rounded appearance-none"
                            />
                          </div>

                          <div className="space-y-1 bg-blue-950/20 p-2 rounded-xl border border-blue-500/10">
                            <div className="flex justify-between text-xs font-bold text-blue-400">
                              <span>عدد النيوترونات المستقرة (⁰n)</span>
                              <span className="font-mono font-bold text-sm">{atomicNeutrons} (نيوترون)</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="8"
                              step="1"
                              value={atomicNeutrons}
                              onChange={(e) => setAtomicNeutrons(parseInt(e.target.value))}
                              className="w-full accent-blue-500 h-1 cursor-ew-resize bg-gray-800 rounded appearance-none"
                            />
                          </div>

                          <div className="space-y-1 bg-emerald-950/20 p-2 rounded-xl border border-emerald-500/10">
                            <div className="flex justify-between text-xs font-bold text-emerald-400">
                              <span>عدد الإلكترونات المدارية (⁻e)</span>
                              <span className="font-mono font-bold text-sm">{atomicElectrons} (إلكترون)</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="6"
                              step="1"
                              value={atomicElectrons}
                              onChange={(e) => setAtomicElectrons(parseInt(e.target.value))}
                              className="w-full accent-emerald-500 h-1 cursor-ew-resize bg-gray-800 rounded appearance-none"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 26. Earth's Internal Structure (البنية الداخلية للأرض) */}
                      {activeLab === "geology_earth" && (
                        <motion.div
                          key="geology_earth-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-3.5 font-sans"
                        >
                          <div className="space-y-1 bg-amber-955/20 p-3 rounded-xl border border-amber-500/10">
                            <div className="flex justify-between text-xs font-bold text-amber-400">
                              <span>العمق المخترق في باطن الأرض (d)</span>
                              <span className="font-mono font-bold text-sm">{earthDepth} كم</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="6371"
                              step="50"
                              value={earthDepth}
                              onChange={(e) => setEarthDepth(parseInt(e.target.value))}
                              className="w-full accent-amber-500 h-1 cursor-ew-resize bg-gray-800 rounded appearance-none"
                            />
                            <div className="flex justify-between text-[8.5px] text-gray-400 font-bold mt-1">
                              <span>القشرة (0)</span>
                              <span>الرداء (2900)</span>
                              <span>المركز (6371 كم)</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 27. Plate Tectonics (الصفائح التكتونية) */}
                      {activeLab === "geology_tectonics" && (
                        <motion.div
                          key="geology_tectonics-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-3.5 font-sans"
                        >
                          <div className="space-y-2 bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/10">
                            <label className="text-[10px] font-bold block text-indigo-305 uppercase">نوع الحدود التكتونية</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setPlateMoveType("convergent")}
                                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                                  plateMoveType === "convergent"
                                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/10 border border-rose-500/30"
                                    : "bg-gray-800 hover:bg-gray-700 text-gray-350"
                                }`}
                              >
                                🎯 تقاربية (تصادم وغوص)
                              </button>
                              <button
                                type="button"
                                onClick={() => setPlateMoveType("divergent")}
                                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                                  plateMoveType === "divergent"
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10 border border-emerald-500/30"
                                    : "bg-gray-800 hover:bg-gray-700 text-gray-355"
                                }`}
                              >
                                ↔️ تباعدية (تمدد الظهرات)
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 bg-slate-950/20 p-3 rounded-xl border border-slate-500/10">
                            <div className="flex justify-between text-xs font-bold text-gray-400">
                              <span>سرعة حركة الصفائح تكتونياً</span>
                              <span className="font-mono font-bold text-sm text-amber-400">{plateSpeed} سم/سنة</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="12"
                              step="1"
                              value={plateSpeed}
                              onChange={(e) => setPlateSpeed(parseInt(e.target.value))}
                              className="w-full accent-amber-500 h-1 cursor-ew-resize bg-gray-800 rounded appearance-none"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 28. Photosynthesis Mechanism (التركيب الضوئي) */}
                      {activeLab === "biology_photosynthesis" && (
                        <motion.div
                          key="biology_photosynthesis-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-3.5 font-sans"
                        >
                          <div className="space-y-1 bg-amber-950/20 p-3 rounded-xl border border-amber-500/10">
                            <div className="flex justify-between text-xs font-bold text-amber-400">
                              <span>شدة الإضاءة الضوئية (Lux)</span>
                              <span className="font-mono font-bold text-sm">{photoLight} %</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={photoLight}
                              onChange={(e) => setPhotoLight(parseInt(e.target.value))}
                              className="w-full accent-amber-500 h-1 cursor-ew-resize bg-gray-800 rounded appearance-none"
                            />
                          </div>

                          <div className="space-y-1 bg-sky-950/20 p-3 rounded-xl border border-sky-500/10">
                            <div className="flex justify-between text-xs font-bold text-sky-400">
                              <span>تركيز غاز الكربون CO₂ بالوسط</span>
                              <span className="font-mono font-bold text-sm">{photoCO2} ppm</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1000"
                              step="50"
                              value={photoCO2}
                              onChange={(e) => setPhotoCO2(parseInt(e.target.value))}
                              className="w-full accent-sky-400 h-1 cursor-ew-resize bg-gray-800 rounded appearance-none"
                            />
                          </div>

                          <div className="space-y-1 bg-rose-955/20 p-3 rounded-xl border border-rose-500/10">
                            <div className="flex justify-between text-xs font-bold text-rose-455">
                              <span>درجة الحرارة المخبرية (T)</span>
                              <span className="font-mono font-bold text-sm">{photoTemp} °م</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              step="2"
                              value={photoTemp}
                              onChange={(e) => setPhotoTemp(parseInt(e.target.value))}
                              className="w-full accent-rose-500 h-1 cursor-ew-resize bg-gray-800 rounded appearance-none"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 29. Respiration vs Fermentation (التنفس مقابل التخمر) */}
                      {activeLab === "biology_respiration" && (
                        <motion.div
                          key="biology_respiration-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-3.5 font-sans"
                        >
                          <div className="space-y-2 bg-slate-950/20 p-3 rounded-xl border border-slate-500/10">
                            <label className="text-[10px] font-bold block text-gray-400 uppercase">الوسط الهوائي / اللاهوائي</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setRespOxygenAvailable(true)}
                                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                                  respOxygenAvailable
                                    ? "bg-sky-600 text-white shadow-md border border-sky-500/30"
                                    : "bg-gray-800 hover:bg-gray-700 text-gray-350"
                                }`}
                              >
                                💨 وسط هوائي (+O₂)
                              </button>
                              <button
                                type="button"
                                onClick={() => setRespOxygenAvailable(false)}
                                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                                  !respOxygenAvailable
                                    ? "bg-purple-600 text-white shadow-md border border-purple-500/30"
                                    : "bg-gray-800 hover:bg-gray-700 text-gray-355"
                                }`}
                              >
                                🦠 وسط لاهوائي (خالٍ)
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 bg-amber-955/20 p-3 rounded-xl border border-amber-500/10">
                            <div className="flex justify-between text-xs font-bold text-amber-400">
                              <span>كمية مغذيات سكر الجلكوز</span>
                              <span className="font-mono font-bold text-sm">{respGlucoseAmount} ملغ</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="5"
                              value={respGlucoseAmount}
                              onChange={(e) => setRespGlucoseAmount(parseInt(e.target.value))}
                              className="w-full accent-amber-500 h-1 cursor-ew-resize bg-gray-800 rounded appearance-none"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 30. Cell Differentiation & Growth (التمايا الخلوي) */}
                      {activeLab === "biology_differentiation" && (
                        <motion.div
                          key="biology_differentiation-vars"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="space-y-3.5 font-sans"
                        >
                          <div className="space-y-1 bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/10">
                            <div className="flex justify-between text-xs font-bold text-emerald-400">
                              <span>زمن نمو النبات وتمايزه بالأيام</span>
                              <span className="font-mono font-bold text-sm">{growthTime} أيام</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              step="1"
                              value={growthTime}
                              onChange={(e) => setGrowthTime(parseInt(e.target.value))}
                              className="w-full accent-emerald-500 h-1 cursor-ew-resize bg-gray-800 rounded appearance-none"
                            />
                            <div className="flex justify-between text-[8px] text-gray-400 font-bold mt-1">
                              <span>قالب مرستيمي تقسيم (0د)</span>
                              <span>نمو استطالة (5د)</span>
                              <span>تمايز تام (10د)</span>
                            </div>
                          </div>

                          <div className="space-y-2 bg-slate-950/20 p-3 rounded-xl border border-slate-500/10">
                            <label className="text-[10px] font-bold block text-gray-405 uppercase">الخلية المستهدفة للتمايز</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: "stem", label: "مرستيمية أساس" },
                                { id: "sieve", label: "غربالية (لحاء)" },
                                { id: "xylem", label: "أوعية خشبية" },
                                { id: "hair", label: "أوبار ماصة جذر" }
                              ].map((cell) => (
                                <button
                                  key={cell.id}
                                  type="button"
                                  onClick={() => setDifferentiationType(cell.id as any)}
                                  className={`py-1 text-[10.5px] font-bold rounded-lg transition-all ${
                                    differentiationType === cell.id
                                      ? "bg-emerald-600 text-white shadow"
                                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                                  }`}
                                >
                                  {cell.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Calculations, result analytics section */}
                  <div className={`mt-6 pt-4 border-t ${
                    isDarkMode ? "border-[#1D1E3E] text-white" : "border-slate-100 text-gray-900"
                  }`}>
                    <h4 className="text-[10px] sm:text-[11px] font-extrabold text-indigo-400 uppercase tracking-widest mb-2.5">
                      القيمة والأثر الرياضي للتجربة 📊
                    </h4>

                    <div className="space-y-2">
                      {activeLab === "newton" && (
                        <>
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-indigo-500/5 font-mono">
                            <span className="text-gray-400 font-sans">معادلة نيوتن:</span>
                            <span className="font-extrabold text-xs">a = F / m</span>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-emerald-500/5">
                            <span className="text-gray-450 font-sans">التسارع الناتج (a):</span>
                            <span className="font-bold text-emerald-400 font-mono">
                              {(force / mass).toFixed(2)} م/ث²
                            </span>
                          </div>
                        </>
                      )}

                      {activeLab === "ohm" && (
                        <>
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-indigo-500/5 font-mono">
                            <span className="text-gray-400 font-sans">الصيغة التناسبية:</span>
                            <span className="font-extrabold text-xs">I = V / R</span>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-emerald-500/5">
                            <span className="text-gray-450 font-sans">شدة التيار المار (I):</span>
                            <span className="font-bold text-emerald-400 font-mono text-xs">
                              {current.toFixed(4)} Amperes ({ (current * 1000).toFixed(1) } mA)
                            </span>
                          </div>
                        </>
                      )}

                      {activeLab === "buoyancy" && (
                        <>
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-indigo-500/5">
                            <span className="text-gray-450">التنبؤ الميكانيكي:</span>
                            <span className={`font-extrabold px-2 py-0.5 rounded text-[10px] ${
                              isFloating ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                            }`}>
                              {isFloating ? "المكعب يطفو فوق الماء" : "المكعب يرسب في القاع"}
                            </span>
                          </div>
                        </>
                      )}

                      {activeLab === "refraction" && (
                        <>
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-indigo-500/5 font-mono">
                            <span className="text-gray-450">معادلة سنيل-ديكارت:</span>
                            <span className="font-bold text-[10px]">n₁·sin(θ₁) = n₂·sin(θ₂)</span>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-emerald-500/5">
                            <span className="text-gray-450">زاوية الانكسار θ₂:</span>
                            <span className="font-bold text-emerald-450 font-mono">
                              {refractionAngle.toFixed(1)}° دَرَجَة
                            </span>
                          </div>
                        </>
                      )}

                      {activeLab === "pythagoras" && (
                        <>
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-indigo-500/5 font-mono">
                            <span className="text-gray-450">الصيغة المباشرة:</span>
                            <span className="font-bold">C = √(A² + B²)</span>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-emerald-500/5">
                            <span className="text-gray-450">طول الوتر الناتج C:</span>
                            <span className="font-bold text-emerald-400 font-mono">
                              {hypotenuse.toFixed(2)} سم
                            </span>
                          </div>
                        </>
                      )}

                      {/* 6. Titration calculations display */}
                      {activeLab === "titration" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs p-1.5 rounded-xl bg-[#14152D] font-mono">
                            <span className="text-gray-400 font-sans">قيمة الـ pH الحالية:</span>
                            <span className={`font-bold font-mono px-2 py-0.5 rounded ${
                              titrationPH < 6 
                                ? "text-yellow-400 bg-yellow-400/5" 
                                : titrationPH > 8 
                                  ? "text-blue-400 bg-blue-400/5" 
                                  : "text-emerald-400 bg-emerald-400/5"
                            }`}>{titrationPH}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-indigo-950/20 text-gray-300">
                            <span>نقطة التكافؤ النظرية V_eq:</span>
                            <span className="font-bold font-mono text-indigo-400">{v_equivalence.toFixed(1)} مل</span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-normal">
                            {titrantVolume < v_equivalence 
                              ? "⚠️ المحلول حمضي مائل للاصفرار. التفاعل لم ينته ولم تقترب من توازن النسبة الساخنة." 
                              : titrantVolume === v_equivalence 
                                ? "✨ لقد وصلت لنقطة التكافؤ الاستوكيومترية تماماً! المحلول معتدل أخضر اللون." 
                                : "🔵 المحلول قاعدي فاقد البروتونات مع بهتان كامل وتوهج زجاجي مائي."
                            }
                          </p>
                        </div>
                      )}

                      {/* 7. Pendulum calculations */}
                      {activeLab === "pendulum" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs p-1 rounded bg-[#14152D] font-mono">
                            <span className="text-gray-400 font-sans">قانون الدور الذاتي T₀:</span>
                            <span>T₀ = 2π√(L/g)</span>
                          </div>
                          <div className="flex items-center justify-between text-xs p-1 px-2 rounded bg-emerald-500/5 font-mono">
                            <span className="text-gray-450 font-sans">زمن الذبذبة الواحدة (الدور):</span>
                            <span className="font-bold text-emerald-400 font-mono">
                              { (2 * Math.PI * Math.sqrt(pendulumLength / 9.81)).toFixed(3) } ثانية
                            </span>
                          </div>
                          <p className="text-[9px] text-gray-450">
                            💡 هل لاحظت؟ الكتلة المعلقة لا تدخل مطلقا في حسابات الدور، الجاذبية وطول الخيط هما الضابطان الوحيدان لمطافئ الزمن!
                          </p>
                        </div>
                      )}

                      {/* 8. Ideal gas laws */}
                      {activeLab === "gas" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs p-1.5 rounded-xl bg-[#14152D] font-mono">
                            <span className="text-[#94A3B8] font-sans">الضغط المحسوب P:</span>
                            <span className="font-bold text-indigo-400 font-mono text-sm">{calculatedPressure} Pascal</span>
                          </div>
                          <div className="text-[9px] text-gray-400 font-sans leading-normal">
                            <strong>قانون بويل-ماريوت وغاي-لوساك:</strong> بزيادة درجة الحرارة تكتسب جزيئات الغاز طاقة حركية وتصطدم بالجدران بقوة أكبر مسببة طفرة الضغط.
                          </div>
                        </div>
                      )}

                      {/* 9. Trigo details */}
                      {activeLab === "trigo" && (
                        <div className="grid grid-cols-3 gap-1 pt-1">
                          <div className="text-[10px] p-2 bg-[#14152D] rounded-xl text-center">
                            <span className="text-gray-400 block mb-0.5">COS (θ)</span>
                            <span className="font-bold font-mono text-indigo-400 text-[11px]">{trigoX.toFixed(3)}</span>
                          </div>
                          <div className="text-[10px] p-2 bg-[#14152D] rounded-xl text-center">
                            <span className="text-gray-400 block mb-0.5">SIN (θ)</span>
                            <span className="font-bold font-mono text-emerald-400 text-[11px]">{trigoY.toFixed(3)}</span>
                          </div>
                          <div className="text-[10px] p-2 bg-[#14152D] rounded-xl text-center">
                            <span className="text-gray-400 block mb-0.5">TAN (θ)</span>
                            <span className="font-bold font-mono text-amber-400 text-[11px]">
                              {Math.abs(trigoX) > 0.001 ? (trigoY / trigoX).toFixed(3) : "∞ لا نهائي"}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* 10. Equation balancing details */}
                      {activeLab === "equations" && equationFeedback && (
                        <div className={`p-2.5 rounded-xl text-[10px] sm:text-xs leading-relaxed border ${
                          equationFeedback.isBalanced 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}>
                          {equationFeedback.message}
                        </div>
                      )}

                      {/* 11. Kirchhoff Calculations */}
                      {activeLab === "kirchhoff" && (() => {
                        const r_equivalent = 1 / ((1 / resistanceR1) + (1 / resistanceR2));
                        const i_total = voltageK / r_equivalent;
                        const i_1 = voltageK / resistanceR1;
                        const i_2 = voltageK / resistanceR2;
                        return (
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">المقاومة المكافئة (R_eq T):</span>
                              <span className="font-bold text-amber-400">{r_equivalent.toFixed(2)} أوم</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">التيار الإجمالي (I_total):</span>
                              <span className="font-bold text-indigo-400">{i_total.toFixed(3)} أمبير</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">تيار الفرع الأول R₁ (I₁):</span>
                              <span className="font-bold text-emerald-400">{i_1.toFixed(3)} A</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">تيار الفرع الثاني R₂ (I₂):</span>
                              <span className="font-bold text-emerald-400">{i_2.toFixed(3)} A</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 12. Faraday Calculations */}
                      {activeLab === "faraday" && (() => {
                        // Max EMF at middle pos
                        const proximity = Math.max(0, 1 - Math.abs(magnetPos - 50) / 40);
                        const inducedEMF = proximity * coilLoops * 3.4;
                        return (
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">التدفق المغناطيسي (Φ):</span>
                              <span className="font-bold text-indigo-400">{(proximity * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">القوة المحركة الكهربائية (e):</span>
                              <span className={`font-bold font-mono ${inducedEMF > 1.5 ? "text-amber-400" : "text-gray-400"}`}>
                                {inducedEMF.toFixed(2)} فولت
                              </span>
                            </div>
                            <p className="text-[9px] text-gray-400 leading-normal">
                              💡 قانون فاراداي يعلن أن القوة الكهروحركية المتحرضة تتناسب طردياً مع سرعة التغير وعدد اللفات المتداخلة.
                            </p>
                          </div>
                        );
                      })()}

                      {/* 13. Probability Calculations */}
                      {activeLab === "probability" && (() => {
                        const total = redBalls + blueBalls + greenBalls;
                        const p_red = (redBalls / total) * 100;
                        const p_blue = (blueBalls / total) * 100;
                        const p_green = (greenBalls / total) * 100;
                        return (
                          <div className="space-y-1.5 text-xs text-right">
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] text-[11px]">
                              <span>إجمالي الكريات بالصندوق:</span>
                              <span className="font-bold font-mono text-indigo-400">{total} كريات</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-mono">
                              <div className="p-1 bg-red-500/10 rounded border border-red-500/10">
                                <span className="text-red-400 font-sans block">أحمر</span>
                                {p_red.toFixed(1)}%
                              </div>
                              <div className="p-1 bg-blue-500/10 rounded border border-blue-500/10">
                                <span className="text-blue-400 font-sans block">أزرق</span>
                                {p_blue.toFixed(1)}%
                              </div>
                              <div className="p-1 bg-emerald-500/10 rounded border border-emerald-500/10">
                                <span className="text-emerald-400 font-sans block">أخضر</span>
                                {p_green.toFixed(1)}%
                              </div>
                            </div>
                            {drawnBall ? (
                              <div className={`p-1.5 rounded-xl border text-center text-[10px] mt-1 ${
                                drawnBall === "red" 
                                  ? "bg-red-550/10 border-red-500/20 text-red-400" 
                                  : drawnBall === "blue" 
                                    ? "bg-blue-550/10 border-blue-500/20 text-blue-400" 
                                    : "bg-emerald-555/10 border-emerald-500/20 text-emerald-400"
                              }`}>
                                تم سحب كرة <strong>{drawnBall === "red" ? "حمراء" : drawnBall === "blue" ? "زرقاء" : "خضراء"}</strong> بنجاح!
                              </div>
                            ) : (
                              <p className="text-[10px] text-gray-400 text-center">انقر فوق زر السحب لتأدية التجربة العشوائية.</p>
                            )}
                          </div>
                        );
                      })()}

                      {/* 14. Greenhouse Calculations */}
                      {activeLab === "greenhouse" && (() => {
                        const temp = 14.5 + (co2Level - 280) * 0.015 + (solarRadiation - 1360) * 0.005;
                        const greenFraction = Math.min(95, 30 + (co2Level - 300) * 0.05);
                        return (
                          <div className="space-y-1.5 text-xs font-mono">
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400 font-sans">درجة حرارة الكوكب الكلية:</span>
                              <span className={`font-bold text-sm ${temp > 20 ? "text-red-400" : "text-emerald-400"}`}>
                                {temp.toFixed(2)} °م
                              </span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400 font-sans">حبس الأشعة تحت الحمراء:</span>
                              <span className="font-bold text-orange-400">{greenFraction.toFixed(0)}%</span>
                            </div>
                            <p className="text-[9px] text-gray-400 leading-normal font-sans text-right">
                              ⚠️ ارتفاع الـ CO2 يعوق نفاذ الأشعة الحرارية المرتدة من الكوكب نحو الفضاء، مما يسبب انعكاسها ثانيةً.
                            </p>
                          </div>
                        );
                      })()}

                      {/* 21. Free Fall Calculations */}
                      {activeLab === "freefall" && (() => {
                        const g = 9.81;
                        const tTheoretical = Math.sqrt((2 * freefallHeight) / g);
                        // with air resistance, we increase falling time slightly and reduce speed
                        const factorT = freefallAirResistance ? 1.22 * (1 + freefallMass / 120) : 1.0;
                        const factorV = freefallAirResistance ? 0.78 * (1 - freefallMass / 150) : 1.0;
                        
                        const actualTime = tTheoretical * factorT;
                        const finalSpeed = (g * tTheoretical) * factorV;
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">التسارع المطبق (g):</span>
                              <span className="font-bold text-amber-500">9.81 م/ث² (ثابت الجاذبية)</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">زمن السقوط الفعلي (t):</span>
                              <span className="font-bold text-indigo-400">{actualTime.toFixed(3)} ثانية</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">السرعة النهائية اللحظية (v):</span>
                              <span className="font-bold text-emerald-400">{finalSpeed.toFixed(2)} م/ث</span>
                            </div>
                            <p className="text-[9.5px] text-gray-400 leading-relaxed">
                              💡 {freefallAirResistance 
                                ? "💨 بسبب مقاومة الهواء، تزداد مدة السقوط وتقل سرعة الاصطدام تبعاً لأشكال الأجسام وكتلتها ممانعة للاحتكاك."
                                : "📭 في الفراغ: كتلة الجسم لا تؤثر إطلاقاً على زمن السقوط! الريشة والمطرقة تسقطان معاً بتسارع الجاذبية."
                              }
                            </p>
                          </div>
                        );
                      })()}

                      {/* 22. Stoichiometry Calculations */}
                      {activeLab === "stoichiometry" && (() => {
                        // Define molar masses of substances
                        const masses: Record<string, { name: string; m: number }> = {
                          H2O: { name: "H₂O (الماء)", m: 18.015 },
                          CO2: { name: "CO₂ (ثاني أكسيد الكربون)", m: 44.01 },
                          NaCl: { name: "NaCl (كلوريد الصوديوم)", m: 58.44 },
                          C6H12O6: { name: "C₆H₁₂O₆ (الغلوكوز)", m: 180.16 },
                          Fe: { name: "Fe (الحديد النقي)", m: 55.85 },
                          O2: { name: "O₂ (غاز الأكسجين)", m: 32.00 }
                        };
                        const info = masses[stoichSubstance] || { name: stoichSubstance, m: 1 };
                        const moles = stoichGrams / info.m;
                        const avogadro = 6.022e23;
                        const particles = moles * avogadro;
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">الكتلة المولية الجزيئية (M):</span>
                              <span className="font-bold text-emerald-400">{info.m} غ/مول</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400 font-sans">كمية المادة بالمول (n):</span>
                              <span className="font-extrabold text-indigo-400 text-sm">{moles.toFixed(4)} مول</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">عدد الأفراد الكيميائية (N):</span>
                              <span className="font-bold text-amber-500">{particles.toExponential(3)}</span>
                            </div>
                            <div className="p-1.5 rounded bg-indigo-500/5 text-[9.5px] text-gray-300 leading-normal">
                              قانون حساب كمية المادة هو: <strong>n = m / M</strong>.<br />
                              حيث يُضرب عدد المولات بثابت أفوغادرو (N_A ≈ 6.022 × 10²³) لمعرفة عدد جزيئات أو ذرات العينة الموزونة.
                            </div>
                          </div>
                        );
                      })()}

                      {/* 23. Newton's 3rd Law Calculations */}
                      {activeLab === "newton3" && (() => {
                        const accA = newtonForce / newtonMassA;
                        const accB = newtonForce / newtonMassB;
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">القوة المؤثرة (القدرة/الفعل F_A→B):</span>
                              <span className="font-bold text-red-400">+{newtonForce} N</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">قوة رد الفعل المقابلة (F_B→A):</span>
                              <span className="font-bold text-blue-400">-{newtonForce} N (مساوية ومتعاكسة)</span>
                            </div>
                            <div className="flex items-center justify-between text-xs p-1.5 rounded-xl bg-[#14152D] font-mono">
                              <span className="text-gray-450">تسارع السيارة الحمراء (a₁):</span>
                              <span className="font-bold text-red-400">{accA.toFixed(2)} م/ث²</span>
                            </div>
                            <div className="flex items-center justify-between text-xs p-1.5 rounded-xl bg-[#14152D] font-mono">
                              <span className="text-gray-450">تسارع السيارة الزرقاء (a₂):</span>
                              <span className="font-bold text-blue-400">{accB.toFixed(2)} م/ث²</span>
                            </div>
                            <p className="text-[9.5px] text-gray-400 leading-tight">
                              🤝 قانون نيوتن الثالث (التقابل بالقدرة): لكل فعلٍ رد فعلٍ، مساوٍ له في المقدار ومضادٌ له في الاتجاه (F_action = -F_reaction).
                            </p>
                          </div>
                        );
                      })()}

                      {/* 24. Wave Superposition Calculations */}
                      {activeLab === "waves" && (() => {
                        const phaseRad = (wavePhaseDiff * Math.PI) / 180;
                        // Analytical sum of waves amplitude formula
                        const resultantAmp = Math.sqrt(
                          Math.pow(waveAmp1, 2) + 
                          Math.pow(waveAmp2, 2) + 
                          2 * waveAmp1 * waveAmp2 * Math.cos(phaseRad)
                        );
                        let interferenceType = "تداخل مركب مختلط";
                        if (wavePhaseDiff === 0) interferenceType = "🔴🔵 تداخل بناء تام (تقوية قصوى)";
                        else if (wavePhaseDiff === 180) {
                          interferenceType = waveAmp1 === waveAmp2 
                            ? "🔕 تداخل هدّام تام (صمت كلي / إخماد)" 
                            : "⚠️ تداخل هدّام جزئي (إضعاف السعر)";
                        }
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">قيمة السعة الناتجة المتداخلة:</span>
                              <span className="font-bold text-indigo-400 text-sm">{resultantAmp.toFixed(2)} وحدة</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400 font-sans">طبيعة الظاهرة الحادثة:</span>
                              <span className="font-bold text-emerald-400">{interferenceType}</span>
                            </div>
                            <p className="text-[9.5px] text-gray-400 leading-relaxed font-sans">
                              🌊 يحدث التداخل عندما تلتقي موجتان بنفس الوسط. إذا اتفق الطور φ=0° تتعزز القمم وتكبر السعة، أما إذا تعاكس الطور φ=180° تلغي موجتان بعضهما البعض.
                            </p>
                          </div>
                        );
                      })()}

                      {/* 25. Atomic Structure & Isotopes Calculations */}
                      {activeLab === "atomic" && (() => {
                        const protons = atomicProtons;
                        const neutrons = atomicNeutrons;
                        const electrons = atomicElectrons;
                        const massNumber = protons + neutrons;
                        const netCharge = protons - electrons;
                        
                        // Element labels and stability based on protons + neutrons
                        const elements: Record<number, { sym: string; name: string; desc: string }> = {
                          1: { sym: "H", name: "الهيدروجين", desc: neutrons === 0 ? "طبيعي مستقر" : neutrons === 1 ? "نظير الدوتيريوم المستقر" : "نظير التريتيوم المشع" },
                          2: { sym: "He", name: "الهيليوم", desc: neutrons === 2 ? "هيليوم-4 مستقر وخامل" : "هيليوم خفيف نادر جداً" },
                          3: { sym: "Li", name: "الليثيوم", desc: neutrons >= 3 && neutrons <= 4 ? "قلوية خفيفة مستقرة" : "نظير قلق مشع سريع الانحلال" },
                          4: { sym: "Be", name: "البريليوم", desc: neutrons === 5 ? "بريليوم-9 مستقر" : "معدن ترابي مشع غير مستقر" },
                          5: { sym: "B", name: "البورون", desc: neutrons >= 5 && neutrons <= 6 ? "شبه معدن صلب ذو نظائر مستقرة" : "نظير اصطناعي مشع" },
                          6: { sym: "C", name: "الكربون", desc: neutrons === 6 ? "كربون-12 أساس الحياة الطبيعي" : neutrons === 7 ? "كربون-13 الفعال الرنيني" : "كربون-14 المشع المستخدم للتاريخ" }
                        };
                        
                        const el = elements[protons] || { sym: "?", name: "مجهول", desc: "غير مستقر" };
                        
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="grid grid-cols-2 gap-1.5">
                              <div className="p-1 px-2 rounded-lg bg-[#14152D] text-center">
                                <span className="text-[10px] text-gray-400 block">الرمز الكيميائي</span>
                                <span className="font-extrabold text-red-400 text-lg font-mono">
                                  {el.sym} <span className="text-[10px] text-gray-500 font-normal">({el.name})</span>
                                </span>
                              </div>
                              <div className="p-1 px-2 rounded-lg bg-[#14152D] text-center">
                                <span className="text-[10px] text-gray-400 block">شحنة الأيون الإجمالية</span>
                                <span className={`font-extrabold text-sm font-mono ${netCharge === 0 ? "text-emerald-400" : netCharge > 0 ? "text-rose-455" : "text-blue-455"}`}>
                                  {netCharge === 0 ? "0 (معتدلة كهربائياً)" : netCharge > 0 ? `+${netCharge} (كاتيون ناتج)` : `${netCharge} (أنيون ناتج)`}
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400 font-sans">العدد الكتلي (A = Z + N):</span>
                              <span className="font-bold text-amber-500">{massNumber} u</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400 font-sans">العدد الذري الفردي (Z):</span>
                              <span className="font-bold text-indigo-400">{protons} بروتونات</span>
                            </div>
                            <p className="text-[9.5px] text-gray-300 leading-snug">
                              🧪 النظائر هي ذرات لنفس العنصر الكيميائي تملك نفس العدد الشحني Z وتختلف في عدد النيوترونات N وبالتالي العدد الكتلي A. <span className="text-[#10B981] font-bold">حالة النواة الحالية: {el.desc}</span>
                            </p>
                          </div>
                        );
                      })()}

                      {/* 26. Earth's Internal Structure Calculations */}
                      {activeLab === "geology_earth" && (() => {
                        let layerName = "القشرة الأرضية (Crust)";
                        let state = "صلبة صخرية (سيال / سيما)";
                        let density = 2.7; // g/cm³
                        let temp = 15 + (earthDepth * 15); // geothermal gradient
                        if (temp > 600) temp = 600;
                        let pressure = (earthDepth / 35) * 1.0; // GPa
                        
                        if (earthDepth > 35 && earthDepth <= 2900) {
                          layerName = "الرداء أو الوشاح (Mantle)";
                          state = "لدنة ومطاطية (بريدوتيت)";
                          density = 3.3 + ((earthDepth - 35) / 2865) * 2.2;
                          temp = 600 + ((earthDepth - 35) / 2865) * 2400;
                          pressure = 1 + ((earthDepth - 35) / 2865) * 134;
                        } else if (earthDepth > 2900 && earthDepth <= 5150) {
                          layerName = "النواة الخارجية (Outer Core) 🌋";
                          state = "سائلة مصهورة تماماً (حديد ونيكل)";
                          density = 9.9 + ((earthDepth - 2900) / 2250) * 2.3;
                          temp = 3000 + ((earthDepth - 2900) / 2250) * 2000;
                          pressure = 135 + ((earthDepth - 2900) / 2250) * 195;
                        } else if (earthDepth > 5150) {
                          layerName = "النواة الداخلية أو البذرة (Inner Core) 💎";
                          state = "صلبة جداً بفعل شدة الضغط العالي";
                          density = 12.8 + ((earthDepth - 5150) / 1221) * 0.3;
                          temp = 5000 + ((earthDepth - 5150) / 1221) * 1000;
                          pressure = 330 + ((earthDepth - 5150) / 1221) * 30;
                        }
                        
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/10">
                              <span className="text-[10px] text-gray-400 block">النطاق الجيولوجي الحالي:</span>
                              <span className="font-extrabold text-sm text-amber-400">{layerName}</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400">درجة الحرارة التقديرية (T):</span>
                              <span className="font-bold text-rose-400 font-mono">≈ {Math.round(temp)} °م</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400">الضغط الجيوفيزيائي (P):</span>
                              <span className="font-bold text-indigo-400 font-mono">{pressure.toFixed(1)} GPa (جيجاباسكال)</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400">الكثافة التقديرية (ρ):</span>
                              <span className="font-bold text-teal-400 font-mono">{density.toFixed(2)} غ/سم³</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400">الحالة الفيزيائية:</span>
                              <span className="font-bold text-emerald-400">{state}</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 27. Plate Tectonics Calculations */}
                      {activeLab === "geology_tectonics" && (() => {
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="p-2 rounded-xl bg-[#14152D] border border-indigo-500/10">
                              <span className="text-gray-400 text-[10px] block font-sans">الأثر التكتوني المباشر:</span>
                              <span className="font-extrabold text-sm text-indigo-400">
                                {plateMoveType === "convergent" 
                                  ? "سلاسل التوائية جبيلية وغوص صفائح" 
                                  : "تمدد قاع المحيط وتوسع الظهرة المحيطية"
                                }
                              </span>
                            </div>
                            <p className="text-[9.5px] text-gray-300 leading-snug">
                              {plateMoveType === "convergent"
                                ? "🎯 تقارب الصفائح (التصادم) يضغط صخور القشرة ويسبب الالتواءات وتصدع الفوالق المحدثة للزلازل العنيفة. غوص اللوح المحيطي ذو الكثافة العالية تحت اللوح القاري ينشئ ضغطاً يغذي ثورات البراكين الانفجارية الكثيفة (النمط الانفجاري)."
                                : "↔️ تباعد الصفائح يخفض الضغط على دثار الأرض (الأستينوسفير)، مما يؤدي إلى انصهار جزئي لبريدوتيت الدثار وصعود ماغما بازلتية سائلة تنشئ قشرة محيطية جديدة بالظهرة مع براكين طفحية هادئة."
                              }
                            </p>
                          </div>
                        );
                      })()}

                      {/* 28. Photosynthesis Calculations */}
                      {activeLab === "biology_photosynthesis" && (() => {
                        // Optimal temperature factor (peaking around 28 degrees)
                        const tempDiff = Math.abs(photoTemp - 28);
                        const tempFactor = Math.max(0, 1 - (tempDiff * tempDiff) / 500);
                        const lightFactor = photoLight / 100;
                        const co2Factor = photoCO2 / 1000;
                        
                        const photoRate = 100 * tempFactor * lightFactor * co2Factor;
                        const o2Prod = photoRate * 0.45; // ml O2 / hr
                        const glucoseAmount = photoRate * 0.85; // mg glucose / hr
                        
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400">معدل وتيرة التركيب الضوئي:</span>
                              <span className="font-bold text-emerald-400 font-mono">{photoRate.toFixed(1)} %</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400">إنتاج غاز الأكسجين (O₂):</span>
                              <span className="font-bold text-sky-400 font-mono">{o2Prod.toFixed(1)} مل/ساعة</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400">المادة العضوية المصنعة (Glucose):</span>
                              <span className="font-bold text-amber-500 font-mono">{glucoseAmount.toFixed(1)} ملغ/ساعة</span>
                            </div>
                            <p className="text-[9px] text-gray-400 leading-normal">
                              💡 يتأثر النبض العضوي للنبات بالحرارة كعامل مالي للنشاط الإنزيمي، وشدة الضوء كمحفز للمرحلة الكيموضوئية لدمج الكربون من غاز ثنائي أكسيد الكربون CO₂ ببلورات البلاستيدات الخضراء.
                            </p>
                          </div>
                        );
                      })()}

                      {/* 29. Respiration vs Fermentation Calculations */}
                      {activeLab === "biology_respiration" && (() => {
                        const energyYield = respOxygenAvailable ? 38 : 2; // ATP
                        const efficiency = respOxygenAvailable ? "هدم كلي طبيعي" : "هدم جزئي ضئيل";
                        const energyProduced = respGlucoseAmount * (respOxygenAvailable ? 2.5 : 0.15); // visual ATP joules
                        const gasRelease = respOxygenAvailable 
                          ? "غاز ثنائي أكسيد الكربون CO₂ وبخار الماء"
                          : "غاز CO₂ وكحول الإيثانول مادة عضوية متبقية";
                          
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400">المردود الطاقوي للنواة (ATP):</span>
                              <span className="font-bold text-amber-500">{energyYield} جزيء ATP / جزيء جلوكوز</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400">كفاءة هدم المادة الغذائية:</span>
                              <span className="font-bold text-emerald-400">{efficiency}</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400">الطاقة الحيوية الكلية الناتجة:</span>
                              <span className="font-bold text-indigo-400 font-mono">{energyProduced.toFixed(0)} حزمة ATP</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] text-[10px]">
                              <span className="text-gray-400">الفضلات والمخرجات:</span>
                              <span className="font-bold text-rose-400">{gasRelease}</span>
                            </div>
                            <p className="text-[9px] text-gray-400 leading-relaxed">
                              🔬 تتم عملية الأكسدة تحت غطاء الأوعية التنفسية بفضل الأكسجين هادماً السكر هولامياً، بينما التخمر اللاهوائي يبقي الطاقة كامنة جزئياً في جزيئة الكحول الإيثيلي دون تفكيك تام لروابط السكر.
                            </p>
                          </div>
                        );
                      })()}

                      {/* 30. Cell Differentiation & Growth Calculations */}
                      {activeLab === "biology_differentiation" && (() => {
                        let stateText = "ترميم انقسامات متساوية لزيادة عدد الخلايا القمية";
                        let mainStructure = "جدار سيليلوز سليم مع نواة مركزية نشطة";
                        if (growthTime >= 4 && growthTime <= 7) {
                          stateText = "مرحلة الاستطالة وتطاول جدران الخلايا في الوسط المتعامد";
                          mainStructure = "فجوات عصارية دقيقة تندمج لتشكل فجوة نامية تضغط جدارياً";
                        } else if (growthTime > 7) {
                          stateText = "تميز نمائي تام وبلوغ الخلية تخصصها الدقيق";
                          if (differentiationType === "stem") {
                            mainStructure = "بقيت خلية إنشائية نشطة ذات قدرة على النشوء التجديدي";
                          } else if (differentiationType === "sieve") {
                            mainStructure = "خلايا غربالية مستطيلة فقدت نواتها بالكامل ذات صفائح غربالية";
                          } else if (differentiationType === "xylem") {
                            mainStructure = "أنبوب وعائي خشبي مستمر مغلظ ببروتين الخشبين قاسي وميت";
                          } else if (differentiationType === "hair") {
                            mainStructure = "متطاولة طولياً لتشكيل وبرة ماصة تزيد من سطح التربة الفعال";
                          }
                        }
                        
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                              <span className="text-gray-400 text-[10px] block">المظهر الخلوي التنموي:</span>
                              <span className="font-bold text-sm text-emerald-405">{stateText}</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D]">
                              <span className="text-gray-400">النمط البنيوي للخلية الملاحظ:</span>
                              <span className="font-bold text-indigo-400 text-[10px] sm:text-xs">{mainStructure}</span>
                            </div>
                            <p className="text-[8.5px] text-gray-400 leading-relaxed">
                              🌱 بفضل التمايز والنمو في القمم النامية للجذور والسيقان بمناطق التجديد، يزداد الطول والوزن وتصبح الخلايا المنقسمة خلايا غربالية متخصصة لنقل الغذاء الكامل، أو أوعية ناقلة للماء، أو ماصة لجذره.
                            </p>
                          </div>
                        );
                      })()}

                      {/* 19. Fourier wave Synthesis Calculations */}
                      {activeLab === "fourier" && (() => {
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="p-1.5 rounded-lg bg-[#14152D] text-[10px] space-y-1 leading-normal text-gray-300">
                              <span className="font-bold text-amber-400 font-serif block">التمثيل التحليلي للموجة:</span>
                              {fourierType === "square" ? (
                                <code className="block font-mono text-[9px] text-indigo-400 py-1 bg-black/40 px-1 rounded text-center">
                                  f(t) = (4/π) * Σ [sin(n·ω·t) / n]
                                </code>
                              ) : (
                                <code className="block font-mono text-[9px] text-indigo-400 py-1 bg-black/40 px-1 rounded text-center">
                                  f(t) = (8/π²) * Σ [(-1)^(k) * sin(n·ω·t) / n²]
                                </code>
                              )}
                              <p className="text-[9px] leading-snug">
                                كلما زاد عدد التوافقات (Harmonics)، كلما تقاربت الموجة الجيبية الناتجة مع النموذج الهندسي المطلوب وزال التموج عن الأطراف.
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 20. Projectile Motion Calculations */}
                      {activeLab === "projectile" && (() => {
                        const g = 9.81;
                        const angleRad = (projAngle * Math.PI) / 180;
                        const range = (Math.pow(projSpeed, 2) * Math.sin(2 * angleRad)) / g;
                        const maxHeight = (Math.pow(projSpeed, 2) * Math.pow(Math.sin(angleRad), 2)) / (2 * g);
                        const totalTime = (2 * projSpeed * Math.sin(angleRad)) / g;
                        return (
                          <div className="space-y-1.5 text-xs text-right font-sans">
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">المدى الأفقي الأقصى (R):</span>
                              <span className="font-bold text-amber-400">{range.toFixed(1)} متر</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">ارتفاع الذروة (H_max):</span>
                              <span className="font-bold text-indigo-400">{maxHeight.toFixed(1)} متر</span>
                            </div>
                            <div className="flex justify-between p-1.5 rounded-lg bg-[#14152D] font-mono">
                              <span className="text-gray-400">زمن التحليق الكلي (t_total):</span>
                              <span className="font-bold text-emerald-400">{totalTime.toFixed(2)} ثانية</span>
                            </div>
                            <p className="text-[9px] text-gray-400 leading-tight">
                              المدى الأقصى يحاكي زاوية إطلاق 45° بينما الذروة تتجه للأقصى عند زاوية رمي 90°.
                            </p>
                          </div>
                        );
                      })()}



                    </div>
                  </div>
                </div>

                {/* Interactive Visual Stage containing SVG and active simulators */}
                <div className={`md:col-span-7 h-[380px] sm:h-[420px] rounded-2xl border relative flex flex-col items-center justify-center p-3 select-none overflow-hidden ${
                  isDarkMode ? "bg-[#060714] border-[#1D1E3E]" : "bg-slate-50 border-gray-200"
                }`}>
                  
                  {/* Mode Toggler (Simulation vs Real Gallery) */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1 bg-slate-900/60 dark:bg-[#1B1D3E]/80 backdrop-blur-md p-1 rounded-xl border border-indigo-500/10 z-20">
                    <button
                      onClick={() => setStageMode("simulation")}
                      className={`px-2.5 py-1 text-[10px] sm:text-xs font-extrabold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        stageMode === "simulation"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Gauge className="w-3.5 h-3.5" />
                      <span>محاكاة تفاعلية</span>
                    </button>
                    <button
                      onClick={() => setStageMode("gallery")}
                      className={`px-2.5 py-1 text-[10px] sm:text-xs font-extrabold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        stageMode === "gallery"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>معرض الصور الواقعية ({selectedLabMeta?.gallery?.length || 0})</span>
                    </button>
                  </div>

                  {/* Absolute visual indicator layer */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 p-1 px-2.5 rounded-lg text-[9px] font-bold bg-[#1B1D3E]/70 text-indigo-200 border border-indigo-500/20 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>منظور محاكاة المنهاج الجزائري</span>
                  </div>

                  {stageMode === "gallery" ? (
                    <div className="w-full h-full flex flex-col justify-between p-3 pt-14">
                      {/* Selected Large Image display block */}
                      <div className="flex-1 relative rounded-xl overflow-hidden border border-[#20234E]/40 bg-slate-950/40 flex items-center justify-center">
                        {selectedLabMeta?.gallery && selectedLabMeta.gallery[selectedGalleryIndex] ? (
                          <>
                            <motion.img
                              key={selectedGalleryIndex}
                              src={selectedLabMeta.gallery[selectedGalleryIndex].url}
                              alt={selectedLabMeta.title}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="w-full h-full object-cover rounded-xl"
                              referrerPolicy="no-referrer"
                            />
                            {/* Dark overlay showing caption */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-4 pt-10 text-right">
                              <p className="text-xs sm:text-sm text-yellow-300 font-bold mb-1">
                                التطبيق العلمي الحقيقي:
                              </p>
                              <p className="text-[11px] sm:text-xs text-white leading-relaxed font-medium">
                                {selectedLabMeta.gallery[selectedGalleryIndex].caption}
                              </p>
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">لا توجد صور في المعرض حالياً</span>
                        )}
                      </div>

                      {/* Thumbnails list at the bottom */}
                      <div className="mt-3 flex items-center justify-center gap-2">
                        {selectedLabMeta?.gallery?.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedGalleryIndex(idx)}
                            className={`w-14 h-11 rounded-lg overflow-hidden border transition-all relative cursor-pointer ${
                              selectedGalleryIndex === idx
                                ? "border-indigo-500 scale-105 shadow-md shadow-indigo-600/20 opacity-100"
                                : "border-slate-800 hover:border-indigo-400 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={item.url}
                              alt=""
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {selectedGalleryIndex === idx && (
                              <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Dynamic SVG Workplaces Render */
                    <div className="w-full h-full flex items-center justify-center pt-8">
                    
                    {/* 1. Newton's second standard */}
                    {activeLab === "newton" && (
                      <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                        <div className="p-2 w-full rounded-xl bg-slate-900/30 border border-slate-800/40 text-center flex justify-around items-center">
                          <span className="text-[10px] text-gray-400">التسارع a:</span>
                          <span className="font-mono text-xs text-indigo-400 font-extrabold">{(force / mass).toFixed(2)} m/s²</span>
                        </div>

                        <svg className="w-full h-[180px] overflow-visible" viewBox="0 0 300 150">
                          <line x1="10" y1="120" x2="290" y2="120" stroke="#4F46E5" strokeWidth="2.5" opacity="0.6" strokeDasharray="5 3" />
                          <line x1="280" y1="80" x2="280" y2="120" stroke="#EF4444" strokeWidth="3" />
                          
                          <g transform={`translate(${20 + newtonPosition}, 95)`}>
                            <path d="M-30,0 L0,0 M0,0 L-6,-3 M0,0 L-6,3" stroke="#10B981" strokeWidth="3" />
                            <text x="-15" y="-10" fill="#10B981" className="text-[9px] font-bold font-mono">{force}N</text>
                          </g>

                          <g transform={`translate(${30 + newtonPosition}, 85)`}>
                            <rect x="0" y="-30" width={35 + mass * 3.5} height="30" rx="4" fill="#4F46E5" stroke="#818CF8" strokeWidth="1.5" />
                            <text x={(35 + mass * 3.5)/2} y="-13" textAnchor="middle" fill="white" className="text-[10px] font-bold">{mass} كغ</text>
                            <circle cx="8" cy="5" r="5" fill="#0B0C1E" stroke="#818CF8" className={isNewtonRunning ? "animate-spin" : ""} />
                            <circle cx={27 + mass * 3.5} cy="5" r="5" fill="#0B0C1E" stroke="#818CF8" className={isNewtonRunning ? "animate-spin" : ""} />
                          </g>
                        </svg>
                        <span className="text-[10px] text-gray-400">المتغيرات المستهدفة: F (الدفع)، m (القصور)</span>
                      </div>
                    )}

                    {/* 2. Ohm's law code */}
                    {activeLab === "ohm" && (
                      <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                        <svg className="w-full h-[200px]" viewBox="0 0 300 200">
                          <rect x="40" y="40" width="220" height="120" fill="transparent" stroke="#22254B" strokeWidth="2.5" rx="8" />
                          
                          {/* Battery */}
                          <g transform="translate(45, 100) rotate(90)">
                            <line x1="-15" y1="0" x2="15" y2="0" stroke="#EF4444" strokeWidth="4" />
                            <line x1="-8" y1="6" x2="8" y2="6" stroke="#3B82F6" strokeWidth="2.5" />
                            <text x="-15" y="-12" fill="#E0E2EE" className="text-[8px] font-mono font-bold">{voltage}V</text>
                          </g>

                          {/* Dash animated electron flow */}
                          <rect 
                            x="40" 
                            y="40" 
                            width="220" 
                            height="120" 
                            fill="transparent" 
                            stroke="#10B981" 
                            strokeWidth="2" 
                            strokeDasharray="10 20" 
                            rx="8"
                            className="animate-[dash_3s_linear_infinite]"
                            style={{ animationDuration: `${Math.max(0.1, 4 - current * 10)}s` }}
                          />

                          {/* Bulb */}
                          <g transform="translate(150, 40)">
                            <circle cx="0" cy="0" r="10" fill="#0E1026" stroke="#4F46E5" strokeWidth="1.5" />
                            <circle 
                              cx="0" 
                              cy="-12" 
                              r={Math.min(25, 6 + current * 35)} 
                              fill="#EAB308" 
                              opacity={Math.min(0.8, 0.1 + current * 1.5)} 
                              className="blur-[6px]" 
                            />
                            <circle cx="0" cy="-12" r="10" fill="transparent" stroke="#EAB308" strokeWidth="1.2" />
                            <path d="M-4,-12 Q0,-18 4,-12" stroke="#EAB308" fill="none" />
                          </g>

                          {/* Resistor body */}
                          <g transform="translate(150, 160)">
                            <rect x="-20" y="-8" width="40" height="16" fill="#1C1D3A" stroke="#4F46E5" rx="2" />
                            <text x="0" y="3" textAnchor="middle" fill="#818CF8" className="text-[8px] font-mono">{resistance}Ω</text>
                          </g>
                        </svg>
                        <span className="text-[10px] text-gray-400">تدفق الإلكترونات يرتفع كلما زادت نسبة V/R.</span>
                      </div>
                    )}

                    {/* 3. Buoyancy/Archimedes */}
                    {activeLab === "buoyancy" && (
                      <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                        <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                          {/* Vessel */}
                          <path d="M100,20 L100,150 C100,154 104,158 108,158 L192,158 C196,158 200,154 200,150 L200,20" fill="none" stroke="#4F46E5" strokeWidth="2.5" />
                          {/* Liquid level */}
                          <rect x="102" y="60" width="96" height="96" fill="#3B82F6" opacity="0.3" rx="2" />
                          <line x1="101" y1="60" x2="199" y2="60" stroke="#3B82F6" strokeWidth="2" />

                          {/* Block */}
                          <g transform={`translate(125, ${isFloating ? 60 - 30 * (1 - submergedRatio) : 128})`}>
                            <rect x="0" y="0" width="50" height="30" rx="3" fill="#D97706" stroke="#F59E0B" strokeWidth="1.5" />
                            <text x="25" y="18" textAnchor="middle" fill="white" className="text-[8px] font-bold">ρ={objDensity.toFixed(2)}</text>
                            
                            {/* Vectors arrows */}
                            <path d="M25,15 L25,35 M25,35 L22,31 M25,35 L28,31" stroke="#EF4444" strokeWidth="1.5" /> {/* Gravity icon */}
                            <path d="M25,15 L25,-5 M25,-5 L22,-1 M25,-5 L28,-1" stroke="#10B981" strokeWidth="1.5" /> {/* Buoyant icon */}
                          </g>
                        </svg>
                        <span className="text-[10px] text-gray-400">يتحدد عمق الغرق الخشبي مباشرة بقانون نسب الكثافة للطرفين.</span>
                      </div>
                    )}

                    {/* 4. Refraction light */}
                    {activeLab === "refraction" && (
                      <div className="w-full max-w-[340px]" viewBox="0 0 300 180">
                        <svg className="w-full h-[190px]" viewBox="0 0 280 180">
                          {/* Glass Block lower region */}
                          <rect x="25" y="90" width="230" height="80" fill="#3B82F6" opacity="0.1" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="3 3" />
                          <line x1="15" y1="90" x2="265" y2="90" stroke="#4F46E5" strokeWidth="1.5" />
                          <line x1="140" y1="10" x2="140" y2="170" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />

                          {(() => {
                            const rad = (incidenceAngle * Math.PI) / 180;
                            const length = 70;
                            const inX = 140 - length * Math.sin(rad);
                            const inY = 90 - length * Math.cos(rad);

                            const refrRad = snellTheta2Rad;
                            const outX = 140 + length * Math.sin(refrRad);
                            const outY = 90 + length * Math.cos(refrRad);

                            return (
                              <g>
                                <line x1={inX} y1={inY} x2="140" y2="90" stroke="#EF4444" strokeWidth="2" />
                                <line x1="140" y1="90" x2={outX} y2={outY} stroke="#EF4444" strokeWidth="2" strokeDasharray="2 1" />
                                <circle cx={inX} cy={inY} r="4.5" fill="#EF4444" />
                                
                                {/* Theta arcs */}
                                <path d={`M140,70 A20,20 0 0,0 ${140 - 20 * Math.sin(rad)},${90 - 20 * Math.cos(rad)}`} fill="none" stroke="#F59E0B" strokeWidth="1" />
                                <path d={`M140,110 A20,20 0 0,0 ${140 + 20 * Math.sin(refrRad)},${90 + 20 * Math.cos(refrRad)}`} fill="none" stroke="#10B981" strokeWidth="1" />
                              </g>
                            );
                          })()}
                        </svg>
                        <span className="text-[10px] text-gray-400 block text-center mt-1">يتضح انحراف الشعاع بمروره لوسط ثنائي الكثافة.</span>
                      </div>
                    )}

                    {/* 5. Pythagoras geometry */}
                    {activeLab === "pythagoras" && (
                      <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                        <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                          {(() => {
                            const scale = 9;
                            const termX = 90;
                            const termY = 130;
                            const extX = termX + baseA * scale;
                            const extY = termY - heightB * scale;

                            return (
                              <g>
                                <polygon points={`${termX},${termY} ${extX},${termY} ${termX},${extY}`} fill="rgba(79,70,229,0.1)" stroke="#4F46E5" strokeWidth="2" />
                                <rect x={termX} y={termY - 10} width="10" height="10" fill="none" stroke="#818CF8" strokeWidth="0.8" />
                                
                                <text x={(termX + extX)/2} y={termY + 14} textAnchor="middle" fill="#3B82F6" className="text-[9px] font-bold font-mono">A={baseA}</text>
                                <text x={termX - 14} y={(termY + extY)/2} textAnchor="middle" fill="#EF4444" className="text-[9px] font-bold font-mono">B={heightB}</text>
                                <text x={(termX + extX)/2 + 10} y={(termY+extY)/2 - 8} textAnchor="middle" fill="#10B981" className="text-[9px] font-bold font-mono">C={hypotenuse.toFixed(1)}</text>
                              </g>
                            );
                          })()}
                        </svg>
                      </div>
                    )}

                    {/* 6. Titration (كيمياء ممتعة) */}
                    {activeLab === "titration" && (
                      <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[310px]">
                        <svg className="w-full h-[200px]" viewBox="0 0 300 200">
                          {/* Buret on Top */}
                          <line x1="150" y1="5" x2="150" y2="70" stroke="#94A3B8" strokeWidth="3" />
                          <rect x="146" y="5" width="8" height="55" fill="none" stroke="#94A3B8" strokeWidth="1" />
                          {/* Liquid in Buret */}
                          <rect x="147" y={15 + (titrantVolume / 30) * 40} width="6" height={45 - (titrantVolume / 30) * 40} fill="#EF4444" opacity="0.3" />
                          {/* Stopcock valve */}
                          <circle cx="150" cy="62" r="4.5" fill="#EF4444" />

                          {/* Falling drop (only visible if we have volume added) */}
                          {titrantVolume > 0 && (
                            <circle cx="150" cy="80" r="2" fill="#3B82F6" className="animate-ping" />
                          )}

                          {/* Flask at Bottom */}
                          {/* x coordinates: neck x1=142, neck x2=158, bottom-left=120, bottom-right=180 */}
                          <path d="M142,90 L142,100 L115,150 L185,150 L158,100 L158,90 Z" fill="none" stroke="#4F46E5" strokeWidth="2" />
                          {/* Analyte water within flask */}
                          <path 
                            d="M123,135 L117,148 C117,149 118,149.5 119,149.5 L181,149.5 C182,149.5 183,149 183,148 L177,135 Z" 
                            fill={getTitrationColor()} 
                            transition="fill 0.3s ease"
                          />
                        </svg>
                        <span className="text-[10px] text-gray-400 block text-center">اللون الحالي يمثل الكاشف الهليونثيني أو أزرق البروموتيمول.</span>
                      </div>
                    )}

                    {/* 7. Pendulum (الحركة الاهتزازية) */}
                    {activeLab === "pendulum" && (
                      <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                        <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                          {/* Ceiling board */}
                          <line x1="80" y1="20" x2="220" y2="20" stroke="#4F46E5" strokeWidth="2.5" />
                          
                          {(() => {
                            // pendulumTime drives angle in simple harmonic motion
                            // frequency omega = sqrt(g / length)
                            const omega = Math.sqrt(9.81 / pendulumLength);
                            const currentThetaDeg = pendulumAngle * Math.sin(omega * pendulumTime);
                            const currentThetaRad = (currentThetaDeg * Math.PI) / 180;
                            
                            // Bob coordinate end
                            const hingeX = 150;
                            const hingeY = 20;
                            const scalarLen = 30 + pendulumLength * 28; // scale factor
                            const bobX = hingeX + scalarLen * Math.sin(currentThetaRad);
                            const bobY = hingeY + scalarLen * Math.cos(currentThetaRad);

                            return (
                              <g>
                                {/* String line */}
                                <line x1={hingeX} y1={hingeY} x2={bobX} y2={bobY} stroke="#94A3B8" strokeWidth="1.5" />
                                <circle cx={hingeX} cy={hingeY} r="3" fill="#4F46E5" />

                                {/* Bob ball scale with mass */}
                                <circle cx={bobX} cy={bobY} r={6 + pendulumMass * 4} fill="#EF4444" stroke="#F87171" strokeWidth="1" />
                                
                                {/* Movement trail shadow arc visually */}
                                <path 
                                  d={`M${hingeX - scalarLen * Math.sin((pendulumAngle*Math.PI)/180)}, ${hingeY + scalarLen * Math.cos((pendulumAngle*Math.PI)/180)} Q150,${hingeY+scalarLen+3} ${hingeX + scalarLen * Math.sin((pendulumAngle*Math.PI)/180)}, ${hingeY + scalarLen * Math.cos((pendulumAngle*Math.PI)/180)}`} 
                                  fill="none" 
                                  stroke="#3B82F6" 
                                  opacity="0.15" 
                                  strokeDasharray="2 2"
                                />
                              </g>
                            );
                          })()}
                        </svg>
                        <span className="text-[10px] text-gray-400">تابع مسار الاهتزاز والتبادل التام للطاقتين الكامنة والحركية.</span>
                      </div>
                    )}

                    {/* 8. Ideal Gas Chamber */}
                    {activeLab === "gas" && (
                      <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                        <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                          {/* Chamber Box. Width scales with volume setting */}
                          {/* standard x-range is 70 to 230(width 160). Proportional scale below: */}
                          {(() => {
                            const containerWidth = 100 + (gasVolume / 50) * 120;
                            const startX = 150 - containerWidth / 2;
                            const endX = 150 + containerWidth / 2;

                            return (
                              <g>
                                {/* Outer cylinder */}
                                <rect x={startX} y="30" width={containerWidth} height="120" fill="rgba(30,27,75,0.2)" stroke="#4F46E5" strokeWidth="2.5" rx="3" />
                                
                                {/* Piston seal indicator (acts as end cover) */}
                                <line x1={endX} y1="31" x2={endX} y2="149" stroke="#EF4444" strokeWidth="5" />
                                
                                {/* Bouncing representation atoms circles (static for illustration with heat indicators) */}
                                <circle cx={startX + containerWidth*0.2} cy="60" r="4.5" fill="#EF4444" className={gasTemp > 350 ? "animate-bounce" : ""} />
                                <circle cx={startX + containerWidth*0.45} cy="110" r="4" fill="#3B82F6" />
                                <circle cx={startX + containerWidth*0.7} cy="75" r="5" fill="#EAB308" />
                                <circle cx={startX + containerWidth*0.8} cy="120" r="3.5" fill="#10B981" />
                                <circle cx={startX + containerWidth*0.3} cy="100" r="4" fill="#A855F7" />

                                <text x="150" y="165" textAnchor="middle" fill="#94A3B8" className="text-[10px] font-bold">الحجم الحالي: {gasVolume} لتر</text>
                              </g>
                            );
                          })()}
                        </svg>
                      </div>
                    )}

                    {/* 9. Trigonometric Circle */}
                    {activeLab === "trigo" && (
                      <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                        <svg className="w-full h-[190px]" viewBox="0 0 250 190">
                          {/* Center point at (125, 95). radius = 60 px */}
                          <circle cx="125" cy="95" r="60" fill="none" stroke="#22254B" strokeWidth="1.5" />
                          {/* XY Axes lines */}
                          <line x1="25" y1="95" x2="225" y2="95" stroke="#4F46E5" strokeWidth="1" opacity="0.4" />
                          <line x1="125" y1="10" x2="125" y2="180" stroke="#4F46E5" strokeWidth="1" opacity="0.4" />

                          {(() => {
                            const r = 60;
                            const center_x = 125;
                            const center_y = 95;
                            // in standard SVG coordinates, y is inverted.
                            const destX = center_x + r * trigoX;
                            const destY = center_y - r * trigoY;

                            return (
                              <g>
                                {/* Vector line */}
                                <line x1={center_x} y1={center_y} x2={destX} y2={destY} stroke="#EAB308" strokeWidth="2" />
                                <circle cx={destX} cy={destY} r="4" fill="#EAB308" />

                                {/* Cosine helper projection bar (on X-axis Red) */}
                                <line x1={center_x} y1={center_y} x2={destX} y2={center_y} stroke="#EF4444" strokeWidth="2.5" />
                                
                                {/* Sine projection helper (on Y-axis Blue) */}
                                <line x1={destX} y1={center_y} x2={destX} y2={destY} stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 2" />
                                <line x1={center_x} y1={center_y} x2={center_x} y2={destY} stroke="#3B82F6" strokeWidth="2.5" />

                                {/* Little text helpers */}
                                <text x={center_x + (r*trigoX)/2} y={center_y + 11} fill="#EF4444" textAnchor="middle" className="text-[8px] font-bold font-mono">cos={trigoX.toFixed(2)}</text>
                                <text x={center_x - 30} y={destY + (center_y-destY)/2} fill="#3B82F6" className="text-[8px] font-bold font-mono">sin={trigoY.toFixed(2)}</text>
                              </g>
                            );
                          })()}
                        </svg>
                        <span className="text-[10px] text-gray-400">المحور الأفقي cos (الشعاع الأحمر) والعمودي sin (الأزرق).</span>
                      </div>
                    )}

                    {/* 10. Balancing scale weight */}
                    {activeLab === "equations" && (
                      <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                        <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                          {/* Draw Balancing Scale structure */}
                          <line x1="150" y1="30" x2="150" y2="130" stroke="#4F46E5" strokeWidth="4" />
                          <rect x="130" y="130" width="40" height="15" fill="#1E1B4B" rx="3" />

                          {(() => {
                            // calculate balance difference. Left reactant molecules vs Right products
                            // Balanced is zero tilt. Unbalanced tilt depends on difference.
                            const leftWeight = coefCH4 * 16 + coefO2 * 32;
                            const rightWeight = coefCO2 * 44 + coefH2O * 18;
                            const diff = leftWeight - rightWeight;
                            
                            // Tilt angle in degrees
                            const tiltAngle = Math.max(-20, Math.min(20, diff * 0.15));
                            const rad = (tiltAngle * Math.PI) / 180;

                            const barHalfLength = 80;
                            const leftBowlX = 150 - barHalfLength * Math.cos(rad);
                            const leftBowlY = 40 - barHalfLength * Math.sin(rad);

                            const rightBowlX = 150 + barHalfLength * Math.cos(rad);
                            const rightBowlY = 40 + barHalfLength * Math.sin(rad);

                            return (
                              <g>
                                {/* Oscillating support bar */}
                                <line x1={leftBowlX} y1={leftBowlY} x2={rightBowlX} y2={rightBowlY} stroke="#818CF8" strokeWidth="3" />
                                <circle cx="150" cy="40" r="5" fill="#EAB308" />

                                {/* Left hanging Bowl */}
                                <line x1={leftBowlX} y1={leftBowlY} x2={leftBowlX - 15} y2={leftBowlY + 45} stroke="#94A3B8" strokeWidth="1" />
                                <line x1={leftBowlX} y1={leftBowlY} x2={leftBowlX + 15} y2={leftBowlY + 45} stroke="#94A3B8" strokeWidth="1" />
                                <path d={`M${leftBowlX - 25},${leftBowlY + 45} Q${leftBowlX},${leftBowlY + 60} ${leftBowlX + 25},${leftBowlY + 45} Z`} fill="#1E1B4B" stroke="#4F46E5" />
                                <text x={leftBowlX} y={leftBowlY + 58} textAnchor="middle" fill="white" className="text-[9px] font-bold">المتفاعلات</text>

                                {/* Right hanging Bowl */}
                                <line x1={rightBowlX} y1={rightBowlY} x2={rightBowlX - 15} y2={rightBowlY + 45} stroke="#94A3B8" strokeWidth="1" />
                                <line x1={rightBowlX} y1={rightBowlY} x2={rightBowlX + 15} y2={rightBowlY + 45} stroke="#94A3B8" strokeWidth="1" />
                                <path d={`M${rightBowlX - 25},${rightBowlY + 45} Q${rightBowlX},${rightBowlY + 60} ${rightBowlX + 25},${rightBowlY + 45} Z`} fill="#1E1B4B" stroke="#4F46E5" />
                                <text x={rightBowlX} y={rightBowlY + 58} textAnchor="middle" fill="white" className="text-[9px] font-bold">النواتج</text>
                              </g>
                            );
                          })()}
                        </svg>
                        <span className="text-[10px] text-gray-400">معادلة الاحتراق التام للميثان: CH₄ + O₂ → CO₂ + H₂O.</span>
                      </div>
                    )}

                    {/* 11. Kirchhoff Electrical Circuit Model */}
                    {activeLab === "kirchhoff" && (() => {
                      const r_equiv = 1 / ((1 / resistanceR1) + (1 / resistanceR2));
                      const j_total = voltageK / r_equiv;
                      const j_1 = voltageK / resistanceR1;
                      const j_2 = voltageK / resistanceR2;
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                          <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                            {/* Circuit wires loops */}
                            {/* Main Loop */}
                            <rect x="40" y="40" width="220" height="100" fill="none" stroke="#4B5563" strokeWidth="2.5" rx="4" />
                            {/* Split branch in middle */}
                            <line x1="150" y1="40" x2="150" y2="140" stroke="#4B5563" strokeWidth="2.5" />

                            {/* Generator (left) */}
                            <circle cx="40" cy="90" r="14" fill="#1F2937" stroke="#3B82F6" strokeWidth="2" />
                            <text x="40" y="86" textAnchor="middle" fill="#60A5FA" className="text-[8px] font-bold font-mono">+</text>
                            <text x="40" y="99" textAnchor="middle" fill="#EF4444" className="text-[8px] font-bold font-mono">-</text>
                            <text x="22" y="94" textAnchor="middle" fill="#60A5FA" className="text-[9px] font-bold font-mono">{voltageK}V</text>

                            {/* Resistance 1 (Middle) */}
                            <rect x="135" y="75" width="30" height="18" fill="#1E1B4B" stroke="#F59E0B" strokeWidth="2" rx="2" />
                            <text x="150" y="86" textAnchor="middle" fill="#FBBF24" className="text-[8px] font-bold font-mono">{resistanceR1}Ω</text>
                            <text x="150" y="67" textAnchor="middle" fill="#94A3B8" className="text-[7px]">الفرع R₁</text>

                            {/* Resistance 2 (Right) */}
                            <rect x="245" y="80" width="18" height="30" fill="#1E1B4B" stroke="#10B981" strokeWidth="2" rx="2" />
                            <text x="254" y="98" textAnchor="middle" fill="#34D399" className="text-[8px] font-bold font-mono rotate-90">{resistanceR2}Ω</text>
                            <text x="235" y="70" textAnchor="middle" fill="#94A3B8" className="text-[7px]">الفرع R₂</text>

                            {/* Nodes (Cords of Kirchhoff) */}
                            <circle cx="150" cy="40" r="4.5" fill="#EF4444" />
                            <text x="150" y="32" textAnchor="middle" fill="#F87171" className="text-[7px] font-bold">العقدة أ (A)</text>
                            <circle cx="150" cy="140" r="4.5" fill="#EF4444" />
                            <text x="150" y="152" textAnchor="middle" fill="#F87171" className="text-[7px] font-bold">العقدة ب (B)</text>

                            {/* Scrolling current dots animation simulators */}
                            <path d="M 40 40 L 150 40" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="5,10" className="animate-[dash_4s_linear_infinite]" />
                            <path d="M 150 40 L 150 75" fill="none" stroke="#34D399" strokeWidth="2" strokeDasharray="5,10" className="animate-[dash_6s_linear_infinite]" />
                            <path d="M 150 40 L 260 40 L 260 80" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="5,10" className="animate-[dash_8s_linear_infinite]" />

                            {/* Text current measurements */}
                            <text x="95" y="54" textAnchor="middle" className="text-[7px] fill-amber-300 font-mono">I_tot = {j_total.toFixed(2)}A</text>
                            <text x="180" y="105" textAnchor="middle" className="text-[7px] fill-emerald-300 font-mono">I₁ = {j_1.toFixed(2)}A</text>
                            <text x="210" y="52" textAnchor="middle" className="text-[7px] fill-blue-300 font-mono">I₂ = {j_2.toFixed(2)}A</text>
                          </svg>
                          <span className="text-[10px] text-gray-400">قانون كيرشوف للعقد: التيار الإجمالي = تيار الفرع الأول + تيار الفرع الثاني.</span>
                        </div>
                      );
                    })()}

                    {/* 12. Faraday Electromagnetic induction Visual Stage */}
                    {activeLab === "faraday" && (() => {
                      const proximity = Math.max(0, 1 - Math.abs(magnetPos - 50) / 40);
                      const currentStrength = proximity * coilLoops;
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                          <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                            {/* Connection wires to light bulb */}
                            <path d="M 110 110 L 110 150 L 150 150" fill="none" stroke="#64748B" strokeWidth="2" />
                            <path d="M 190 110 L 190 150 L 150 150" fill="none" stroke="#64748B" strokeWidth="2" />

                            {/* Light Bulb at bottom center */}
                            <circle cx="150" cy="150" r="12" fill={currentStrength > 0.5 ? "rgba(234, 179, 8, 0.25)" : "#334155"} className="transition-all" />
                            <circle cx="150" cy="150" r="8" fill={currentStrength > 0.5 ? `rgba(234, 179, 8, ${0.4 + currentStrength * 0.12})` : "#475569"} className="transition-all" />
                            {currentStrength > 0.5 && (
                              <g>
                                <line x1="150" y1="135" x2="150" y2="128" stroke="#EAB308" strokeWidth="1.5" />
                                <line x1="138" y1="140" x2="132" y2="134" stroke="#EAB308" strokeWidth="1.5" />
                                <line x1="162" y1="140" x2="168" y2="134" stroke="#EAB308" strokeWidth="1.5" />
                              </g>
                            )}
                            <text x="150" y="166" textAnchor="middle" fill="#94A3B8" className="text-[8px]">المصباح المتحرض</text>

                            {/* Solenoid coil loops (centered around x=150) */}
                            {Array.from({ length: coilLoops }).map((_, index) => {
                              const x_pos = 110 + index * (80 / coilLoops);
                              return (
                                <g key={index}>
                                  {/* Back part of ellipse */}
                                  <path d={`M ${x_pos} 70 Q ${x_pos + 10} 60 ${x_pos + 20} 70`} fill="none" stroke="#D97706" strokeWidth="3" />
                                  {/* Front part of ellipse */}
                                  <path d={`M ${x_pos} 70 Q ${x_pos + 10} 115 ${x_pos + 20} 70`} fill="none" stroke="#F59E0B" strokeWidth="3.5" />
                                </g>
                              );
                            })}
                            <text x="150" y="122" textAnchor="middle" fill="#FBBF24" className="text-[8px] font-bold">وشيعة بـ {coilLoops} حلقات</text>

                            {/* Magnetic field lines (flux simulation around magnet position) */}
                            {currentStrength > 0.2 && (
                              <path d={`M ${magnetPos * 2.5 + 10} 70 Q 150 ${50 - currentStrength * 10} ${magnetPos * 2.5 - 50} 70`} fill="none" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
                            )}

                            {/* Slider Magnet representation */}
                            {(() => {
                              const magX = magnetPos * 2.5 + 10; // map meter position to svg range
                              return (
                                <g transform={`translate(${magX - 35}, 55)`}>
                                  {/* Red South pole */}
                                  <rect x="0" y="0" width="35" height="18" fill="#EF4444" rx="1" />
                                  <text x="12" y="12" fill="white" className="text-[9px] font-bold font-mono">S</text>
                                  {/* Blue North pole */}
                                  <rect x="35" y="0" width="35" height="18" fill="#3B82F6" rx="1" />
                                  <text x="52" y="12" fill="white" className="text-[9px] font-bold font-mono">N</text>
                                </g>
                              );
                            })()}
                          </svg>
                          <span className="text-[10px] text-gray-400">حرك المغناطيس للداخل وشاهد توهج المصباح مع تدفق الحقل المغناطيسي.</span>
                        </div>
                      );
                    })()}

                    {/* 13. Probability / Counting Jar Visual Stage */}
                    {activeLab === "probability" && (() => {
                      // deterministic stack coordinates inside the vase to prevent jittery motion
                      const positions = [
                        { x: 132, y: 110 }, { x: 154, y: 115 }, { x: 142, y: 95 }, { x: 164, y: 100 },
                        { x: 122, y: 80 }, { x: 148, y: 82 }, { x: 172, y: 78 }, { x: 135, y: 64 },
                        { x: 158, y: 66 }, { x: 144, y: 50 }, { x: 168, y: 48 }, { x: 126, y: 128 },
                        { x: 146, y: 132 }, { x: 166, y: 126 }, { x: 138, y: 146 }, { x: 158, y: 148 },
                        { x: 120, y: 100 }, { x: 176, y: 105 }, { x: 150, y: 40 }, { x: 145, y: 70 },
                        { x: 130, y: 90 }, { x: 160, y: 92 }, { x: 170, y: 112 }, { x: 130, y: 48 },
                        { x: 140, y: 120 }, { x: 162, y: 122 }, { x: 150, y: 140 }, { x: 136, y: 136 },
                        { x: 148, y: 110 }, { x: 160, y: 105 }
                      ];

                      // assign colors based on total red/blue/green
                      const drawnBallsList: { x: number; y: number; color: string }[] = [];
                      let pIndex = 0;
                      for (let i = 0; i < redBalls; i++) {
                        if (pIndex < positions.length) drawnBallsList.push({ ...positions[pIndex++], color: "#EF4444" });
                      }
                      for (let i = 0; i < blueBalls; i++) {
                        if (pIndex < positions.length) drawnBallsList.push({ ...positions[pIndex++], color: "#3B82F6" });
                      }
                      for (let i = 0; i < greenBalls; i++) {
                        if (pIndex < positions.length) drawnBallsList.push({ ...positions[pIndex++], color: "#10B981" });
                      }

                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                          <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                            {/* Glass Jar container */}
                            {/* Neck */}
                            <rect x="130" y="25" width="40" height="12" fill="rgba(148, 163, 184, 0.15)" stroke="#64748B" strokeWidth="2" />
                            {/* Body */}
                            <path d="M 130 37 Q 100 45 100 80 L 100 140 Q 100 160 120 160 L 180 160 Q 200 160 200 140 L 200 80 Q 200 45 170 37 Z" fill="rgba(203, 213, 225, 0.1)" stroke="#94A3B8" strokeWidth="2" />

                            {/* Stacked Balls inside the glass jar */}
                            {drawnBallsList.map((ball, index) => (
                              <circle key={index} cx={ball.x} cy={ball.y} r="7.5" fill={ball.color} stroke="#1E1B4B" strokeWidth="1" className="transition-all" />
                            ))}

                            {/* Floating Spotlight Highlight drawn ball if it is present! */}
                            {drawnBall && (
                              <g>
                                <line x1="150" y1="20" x2="250" y2="40" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
                                <circle cx="250" cy="40" r="14" fill="#1E2937" stroke="#F59E0B" strokeWidth="2" className="animate-bounce" />
                                <circle cx="250" cy="40" r="9" fill={drawnBall === "red" ? "#EF4444" : drawnBall === "blue" ? "#3B82F6" : "#10B981"} />
                                <text x="250" y="65" textAnchor="middle" fill="#FBBF24" className="text-[8px] font-bold">المنتج المسحوب</text>
                              </g>
                            )}
                          </svg>
                          <span className="text-[10px] text-gray-400">وعاء الاحتمالات يحتوي على كرات متماسكة ملونة تسحب بنسب تكرارية.</span>
                        </div>
                      );
                    })()}

                    {/* 14. Greenhouse Effect Atmospheric Visual Stage */}
                    {activeLab === "greenhouse" && (() => {
                      const temp = 14.5 + (co2Level - 280) * 0.015 + (solarRadiation - 1360) * 0.005;
                      const isHot = temp > 20;
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                          <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                            {/* The Planet Earth (Bottom) */}
                            <path d="M 40 160 Q 150 100 260 160 Z" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="2" />
                            {/* Forests/Green continents of Earth */}
                            <path d="M 80 145 Q 120 120 165 137 Z" fill="#047857" />
                            <path d="M 190 142 Q 220 125 240 148 Z" fill="#047857" />

                            {/* Greenhouse Atmosphere dome boundary */}
                            <path d="M 30 160 Q 150 70 270 160" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" />
                            <text x="150" y="80" textAnchor="middle" fill="#60A5FA" className="text-[7px]">الغلاف الجوي الطبيعي</text>

                            {/* CO2 gas molecules floating around if co2Level is high */}
                            {co2Level > 500 && (
                              <g>
                                <circle cx="80" cy="90" r="3" fill="#94A3B8" /> <text x="80" y="86" fill="#CBD5E1" className="text-[5px]">CO₂</text>
                                <circle cx="210" cy="100" r="3" fill="#94A3B8" /> <text x="210" y="96" fill="#CBD5E1" className="text-[5px]">CO₂</text>
                                <circle cx="160" cy="72" r="3" fill="#94A3B8" /> <text x="160" y="68" fill="#CBD5E1" className="text-[5px]">CO₂</text>
                              </g>
                            )}

                            {/* Solar rays entering */}
                            <line x1="260" y1="20" x2="160" y2="120" stroke="#F59E0B" strokeWidth="2" />
                            <circle cx="260" cy="20" r="6" fill="#EF4444" />
                            <text x="260" y="32" textAnchor="middle" fill="#EF4444" className="text-[6px] font-bold">الشمس</text>

                            {/* Outgoing rays trapped / bouncing back */}
                            {co2Level < 600 ? (
                              // Pass free
                              <line x1="160" y1="120" x2="70" y2="40" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 2" />
                            ) : (
                              // Bounce and trap
                              <g>
                                <line x1="160" y1="120" x2="110" y2="90" stroke="#F43F5E" strokeWidth="1.8" />
                                <line x1="110" y1="90" x2="150" y2="135" stroke="#F43F5E" strokeWidth="1.8" />
                                <text x="90" y="105" fill="#EF4444" className="text-[8px] font-bold font-mono">طاقة محبوسة</text>
                              </g>
                            )}

                            {/* Interactive Thermometer (Right) */}
                            <rect x="275" y="40" width="10" height="100" fill="#1F2937" rx="3" stroke="#475569" />
                            {/* Hot red fluid inside */}
                            {(() => {
                              const heightFluid = Math.max(10, Math.min(85, (temp - 10) * 4));
                              return (
                                <rect x="277" y={140 - heightFluid} width="6" height={heightFluid} fill="#EF4444" rx="2" className="transition-all" />
                              );
                            })()}
                            <text x="280" y="32" textAnchor="middle" fill="#EF4444" className="text-[8px] font-bold font-mono">{temp.toFixed(0)}°C</text>
                          </svg>
                          <span className="text-[10px] text-gray-400">تراص ذرات الكربون يمنع موجات الأشعة تحت الحمراء من مغادرة كوكبنا.</span>
                        </div>
                      );
                    })()}

                    {/* 15. Lens optical bench Visual Stage */}
                    {activeLab === "lens" && (() => {
                      // calculations for representation coordinates
                      const candleX = 130 - (lensDistance * 2.8);
                      const fPrime = lensFocal;
                      const diff = (1 / lensFocal) - (1 / lensDistance);
                      const isReal = diff > 0;
                      const imageDistance = isReal ? (1 / diff) : 0;
                      const imageX = 130 + (imageDistance * 2.8);
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                          <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                            {/* Horizontal bench axis line */}
                            <line x1="20" y1="90" x2="280" y2="90" stroke="#64748B" strokeWidth="1.5" strokeDasharray="5 3" />
                            <text x="274" y="85" fill="#64748B" className="text-[7px]">محور بصري</text>

                            {/* Lens in the center at x=130 */}
                            <line x1="130" y1="30" x2="130" y2="150" stroke="#60A5FA" strokeWidth="3" />
                            {/* Convex arrows tip */}
                            <path d="M 125 38 L 130 30 L 135 38" fill="none" stroke="#60A5FA" strokeWidth="2.5" />
                            <path d="M 125 142 L 130 150 L 135 142" fill="none" stroke="#60A5FA" strokeWidth="2.5" />
                            <text x="130" y="24" textAnchor="middle" fill="#60A5FA" className="text-[8px] font-bold">عدسة محدبة L</text>

                            {/* Focal points F and F' */}
                            <circle cx={130 - (fPrime * 2.8)} cy="90" r="3" fill="#EF4444" />
                            <text x={130 - (fPrime * 2.8)} y="104" textAnchor="middle" fill="#EF4444" className="text-[7px] font-bold">المحرقة F</text>

                            <circle cx={130 + (fPrime * 2.8)} cy="90" r="3" fill="#EF4444" />
                            <text x={130 + (fPrime * 2.8)} y="104" textAnchor="middle" fill="#EF4444" className="text-[7px] font-bold">البؤرة F'</text>

                            {/* Original body Candle on the left */}
                            <g transform={`translate(${candleX - 4}, 50)`}>
                              {/* Candle body */}
                              <rect x="0" y="15" width="8" height="25" fill="#E2E8F0" rx="1" />
                              {/* Wick */}
                              <line x1="4" y1="15" x2="4" y2="10" stroke="#F59E0B" strokeWidth="1.5" />
                              {/* Animated flame */}
                              <path d="M 4 10 C 2 7 2 3 4 0 C 6 3 6 7 4 10 Z" fill="#EF4444" className="animate-pulse" />
                              <text x="4" y="48" textAnchor="middle" fill="#CBD5E1" className="text-[7px]">الجسم AB</text>
                            </g>

                            {/* Light rays drawing */}
                            <g>
                              {/* Parallel ray passing then refracting through F' */}
                              <line x1={candleX} y1="65" x2="130" y2="65" stroke="#FBBF24" strokeWidth="1.2" />
                              {isReal && (
                                <line x1="130" y1="65" x2={imageX} y2={90 + (imageDistance / lensDistance) * 25} stroke="#FBBF24" strokeWidth="1.2" />
                              )}
                              {/* Ray passing through optical center O undeflected */}
                              <line x1={candleX} y1="65" x2="130" y2="90" stroke="#EF4444" strokeWidth="1" />
                              {isReal && (
                                <line x1="130" y1="90" x2={imageX} y2={90 + (imageDistance / lensDistance) * 25} stroke="#EF4444" strokeWidth="1" />
                              )}
                            </g>

                            {/* Inverted candle image on the screen (Real output) */}
                            {isReal && (
                              <g transform={`translate(${imageX - 4}, 90)`} className="origin-top scale-y-[-1]">
                                {/* Candle body */}
                                <rect x="0" y="15" width="8" height="25" fill="rgba(226, 232, 240, 0.4)" rx="1" />
                                {/* Wick */}
                                <line x1="4" y1="15" x2="4" y2="10" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.5" />
                                {/* Flame */}
                                <path d="M 4 10 C 2 7 2 3 4 0 C 6 3 6 7 4 10 Z" fill="rgba(239, 68, 68, 0.4)" />
                                <text x="4" y="48" textAnchor="middle" fill="#EF4444" className="text-[7px] font-bold origin-center scale-y-[-1] translate-y-[-40px]">الصورة A'B'</text>
                              </g>
                            )}
                          </svg>
                          <span className="text-[10px] text-gray-400">تكون الصور الحقيقية والمقلوبة للجسم AB وفقاً لمسافات العدسة المحدبة.</span>
                        </div>
                      );
                    })()}

                    {/* 16. Radioactive Decay / Half life Visual Stage */}
                    {activeLab === "decay" && (() => {
                      const n0 = 1000;
                      const lambda = Math.log(2) / halfLifePeriod;
                      const nt = n0 * Math.exp(-lambda * elapsedTimeDecay);
                      const fractionLeft = nt / n0; // 0.0 to 1.0
                      
                      // Draw 30 sample atom dots in a neat grid. Each dot turns green if its index corresponds to decayed ratio.
                      const totalDots = 30;
                      const dotsLeft = Math.round(fractionLeft * totalDots);
                      
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                          <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                            {/* Plot background grid */}
                            <line x1="160" y1="30" x2="160" y2="150" stroke="#1E2937" strokeWidth="1" />
                            <line x1="160" y1="150" x2="280" y2="150" stroke="#374151" strokeWidth="1.5" />
                            <line x1="160" y1="30" x2="160" y2="150" stroke="#374151" strokeWidth="1.5" />
                            
                            {/* Exponential Decay Graph curve (on the right half of stage) */}
                            {(() => {
                              const points = [];
                              for (let sx = 0; sx <= 110; sx++) {
                                // map sx to time limit
                                const dummyTime = (sx / 110) * 60;
                                const dummyNT = 120 * Math.exp(- (Math.log(2) / halfLifePeriod) * dummyTime);
                                points.push(`${160 + sx},${150 - dummyNT}`);
                              }
                              return (
                                <g>
                                  <path d={`M ${points.join(" L ")}`} fill="none" stroke="#F59E0B" strokeWidth="2" />
                                  {/* Current status dot marker on graph */}
                                  <circle cx={160 + (elapsedTimeDecay / 60) * 110} cy={150 - (120 * Math.exp(-lambda * elapsedTimeDecay))} r="4" fill="#EF4444" className="animate-ping" />
                                  <circle cx={160 + (elapsedTimeDecay / 60) * 110} cy={150 - (120 * Math.exp(-lambda * elapsedTimeDecay))} r="3" fill="#EF4444" />
                                </g>
                              );
                            })()}
                            <text x="160" y="24" fill="#94A3B8" className="text-[7px]">منحنى التضاؤل الأسي (t)</text>
                            
                            {/* Beaker with radioactive sample grid (on the left half) */}
                            <rect x="25" y="40" width="110" height="110" fill="rgba(30, 41, 59, 0.2)" stroke="#475569" strokeWidth="2" rx="6" />
                            <text x="80" y="32" textAnchor="middle" fill="#CBD5E1" className="text-[8px] font-bold">العينة المجهرية (أسر كيميائي)</text>
                            
                            {/* Grid of unstable/stable isotopes */}
                            {Array.from({ length: totalDots }).map((_, idx) => {
                              const x_col = idx % 5;
                              const y_row = Math.floor(idx / 5);
                              const x_pos = 40 + x_col * 20;
                              const y_pos = 55 + y_row * 16;
                              const isUnstable = idx < dotsLeft;
                              return (
                                <g key={idx}>
                                  <circle 
                                    cx={x_pos} 
                                    cy={y_pos} 
                                    r="5.5" 
                                    fill={isUnstable ? "#EF4444" : "#10B981"} 
                                    stroke="#1E1B4B" 
                                    strokeWidth="1" 
                                    className="transition-colors duration-500" 
                                  />
                                  {isUnstable && (
                                    <circle cx={x_pos} cy={y_pos} r="2.5" fill="white" opacity="0.6" />
                                  )}
                                </g>
                              );
                            })}
                            <text x="80" y="145" textAnchor="middle" fill="#94A3B8" className="text-[7px]">
                              ● أحمر: غير مستقر | ● أخضر: مستقر (بنت)
                            </text>
                          </svg>
                          <span className="text-[10px] text-gray-400">تابع تناقص نشاطية الأنوية المشعة وجدول نصف العمر تلقائياً مع الزمن.</span>
                        </div>
                      );
                    })()}

                    {/* 17. Spring Hooke Oscillator Visual Stage */}
                    {activeLab === "spring" && (() => {
                      const massKg = springMass / 1000;
                      const staticForce = massKg * 9.8;
                      const elongationCm = (staticForce / springK) * 100;
                      
                      // Scale spring stretch
                      const springStretch = Math.min(85, 30 + elongationCm * 1.8);
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                          <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                            {/* Ruler metric on the left */}
                            <line x1="45" y1="20" x2="45" y2="160" stroke="#4B5563" strokeWidth="1.5" />
                            {Array.from({ length: 15 }).map((_, idx) => {
                              const y = 20 + idx * 10;
                              return (
                                <g key={idx}>
                                  <line x1="40" y1={y} x2="45" y2={y} stroke="#4B5563" strokeWidth="1" />
                                  {idx % 5 === 0 && (
                                    <text x="32" y={y + 3} fill="#64748B" className="text-[7px] font-mono">{idx}cm</text>
                                  )}
                                </g>
                              );
                            })}

                            {/* Ceiling Support (Top) */}
                            <rect x="110" y="15" width="80" height="7" fill="#374151" rx="1.5" />
                            <line x1="150" y1="22" x2="150" y2="30" stroke="#4B5563" strokeWidth="1.5" />

                            {/* Dynamic Spring rendering */}
                            {(() => {
                              const folds = 12;
                              const startY = 30;
                              const stepY = springStretch / folds;
                              const points = [`150,${startY}`];
                              for (let i = 0; i < folds; i++) {
                                const y = startY + i * stepY + stepY / 2;
                                const x = i % 2 === 0 ? 140 : 160;
                                points.push(`${x},${y}`);
                              }
                              points.push(`150,${startY + springStretch}`);
                              return (
                                <path 
                                  d={`M ${points.join(" L ")}`} 
                                  fill="none" 
                                  stroke="#94A3B8" 
                                  strokeWidth="2.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  className="transition-all duration-300"
                                />
                              );
                            })()}

                            {/* Hanging Weight Mass Block */}
                            <g transform={`translate(132, ${30 + springStretch})`} className="transition-all duration-300">
                              <rect x="0" y="0" width="36" height="28" fill="#4338CA" stroke="#818CF8" strokeWidth="1.5" rx="3" />
                              <text x="18" y="18" textAnchor="middle" fill="#FFFFFF" className="text-[8px] font-bold font-mono">{springMass}g</text>
                            </g>

                            {/* Equilibrium / Stretch Indicator arrow */}
                            <g transform={`translate(200, 30)`}>
                              <line x1="0" y1="0" x2="0" y2={springStretch} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
                              <path d={`M -3 ${springStretch - 6} L 0 ${springStretch} L 3 ${springStretch - 6}`} fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                              <text x="10" y={springStretch / 2 + 3} fill="#F59E0B" className="text-[7px] font-bold">الاستطالة Δx</text>
                            </g>
                          </svg>
                          <span className="text-[10px] text-gray-400">تغير استطالة النابض طردياً مع ثقل الكتلة المعلقة مسببة توتر مرن متزن.</span>
                        </div>
                      );
                    })()}

                    {/* 18. Water Electrolysis Visual Stage */}
                    {activeLab === "electrolysis" && (() => {
                      const seconds = electrolysisTime * 60;
                      const charge = electrolysisCurrent * seconds;
                      const molesH2 = (charge / 96485) / 2;
                      const volH2 = molesH2 * 22400; // mL
                      
                      // Max output representation scaling (limit to visual container)
                      const scaleH2 = Math.min(65, volH2 * 0.08); 
                      const scaleO2 = scaleH2 / 2;
                      
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                          <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                            {/* Water Beaker Container */}
                            <path d="M 80 40 L 80 150 Q 80 160 90 160 L 210 160 Q 220 160 220 150 L 220 40 Z" fill="rgba(59, 130, 246, 0.15)" stroke="#64748B" strokeWidth="2.5" />
                            {/* Water level index */}
                            <line x1="82" y1="60" x2="218" y2="60" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />

                            {/* Left Electrode - Cathode (حامل غاز الهيدروجين) */}
                            <rect x="110" y="80" width="12" height="70" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
                            {/* Left Tube over cathode */}
                            <rect x="104" y="45" width="24" height="100" fill="rgba(255, 255, 255, 0.05)" stroke="#64748B" strokeWidth="1" rx="2" />
                            {/* Water inside Left tube (pushed down by scaleH2) */}
                            <rect x="105" y={46 + scaleH2} width="22" height={98 - scaleH2} fill="rgba(59, 130, 246, 0.25)" />
                            <text x="116" y={40 + scaleH2 / 2 + 5} textAnchor="middle" fill="#60A5FA" className="text-[7.5px] font-bold font-mono">H₂</text>

                            {/* Right Electrode - Anode (حامل غاز الأكسجين) */}
                            <rect x="178" y="80" width="12" height="70" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
                            {/* Right Tube over anode */}
                            <rect x="172" y="45" width="24" height="100" fill="rgba(255, 255, 255, 0.05)" stroke="#64748B" strokeWidth="1" rx="2" />
                            {/* Water inside Right tube (pushed down by scaleO2) */}
                            <rect x="173" y={46 + scaleO2} width="22" height={98 - scaleO2} fill="rgba(59, 130, 246, 0.25)" />
                            <text x="184" y={40 + scaleO2 / 2 + 5} textAnchor="middle" fill="#34D399" className="text-[7.5px] font-bold font-mono">O₂</text>

                            {/* Electrical source (DC Battery symbol bottom center) */}
                            <rect x="125" y="152" width="50" height="18" fill="#1E2937" stroke="#4B5563" strokeWidth="1.5" rx="3" />
                            <text x="150" y="164" textAnchor="middle" fill="#CBD5E1" className="text-[8px] font-mono">تغذية DC</text>
                            
                            {/* Electrical wires */}
                            <path d="M 116 150 L 116 154 L 125 154" fill="none" stroke="#EF4444" strokeWidth="1.5" />
                            <path d="M 184 150 L 184 154 L 175 154" fill="none" stroke="#3B82F6" strokeWidth="1.5" />

                            {/* Bubbles ascending representation inside both tubes */}
                            {Array.from({ length: 4 }).map((_, idx) => (
                              <g key={idx} className="animate-pulse">
                                {/* H2 Bubbles (more intensive) */}
                                <circle cx="112" cy={120 - idx * 18} r="2.5" fill="#93C5FD" opacity="0.8" />
                                <circle cx="118" cy={110 - idx * 15} r="2" fill="#93C5FD" opacity="0.8" />
                                {/* O2 Bubbles */}
                                <circle cx="184" cy={125 - idx * 22} r="2" fill="#A7F3D0" opacity="0.7" />
                              </g>
                            ))}
                          </svg>
                          <span className="text-[10px] text-gray-400">ينطلق عند المهبط غاز H₂ وعند المصعد غاز O₂ بضعف الحجم كيميائياً.</span>
                        </div>
                      );
                    })()}

                    {/* 19. Fourier Waves Synthesis Visual Stage */}
                    {activeLab === "fourier" && (() => {
                      // Generate points for the plotting wave
                      const graphWidth = 240;
                      const graphHeight = 120;
                      const points = [];
                      
                      for (let sx = 0; sx <= graphWidth; sx++) {
                        const theta = (sx / graphWidth) * Math.PI * 4; // 2 full waves
                        let compositeY = 0;
                        for (let h = 1; h <= fourierTerms; h++) {
                          const k = fourierType === "square" ? (2 * h - 1) : h;
                          if (fourierType === "square") {
                            compositeY += Math.sin(theta * k) / k;
                          } else {
                            // triangle
                            const sign = h % 2 === 0 ? 1 : -1;
                            compositeY += sign * Math.sin(theta * k) / Math.pow(k, 2);
                          }
                        }
                        
                        // Map mathematical value to box dimensions
                        const scaleY = fourierType === "square" ? 38 : 50;
                        const finalY = 90 - compositeY * scaleY;
                        points.push(`${30 + sx},${finalY}`);
                      }
                      
                      const plotPath = "M " + points.join(" L ");
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                          <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                            {/* Plot Axis frame */}
                            <line x1="25" y1="90" x2="275" y2="90" stroke="#374151" strokeWidth="1.5" />
                            <line x1="30" y1="30" x2="30" y2="150" stroke="#374151" strokeWidth="1" />
                            <text x="274" y="85" fill="#4B5563" className="text-[7px]">الزمن t</text>
                            
                            {/* Gridlines */}
                            <line x1="30" y1="40" x2="270" y2="40" stroke="#1F2937" strokeWidth="1" strokeDasharray="3 3" />
                            <line x1="30" y1="140" x2="270" y2="140" stroke="#1F2937" strokeWidth="1" strokeDasharray="3 3" />

                            {/* Perfect Math reconstructed wave plotted */}
                            <path d={plotPath} fill="none" stroke="#6366F1" strokeWidth="2.5" className="transition-all duration-300" />
                            
                            {/* Text indicators */}
                            <text x="150" y="24" textAnchor="middle" fill="#818CF8" className="text-[8px] font-bold">إشارة توافقية مركبة لـ فورييه</text>
                          </svg>
                          <span className="text-[10px] text-gray-400">تراكب الجيوب الجيبية النقية (Harmonics) يقترب تدريجياً لنمذجة إشارة دورية دقيقة.</span>
                        </div>
                      );
                    })()}

                    {/* 20. Projectile Motion Mechanics Visual Stage */}
                    {activeLab === "projectile" && (() => {
                      const g = 9.81;
                      const angleRad = (projAngle * Math.PI) / 180;
                      const v0 = projSpeed;
                      const range = (Math.pow(v0, 2) * Math.sin(2 * angleRad)) / g;
                      const maxHeight = (Math.pow(v0, 2) * Math.pow(Math.sin(angleRad), 2)) / (2 * g);
                      
                      // map dimensions to screen coordinate scale (max 240px wide, max 100px tall)
                      const maxScaledR = Math.max(40, Math.min(235, range * 3));
                      const maxScaledH = Math.max(10, Math.min(95, maxHeight * 3.5));
                      
                      // Bezier path representing projectile parabola
                      const startX = 30;
                      const startY = 140;
                      const peakX = startX + maxScaledR / 2;
                      const peakY = startY - maxScaledH;
                      const endX = startX + maxScaledR;
                      
                      // Quad Bezier controls: M x0,y0 Q controlX,controlY x1,y1
                      const bezierControlX = peakX;
                      const bezierControlY = startY - maxScaledH * 2;
                      
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px]">
                          <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                            {/* Ground Line */}
                            <line x1="20" y1="140" x2="280" y2="140" stroke="#4B5563" strokeWidth="2" />
                            
                            {/* Ballistic Launcher Muzzle (Cannon) on the left */}
                            <g transform={`translate(${startX}, ${startY}) rotate(${-projAngle})`}>
                              <rect x="-8" y="-4" width="22" height="8" fill="#4B5563" stroke="#94A3B8" strokeWidth="1" rx="1.5" />
                              <circle cx="0" cy="0" r="5.5" fill="#1F2937" stroke="#4B5563" />
                            </g>

                            {/* Projectile Parabola path */}
                            <path 
                              d={`M ${startX},${startY} Q ${bezierControlX},${bezierControlY} ${endX},${startY}`} 
                              fill="none" 
                              stroke="#F59E0B" 
                              strokeWidth="2" 
                              strokeDasharray="4 2" 
                              className="transition-all duration-300"
                            />

                            {/* Peak height indicator */}
                            <line x1={peakX} y1={startY} x2={peakX} y2={peakY} stroke="#10B981" strokeWidth="1" strokeDasharray="2 1" />
                            <circle cx={peakX} cy={peakY} r="3.5" fill="#10B981" />
                            <text x={peakX + 6} y={peakY - 4} fill="#10B981" className="text-[7px] font-bold">الذروة H = {maxHeight.toFixed(1)}m</text>

                            {/* Landing target mark */}
                            <circle cx={endX} cy={startY} r="3" fill="#EF4444" />
                            <text x={endX} y={startY + 12} textAnchor="middle" fill="#EF4444" className="text-[7.5px] font-bold">المدى = {range.toFixed(1)}m</text>
                            
                            {/* Launch Parameters metadata tags */}
                            <text x="35" y="30" fill="#94A3B8" className="text-[7px]">السرعة الابتدائية v₀ = {v0}m/s</text>
                            <text x="35" y="40" fill="#94A3B8" className="text-[7px]">زاوية الإطلاق θ = {projAngle}°</text>
                          </svg>
                          <span className="text-[10px] text-gray-400">حركة القذيفة تتناسب بالدقة التامة مع قانون زاوية الرمي وقوة الجاذبية.</span>
                        </div>
                      );
                    })()}

                    {/* 21. Free Fall Visualizer */}
                    {activeLab === "freefall" && (() => {
                      const tTheo = Math.sqrt((2 * freefallHeight) / 9.81);
                      // scale air resistance slower factor
                      const duration = freefallAirResistance ? tTheo * 1.25 : tTheo;
                      
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px] font-sans">
                          <svg className="w-full h-[180px] bg-slate-950/40 rounded-xl border border-indigo-500/5" viewBox="0 0 300 180">
                            {/* Height scale/Ruler on the left */}
                            <line x1="40" y1="20" x2="40" y2="150" stroke="#4B5563" strokeWidth="2" />
                            {[0, 25, 50, 75, 100].map((hVal) => {
                              const y = 150 - (hVal / 100) * 130;
                              return (
                                <g key={hVal}>
                                  <line x1="36" y1={y} x2="44" y2={y} stroke="#4B5563" strokeWidth="1.5" />
                                  <text x="24" y={y + 3} textAnchor="middle" fill="#6B7280" className="text-[7px] font-mono">{hVal}m</text>
                                </g>
                              );
                            })}

                            {/* Clouds in background representing atmosphere/air resistance */}
                            {freefallAirResistance && (
                              <g opacity="0.35" className="animate-pulse">
                                <path d="M 120,40 Q 130,30 145,35 Q 155,30 165,37 Q 175,35 175,45 Q 175,50 150,50 L 120,50 Z" fill="#94A3B8" />
                                <path d="M 200,80 Q 210,70 225,75 Q 235,70 245,77 Q 255,75 255,85 L 200,85 Z" fill="#94A3B8" />
                                <text x="180" y="32" fill="#38BDF8" className="text-[7px] font-sans animate-bounce">💨 هواء نشط</text>
                              </g>
                            )}

                            {/* Drop tower & Landing Ground */}
                            <rect x="135" y="150" width="100" height="6" fill="#1F2937" rx="2" />
                            <text x="185" y="145" textAnchor="middle" fill="#9CA3AF" className="text-[7.5px] font-bold">سطح الأرض (مستوى الإسناد)</text>

                            {/* Falling ball with seamless Framer Motion looping */}
                            {(() => {
                              // mapped Start and End Y coordinates depending on height
                              const startY = 150 - (freefallHeight / 100) * 130;
                              const endY = 146;
                              
                              // Radius depends on mass (but doesn't change gravity unless air resistance is on!)
                              const ballRadius = 6 + (freefallMass / 15);
                              
                              return (
                                <g>
                                  {/* Dashed drop path */}
                                  <line x1="185" y1={startY} x2="185" y2={endY} stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
                                  
                                  {/* Original height label */}
                                  <text x="185" y={startY - 8} textAnchor="middle" fill="#818CF8" className="text-[8px] font-bold">قوة الجاذبية الثقالية ↓</text>
                                  
                                  {/* Ball component */}
                                  <motion.circle
                                    cx="185"
                                    cy={startY}
                                    r={ballRadius}
                                    fill={freefallAirResistance ? "#E11D48" : "#10B981"}
                                    stroke="white"
                                    strokeWidth="1"
                                    animate={{ cy: [startY, endY] }}
                                    transition={{
                                      duration: duration,
                                      ease: "easeIn",
                                      repeat: Infinity,
                                      repeatDelay: 1.2
                                    }}
                                  />

                                  {/* Shadow or impact splash on earth */}
                                  <motion.ellipse
                                    cx="185"
                                    cy="150"
                                    rx="2"
                                    ry="1"
                                    fill="rgba(0,0,0,0.4)"
                                    animate={{ rx: [2, ballRadius * 1.5, 2], opacity: [0.1, 0.8, 0] }}
                                    transition={{
                                      duration: duration,
                                      ease: "easeIn",
                                      repeat: Infinity,
                                      repeatDelay: 1.2
                                    }}
                                  />
                                </g>
                              );
                            })()}
                          </svg>
                          <span className="text-[9.5px] text-gray-400 text-center leading-relaxed">
                            {freefallAirResistance 
                              ? "يتباطأ سقوط الكرة الثقيلة بسبب اصطدام الأجزاء بجزيئات الهواء، بينما الفراغ يضمن حتمية التسارع الموحد."
                              : "سقوط حر حقيقي في الفراغ غياب الهواء يعني تسارع الجاذبية الثابت g ≈ 9.81 m/s² مهما كانت الكتلة."
                            }
                          </span>
                        </div>
                      );
                    })()}

                    {/* 22. Stoichiometry Visualizer */}
                    {activeLab === "stoichiometry" && (() => {
                      const masses: Record<string, { formula: string; m: number; color: string; atoms: string[] }> = {
                        H2O: { formula: "H₂O", m: 18.01, color: "#3B82F6", atoms: ["O", "H", "H"] },
                        CO2: { formula: "CO₂", m: 44.01, color: "#10B981", atoms: ["C", "O", "O"] },
                        NaCl: { formula: "NaCl", m: 58.44, color: "#F59E0B", atoms: ["Na", "Cl"] },
                        C6H12O6: { formula: "C₆H₁₂O₆", m: 180.16, color: "#EF4444", atoms: ["C", "H", "O"] },
                        Fe: { formula: "Fe", m: 55.85, color: "#6B7280", atoms: ["Fe"] },
                        O2: { formula: "O₂", m: 32.00, color: "#8B5CF6", atoms: ["O", "O"] }
                      };
                      const sInfo = masses[stoichSubstance] || { formula: stoichSubstance, m: 1, color: "#6366F1", atoms: ["?"] };
                      
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px] font-sans">
                          <svg className="w-full h-[180px]" viewBox="0 0 300 180">
                            {/* Electronic Sensitive Balance */}
                            {/* Base body */}
                            <path d="M 70,140 L 230,140 L 210,165 L 90,165 Z" fill="#1F2937" stroke="#374151" strokeWidth="2" />
                            <rect x="110" y="145" width="80" height="15" fill="#020617" rx="2" stroke="#4B5563" strokeWidth="1" />
                            {/* LCD weight value display */}
                            <text x="150" y="156" textAnchor="middle" fill="#10B981" className="text-[10px] font-mono font-bold">
                              {stoichGrams.toFixed(2)} غرام
                            </text>

                            {/* Plate cup */}
                            <line x1="85" y1="130" x2="215" y2="130" stroke="#E5E7EB" strokeWidth="4" />
                            <line x1="150" y1="130" x2="150" y2="140" stroke="#D1D5DB" strokeWidth="5" />

                            {/* Glass Laboratory Beaker placed on balance plate */}
                            <path d="M 110,50 L 110,126 Q 110,129 113,129 L 187,129 Q 190,129 190,126 L 190,50" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                            
                            {/* Molecule grains inside Beaker representing the selected matter */}
                            {(() => {
                              // make dots inside Beaker proportional to grams / substance
                              const dotsCount = Math.min(25, Math.ceil(stoichGrams / 4) + 4);
                              const grains: { x: number; y: number }[] = [];
                              for (let i = 0; i < dotsCount; i++) {
                                // distribute randomly near bottom of Beaker (X: 118-182, Y: 110-127)
                                const gx = 118 + (i * 11) % 64;
                                const gy = 125 - Math.floor(i / 5) * 6;
                                grains.push({ x: gx, y: gy });
                              }

                              return (
                                <g>
                                  {grains.map((g, idx) => (
                                    <circle
                                      key={idx}
                                      cx={g.x}
                                      cy={g.y}
                                      r={sInfo.atoms.length > 2 ? "3.2" : "2.5"}
                                      fill={sInfo.color}
                                      opacity="0.85"
                                      stroke="white"
                                      strokeWidth="0.5"
                                    />
                                  ))}
                                </g>
                              );
                            })()}

                            {/* Chemical molecular magnifying lens highlight layout on right card */}
                            <circle cx="245" cy="70" r="24" fill="#090d16" stroke={sInfo.color} strokeWidth="1.5" />
                            <text x="245" y="73" textAnchor="middle" fill="white" className="text-[10px] font-bold font-mono">
                              {sInfo.formula}
                            </text>
                            
                            <line x1="190" y1="90" x2="225" y2="76" stroke="rgba(156, 163, 175, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
                            <text x="245" y="105" textAnchor="middle" fill="#9CA3AF" className="text-[8px] font-sans font-bold">بنية الجزيء</text>
                          </svg>
                          <span className="text-[10px] text-gray-450 leading-relaxed text-center">
                            المخبر يقيس الكتلة الكلية بالجرام، وتوليد تماثل جزيئي يعتمد على نسب أوزان الكتلة الجزيئية لكل مركب.
                          </span>
                        </div>
                      );
                    })()}

                    {/* 23. Newton's 3rd Law Visualizer */}
                    {activeLab === "newton3" && (() => {
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px] font-sans">
                          {/* Newton's 3rd Collision Track */}
                          <svg className="w-full h-[180px] bg-slate-950/40 rounded-xl" viewBox="0 0 300 180">
                            {/* Collision Rail */}
                            <line x1="20" y1="120" x2="280" y2="120" stroke="#374151" strokeWidth="4" />
                            <line x1="20" y1="122" x2="280" y2="122" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />

                            {/* Flat surface grid lines */}
                            <line x1="150" y1="120" x2="150" y2="140" stroke="rgba(156,163,175,0.2)" strokeWidth="1" strokeDasharray="2 2" />
                            <text x="150" y="132" textAnchor="middle" fill="#6B7280" className="text-[7.5px]">نقطة التصادم الافتراضية</text>

                            {/* Dynamic Animation representing action-reaction loop */}
                            {(() => {
                              // Left car starts at 35, hits at 122, rebounds back
                              // Right car starts at 265, hits at 154, rebounds back
                              return (
                                <g>
                                  {/* Red Car (A) */}
                                  <motion.g
                                    animate={{ x: [35, 122, 100, 35] }}
                                    transition={{
                                      duration: 3,
                                      ease: "easeInOut",
                                      repeat: Infinity,
                                      repeatDelay: 1.5
                                    }}
                                  >
                                    {/* Car Body shape */}
                                    <rect x="0" y="90" width="28" height="18" fill="#EF4444" rx="4" stroke="white" strokeWidth="0.5" />
                                    <rect x="5" y="82" width="16" height="9" fill="#1F2937" rx="1" />
                                    <circle cx="7" cy="110" r="4.5" fill="#E5E7EB" />
                                    <circle cx="21" cy="110" r="4.5" fill="#E5E7EB" />
                                    <text x="14" y="102" textAnchor="middle" fill="white" className="text-[8px] font-bold font-mono">A</text>
                                    <text x="14" y="78" textAnchor="middle" fill="#EF4444" className="text-[7px] font-mono font-bold">{newtonMassA}Kg</text>
                                  </motion.g>

                                  {/* Blue Car (B) */}
                                  <motion.g
                                    animate={{ x: [237, 150, 172, 237] }}
                                    transition={{
                                      duration: 3,
                                      ease: "easeInOut",
                                      repeat: Infinity,
                                      repeatDelay: 1.5
                                    }}
                                  >
                                    {/* Car Body shape */}
                                    <rect x="0" y="90" width="28" height="18" fill="#3B82F6" rx="4" stroke="white" strokeWidth="0.5" />
                                    <rect x="7" y="82" width="16" height="9" fill="#1F2937" rx="1" />
                                    <circle cx="7" cy="110" r="4.5" fill="#E5E7EB" />
                                    <circle cx="21" cy="110" r="4.5" fill="#E5E7EB" />
                                    <text x="14" y="102" textAnchor="middle" fill="white" className="text-[8px] font-bold font-mono">B</text>
                                    <text x="14" y="78" textAnchor="middle" fill="#60A5FA" className="text-[7px] font-mono font-bold">{newtonMassB}Kg</text>
                                  </motion.g>

                                  {/* Collision impulse spark & Action-Reaction mutual force vectors */}
                                  <motion.g
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ 
                                      opacity: [0, 1, 1, 0],
                                      scale: [0, 1.2, 1, 0]
                                    }}
                                    transition={{
                                      duration: 3,
                                      times: [0, 0.35, 0.5, 0.7],
                                      repeat: Infinity,
                                      repeatDelay: 1.5
                                    }}
                                  >
                                    {/* Action impulse star glow right on coordinate X=150 collision */}
                                    <path d="M 150,85 L 153,95 L 163,98 L 153,101 L 150,111 L 147,101 L 137,98 L 147,95 Z" fill="#FBBF24" />
                                    <circle cx="150" cy="98" r="4" fill="white" />

                                    {/* Action vectors shooters */}
                                    {/* Force A -> B (red points right into blue) */}
                                    <line x1="150" y1="92" x2="180" y2="92" stroke="#F59E0B" strokeWidth="2.5" markerEnd="url(#arrow)" />
                                    <text x="176" y="85" textAnchor="middle" fill="#F59E0B" className="text-[7px] font-bold">F_A→B (فعل)</text>

                                    {/* Force B -> A (blue points left into red) */}
                                    <line x1="150" y1="104" x2="120" y2="104" stroke="#F59E0B" strokeWidth="2.5" markerEnd="url(#arrow)" />
                                    <text x="124" y="114" textAnchor="middle" fill="#F59E0B" className="text-[7px] font-bold">F_B→A (رد فعل)</text>
                                  </motion.g>
                                </g>
                              );
                            })()}
                          </svg>
                          <span className="text-[10px] text-gray-450 text-center leading-relaxed">
                            💡 يوضح التصادم الفعلي أن شدة القوتين متبادلة بالتساوي المطلق والتعاكس الاتجاهي الثابت مهما اختلفت كتل سيارات التجربة.
                          </span>
                        </div>
                      );
                    })()}

                    {/* 24. Wave Superposition Visualizer */}
                    {activeLab === "waves" && (() => {
                      // Generate dynamic points for three wave tracks
                      const samplePointsCount = 60;
                      const width = 280;
                      const startX = 10;
                      const baseLineY = 90;
                      
                      const phaseRad = (wavePhaseDiff * Math.PI) / 180;

                      // Make simple coordinates of sine lines
                      let arrWave1Points: string[] = [];
                      let arrWave2Points: string[] = [];
                      let arrResPoints: string[] = [];

                      for (let i = 0; i <= samplePointsCount; i++) {
                        const pxX = startX + (i / samplePointsCount) * width;
                        
                        // Wave 1: amplitude scaled, frequency scaled
                        // let freq cycle x coordinate
                        const arg1 = (i / samplePointsCount) * Math.PI * 4.5 * waveFreq1;
                        const arg2 = (i / samplePointsCount) * Math.PI * 4.5 * waveFreq2 + phaseRad;

                        const yWave1 = Math.sin(arg1) * (waveAmp1 * 5.5);
                        const yWave2 = Math.sin(arg2) * (waveAmp2 * 5.5);
                        const yResult = yWave1 + yWave2;

                        arrWave1Points.push(`${pxX},${baseLineY - yWave1}`);
                        arrWave2Points.push(`${pxX},${baseLineY - yWave2}`);
                        arrResPoints.push(`${pxX},${baseLineY - yResult}`);
                      }

                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px] font-sans">
                          <svg className="w-full h-[180px] bg-slate-950/40 rounded-xl" viewBox="0 0 300 180">
                            {/* Median baseline zero referential */}
                            <line x1="10" y1="90" x2="290" y2="90" stroke="#1F2937" strokeWidth="1.5" />
                            <text x="14" y="85" fill="#4B5563" className="text-[6.5px] font-mono">0V</text>

                            {/* Wave 1 - Red */}
                            <path d={`M ${arrWave1Points.join(" Q ")}`} fill="none" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.45" />

                            {/* Wave 2 - Blue */}
                            <path d={`M ${arrWave2Points.join(" Q ")}`} fill="none" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.45" />

                            {/* Resultant Combined Wave - Bold Purple */}
                            <path d={`M ${arrResPoints.join(" Q ")}`} fill="none" stroke="#A855F7" strokeWidth="2.5" />

                            {/* Legends */}
                            <g transform="translate(15, 20)">
                              <rect x="0" y="0" width="270" height="15" fill="rgba(17,24,39,0.7)" rx="4" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                              
                              <circle cx="10" cy="7" r="3.5" fill="#EF4444" opacity="0.6" />
                              <text x="18" y="10" fill="#EF4444" className="text-[7px] font-bold">الموجة 1</text>

                              <circle cx="95" cy="7" r="3.5" fill="#3B82F6" opacity="0.6" />
                              <text x="103" y="10" fill="#3B82F6" className="text-[7px] font-bold">الموجة 2</text>

                              <circle cx="180" cy="7" r="4.5" fill="#A855F7" />
                              <text x="189" y="10" fill="#C084FC" className="text-[7px] font-bold">الموجة المحصلة (التركيب)</text>
                            </g>
                          </svg>
                          <span className="text-[10px] text-gray-450 leading-relaxed text-center">
                            الموجة المركبة (البنفسجية) تعبر هندسياً عن التراكب الموجي اللحظي لقيم المطالين (Y_total = Y1 + Y2) للموجات الأساسية.
                          </span>
                        </div>
                      );
                    })()}

                    {/* 25. Atomic Structure & Isotopes Visualizer */}
                    {activeLab === "atomic" && (() => {
                      const protonsCount = atomicProtons;
                      const neutronsCount = atomicNeutrons;
                      const electronsCount = atomicElectrons;

                      // Generate random positions clustered for protons and neutrons in Nucleus
                      const particleGrains: { p: boolean; x: number; y: number }[] = [];
                      const totalNuc = protonsCount + neutronsCount;
                      
                      for (let i = 0; i < totalNuc; i++) {
                        // cluster around center cx=150, cy=90 with radius 12
                        const angle = (i * (2 * Math.PI)) / totalNuc + (i * 0.5);
                        const radius = (i % 3 === 0) ? 3 : (i % 2 === 0) ? 7 : 11;
                        const px = 150 + radius * Math.cos(angle);
                        const py = 90 + radius * Math.sin(angle);
                        particleGrains.push({
                          p: i < protonsCount, // first protonsCount are protons
                          x: px,
                          y: py
                        });
                      }

                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px] font-sans">
                          <svg className="w-full h-[180px] bg-slate-950/40 rounded-xl" viewBox="0 0 300 180">
                            {/* Nested Electron orbits shells (K shell: r=34, L shell: r=58) */}
                            <circle cx="150" cy="90" r="34" fill="none" stroke="#1F2937" strokeWidth="1" strokeDasharray="3 3" />
                            <text x="150" y="52" fill="#4B5563" className="text-[6.5px] font-mono font-bold text-center">المدار K (السعة القصوى 2)</text>

                            {electronsCount > 2 && (
                              <>
                                <circle cx="150" cy="90" r="58" fill="none" stroke="#1F2937" strokeWidth="1" strokeDasharray="3 3" />
                                <text x="150" y="28" fill="#4B5563" className="text-[6.5px] font-mono font-bold text-center">المدار L (السعة القصوى 8)</text>
                              </>
                            )}

                            {/* Particle Legend lists */}
                            <g transform="translate(15, 140)" className="text-[7px]">
                              <circle cx="10" cy="5" r="3" fill="#EF4444" />
                              <text x="16" y="8" fill="#9CA3AF">بروتون (⁺p)</text>

                              <circle cx="90" cy="5" r="3" fill="#6B7280" />
                              <text x="96" y="8" fill="#9CA3AF">نيوترون (n⁰)</text>

                              <circle cx="170" cy="5" r="2.5" fill="#10B981" />
                              <text x="176" y="8" fill="#9CA3AF">إلكترون (⁻e)</text>
                            </g>

                            {/* Centered Nucleus boundary circle glow */}
                            <circle cx="150" cy="90" r="18" fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.15)" strokeWidth="0.5" />

                            {/* Draw clustered nuclear particles */}
                            {particleGrains.map((p, idx) => (
                              <circle
                                key={idx}
                                cx={p.x}
                                cy={p.y}
                                r="3.2"
                                fill={p.p ? "#EF4444" : "#6B7280"}
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="0.4"
                              />
                            ))}

                            {/* Animated orbiting electrons dots */}
                            {(() => {
                              const eElements: any[] = [];
                              
                              for (let i = 0; i < electronsCount; i++) {
                                const isKShell = i < 2;
                                const radius = isKShell ? 34 : 58;
                                const startingAngle = (i * (2 * Math.PI)) / (isKShell ? 2 : (electronsCount - 2));
                                
                                eElements.push(
                                  <motion.circle
                                    key={i}
                                    cx="150"
                                    cy="90"
                                    r="3"
                                    fill="#10B981"
                                    stroke="white"
                                    strokeWidth="0.5"
                                    animate={{
                                      cx: Array.from({ length: 13 }, (_, step) => 150 + radius * Math.cos(startingAngle + (step * Math.PI) / 6)),
                                      cy: Array.from({ length: 13 }, (_, step) => 90 + radius * Math.sin(startingAngle + (step * Math.PI) / 6))
                                    }}
                                    transition={{
                                      duration: isKShell ? 2.5 : 4.5,
                                      ease: "linear",
                                      repeat: Infinity
                                    }}
                                  />
                                );
                              }
                              
                              return <g>{eElements}</g>;
                            })()}
                          </svg>
                          <span className="text-[10px] text-gray-450 leading-relaxed text-center">
                            النموذج يوضح مستويات الطاقة المدارية الكروية وسحابة الإلكترونات المستديرة حول النواة المركزية المتامسكة بالقوى الكهروساكنة.
                          </span>
                        </div>
                      );
                    })()}

                    {/* 26. Earth's Internal Structure Visualizer */}
                    {activeLab === "geology_earth" && (() => {
                      // Map depth to radius
                      // Inner Core: r=14, Outer Core: r=38, Mantle: r=78, Crust: r=96
                      let depthPercent = earthDepth / 6371;
                      let pointerRadius = 96 - (depthPercent * 82);
                      let currentZone = "القشرة";
                      if (earthDepth > 35 && earthDepth <= 2900) currentZone = "البرنس (الوشاح)";
                      else if (earthDepth > 2900 && earthDepth <= 5150) currentZone = "النواة الخارجية";
                      else if (earthDepth > 5150) currentZone = "النواة الداخلية";

                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px] font-sans">
                          <svg className="w-full h-[180px] bg-slate-950/40 rounded-xl" viewBox="0 0 300 180">
                            {/* Nested circles representing Earth section */}
                            <g transform="translate(150, 90)">
                              {/* Atmosphere/Space glow */}
                              <circle cx="0" cy="0" r="102" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="4" />
                              
                              {/* Crust */}
                              <circle cx="0" cy="0" r="96" fill="#4B382A" stroke="#78350F" strokeWidth="1" />
                              
                              {/* Mantle */}
                              <circle cx="0" cy="0" r="92" fill="#B45309" stroke="#EA580C" strokeWidth="1" />
                              
                              {/* Outer Core */}
                              <circle cx="0" cy="0" r="54" fill="#F97316" stroke="#FCE7F3" strokeWidth="1" />
                              
                              {/* Inner Core */}
                              <circle cx="0" cy="0" r="22" fill="#FEF08A" stroke="#FACC15" strokeWidth="1" />
                              <circle cx="0" cy="0" r="8" fill="#FFFFFF" />

                              {/* Pointer Line and indicator dot representing deep drill sensor */}
                              <line x1="0" y1="0" x2={pointerRadius} y2="0" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
                              <motion.circle 
                                cx={pointerRadius} 
                                cy="0" 
                                r="4.5" 
                                fill="#22C55E" 
                                stroke="#FFFFFF" 
                                strokeWidth="1.2"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                              />
                            </g>

                            {/* Legends */}
                            <g transform="translate(10, 10)" className="text-[7.5px] fill-gray-400 font-bold">
                              <rect x="0" y="0" width="8" height="8" fill="#FEF08A" rx="1" />
                              <text x="12" y="7">نواة داخلية (صلب)</text>
                              
                              <rect x="0" y="12" width="8" height="8" fill="#F97316" rx="1" />
                              <text x="12" y="19">نواة خارجية (سائل)</text>

                              <rect x="0" y="24" width="8" height="8" fill="#B45309" rx="1" />
                              <text x="12" y="31">الرداء/الوشاح</text>

                              <rect x="0" y="36" width="8" height="8" fill="#4B382A" rx="1" />
                              <text x="12" y="43">القشرة القارية</text>
                            </g>
                            
                            <g transform="translate(195, 10)" className="text-[7.5px] fill-gray-400 font-bold text-right">
                              <text x="95" y="8" fill="#10B981" className="font-extrabold text-[8px]">مسبار القياس 🟢</text>
                              <text x="95" y="19">النطاق: {currentZone}</text>
                              <text x="95" y="30">البعد: {earthDepth} كم</text>
                            </g>
                          </svg>
                          <span className="text-[10px] text-gray-450 leading-relaxed text-center">
                            الرسم البياني يمثل تخطيطاً لنطاقات الكرة الأرضية متطابقة مع انقطاعات (موهو، غوتنبرغ، و ليمان) وتدرج الضغط والحرارة.
                          </span>
                        </div>
                      );
                    })()}

                    {/* 27. Plate Tectonics Visualizer */}
                    {activeLab === "geology_tectonics" && (() => {
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px] font-sans">
                          <svg className="w-full h-[180px] bg-slate-950/40 rounded-xl" viewBox="0 0 300 180">
                            {/* Mantle/Asthenosphere background flow */}
                            <path d="M 10,130 Q 150,140 290,135" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="5 5" opacity="0.3" />

                            {plateMoveType === "convergent" ? (
                              <>
                                {/* Convergent limits: oceanic subducting under continental */}
                                {/* Asthenosphere reservoir */}
                                <rect x="0" y="120" width="300" height="60" fill="url(#lavaGradient)" opacity="0.4" />
                                
                                {/* Subducting oceanic plate (Left) */}
                                <g>
                                  <path d="M 0,70 L 110,70 L 170,135 L 140,145 L 0,85 Z" fill="#334155" stroke="#475569" strokeWidth="1" />
                                  <text x="30" y="62" fill="#94A3B8" className="text-[7.5px] font-bold">لوح محيطي غائص</text>
                                  {/* Left plate movement indicator */}
                                  <g transform="translate(45, 78)">
                                    <line x1="0" y1="0" x2="16" y2="0" stroke="#EF4444" strokeWidth="1.5" />
                                    <polygon points="16,-3 22,0 16,3" fill="#EF4444" />
                                  </g>
                                </g>

                                {/* Continental plate (Right) with mountain foldings */}
                                <g>
                                  <path d="M 170,120 L 155,70 L 180,50 L 210,65 L 240,48 L 300,70 L 300,125 Z" fill="#78350F" stroke="#92400E" strokeWidth="1" />
                                  <text x="210" y="42" fill="#FDBA74" className="text-[7.5px] font-bold">لوح قاري مرتفع</text>
                                  {/* Right plate movement indicator */}
                                  <g transform="translate(250, 78)">
                                    <line x1="22" y1="0" x2="6" y2="0" stroke="#EF4444" strokeWidth="1.5" />
                                    <polygon points="6,-3 0,0 6,3" fill="#EF4444" />
                                  </g>
                                </g>

                                {/* Trench (الخندق المحيطي) */}
                                <text x="110" y="85" fill="#38BDF8" className="text-[6.5px] font-bold rotate-[45deg]">خندق محيطي</text>

                                {/* Magma Chamber rising to form an explosive volcano */}
                                <g>
                                  {/* Rising magma pathway */}
                                  <path d="M 160,110 Q 180,95 210,66" fill="none" stroke="#F97316" strokeWidth="3" />
                                  {/* Volcano magma explosion */}
                                  <motion.circle 
                                    cx="210" 
                                    cy="60" 
                                    r="5" 
                                    fill="#FEF08A" 
                                    animate={{ scale: [1, 1.4, 1] }} 
                                    transition={{ repeat: Infinity, duration: 1 }} 
                                  />
                                  <text x="218" y="62" fill="#F87171" className="text-[7px] font-extrabold">بركان انفجاري 🌋</text>
                                  
                                  {/* Earthquake epicenters (المركز السطحي للهزة) near Benioff plane */}
                                  <motion.circle 
                                    cx="145" 
                                    cy="105" 
                                    r="4" 
                                    fill="#EF4444" 
                                    stroke="#FFFFFF" 
                                    strokeWidth="0.5"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                  />
                                  <text x="100" y="112" fill="#FCA5A5" className="text-[6.5px] font-bold">زلزال قوي (بؤرة)</text>
                                </g>
                              </>
                            ) : (
                              <>
                                {/* Divergent limits: Rift Valley expansion with basaltic magma */}
                                <rect x="0" y="120" width="300" height="60" fill="url(#lavaGradient)" opacity="0.5" />

                                {/* Left Plate moving left */}
                                <g>
                                  <path d="M 0,65 L 120,65 L 90,130 L 0,130 Z" fill="#475569" stroke="#64748B" strokeWidth="1" />
                                  <text x="20" y="55" fill="#94A3B8" className="text-[7.5px] font-bold">لوح متباعد أيسر</text>
                                  {/* Left arrow */}
                                  <g transform="translate(60, 80)">
                                    <line x1="16" y1="0" x2="0" y2="0" stroke="#10B981" strokeWidth="1.5" />
                                    <polygon points="0,-3 -6,0 0,3" fill="#10B981" />
                                  </g>
                                </g>

                                {/* Right Plate moving right */}
                                <g>
                                  <path d="M 180,65 L 300,65 L 300,130 L 210,130 Z" fill="#475569" stroke="#64748B" strokeWidth="1" />
                                  <text x="220" y="55" fill="#94A3B8" className="text-[7.5px] font-bold">لوح متباعد أيمن</text>
                                  {/* Right arrow */}
                                  <g transform="translate(220, 80)">
                                    <line x1="0" y1="0" x2="16" y2="0" stroke="#10B981" strokeWidth="1.5" />
                                    <polygon points="16,-3 22,0 16,3" fill="#10B981" />
                                  </g>
                                </g>

                                {/* Rift Axis (محور الظهرة) with rising magma */}
                                <g transform="translate(150, 65)">
                                  {/* Rift crack valley */}
                                  <path d="M -30,0 L 0,30 L 30,0 Z" fill="none" stroke="#F97316" strokeWidth="2" />
                                  {/* Lava fountain */}
                                  <motion.ellipse 
                                    cx="0" 
                                    cy="20" 
                                    rx="8" 
                                    ry="12" 
                                    fill="#EF4444" 
                                    animate={{ rx: [4, 9, 4], opacity: [0.6, 1, 0.6] }} 
                                    transition={{ repeat: Infinity, duration: 1.2 }} 
                                  />
                                  <text x="-40" y="-8" fill="#F59E0B" className="text-[7.5px] font-extrabold text-center">ريفت الظهرة (توسع محيطي) 🌋</text>
                                  <text x="-35" y="45" fill="#EF4444" className="text-[6.5px] font-bold">ماغما رداء أستنوسفير</text>
                                </g>
                              </>
                            )}

                            {/* Define Gradients */}
                            <defs>
                              <linearGradient id="lavaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#EA580C" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#7F1D1D" stopOpacity="1" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="text-[10px] text-gray-455 leading-relaxed text-center">
                            تفاعلات حركية تفاعلية: لاحظ بؤر زلزال بنيوف (اليسار بالتقارب) وصعود حمم الظهرة بالتباعد (اليمين).
                          </span>
                        </div>
                      );
                    })()}

                    {/* 28. Photosynthesis Mechanism Visualizer */}
                    {activeLab === "biology_photosynthesis" && (() => {
                      const bubblesCount = Math.round((photoLight * photoCO2) / 1000) + 1;
                      const lightIntensity = photoLight;
                      
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px] font-sans">
                          <svg className="w-full h-[180px] bg-slate-950/40 rounded-xl" viewBox="0 0 300 180">
                            {/* Sun rays rendering */}
                            <g>
                              <circle cx="20" cy="20" r="12" fill="#F59E0B" opacity="0.8" />
                              <motion.circle 
                                cx="20" 
                                cy="20" 
                                r="16" 
                                fill="none" 
                                stroke="#FCD34D" 
                                strokeWidth="0.8" 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              />
                              
                              {/* Glowing rays arriving to leaf */}
                              {lightIntensity > 0 && (
                                <g opacity={lightIntensity / 100}>
                                  <line x1="32" y1="32" x2="110" y2="85" stroke="#FDE047" strokeWidth="1.2" strokeDasharray="3 3" />
                                  <line x1="40" y1="20" x2="150" y2="70" stroke="#FDE047" strokeWidth="1.2" strokeDasharray="3 3" />
                                  <text x="50" y="38" fill="#FCD34D" className="text-[6.5px] font-bold">أشعة ضوئية (طاقة محفزة)</text>
                                </g>
                              )}
                            </g>

                            {/* Plant leaf in beaker (الماعون المخبري) */}
                            <g>
                              {/* Beaker water */}
                              <rect x="70" y="55" width="160" height="110" fill="rgba(14, 165, 233, 0.12)" stroke="#0284C7" strokeWidth="1" rx="4" />
                              <line x1="70" y1="65" x2="230" y2="65" stroke="#0284C7" strokeWidth="0.5" strokeDasharray="4 2" />
                              <text x="75" y="62" fill="#38BDF8" className="text-[6.5px] font-bold">محلول معدني ومياه غنية بـ CO₂</text>

                              {/* Leaf */}
                              <path d="M 100,120 Q 150,70 200,120 Q 150,150 100,120 Z" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
                              {/* Leaf veins line */}
                              <path d="M 100,120 L 200,120" stroke="#059669" strokeWidth="1" />
                              <path d="M 130,111 L 140,120" stroke="#059669" strokeWidth="1" />
                              <path d="M 150,105 L 165,120" stroke="#059669" strokeWidth="1" />
                              <path d="M 170,110 L 185,120" stroke="#059669" strokeWidth="1" />
                              <text x="135" y="132" fill="#ECFDF5" className="text-[7.5px] font-extrabold">الورقة الخضراء (الخلايا اليخضورية)</text>
                            </g>

                            {/* Oxygen bubbles rising (O₂) */}
                            <g>
                              {Array.from({ length: Math.min(bubblesCount, 8) }).map((_, i) => {
                                const startingX = 120 + (i * 12);
                                return (
                                  <motion.circle
                                    key={i}
                                    cx={startingX}
                                    cy="110"
                                    r="2.8"
                                    fill="none"
                                    stroke="#38BDF8"
                                    strokeWidth="1"
                                    animate={{
                                      y: [-5, -55],
                                      cx: [startingX, startingX + (i % 2 === 0 ? 6 : -6), startingX],
                                      opacity: [0, 0.8, 0]
                                    }}
                                    transition={{
                                      duration: 2.2 + (i * 0.3),
                                      repeat: Infinity,
                                      ease: "easeOut"
                                    }}
                                  />
                                );
                              })}
                              {bubblesCount > 1 && (
                                <text x="150" y="85" fill="#38BDF8" className="text-[7px] font-extrabold">طرح فقاعات O₂ 🫧</text>
                              )}
                            </g>

                            {/* CO₂ absorption lines entering stomata (ثغور) */}
                            {photoCO2 > 100 && (
                              <g>
                                <path d="M 60,115 C 80,115 100,115 115,118" fill="none" stroke="#D1D5DB" strokeWidth="0.8" strokeDasharray="2 2" />
                                <polygon points="115,115 121,118 115,121" fill="#9CA3AF" />
                                <text x="45" y="108" fill="#9CA3AF" className="text-[6.5px] font-bold">امتصاص غاز CO₂</text>
                              </g>
                            )}

                            {/* Starch/Glucose synthesis dots inside chlorophyll leaf */}
                            <g>
                              <circle cx="140" cy="115" r="1.5" fill="#F59E0B" />
                              <circle cx="160" cy="118" r="1.5" fill="#F59E0B" />
                              <circle cx="175" cy="113" r="1.5" fill="#F59E0B" />
                              <text x="142" y="102" fill="#F59E0B" className="text-[6px] font-bold">مادة عضوية (نشاء)</text>
                            </g>
                          </svg>
                          <span className="text-[10px] text-gray-455 leading-relaxed text-center">
                            لاحظ انطلاق فقاعات غاز الأكسجين (O₂) من ثنايا صانعات الورقة اليخضورية تبعاً لتغير الإضاءة وتركيز CO₂.
                          </span>
                        </div>
                      );
                    })()}

                    {/* 29. Respiration vs Fermentation Visualizer */}
                    {activeLab === "biology_respiration" && (() => {
                      const bubbleQuantity = respGlucoseAmount / 15;
                      
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px] font-sans">
                          <svg className="w-full h-[180px] bg-slate-950/40 rounded-xl" viewBox="0 0 300 180">
                            {/* Visual cell layout */}
                            {respOxygenAvailable ? (
                              <>
                                {/* Aerobic digestion: Active Mitochondria */}
                                <g transform="translate(150, 90)">
                                  {/* Cell boundary */}
                                  <circle cx="0" cy="0" r="82" fill="none" stroke="#0284C7" strokeWidth="1" strokeDasharray="4 4" />
                                  <text x="-76" y="-62" fill="#0284C7" className="text-[7.5px] font-bold">خلية الخميرة (وسط هوائي)</text>
                                  
                                  {/* Mitochondria folded membrane */}
                                  <path d="M -45,-15 C -45,-35 45,-35 45,-15 C 45,15 -45,15 -45,-15 Z" fill="#1E293B" stroke="#0F766E" strokeWidth="1.5" />
                                  {/* Cristae inside */}
                                  <path d="M -38,-15 C -30,-25 -25,-5 -20,-20 C -15,-5 -10,-25 -5,-8 C 0,-25 5,-5 10,-20 C 15,-5 20,-25 25,-8 C 30,-25 35,-15 38,-15" fill="none" stroke="#14B8A6" strokeWidth="1.5" />
                                  <text x="-25" y="3" fill="#14B8A6" className="text-[7px] font-extrabold">الميتوكوندريا (التنفس)</text>
                                  
                                  {/* Glucose and O2 entering */}
                                  <g transform="translate(-70, -45)" className="text-[6.5px] fill-gray-400 font-bold">
                                    <text x="0" y="0" fill="#F59E0B">سكر غلوكوز ➡️</text>
                                    <text x="0" y="10" fill="#38BDF8">غاز أكسجين O₂ ➡️</text>
                                  </g>

                                  {/* Massive ATP Energy sparkles pulsing */}
                                  {Array.from({ length: 6 }).map((_, i) => {
                                    const angle = (i * Math.PI) / 3;
                                    const tx = 55 * Math.cos(angle);
                                    const ty = 55 * Math.sin(angle);
                                    return (
                                      <motion.g 
                                        key={i}
                                        transform={`translate(${tx}, ${ty})`}
                                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 1 + (i * 0.2) }}
                                      >
                                        <polygon points="0,-4 2,-1 5,0 2,1 0,4 -2,1 -5,0 -2,-1" fill="#FBBF24" />
                                        <text x="5" y="2" fill="#FBBF24" className="text-[6px] font-bold">ATP</text>
                                      </motion.g>
                                    );
                                  })}
                                  
                                  <text x="-40" y="45" fill="#FBBF24" className="text-[8px] font-extrabold text-center">أكسدة تامة 🔋 (38 ATP طاقة قصوى)</text>
                                </g>
                              </>
                            ) : (
                              <>
                                {/* Anaerobic yeast container: Fermentation inside cytoplasm without Mitochondria */}
                                <g transform="translate(150, 90)">
                                  {/* Cytoplasm boundary with a simple yeast cell shape */}
                                  <path d="M -70,-20 C -70,-60 60,-60 70,-10 C 70,30 20,70 -30,60 C -60,50 -70,20 -70,-20 Z" fill="none" stroke="#A855F7" strokeWidth="1" strokeDasharray="3 3" />
                                  <text x="-65" y="-50" fill="#A855F7" className="text-[7.5px] font-bold">خلية خميرة اللاهوائية (تخمر)</text>

                                  {/* Glucose entering */}
                                  <text x="-72" y="-12" fill="#F59E0B" className="text-[6.5px] font-bold">سكر غلوكوز ➡️</text>

                                  {/* Fermentation bubbles (CO2) & Ethanol byproduct */}
                                  {Array.from({ length: Math.min(Math.round(bubbleQuantity), 6) }).map((_, i) => {
                                    return (
                                      <motion.circle
                                        key={i}
                                        cx={-30 + (i * 12)}
                                        cy={30 - (i * 4)}
                                        r="2.2"
                                        fill="none"
                                        stroke="#C084FC"
                                        strokeWidth="1"
                                        animate={{ y: [0, -45], opacity: [0, 0.8, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.8 + i*0.2 }}
                                      />
                                    );
                                  })}
                                  
                                  {/* Low ATP sparkle */}
                                  <g transform="translate(45, 10)">
                                    <polygon points="0,-4 2,-1 5,0 2,1 0,4 -2,1 -5,0 -2,-1" fill="#FBBF24" />
                                    <text x="6" y="2" fill="#FBBF24" className="text-[7px] font-bold">2 ATP</text>
                                  </g>

                                  {/* Ethanol residue indicator */}
                                  <rect x="-35" y="40" width="70" height="15" fill="rgba(192, 132, 252, 0.08)" stroke="#C084FC" strokeWidth="0.5" rx="2" />
                                  <text x="0" y="50" fill="#D8B4FE" className="text-[6.5px] font-bold text-center" textAnchor="middle">كحول إيثيلي متبقي</text>
                                  <text x="0" y="-20" fill="#EF4444" className="text-[6.5px] font-bold" textAnchor="middle">❌ غياب الأكسجين (الهدم جزئي)</text>
                                </g>
                              </>
                            )}
                          </svg>
                          <span className="text-[10px] text-gray-455 leading-relaxed text-center">
                            مقارنة الهدم: لاحظ جزيئات الـ ATP الكثيفة بالتنفس (اليسار) مقابل الفضلات العضوية الكحولية بالتخمر (اليمين).
                          </span>
                        </div>
                      );
                    })()}

                    {/* 30. Cell Differentiation & Growth Visualizer */}
                    {activeLab === "biology_differentiation" && (() => {
                      return (
                        <div className="w-full max-w-[340px] flex flex-col justify-between items-center h-full max-h-[300px] font-sans">
                          <svg className="w-full h-[180px] bg-slate-950/40 rounded-xl" viewBox="0 0 300 180">
                            {/* Check growth states */}
                            {growthTime === 0 ? (
                              <g transform="translate(150, 90)">
                                {/* Young meristematic cells (خلايا مرستيمية فتية): tiny, identical, cluster */}
                                <text x="0" y="-55" fill="#10B981" className="text-[7.5px] font-extrabold text-center" textAnchor="middle">خلايا مرستيمية إنشائية (قمية فتية)</text>
                                
                                {[-20, 0, 20].map((cx, idx_x) => 
                                  [-20, 0, 20].map((cy, idx_y) => (
                                    <g key={`${idx_x}-${idx_y}`} transform={`translate(${cx}, ${cy})`}>
                                      <ellipse cx="0" cy="0" rx="9" ry="9" fill="#065F46" stroke="#047857" strokeWidth="1" />
                                      {/* Huge nucleus */}
                                      <circle cx="0" cy="0" r="3.5" fill="#EF4444" opacity="0.8" />
                                      {/* Tiny vacuoles */}
                                      <circle cx="-4" cy="-4" r="1" fill="#38BDF8" />
                                      <circle cx="4" cy="4" r="1" fill="#38BDF8" />
                                    </g>
                                  ))
                                )
                                }
                                <text x="0" y="45" fill="#9CA3AF" className="text-[6px] text-center" textAnchor="middle">خلايا صغيرة ذات جدار رقيق ونواة مركزية ضخمة وفجوات عصارية دقيقة</text>
                              </g>
                            ) : growthTime > 0 && growthTime <= 5 ? (
                              <g transform="translate(150, 90)">
                                {/* Elongated cells (منطقة الاستطالة): stretched vertically */}
                                <text x="0" y="-55" fill="#34D399" className="text-[7.5px] font-extrabold text-center" textAnchor="middle">خلايا في مرحلة الاستطالة (النمو)</text>
                                
                                {[-35, 0, 35].map((cx, idx) => (
                                  <g key={idx} transform={`translate(${cx}, 0)`}>
                                    {/* Elongated rectangle shape */}
                                    <rect x="-12" y="-35" width="24" height="70" fill="#065F46" stroke="#059669" strokeWidth="1" rx="2" />
                                    {/* Merging vacuole */}
                                    <ellipse cx="0" cy="10" rx="6" ry="20" fill="rgba(14, 165, 233, 0.25)" stroke="#38BDF8" strokeWidth="0.5" />
                                    {/* Nucleus flattened to the side */}
                                    <circle cx="-5" cy="-20" r="3" fill="#EF4444" opacity="0.6" />
                                  </g>
                                ))}
                                <text x="0" y="50" fill="#9CA3AF" className="text-[6px] text-center" textAnchor="middle">تندمج الفجوات الصغيرة في فجوة عصارية كبيرة دافعة النواة نحو جدار السيلولوز المستطيل</text>
                              </g>
                            ) : (
                              <g transform="translate(150, 90)">
                                {/* Fully differentiated cells based on selected type */}
                                {differentiationType === "stem" && (
                                  <>
                                    <text x="0" y="-55" fill="#10B981" className="text-[7.5px] font-extrabold text-center" textAnchor="middle">بقاء الخلية كخلية مرستيمية (تأسيسية)</text>
                                    {[-15, 15].map((cx, i) => (
                                      <g key={i} transform={`translate(${cx}, 0)`}>
                                        <ellipse cx="0" cy="0" rx="12" ry="12" fill="#047857" stroke="#34D399" strokeWidth="1.2" />
                                        <circle cx="0" cy="0" r="4.5" fill="#EF4444" />
                                      </g>
                                    ))}
                                    <text x="0" y="45" fill="#9CA3AF" className="text-[6.5px] text-center" textAnchor="middle">تستمر في الانقسامات لتأمين استمرارية نمو المحور الجذري</text>
                                  </>
                                )}

                                {differentiationType === "sieve" && (
                                  <>
                                    <text x="0" y="-55" fill="#F59E0B" className="text-[7.5px] font-extrabold text-center" textAnchor="middle">خلية غربالية تميزت للنسيج اللحائي (Phloem)</text>
                                    <g>
                                      {/* Sieve tube element outline */}
                                      <rect x="-20" y="-40" width="40" height="80" fill="#065F46" stroke="#D97706" strokeWidth="1.5" />
                                      
                                      {/* Sieve plate lines at ends */}
                                      <line x1="-20" y1="-30" x2="20" y2="-30" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
                                      <line x1="-20" y1="30" x2="20" y2="30" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
                                      
                                      {/* Sieve tube sap flow */}
                                      <motion.circle cx="0" cy="-25" r="2.5" fill="#F59E0B" animate={{ y: [-25, 25] }} transition={{ repeat: Infinity, duration: 2 }} />
                                      <motion.circle cx="-8" cy="-10" r="2.5" fill="#F59E0B" animate={{ y: [-15, 30] }} transition={{ repeat: Infinity, duration: 2.5 }} />
                                    </g>
                                    <text x="0" y="52" fill="#FDBA74" className="text-[6px] text-center" textAnchor="middle">غربال لحائي: فقدت الخلية نواتها تماماً لتأمين نقل المغذيات (النسغ الكامل)</text>
                                  </>
                                )}

                                {differentiationType === "xylem" && (
                                  <>
                                    <text x="0" y="-55" fill="#38BDF8" className="text-[7.5px] font-extrabold text-center" textAnchor="middle">وعاء خشبي ناقل مغلظ بالخشبين (Xylem Vessel)</text>
                                    <g>
                                      {/* Xylem thick woody walls */}
                                      <rect x="-18" y="-40" width="36" height="80" fill="#1E293B" stroke="#0284C7" strokeWidth="2.5" />
                                      
                                      {/* Lignin rings/coils */}
                                      <path d="M -16,-30 L 16,-20" stroke="#38BDF8" strokeWidth="1.5" />
                                      <path d="M -16,-10 L 16,0" stroke="#38BDF8" strokeWidth="1.5" />
                                      <path d="M -16,10 L 16,20" stroke="#38BDF8" strokeWidth="1.5" />
                                      
                                      {/* Sap minerals flowing upward */}
                                      <motion.circle cx="0" cy="30" r="2" fill="#38BDF8" animate={{ y: [30, -30] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                                      <motion.circle cx="-6" cy="15" r="2" fill="#38BDF8" animate={{ y: [20, -40] }} transition={{ repeat: Infinity, duration: 1.8 }} />
                                    </g>
                                    <text x="0" y="52" fill="#93C5FD" className="text-[6px] text-center" textAnchor="middle">أنبوب خشبي ميت ذو جدران عرضية متلاشية ومغلظة بالخشبين لنقل النسغ الناقص</text>
                                  </>
                                )}

                                {differentiationType === "hair" && (
                                  <>
                                    <text x="0" y="-55" fill="#10B981" className="text-[7.5px] font-extrabold text-center" textAnchor="middle">وبيرة ماصة لامتصاص المحاليل الترابية (Root Hair)</text>
                                    <g>
                                      {/* Cell with a huge root hair protrusion to the right */}
                                      <path d="M -40,-25 L 0,-25 L 0,-15 L 50,-15 C 55,-15 55,15 50,15 L 0,15 L 0,25 L -40,25 Z" fill="#065F46" stroke="#059669" strokeWidth="1.5" />
                                      {/* Enormous vacuole extending inside root hair */}
                                      <path d="M -30,-15 L -2,-15 L -2,-8 L 46,-8 C 48,-8 48,8 46,8 L -2,8 L -2,15 L -30,15 Z" fill="rgba(14, 165, 233, 0.2)" stroke="#38BDF8" strokeWidth="0.5" />
                                      {/* Water drops being absorbed */}
                                      <motion.circle cx="58" cy="0" r="2" fill="#38BDF8" animate={{ x: [58, 20], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
                                    </g>
                                    <text x="0" y="47" fill="#84CC16" className="text-[6.5px] text-center" textAnchor="middle">زاد سطح التماس الوبري لامتصاص المياه الجوفية والمعادن بكفاءة</text>
                                  </>
                                )}
                              </g>
                            )}
                          </svg>
                          <span className="text-[10px] text-gray-455 leading-relaxed text-center">
                            التمايز الخلوي: لاحظ تغير البنى الخلوية وعضيات الخلايا الجذعية مع تغير الأيام ونوع التخصص النسيجي.
                          </span>
                        </div>
                      );
                    })()}

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* Curriculum explanation bottom container */}
            <div className={`mt-8 p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 text-right transition-all ${
              isDarkMode ? "bg-[#11132D]/40 border-[#20234E]" : "bg-indigo-50/60 border-indigo-100"
            }`}>
              <div className="flex gap-3">
                <span className="text-xl">🎓</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-indigo-400">التعلم التجريبي وبناء الكفاءات الختامية</h4>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 leading-relaxed max-w-3xl">
                    تعتبر بيئة التجارب الافتراضية مسانداً قوياً للدروس النظرية المقررة بالثانوي والمتوسط في الجزائر، حيث يتمكن التلميذ من استكشاف "قانون بويل للغازات" أو "المعايرة اللونية" بيسر وتفادي النقص العتادي في المختبرات الواقعية.
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-mono shrink-0">BELAALZOUG • COMPILING SUCCESS 2026</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
