<template>
  <div class="news-feed-container">
    <div class="create-post-card">
      <div
        :class="[
          'create-post',
          newPostContent.trim() || pastedImages.length ? 'create-post-flex-column' : '',
        ]"
      >
        <img src="@/assets/images/avatar.png" alt="User Avatar" class="avatar" />
        <div class="input-wrapper">
          <textarea
            v-model="newPostContent"
            placeholder="What's on your mind?"
            @input="adjustHeight"
            @paste="handlePaste"
            class="post-input"
            ref="textareaRef"
          />
          <div class="post-actions">
            <div class="action-buttons">
              <button class="action-btn" @click="triggerImageUpload">
                <i class="pi pi-image" />
                <span>Photo</span>
              </button>
              <button class="action-btn">
                <i class="pi pi-video" />
                <span>Video</span>
              </button>
              <button class="action-btn">
                <i class="pi pi-map-marker" />
                <span>Location</span>
              </button>
              <button class="action-btn">
                <i class="pi pi-smile" />
                <span>Feeling</span>
              </button>
            </div>
          </div>
          <div class="image-preview" v-if="pastedImages.length">
            <div v-for="(image, index) in pastedImages" :key="index" class="image-container">
              <img :src="image" alt="Pasted Image" class="pasted-image" />
              <i class="remove-image pi pi-times-circle" @click="removeImage(index)" />
            </div>
          </div>
        </div>
        <button
          v-if="newPostContent.trim() || pastedImages.length"
          class="submit-btn"
          @click="submitPost"
          :disabled="isSubmitting"
        >
          <i class="pi pi-spinner pi-spin" v-if="isSubmitting" />
          <span v-else>Create post</span>
        </button>
      </div>
    </div>

    <div class="post-filters">
      <div class="filter-option active">
        <i class="pi pi-bolt" />
        <span>For You</span>
      </div>
      <div class="filter-option">
        <i class="pi pi-users" />
        <span>Friends</span>
      </div>
      <div class="filter-option">
        <i class="pi pi-star" />
        <span>Favorites</span>
      </div>
      <div class="filter-option">
        <i class="pi pi-history" />
        <span>Recent</span>
      </div>
    </div>

    <input
      type="file"
      ref="fileInputRef"
      accept="image/*"
      multiple
      style="display: none"
      @change="handleFileSelected"
    />

    <div v-if="posts.length" class="posts-container">
      <div v-for="(post, index) in posts" :key="index" class="post-card">
        <div class="post-header">
          <img src="@/assets/images/avatar.png" alt="User Avatar" class="post-avatar" />
          <div class="post-meta">
            <h3 class="post-author">{{ post.author }}</h3>
            <span class="post-time">{{ post.time }}</span>
          </div>
          <button class="post-menu-btn">
            <i class="pi pi-ellipsis-h" />
          </button>
        </div>
        <div class="post-content">
          <p>{{ post.content }}</p>
        </div>
        <div v-if="post.images && post.images.length" class="post-images">
          <img
            v-for="(image, imgIndex) in post.images"
            :key="imgIndex"
            :src="image"
            alt="Post Image"
            class="post-image"
            @click="viewImage(image)"
          />
        </div>
        <div class="post-stats">
          <div class="stats-item">
            <i class="pi pi-heart" />
            <span>{{ post.likes }} Likes</span>
          </div>
          <div class="stats-item">
            <i class="pi pi-comment" />
            <span>{{ post.comments }} Comments</span>
          </div>
          <div class="stats-item">
            <i class="pi pi-share-alt" />
            <span>{{ post.shares }} Shares</span>
          </div>
        </div>
        <div class="post-actions">
          <button class="post-action-btn" @click="likePost(index)">
            <i class="pi pi-heart-fill" v-if="post.isLiked" :class="{ liked: post.isLiked }" />
            <i class="pi pi-heart" v-else />
            <span>Like</span>
          </button>
          <button class="post-action-btn" @click="focusComment(index)">
            <i class="pi pi-comment" />
            <span>Comment</span>
          </button>
          <button class="post-action-btn" @click="sharePost(index)">
            <i class="pi pi-share-alt" />
            <span>Share</span>
          </button>
        </div>
        <div class="comment-section">
          <div class="comment-input">
            <img src="@/assets/images/avatar.png" alt="User Avatar" class="comment-avatar" />
            <input
              type="text"
              :ref="
                (el) => {
                  commentRefs[index] = el as HTMLInputElement
                }
              "
              placeholder="Write a comment..."
              v-model="commentInputs[index]"
              @keyup.enter="addComment(index)"
            />
            <button class="send-comment-btn" @click="addComment(index)">
              <i class="pi pi-send" />
            </button>
          </div>
          <div v-if="post.commentList && post.commentList.length" class="comments-list">
            <div v-for="(comment, comIndex) in post.commentList" :key="comIndex" class="comment">
              <img :src="comment.avatar" alt="Commenter Avatar" class="comment-avatar" />
              <div class="comment-content">
                <span class="comment-author">{{ comment.author }}</span>
                <p class="comment-text">{{ comment.text }}</p>
                <div class="comment-actions">
                  <span class="comment-time">{{ comment.time }}</span>
                  <button class="comment-like">Like</button>
                  <button class="comment-reply">Reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="isLoading" class="loading-container">
      <i class="pi pi-spinner pi-spin loading-icon" />
      <p>Loading posts...</p>
    </div>

    <div v-else class="empty-state">
      <i class="pi pi-inbox empty-icon" />
      <h3>No Posts Yet</h3>
      <p>Create your first post or connect with friends to see their posts here.</p>
    </div>

    <div v-if="selectedImage" class="image-viewer-overlay" @click="closeImageViewer">
      <div class="image-viewer-container">
        <img :src="selectedImage" alt="Full size image" class="full-size-image" />
        <button class="close-viewer-btn" @click.stop="closeImageViewer">
          <i class="pi pi-times" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

