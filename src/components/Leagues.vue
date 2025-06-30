<template>
  <div>
    <!-- Заголовки -->
    <div class="header-texts">
      <h1>Лиги</h1>
      <h2>Здесь ты найдёшь свою любимую лигу</h2>
      <h3>Кликни на карточку, чтобы посмотреть матчи</h3>
    </div>

    <!-- Анимированная строка поиска -->
    <transition name="fade-slide">
      <v-text-field
        v-model="searchQuery"
        class="styled-search mb-6"
        clearable
        label="Найди свою любимую лигу"
        outlined
        hide-details
        prepend-inner-icon="mdi-magnify"
        @input="onSearchInput"
      />
    </transition>

    <!-- Лоадер при загрузке -->
    <v-progress-circular
      v-if="isLoading"
      class="d-block mx-auto my-8"
      color="primary"
      indeterminate
    />

    <!-- Сообщение, если лиг нет -->
    <v-alert
      v-else-if="filteredLeagues.length === 0"
      class="ma-4"
      type="info"
    >
      {{ searchQuery ? 'По этому запросу ничего не нашлось' : 'Такой лиги не существует' }}
    </v-alert>

    <!-- Карточки лиг + пагинация -->
    <template v-else>
      <v-row>
        <v-col
          v-for="league in paginatedLeagues"
          :key="league.id"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <card
            :id="league.id"
            :emblem="league.emblem"
            :league="league.area.name"
            :name="league.name"
            @handle-card-click="goToLeague"
          />
        </v-col>
      </v-row>

      <!-- Пагинация -->
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
  data () {
    return {
      page: 1,
      itemsPerPage: 12,
      leagues: [],
      searchQuery: '',
      isLoading: false,
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.filteredLeagues.length / this.itemsPerPage)
    },
    paginatedLeagues () {
      const start = (this.page - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredLeagues.slice(start, end)
    },
    filteredLeagues () {
      if (!this.searchQuery) return this.leagues
      const query = this.searchQuery.toLowerCase()
      return this.leagues.filter(league =>
        league.name.toLowerCase().includes(query)
      )
    }
  },
  mounted () {
    this.loadLeagues()
  },
  methods: {
    onSearchInput () {
      this.page = 1
    },
    loadLeagues () {
      this.isLoading = true
      api.get('api/v4/competitions')
        .then(response => {
          this.leagues = response.data.competitions
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isLoading = false
        })
    },
    goToLeague (payload) {
      this.$router.push(`/league/?id=${payload.id}`)
    }
  }
}
</script>

<style scoped>
.main {
  padding: 32px;
}
.v-pagination {
  justify-content: center;
}

/* Заголовки */
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

/* Анимированная строка поиска */
.styled-search {
  max-width: 600px;
  margin-right: auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(83, 219, 56, 0.678);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.styled-search:hover,
.styled-search:focus-within {
  box-shadow: 0 12px 32px rgb(158, 202, 138);
  transform: translateY(-2px);
}

/* Анимация появления */
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
