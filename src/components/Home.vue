<template>
  <div class="body">
    <!-- Видео-фон -->
    <video autoplay muted loop playsinline class="background-video">
      <source src="@/assets/background.mp4" type="video/mp4" />
      Ваш браузер не поддерживает видео.
    </video>

    <!-- Контейнер с полупрозрачным фоном -->
    <div class="greeting">
      <div class="text-background">
        <h1 class="fade-in">Добро пожаловать на SoccerLive!</h1>
        <h2 class="fade-in delay-1">Все свежие новости, расписание и детали о твоих любимых футбольных командах и лигах — здесь!</h2>
        <h3 class="fade-in delay-2">Переходи по ссылкам ниже, чтобы узнать больше</h3>

        <!-- Анимированные кнопки -->
        <div class="button-group fade-in delay-3">
          <router-link to="/leagues" class="nav-button">Подробнее о Лигах</router-link>
          <router-link to="/teams" class="nav-button">Подробнее о Командах</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Основной фон и видео */
.body {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  object-fit: cover;
  z-index: 0;
  filter: blur(4px) brightness(0.6);
}

/* Текст и кнопки */
.greeting {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.text-background {
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 16px;
  max-width: 800px;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

/* Заголовки */
h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #c2f7d2;
}

h3 {
  font-size: 1.2rem;
  color: #ccc;
}

/* Кнопки */
.button-group {
  margin-top: 2rem;
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  background-color: #05641dd3;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  transition: transform 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-button:hover {
  background-color: #218838;
  transform: translateY(-3px) scale(1.03);
}

/* Анимации */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}

.delay-1 {
  animation-delay: 0.3s;
}
.delay-2 {
  animation-delay: 0.6s;
}
.delay-3 {
  animation-delay: 0.9s;
}
</style>