const newPostContent = ref('')
const pastedImages = ref<string[]>([])
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isSubmitting = ref(false)

const commentRefs = ref<Record<number, HTMLInputElement | null>>({})
const commentInputs = ref<string[]>([])

const selectedImage = ref<string | null>(null)

const isLoading = ref(true)
const posts = ref<any[]>([])

onMounted(() => {
  setTimeout(() => {
    posts.value = [
      {
        id: 1,
        author: 'Jane Doe',
        time: '2 hours ago',
        content:
          'Just finished my latest project! Really excited to share it with everyone. What do you think?',
        images: ['https://picsum.photos/id/1/600/400'],
        likes: 42,
        comments: 8,
        shares: 3,
        isLiked: false,
        commentList: [
          {
            author: 'John Smith',
            avatar: 'https://i.pravatar.cc/40?img=2',
            text: 'This looks amazing! Great job.',
            time: '1 hour ago',
          },
          {
            author: 'Alice Johnson',
            avatar: 'https://i.pravatar.cc/40?img=5',
            text: 'I love the design, very clean and modern!',
            time: '30 minutes ago',
          },
        ],
      },
      {
        id: 2,
        author: 'Robert Chen',
        time: '5 hours ago',
        content: 'Beautiful day for a hike in the mountains! The view was absolutely breathtaking.',
        images: ['https://picsum.photos/id/10/600/400', 'https://picsum.photos/id/11/600/400'],
        likes: 89,
        comments: 14,
        shares: 7,
        isLiked: true,
        commentList: [
          {
            author: 'Maria Garcia',
            avatar: 'https://i.pravatar.cc/40?img=3',
            text: 'Wow! Which trail is this?',
            time: '4 hours ago',
          },
        ],
      },
      {
        id: 3,
        author: 'Sarah Williams',
        time: 'Yesterday',
        content:
          'Just got back from an amazing conference on AI and machine learning. So many brilliant minds and innovative ideas!',
        images: [],
        likes: 36,
        comments: 5,
        shares: 2,
        isLiked: false,
        commentList: [],
      },
    ]
    isLoading.value = false
    commentInputs.value = Array(posts.value.length).fill('')
  }, 1000)
})

const adjustHeight = () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = '52px'
      textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
    }
  })
}

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (items) {
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            pastedImages.value.push(e.target?.result as string)
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }
}

const triggerImageUpload = () => {
  fileInputRef.value?.click()
}

