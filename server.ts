import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Need large payload capability for base64 images
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// API routes FIRST
app.post("/api/chat", async (req, res) => {
  try {
    const { message, image, history } = req.body;
    
    // Check if GEMINI_API_KEY environment variable is defined
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined.");
      return res.status(400).json({ 
        error: "مفتاح API الخاص بـ Gemini غير متوفر. يرجى إضافته عبر الإعدادات (Settings > Secrets) في منصة AI Studio قبل الاستخدام." 
      });
    }

    // Lazy initialization of GoogleGenAI
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const parts: any[] = [];
    
    if (image) {
      // Parse base64 image data
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const data = match[2];
        parts.push({
          inlineData: {
            mimeType,
            data
          }
        });
      }
    }
    
    parts.push({ text: message });

    // Custom system instruction for Study With Me assistance
    const systemInstruction = 
      "أنت 'Study With Me AI'، مساعد ذكاء اصطناعي ودود، ملهم وعالي الذكاء مصمم خصيصاً لمساعدة الطلاب والأساتذة في الجزائر. " +
      "أنت متخصص في جميع المناهج والدراسات والبرامج التعليمية الرسمية الجزائرية للوزارة للطور الابتدائي، المتوسط والثانوي. " +
      "تساعد في حل الواجبات المنزلية، الرد على أسئلة الفروض والاختبارات، تفسير الدروس الصعبة، واقتراح منهجيات الحفظ والمراجعة بأسلوب تفاعلي رائع ومحفز للتعليم. " +
      "أجب باللغة العربية الفصحى دائماً وتأكد من تنظيم إجاباتك بالتعدادات والخطوط العريضة والمناقشة الواضحة للتفاصيل الأكاديمية والرياضية والتعليمية. " +
      "إذا أرفق الطالب صورة لتمرين أو رسم بياني، قم بقراءة تفاصيل الصورة وتحليلها بالتفصيل ثم تقديم الحل النموذجي المفصل مع شرح مبسط للخطوات. " +
      "قاعدة صارمة وحاسمة: لا تستخدم رموز الدولار ($ أو $$) نهائياً لإحاطة الأرقام، الرموز الرياضية، أو المعادلات (تجنب تماماً نمط LaTeX مثل $5$ أو $x = 2$). بدلاً من ذلك، اكتب الأرقام والرموز الرياضية كنصوص عادية واضحة ومباشرة (مثال: '5' أو 'س = 2' أو 'العملية هي 5 + 3 = 8') لتكون مريحة وسهلة القراءة ومفهومة تماماً للطلاب.";

    const contents: any[] = [];
    
    // Map history to Google GenAI structure
    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        contents.push({
          role: turn.role, // 'user' or 'model'
          parts: turn.parts ? turn.parts : [{ text: turn.text }]
        });
      });
    }
    
    // Push current conversational input
    contents.push({
      role: 'user',
      parts: parts
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API server endpoint error:", error);
    return res.status(500).json({ 
      error: "حدث خطأ غير متوقع أثناء معالجة طلبك مع المساعد الذكي. تفاصيل الخطأ: " + (error.message || error) 
    });
  }
});

// Vite middleware Setup for dev and static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer();
