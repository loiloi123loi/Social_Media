<template>
  <div class="messaging-container">
    <!-- Sidebar with conversations -->
    <div class="conversations-sidebar">
      <div class="sidebar-header">
        <h2>Messages</h2>
        <button class="new-message-btn">
          <i class="pi pi-plus"></i>
        </button>
      </div>

      <div class="search-box">
        <i class="pi pi-search search-icon"></i>
        <input type="text" placeholder="Search messages..." />
      </div>

      <div class="conversation-tabs">
        <button class="tab-btn active">All</button>
        <button class="tab-btn">Unread</button>
        <button class="tab-btn">Important</button>
      </div>

      <div class="conversations-list">
        <div
          v-for="(convo, index) in conversations"
          :key="convo.id"
          class="conversation-item"
          :class="{ active: selectedConversation === index, unread: convo.unread }"
          @click="selectConversation(index)"
        >
          <div class="convo-avatar-container">
            <img :src="convo.avatar" :alt="`${convo.name}'s avatar`" class="convo-avatar" />
            <div v-if="convo.online" class="online-indicator"></div>
          </div>

          <div class="convo-details">
            <div class="convo-header">
              <h3 class="convo-name">{{ convo.name }}</h3>
              <span class="convo-time">{{ convo.lastMessageTime }}</span>
            </div>
            <div class="convo-preview">
              <p class="preview-text">{{ convo.lastMessage }}</p>
              <div v-if="convo.unread" class="unread-badge">{{ convo.unreadCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main chat area -->
    <div class="chat-area">
      <template v-if="selectedConversation !== null">
        <!-- Chat header -->
        <div class="chat-header">
          <div class="chat-header-user">
            <img
              :src="conversations[selectedConversation].avatar"
              :alt="`${conversations[selectedConversation].name}'s avatar`"
              class="chat-avatar"
            />
            <div class="chat-user-info">
              <h3 class="chat-username">{{ conversations[selectedConversation].name }}</h3>
              <span class="chat-status">{{
                conversations[selectedConversation].online ? 'Online' : 'Offline'
              }}</span>
            </div>
          </div>

          <div class="chat-header-actions">
            <button class="header-action-btn">
              <i class="pi pi-phone"></i>
            </button>
            <button class="header-action-btn">
              <i class="pi pi-video"></i>
            </button>
            <button class="header-action-btn">
              <i class="pi pi-info-circle"></i>
            </button>
          </div>
        </div>

        <!-- Messages area -->
        <div class="messages-container" ref="messagesContainer">
          <div class="date-divider">
            <span>Today</span>
          </div>

          <div
            v-for="(message, index) in currentMessages"
            :key="index"
            :class="['message', message.isUser ? 'message-user' : 'message-other']"
          >
            <img
              v-if="!message.isUser"
              :src="conversations[selectedConversation].avatar"
              :alt="`${conversations[selectedConversation].name}'s avatar`"
              class="message-avatar"
            />
            <div class="message-content">
              <div class="message-bubble">
                <p>{{ message.text }}</p>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <div v-if="message.isUser" class="message-status">
                <i class="pi pi-check-circle" :class="{ read: message.read }"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Message input area -->
        <div class="message-input-area">
          <button class="input-action-btn">
            <i class="pi pi-paperclip"></i>
          </button>
          <div class="message-input-wrapper">
            <textarea
              ref="messageInput"
              v-model="newMessage"
              placeholder="Type a message..."
              @keydown.enter.prevent="sendMessage"
              @input="adjustInputHeight"
            ></textarea>
            <div class="input-actions">
              <button class="input-action-btn">
                <i class="pi pi-smile"></i>
              </button>
              <button class="input-action-btn">
                <i class="pi pi-camera"></i>
              </button>
              <button class="input-action-btn">
                <i class="pi pi-microphone"></i>
              </button>
            </div>
          </div>
          <button
            class="send-message-btn"
            :class="{ active: newMessage.trim().length > 0 }"
            @click="sendMessage"
          >
            <i class="pi pi-send"></i>
          </button>
        </div>
      </template>

      <!-- Empty state -->
      <div v-else class="empty-chat">
        <div class="empty-chat-content">
          <i class="pi pi-comments empty-icon"></i>
          <h3>Select a conversation</h3>
          <p>Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

// Conversation data
const conversations = ref([
  {
    id: 1,
    name: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'That sounds great! Looking forward to it',
    lastMessageTime: '10:42 AM',
    online: true,
    unread: true,
    unreadCount: 3,
    messages: [
      { text: 'Hey there! How are you doing?', time: '10:30 AM', isUser: false, read: true },
      {
        text: "I'm good, thanks! Just finished that project we talked about.",
        time: '10:32 AM',
        isUser: true,
        read: true,
      },
      {
        text: "That's awesome! Would you like to meet up later to discuss the next steps?",
        time: '10:35 AM',
        isUser: false,
        read: true,
      },
      { text: 'Sure, how about coffee at 3pm?', time: '10:36 AM', isUser: true, read: true },
      {
        text: 'That sounds great! Looking forward to it',
        time: '10:42 AM',
        isUser: false,
        read: false,
      },
    ],
  },
  {
    id: 2,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=8',
    lastMessage: 'Did you see the latest updates?',
    lastMessageTime: 'Yesterday',
    online: false,
    unread: false,
    unreadCount: 0,
    messages: [
      {
        text: 'Hey John, have you seen the new design specs?',
        time: 'Yesterday',
        isUser: true,
        read: true,
      },
      {
        text: 'Yes, I just reviewed them. They look good!',
        time: 'Yesterday',
        isUser: false,
        read: true,
      },
      { text: 'Did you see the latest updates?', time: 'Yesterday', isUser: false, read: true },
    ],
  },
  {
    id: 3,
    name: 'Emily Chen',
    avatar: 'https://i.pravatar.cc/150?img=9',
    lastMessage: 'The meeting has been rescheduled to 2pm',
    lastMessageTime: 'Yesterday',
    online: true,
    unread: true,
    unreadCount: 1,
    messages: [
      {
        text: 'Hi there! Just wanted to let you know about the team meeting tomorrow',
        time: 'Yesterday',
        isUser: false,
        read: true,
      },
      {
        text: 'Thanks for the reminder. What time is it again?',
        time: 'Yesterday',
        isUser: true,
        read: true,
      },
      {
        text: 'The meeting has been rescheduled to 2pm',
        time: 'Yesterday',
        isUser: false,
        read: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: "I'll send you the files right away",
    lastMessageTime: 'Monday',
    online: false,
    unread: false,
    unreadCount: 0,
    messages: [
      {
        text: 'Hello Alex, can you send me the project files?',
        time: 'Monday',
        isUser: true,
        read: true,
      },
      { text: "I'll send you the files right away", time: 'Monday', isUser: false, read: true },
    ],
  },
  {
    id: 5,
    name: 'Maya Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'The new design looks amazing! Great job!',
    lastMessageTime: 'Sunday',
    online: true,
    unread: false,
    unreadCount: 0,
    messages: [
      { text: 'I just shared the new design with you', time: 'Sunday', isUser: true, read: true },
      {
        text: 'The new design looks amazing! Great job!',
        time: 'Sunday',
        isUser: false,
        read: true,
      },
    ],
  },
])

const selectedConversation = ref<number | null>(null)
const newMessage = ref('')
const messageInput = ref<HTMLTextAreaElement | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)

// Computed property to get messages of the currently selected conversation
const currentMessages = computed(() => {
  if (selectedConversation.value !== null) {
    return conversations.value[selectedConversation.value].messages
  }
  return []
})

// Select a conversation
const selectConversation = (index: number) => {
  selectedConversation.value = index

  // Mark messages as read when conversation is selected
  if (conversations.value[index].unread) {
    conversations.value[index].unread = false
    conversations.value[index].unreadCount = 0

    // Mark all messages as read
    conversations.value[index].messages.forEach((message) => {
      if (!message.isUser) {
        message.read = true
      }
    })
  }

  // Focus the message input
  nextTick(() => {
    messageInput.value?.focus()
    scrollToBottom()
  })
}

// Adjust the height of the message input based on content
const adjustInputHeight = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    messageInput.value.style.height = `${messageInput.value.scrollHeight}px`
  }
}

// Scroll to the bottom of the messages container
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Send a new message
const sendMessage = () => {
  if (selectedConversation.value === null || !newMessage.value.trim()) return

  // Add the new message to the conversation
  const now = new Date()
  const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

  conversations.value[selectedConversation.value].messages.push({
    text: newMessage.value,
    time: timeString,
    isUser: true,
    read: false,
  })

  // Update the last message preview
  conversations.value[selectedConversation.value].lastMessage = newMessage.value
  conversations.value[selectedConversation.value].lastMessageTime = 'Just now'

  // Clear the input
  newMessage.value = ''
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
  }

  // Scroll to bottom
  scrollToBottom()

  // Simulate a reply after a delay
  setTimeout(() => {
    if (selectedConversation.value !== null) {
      const replyMessages = [
        'That sounds great!',
        'Thanks for letting me know!',
        "I'll get back to you on this.",
        'Sounds good to me!',
        'Got it, thanks!',
        'I appreciate it!',
      ]

      const randomReply = replyMessages[Math.floor(Math.random() * replyMessages.length)]

      conversations.value[selectedConversation.value].messages.push({
        text: randomReply,
        time: timeString,
        isUser: false,
        read: true,
      })

      // Update the last message preview
      conversations.value[selectedConversation.value].lastMessage = randomReply
      conversations.value[selectedConversation.value].lastMessageTime = 'Just now'

      scrollToBottom()
    }
  }, 2000)
}

