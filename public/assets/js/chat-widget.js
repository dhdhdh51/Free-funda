/**
 * BharatAI Business OS - Embeddable Website Chatbot Widget
 * Add to any website before </body>:
 * <script src="https://yourdomain.com/public/assets/js/chat-widget.js" data-business-id="1" data-theme="#4f46e5"></script>
 */
(function() {
    'use strict';

    const currentScript = document.currentScript || document.querySelector('script[data-business-id]');
    const businessId = currentScript ? currentScript.getAttribute('data-business-id') || '1' : '1';
    const primaryColor = currentScript ? currentScript.getAttribute('data-theme') || '#4f46e5' : '#4f46e5';
    const apiEndpoint = currentScript && currentScript.src ? new URL(currentScript.src).origin + '/api/chat/widget.php' : '/api/chat/widget.php';

    // Inject Container Styles
    const style = document.createElement('style');
    style.innerHTML = `
        .bharatai-widget-btn {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 58px;
            height: 58px;
            border-radius: 29px;
            background: ${primaryColor};
            color: #ffffff;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999999;
            transition: transform 0.2s, box-shadow 0.2s;
            border: none;
        }
        .bharatai-widget-btn:hover {
            transform: scale(1.05);
        }
        .bharatai-chat-window {
            position: fixed;
            bottom: 96px;
            right: 24px;
            width: 360px;
            max-width: calc(100vw - 32px);
            height: 520px;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .bharatai-chat-header {
            background: #1e293b;
            padding: 14px 16px;
            color: #f8fafc;
            font-weight: 600;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #334155;
        }
        .bharatai-chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 13px;
        }
        .bharatai-msg {
            max-width: 80%;
            padding: 10px 14px;
            border-radius: 12px;
            line-height: 1.4;
        }
        .bharatai-msg-bot {
            background: #1e293b;
            color: #e2e8f0;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }
        .bharatai-msg-user {
            background: ${primaryColor};
            color: #ffffff;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        .bharatai-chat-input-area {
            padding: 12px;
            background: #1e293b;
            border-top: 1px solid #334155;
            display: flex;
            gap: 8px;
        }
        .bharatai-chat-input {
            flex: 1;
            background: #0f172a;
            border: 1px solid #334155;
            color: #f8fafc;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 13px;
            outline: none;
        }
        .bharatai-send-btn {
            background: ${primaryColor};
            color: #ffffff;
            border: none;
            padding: 8px 14px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);

    // Create Widget Elements
    const btn = document.createElement('button');
    btn.className = 'bharatai-widget-btn';
    btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    document.body.appendChild(btn);

    const win = document.createElement('div');
    win.className = 'bharatai-chat-window';
    win.innerHTML = `
        <div class="bharatai-chat-header">
            <span>BharatAI Virtual Assistant</span>
            <span style="cursor:pointer;font-size:18px;" id="bharatai-close-btn">&times;</span>
        </div>
        <div class="bharatai-chat-messages" id="bharatai-msg-list">
            <div class="bharatai-msg bharatai-msg-bot">
                Hello! Welcome to our website. How can I assist you with our services today?
            </div>
        </div>
        <div class="bharatai-chat-input-area">
            <input type="text" class="bharatai-chat-input" id="bharatai-input-field" placeholder="Ask a question or request a quote...">
            <button class="bharatai-send-btn" id="bharatai-send-btn">Send</button>
        </div>
    `;
    document.body.appendChild(win);

    let isOpen = false;
    btn.addEventListener('click', () => {
        isOpen = !isOpen;
        win.style.display = isOpen ? 'flex' : 'none';
    });

    document.getElementById('bharatai-close-btn').addEventListener('click', () => {
        isOpen = false;
        win.style.display = 'none';
    });

    const msgList = document.getElementById('bharatai-msg-list');
    const inputField = document.getElementById('bharatai-input-field');
    const sendBtn = document.getElementById('bharatai-send-btn');

    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        // User message
        const uMsg = document.createElement('div');
        uMsg.className = 'bharatai-msg bharatai-msg-user';
        uMsg.innerText = text;
        msgList.appendChild(uMsg);
        inputField.value = '';
        msgList.scrollTop = msgList.scrollHeight;

        // Typing placeholder
        const typing = document.createElement('div');
        typing.className = 'bharatai-msg bharatai-msg-bot';
        typing.innerText = 'Typing...';
        msgList.appendChild(typing);
        msgList.scrollTop = msgList.scrollHeight;

        try {
            const resp = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    business_id: businessId,
                    message: text,
                })
            });
            const data = await resp.json();
            typing.innerText = data.data?.reply || data.reply || "Thank you! Our representative will follow up with you shortly.";
        } catch (err) {
            typing.innerText = "Thank you for your message. Please share your phone or email so we can reach you.";
        }
        msgList.scrollTop = msgList.scrollHeight;
    }

    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();
