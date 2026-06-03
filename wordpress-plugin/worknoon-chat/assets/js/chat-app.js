// WordPress Chat Widget JS

(function() {
    'use strict';

    class InboxlyChatWidget {
        constructor() {
            this.socket = null;
            this.token = null;
            this.conversationId = null;
            this.userId = window.InboxlyChat.userId;
            this.apiUrl = window.InboxlyChat.apiUrl;
            this.pageContext = window.InboxlyChat.pageContext || { type: 'general', data: {} };
            this.init();
        }

        init() {
            this.renderChatInterface();
            this.initializeSocket();
            this.attachEventListeners();
        }

        renderChatInterface() {
            const shortcodeContainer = document.querySelector('#inboxly-chat-shortcode');
            const widgetContainer = document.querySelector('#inboxly-chat-widget');
            const container = shortcodeContainer || widgetContainer;

            if (!container) {
                console.warn('Inboxly container not found');
                return;
            }

            if (shortcodeContainer && widgetContainer) {
                widgetContainer.remove();
            }

            container.innerHTML = `
                <div class="inboxly-chat-container">
                    <div class="inboxly-chat-header">
                        <h3>${window.InboxlyChat.pageContext.type === 'product' ? 'Product Support Chat' : window.InboxlyChat.pageContext.type === 'order' ? 'Order Support Chat' : 'Inboxly'}</h3>
                        <button class="inboxly-chat-close" type="button" aria-label="Close chat">&times;</button>
                    </div>
                    <div class="inboxly-chat-notice" role="status" aria-live="polite"></div>
                    <div class="inboxly-chat-messages"></div>
                    <div class="inboxly-chat-input">
                        <input type="text" placeholder="Type your message..." />
                        <button type="button">Send</button>
                    </div>
                </div>
            `;

            // If using the floating widget, start collapsed and add a toggle icon
            if (container === widgetContainer) {
                // start collapsed
                container.classList.add('collapsed');

                // create toggle button if not exists
                if (!document.querySelector('#inboxly-chat-toggle')) {
                    const toggle = document.createElement('div');
                    toggle.id = 'inboxly-chat-toggle';
                    toggle.setAttribute('title', 'Open chat');
                    toggle.innerHTML = `
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M12 3C7.03 3 3 6.58 3 11c0 2.08.84 3.98 2.24 5.46L5 21l4.05-1.64C10.02 19.45 11 19.72 12 19.72c4.97 0 9-3.58 9-8.72S16.97 3 12 3z"/>
                        </svg>
                    `;
                    document.body.appendChild(toggle);

                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        const isCollapsed = container.classList.contains('collapsed');
                        if (isCollapsed) {
                            container.classList.remove('collapsed');
                            container.classList.add('open');
                            toggle.classList.add('open');
                            toggle.setAttribute('title', 'Close chat');
                            const input = container.querySelector('.inboxly-chat-input input');
                            input && input.focus();
                            this.clearError();
                        } else {
                            container.classList.add('collapsed');
                            container.classList.remove('open');
                            toggle.classList.remove('open');
                            toggle.setAttribute('title', 'Open chat');
                        }
                        this.updateToggleVisibility();
                    });
                }

                const closeButton = container.querySelector('.inboxly-chat-close');
                if (closeButton) {
                    closeButton.addEventListener('click', () => {
                        container.classList.add('collapsed');
                        container.classList.remove('open');
                        const toggle = document.querySelector('#inboxly-chat-toggle');
                        if (toggle) {
                            toggle.classList.remove('open');
                            toggle.setAttribute('title', 'Open chat');
                        }
                        this.updateToggleVisibility();
                    });
                }

                this.updateToggleVisibility();
                this.observeModalState();
            }
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
                this.showError('Chat socket error. Please check the backend connection.');
            });
        }

        updateToggleVisibility() {
            const toggle = document.querySelector('#inboxly-chat-toggle');
            if (!toggle) return;

            const widget = document.querySelector('#inboxly-chat-widget');
            const isWidgetOpen = widget && widget.classList.contains('open');

            const modalElements = [...document.querySelectorAll('#modal, .modal')];
            const isModalOpen = modalElements.some(el => {
                const style = window.getComputedStyle(el);
                return el.classList.contains('open') || el.classList.contains('show') || (style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null);
            });

            toggle.style.display = (isModalOpen || isWidgetOpen) ? 'none' : 'flex';
        }

        showError(message) {
            const notice = document.querySelector('.inboxly-chat-notice');
            if (!notice) return;

            notice.textContent = message;
            notice.style.display = 'block';
        }

        clearError() {
            const notice = document.querySelector('.inboxly-chat-notice');
            if (!notice) return;

            notice.textContent = '';
            notice.style.display = 'none';
        }

        observeModalState() {
            if (!window.MutationObserver) return;
            const observer = new MutationObserver(() => this.updateToggleVisibility());
            observer.observe(document.body, { attributes: true, childList: true, subtree: true });
            this.modalObserver = observer;
        }

        authenticate() {
            fetch('/wp-json/inboxly-chat/v1/backend-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.InboxlyChat.nonce,
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
            .catch(error => {
                console.error('Authentication failed:', error);
                this.showError('Cannot connect to chat backend. Please check the backend URL and try again.');
            });
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
            fetch('/wp-json/inboxly-chat/v1/chat-session/from-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.InboxlyChat.nonce,
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
            fetch('/wp-json/inboxly-chat/v1/chat-session/from-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.InboxlyChat.nonce,
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
            return fetch(this.apiUrl + '/api/chats', {
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
                    return this.conversationId;
                }
                throw new Error('Invalid conversation response');
            })
            .catch(error => {
                console.error('Could not create backend conversation:', error);
                throw error;
            });
        }

        attachEventListeners() {
            const inputElement = document.querySelector('.inboxly-chat-input input');
            const sendButton = document.querySelector('.inboxly-chat-input button');

            if (sendButton) {
                sendButton.addEventListener('click', async () => {
                    if (!inputElement) return;
                    this.clearError();
                    await this.sendMessage(inputElement.value);
                    inputElement.value = '';
                });
            }

            if (inputElement) {
                inputElement.addEventListener('keypress', async (e) => {
                    if (e.key === 'Enter') {
                        this.clearError();
                        await this.sendMessage(inputElement.value);
                        inputElement.value = '';
                    }
                });
            }
        }

        async sendMessage(content) {
            if (!content || !content.trim()) return;

            // Ensure a backend conversation exists
            if (!this.conversationId) {
                try {
                    const title = this.pageContext.type === 'product' ? (`Product Chat: ${this.pageContext.data.productName || ''}`) : this.pageContext.type === 'order' ? (`Order Chat: ${this.pageContext.data.orderId || ''}`) : 'Support Chat';
                    const subject = content.slice(0, 120);
                    await this.createBackendConversation({ title, subject, type: this.pageContext.type || 'general' });
                } catch (err) {
                    console.error('Failed to create conversation before sending message:', err);
                    this.showError('Unable to start chat conversation. Please check the backend URL and try again.');
                    return;
                }
            }

            // Optimistically render message locally
            const tempMessage = {
                _id: `tmp_${Date.now()}`,
                conversationId: this.conversationId,
                senderId: this.userId,
                senderName: window.InboxlyChat.userName || '',
                content,
                messageType: 'text',
                createdAt: new Date().toISOString()
            };

            this.displayMessage(tempMessage);

            // Send via socket if available, otherwise fallback to REST
            if (this.socket && this.socket.connected) {
                this.socket.emit('send_message', {
                    conversationId: this.conversationId,
                    content: content,
                    messageType: 'text'
                });
            } else {
                // REST fallback
                try {
                    const res = await fetch(this.apiUrl + `/api/chats/${this.conversationId}/messages`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.token}`
                        },
                        body: JSON.stringify({ content, messageType: 'text' })
                    });

                    if (!res.ok) {
                        throw new Error(`Backend returned ${res.status}`);
                    }

                    const data = await res.json();
                    console.log('REST message send response:', data);
                } catch (err) {
                    console.error('Failed to send message via REST fallback:', err);
                    this.showError('Unable to send message. Please check the backend URL and try again.');
                }
            }
        }

        displayMessage(message) {
            const messagesContainer = document.querySelector('.inboxly-chat-messages');
            if (!messagesContainer) return;

            const senderId = (typeof message.senderId === 'object' && message.senderId) ? (message.senderId._id || message.senderId.id || message.senderId) : message.senderId;

            const messageElement = document.createElement('div');
            messageElement.className = 'inboxly-chat-message ' + (senderId === this.userId ? 'sent' : 'received');
            messageElement.innerHTML = `<div class="message-content">${message.content}</div>`;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Initialize widget when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.InboxlyChat && window.InboxlyChat.isLoggedIn) {
                new InboxlyChatWidget();
            }
        });
    } else {
        if (window.InboxlyChat && window.InboxlyChat.isLoggedIn) {
            new InboxlyChatWidget();
        }
    }
})();