// Watch for changes in the selected conversation to scroll to bottom
watch(selectedConversation, () => {
  scrollToBottom()
})

// Initialize
onMounted(() => {
  // Auto-select the first conversation on mobile
  if (window.innerWidth > 768) {
    selectConversation(0)
  }
})
</script>

<style scoped>
.messaging-container {
  display: flex;
  height: calc(100vh - 80px);
  background: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Sidebar styles */
.conversations-sidebar {
  width: 320px;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  background: var(--color-background-soft);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.new-message-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-button-text);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-message-btn:hover {
  background: var(--color-primary-hover);
  transform: scale(1.05);
}

.search-box {
  position: relative;
  padding: 12px 20px;
}

.search-icon {
  position: absolute;
  left: 30px;
  top: 22px;
  color: var(--color-text-light);
}

.search-box input {
  width: 100%;
  padding: 10px 15px 10px 35px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-box input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

.conversation-tabs {
  display: flex;
  padding: 0 20px;
  margin-bottom: 10px;
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text);
  padding: 10px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--color-primary);
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}

.conversation-item:hover {
  background: var(--color-background-mute);
}

.conversation-item.active {
  background: rgba(var(--color-primary-rgb), 0.1);
}

.conversation-item.unread .convo-name,
.conversation-item.unread .preview-text {
  font-weight: 600;
}

