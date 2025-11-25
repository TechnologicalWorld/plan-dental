import process from 'process';
import React, { useState } from 'react';

const AsistenteIA = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
                    'https://n8n-service-zx0d.onrender.com/webhook/6165b310-9ab1-41df-b427-0d91f1c37ac4',                    {
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

                // Diferentes formas de acceder a la respuesta
                let botText = null;

                // Opción 1: Array directo
                if (Array.isArray(data) && data[0]?.output) {
                    botText = data[0].output;
                }
                // Opción 2: Objeto con propiedad data
                else if (data?.data && Array.isArray(data.data) && data.data[0]?.output) {
                    botText = data.data[0].output;
                }
                // Opción 3: Directamente output
                else if (data?.output) {
                    botText = data.output;
                }
                // Opción 4: String directo
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
            maxWidth: '600px', 
            margin: '0 auto', 
            padding: '20px', 
            border: '1px solid #5f6368', 
            borderRadius: '10px', 
            backgroundColor: '#1E1E1E',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <h2 style={{ color: '#f1f1f1', textAlign: 'center', marginBottom: '20px' }}>
                Asistente IA
            </h2>

            <div style={{ 
                maxHeight: '400px', 
                overflowY: 'auto', 
                marginBottom: '10px', 
                padding: '10px', 
                border: '1px solid #333', 
                backgroundColor: '#2B2B2B',
                borderRadius: '8px'
            }}>
                {messages.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
                        Escribe un mensaje para comenzar...
                    </p>
                ) : (
                    messages.map((message, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                marginBottom: '15px', 
                                display: 'flex',
                                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <div style={{
                                maxWidth: '80%',
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#888',
                                    marginBottom: '4px',
                                    paddingLeft: message.sender === 'user' ? '0' : '10px',
                                    paddingRight: message.sender === 'user' ? '10px' : '0',
                                    textAlign: message.sender === 'user' ? 'right' : 'left'
                                }}>
                                    {message.sender === 'user' ? 'Tú' : 'Bot'}
                                </div>
                                <div style={{
                                    backgroundColor: message.sender === 'user' ? '#0C9B7D' : '#4A4A4A',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    color: '#ffffff',
                                    wordWrap: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.5'
                                }}>
                                    {message.text}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                
                {isLoading && (
                    <div style={{ 
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginBottom: '15px'
                    }}>
                        <div style={{
                            backgroundColor: '#4A4A4A',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            color: '#888'
                        }}>
                            Escribiendo...
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div style={{ 
                    color: '#ff6b6b', 
                    padding: '12px', 
                    backgroundColor: '#3a2828', 
                    borderRadius: '8px',
                    marginBottom: '10px',
                    border: '1px solid #5a3838'
                }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        padding: '15px',
                        borderRadius: '8px',
                        border: '1px solid #555',
                        backgroundColor: '#333',
                        color: '#fff',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                    }}
                    placeholder="Escribe tu mensaje..."
                />
                <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    style={{
                        padding: '15px 24px',
                        backgroundColor: isLoading || !input.trim() ? '#666' : '#0C9B7D',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                        fontWeight: '500'
                    }}
                >
                    {isLoading ? '...' : 'Enviar'}
                </button>
            </div>
        </div>
    );
};

export default AsistenteIA;