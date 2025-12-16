import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "👋 Bonjour ! Je suis l'assistant virtuel de Yayou Baye Niass. Comment puis-je vous aider à trouver votre style aujourd'hui ?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false }]);
    setInput("");
    setIsTyping(true);

    // Simulate response logic
    setTimeout(() => {
      let responseText = "Je suis désolé, je n'ai pas compris. Voulez-vous parler à un humain ?";
      const lower = userText.toLowerCase();

      if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello')) {
        responseText = "Salut ! Ravi de vous voir. Que cherchez-vous aujourd'hui ? (Habits, Parfums, Chaussures...)";
      } else if (lower.includes('prix') || lower.includes('coûte') || lower.includes('coute')) {
        responseText = "Nos prix sont très compétitifs et adaptés à la qualité ! Jetez un œil à la section Boutique pour voir les offres actuelles.";
      } else if (lower.includes('livraison') || lower.includes('livrer')) {
        responseText = "Nous livrons partout au Sénégal en 24h à 48h. La livraison est gratuite dès 50.000 FCFA d'achats ! 🚚";
      } else if (lower.includes('contact') || lower.includes('téléphone') || lower.includes('numero')) {
        responseText = "Vous pouvez nous joindre directement au +221 70 461 18 94 ou cliquer sur le bouton WhatsApp d'un produit.";
      } else if (lower.includes('commande') || lower.includes('payer')) {
        responseText = "Pour commander, ajoutez des articles au panier. Nous acceptons Wave, Orange Money et le paiement à la livraison.";
      } else if (lower.includes('merci')) {
        responseText = "Je vous en prie ! N'hésitez pas si vous avez d'autres questions. Bon shopping ! ✨";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, isBot: true }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 transform origin-bottom-right animate-in fade-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/10">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Assistant Yayou</h3>
                <p className="text-xs text-indigo-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                  En ligne
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50/80 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-sm leading-relaxed ${
                    msg.isBot 
                      ? 'bg-white text-gray-700 rounded-tl-none border border-gray-100' 
                      : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex justify-start">
                 <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex space-x-1.5 items-center h-10">
                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-gray-800 rotate-90' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-110'
        } text-white p-4 rounded-full shadow-xl shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center group relative overflow-hidden`}
      >
        <div className="relative z-10">
            {isOpen ? (
                <X className="w-7 h-7 transition-transform duration-300 -rotate-90" />
            ) : (
                <MessageSquare className="w-7 h-7 fill-current" />
            )}
        </div>
        
        {/* Button Ping Effect */}
        {!isOpen && (
            <>
                <span className="absolute right-3 top-3 flex h-3 w-3 z-20">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                </span>
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </>
        )}
      </button>
    </div>
  );
};

export default Chatbot;