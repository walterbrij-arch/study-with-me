import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // تفعيل الـ CORS لتجنب أي مشاكل اتصال بين الواجهة والخلفية
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. السماح فقط بطلبات POST للحماية الأكاديمية للأمن
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message, image, history } = req.body;
    
    // جلب مفتاح Gemini السري من بيئة الـ Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ 
        error: "مفتاح API الخاص بـ Gemini غير متوفر. يرجى إضافته كمتغير بيئة باسم GEMINI_API_KEY في لوحة تحكم Vercel تحت Settings -> Environment Variables ثم إعادة النشر." 
      });
    }

    // تهيئة مكتبة Google Genius الرسمية
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const parts: any[] = [];
    
    if (image) {
      // تفكيك وتحليل الصورة المرسلة من الهاتف أو الحاسوب (Base64)
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

    // التوجيهات الأكاديمية والنظامية للمرشد التعليمي بالجزائر
    const systemInstruction = 
      "أنت 'Study With Me AI'، مساعد ذكاء اصطناعي ودود، ملهم وعالي الذكاء مصمم خصيصاً لمساعدة الطلاب والأساتذة في الجزائر. " +
      "أنت متخصص في جميع المناهج والدراسات والبرامج التعليمية الرسمية الجزائرية للوزارة للطور الابتدائي، المتوسط والثانوي. " +
      "تساعد في حل الواجبات المنزلية، الرد على أسئلة الفروض والاختبارات، تفسير الدروس الصعبة، واقتراح منهجيات الحفظ والمراجعة بأسلوب تفاعلي رائع ومحفز للتعليم. " +
      "أجب باللغة العربية الفصحى دائماً وتأكد من تنظيم إجاباتك بالتعدادات والخطوط العريضة والمناقشة الواضحة للتفاصيل الأكاديمية والرياضية والتعليمية. " +
      "إذا أرفق الطالب صورة لتمرين أو رسم بياني، قم بقراءة تفاصيل الصورة وتحليلها بالتفصيل ثم تقديم الحل النموذجي المفصل مع شرح مبسط للخطوات. " +
      "قاعدة صارمة وحاسمة: لا تستخدم رموز الدولار ($ أو $$) نهائياً لإحاطة الأرقام، الرموز الرياضية، أو المعادلات (تجنب تماماً نمط LaTeX مثل $5$ أو $x = 2$). بدلاً من ذلك، اكتب الأرقام والرموز الرياضية كنصوص عادية واضحة ومباشرة لتكون مريحة وسهلة القراءة ومفهومة تماماً للطلاب.";

    const contents: any[] = [];
    
    // تحميل الهيكل التاريخي ومجريات المحادثة للمتابعة الذكية
    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        contents.push({
          role: turn.role,
          parts: turn.parts ? turn.parts : [{ text: turn.text }]
        });
      });
    }
    
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
    
    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error on Vercel:", error);
    return res.status(500).json({ 
      error: "حدث خطأ غير متوقع أثناء معالجة طلبك مع المساعد الذكي: " + (error.message || error) 
    });
  }
}
