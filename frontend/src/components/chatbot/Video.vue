<template>
  <h3>Videos</h3>
  <div class="videos-container">
    <div class="video" v-for="(video, index) in videos" :key="index" @click="openVideo(video.link)">
      <img :src="video.imageUrl" alt="Video thumbnail" />
      <div class="watch-label">
          <font-awesome-icon class="icon" icon="fa-solid fa-play" />
      </div>
      <div class="overlay">
        <div class="title">{{ video.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videos: {
      type: Array,
      required: true
    }
  },
  methods: {
    openVideo(link) {
      window.open(link, '_blank');
    }
  }
};
</script>

<style scoped>
.videos-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columns */
  gap: 10px; /* Space between items */
}

.video {
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  border: 2px solid transparent; /* Initial transparent border for transition */
  border-radius: 8px; /* Optional: Rounded corners */
}

.video img {
  width: 100%; /* Make the video thumbnails responsive */
  height: auto;
  display: block; /* Ensures no extra space around the image */
  border-radius: 6px; /* Optional: Rounded corners matching the container */
}

.video:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #3498db; /* Border color on hover */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 6px; /* Match the image rounded corners */
}

.watch-label {
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 2vw;
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  font-size: 1vw;
  display: flex;
  align-items: center;
  border-radius: 50%;
}

.watch-label .icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.play-icon {
  margin-left: 5px;
}

.video:hover .overlay {
  opacity: 1;
}

.title {
  color: white;
  font-size: 0.7vw;
  line-height: 0.9vw;
  font-weight: bold;
  text-align: center;
  padding: 10px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .videos-container {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on smaller screens */
    gap: 8px;
  }

  .video {
    width: 100%;
  }

  .video img {
    width: 100%;
  }

}
</style>
