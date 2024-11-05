import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css';
import { Message } from "../../interfaces/chat.interfaces";
import { RootState } from "../../store";
import { useSelector } from 'react-redux';

const Chat: React.FC = () => {
    const isDialogVisible = useSelector((state: RootState) => state.dialog.isDialogVisible);
    const [messages, setMessages] = useState<Message[]>([]);
    const [question, setQuestion] = useState<string>('');


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(e.target.value);
    };

    const sendMessage = async () => {
        const userMessage: Message = { id: Date.now().toString(), sender: 'user', content: question };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setQuestion('');
        axios.post('/api/answer', { question })
            .then((data) => {
                if (data) {
                    const aiMessage: Message = { id: Date.now().toString(), sender: 'ai', content: data.data.message };
                    setMessages(prevMessages => [...prevMessages, aiMessage]);
                }
            })
            .catch(error => {
                console.error('Error fetching AI response:', error);
                const errorMessage: Message = { id: Date.now().toString(), sender: 'ai', content: 'Error fetching response' };
                setMessages(prevMessages => [...prevMessages, errorMessage]);
        })
    };

    return (
        <div className="chat-container">
            <div id="dialog" className={"dialog-window " + (isDialogVisible ? "" : "hide")}>
                <p>Download the document in PDF or plain text format to ask related questions.</p>
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={question}
                    onChange={handleInputChange}
                    placeholder="Ask something..."
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} disabled={isDialogVisible}>Send</button>
            </div>
            <div className="messages-container">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.sender}`}>
                        <strong>{message.sender === 'user' ? 'You' : 'AI'}<br/></strong>
                        {message.content}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Chat;
