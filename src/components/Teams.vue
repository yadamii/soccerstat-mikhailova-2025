<template>
  <div class="body">

    <!-- Заголовки -->
    <div class="header-texts">
      <h1>Команды</h1>
      <h2>Здесь ты найдёшь свою любимую команду</h2>
      <h3>Кликни на карточку, чтобы посмотреть детали</h3>
    </div>

    <transition name="fade-slide">
      <v-text-field
        v-model="searchQuery"
        class="styled-search mb-6"
        clearable
        label="Поиск по названию команды"
        outlined
        hide-details
        prepend-inner-icon="mdi-magnify"
        @input="onSearchInput"
      />
    </transition>

    <v-progress-circular
      v-if="isLoading"
      class="d-block mx-auto my-8"
      color="primary"
      indeterminate
    />

    <v-alert
      v-else-if="filteredTeams.length === 0"
      class="ma-4"
      type="info"
    >
      {{ searchQuery ? 'Команды не найдены' : 'Нет доступных команд' }}
    </v-alert>

    <template v-else>
      <v-row>
        <v-col
          v-for="team in paginatedTeams"
          :key="team.id"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <card
            :id="team.id"
            :emblem="team.crest"
            :league="team.website"
            :name="team.name"
            @handle-card-click="goToTeam"
          />
        </v-col>
      </v-row>

      <v-pagination
        v-model="page"
        class="mt-4"
        :length="totalPages"
        :total-visible="7"
      />
    </template>
  </div>
</template>

<script>
import api from '@/api'
import Card from '@/components/Card.vue'

export default {
  components: { Card },
  data() {
    return {
      page: 1,
      itemsPerPage: 12,
      teams: [],
      searchQuery: '',
      isLoading: false,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredTeams.length / this.itemsPerPage)
    },
    paginatedTeams() {
      const start = (this.page - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredTeams.slice(start, end)
    },
    filteredTeams() {
      if (!this.searchQuery) return this.teams;
      const query = this.searchQuery.toLowerCase();
      return this.teams.filter(team =>
        team.name.toLowerCase().includes(query))
    },
  },
  mounted() {
    this.loadTeams();
  },
  methods: {
    onSearchInput() {
      this.page = 1;
    },
    loadTeams() {
      this.isLoading = true;
      api.get('api/v4/teams')
        .then(response => {
          this.teams = response.data.teams;
        })
        .catch(error => {
          console.error('Ошибка загрузки команд:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    goToTeam(payload) {
      this.$router.push(`/team/${payload.id}`);
    },
  },
}
</script>

<style scoped>
.body {
  padding: 12px 24px;
}
.header-texts {
  text-align: center;
  margin-bottom: 24px;
}

.header-texts h1 {
  font-size: 2.6rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #10b981; /* emerald */
  padding-bottom: 0.3em;       /* пространство под текстом */
  border-bottom: 3px solid #10b981; /* линия того же цвета, что и текст */
}

.header-texts h2 {
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 5px;
  color: #047857;
}

.header-texts h3 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 32px;
  color: #065f46;
}

/* Поиск из лиг — стили и анимация */

.styled-search {
  max-width: 600px;
  margin-right: auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(83, 219, 56, 0.678);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  margin-bottom: 24px; /* Добавляем отступ снизу */
}


.styled-search:hover,
.styled-search:focus-within {
  box-shadow: 0 12px 32px rgb(158, 202, 138);
  transform: translateY(-2px);
}

.fade-slide-enter-active {
  animation: fadeSlideIn 0.6s ease-out;
}
.fade-slide-leave-active {
  animation: fadeSlideOut 0.4s ease-in;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeSlideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
