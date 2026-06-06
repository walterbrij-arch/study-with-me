import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Download, 
  Loader2, 
  AlertCircle,
  RotateCw,
  RefreshCw
} from "lucide-react";

// Configure worker to run out-of-process for butter-smooth UI performance
// We dynamically fetch the matching worker version from unpkg or cdnjs
const PDF_JS_VERSION = pdfjsLib.version || "6.0.227";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDF_JS_VERSION}/build/pdf.worker.min.mjs`;

interface EmbeddedPDFViewerProps {
  url: string;
  onDownload?: () => void;
  fileName?: string;
  isDarkMode?: boolean;
}

export const EmbeddedPDFViewer: React.FC<EmbeddedPDFViewerProps> = ({
  url,
  onDownload,
  fileName = "document.pdf",
  isDarkMode = true,
}) => {
  const [pdf, setPdf] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.25);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Lock browser scroll on body when displaying the expanded full screen exam modal
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  // Load PDF Document
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url,
          withCredentials: false
        });

        // Track loading progress if desired
        loadingTask.onProgress = (progressData) => {
          if (progressData.total > 0) {
            const percent = (progressData.loaded / progressData.total) * 100;
            if (active) setRenderProgress(Math.round(percent));
          }
        };

        const pdfDoc = await loadingTask.promise;
        if (!active) return;

        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        setLoading(false);
      } catch (err: any) {
        console.error("PDF loading error: ", err);
        if (active) {
          setError(
            "لم نتمكن من قراءة ملف الـ PDF برمجياً. قد يكون الملف تالفاً أو هناك قيود من الخادم."
          );
          setLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      active = false;
    };
  }, [url]);

  // Auto-fit to the container's crisp width whenever size or orientation changes
  useEffect(() => {
    if (pdf) {
      const timer = setTimeout(() => {
        fitWidth();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, pdf, rotation]);

  // Render Page with crisp resolution on Canvas
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    let active = true;

    const renderPage = async () => {
      try {
        setRendering(true);
        const page = await pdf.getPage(currentPage);
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        // Calculate scaled viewport
        const viewport = page.getViewport({ scale, rotation });

        // High-DPI support (Device Pixel Ratio) for extreme font crispness
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        context.scale(dpr, dpr);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // Cancel previous rendering operation if running
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (e) {
            // silent cancel
          }
        }

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;
        
        if (active) {
          setRendering(false);
        }
      } catch (err: any) {
        if (err.name !== "RenderingCancelledException") {
          console.error("Page render error:", err);
          if (active) setRendering(false);
        }
      }
    };

    renderPage();

    return () => {
      active = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {
          // silent cancel
        }
      }
    };
  }, [pdf, currentPage, scale, rotation]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const fitWidth = () => {
    if (containerRef.current && pdf) {
      pdf.getPage(currentPage).then((page: any) => {
        const viewport = page.getViewport({ scale: 1, rotation });
        const containerWidth = containerRef.current!.clientWidth - 32; // padding
        const newScale = containerWidth / viewport.width;
        setScale(Number(newScale.toFixed(2)));
      });
    }
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFitOrExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={isExpanded 
      ? "fixed inset-0 w-screen h-screen z-[9999] flex flex-col font-sans select-none bg-[#090a12] text-white animate-fade-in"
      : `w-full h-full flex flex-col font-sans select-none ${isDarkMode ? "bg-[#0b0c16] text-white" : "bg-gray-100 text-gray-900"}`
    }>
      
      {/* Interactive Toolbar */}
      <div className={`flex flex-wrap items-center justify-between p-3 border-b gap-3 shrink-0 ${
        isDarkMode 
          ? "bg-[#101124] border-[#1D1E3A] text-gray-100" 
          : "bg-white border-gray-200 text-gray-800 shadow-sm"
      }`}>
        
        {/* Back Button displayed when expanded or document name */}
        {isExpanded ? (
          <button
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl text-xs sm:text-xs font-extrabold shadow-lg transition-all duration-150 transform active:scale-95 outline-none hover:shadow-rose-950/40 animate-pulse"
            id="pdf-btn-exit-expanded"
            title="العودة وإغلاق وضع ملء الشاشة"
          >
            <span>↩️ العودة للخلف</span>
          </button>
        ) : (
          <div className="hidden sm:block text-xs font-bold text-gray-400">
            {fileName ? (fileName.length > 25 ? fileName.slice(0, 25) + "..." : fileName) : "معاينة الملف"}
          </div>
        )}

        {/* Page navigation (Arabic-friendly right-to-left layout) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNextPage}
            disabled={currentPage >= numPages || loading || error !== null}
            className={`p-1.5 rounded-lg transition-all ${
              isDarkMode 
                ? "hover:bg-slate-800 text-gray-300 disabled:opacity-30 disabled:hover:bg-transparent" 
                : "hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
            }`}
            title="الصفحة التالية"
            id="pdf-btn-next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 text-xs font-bold font-mono">
            <span>{currentPage}</span>
            <span className="text-gray-500">/</span>
            <span>{numPages || "--"}</span>
          </div>

          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || loading || error !== null}
            className={`p-1.5 rounded-lg transition-all ${
              isDarkMode 
                ? "hover:bg-slate-800 text-gray-300 disabled:opacity-30 disabled:hover:bg-transparent" 
                : "hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
            }`}
            title="الصفحة السابقة"
            id="pdf-btn-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Zoom & utility controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={zoomOut}
            disabled={loading || error !== null}
            className={`p-1.5 rounded-lg transition-all ${
              isDarkMode ? "hover:bg-slate-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"
            }`}
            title="تصغير"
            id="pdf-btn-zoomout"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-mono font-bold px-1 min-w-[45px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={zoomIn}
            disabled={loading || error !== null}
            className={`p-1.5 rounded-lg transition-all ${
              isDarkMode ? "hover:bg-slate-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"
            }`}
            title="تكبير"
            id="pdf-btn-zoomin"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <span className="h-4 w-[1px] bg-gray-700 mx-1"></span>

          {/* Toggle Full Screen and Fit width */}
          <button
            onClick={handleFitOrExpand}
            disabled={loading || error !== null}
            className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black ${
              isExpanded 
                ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md animate-bounce" 
                : "bg-blue-600/35 text-white hover:bg-blue-600"
            }`}
            title={isExpanded ? "تصغير ملائم للمقاس الطبيعي" : "عرض نموذج الاختبار بكامل الشاشة"}
            id="pdf-btn-fit"
          >
            <Maximize className="w-4 h-4" />
            <span>الكل</span>
          </button>

          <button
            onClick={rotate}
            disabled={loading || error !== null}
            className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold ${
              isDarkMode ? "hover:bg-slate-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"
            }`}
            title="تدوير الصفحة"
            id="pdf-btn-rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Download action directly inside PDF */}
        {onDownload && (
          <button
            onClick={onDownload}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
            title="تحميل مستند الـ PDF"
            id="pdf-btn-download"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تحميل مباشر</span>
          </button>
        )}
      </div>

      {/* PDF Viewport Canvas Container */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-auto p-4 flex justify-center items-start relative focus:outline-none ${
          isExpanded ? "bg-[#05060b]" : ""
        }`}
        style={{ scrollBehavior: "smooth" }}
      >
        {loading && (
          <div className="absolute inset-0 bg-[#0b0c16]/90 flex flex-col items-center justify-center gap-3 z-10 p-6 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <div className="space-y-1">
              <h5 className="font-bold text-sm">جاري تنزيل وقراءة ملف الـ PDF...</h5>
              <p className="text-[10px] text-gray-400 font-mono">التقدم: {renderProgress}%</p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto my-auto p-6 bg-red-950/20 border border-red-500/30 rounded-2xl text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h5 className="font-extrabold text-sm text-red-400">فشل تحميل مستند المعاينة</h5>
            <p className="text-xs text-gray-300 leading-relaxed">
              {error}
            </p>
            <div className="flex justify-center gap-2 pt-2">
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
                  id="pdf-btn-err-dl"
                >
                  تحميل الملف مباشرة لقراءته
                </button>
              )}
            </div>
          </div>
        )}

        {/* The PDF Page Canvas */}
        {!error && (
          <div className={`relative shadow-2xl transition-all border border-[#2d2e4d]/35 rounded ${
            isExpanded ? "my-4" : ""
          }`}>
            <canvas ref={canvasRef} className="block select-none" />
            
            {/* Soft overlay when rendering to avoid flickering */}
            {rendering && (
              <div className="absolute inset-0 bg-[#0b0c16]/40 flex items-center justify-center transition-opacity duration-300 pointer-events-none">
                <div className="p-3 bg-slate-900/90 rounded-2xl shadow-xl flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-[10px] text-gray-300 font-bold">جاري تحسين الكلمات...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
