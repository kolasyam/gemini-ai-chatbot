"use client";
import React from "react";
import { Bot, Loader2, Send, User2 } from "lucide-react";
import { useChat } from "ai/react";
import Markdown from "./markdown";
import { supabase } from '@/utils/supabase/servers';
interface ChatProps {
  userId: string;
}
export default function Chat({ userId }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit,isLoading,stop } = useChat({
    api: "api/genai",
  });
  const storeQuestion = async (question: string) => {
    const { error } = await supabase
      .from('questions')
      .insert({ user_id: userId, question });

    if (error) console.error('Error storing question:', error);
  };
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold text-center text-[#0842A0] mb-8">
      Gemini Chatbot
    </h1>
      {RenderForm()}
      {RenderMessages()}
      {/* {JSON.stringify(messages)} */}
    </main>
  );

  function RenderForm() {
    return (
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await storeQuestion(input);
          handleSubmit(event, {
            data: {
              prompt: input,
            },
          });
        }}
        className="w-full flex flex-row gap-2 items-center h-full justify-center"
      >
        <input
          type="text"
          placeholder={isLoading? "Generating . . .":"ask something . . ."}
          value={input}
          disabled={isLoading}
          onChange={handleInputChange}
          className="ml-10 rounded-xl border-b border-dashed outline-none w-[90%] md:w-[80%] px-4 py-2 text-[#0842A0] placeholder:text-[#0842A099] text-right focus:placeholder-transparent disabled:bg-transparent"
        />
        <button
          type="submit"
          className="rounded-full shadow-md border flex flex-row"
        >{isLoading?<Loader2 onClick={stop} className="p-3 h-10 w-10 stroke-stone-400 animate-spin"/>:<Send className="p-3 h-10 w-10 stroke-stone-400" />}
        </button>
      </form>
    );
  }
  function RenderMessages() {
    return (
      <div className="flex flex-col-reverse w-full md:w-[80%] text-left mt-4 gap-4 whitespace-pre-wrap">
        {messages.map((m, index) => {
          return (
            <div
              className={`p-4 shadow-md rounded-md ml-10 relative ${
                m.role === "user" ? "bg-stone-800" : ""
              }`}
            >
              <Markdown text={m.content}/>
              {m.role === "user" ? (
                <User2 className="absolute top-2 -left-10 border rounded-full p-1 shadow-lg" />
              ) : (
                <Bot className={`absolute top-2 -left-10 border rounded-full p-1 shadow-lg stroke-[#0842A0] ${
                  isLoading && index===messages.length-1 ? "animate-bounce":""
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
