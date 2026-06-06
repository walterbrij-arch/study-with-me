/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  School, 
  GraduationCap, 
  Newspaper, 
  Search, 
  Moon, 
  Sun, 
  LogIn, 
  LogOut, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  X, 
  Calendar, 
  User, 
  FileText, 
  CheckCircle, 
  Plus, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  FileCheck,
  BookmarkCheck,
  Info,
  Facebook,
  Instagram,
  Send,
  MessageSquare,
  Eye,
  Youtube
} from "lucide-react";
import { CardType, SubItemType, BranchType, PDFFile } from "./types";
import { saveFileBlob, getFileBlob, deleteFileBlob } from "./lib/db";
import { getMockExamData } from "./utils/mockExamData";
import AIChatBot from "./components/AIChatBot";
import VirtualLab from "./components/VirtualLab";
import { EmbeddedPDFViewer } from "./components/EmbeddedPDFViewer";

// كلمة المرور المعتمدة للوحة التحكم
const ADMIN_PASSWORD = "zabona";

// دالة لتوليد ملفات الـ PDF الافتراضية بدقة متناهية وسرعة خارقة
const generateInitialFiles = (): PDFFile[] => {
  const result: PDFFile[] = [];
  let counter = 1;

  // الطور الابتدائي (Level 2)
  const primaryYears = ["السنة 1 ابتدائي", "السنة 2 ابتدائي", "السنة 3 ابتدائي", "السنة 4 ابتدائي", "السنة 5 ابتدائي"];
  const primarySubjects = ["اللغة العربية", "الرياضيات", "التربية الإسلامية", "التربية المدنية", "التربية العلمية والتكنولوجية"];
  const primaryTabs = ["الفصل الأول", "الفصل الثاني", "الفصل الثالث", "ملخصات شاملة"];

  primaryYears.forEach(year => {
    primarySubjects.forEach(subject => {
      primaryTabs.forEach(tab => {
        result.push({
          id: `init-${counter++}`,
          levelId: 2,
          yearName: year,
          branchName: null,
          subjectName: subject,
          category: tab,
          name: tab === "ملخصات شاملة"
            ? `حقيبة ملخصات الدروس والنشاطات الشاملة - مادة ${subject} - ${year}`
            : `نموذج اختبار مقترح (${tab}) وتحضيري متميز - مادة ${subject} - ${year}`,
          size: "1.4 MB",
          type: "PDF"
        });
        result.push({
          id: `init-${counter++}`,
          levelId: 2,
          yearName: year,
          branchName: null,
          subjectName: subject,
          category: tab,
          name: tab === "ملخصات شاملة"
            ? `سلسلة تمارين وحلول الأنشطة الرسمية - مادة ${subject} - ${year}`
            : `نماذج فروض وواجبات منزلية مدعمة (${tab}) - مادة ${subject} - ${year}`,
          size: "2.2 MB",
          type: "PDF"
        });
      });
    });
  });

  // الطور المتوسط (Level 3)
  const middleYears = ["السنة 1 متوسط", "السنة 2 متوسط", "السنة 3 متوسط", "السنة 4 متوسط"];
  const middleSubjects = ["اللغة العربية", "الرياضيات", "العلوم الطبيعية", "العلوم الفيزيائية والتكنولوجيا", "التاريخ والجغرافيا", "التربية الإسلامية"];
  const middleCategories = [
    "فروض الفصل الأول", "اختبارات الفصل الأول",
    "فروض الفصل الثاني", "اختبارات الفصل الثاني",
    "فروض الفصل الثالث", "اختبارات الفصل الثالث",
    "ملخصات شاملة"
  ];

  middleYears.forEach(year => {
    middleSubjects.forEach(subject => {
      middleCategories.forEach(cat => {
        result.push({
          id: `init-${counter++}`,
          levelId: 3,
          yearName: year,
          branchName: null,
          subjectName: subject,
          category: cat,
          name: cat === "ملخصات شاملة"
            ? `دفتر ملخص المخططات والدروس الذهبية - مادة ${subject} - ${year}`
            : `نموذج مقترح ومعدل بصفة رسمية (${cat}) - مادة ${subject} - ${year}`,
          size: "1.9 MB",
          type: "PDF"
        });
        result.push({
          id: `init-${counter++}`,
          levelId: 3,
          yearName: year,
          branchName: null,
          subjectName: subject,
          category: cat,
          name: cat === "ملخصات شاملة"
            ? `سلسلة واجبات وتطبيقات نموذجية مكثفة - مادة ${subject} - ${year}`
            : `تمارين وتطبيقات مرافقة للحل بالتفصيل (${cat}) - مادة ${subject} - ${year}`,
          size: "2.4 MB",
          type: "PDF"
        });
      });

      // إضافة نماذج شهادة التعليم المتوسط (BEM) خصيصاً للسنة الرابعة متوسط
      if (year === "السنة 4 متوسط") {
        result.push({
          id: `init-${counter++}`,
          levelId: 3,
          yearName: year,
          branchName: null,
          subjectName: subject,
          category: "نماذج شهادة التعليم المتوسط",
          name: `الامتحان النموذجي المقترح لشهادة التعليم المتوسط BEM - مادة ${subject}`,
          size: "3.1 MB",
          type: "PDF"
        });
        result.push({
          id: `init-${counter++}`,
          levelId: 3,
          yearName: year,
          branchName: null,
          subjectName: subject,
          category: "نماذج شهادة التعليم المتوسط",
          name: `سلسلة مواضيع شهادة التعليم المتوسط للدورات السابقة مع الحلول - مادة ${subject}`,
          size: "2.8 MB",
          type: "PDF"
        });
      }
    });
  });

  // الطور الثانوي (Level 4)
  const secondaryYears = [
    { name: "السنة 1 ثانوي", branches: ["جذع مشترك علوم وتكنولوجيا", "جذع مشترك آداب"] },
    { name: "السنة 2 ثانوي", branches: ["علوم تجريبية", "رياضيات", "تقني رياضي", "تسيير واقتصاد", "آداب وفلسفة", "لغات أجنبية"] },
    { name: "السنة 3 ثانوي", branches: ["علوم تجريبية", "رياضيات", "تقني رياضي", "تسيير واقتصاد", "آداب وفلسفة", "لغات أجنبية"] }
  ];

  secondaryYears.forEach(yObj => {
    yObj.branches.forEach(branch => {
      const secSubjects = ["اللغة العربية", "الرياضيات", "العلوم الطبيعية", "العلوم الفيزيائية", "الفلسفة", "التاريخ والجغرافيا"];
      middleCategories.forEach(cat => {
        secSubjects.forEach(subject => {
          result.push({
            id: `init-${counter++}`,
            levelId: 4,
            yearName: yObj.name,
            branchName: branch,
            subjectName: subject,
            category: cat,
            name: cat === "ملخصات شاملة"
              ? `المجمع الميسر لتلخيص شامل دروس البكالوريا مادة ${subject} (${branch}) - ${yObj.name}`
              : `الفرض الشامل أو الامتحان التقييمي (${cat}) - مادة ${subject} - ${yObj.name}`,
            size: "2.8 MB",
            type: "PDF"
          });
        });
      });

      // إضافة نماذج شهادة البكالوريا (BAC) خصيصاً للسنة الثالثة ثانوي
      if (yObj.name === "السنة 3 ثانوي") {
        secSubjects.forEach(subject => {
          result.push({
            id: `init-${counter++}`,
            levelId: 4,
            yearName: yObj.name,
            branchName: branch,
            subjectName: subject,
            category: "نماذج امتحانات شهادة البكالوريا",
            name: `امتحان بكالوريا تجريبي مقترح ومحاكي للامتحان الرسمي - مادة ${subject} (${branch})`,
            size: "3.5 MB",
            type: "PDF"
          });
          result.push({
            id: `init-${counter++}`,
            levelId: 4,
            yearName: yObj.name,
            branchName: branch,
            subjectName: subject,
            category: "نماذج امتحانات شهادة البكالوريا",
            name: `الحوليات الرسمية لامتحانات شهادة البكالوريا لدورات سابقة مع التصحيح - مادة ${subject} (${branch})`,
            size: "4.1 MB",
            type: "PDF"
          });
        });
      }
    });
  });

  return result.map((file, index) => ({
    ...file,
    // Provide a solution flag (roughly 2/3 of the files have solutions)
    hasSolution: index % 3 !== 0
  }));
};

// دالة لجلب الأيقونة المناسبة لكل مادة دراسية
const getSubjectEmoji = (subject: string): string => {
  const name = subject.trim();
  if (name.includes("العربية")) return "✍️";
  if (name.includes("الرياضيات")) return "📐";
  if (name.includes("الإسلامية")) return "🕌";
  if (name.includes("المدنية")) return "⚖️";
  if (name.includes("العلمية")) return "🔬";
  if (name.includes("الفيزياء") || name.includes("الفيزيائية")) return "⚡";
  if (name.includes("الفنية")) return "🎨";
  if (name.includes("الرياضية") || name.includes("البدنية")) return "⚽";
  if (name.includes("الأمازيغية")) return "♓";
  if (name.includes("الفرنسية")) return "🇫🇷";
  if (name.includes("الإنجليزية")) return "🇬🇧";
  if (name.includes("الجغرافيا")) return "🗺️";
  if (name.includes("التاريخ")) return "⏳";
  if (name.includes("العلوم الطبيعية")) return "🌱";
  if (name.includes("الموسيقية")) return "🎵";
  if (name.includes("الإعلام الآلي")) return "💻";
  if (name.includes("التكنولوجيا")) return "⚙️";
  if (name.includes("الهندسة")) return "🏗️";
  if (name.includes("الاقتصاد")) return "📊";
  if (name.includes("المحاسبة")) return "🪙";
  if (name.includes("القانون")) return "📜";
  if (name.includes("الفلسفة")) return "🧠";
  if (name.includes("أجنبية ثالثة")) return "🌐";
  return "📘";
};

const autocompleteSuggestions = [
  "الدائرة المثلثية للزوايا والنسب",
  "موازنة المعادلات الكيميائية",
  "قانون نيوتن الثاني",
  "قانون أوم والتوصيل الكهربائي",
  "دافعة أرخميدس في السوائل",
  "انكسار الضوء (المجاهر والعدسات)",
  "علاقة فيثاغورس الهندسية",
  "المعايرة حمض-أساس كيميائياً",
  "النواس البسيط والحركة الاهتزازية",
  "قانون الغازات المثالية (P V = n R T)",
  "الطور الابتدائي",
  "الطور المتوسط",
  "الطور الثانوي",
  "السنة الأولى ابتدائي",
  "السنة الثانية ابتدائي",
  "السنة الثالثة ابتدائي",
  "السنة الرابعة ابتدائي",
  "السنة الخامسة ابتدائي",
  "السنة الأولى متوسط",
  "السنة الثانية متوسط",
  "السنة الثالثة متوسط",
  "السنة الرابعة متوسط",
  "السنة الأولى ثانوي",
  "السنة الثانية ثانوي",
  "السنة الثالثة ثانوي",
  "شعبة علوم تجريبية",
  "شعبة رياضيات",
  "شعبة تقني رياضي",
  "شعبة تسيير واقتصاد",
  "شعبة آداب وفلسفة",
  "شعبة لغات أجنبية"
];

