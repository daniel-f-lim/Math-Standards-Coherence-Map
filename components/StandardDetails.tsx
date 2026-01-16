
import React, { useState } from 'react';
import { Standard, ClusterInfo } from '../types';
import RichText from './RichText';
import { GoogleGenAI } from "@google/genai";

interface StandardDetailsProps {
  standard: Standard;
  cluster?: ClusterInfo;
  onClose: () => void;
}

const StandardDetails: React.FC<StandardDetailsProps> = ({ standard, cluster, onClose }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getGeminiInsight = async () => {
    setLoading(true);
    try {
      // Use process.env.API_KEY directly as per SDK guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a master math educator. Explain standard ${standard.Code}: "${standard.Description}" for parents and teachers. Suggest one concrete hands-on activity.`,
        config: {
            systemInstruction: "You are an expert pedagogical consultant. Provide concise, encouraging math education advice. Format output as clear markdown.",
            temperature: 0.7
        }
      });
      // Correctly access .text property from GenerateContentResponse
      setAiInsight(response.text || "No insight generated.");
    } catch (err) {
      console.error(err);
      setAiInsight("Failed to get AI insight. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-xl border-l border-slate-200 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 sticky top-0 bg-white z-10 flex justify-between items-start">
        <div>
          <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold mb-2">
            {standard.Grade}
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{standard.Code}</h2>
          <p className="text-sm font-medium text-slate-500">{standard.Domain}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Main Description */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Description</h3>
          <RichText content={standard.Description} className="text-lg leading-relaxed text-slate-700" />
        </section>

        {/* Cluster Info */}
        {cluster && (
          <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Cluster Context</h3>
            <p className="font-bold text-slate-800 mb-1">{cluster.Cluster}</p>
            {cluster.Terminology && (
                <div className="mt-2 text-sm">
                    <span className="font-semibold text-slate-600">Terminology: </span>
                    <span className="text-slate-600">{cluster.Terminology}</span>
                </div>
            )}
          </section>
        )}

        {/* Tabs style sections */}
        <div className="space-y-6">
          {standard.Clarifications && (
            <section>
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">Clarifications</h3>
              <RichText content={standard.Clarifications} />
            </section>
          )}

          {standard.Examples && (
            <section>
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">Examples</h3>
              <RichText content={standard.Examples} />
            </section>
          )}

          {standard.Limitations && (
            <section>
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">Limitations</h3>
              <RichText content={standard.Limitations} />
            </section>
          )}

          {standard.StudentLearningOpportunities && (
            <section>
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">Learning Opportunities</h3>
              <RichText content={standard.StudentLearningOpportunities} />
            </section>
          )}
        </div>

        {/* Gemini Integration */}
        <section className="pt-6 border-t border-slate-100">
          <button 
            onClick={getGeminiInsight}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )}
            AI Teacher's Assistant
          </button>
          
          {aiInsight && (
            <div className="mt-6 p-5 bg-indigo-50 rounded-xl border border-indigo-100">
               <h4 className="text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 100-2h-1a1 1 0 100 2h1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 10-2 0v1a1 1 0 102 0V10zM8 16v-1a1 1 0 10-2 0v1a1 1 0 102 0zM12 16v-1a1 1 0 10-2 0v1a1 1 0 102 0zM16 16v-1a1 1 0 10-2 0v1a1 1 0 102 0z" />
                 </svg>
                 AI Insight
               </h4>
               <RichText content={aiInsight} className="text-sm text-indigo-900 leading-relaxed" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StandardDetails;
