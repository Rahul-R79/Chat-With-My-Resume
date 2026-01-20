import { useState, useRef, useEffect } from 'react';

function ChatInterface() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_URL;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                }),
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            const reply = data.reply;

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: reply
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[85vh] w-full max-w-4xl mx-auto bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-gray-900/50 p-5 px-6 border-b border-gray-800 flex items-center gap-4 sticky top-0 z-10 backdrop-blur-md">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        AI
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg tracking-tight">Rahul's Assistant</h1>
                    <p className="text-blue-400 text-xs font-medium uppercase tracking-wider">Online</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 mt-10">
                        <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center transform rotate-3">
                            <span className="text-4xl">👋</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Welcome!</h2>
                            <p className="text-gray-400 max-w-xs mx-auto text-sm">
                                I'm trained on Rahul's resume. Ask me about his skills, experience, or projects.
                            </p>
                        </div>
                    </div>
                )}

                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-md
                            ${m.role === "user"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                            }`}
                        >
                            {m.role === "user" ? "ME" : "AI"}
                        </div>

                        {/* Message Bubble */}
                        <div
                            className={`max-w-[75%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm transition-all
                            ${m.role === "user"
                                    ? "bg-white text-gray-900 rounded-tr-none font-medium"
                                    : "bg-gray-800 text-gray-100 border border-gray-700/50 rounded-tl-none"
                                }`}
                        >
                            <p className="whitespace-pre-wrap">{m.content}</p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold animate-pulse">AI</div>
                        <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-700/50 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-gray-900 border-t border-gray-800">
                <form
                    onSubmit={handleSend}
                    className="relative flex items-center gap-2 max-w-3xl mx-auto"
                >
                    <input
                        className="w-full pl-5 pr-32 py-4 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question..."
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                        <span>Send</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p className="text-xs text-gray-600">AI Assistant trained on Rahul's professional background</p>
                </div>
            </div>
        </div>
    );
}

export default ChatInterface;