import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';

const AsistenteIA = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (input.trim()) {
            const newMessage = { sender: 'user', text: input };
            setMessages([...messages, newMessage]);
            const userInput = input;
            setInput('');
            setError(null);
            setIsLoading(true);

            try {
                const response = await fetch(
                    'https://n8n-service-zx0d.onrender.com/webhook/6165b310-9ab1-41df-b427-0d91f1c37ac4',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer 5|2dPY9MlKFjyNQWzgFCxI4JbiJNyyJGGhchVLZnOK62503a17',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: {
                                mensaje: userInput
                            }
                        })
                    }
                );

                const data = await response.json();
                console.log('Response completa:', data);

                let botText = null;

                if (Array.isArray(data) && data[0]?.output) {
                    botText = data[0].output;
                }
                else if (data?.data && Array.isArray(data.data) && data.data[0]?.output) {
                    botText = data.data[0].output;
                }
                else if (data?.output) {
                    botText = data.output;
                }
                else if (typeof data === 'string') {
                    botText = data;
                }

                if (botText) {
                    const botMessage = { sender: 'bot', text: botText };
                    setMessages((prevMessages) => [...prevMessages, botMessage]);
                } else {
                    console.error('Estructura de respuesta no reconocida:', data);
                    setError('No se pudo procesar la respuesta del bot. Revisa la consola para más detalles.');
                }
            } catch (error) {
                console.error('Error completo:', error);
                
                let errorMessage = 'Ocurrió un error al enviar el mensaje.';
                
                if (!navigator.onLine) {
                    errorMessage = 'No hay conexión a internet.';
                } else {
                    errorMessage = 'No se recibió respuesta del servidor. Verifica que el webhook esté activo y accesible.';
                }
                
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div style={{ 
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1a1d29',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            boxSizing: 'border-box'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                padding: '24px 32px',
                borderBottom: '2px solid rgba(12, 155, 125, 0.3)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #0C9B7D 0%, #0a7d65 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(12, 155, 125, 0.4)'
                    }}>
                        <Bot size={28} color="#fff" />
                    </div>
                    <div>
                        <h2 style={{ 
                            color: '#f1f3f5', 
                            margin: 0,
                            fontSize: '24px',
                            fontWeight: '600',
                            letterSpacing: '-0.5px'
                        }}>
                            Asistente IA
                        </h2>
                        <p style={{
                            color: '#0C9B7D',
                            margin: '4px 0 0 0',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Plan Dental
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div style={{ 
                flex: 1,
                overflowY: 'auto', 
                padding: '32px 24px',
                backgroundColor: '#1a1d29',
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto',
                boxSizing: 'border-box'
            }}>
                {messages.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: '24px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                        }}>
                            <Bot size={40} color="#0C9B7D" />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ 
                                color: '#f1f3f5', 
                                margin: '0 0 12px 0',
                                fontSize: '20px',
                                fontWeight: '600'
                            }}>
                                ¡Bienvenido al Asistente IA!
                            </h3>
                            <p style={{ 
                                color: '#8b92a8', 
                                margin: 0,
                                fontSize: '15px'
                            }}>
                                Escribe un mensaje para comenzar la conversación
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                style={{ 
                                    marginBottom: '24px', 
                                    display: 'flex',
                                    gap: '12px',
                                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                    animation: 'fadeIn 0.3s ease-in'
                                }}
                            >
                                {message.sender === 'bot' && (
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #0C9B7D 0%, #0a7d65 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        boxShadow: '0 2px 8px rgba(12, 155, 125, 0.3)'
                                    }}>
                                        <Bot size={20} color="#fff" />
                                    </div>
                                )}
                                <div style={{
                                    maxWidth: '70%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px'
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#8b92a8',
                                        fontWeight: '500',
                                        paddingLeft: message.sender === 'user' ? '0' : '4px',
                                        paddingRight: message.sender === 'user' ? '4px' : '0',
                                        textAlign: message.sender === 'user' ? 'right' : 'left'
                                    }}>
                                        {message.sender === 'user' ? 'Tú' : 'Asistente'}
                                    </div>
                                    <div style={{
                                        backgroundColor: message.sender === 'user' 
                                            ? '#0C9B7D' 
                                            : '#2c3e50',
                                        padding: '14px 18px',
                                        borderRadius: message.sender === 'user' 
                                            ? '18px 18px 4px 18px' 
                                            : '18px 18px 18px 4px',
                                        color: '#ffffff',
                                        wordWrap: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.6',
                                        boxShadow: message.sender === 'user'
                                            ? '0 4px 12px rgba(12, 155, 125, 0.3)'
                                            : '0 4px 12px rgba(0, 0, 0, 0.2)',
                                        fontSize: '15px'
                                    }}>
                                        {message.text}
                                    </div>
                                </div>
                                {message.sender === 'user' && (
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                                    }}>
                                        <User size={20} color="#0C9B7D" />
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div style={{ 
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-start',
                                marginBottom: '24px',
                                animation: 'fadeIn 0.3s ease-in'
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #0C9B7D 0%, #0a7d65 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '0 2px 8px rgba(12, 155, 125, 0.3)'
                                }}>
                                    <Bot size={20} color="#fff" />
                                </div>
                                <div style={{
                                    backgroundColor: '#2c3e50',
                                    padding: '14px 18px',
                                    borderRadius: '18px 18px 18px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                                }}>
                                    <Loader size={16} color="#0C9B7D" style={{ animation: 'spin 1s linear infinite' }} />
                                    <span style={{ color: '#8b92a8', fontSize: '15px' }}>Escribiendo...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div style={{ 
                    margin: '0 24px 16px 24px',
                    maxWidth: '1200px',
                    width: 'calc(100% - 48px)',
                    alignSelf: 'center',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        color: '#ff6b6b', 
                        padding: '14px 18px', 
                        backgroundColor: 'rgba(255, 107, 107, 0.1)', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 107, 107, 0.3)',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '18px' }}>⚠️</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div style={{
                padding: '24px',
                background: 'linear-gradient(180deg, rgba(26, 29, 41, 0.8) 0%, rgba(44, 62, 80, 0.95) 100%)',
                borderTop: '2px solid rgba(12, 155, 125, 0.2)',
                boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.2)'
            }}>
                <div style={{ 
                    display: 'flex', 
                    gap: '12px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            padding: '16px 20px',
                            borderRadius: '12px',
                            border: '2px solid transparent',
                            backgroundColor: '#2c3e50',
                            color: '#fff',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}
                        placeholder="Escribe tu mensaje aquí..."
                        onFocus={(e) => e.target.style.borderColor = '#0C9B7D'}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        style={{
                            padding: '16px 28px',
                            background: isLoading || !input.trim() 
                                ? 'linear-gradient(135deg, #5a6c7d 0%, #4a5c6d 100%)'
                                : 'linear-gradient(135deg, #0C9B7D 0%, #0a7d65 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '15px',
                            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: isLoading || !input.trim() 
                                ? 'none'
                                : '0 4px 12px rgba(12, 155, 125, 0.4)',
                            transform: 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading && input.trim()) {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 6px 16px rgba(12, 155, 125, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = isLoading || !input.trim() 
                                ? 'none'
                                : '0 4px 12px rgba(12, 155, 125, 0.4)';
                        }}
                    >
                        {isLoading ? (
                            <>
                                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                Enviando
                            </>
                        ) : (
                            <>
                                Enviar
                                <Send size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default AsistenteIA;