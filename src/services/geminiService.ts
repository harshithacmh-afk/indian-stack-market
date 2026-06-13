export const geminiService = {
  async chat(message: string, history: { role: string; parts: { text: string }[] }[]) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, history }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      throw error;
    }
  }
};
