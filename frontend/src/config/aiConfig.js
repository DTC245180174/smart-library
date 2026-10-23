// =========================================================================
// CẤU HÌNH TRỢ LÝ AI THƯ VIỆN THÔNG MINH (AI ASSISTANT CONFIGURATION)
// =========================================================================
// Bạn có thể điền trực tiếp API Key của bạn vào biến API_KEY bên dưới.
//
// 1. Google Gemini API (Khuyên dùng - Miễn phí):
//    👉 Lấy key tại: https://aistudio.google.com/app/apikey
//
// 2. Hoặc OpenAI API (ChatGPT):
//    👉 Lấy key tại: https://platform.openai.com/api-keys
// =========================================================================

export const AI_CONFIG = {
  // 👉 ĐIỀN API_KEY CỦA BẠN VÀO DƯỚI ĐÂY (GIỮA 2 DẤU NHÁY ĐƠN):
  API_KEY: '',

  // Nhà cung cấp dịch vụ AI: 'gemini' (Google Gemini) hoặc 'openai' (OpenAI ChatGPT)
  PROVIDER: 'gemini',

  // Model AI sử dụng:
  // - Đối với Gemini: 'gemini-1.5-flash' (nhanh, thông minh) hoặc 'gemini-1.5-pro'
  // - Đối với OpenAI: 'gpt-4o-mini' hoặc 'gpt-3.5-turbo'
  MODEL: 'gemini-1.5-flash',

  // Thời gian chờ phản hồi tối thiểu (mili giây): 5000 = đúng 5 giây theo yêu cầu
  MIN_RESPONSE_DELAY_MS: 5000
};

// Hàm lấy API key đang kích hoạt (ưu tiên key lưu trong localStorage nếu người dùng nhập trên web)
export const getActiveApiKey = () => {
  if (typeof window !== 'undefined') {
    const userStoredKey = localStorage.getItem('smartlib_ai_api_key');
    if (userStoredKey && userStoredKey.trim()) {
      return userStoredKey.trim();
    }
  }
  return (AI_CONFIG.API_KEY || '').trim();
};

// Hàm lưu API key khi người dùng nhập trên giao diện
export const setActiveApiKey = (key) => {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('smartlib_ai_api_key', key.trim());
    } else {
      localStorage.removeItem('smartlib_ai_api_key');
    }
  }
};
