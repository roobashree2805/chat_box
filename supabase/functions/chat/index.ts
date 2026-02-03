import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatRequest {
  message: string;
  conversation_id: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message }: ChatRequest = await req.json();

    let response = "I'm your AI assistant for engineering! ";

    if (message.toLowerCase().includes('code') || message.toLowerCase().includes('debug') || message.toLowerCase().includes('programming')) {
      response += "I can help you with coding challenges, debugging, algorithm optimization, and best practices. " +
                  "To integrate real AI responses, you'll need to connect to an AI service like OpenAI or Anthropic. " +
                  "Add your API key to the edge function environment and make API calls to get intelligent responses.";
    } else if (message.toLowerCase().includes('exam') || message.toLowerCase().includes('study') || message.toLowerCase().includes('learn')) {
      response += "I can help you prepare for engineering exams by explaining complex concepts, providing practice problems, and reviewing solutions. " +
                  "To enable full AI capabilities, integrate with an AI service provider in this edge function.";
    } else if (message.toLowerCase().includes('project') || message.toLowerCase().includes('design') || message.toLowerCase().includes('architecture')) {
      response += "I can guide you through project planning, system architecture, technology selection, and implementation strategies. " +
                  "For advanced AI-powered insights, connect this function to an AI API service.";
    } else {
      response += "I'm here to help with all your engineering questions! Ask me about:\n\n" +
                  "- Coding help and debugging\n" +
                  "- Exam preparation and concept explanation\n" +
                  "- Project guidance and architecture\n" +
                  "- Algorithm optimization\n" +
                  "- Best practices and design patterns\n\n" +
                  "Note: To enable full AI capabilities, integrate this edge function with an AI service like OpenAI or Anthropic.";
    }

    return new Response(
      JSON.stringify({ response }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in chat function:", error);
    return new Response(
      JSON.stringify({
        response: "I encountered an error processing your request. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