const handleFileSelected = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = (e) => {
        pastedImages.value.push(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const removeImage = (index: number) => {
  pastedImages.value.splice(index, 1)
}

const submitPost = async () => {
  // if (!newPostContent.value.trim() && !pastedImages.value.length) {
  //   alert('Post content or images are required.')
  //   return
  // }
  // isSubmitting.value = true
  // try {
  //   const response = await postStore.createPost({
  //     content: newPostContent.value,
  //     images: pastedImages.value,
  //   })
  //   if (response.isSuccess) {
  //     const newPost = {
  //       id: Date.now(),
  //       author: 'You',
  //       time: 'Just now',
  //       content: newPostContent.value,
  //       images: pastedImages.value,
  //       likes: 0,
  //       comments: 0,
  //       shares: 0,
  //       isLiked: false,
  //       commentList: [],
  //     }
  //     posts.value.unshift(newPost)
  //     newPostContent.value = ''
  //     pastedImages.value = []
  //     adjustHeight()
  //     commentInputs.value.unshift('')
  //   } else {
  //     console.error('Failed to create post:', response.message)
  //     alert(response.message || 'Failed to create post. Please try again.')
  //   }
  // } catch (error) {
  //   console.error('Error creating post:', error)
  //   alert('An unexpected error occurred. Please try again.')
  // } finally {
  //   isSubmitting.value = false
  // }
}

const likePost = (index: number) => {
  const post = posts.value[index]
  if (post.isLiked) {
    post.likes--
  } else {
    post.likes++
  }
  post.isLiked = !post.isLiked
}

const focusComment = (index: number) => {
  nextTick(() => {
    if (commentRefs.value[index]) {
      commentRefs.value[index]?.focus()
    }
  })
}

const sharePost = (index: number) => {
  posts.value[index].shares++
  alert('Post shared successfully!')
}

const addComment = (index: number) => {
  if (!commentInputs.value[index]?.trim()) return

  const post = posts.value[index]
  if (!post.commentList) post.commentList = []

  post.commentList.push({
    author: 'You',
    avatar: '@/assets/images/avatar.png',
    text: commentInputs.value[index],
    time: 'Just now',
  })

  post.comments++
  commentInputs.value[index] = ''
}

const viewImage = (image: string) => {
  selectedImage.value = image
  document.body.style.overflow = 'hidden'
}

const closeImageViewer = () => {
  selectedImage.value = null
  document.body.style.overflow = ''
}
</script>

<style scoped>
.news-feed-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

.create-post-card {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.create-post {
  display: flex;
  gap: 12px;
  width: 100%;
}

.create-post-flex-column {
  flex-direction: column;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.post-input {
  width: 100%;
  min-height: 52px;
  max-height: 200px;
  resize: none;
  overflow-y: auto;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  font-size: 1rem;
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  font-family: inherit;
  transition: all 0.3s ease;
}

.post-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

.post-actions {
  margin-top: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(var(--color-primary-rgb), 0.08);
  color: var(--color-primary);
}

.action-btn i {
  font-size: 1.1rem;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.image-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.pasted-image {
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-image:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.submit-btn {
  align-self: flex-end;
  margin-top: 12px;
  padding: 10px 20px;
  background: var(--color-primary);
  color: var(--color-button-text);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.post-filters {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 5px 0;
  margin: 0 -10px;
  padding: 0 10px;
  scrollbar-width: none;
}

.post-filters::-webkit-scrollbar {
  display: none;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--color-background-soft);
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-option:hover {
  background: rgba(var(--color-primary-rgb), 0.15);
  color: var(--color-primary);
}

.filter-option.active {
  background: var(--color-primary);
  color: var(--color-button-text);
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.post-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.post-meta {
  flex: 1;
}

.post-author {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.post-time {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.post-menu-btn {
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.post-menu-btn:hover {
  background: rgba(var(--color-primary-rgb), 0.08);
  color: var(--color-primary);
}

.post-content {
  margin-bottom: 15px;
  line-height: 1.5;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  object-fit: cover;
  max-height: 350px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.post-image:hover {
  transform: scale(1.02);
}

.post-stats {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 10px;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.post-actions {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
}

.post-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.post-action-btn:hover {
  background: rgba(var(--color-primary-rgb), 0.08);
  color: var(--color-primary);
}

.post-action-btn:hover::before {
  content: none;
}

.post-action-btn .pi.liked,
.post-action-btn .pi-heart-fill.liked {
  color: #e74c3c;
}

.post-action-btn:hover .pi.liked,
.post-action-btn:hover .pi-heart-fill.liked {
  color: #e74c3c;
}

.comment-section {
  margin-top: 15px;
}

.comment-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-input input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  font-family: inherit;
  transition: all 0.3s ease;
}

.comment-input input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

.send-comment-btn {
  background: transparent;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.send-comment-btn:hover {
  background: rgba(var(--color-primary-rgb), 0.1);
  transform: scale(1.05);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment {
  display: flex;
  gap: 10px;
}

.comment-content {
  background: var(--color-background);
  padding: 10px 15px;
  border-radius: 18px;
  flex: 1;
}

.comment-author {
  font-weight: 600;
  font-size: 0.9rem;
}

.comment-text {
  margin: 5px 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.comment-actions {
  display: flex;
  gap: 10px;
  font-size: 0.8rem;
}

.comment-time {
  color: var(--color-text-light);
}

.comment-like,
.comment-reply {
  background: transparent;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.comment-like:hover,
.comment-reply:hover {
  background: rgba(var(--color-primary-rgb), 0.08);
  color: var(--color-primary);
}

.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background: var(--color-background-soft);
  border-radius: 12px;
  margin: 20px 0;
}

.loading-icon {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 15px;
}

.empty-icon {
  font-size: 3rem;
  color: var(--color-text-light);
  margin-bottom: 15px;
}

.empty-state h3 {
  margin: 0 0 10px;
  font-size: 1.2rem;
}

.empty-state p {
  color: var(--color-text-light);
  max-width: 400px;
}

.image-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;
}

.image-viewer-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.full-size-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.close-viewer-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-viewer-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 600px) {
  .news-feed-container {
    padding: 10px;
  }

  .post-images {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    justify-content: space-between;
  }

  .action-btn {
    padding: 8px;
  }

  .action-btn span {
    display: none;
  }

  .post-action-btn {
    flex-direction: column;
    padding: 8px 0;
  }

  .post-filters {
    gap: 8px;
  }

  .filter-option {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>
