<template>
  <div class="matches-page">
    <!-- Хлебные крошки -->
    <v-col class="page-breadcrumb mb-4" cols="12">
      <router-link to="/leagues" class="breadcrumb-link">Лиги</router-link>
      <span> &gt; </span>
      <span style="color: #065f46"
        >Матчи команды <i>{{ teamName }}</i></span
      >
    </v-col>

    <!-- Заголовки -->
    <div class="header-texts">
      <h1>Расписание матчей команды {{ teamName }}</h1>
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

      <!-- Фильтр по дате -->
      <v-expansion-panels class="mb-6">
        <v-expansion-panel>
          <v-expansion-panel-title>
            Фильтрация по дате
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row justify="space-around">
              <v-col cols="12" sm="6">
                <v-date-picker
                  v-model="dateFrom"
                  locale="ru"
                  label="Начальная дата"
                  color="emerald"
                  show-current
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-date-picker
                  v-model="dateTo"
                  locale="ru"
                  label="Конечная дата"
                  color="emerald"
                  show-current
                />
              </v-col>
            </v-row>

            <v-row justify="center" class="mt-4" style="mask-border: 12px">
              <v-btn @click="clearFilter" color="emerald" variant="tonal">
                Очистить фильтр
              </v-btn>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Таблица матчей -->
      <v-data-table
        :headers="headers"
        :items="filteredMatches"
        :items-per-page="itemsPerPage"
        class="elevation-2"
      >
        <template #item.utcDate="{ item }">
          {{ new Date(item.utcDate).toLocaleString("ru-RU") }}
        </template>

        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" small>
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <template #item.homeTeam="{ item }">
          <b v-if="item.homeTeam.id.toString() === currentTeamId">
            {{ item.homeTeam.name }}
          </b>
          <span v-else>
            {{ item.homeTeam.name }}
          </span>
        </template>

        <template #item.awayTeam="{ item }">
          <b v-if="item.awayTeam.id.toString() === currentTeamId">
            {{ item.awayTeam.name }}
          </b>
          <span v-else>
            {{ item.awayTeam.name }}
          </span>
        </template>

        <template #item.score="{ item }">
          <b v-if="item.status === 'SCHEDULED'">Матч ещё не состоялся</b>
          <b v-else-if="item.status === 'TIMED'">Перерыв между таймами</b>
          <b v-else>
            {{ item.score?.halfTime?.home ?? "-" }} :
            {{ item.score?.halfTime?.away ?? "-" }}
          </b>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "MatchesTable",
  data() {
    return {
      dateFrom: null,
      dateTo: null,
      itemsPerPage: 12,
      matches: [],
      isLoading: false,
      teamName: "", // желательно загрузить имя команды в mounted
      headers: [
        { key: "utcDate", title: "Дата" },
        { key: "status", title: "Статус" },
        { key: "homeTeam", title: "Команда хозяев" },
        { key: "awayTeam", title: "Команда гостей" },
        { key: "score", title: "Счёт" },
      ],
    };
  },
  computed: {
    currentTeamId() {
      return String(this.$route.params.id) || "";
    },
    filteredMatches() {
      return this.matches.filter((match) => {
        const matchDate = new Date(match.utcDate).getTime();
        const from = this.dateFrom
          ? new Date(this.dateFrom).setHours(0, 0, 0, 0)
          : null;
        const to = this.dateTo
          ? new Date(this.dateTo).setHours(23, 59, 59, 999)
          : null;
        return (!from || matchDate >= from) && (!to || matchDate <= to);
      });
    },
  },
  methods: {
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
        IN_PLAY: "В игре",
        POSTPONED: "Отложен",
        SUSPENDED: "Приостановлен",
        CANCELED: "Отменён",
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
        CANCELED: "red darken-4",
      };
      return statusMap[status] || "default";
    },
    loadMatches() {
      this.isLoading = true;
      const teamId = this.currentTeamId;
      if (!teamId) {
        console.error("Team ID не задан");
        this.isLoading = false;
        return;
      }
      api
        .get(`/api/v4/teams/${teamId}/matches`)
        .then((response) => {
          this.matches = response.data.matches || [];
          if (this.matches.length) {
            this.teamName =
              this.matches[0].homeTeam.name === this.currentTeamId
                ? this.matches[0].homeTeam.name
                : this.matches[0].awayTeam.name;
          }
        })
        .catch((error) => {
          console.error("Ошибка загрузки матчей:", error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  mounted() {
    this.loadMatches();
  },
};
</script>

<style scoped>
.matches-page {
  padding: 24px;
}
.page-breadcrumb {
  font-size: 1rem;
  margin-bottom: 12px;
  user-select: none;
}
.breadcrumb-link {
  color: #20b981;
  text-decoration: none;
  font-weight: 600;
}
.breadcrumb-link:hover {
  text-decoration: underline;
  cursor: pointer;
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
  padding-bottom: 0.3em;
  border-bottom: 3px solid #10b981;
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
</style>