const highlightMatch = (text: string, query: string) => {
  if (!query) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase()
          ? <span key={i} className="text-amber-500 dark:text-yellow-400 font-extrabold">{part}</span>
          : <span key={i} className="font-medium">{part}</span>
      )}
    </span>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<CardType | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("الفصل الأول");
  const [subTab, setSubTab] = useState<"فروض" | "اختبارات">("فروض");
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // حالات لوحة التحكم (Admin Panel Status)
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminTab, setAdminTab] = useState<"news" | "pdfs" | "socials">("news");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // مخزن روابط التواصل الاجتماعي القابلة للتخصيص الكامل
  const [socialLinks, setSocialLinks] = useState(() => {
    try {
      const saved = localStorage.getItem("belazzoug_social_links");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure tiktok and youtube properties exist if transitioning from old saved state
        if (!parsed.tiktok) parsed.tiktok = "https://tiktok.com/@study_with_me";
        if (!parsed.youtube) parsed.youtube = "https://youtube.com/@study_with_me";
        return parsed;
      }
    } catch(e) {}
    return {
      facebook: "https://facebook.com/study_with_me",
      instagram: "https://instagram.com/study_with_me",
      telegram: "https://t.me/study_with_me",
      whatsapp: "https://wa.me/213550000000",
      tiktok: "https://tiktok.com/@study_with_me",
      youtube: "https://youtube.com/@study_with_me"
    };
  });

  // مخزن ملفات الـ PDF الشامل والديناميكي
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>(() => {
    try {
      const saved = localStorage.getItem("belazzoug_pdf_files");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return generateInitialFiles();
  });

  // نماذج مدخلات ملف الـ PDF الجديد في لوحة الإدارة
  const [adminSelectedLevelId, setAdminSelectedLevelId] = useState<number>(2);
  const [adminSelectedYearName, setAdminSelectedYearName] = useState<string>("");
  const [adminSelectedBranchName, setAdminSelectedBranchName] = useState<string>("");
  const [adminSelectedSubjectName, setAdminSelectedSubjectName] = useState<string>("");
  const [adminSelectedCategory, setAdminSelectedCategory] = useState<string>("فروض الفصل الأول");
  const [adminFileName, setAdminFileName] = useState<string>("");
  const [adminFileSize, setAdminFileSize] = useState<string>("1.5 MB");
  const [selectedRealFile, setSelectedRealFile] = useState<File | null>(null);
  const [adminHasSolution, setAdminHasSolution] = useState<boolean>(true);

  // حالات معاينة ملفات الـ PDF دون تحميل (PDF Preview State)
  const [previewFile, setPreviewFile] = useState<PDFFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false);

  const openPreview = async (file: PDFFile) => {
    playSound();
    setLoadingPreview(true);
    setPreviewFile(file);

    let blob: Blob | null = null;
    if (file.id && file.id.startsWith("custom-")) {
      try {
        blob = await getFileBlob(file.id);
      } catch (e) {
        console.error("Failed to fetch custom file blob for preview", e);
      }
    }

    if (!blob) {
      // Create a polished mockup PDF
      const dummyContent = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 180 >>\nstream\nBT\n/F1 16 Tf\n70 780 Td\n(Study With Me - Educational Model Preview) Tj\n/F1 12 Tf\n0 -40 Td\n(File Name: ${file.name}) Tj\n/F1 10 Tf\n0 -25 Td\n(Category: ${file.category}) Tj\n0 -20 Td\n(Subject: ${file.subjectName}) Tj\n0 -20 Td\n(Class Year: ${file.yearName}) Tj\n0 -20 Td\n(File Size: ${file.size}) Tj\n0 -25 Td\n(Study With Me platform delivers ministry-approved prep modules.) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000212 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n306\n%%EOF`;
      blob = new Blob([dummyContent], { type: "application/pdf" });
    }

    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setLoadingPreview(false);
  };

  const closePreview = () => {
    playSound();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  const handleRealFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        alert("يرجى اختيار ملف بصيغة PDF فقط!");
        return;
      }
      setSelectedRealFile(file);
      // Automatically set the file name state (strip the .pdf extension if present)
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setAdminFileName(cleanName);
      
      // Calculate real file size and automatically select/match or set the file size state
      const sizeInMB = file.size / (1024 * 1024);
      setAdminFileSize(`${sizeInMB.toFixed(1)} MB`);
    }
  };

  // نماذج مدخلات الخبر الجديد
  const [newsCategory, setNewsCategory] = useState("أخبار وزارة التربية");
  const [newsTitle, setNewsTitle] = useState("");
  const [newsDesc, setNewsDesc] = useState("");
  const [newsDate, setNewsDate] = useState(new Date().toLocaleDateString('fr-CA'));

  // مصفوفة البيانات الإخبارية الديناميكية
  const [newsData, setNewsData] = useState<{ [key: string]: { title: string; date: string; desc: string }[] }>({
    "أخبار وزارة التربية": [
      { title: "تحديد رزنامة العطل المدرسية للسنة الدراسية الحالية", date: "2026/05/20", desc: "أعلنت وزارة التربية الوطنية رسمياً عن تفاصيل وفترات العطل المدرسية المعدلة لكافة الأطوار التعليمية الثلاثة." },
      { title: "انطلاق التسجيلات في بكالوريا 2026 عبر موقع الديوان", date: "2026/05/15", desc: "فتح الموقع الرسمي للديوان الوطني للامتحانات والمسابقات لاستقبال ملفات المترشحين الأحرار والنظاميين." }
    ],
    "إعلانات هامة": [
      { title: "هام: تغيير في توقيت اختبارات الفصل الثالث", date: "2026/05/25", desc: "نظراً للظروف التنظيمية تم تقديم بعض الاختبارات بـ 48 ساعة عبر مختلف المؤسسات التعليمية للتخفيف على الطلبة." }
    ],
    "جديد الموقع": [
      { title: "إضافة أزيد من 50 نموذج اختبار جديد للطور الثانوي والمتوسط", date: "2026/05/30", desc: "قمنا بتحديث بنك الفروض والاختبارات لمادة العلوم والفيزياء الموجهة للفصل الثالث." }
    ]
  });

  // إدارة تاريخ التنقل لزر الخلف والأمام
  const [historyStack, setHistoryStack] = useState<{ level: CardType | null; year: string | null; branch: string | null }[]>([]);
  const [forwardStack, setForwardStack] = useState<{ level: CardType | null; year: string | null; branch: string | null }[]>([]);

  // حفظ ملفات الـ PDF وروابط التواصل في المتصفح تلقائياً
  useEffect(() => {
    localStorage.setItem("belazzoug_pdf_files", JSON.stringify(pdfFiles));
  }, [pdfFiles]);

  useEffect(() => {
    localStorage.setItem("belazzoug_social_links", JSON.stringify(socialLinks));
  }, [socialLinks]);

  // إعادة ضبط الفلترة الفرعية عند تغيير المادة أو الفصل الدراسي لضمان عرض نظيف ومستوحى
  useEffect(() => {
    setSubTab("فروض");
  }, [selectedYear, selectedSubject, activeTab]);

  // التحقق الفوري للتأكد من شحن ملفات الـ BEM للرابعة متوسط والـ BAC للثالثة ثانوي حتى مع تخزين الكاش السابق للمستخدم
  useEffect(() => {
    const hasBem = pdfFiles.some(f => f.category === "نماذج شهادة التعليم المتوسط");
    const hasBac = pdfFiles.some(f => f.category === "نماذج امتحانات شهادة البكالوريا");
    if (!hasBem || !hasBac) {
      const initial = generateInitialFiles();
      const bemBacFiles = initial.filter(f => 
        f.category === "نماذج شهادة التعليم المتوسط" || 
        f.category === "نماذج امتحانات شهادة البكالوريا"
      );
      if (bemBacFiles.length > 0) {
        setPdfFiles(prev => {
          const filtered = prev.filter(f => 
            f.category !== "نماذج شهادة التعليم المتوسط" && 
            f.category !== "نماذج امتحانات شهادة البكالوريا"
          );
          return [...filtered, ...bemBacFiles];
        });
      }
    }
  }, []);

  // مزامنة حقول الإدارة بشكل آلي لتفادي الأخطاء
  useEffect(() => {
    const levelObj = cards.find(c => c.id === adminSelectedLevelId);
    if (levelObj && levelObj.subItems.length > 0) {
      const firstYear = levelObj.subItems[0].name;
      setAdminSelectedYearName(firstYear);
      
      if (adminSelectedLevelId === 4) {
        const firstBranch = levelObj.subItems[0].branches?.[0]?.name || "";
        setAdminSelectedBranchName(firstBranch);
        const subjects = levelObj.subItems[0].branches?.[0]?.subjects || [];
        setAdminSelectedSubjectName(subjects[0] || "");
      } else {
        setAdminSelectedBranchName("");
        const subjects = levelObj.subItems[0].subjects || [];
        setAdminSelectedSubjectName(subjects[0] || "");
      }
    }
  }, [adminSelectedLevelId]);

  useEffect(() => {
    const levelObj = cards.find(c => c.id === adminSelectedLevelId);
    if (levelObj) {
      const yearObj = levelObj.subItems.find(s => s.name === adminSelectedYearName);
      if (yearObj) {
        if (adminSelectedLevelId === 4) {
          const firstBranch = yearObj.branches?.[0]?.name || "";
          setAdminSelectedBranchName(firstBranch);
          const subjects = yearObj.branches?.[0]?.subjects || [];
          setAdminSelectedSubjectName(subjects[0] || "");
        } else {
          setAdminSelectedBranchName("");
          const subjects = yearObj.subjects || [];
          setAdminSelectedSubjectName(subjects[0] || "");
        }
      }
    }
  }, [adminSelectedYearName]);

  useEffect(() => {
    if (adminSelectedLevelId === 4) {
      const levelObj = cards.find(c => c.id === adminSelectedLevelId);
      const yearObj = levelObj?.subItems.find(s => s.name === adminSelectedYearName);
      const branchObj = yearObj?.branches?.find(b => b.name === adminSelectedBranchName);
      if (branchObj) {
        setAdminSelectedSubjectName(branchObj.subjects[0] || "");
      }
    }
  }, [adminSelectedBranchName]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const playSound = () => {
    try {
      const audio = new Audio('/click.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignored
    }
  };

  const resolveSearchAndNavigate = (query: string): boolean => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return false;

    // Mapping for Arabic written years to actual identifiers in the system
    const yearMapping: { key: string, levelId: number, name: string }[] = [
      { key: "الخامسة ابتدائي", levelId: 2, name: "السنة 5 ابتدائي" },
      { key: "الخامسة الابتادئي", levelId: 2, name: "السنة 5 ابتدائي" }, // typo support
      { key: "الخامسه ابتدائي", levelId: 2, name: "السنة 5 ابتدائي" },
      { key: "الخامسة", levelId: 2, name: "السنة 5 ابتدائي" }, // if they just search الخامسة
      { key: "السنة 5", levelId: 2, name: "السنة 5 ابتدائي" },
      { key: "5 ابتدائي", levelId: 2, name: "السنة 5 ابتدائي" },

      { key: "الرابعة ابتدائي", levelId: 2, name: "السنة 4 ابتدائي" },
      { key: "الرابعه ابتدائي", levelId: 2, name: "السنة 4 ابتدائي" },
      { key: "الرابعة", levelId: 2, name: "السنة 4 ابتدائي" },
      { key: "السنة 4", levelId: 2, name: "السنة 4 ابتدائي" },
      { key: "4 ابتدائي", levelId: 2, name: "السنة 4 ابتدائي" },

      { key: "الثالثة ابتدائي", levelId: 2, name: "السنة 3 ابتدائي" },
      { key: "الثالثه ابتدائي", levelId: 2, name: "السنة 3 ابتدائي" },
      { key: "الثالثة", levelId: 2, name: "السنة 3 ابتدائي" },
      { key: "السنة 3", levelId: 2, name: "السنة 3 ابتدائي" },
      { key: "3 ابتدائي", levelId: 2, name: "السنة 3 ابتدائي" },

      { key: "الثانية ابتدائي", levelId: 2, name: "السنة 2 ابتدائي" },
      { key: "الثانيه ابتدائي", levelId: 2, name: "السنة 2 ابتدائي" },
      { key: "الثانية", levelId: 2, name: "السنة 2 ابتدائي" },
      { key: "السنة 2", levelId: 2, name: "السنة 2 ابتدائي" },
      { key: "2 ابتدائي", levelId: 2, name: "السنة 2 ابتدائي" },

      { key: "الأولى ابتدائي", levelId: 2, name: "السنة 1 ابتدائي" },
      { key: "الاولى ابتدائي", levelId: 2, name: "السنة 1 ابتدائي" },
      { key: "الأولى", levelId: 2, name: "السنة 1 ابتدائي" },
      { key: "الاولى", levelId: 2, name: "السنة 1 ابتدائي" },
      { key: "السنة 1", levelId: 2, name: "السنة 1 ابتدائي" },
      { key: "1 ابتدائي", levelId: 2, name: "السنة 1 ابتدائي" },

      // المتوسط
      { key: "الرابعة متوسط", levelId: 3, name: "السنة 4 متوسط" },
      { key: "4 متوسط", levelId: 3, name: "السنة 4 متوسط" },
      { key: "الثالثة متوسط", levelId: 3, name: "السنة 3 متوسط" },
      { key: "3 متوسط", levelId: 3, name: "السنة 3 متوسط" },
      { key: "الثانية متوسط", levelId: 3, name: "السنة 2 متوسط" },
      { key: "2 متوسط", levelId: 3, name: "السنة 2 متوسط" },
      { key: "الأولى متوسط", levelId: 3, name: "السنة 1 متوسط" },
      { key: "الاولى متوسط", levelId: 3, name: "السنة 1 متوسط" },
      { key: "1 متوسط", levelId: 3, name: "السنة 1 متوسط" },

      // الثانوي
      { key: "الثالثة ثانوي", levelId: 4, name: "السنة 3 ثانوي" },
      { key: "3 ثانوي", levelId: 4, name: "السنة 3 ثانوي" },
      { key: "الثانية ثانوي", levelId: 4, name: "السنة 2 ثانوي" },
      { key: "2 ثانوي", levelId: 4, name: "السنة 2 ثانوي" },
      { key: "الأولى ثانوي", levelId: 4, name: "السنة 1 ثانوي" },
      { key: "الاولى ثانوي", levelId: 4, name: "السنة 1 ثانوي" },
      { key: "1 ثانوي", levelId: 4, name: "السنة 1 ثانوي" }
    ];

    // Find direct year match
    for (const item of yearMapping) {
      if (normalized.includes(item.key)) {
        const targetCard = cards.find(c => c.id === item.levelId);
        if (targetCard) {
          playSound();
          pushToHistory();
          setSelectedLevel(targetCard);
          setSelectedYear(item.name);
          setSelectedBranch(null);
          setSelectedSubject(null);
          setSelectedSemester(null);
          return true;
        }
      }
    }

    // Secondary matches, checking general phases
    if (normalized.includes("ابتدائي") || normalized.includes("الابتدائي")) {
      const targetCard = cards.find(c => c.id === 2);
      if (targetCard) {
        playSound();
        pushToHistory();
        setSelectedLevel(targetCard);
        setSelectedYear(null);
        setSelectedBranch(null);
        setSelectedSubject(null);
        setSelectedSemester(null);
        return true;
      }
    }
    if (normalized.includes("متوسط") || normalized.includes("المتوسط")) {
      const targetCard = cards.find(c => c.id === 3);
      if (targetCard) {
        playSound();
        pushToHistory();
        setSelectedLevel(targetCard);
        setSelectedYear(null);
        setSelectedBranch(null);
        setSelectedSubject(null);
        setSelectedSemester(null);
        return true;
      }
    }
    if (normalized.includes("ثانوي") || normalized.includes("الثانوي")) {
      const targetCard = cards.find(c => c.id === 4);
      if (targetCard) {
        playSound();
        pushToHistory();
        setSelectedLevel(targetCard);
        setSelectedYear(null);
        setSelectedBranch(null);
        setSelectedSubject(null);
        setSelectedSemester(null);
        return true;
      }
    }

    return false;
  };

  const handleSelectSuggestion = (suggestion: string) => {
    playSound();
    setSearchQuery(suggestion);
    setIsSearchFocused(false);
    
    // Attempt direct navigation first
    const navigated = resolveSearchAndNavigate(suggestion);
    if (!navigated) {
      // Auto-reset navigation to show main dashboard (enabling virtual lab match)
      setSelectedLevel(null);
      setSelectedYear(null);
      setSelectedBranch(null);
      setSelectedSubject(null);
      setSelectedSemester(null);
    }
  };

  const pushToHistory = () => {
    setHistoryStack((prev) => [...prev, { level: selectedLevel, year: selectedYear, branch: selectedBranch }]);
    setForwardStack([]);
  };

  const handleGoBack = () => {
    playSound();
    if (selectedSubject) {
      setSelectedSubject(null);
      return;
    }
    if (selectedSemester) {
      setSelectedSemester(null);
      return;
    }
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setForwardStack((prev) => [...prev, { level: selectedLevel, year: selectedYear, branch: selectedBranch }]);
    setHistoryStack((prev) => prev.slice(0, -1));
    
    setSelectedLevel(previous.level);
    setSelectedYear(previous.year);
    setSelectedBranch(previous.branch);
    setSelectedSubject(null);
    setSelectedSemester(null);
  };

  const handleGoForward = () => {
    if (forwardStack.length === 0) return;
    playSound();
    const next = forwardStack[forwardStack.length - 1];
    setHistoryStack((prev) => [...prev, { level: selectedLevel, year: selectedYear, branch: selectedBranch }]);
    setForwardStack((prev) => prev.slice(0, -1));

    setSelectedLevel(next.level);
    setSelectedYear(next.year);
    setSelectedBranch(next.branch);
    setSelectedSubject(null);
    setSelectedSemester(null);
  };

  const resetNavigation = () => {
    pushToHistory();
    setSelectedLevel(null);
    setSelectedYear(null);
    setSelectedBranch(null);
    setSelectedSubject(null);
    setSelectedSemester(null);
  };

  const triggerDownload = async (fileInput: PDFFile | { name: string; id?: string } | string) => {
    playSound();
    let fileName = "";
    let fileId: string | undefined = undefined;

    if (typeof fileInput === "string") {
      fileName = fileInput;
    } else {
      fileName = fileInput.name;
      fileId = fileInput.id;
    }

    setDownloadingFile(fileName);

    try {
      if (fileId && fileId.startsWith("custom-")) {
        // Try to get real file blob from IndexedDB
        const blob = await getFileBlob(fileId);
        if (blob) {
          // Trigger a real download!
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName.endsWith(".pdf") || fileName.endsWith("(PDF)") ? fileName : `${fileName}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          setDownloadingFile(null);
          setToastMessage(`تم تحميل ملف: "${fileName}" بنجاح! 📥`);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to read downloaded file from IndexedDB", err);
    }

    // Default simulation fallback + generating a dummy readable PDF
    setTimeout(() => {
      setDownloadingFile(null);
      
      try {
        const dummyContent = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 43 >>\nstream\nBT /F1 12 Tf 70 700 Td (Study With Me: ${fileName}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000212 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n306\n%%EOF`;
        const blob = new Blob([dummyContent], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName.endsWith(".pdf") || fileName.endsWith("(PDF)") ? fileName : `${fileName}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error("Fallback file download failure", e);
      }

      setToastMessage(`تم تحميل ملف: "${fileName}" بنجاح! 📥`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      playSound();
      setShowAdminLogin(false);
      setShowAdminDashboard(true);
      setLoginError("");
      setPasswordInput("");
    } else {
      setLoginError("كلمة المرور غير صحيحة! حاول مجدداً.");
    }
  };

  const handleAddNewNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsDesc) {
      alert("الرجاء ملء جميع الحقول المطلوبة!");
      return;
    }

    playSound();
    const newArticle = {
      title: newsTitle,
      date: newsDate.replace(/-/g, '/'),
      desc: newsDesc
    };

    setNewsData(prev => ({
      ...prev,
      [newsCategory]: [newArticle, ...prev[newsCategory]]
    }));

    setNewsTitle("");
    setNewsDesc("");
    setShowAdminDashboard(false);
    
    setToastMessage("تم نشر وإدراج الخبر بنجاح! 📢");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteNews = (category: string, titleToDelete: string) => {
    playSound();
    setNewsData(prev => ({
      ...prev,
      [category]: prev[category].filter(art => art.title !== titleToDelete)
    }));
    setToastMessage("تم حذف الخبر المختار بنجاح!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const cards: CardType[] = [
    { 
      id: 1, 
      title: "أخبار وإعلانات", 
      color: "bg-blue-600", hover: "hover:bg-blue-700", text: "text-blue-500", border: "border-blue-600/30", icon: "📢",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=500",
      subItems: [{ name: "أخبار وزارة التربية" }, { name: "إعلانات هامة" }, { name: "جديد الموقع" }] 
    },
    { 
      id: 2, 
      title: "الطور الابتدائي", 
      color: "bg-orange-600", hover: "hover:bg-orange-700", text: "text-orange-500", border: "border-orange-600/30", icon: "🎒",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500",
      subItems: [
        {
          name: "السنة 1 ابتدائي",
          subjects: ["اللغة العربية", "الرياضيات", "التربية الإسلامية", "التربية المدنية", "التربية العلمية والتكنولوجية", "التربية الفنية", "التربية البدنية والرياضية", "اللغة الأمازيغية"]
        },
        {
          name: "السنة 2 ابتدائي",
          subjects: ["اللغة العربية", "الرياضيات", "التربية الإسلامية", "التربية المدنية", "التربية العلمية والتكنولوجية", "التربية الفنية", "التربية البدنية والرياضية", "اللغة الفرنسية", "اللغة الأمازيغية"]
        },
        {
          name: "السنة 3 ابتدائي",
          subjects: ["اللغة العربية", "الرياضيات", "التربية الإسلامية", "التربية المدنية", "التربية العلمية والتكنولوجية", "التربية الفنية", "التربية البدنية والرياضية", "اللغة الفرنسية", "اللغة الإنجليزية", "اللغة الأمازيغية"]
        },
        {
          name: "السنة 4 ابتدائي",
          subjects: ["اللغة العربية", "الرياضيات", "التربية الإسلامية", "التاريخ", "الجغرافيا", "التربية المدنية", "التربية العلمية والتكنولوجية", "التربية الفنية", "التربية البدنية والرياضية", "اللغة الفرنسية", "اللغة الإنجليزية", "اللغة الأمازيغية"]
        },
        {
          name: "السنة 5 ابتدائي",
          subjects: ["اللغة العربية", "الرياضيات", "التربية الإسلامية", "التاريخ", "الجغرافيا", "التربية المدنية", "التربية العلمية والتكنولوجية", "التربية الفنية", "التربية البدنية والرياضية", "اللغة الفرنسية", "اللغة الإنجليزية", "اللغة الأمازيغية"]
        }
      ] 
    },
    { 
      id: 3, 
      title: "الطور المتوسط", 
      color: "bg-green-600", hover: "hover:bg-green-700", text: "text-green-500", border: "border-green-600/30", icon: "📖",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=500",
      subItems: [
        {
          name: "السنة 1 متوسط",
          subjects: ["اللغة العربية", "الرياضيات", "العلوم الطبيعية", "العلوم الفيزيائية والتكنولوجيا", "التاريخ والجغرافيا", "التربية الإسلامية", "التربية المدنية", "اللغة الفرنسية", "اللغة الإنجليزية", "الإعلام الآلي", "التربية الفنية", "التربية الموسيقية", "التربية البدنية والرياضية", "اللغة الأمازيغية"]
        },
        {
          name: "السنة 2 متوسط",
          subjects: ["اللغة العربية", "الرياضيات", "العلوم الطبيعية", "العلوم الفيزيائية والتكنولوجيا", "التاريخ والجغرافيا", "التربية الإسلامية", "التربية المدنية", "اللغة الفرنسية", "اللغة الإنجليزية", "الإعلام الآلي", "التربية الفنية", "التربية الموسيقية", "التربية البدنية والرياضية", "اللغة الأمازيغية"]
        },
        {
          name: "السنة 3 متوسط",
          subjects: ["اللغة العربية", "الرياضيات", "العلوم الطبيعية", "العلوم الفيزيائية والتكنولوجيا", "التاريخ والجغرافيا", "التربية الإسلامية", "التربية المدنية", "اللغة الفرنسية", "اللغة الإنجليزية", "الإعلام الآلي", "التربية الفنية", "التربية الموسيقية", "التربية البدنية والرياضية", "اللغة الأمازيغية"]
        },
        {
          name: "السنة 4 متوسط",
          subjects: ["اللغة العربية", "الرياضيات", "العلوم الطبيعية", "العلوم الفيزيائية", "التاريخ والجغرافيا", "التربية الإسلامية", "التربية المدنية", "اللغة الفرنسية", "اللغة الإنجليزية", "الإعلام الآلي", "التربية الفنية", "التربية الموسيقية", "التربية البدنية والرياضية", "اللغة الأمازيغية"]
        }
      ] 
    },
    { 
      id: 4, 
      title: "الطور الثانوي", 
      color: "bg-red-600", hover: "hover:bg-red-700", text: "text-red-500", border: "border-red-600/30", icon: "🎓",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=500",
      subItems: [
        { 
          name: "السنة 1 ثانوي", 
          branches: [
            { name: "جذع مشترك علوم وتكنولوجيا", subjects: ["اللغة العربية", "الرياضيات", "العلوم الطبيعية", "العلوم الفيزيائية", "التكنولوجيا", "الإعلام الآلي", "التاريخ والجغرافيا", "التربية الإسلامية", "التربية المدنية", "اللغة الفرنسية", "اللغة الإنجليزية", "اللغة الأمازيغية", "التربية البدنية والرياضية"] },
            { name: "جذع مشترك آداب", subjects: ["اللغة العربية", "الرياضيات", "التاريخ والجغرافيا", "التربية الإسلامية", "التربية المدنية", "اللغة الفرنسية", "اللغة الإنجليزية", "اللغة الأمازيغية", "الإعلام الآلي", "التربية البدنية والرياضية"] }
          ] 
        },
        { 
          name: "السنة 2 ثانوي", 
          branches: [
            { name: "علوم تجريبية", subjects: ["الرياضيات", "العلوم الطبيعية", "العلوم الفيزيائية", "اللغة العربية", "اللغة الفرنسية", "اللغة الإنجليزية", "التاريخ والجغرافيا", "التربية الإسلامية", "الفلسفة", "اللغة الأمازيغية", "التربية البدنية والرياضية"] },
            { name: "رياضيات", subjects: ["الرياضيات", "العلوم الفيزيائية", "العلوم الطبيعية", "اللغة العربية", "اللغة الفرنسية", "اللغة الإنجليزية", "التاريخ والجغرافيا", "التربية الإسلامية", "الفلسفة", "اللغة الأمازيغية", "التربية البدنية والرياضية"] },
            { name: "تقني رياضي", subjects: ["الرياضيات", "التكنولوجيا", "الهندسة الميكانيكية أو الكهربائية أو المدنية أو الطرائق", "العلوم الفيزيائية", "اللغة العربية", "اللغة الفرنسية", "اللغة الإنجليزية", "التاريخ والجغرافيا", "الفلسفة", "التربية الإسلامية", "اللغة الأمازيغية", "التربية البدنية والرياضية"] },
            { name: "تسيير واقتصاد", subjects: ["الاقتصاد والمناجمنت", "المحاسبة والرياضيات المالية", "الرياضيات", "القانون", "اللغة العربية", "اللغة الفرنسية", "اللغة الإنجليزية", "التاريخ والجغرافيا", "الفلسفة", "التربية الإسلامية", "اللغة الأمازيغية", "التربية البدنية والرياضية"] },
            { name: "آداب وفلسفة", subjects: ["اللغة العربية وآدابها", "الفلسفة", "التاريخ والجغرافيا", "اللغة الفرنسية", "اللغة الإنجليزية", "الرياضيات", "التربية الإسلامية", "اللغة الأمازيغية", "التربية البدنية والرياضية"] },
            { name: "لغات أجنبية", subjects: ["اللغة الإنجليزية", "اللغة الفرنسية", "لغة أجنبية ثالثة (حسب المؤسسة)", "اللغة العربية", "التاريخ والجغرافيا", "الفلسفة", "التربية الإسلامية", "الرياضيات", "اللغة الأمازيغية", "التربية البدنية والرياضية"] }
          ] 
        },
        { 
          name: "السنة 3 ثانوي", 
          branches: [
            { name: "علوم تجريبية", subjects: ["الرياضيات", "العلوم الطبيعية", "العلوم الفيزيائية", "اللغة العربية", "اللغة الفرنسية", "اللغة الإنجليزية", "التاريخ والجغرافيا", "التربية الإسلامية", "الفلسفة", "اللغة الأمازيغية", "التربية البدنية والرياضية"] },
            { name: "رياضيات", subjects: ["الرياضيات", "العلوم الفيزيائية", "العلوم الطبيعية", "اللغة العربية", "اللغة الفرنسية", "اللغة الإنجليزية", "التاريخ والجغرافيا", "التربية الإسلامية", "الفلسفة", "اللغة الأمازيغية", "التربية البدنية والرياضية"] },
            { name: "تقني رياضي", subjects: ["الرياضيات", "التكنولوجيا", "الهندسة الميكانيكية أو الكهربائية أو المدنية أو الطرائق", "العلوم الفيزيائية", "اللغة العربية", "اللغة الفرنسية", "اللغة الإنجليزية", "التاريخ والجغرافيا", "الفلسفة", "التربية الإسلامية", "اللغة الأمازيغية", "التربية البدنية والرياضية"] },
            { name: "تسيير واقتصاد", subjects: ["الاقتصاد والمناجمنت", "المحاسبة والرياضيات المالية", "الرياضيات", "القانون", "اللغة العربية", "اللغة الفرنسية", "اللغة الإنجليزية", "التاريخ والجغرافيا", "الفلسفة", "التربية الإسلامية", "اللغة الأمازيغية", "التربية البدنية والرياضية"] },
            { name: "آداب وفلسفة", subjects: ["اللغة العربية وآدابها", "الفلسفة", "التاريخ والجغرافيا", "اللغة الفرنسية", "اللغة الإنجليزية", "الرياضيات", "التربية الإسلامية", "اللغة الأمازيغية", "التربية البدنية والرياضية"] },
            { name: "لغات أجنبية", subjects: ["اللغة الإنجليزية", "اللغة الفرنسية", "لغة أجنبية ثالثة (حسب المؤسسة)", "اللغة العربية", "التاريخ والجغرافيا", "الفلسفة", "التربية الإسلامية", "الرياضيات", "اللغة الأمازيغية", "التربية البدنية والرياضية"] }
          ] 
        }
      ] 
    }
  ];

  const filteredCards = cards.filter(card => 
    card.title.includes(searchQuery) || 
    card.subItems.some(sub => sub.name.includes(searchQuery))
  );

  // جلب المواد ديناميكياً بدقة متناهية من المصفوفة الشاملة الفوقية
  const getSubjectsList = (): string[] => {
    if (!selectedLevel || !selectedYear) return [];
    const yearObj = selectedLevel.subItems.find(s => s.name === selectedYear);
    if (!yearObj) return [];
    
    if (selectedLevel.id === 4 && selectedBranch) {
      const branchObj = yearObj.branches?.find(b => b.name === selectedBranch);
      return branchObj ? branchObj.subjects : [];
    }
    return yearObj.subjects || [];
  };

  // جلب الملفات المرفقة من المخزن الديناميكي مباشرة
  const getSubjectFiles = (subject: string, year: string, category: string, branch?: string | null): PDFFile[] => {
    return pdfFiles.filter(f => 
      f.levelId === (selectedLevel?.id) &&
      f.yearName === year &&
      f.subjectName === subject &&
      f.category === category &&
      (selectedLevel?.id !== 4 || f.branchName === branch)
    );
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 font-sans relative pb-16 ${isDarkMode ? "bg-[#050510] text-[#E0E2EE]" : "bg-[#F5F7FA] text-gray-900"}`} dir="rtl">
      
      {/* توقيع النظام الحصري لبلعزوق أسفل يمين الموقع بشكل ثابت شفاف */}
      <div className="fixed bottom-3 right-3 text-[10px] text-gray-400 font-mono tracking-widest z-50 select-none pointer-events-none opacity-40">
        made by belazzoug
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }} 
            className="fixed bottom-6 left-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 font-bold text-xs flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مودال تسجيل الدخول للأدمن */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }} 
              className={`p-6 rounded-2xl border max-w-sm w-full space-y-4 shadow-xl ${isDarkMode ? "bg-[#10101C] border-[#22223A] text-white" : "bg-white border-gray-200 text-black"}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <span>🔑</span> الدخول الآمن للمشرف
                </h3>
                <button onClick={() => setShowAdminLogin(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAdminLoginSubmit} className="space-y-3">
                <input 
                  type="password" 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)} 
                  placeholder="أدخل كلمة مرور الإدارة..." 
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? "bg-[#18182E] border-gray-800 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
                  autoFocus
                />
                {loginError && (
                  <p className="text-red-500 text-[11px] text-center flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {loginError}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors">دخول</button>
                  <button type="button" onClick={() => setShowAdminLogin(false)} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}>إلغاء</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* لوحة تحكم نشر الأخبار */}
      <AnimatePresence>
        {showAdminDashboard && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 10 }} 
              className={`p-6 rounded-3xl border max-w-2xl w-full space-y-4 shadow-2xl my-8 ${isDarkMode ? "bg-[#0C0D1A] border-[#20223A]" : "bg-white border-gray-200"}`}
            >
              <div className="flex justify-between items-center border-b pb-3 border-gray-800/60">
                <h3 className="text-lg font-black text-blue-500 flex items-center gap-2">
                  <span>⚙️</span> لوحة المشرف الشاملة
                </h3>
                <button onClick={() => setShowAdminDashboard(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* أزرار تحديد الأقسام الداخلية */}
              <div className="flex gap-2 border-b border-gray-800/40 pb-3">
                {[
                  { id: "news", label: "📢 الأخبار والإعلانات" },
                  { id: "pdfs", label: "📁 ملفات الـ PDF" },
                  { id: "socials", label: "🔗 روابط التواصل" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAdminTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === tab.id ? "bg-blue-600 text-white" : `${isDarkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* محتوى القسم الحالي */}
              <div className="max-h-[500px] overflow-y-auto pr-1">
                {adminTab === "news" && (
                  <form onSubmit={handleAddNewNews} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-400">قسم الخبر:</label>
                      <select 
                        value={newsCategory} 
                        onChange={(e) => setNewsCategory(e.target.value)} 
                        className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? "bg-[#14152A] border-gray-800 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
                      >
                        <option value="أخبار وزارة التربية">📢 أخبار وزارة التربية</option>
                        <option value="إعلانات هامة">🚨 إعلانات هامة</option>
                        <option value="جديد الموقع">🆕 جديد الموقع</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-400">عنوان الخبر:</label>
                      <input 
                        type="text" 
                        value={newsTitle} 
                        onChange={(e) => setNewsTitle(e.target.value)} 
                        placeholder="اكتب العنوان هنا..." 
                        className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? "bg-[#14152A] border-gray-800 text-white" : "bg-gray-100 border-gray-300"}`} 
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-400">التاريخ:</label>
                      <input 
                        type="date" 
                        value={newsDate} 
                        onChange={(e) => setNewsDate(e.target.value)} 
                        className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? "bg-[#14152A] border-gray-800 text-white" : "bg-gray-100 border-gray-300"}`} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-400">التفاصيل:</label>
                      <textarea 
                        value={newsDesc} 
                        onChange={(e) => setNewsDesc(e.target.value)} 
                        rows={3} 
                        placeholder="اكتب المضمون هنا..." 
                        className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none resize-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? "bg-[#14152A] border-gray-800 text-white" : "bg-gray-100 border-gray-300"}`} 
                        required 
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md font-sans">✨ نشر الإعلان</button>
                      <button type="button" onClick={() => setShowAdminDashboard(false)} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300"}`}>إلغاء</button>
                    </div>
                  </form>
                )}

                {adminTab === "pdfs" && (
                  <div className="space-y-6">
                    {/* نموذج الإضافة */}
                    <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-[#121326] border-gray-800" : "bg-gray-50 border-gray-200"}`}>
                      <h4 className="text-xs font-black text-blue-400 mb-3">➕ إضافة ملف PDF جديد</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold">الطور التعليمي:</label>
                          <select
                            value={adminSelectedLevelId}
                            onChange={(e) => setAdminSelectedLevelId(Number(e.target.value))}
                            className={`w-full p-2 border rounded-lg text-xs ${isDarkMode ? "bg-[#1a1b36] border-gray-700 text-white" : "bg-white border-gray-350"}`}
                          >
                            <option value={2}>🎒 الطور الابتدائي</option>
                            <option value={3}>📖 الطور المتوسط</option>
                            <option value={4}>🎓 الطور الثانوي</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold">السنة الدراسية:</label>
                          <select
                            value={adminSelectedYearName}
                            onChange={(e) => setAdminSelectedYearName(e.target.value)}
                            className={`w-full p-2 border rounded-lg text-xs ${isDarkMode ? "bg-[#1a1b36] border-gray-700 text-white" : "bg-white border-gray-350"}`}
                          >
                            {cards.find(c => c.id === adminSelectedLevelId)?.subItems.map(s => (
                              <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                        </div>

                        {adminSelectedLevelId === 4 && (
                          <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold">الشعبة:</label>
                            <select
                              value={adminSelectedBranchName}
                              onChange={(e) => setAdminSelectedBranchName(e.target.value)}
                              className={`w-full p-2 border rounded-lg text-xs ${isDarkMode ? "bg-[#1a1b36] border-gray-700 text-white" : "bg-white border-gray-350"}`}
                            >
                              {cards.find(c => c.id === adminSelectedLevelId)?.subItems.find(s => s.name === adminSelectedYearName)?.branches?.map(b => (
                                <option key={b.name} value={b.name}>{b.name}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold">المادة الدراسية:</label>
                          <select
                            value={adminSelectedSubjectName}
                            onChange={(e) => setAdminSelectedSubjectName(e.target.value)}
                            className={`w-full p-2 border rounded-lg text-xs ${isDarkMode ? "bg-[#1a1b36] border-gray-700 text-white" : "bg-white border-gray-350"}`}
                          >
                            {(() => {
                              const levelObj = cards.find(c => c.id === adminSelectedLevelId);
                              const yearObj = levelObj?.subItems.find(s => s.name === adminSelectedYearName);
                              if (adminSelectedLevelId === 4) {
                                const branchObj = yearObj?.branches?.find(b => b.name === adminSelectedBranchName);
                                return branchObj?.subjects.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                )) || null;
                              }
                              return yearObj?.subjects?.map(s => (
                                <option key={s} value={s}>{s}</option>
                              )) || null;
                            })()}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold">التصنيف أو الفصل الدراسي:</label>
                          <select
                            value={adminSelectedCategory}
                            onChange={(e) => setAdminSelectedCategory(e.target.value)}
                            className={`w-full p-2 border rounded-lg text-xs ${isDarkMode ? "bg-[#1a1b36] border-gray-700 text-white" : "bg-white border-gray-350"}`}
                          >
                            <option value="فروض الفصل الأول">🍂 فروض الفصل الأول</option>
                            <option value="اختبارات الفصل الأول">🍂 اختبارات الفصل الأول</option>
                            <option value="فروض الفصل الثاني">❄️ فروض الفصل الثاني</option>
                            <option value="اختبارات الفصل الثاني">❄️ اختبارات الفصل الثاني</option>
                            <option value="فروض الفصل الثالث">🌱 فروض الفصل الثالث</option>
                            <option value="اختبارات الفصل الثالث">🌱 اختبارات الفصل الثالث</option>
                            <option value="ملخصات شاملة">📖 ملخصات شاملة</option>
                            <option value="نماذج شهادة التعليم المتوسط">🎯 نماذج شهادة التعليم المتوسط (BEM)</option>
                            <option value="نماذج امتحانات شهادة البكالوريا">🎓 نماذج امتحانات شهادة البكالوريا (BAC)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold">حجم الملف الكلي:</label>
                          <select
                            value={adminFileSize}
                            onChange={(e) => setAdminFileSize(e.target.value)}
                            className={`w-full p-2 border rounded-lg text-xs ${isDarkMode ? "bg-[#1a1b36] border-gray-700 text-white" : "bg-white border-gray-350"}`}
                          >
                            <option value="1.2 MB">1.2 MB</option>
                            <option value="1.5 MB">1.5 MB</option>
                            <option value="1.9 MB">1.9 MB</option>
                            <option value="2.4 MB">2.4 MB</option>
                            <option value="3.1 MB">3.1 MB</option>
                            <option value="4.5 MB">4.5 MB</option>
                            <option value="5.8 MB">5.8 MB</option>
                          </select>
                        </div>

                      </div>

                      {/* اختيار ملف حقيقي من الجهاز */}
                      <div className={`mt-3 p-4 border border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-500/5 group relative ${isDarkMode ? "border-gray-700 bg-gray-900/10" : "border-gray-300 bg-gray-50/50"}`} id="upload-zone">
                        <input
                          type="file"
                          accept="application/pdf"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleRealFileChange}
                        />
                        <div className="text-center space-y-1.5">
                          <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                            <Plus className="w-4 h-4" />
                          </div>
                          <div>
                            <p className={`text-xs font-bold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                              {selectedRealFile ? `✔️ تم اختيار: ${selectedRealFile.name}` : "📥 اختر ملف PDF حقيقي من لابتوبك (اختياري/موصى به)"}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {selectedRealFile ? `الحجم الفعلي: ${(selectedRealFile.size / (1024 * 1024)).toFixed(2)} MB` : "عند تحديد ملف، سنستخرج ونملأ الاسم والحجم تلقائياً!"}
                            </p>
                          </div>
                          {selectedRealFile && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSelectedRealFile(null);
                              }}
                              className="text-[10px] text-red-500 hover:text-red-400 font-bold underline mt-1 relative z-10"
                            >
                              إلغاء تحديد الملف
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 mt-3">
                        <label className="text-[10px] text-gray-400 font-bold">اسم ملف الـ PDF المعروض:</label>
                        <input
                          type="text"
                          value={adminFileName}
                          onChange={(e) => setAdminFileName(e.target.value)}
                          placeholder="مثال: الواجب المنزلي النموذجي أو الفرض المقترح الأول في مادة..."
                          className={`w-full p-2 border rounded-lg text-xs ${isDarkMode ? "bg-[#1a1b36] border-gray-700 text-white placeholder-gray-500" : "bg-[#FCFCFC] border-gray-300"}`}
                        />
                      </div>

                      {/* حالة وجود تصحيح أو حل للملف المرفوع */}
                      <div className={`flex items-center gap-2 mt-3 p-2.5 rounded-lg border border-dashed ${isDarkMode ? "border-[#222442] bg-[#14152A]/40" : "border-gray-200 bg-gray-50"}`}>
                        <input
                          type="checkbox"
                          id="adminHasSolution"
                          checked={adminHasSolution}
                          onChange={(e) => setAdminHasSolution(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="adminHasSolution" className={`text-xs font-bold ${isDarkMode ? "text-gray-200" : "text-gray-700"} cursor-pointer select-none`}>
                          ✔️ يتضمن التصحيح النموذجي (مرفق بالحل الكامل للتمارين)
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          if (!adminFileName) {
                            alert("الرجاء كتابة اسم الملف أولاً أو اختيار ملف حقيقي!");
                            return;
                          }
                          const newFileId = `custom-${Date.now()}`;
                          const newFileObj: PDFFile = {
                            id: newFileId,
                            levelId: adminSelectedLevelId,
                            yearName: adminSelectedYearName,
                            branchName: adminSelectedLevelId === 4 ? adminSelectedBranchName : null,
                            subjectName: adminSelectedSubjectName,
                            category: adminSelectedCategory,
                            name: adminFileName.endsWith(" (PDF)") || adminFileName.endsWith(".pdf") ? adminFileName : adminFileName + " (PDF)",
                            size: adminFileSize,
                            type: "PDF",
                            hasSolution: adminHasSolution
                          };
                          playSound();

                          if (selectedRealFile) {
                            try {
                              await saveFileBlob(newFileId, selectedRealFile);
                            } catch (err) {
                              console.error("Failed to save PDF to IndexedDB:", err);
                              alert("حدث خطأ أثناء حفظ الملف في ذاكرة المتصفح.");
                            }
                          }

                          setPdfFiles(prev => [newFileObj, ...prev]);
                          setAdminFileName("");
                          setSelectedRealFile(null);
                          setToastMessage(selectedRealFile ? "تم رفع وحفظ ملف الـ PDF الحقيقي بنجاح! 📁" : "تم إضافة ملف الـ PDF بنجاح! 📁");
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 2500);
                        }}
                        className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors font-sans"
                      >
                        ➕ إضافة وإدراج الملف بصفة رسمية
                      </button>
                    </div>

                    {/* قائمة البحث والحذف */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-blue-400">📁 الملفات المضافة بالموقع ({pdfFiles.length})</h4>
                        <button 
                          type="button"
                          onClick={() => {
                            if (confirm("هل أنت متأكد من رغبتك في إعادة تعيين كافة الملفات وحذف الإضافات المخصصة؟")) {
                              playSound();
                              setPdfFiles(generateInitialFiles());
                              setToastMessage("تم استرجاع الإعدادات الافتراضية للملفات.");
                              setShowToast(true);
                              setTimeout(() => setShowToast(false), 2500);
                            }
                          }}
                          className="text-[10px] text-amber-500 hover:underline font-mono"
                        >
                          🔄 إعادة ضبط كلي لجميع مستندات الوزارة الافتراضية
                        </button>
                      </div>

                      <div className="max-h-[220px] overflow-y-auto space-y-1.5 border border-gray-800/40 p-2 rounded-xl bg-[#090a14]">
                        {pdfFiles.slice(0, 150).map((file, idx) => (
                          <div key={file.id || idx} className="p-2 bg-[#121327]/80 rounded-lg flex justify-between items-center text-[11px] hover:bg-[#1a1b3a] transition-all border border-gray-800/35">
                            <div className="truncate pl-3">
                              <span className="font-bold text-blue-400 ml-1">[{file.yearName}]</span>
                              <span className="text-gray-400 ml-1">({file.subjectName})</span>
                              <span className="text-gray-200">{file.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                playSound();
                                if (file.id && file.id.startsWith("custom-")) {
                                  deleteFileBlob(file.id).catch(err => console.error(err));
                                }
                                setPdfFiles(prev => prev.filter(f => f.id !== file.id));
                                setToastMessage("تم حذف الملف المختار بنجاح!");
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 2000);
                              }}
                              className="text-red-500 hover:text-red-300 font-bold bg-red-500/10 px-2.5 py-1 rounded-md shrink-0 transition-all font-sans"
                            >
                              حذف
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {adminTab === "socials" && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-450 leading-relaxed font-sans">تتيح لك هذه اللوحة تغيير وتعديل روابط حسابات وسائل التواصل الاجتماعي المعروضة أعلى وبغلاف موقع "Study With Me" تلقائياً وبأيقونات تفاعلية.</p>
                    
                    <div className="space-y-3 font-sans">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1">🔵 رابط فايسبوك (Facebook):</label>
                        <input
                          type="url"
                          value={socialLinks.facebook}
                          onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? "bg-[#14152A] border-gray-800 text-white" : "bg-gray-100 border-gray-300"}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1">📸 رابط أنستغرام (Instagram):</label>
                        <input
                          type="url"
                          value={socialLinks.instagram}
                          onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? "bg-[#14152A] border-gray-800 text-white" : "bg-gray-100 border-gray-300"}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1">✈️ رابط تيليجرام (Telegram):</label>
                        <input
                          type="url"
                          value={socialLinks.telegram}
                          onChange={(e) => setSocialLinks({ ...socialLinks, telegram: e.target.value })}
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? "bg-[#14152A] border-gray-800 text-white" : "bg-gray-100 border-gray-300"}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1">💬 رابط واتساب (WhatsApp):</label>
                        <input
                          type="url"
                          value={socialLinks.whatsapp}
                          onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? "bg-[#14152A] border-[#2C2E4A] text-white" : "bg-gray-100 border-gray-300"}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1">🎵 رابط تيك توك (TikTok):</label>
                        <input
                          type="url"
                          value={socialLinks.tiktok || ""}
                          onChange={(e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value })}
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? "bg-[#14152A] border-[#2C2E4A] text-white" : "bg-gray-100 border-gray-300"}`}
                          placeholder="https://tiktok.com/@youraccount"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1">🔴 رابط يوتيوب (YouTube):</label>
                        <input
                          type="url"
                          value={socialLinks.youtube || ""}
                          onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? "bg-[#14152A] border-[#2C2E4A] text-white" : "bg-gray-100 border-gray-300"}`}
                          placeholder="https://youtube.com/@yourchannel"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playSound();
                        localStorage.setItem("belazzoug_social_links", JSON.stringify(socialLinks));
                        setToastMessage("تم حفظ روابط التواصل الاجتماعي الجديدة بنجاح! 🔗");
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 2500);
                        setShowAdminDashboard(false);
                      }}
                      className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl font-sans text-center transition-colors"
                    >
                      حفظ وتعميم روابط التواصل بالبوابة
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div 
            key="splash" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, y: -45 }} 
            transition={{ duration: 0.5 }} 
            className="flex flex-col items-center justify-center min-h-screen bg-[#05060F]"
          >
            <motion.div 
              animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
              className="text-8xl mb-6 drop-shadow-2xl filter"
            >
              🎓
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-wider bg-gradient-to-r from-white via-blue-300 to-indigo-500 bg-clip-text text-transparent">
              STUDY WITH ME
            </h1>
            <p className="text-blue-400 mt-3 text-sm font-bold font-mono tracking-widest text-[#a8b3ff]">
              بوابة الطالب الجزائري المميزة
            </p>
            <div className="mt-8 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-[11px] text-gray-500">جاري تحميل المنصة التعليمية...</span>
            </div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            
            <header className={`border-b backdrop-blur-md sticky top-0 z-40 px-3 py-2.5 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-4 ${isDarkMode ? "border-[#1D1E3A] bg-[#070814]/90" : "border-gray-200 bg-white/90"}`}>
              {/* Row 1 on Mobile: Brand logo & Title left (RTL), theme switch & Admin buttons right (RTL) */}
              <div className="flex items-center justify-between gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 cursor-pointer" onClick={resetNavigation}>
                  <div className="w-8 h-8 md:w-11 md:h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-lg md:text-2xl shadow-lg border border-blue-500/20">
                    🎓
                  </div>
                  <div>
                    <h2 className="text-sm md:text-xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">
                      Study With Me
                    </h2>
                    <p className="hidden md:block text-[10px] text-gray-400 font-bold">بوابتك للتفوق والتميّز الدراسي</p>
                  </div>
                </div>

                {/* Mobile-only header actions (Theme switch & Admin Panel right-aligned to match responsive needs) */}
                <div className="flex items-center gap-1.5 md:hidden">
                  <button 
                    onClick={() => { playSound(); setIsDarkMode(!isDarkMode); }} 
                    className={`w-7 h-7 rounded-full border flex items-center justify-center cursor-pointer text-xs transition-all ${isDarkMode ? "bg-[#14152A] border-[#2C2E4A] text-amber-400 hover:bg-[#1E1F3D]" : "bg-gray-100 border-gray-250 text-gray-800 hover:bg-gray-200"}`}
                    title={isDarkMode ? "تفعيل الوضع المضيء" : "تفعيل الوضع المظلم"}
                  >
                    {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-slate-800" />}
                  </button>
                  
                  {showAdminDashboard ? (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setShowAdminDashboard(true)} 
                        className="text-[9px] font-bold px-2 py-1 rounded bg-indigo-600/30 text-indigo-400 border border-indigo-500/10"
                      >
                        الإدارة
                      </button>
                      <button 
                        onClick={() => { playSound(); setShowAdminDashboard(false); setToastMessage("تم الخروج الآمن بنجاح"); setShowToast(true); setTimeout(() => setShowToast(false), 2000); }} 
                        className="p-1 bg-red-600/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                        title="خروج المشرف"
                      >
                        <LogOut className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { playSound(); setShowAdminLogin(true); }} 
                      className={`text-[9.5px] font-extrabold px-2.5 py-1 rounded-lg transition-all shadow-md flex items-center gap-1 ${isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"}`}
                    >
                      <LogIn className="w-3 h-3" />
                      لوحة المشرف
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2 on Mobile: Social Apps & History Navigation Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between md:justify-start gap-4 w-full md:w-auto relative select-none">
                <div className="flex items-center gap-2 border-none md:border-r md:border-[#2d2e4f] md:pr-3 md:mr-1">
                  
                  {/* High visibility glowing social apps for mobile - perfectly optimized and high-contrast */}
                  <div className="flex items-center gap-2 md:gap-2 justify-center">
                    <a 
                      href={socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-blue-600/30" 
                      title="فايسبوك"
                    >
                      <Facebook className="w-4.5 h-4.5 md:w-5 md:h-5 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                    </a>
                    <a 
                      href={socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-[#FD1D1D] via-[#E4405F] to-[#833AB4] text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-pink-600/30" 
                      title="أنستغرام"
                    >
                      <Instagram className="w-4.5 h-4.5 md:w-5 md:h-5 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                    </a>
                    <a 
                      href={socialLinks.tiktok || "https://tiktok.com"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-black text-white border border-[#ff0050] flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-purple-600/35" 
                      title="تيك توك"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 md:w-5 md:h-5 text-white filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                      </svg>
                    </a>
                    <a 
                      href={socialLinks.youtube || "https://youtube.com"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-red-600/35" 
                      title="يوتيوب"
                    >
                      <Youtube className="w-4.5 h-4.5 md:w-5 md:h-5 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                    </a>
                    <a 
                      href={socialLinks.telegram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#0088cc] text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-sky-500/35" 
                      title="تيليجرام"
                    >
                      <Send className="w-4.5 h-4.5 md:w-5 md:h-5 -rotate-44 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                    </a>
                    <a 
                      href={socialLinks.whatsapp} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-emerald-500/35" 
                      title="واتساب"
                    >
                      <MessageSquare className="w-4.5 h-4.5 md:w-5 md:h-5 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                    </a>
                  </div>

                  <span className="hidden sm:inline text-[9.5px] text-[#25D366]/90 dark:text-gray-400 font-extrabold tracking-tight">
                    تابعونا ليصلكم كل جديد ✨
                  </span>
                </div>

                {/* Back / Forward web history buttons & Pro Mode Promo Box */}
                <div className="flex flex-wrap items-center gap-2 border-r border-[#2d2e4f]/30 md:border-r-0 md:pr-0 md:mr-0 pr-2 mr-1">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={handleGoBack} 
                      disabled={historyStack.length === 0} 
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${historyStack.length > 0 ? (isDarkMode ? "bg-[#1E1F3D] text-white hover:bg-blue-600" : "bg-gray-100 text-black hover:bg-gray-200") : "opacity-25 cursor-not-allowed"}`} 
                      title="الرجوع للخلف"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={handleGoForward} 
                      disabled={forwardStack.length === 0} 
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${forwardStack.length > 0 ? (isDarkMode ? "bg-[#1E1F3D] text-white hover:bg-blue-600" : "bg-gray-100 text-black hover:bg-gray-200") : "opacity-25 cursor-not-allowed"}`} 
                      title="التقدم للأمام"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Pro Mode Promo Box */}
                  <div className={`p-1 px-2.5 rounded-xl border text-[10.5px] sm:text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                    isDarkMode 
                      ? "bg-[#121327] border-[#2C2E4A]/80 hover:border-amber-500/40 text-amber-300" 
                      : "bg-amber-50 border-amber-200 text-amber-950 hover:bg-amber-100/50"
                  }`} id="pro-mode-promo-badge">
                    <span className="flex h-1.5 w-1.5 relative shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                    </span>
                    <span className="text-[10px] md:text-[11px] leading-tight font-extrabold">
                      للإنتقال إلى الوضع الاحترافي تواصلوا معنا على الرقم:{" "}
                      <a href="tel:0656742905" className="font-extrabold text-blue-500 hover:text-blue-400 dark:text-amber-400 dark:hover:text-amber-300 underline select-all" dir="ltr">
                        0656742905
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3 on Mobile / Centered Search Bar on Desktop */}
              <div className="relative w-full md:w-1/3 max-w-md">
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                      setIsSearchFocused(false);
                      resolveSearchAndNavigate(searchQuery);
                    }
                  }}
                  placeholder="ابحث عن طور، سنة، مادة..." 
                  className={`w-full border rounded-xl py-1.5 md:py-2 px-3.5 pr-9 pl-4 text-xs focus:outline-none transition-colors ${isDarkMode ? "bg-[#14152A] border-[#2C2E4A] text-gray-200 focus:border-blue-500" : "bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500"}`} 
                />
                <span className="absolute right-3 top-2 md:top-2.5 text-gray-400">
                  <Search className="w-3.5 h-3.5" />
                </span>
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute left-3 top-2 md:top-2.5 text-gray-500 hover:text-red-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Search suggestion drop list */}
                <AnimatePresence>
                  {isSearchFocused && (() => {
                    const filteredSuggestions = searchQuery.trim().length >= 1
                      ? autocompleteSuggestions.filter(item => 
                          item.toLowerCase().includes(searchQuery.trim().toLowerCase()) &&
                          item.toLowerCase() !== searchQuery.trim().toLowerCase()
                        ).slice(0, 6)
                      : [];
                    
                    if (filteredSuggestions.length === 0) return null;

                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute left-0 right-0 mt-1.5 rounded-xl border z-50 overflow-hidden shadow-2xl backdrop-blur-md ${
                          isDarkMode 
                            ? "bg-[#14152A]/95 border-[#2C2E4A]/80 text-gray-200" 
                            : "bg-white/95 border-gray-200 text-gray-800"
                        }`}
                      >
                        <div className="py-1 max-h-60 overflow-y-auto divide-y divide-gray-800/10 dark:divide-gray-100/10">
                          {filteredSuggestions.map((item, index) => (
                            <button
                              key={index}
                              onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSelectSuggestion(item);
                              }}
                              className={`w-full text-right px-4 py-2.5 text-xs flex items-center justify-between font-bold transition-all cursor-pointer ${
                                isDarkMode 
                                  ? "text-gray-300 hover:bg-indigo-600/30 hover:text-white" 
                                  : "text-gray-700 hover:bg-slate-100"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Search className="w-3.5 h-3.5 opacity-60 text-blue-500" />
                                <span>{highlightMatch(item, searchQuery)}</span>
                              </div>
                              <span className="text-[10px] opacity-40 font-normal">إكمال تلقائي ⏎</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>

              {/* Desktop-only secondary top action container */}
              <div className="hidden md:flex items-center gap-3 w-full justify-end md:w-auto">
                <button 
                  onClick={() => { playSound(); setIsDarkMode(!isDarkMode); }} 
                  className={`w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer text-sm transition-all ${isDarkMode ? "bg-[#14152A] border-[#2C2E4A] text-amber-400 hover:bg-[#1E1F3D]" : "bg-gray-100 border-gray-250 text-gray-800 hover:bg-gray-200"}`}
                  title={isDarkMode ? "تفعيل الوضع المضيء" : "تفعيل الوضع المظلم"}
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-800" />}
                </button>
                
                {showAdminDashboard ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowAdminDashboard(true)} 
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30"
                    >
                      بوابة الإدارة
                    </button>
                    <button 
                      onClick={() => { playSound(); setShowAdminDashboard(false); setToastMessage("تم الخروج الآمن بنجاح"); setShowToast(true); setTimeout(() => setShowToast(false), 2000); }} 
                      className="text-xs bg-red-600/20 text-red-400 px-2.5 py-1.5 rounded-lg hover:bg-red-500/35 hover:text-red-200 flex items-center gap-1 transition-colors"
                      title="خروج المشرف"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { playSound(); setShowAdminLogin(true); }} 
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-md flex items-center gap-1.5 ${isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"}`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    لوحة المشرف
                  </button>
                )}
              </div>
            </header>

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
              <AnimatePresence mode="wait">
                
                {/* 1. العرض الرئيسي (اختيار الطور الدراسي) */}
                {!selectedLevel ? (
                  <motion.div 
                    key="main-view" 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -15 }}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 my-8 text-right">
                      <div className="space-y-4 max-w-2xl">
                        <h1 className="text-3xl md:text-5xl font-black leading-tight">
                          رحلتك التعليمية تبدأ من هنا ✨
                        </h1>
                        <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed">
                          أهلاً بك في منصتك الشاملة. تصفح أحدث الفروض والامتحانات الرسمية، الحلول المفصلة، والمراجعات الذهبية المتجانسة تماماً مع معايير ومناهج وزارة التربية الوطنية الجزائرية.
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className={`p-4 rounded-2xl border text-center flex-1 sm:w-40 relative group overflow-hidden transition-all ${isDarkMode ? "bg-[#111224] border-[#22243e]" : "bg-white border-gray-200 shadow-sm"}`}>
                          <div className="text-2xl mb-1">📅</div>
                          <div className="text-xs font-bold text-gray-200 dark:text-gray-200">الدراسة الذكية</div>
                        </div>
                        <div className={`p-4 rounded-2xl border text-center flex-1 sm:w-40 transition-all ${isDarkMode ? "bg-[#111224] border-[#22243e]" : "bg-white border-gray-200 shadow-sm"}`}>
                          <div className="text-2xl mb-1">🌟</div>
                          <div className="text-xs font-bold text-gray-200 dark:text-gray-200">جودة المناهج</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-1">امتحانات مُنقحة</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                      {filteredCards.map((card) => (
                        <div 
                          key={card.id} 
                          className={`border rounded-2xl overflow-hidden shadow-2xl flex flex-col hover:shadow-blue-900/10 hover:scale-[1.02] transition-all duration-300 ${isDarkMode ? "bg-[#111224] border-[#2D2F4F]/60" : "bg-white border-gray-200"}`}
                        >
                          <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? "bg-[#14152A] border-[#20223E]" : "bg-gray-50 border-gray-200"}`}>
                            <span className={`font-bold text-sm flex items-center gap-2 ${card.text}`}>
                              <span className="text-lg">{card.icon}</span> {card.title}
                            </span>
                            <span className="text-[11px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                              {card.subItems.length} {card.id === 1 ? "أقسام" : "سنوات"}
                            </span>
                          </div>
                          
                          <div className="w-full h-36 overflow-hidden relative group">
                            <img 
                              src={card.image} 
                              alt={card.title} 
                              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                              referrerPolicy="no-referrer"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-70 ${isDarkMode ? "from-[#111224]" : "from-white"}`}></div>
                          </div>
                          
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-2 mb-4">
                              {card.subItems.map((sub, index) => (
                                <button 
                                  key={index} 
                                  onClick={() => { 
                                    playSound(); 
                                    pushToHistory(); 
                                    setSelectedLevel(card); 
                                    setSelectedYear(sub.name); 
                                    setSelectedBranch(null);
                                    setSelectedSubject(null);
                                  }} 
                                  className={`w-full flex items-center justify-between text-xs cursor-pointer border-b pb-2 transition-colors text-right ${isDarkMode ? "text-gray-400 border-gray-800/40 hover:text-white" : "text-gray-600 border-gray-100 hover:text-black"}`}
                                >
                                  <span className="font-medium flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                                    <span className="text-blue-500">🔹</span> {sub.name}
                                  </span>
                                  <span className="text-[10px] opacity-60">❮</span>
                                </button>
                              ))}
                            </div>
                            
                            {card.id === 1 && showAdminDashboard && (
                              <button 
                                onClick={() => { playSound(); setShowAdminDashboard(true); }}
                                className="w-full mt-2 py-2 border border-dashed border-blue-500/40 rounded-xl text-blue-400 hover:bg-blue-500/10 transition-colors text-xs font-bold"
                              >
                                ➕ إضافة منشور جديد
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* بيئة تجارب افتراضية مخصصة ومصنعة لبلعزوق */}
                    <VirtualLab isDarkMode={isDarkMode} searchQuery={searchQuery} />
                  </motion.div>
                ) : (
                  
                  /* 2. العرض التفريعي التفاعلي */
                  <motion.div 
                    key="deep-view" 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.98 }} 
                    className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#0E0F20] border-[#242646]" : "bg-white border-gray-200 shadow-xl"}`}
                  >
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5 mb-6 border-gray-800/60">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{selectedLevel.icon}</span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xl font-bold bg-[#1B1D38] px-3 py-1 rounded-xl text-blue-400">
                              {selectedLevel.title}
                            </span>
                            {selectedYear && (
                              <span className="text-sm font-semibold text-gray-300 bg-[#25284B] px-3 py-1 rounded-xl">
                                ➔ {selectedYear}
                              </span>
                            )}
                            {selectedBranch && (
                              <span className="text-sm font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-900/60 px-3 py-1 rounded-xl">
                                ➔ {selectedBranch}
                              </span>
                            )}
                            {selectedSemester && (
                              <span className="text-sm font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1 rounded-xl flex items-center gap-1.5 animate-pulse-subtle">
                                ➔ {selectedSemester}
                                <button 
                                  onClick={() => { playSound(); setSelectedSemester(null); }}
                                  className="text-[9px] bg-red-500/25 text-red-300 font-extrabold px-1.5 py-0.5 rounded-md hover:bg-red-500 hover:text-white transition-all cursor-pointer mr-1"
                                >
                                  تغيير 🔄
                                </button>
                              </span>
                            )}
                            {selectedSubject && (
                              <span className="text-sm font-bold text-amber-400 bg-amber-950/20 border border-amber-900/30 px-3 py-1 rounded-xl flex items-center gap-1.5">
                                ➔ <span className="text-base">{getSubjectEmoji(selectedSubject)}</span> {selectedSubject}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1.5">تصفح وحمل أفضل الفروض، ملخصات ونماذج اختبارات الفصول الرسمية.</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={resetNavigation} 
                        className={`text-xs font-bold px-4 py-2.5 rounded-xl border flex items-center gap-1.5 transition-colors ${isDarkMode ? "bg-[#16172F] border-gray-800 text-gray-300 hover:bg-gray-800" : "bg-gray-150 border-gray-300 text-gray-700 hover:bg-gray-250"}`}
                      >
                        🔙 الرئيسية
                      </button>
                    </div>

                    {/* أزرار الفصول */}
                    {(!selectedYear || selectedLevel.id === 1 || (selectedLevel.id === 4 && !selectedBranch) || !selectedSemester ? null : (
                      <div className="flex gap-2 border-b border-gray-800/40 pb-4 mb-6 overflow-x-auto scrollbar-thin">
                        {(() => {
                          const baseTabs = ["الفصل الأول", "الفصل الثاني", "الفصل الثالث", "ملخصات شاملة"];
                          if (selectedYear === "السنة 4 متوسط") {
                            baseTabs.push("نماذج شهادة التعليم المتوسط (BEM)");
                          } else if (selectedYear === "السنة 3 ثانوي") {
                            baseTabs.push("نماذج شهادة البكالوريا (BAC)");
                          }
                          return baseTabs.map((tab, tIdx) => (
                            <button 
                              key={tIdx} 
                              onClick={() => { playSound(); setActiveTab(tab); setSelectedSemester(tab); }} 
                              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === tab ? `${selectedLevel.color} text-white shadow-lg shadow-blue-900/20` : `${isDarkMode ? "bg-[#14152D] text-gray-400 hover:bg-[#202242] hover:text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}`}
                            >
                              {tab}
                            </button>
                          ));
                        })()}
                      </div>
                    ))}

                    <div className="mt-4">
                      
                      {/* أ) قسم الأخبار والإعلانات (بشكل كامل) */}
                      {selectedLevel.id === 1 && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {selectedLevel.subItems.map((sub, idx) => {
                            const articles = newsData[sub.name] || [];
                            return (
                              <div key={idx} className={`p-5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? "bg-[#111225] border-[#292A47]/60" : "bg-gray-50 border-gray-250"}`}>
                                <div>
                                  <div className="flex justify-between items-center mb-4 border-b border-gray-800/30 pb-2.5">
                                    <h3 className="font-bold text-sm text-blue-400 flex items-center gap-1.5">
                                      <span>📢</span> {sub.name}
                                    </h3>
                                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full font-bold">
                                      {articles.length} منشورات
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                                    {articles.map((art, aIdx) => (
                                      <div key={aIdx} className={`p-4 rounded-xl border transition-all relative group ${isDarkMode ? "bg-[#171830] border-gray-800/60 hover:border-blue-500/30" : "bg-white border-gray-200 hover:shadow-md"}`}>
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                          <h4 className="font-bold text-xs text-gray-200 leading-relaxed dark:text-gray-100">{art.title}</h4>
                                          <span className="text-[9px] text-gray-500 font-mono whitespace-nowrap">{art.date}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-400 leading-relaxed">{art.desc}</p>
                                        
                                        {showAdminDashboard && (
                                          <button 
                                            onClick={() => handleDeleteNews(sub.name, art.title)} 
                                            className="absolute left-2 bottom-2 text-[10px] text-red-500 hover:text-red-300 font-bold bg-red-500/10 px-2 py-0.5 rounded transition-all opacity-0 group-hover:opacity-100"
                                            title="حذف هذا المنشور"
                                          >
                                            حذف
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                    
                                    {articles.length === 0 && (
                                      <div className="text-center py-10 flex flex-col items-center justify-center text-gray-500">
                                        <Info className="w-8 h-8 mb-2 opacity-50" />
                                        <p className="text-xs">لا توجد أخبار مدرجة في هذا القسم حالياً.</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {showAdminDashboard && (
                                  <button 
                                    onClick={() => { playSound(); setNewsCategory(sub.name); setShowAdminDashboard(true); }}
                                    className="w-full mt-4 py-2 bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600 text-blue-400 hover:text-white transition-all text-xs font-bold rounded-xl"
                                  >
                                    ➕ إضافة خبر إلى {sub.name}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}


                      {/* ب) اختيار الشعبة للطور الثانوي قبل عرض المواد */}
                      {selectedLevel.id === 4 && !selectedBranch && selectedYear && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-extrabold text-blue-400 mb-4 flex items-center gap-1">
                            <span>📚</span> اختر شعبتك للسنة الدراسية: {selectedYear}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedLevel.subItems
                              .find(s => s.name === selectedYear)
                              ?.branches?.map((branchObj, bIdx) => (
                                <div 
                                  key={bIdx} 
                                  onClick={() => { 
                                    playSound(); 
                                    pushToHistory(); 
                                    setSelectedBranch(branchObj.name); 
                                    setSelectedSubject(null);
                                  }} 
                                  className={`p-5 rounded-2xl border cursor-pointer hover:border-blue-500 hover:scale-[1.01] transition-all flex flex-col justify-between ${isDarkMode ? "bg-[#14152E] border-gray-800" : "bg-white border-gray-250 shadow-sm"}`}
                                >
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center text-xs font-bold">
                                        🏫
                                      </div>
                                      <h4 className="font-bold text-xs text-gray-200 dark:text-gray-100">{branchObj.name}</h4>
                                    </div>
                                    <p className="text-[10px] text-gray-500 line-clamp-2">تشمل مواد الشعبة المقررة: {branchObj.subjects.join("، ")}</p>
                                  </div>
                                  <div className="flex justify-end items-center mt-4">
                                    <span className="text-[10px] text-blue-400 font-bold flex items-center gap-1">
                                      تصفح المواد والملفات ◀
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}


                      {/* د) واجهة اختيار الفصل الدراسي أو الملخص الشامل (الطلعة الخاصة) */}
                      {selectedYear && selectedLevel.id !== 1 && (selectedLevel.id !== 4 || selectedBranch) && !selectedSemester && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-8 py-4"
                        >
                          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
                            <span className="text-3xl">🌸</span>
                            <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                              اختر المحطة الدراسية المطلوبة
                            </h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              الرجاء اختيار أحد الفصول الدراسية الثلاثة أو الانتقال مباشرة إلى قائمة الملخصات الشاملة المخصصة للتحضير والمراجعة المستمرة.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
                            {(() => {
                              const semesters = [
                                {
                                  name: "الفصل الأول",
                                  icon: "🍂",
                                  desc: "اختبارات وفروض ونماذج الثلاثي الأول من الموسم الدراسي.",
                                  color: "border-amber-500/20 hover:border-amber-500/80 bg-amber-500/5",
                                  iconBg: "bg-amber-500/10 text-amber-400",
                                  btnColor: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black",
                                  badge: "الثلاثي الأول"
                                },
                                {
                                  name: "الفصل الثاني",
                                  icon: "❄️",
                                  desc: "ملفات تقييمية وحصائل شاملة للثلاثي الدراسي الثاني.",
                                  color: "border-cyan-500/20 hover:border-cyan-500/80 bg-cyan-500/5",
                                  iconBg: "bg-cyan-500/10 text-cyan-400",
                                  btnColor: "bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black",
                                  badge: "الثلاثي الثاني"
                                },
                                {
                                  name: "الفصل الثالث",
                                  icon: "🌱",
                                  desc: "النماذج الختامية وفرص المراجعة لتأمين النجاح في الثلاثي الثالث.",
                                  color: "border-emerald-500/20 hover:border-emerald-500/80 bg-emerald-500/5",
                                  iconBg: "bg-emerald-500/10 text-emerald-400",
                                  btnColor: "bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black",
                                  badge: "الثلاثي الثالث"
                                },
                                {
                                  name: "ملخصات شاملة",
                                  icon: "📖",
                                  desc: "خرائط ذهنية وملخصات مكثفة تغطي جميع المواد طوال العام.",
                                  color: "border-orange-500/20 hover:border-orange-500/85 bg-orange-500/5",
                                  iconBg: "bg-orange-500/10 text-orange-400",
                                  btnColor: "bg-orange-500 hover:bg-orange-600 text-white font-black",
                                  badge: "مراجعة عامة"
                                }
                              ];

                              if (selectedYear === "السنة 4 متوسط") {
                                semesters.push({
                                  name: "نماذج شهادة التعليم المتوسط (BEM)",
                                  icon: "🎯",
                                  desc: "تجميعة شاملة للاختبارات الرسمية والمقترحات للشهادة الوطنية.",
                                  color: "border-indigo-500/20 hover:border-indigo-500/80 bg-indigo-500/5",
                                  iconBg: "bg-indigo-500/10 text-indigo-400",
                                  btnColor: "bg-indigo-600 hover:bg-indigo-700 text-white font-black",
                                  badge: "BEM شهادة"
                                });
                              } else if (selectedYear === "السنة 3 ثانوي") {
                                semesters.push({
                                  name: "نماذج شهادة البكالوريا (BAC)",
                                  icon: "🎓",
                                  desc: "المواضيع والحلول المعتمدة من الديوان الوطني للامتحانات والمسابقات.",
                                  color: "border-rose-500/20 hover:border-rose-500/80 bg-rose-500/5",
                                  iconBg: "bg-rose-500/10 text-rose-400",
                                  btnColor: "bg-rose-600 hover:bg-rose-700 text-white font-black",
                                  badge: "BAC شهادة"
                                });
                              }

                              return semesters.map((sem, sIdx) => (
                                <motion.div
                                  key={sIdx}
                                  whileHover={{ scale: 1.02 }}
                                  className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden group shadow-md ${
                                    isDarkMode ? sem.color : "bg-white border-gray-200 hover:shadow-xl"
                                  }`}
                                >
                                  {/* Absolute decorative accent circle */}
                                  <div className="absolute -left-12 -top-12 w-24 h-24 rounded-full bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
                                  
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${sem.iconBg} shadow-sm font-sans`}>
                                        {sem.icon}
                                      </div>
                                      <span className={`text-[9px] px-2.5 py-1 rounded-md font-extrabold uppercase select-none ${
                                        isDarkMode ? "bg-slate-800/80 text-gray-400" : "bg-gray-100 text-gray-500"
                                      }`}>
                                        {sem.badge}
                                      </span>
                                    </div>
                                    
                                    <div className="space-y-1.5 text-right">
                                      <h4 className={`font-black text-sm ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                                        {sem.name}
                                      </h4>
                                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-sans line-clamp-3">
                                        {sem.desc}
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => {
                                      playSound();
                                      setActiveTab(sem.name);
                                      setSelectedSemester(sem.name);
                                    }}
                                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-black text-center mt-5 cursor-pointer shadow-lg shadow-blue-500/5 flex items-center justify-center gap-1.5 transition-all ${sem.btnColor}`}
                                  >
                                    <span>تصفح المواد</span>
                                    <span>◀</span>
                                  </button>
                                </motion.div>
                              ));
                            })()}
                          </div>
                        </motion.div>
                      )}


                      {/* ج) عرض المواد والموارد للطور الابتدائي والكلور الآخر والثانوي بعد إكتمال الإختيار */}
                      {selectedYear && selectedLevel.id !== 1 && (selectedLevel.id !== 4 || selectedBranch) && selectedSemester && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                          
                          {/* عمود عرض قائمة المواد */}
                          <div className="lg:col-span-5 space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              <span>📂</span> المواد الدراسية المقررة:
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[600px] overflow-y-auto pr-1">
                              {getSubjectsList().map((subName, sIdx) => {
                                const isSel = selectedSubject === subName;
                                return (
                                  <button 
                                    key={sIdx} 
                                    onClick={() => { 
                                      playSound(); 
                                      setSelectedSubject(subName); 
                                      setTimeout(() => {
                                        const el = document.getElementById("models-section");
                                        if (el) {
                                          el.scrollIntoView({ behavior: "smooth", block: "start" });
                                        }
                                      }, 80);
                                    }} 
                                    className={`w-full p-3.5 rounded-xl border text-right transition-all cursor-pointer flex justify-between items-center ${isSel ? `border-blue-500 ${isDarkMode ? "bg-[#191C3E] text-white" : "bg-blue-50"}` : `${isDarkMode ? "bg-[#131429] border-[#25284B] hover:bg-[#1C1F3F] text-gray-300" : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"}`}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="w-8 h-8 rounded-lg bg-gray-500/10 dark:bg-slate-800/60 flex items-center justify-center text-base transition-transform group-hover:scale-110">
                                        {getSubjectEmoji(subName)}
                                      </span>
                                      <span className="text-xs font-bold">{subName}</span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${isSel ? "bg-[#252857] text-blue-400" : "bg-gray-800/30 text-gray-500"}`}>
                                      {activeTab === "ملخصات شاملة" ? "3 ملفات" : "3 نماذج"}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* عمود عرض نماذج الامتحانات والملخصات للمادة المحددة */}
                          <div className="lg:col-span-7" id="models-section">
                            <AnimatePresence mode="wait">
                              {selectedSubject && (selectedLevel.id === 3 || selectedLevel.id === 4) ? (
                                <motion.div 
                                  key={`ms-${selectedSubject}`} 
                                  initial={{ opacity: 0, x: 20 }} 
                                  animate={{ opacity: 1, x: 0 }} 
                                  exit={{ opacity: 0, x: -20 }}
                                  className="space-y-8"
                                >
                                  {/* ترويسة المادة الأنيقة */}
                                  <div className="flex justify-between items-center border-b pb-4 border-gray-800/40">
                                    <div className="flex items-center gap-2">
                                      <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl shadow-inner">
                                        {getSubjectEmoji(selectedSubject)}
                                      </div>
                                      <div>
                                        <h4 className="font-extrabold text-base text-gray-100 dark:text-gray-100">فهرس فصول مادة: {selectedSubject}</h4>
                                        <p className="text-[11px] text-gray-405 mt-0.5">تصفح المصنفات والموارد الموزعة فصلياً بدقة.</p>
                                      </div>
                                    </div>
                                    <span className="text-xs px-3.5 py-1.5 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-xl font-mono">
                                      {selectedYear}
                                    </span>
                                  </div>

                                  {/* مبدل فروض أو اختبارات للطور المتوسط والثانوي */}
                                  {["الفصل الأول", "الفصل الثاني", "الفصل الثالث"].includes(activeTab) && (
                                    <div className="mt-5 p-1.5 rounded-2xl bg-[#0e0f22] border border-[#22244c] max-w-md mx-auto flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => { playSound(); setSubTab("فروض"); }}
                                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                          subTab === "فروض"
                                            ? "bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20"
                                            : "text-gray-400 hover:text-white hover:bg-[#111226]/40"
                                        }`}
                                      >
                                        <span className="text-sm">📝</span>
                                        <span>نماذج الفروض الكلية</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => { playSound(); setSubTab("اختبارات"); }}
                                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                          subTab === "اختبارات"
                                            ? "bg-red-500 text-white font-extrabold shadow-lg shadow-red-500/20"
                                            : "text-gray-400 hover:text-white hover:bg-[#111226]/40"
                                        }`}
                                      >
                                        <span className="text-sm">✏️</span>
                                        <span>نماذج الاختبارات المقترحة</span>
                                      </button>
                                    </div>
                                  )}

                                  {/* فصول مصففة وجميلة */}
                                  {(() => {
                                    const chaptersList = [
                                      {
                                        title: "الفصل الأول",
                                        icon: "🍂",
                                        categories: [
                                          { name: "فروض الفصل الأول", label: "فروض الفصل الأول", color: "text-amber-400 bg-amber-500/5 border-amber-500/15" },
                                          { name: "اختبارات الفصل الأول", label: "اختبارات الفصل الأول", color: "text-red-400 bg-red-500/5 border-red-500/15" }
                                        ]
                                      },
                                      {
                                        title: "الفصل الثاني",
                                        icon: "❄️",
                                        categories: [
                                          { name: "فروض الفصل الثاني", label: "فروض الفصل الثاني", color: "text-amber-400 bg-amber-500/5 border-amber-500/15" },
                                          { name: "اختبارات الفصل الثاني", label: "اختبارات الفصل الثاني", color: "text-red-400 bg-red-500/5 border-red-500/15" }
                                        ]
                                      },
                                      {
                                        title: "الفصل الثالث",
                                        icon: "🌱",
                                        categories: [
                                          { name: "فروض الفصل الثالث", label: "فروض الفصل الثالث", color: "text-amber-400 bg-amber-500/5 border-amber-500/15" },
                                          { name: "اختبارات الفصل الثالث", label: "اختبارات الفصل الثالث", color: "text-red-400 bg-red-500/5 border-red-500/15" }
                                        ]
                                      },
                                      {
                                        title: "ملخصات ومراجعات شاملة",
                                        icon: "📖",
                                        categories: [
                                          { name: "ملخصات شاملة", label: "ملخصات الفصل والمراجعة العامة", color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/15" }
                                        ]
                                      }
                                    ];

                                    if (selectedYear === "السنة 4 متوسط") {
                                      chaptersList.push({
                                        title: "نماذج شهادة التعليم المتوسط (BEM)",
                                        icon: "🎯",
                                        categories: [
                                          { name: "نماذج شهادة التعليم المتوسط", label: "امتحانات شهادة التعليم المتوسط الرسمية والمقترحة", color: "text-indigo-400 bg-indigo-500/5 border-indigo-500/15" }
                                        ]
                                      });
                                    }

                                    if (selectedYear === "السنة 3 ثانوي") {
                                      chaptersList.push({
                                        title: "نماذج شهادة البكالوريا (BAC)",
                                        icon: "🎓",
                                        categories: [
                                          { name: "نماذج امتحانات شهادة البكالوريا", label: "امتحانات شهادة البكالوريا الرسمية والمقترحة مع الحلول", color: "text-rose-400 bg-rose-500/5 border-rose-500/15" }
                                        ]
                                      });
                                    }

                                    return chaptersList.filter((chapter) => {
                                      if (activeTab === "الفصل الأول") return chapter.title === "الفصل الأول";
                                      if (activeTab === "الفصل الثاني") return chapter.title === "الفصل الثاني";
                                      if (activeTab === "الفصل الثالث") return chapter.title === "الفصل الثالث";
                                      if (activeTab === "ملخصات شاملة") return chapter.title === "ملخصات ومراجعات شاملة";
                                      if (activeTab === "نماذج شهادة التعليم المتوسط (BEM)") return chapter.title === "نماذج شهادة التعليم المتوسط (BEM)";
                                      if (activeTab === "نماذج شهادة البكالوريا (BAC)") return chapter.title === "نماذج شهادة البكالوريا (BAC)";
                                      return true;
                                    });
                                  })().map((chapter, cIdx) => (
                                    <div key={cIdx} className={`p-5 rounded-2xl border transition-all ${isDarkMode ? "bg-[#111226]/80 border-[#222442]" : "bg-white border-gray-200 shadow-sm"}`}>
                                      <div className="flex items-center gap-2 mb-4 border-b border-gray-800/30 pb-2.5">
                                        <span className="text-xl">{chapter.icon}</span>
                                        <h4 className="font-extrabold text-sm text-blue-400">{chapter.title}</h4>
                                      </div>

                                      <div className="space-y-6">
                                        {chapter.categories
                                          .filter(cat => {
                                            if (!["الفصل الأول", "الفصل الثاني", "الفصل الثالث"].includes(activeTab)) return true;
                                            if (subTab === "فروض") return cat.name.includes("فروض");
                                            if (subTab === "اختبارات") return cat.name.includes("اختبارات");
                                            return true;
                                          })
                                          .map((cat, catIdx) => {
                                            const files = getSubjectFiles(selectedSubject, selectedYear, cat.name, selectedBranch);
                                            return (
                                              <div key={catIdx} className="space-y-3">
                                                <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border w-fit ${cat.color}`}>
                                                  📁 {cat.label}
                                                </div>

                                              {files.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-2.5">
                                                  {files.map((file, fIdx) => (
                                                    <div 
                                                      key={file.id || fIdx} 
                                                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors ${isDarkMode ? "bg-[#15172E] border-[#25284B] hover:border-[#3C417A]" : "bg-gray-50 border-gray-200"}`}
                                                    >
                                                      <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-red-600/15 border border-red-500/20 text-red-500 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                                          PDF
                                                        </div>
                                                        <div className="space-y-1">
                                                          <h5 className="font-bold text-xs text-slate-100 dark:text-gray-100 leading-relaxed mb-0.5 flex items-center gap-1.5 flex-wrap">
                                                            {file.hasSolution ? (
                                                <span className="text-emerald-400 text-sm" title="التصحيح متوفر">✔️</span>
                                              ) : (
                                                <span className="text-red-400 text-sm" title="التصحيح غير متوفر">❌</span>
                                              )}
                                              {file.name}
                                            </h5>
                                            <div className="flex flex-wrap items-center gap-2">
                                              <span className="text-[10px] text-gray-500">📂 المقاس: {file.size}</span>
                                              <span className="text-gray-700 dark:text-gray-600 text-[9px]">•</span>
                                              <span className="text-emerald-500 flex items-center gap-0.5 text-[10px] font-medium font-sans">
                                                <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                                                جاهز للتحميل
                                              </span>
                                              <span className="text-gray-700 dark:text-gray-600 text-[9px]">•</span>
                                              {file.hasSolution ? (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/15">
                                                  ✅ مع الحل النموذجي
                                                </span>
                                              ) : (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/15">
                                                  ⚠️ نموذج أسئلة فقط
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 w-full sm:w-auto mt-2 sm:mt-0 shrink-0">
                                          <button 
                                            onClick={() => openPreview(file)}
                                            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${isDarkMode ? "bg-[#1d1f3b] border-[#343864] hover:bg-[#282b54] text-blue-400" : "bg-white border-gray-300 hover:bg-gray-50 text-blue-600 shadow-sm"}`}
                                          >
                                            <Eye className="w-4 h-4" />
                                            معاينة سريعة
                                          </button>

                                          <button 
                                            onClick={() => triggerDownload(file)} 
                                            disabled={downloadingFile === file.name}
                                            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${downloadingFile === file.name ? "bg-amber-600 text-white cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/10"}`}
                                          >
                                            {downloadingFile === file.name ? (
                                              <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                جاري...
                                              </>
                                            ) : (
                                              <>
                                                <Download className="w-4 h-4" />
                                                تحميل مباشر
                                              </>
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-[10px] text-gray-500 pr-4">لا توجد ملفات مرفوعة حالياً في هذا الصنف.</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                                  <div className={`p-4 rounded-xl border flex items-start gap-2.5 ${isDarkMode ? "bg-[#14152E]/40 border-gray-800" : "bg-gray-50 border-gray-250"}`}>
                                    <span className="text-blue-400 mt-0.5 text-xs">💡</span>
                                    <div className="text-[10px] text-gray-400 leading-relaxed font-sans">
                                      جميع الملفات والنماذج المتوفرة معتمدة بصفة رسمية وتخضع للملف الوزاري المقترح لولاية الجزائر والولايات الأخرى. يُنصح بالتحضير الفردي وبذل الجهد قبل معاينة الحل المرافق للتمرين.
                                    </div>
                                  </div>
                                </motion.div>
                              ) : (
                                <div className="h-full min-h-[300px] border border-dashed border-gray-800/60 rounded-3xl flex flex-col items-center justify-center text-center p-6 text-gray-500">
                                  <div className="w-16 h-16 bg-blue-500/5 text-blue-500/40 rounded-full flex items-center justify-center text-3xl mb-3">
                                    <span className="inline-block rotate-90 sm:rotate-0">
                                      👈
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-sm text-gray-400">الرجاء تحديد مادة دراسية</h4>
                                  <p className="text-[11px] text-gray-500 mt-1 max-w-sm">اختر إحدى المواد المقررة من القائمة الجانبية لعرض كافة الفروض والاختبارات المحينة الخاصة بالفصل الدراسي المحدد.</p>
                                </div>
                              )}
                            </AnimatePresence>
                          </div>

                        </div>
                      )}

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* الحاشية الذهب للسلم والأطوار */}
            <footer className={`border-t py-8 mt-16 ${isDarkMode ? "border-[#1D1E3A] bg-[#05060F]" : "border-gray-200 bg-white"}`}>
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎓</span>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 font-mono">
                    &copy; {new Date().getFullYear()} Study With Me. كل الحقوق محفوظة.
                  </p>
                </div>
                <div className="flex gap-4 text-xs font-bold text-gray-450 dark:text-gray-400">
                  <button onClick={resetNavigation} className="hover:text-blue-400 transition-colors">بوابة الطلاب</button>
                  <span>•</span>
                  <button onClick={() => { playSound(); setShowAdminLogin(true); }} className="hover:text-blue-400 transition-colors">بوابة الإدارة</button>
                  <span>•</span>
                  <a href="mailto:contact@study.dz" className="hover:text-blue-400 transition-colors">الدعم الأكاديمي</a>
                </div>
              </div>
            </footer>

            {/* مودال معاينة ملفات الـ PDF (Interactive PDF Preview Portal) */}
            <AnimatePresence>
              {previewFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closePreview}
                    className="absolute inset-0 bg-black/70 backdrop-blur-md"
                  />

                  {/* Modal Container */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className={`relative w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10 border ${isDarkMode ? "bg-[#0b0c16] border-[#222442] text-white" : "bg-white border-gray-200 text-gray-900"}`}
                  >
                    {/* Modal Header */}
                    <div className={`p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDarkMode ? "border-[#1D1E3A] bg-[#0E0F1E]" : "border-gray-200 bg-gray-50"}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-600/15 border border-red-500/20 text-red-500 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                          PDF
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-sm sm:text-base leading-snug">{previewFile.name}</h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-gray-200 text-gray-700"}`}>
                              {previewFile.subjectName}
                            </span>
                            <span className="text-gray-500 text-[10px]">•</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-gray-200 text-gray-700"}`}>
                              {previewFile.category}
                            </span>
                            <span className="text-gray-500 text-[10px]">•</span>
                            {previewFile.hasSolution ? (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/15">
                                ✅ مرفق بالحل النموذجي الكامل
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/15">
                                ⚠️ نموذج اختبار أسئلة فقط
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Close button & actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() => triggerDownload(previewFile)}
                          disabled={downloadingFile === previewFile.name}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>تحميل الملف</span>
                        </button>
                        <button
                          onClick={closePreview}
                          className={`p-2 rounded-xl transition-colors ${isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-gray-300" : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-200"}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Modal Body / Embedder */}
                    <div className="flex-1 bg-[#0b0c16] relative flex overflow-hidden">
                      {loadingPreview ? (
                        <div className="flex-grow flex flex-col items-center justify-center gap-2 text-white">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                          <p className="text-xs font-bold font-sans">جاري تحضير واستعراض المستند الأكاديمي...</p>
                        </div>
                      ) : previewUrl ? (
                        <div className="w-full h-full relative">
                          <EmbeddedPDFViewer
                            url={previewUrl}
                            onDownload={() => triggerDownload(previewFile!)}
                            fileName={previewFile?.name}
                            isDarkMode={isDarkMode}
                          />
                        </div>
                      ) : (
                        <div className="text-center text-white space-y-2 p-6 flex-grow flex flex-col justify-center items-center">
                          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                          <p className="text-xs font-bold">حدث خطأ أثناء تحميل مستند المعاينة.</p>
                        </div>
                      )}
                    </div>

                    {/* Modal Footer Tip */}
                    <div className={`p-3.5 border-t text-center ${isDarkMode ? "border-[#1D1E3A] bg-[#0E0F1E]" : "border-gray-200 bg-gray-50"}`}>
                      <p className="text-[10px] text-gray-400">
                        💡 يمكنك تصفح كامل صفحات الملف، كتابة ملاحظاتك، وتحريك السطور مع زملائك. منصة "Study With Me" تتمنى لك الـتوفيق والسداد!
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
      <AIChatBot />
    </main>
  );
}
