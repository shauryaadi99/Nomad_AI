export const chatSession = {
  sendMessage: async (prompt) => {
    try {
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate trip from backend");
      }

      const data = await response.json();
      
      // Mimic the original response structure so frontend doesn't break
      return {
        response: {
          text: () => data.response
        }
      };
    } catch (error) {
      console.error("chatSession error:", error);
      throw error;
    }
  }
};