.convo-avatar-container {
  position: relative;
  margin-right: 12px;
}

.convo-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #4cd137;
  border-radius: 50%;
  border: 2px solid var(--color-background-soft);
  bottom: 0;
  right: 0;
}

.convo-details {
  flex: 1;
  min-width: 0;
}

.convo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.convo-name {
  margin: 0;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.convo-time {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.convo-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-text {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.unread-badge {
  min-width: 18px;
  height: 18px;
  background: var(--color-primary);
  color: var(--color-button-text);
  border-radius: 10px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

/* Chat area styles */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--color-border);
}

.chat-header-user {
  display: flex;
  align-items: center;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.chat-user-info {
  display: flex;
  flex-direction: column;
}

.chat-username {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.chat-status {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.chat-header-actions {
  display: flex;
  gap: 12px;
}

.header-action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-action-btn:hover {
  background: var(--color-background-mute);
  color: var(--color-primary);
}

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.date-divider {
  text-align: center;
  position: relative;
  margin: 20px 0;
}

.date-divider:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: var(--color-border);
  z-index: 1;
}

.date-divider span {
  position: relative;
  background: var(--color-background);
  padding: 0 15px;
  font-size: 0.8rem;
  color: var(--color-text-light);
  z-index: 2;
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  max-width: 75%;
}

.message-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-other {
  align-self: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  display: flex;
  align-items: flex-end;
  gap: 5px;
}

.message-bubble {
  background: var(--color-background-soft);
  border-radius: 18px;
  padding: 10px 15px;
  position: relative;
}

.message-user .message-bubble {
  background: var(--color-primary);
  color: var(--color-button-text);
  border-bottom-right-radius: 4px;
}

.message-other .message-bubble {
  background: var(--color-background-mute);
  border-bottom-left-radius: 4px;
}

.message-bubble p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
}

.message-time {
  font-size: 0.7rem;
  margin-top: 5px;
  display: block;
  opacity: 0.8;
}

.message-status {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.message-status .read {
  color: var(--color-primary);
}

.message-input-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid var(--color-border);
}

.message-input-wrapper {
  flex: 1;
  background: var(--color-background-soft);
  border-radius: 24px;
  padding: 8px 15px;
  display: flex;
  align-items: center;
}

.message-input-wrapper textarea {
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  max-height: 100px;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--color-text);
  padding: 8px 0;
}

.input-actions {
  display: flex;
  gap: 8px;
}

.input-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-light);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.input-action-btn:hover {
  background: rgba(var(--color-text-rgb), 0.1);
  color: var(--color-primary);
}

.send-message-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--color-background-mute);
  color: var(--color-text-light);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-message-btn.active {
  background: var(--color-primary);
  color: var(--color-button-text);
}

.send-message-btn.active:hover {
  background: var(--color-primary-hover);
  transform: scale(1.05);
}

/* Empty state */
.empty-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
}

.empty-chat-content {
  text-align: center;
  padding: 20px;
}

.empty-icon {
  font-size: 3rem;
  color: var(--color-text-light);
  margin-bottom: 15px;
}

.empty-chat h3 {
  margin: 0 0 10px;
  font-size: 1.2rem;
}

.empty-chat p {
  color: var(--color-text-light);
  max-width: 250px;
  margin: 0 auto;
}

/* Responsive styles */
@media (max-width: 768px) {
  .messaging-container {
    flex-direction: column;
    height: calc(100vh - 60px);
  }

  .conversations-sidebar {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    transition: transform 0.3s ease;
  }

  .conversations-sidebar.hidden {
    transform: translateX(-100%);
  }

  .chat-area {
    width: 100%;
  }

  .chat-header {
    padding: 12px 15px;
  }

  .message {
    max-width: 85%;
  }

  .back-btn {
    display: flex;
  }
}
</style>
