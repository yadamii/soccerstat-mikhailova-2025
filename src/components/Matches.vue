<template>
  <div class="body">
    <v-col class="page-breadcrumb" >
      <router-link to="/leagues" style="color: #20b981; text-decoration: none;">Лиги</router-link> &gt; Матчи лиги <i>{{ leagueName }}</i>
    </v-col>

    <div class="header-texts">
      <h1>Расписание матчей лиги {{ leagueName }}</h1>
      <h2>Узнай всё о прошедших и грядущих играх в одном месте</h2>
      <h3>Выбери даты, чтобы не пропустить важные события</h3>
    </div>

    <div class="match-wrapper">
      <v-progress-circular
        v-if="isLoading"
        class="d-block mx-auto my-8"
        color="emerald"
        indeterminate
      />

      <v-expansion-panels class="mb-6">
        <v-expansion-panel>
          <v-expansion-panel-title>Фильтрация по дате</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row justify="space-around">
              <v-col cols="12" sm="6">
                <v-date-picker
                  v-model="dateFrom"
                  locale="ru"
                  title="Начальная дата"
                  color="emerald"
                  show-current
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-date-picker
                  v-model="dateTo"
                  locale="ru"
                  title="Конечная дата"
                  color="emerald"
                  show-current
                />
              </v-col>
            </v-row>

            <v-row justify="center" class="mt-4">
              <v-btn @click="clearFilter" color="emerald" variant="tonal">
                Очистить фильтр
              </v-btn>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-data-table
        :headers="headers"
        :items="filteredMatches"
        class="elevation-2"
      >
        <template #item.utcDate="{ item }">
          {{ new Date(item.utcDate).toLocaleString() }}
        </template>

        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" small>
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <template #item.homeTeam="{ item }">
          <b>{{ item.homeTeam?.name }}</b>
        </template>

        <template #item.awayTeam="{ item }">
          <b>{{ item.awayTeam?.name }}</b>
        </template>

        <template #item.score="{ item }">
          <b v-if="item.status === 'SCHEDULED'">Матч ещё не состоялся</b>
          <b v-else-if="item.status === 'TIMED'">Перерыв между таймами</b>
          <b v-else>
            {{ item.score?.halfTime?.home }} : {{ item.score?.halfTime?.away }}
          </b>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  data() {
    return {
      dateFrom: null,
      dateTo: null,
      matches: [],
      leagueName: '',    // добавили переменную для имени лиги
      isLoading: false,
      headers: [
        { key: "utcDate", title: "Дата" },
        { key: "status", title: "Статус" },
        { key: "homeTeam", title: "Команда хозяев" },
        { key: "awayTeam", title: "Команда гостей" },
        { key: "score", title: "Счет" },
      ],
    };
  },
  computed: {
    filteredMatches() {
      return this.matches.filter((match) => {
        const matchDate = new Date(match.utcDate);
        const from = this.dateFrom
          ? new Date(this.dateFrom).setHours(0, 0, 0, 0)
          : null;
        const to = this.dateTo
          ? new Date(this.dateTo).setHours(23, 59, 59, 999)
          : null;

        return (
          (!from || matchDate.getTime() >= from) &&
          (!to || matchDate.getTime() <= to)
        );
      });
    },
  },
  methods: {
    loadLeagueName(id) {
      api.get(`/api/v4/competitions/${id}`)
        .then(response => {
          this.leagueName = response.data.name || 'Неизвестная лига';
        })
        .catch(() => {
          this.leagueName = 'Неизвестная лига';
        });
    },
    loadMatches(id) {
      this.isLoading = true;
      api.get(`/api/v4/competitions/${id}/matches`)
        .then((response) => {
          this.matches = response.data.matches;
        })
        .catch((error) => console.error(error))
        .finally(() => {
          this.isLoading = false;
        });
    },
    clearFilter() {
      this.dateFrom = null;
      this.dateTo = null;
    },
    getStatusText(status) {
      const statusMap = {
        FINISHED: "Матч завершен",
        SCHEDULED: "Запланирован",
        LIVE: "В прямом эфире",
        TIMED: "Перерыв",
        IN_PLAY: "Играется",
        POSTPONED: "Отложен",
        SUSPENDED: "Приостановлен",
        CANCELED: "Отменен",
      };
      return statusMap[status] || status;
    },
    getStatusColor(status) {
      const statusMap = {
        FINISHED: "green",
        SCHEDULED: "grey",
        LIVE: "red",
        TIMED: "orange",
        IN_PLAY: "emerald",
        POSTPONED: "blue-grey",
        SUSPENDED: "purple",
        CANCELED: "red-darken-4",
      };
      return statusMap[status] || "default";
    },
  },
  mounted() {
    const leagueId = this.$route.query.id;
    this.loadLeagueName(leagueId);
    this.loadMatches(leagueId);
  },
};
</script>

<style scoped>
.body {
  padding: 12px 24px;
}
/* Заголовки */
.header-texts {
  text-align: center;
  margin-bottom: 24px;
}

.header-texts h1 {
  font-size: 2.6rem;
  font-weight: 700;
  margin-top: 32px;
  margin-bottom: 32px;
  color: #10b981; /* emerald */
  padding-bottom: 0.3em; /* пространство под текстом */
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

.match-wrapper {
  padding: 24px;
}

.v-expansion-panel-title {
  color: #077552;
  font-weight: 600;
  font-size: 16px;
}

.v-data-table {
  border-radius: 12px;
}

/* Стили хлебных крошек */
.page-breadcrumb {
  font-size: 1rem;
  color: #065f46;
  margin-bottom: 12px;
}

.page-breadcrumb a {
  color: #10b981;
  text-decoration: none;
}

.page-breadcrumb a:hover {
  text-decoration: underline;
}
</style>
