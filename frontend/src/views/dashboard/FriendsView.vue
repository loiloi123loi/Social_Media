<template>
  <div class="friends-container">
    <div class="friends-header">
      <h1>Friends</h1>
    </div>

    <div class="friends-content">
      <div class="friends-section">
        <h2>Friend Requests</h2>
        <div v-if="friendRequests.length" class="friend-requests">
          <div v-for="request in friendRequests" :key="request.id" class="friend-card">
            <img :src="request.avatar" :alt="request.name" class="friend-avatar" />
            <div class="friend-info">
              <h3>{{ request.name }}</h3>
              <p>{{ request.mutualFriends }} mutual friends</p>
            </div>
            <div class="friend-actions">
              <button class="accept-btn" @click="acceptFriendRequest(request.id)">
                <i class="pi pi-check" />
                Accept
              </button>
              <button class="decline-btn" @click="declineFriendRequest(request.id)">
                <i class="pi pi-times" />
                Decline
              </button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <i class="pi pi-user-plus empty-icon" />
          <p>No pending friend requests</p>
        </div>
      </div>

      <div class="friends-section">
        <h2>People You May Know</h2>
        <div class="suggestions-grid">
          <div v-for="suggestion in friendSuggestions" :key="suggestion.id" class="suggestion-card">
            <img :src="suggestion.avatar" :alt="suggestion.name" class="suggestion-avatar" />
            <div class="suggestion-info">
              <h3>{{ suggestion.name }}</h3>
              <p>{{ suggestion.mutualFriends }} mutual friends</p>
              <p class="suggestion-reason">{{ suggestion.suggestionReason }}</p>
            </div>
            <div class="suggestion-actions">
              <button class="add-friend-btn" @click="sendFriendRequest(suggestion.id)">
                <i class="pi pi-user-plus" />
                Add Friend
              </button>
              <button class="remove-suggestion-btn" @click="removeSuggestion(suggestion.id)">
                <i class="pi pi-times" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="friends-section">
        <h2>Your Friends</h2>
        <div class="friends-grid">
          <div v-for="friend in filteredFriends" :key="friend.id" class="friend-card">
            <img :src="friend.avatar" :alt="friend.name" class="friend-avatar" />
            <div class="friend-info">
              <h3>{{ friend.name }}</h3>
              <p>{{ friend.mutualFriends }} mutual friends</p>
            </div>
            <div class="friend-actions">
              <button class="message-btn" @click="messageFriend(friend.id)">
                <i class="pi pi-comment" />
                Message
              </button>
              <button class="unfriend-btn" @click="unfriend(friend.id)">
                <i class="pi pi-user-minus" />
                Unfriend
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const searchQuery = ref('')

interface Friend {
  id: number
  name: string
  avatar: string
  mutualFriends: number
}

interface FriendRequest extends Friend {
  timestamp: string
}

interface FriendSuggestion extends Friend {
  suggestionReason: string
}

const friendRequests = ref<FriendRequest[]>([
  {
    id: 1,
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    mutualFriends: 5,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    mutualFriends: 3,
    timestamp: '1 day ago',
  },
])

const friendSuggestions = ref<FriendSuggestion[]>([
  {
    id: 1,
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    mutualFriends: 8,
    suggestionReason: 'You have 8 mutual friends',
  },
  {
    id: 2,
    name: 'Michael Brown',
    avatar: 'https://i.pravatar.cc/150?img=4',
    mutualFriends: 6,
    suggestionReason: 'You went to the same school',
  },
  {
    id: 3,
    name: 'Sarah Davis',
    avatar: 'https://i.pravatar.cc/150?img=5',
    mutualFriends: 4,
    suggestionReason: 'You work in the same industry',
  },
])

const friends = ref<Friend[]>([
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=6',
    mutualFriends: 12,
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=7',
    mutualFriends: 15,
  },
])

const filteredFriends = computed(() => {
  if (!searchQuery.value) return friends.value
  return friends.value.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const acceptFriendRequest = (id: number) => {
  const request = friendRequests.value.find((r) => r.id === id)
  if (request) {
    friends.value.push({
      id: request.id,
      name: request.name,
      avatar: request.avatar,
      mutualFriends: request.mutualFriends,
    })
    friendRequests.value = friendRequests.value.filter((r) => r.id !== id)
  }
}

const declineFriendRequest = (id: number) => {
  friendRequests.value = friendRequests.value.filter((r) => r.id !== id)
}

const sendFriendRequest = (id: number) => {
  // Implement friend request sending logic
  console.log('Sending friend request to:', id)
}

const removeSuggestion = (id: number) => {
  friendSuggestions.value = friendSuggestions.value.filter((s) => s.id !== id)
}

const messageFriend = (id: number) => {
  // Implement messaging logic
  console.log('Messaging friend:', id)
}

const unfriend = (id: number) => {
  friends.value = friends.value.filter((f) => f.id !== id)
}
</script>

<style scoped>
.friends-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.friends-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.search-box {
  width: 300px;
}

.friends-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.friends-section {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.friends-section h2 {
  margin: 0 0 20px;
  font-size: 1.5rem;
  color: var(--color-heading);
}

.friend-requests,
.suggestions-grid,
.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.friend-card,
.suggestion-card {
  background: var(--color-background);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.friend-avatar,
.suggestion-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.friend-info,
.suggestion-info {
  flex: 1;
}

.friend-info h3,
.suggestion-info h3 {
  margin: 0 0 5px;
  font-size: 1.1rem;
}

.friend-info p,
.suggestion-info p {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.suggestion-reason {
  font-style: italic;
  margin-top: 5px !important;
}

.friend-actions,
.suggestion-actions {
  display: flex;
  gap: 10px;
}

button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.accept-btn {
  background: var(--color-primary);
  color: var(--color-button-text);
}

.accept-btn:hover {
  background: var(--color-primary-hover);
}

.decline-btn,
.remove-suggestion-btn,
.unfriend-btn {
  background: var(--color-danger);
  color: var(--color-button-text);
}

.decline-btn:hover,
.remove-suggestion-btn:hover,
.unfriend-btn:hover {
  background: var(--color-danger-hover);
}

.add-friend-btn {
  background: var(--color-background);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.add-friend-btn:hover {
  background: var(--color-primary);
  color: var(--color-button-text);
}

.message-btn {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.message-btn:hover {
  background: var(--color-primary);
  color: var(--color-button-text);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-light);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .friends-header {
    flex-direction: column;
    gap: 15px;
  }

  .search-box {
    width: 100%;
  }

  .friend-requests,
  .suggestions-grid,
  .friends-grid {
    grid-template-columns: 1fr;
  }
}
</style>
