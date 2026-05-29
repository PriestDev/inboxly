// WordPress Chat Widget JS

(function() {
    'use strict';

    class WorknoonChatWidget {
        constructor() {
            this.socket = null;
            this.token = null;
            this.conversationId = null;
            this.userId = window.WorknoonChat.userId;
            this.apiUrl = window.WorknoonChat.apiUrl;
            this.pageContext = window.WorknoonChat.pageContext || { type: 'general', data: {} };
            this.init();
        }

        init() {
            this.renderChatInterface();
            this.initializeSocket();
            this.attachEventListeners();
        }

        renderChatInterface() {
            const shortcodeContainer = document.querySelector('#worknoon-chat-shortcode');
            const widgetContainer = document.querySelector('#worknoon-chat-widget');
            const container = shortcodeContainer || widgetContainer;

            if (!container) {
                console.warn('Worknoon Chat container not found');
                return;
            }

            if (shortcodeContainer && widgetContainer) {
                widgetContainer.remove();
            }

            container.innerHTML = `
                <div class="worknoon-chat-container">
                    <div class="worknoon-chat-header">
                        <h3>${window.WorknoonChat.pageContext.type === 'product' ? 'Product Support Chat' : window.WorknoonChat.pageContext.type === 'order' ? 'Order Support Chat' : 'Worknoon Chat'}</h3>
                    </div>
                    <div class="worknoon-chat-messages"></div>
                    <div class="worknoon-chat-input">
                        <input type="text" placeholder="Type your message..." />
                        <button type="button">Send</button>
                    </div>
                </div>
            `;
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

                this.socket.on('authenticated', (info) => {
                    console.log('Socket authenticated (server):', info);
                });

            this.socket.on('new_message', (message) => {
                this.displayMessage(message);
            });

            this.socket.on('error', (error) => {
                console.error('Chat error:', error);
            });
        }

        authenticate() {
            fetch('/wp-json/worknoon-chat/v1/backend-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.WorknoonChat.nonce,
                },
                credentials: 'same-origin',
            })
            .then(response => response.json())
            .then(data => {
                console.log('backend-token response:', data);
                if (!data.token) {
                    throw new Error('Token not returned from backend-token endpoint');
                }
                this.token = data.token;
                this.socket.emit('authenticate', this.token);
                this.initializeContext();
            })
            .catch(error => console.error('Authentication failed:', error));
        }

        initializeContext() {
            if (this.pageContext.type === 'product') {
                this.createProductChatSession(this.pageContext.data.productId, this.pageContext.data.productName);
            }

            if (this.pageContext.type === 'order') {
                this.createOrderChatSession(this.pageContext.data.orderId);
            }
        }

        createProductChatSession(productId, productName) {
            fetch('/wp-json/worknoon-chat/v1/chat-session/from-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.WorknoonChat.nonce,
                },
                credentials: 'same-origin',
                body: JSON.stringify({ product_id: productId }),
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.id) {
                    this.chatSession = data;
                }
            })
            .catch(error => console.error('Could not create product chat session:', error));

            this.createBackendConversation({
                title: `Product Chat: ${productName}`,
                subject: `Product ID ${productId}`,
                type: 'product'
            });
        }

        createOrderChatSession(orderId) {
            fetch('/wp-json/worknoon-chat/v1/chat-session/from-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.WorknoonChat.nonce,
                },
                credentials: 'same-origin',
                body: JSON.stringify({ order_id: orderId }),
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.id) {
                    this.chatSession = data;
                }
            })
            .catch(error => console.error('Could not create order chat session:', error));

            this.createBackendConversation({
                title: `Order Chat: ${orderId}`,
                subject: `Order ID ${orderId}`,
                type: 'order'
            });
        }

        createBackendConversation(payload) {
            fetch(this.apiUrl + '/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    participantIds: [],
                    type: payload.type,
                    title: payload.title,
                    subject: payload.subject,
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log('createBackendConversation response:', data);
                if (data && data._id) {
                    this.conversationId = data._id;
                    // Join the conversation room so socket events are received
                    if (this.socket && this.socket.connected) {
                        this.socket.emit('join_conversation', this.conversationId);
                        console.log('Joined conversation room:', this.conversationId);
                    }
                }
            })
            .catch(error => console.error('Could not create backend conversation:', error));
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
            if (!this.conversationId) {
                console.warn('No backend conversation is initialized yet');
                return;
            }

            this.socket.emit('send_message', {
                conversationId: this.conversationId,
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
