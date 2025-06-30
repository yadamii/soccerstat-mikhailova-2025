<template>
  <v-card
    class="league-card ma-2"
    @click="$emit('handle-card-click', { id })"
  >
    <div class="card-content">
      <img
        class="emblem"
        :src="safeEmblem"
        alt="Эмблема"
        @error="onImageError"
      />
      <v-card-title>{{ name }}</v-card-title>
      <v-card-subtitle>{{ league }}</v-card-subtitle>
    </div>
  </v-card>
</template>

<script>
import placeholder from '@/assets/placeholder.svg'

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    emblem: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    league: {
      type: String,
      default: () => 'Не указано',
    },
  },
  emits: ['handle-card-click'],
  computed: {
    safeEmblem() {
      return this.emblem ? this.emblem.replace(/^http:/, 'https:') : placeholder
    }
  },
  methods: {
    onImageError(event) {
      event.target.src = placeholder
    }
  }
}
</script>

<style scoped>
.league-card {
  height: 100%;
  display: flex;
  justify-content: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.league-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px;
}

.emblem {
  margin-bottom: 12px;
  height: 100px;
  max-width: 100%;
  object-fit: contain;
}
.v-card-title {
  font-size: 1.2rem;
  font-weight: 600;
  padding-bottom: 4px;
  line-height: 1.4;
}
.v-card-subtitle {
  font-size: 1rem;
  color: #666;
  padding-top: 0;
}
</style>
