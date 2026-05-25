// WordPress Chat Widget JS

(function() {
    'use strict';

    class WorknoonChatWidget {
        constructor() {
            this.socket = null;
            this.token = null;
            this.userId = window.WorknoonChat.userId;
            this.apiUrl = window.WorknoonChat.apiUrl;
            this.init();
        }

        init() {
            this.initializeSocket();
            this.attachEventListeners();
        }

        initializeSocket() {
            this.socket = io(this.apiUrl, {
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5
            });

            this.socket.on('connect', () => {
                console.log('Chat widget connected');
                this.authenticate();
            });

            this.socket.on('new_message', (message) => {
                this.displayMessage(message);
            });

            this.socket.on('error', (error) => {
                console.error('Chat error:', error);
            });
        }

        authenticate() {
            // Get token from backend API
            fetch(this.apiUrl + '/api/auth/wp-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wpUserId: this.userId,
                    nonce: window.WorknoonChat.nonce,
                })
            })
            .then(response => response.json())
            .then(data => {
                this.token = data.token;
                this.socket.emit('authenticate', this.token);
            })
            .catch(error => console.error('Authentication failed:', error));
        }

        attachEventListeners() {
            const inputElement = document.querySelector('.worknoon-chat-input input');
            const sendButton = document.querySelector('.worknoon-chat-input button');

            if (sendButton) {
                sendButton.addEventListener('click', () => {
                    this.sendMessage(inputElement.value);
                    inputElement.value = '';
                });
            }

            if (inputElement) {
                inputElement.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage(inputElement.value);
                        inputElement.value = '';
                    }
                });
            }
        }

        sendMessage(content) {
            if (!content.trim()) return;

            this.socket.emit('send_message', {
                content: content,
                messageType: 'text'
            });
        }

        displayMessage(message) {
            const messagesContainer = document.querySelector('.worknoon-chat-messages');
            const messageElement = document.createElement('div');
            messageElement.className = 'worknoon-chat-message ' + (message.senderId === this.userId ? 'sent' : 'received');
            messageElement.innerHTML = `<div class="message-content">${message.content}</div>`;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Initialize widget when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.WorknoonChat && window.WorknoonChat.isLoggedIn) {
                new WorknoonChatWidget();
            }
        });
    } else {
        if (window.WorknoonChat && window.WorknoonChat.isLoggedIn) {
            new WorknoonChatWidget();
        }
    }
})();
