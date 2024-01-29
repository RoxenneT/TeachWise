<template>
  <main>
    <div class="wrapper">
      <h1>Начните онлайн урок</h1>

      <form class="join-form" @submit="joinWithName">
        <div class="name-container">
          <label for="name">Имя</label>
          <input id="name" v-model="name" type="text" required />
          <label for="name">Ссылка на видеочат</label>
          <input
            id="url"
            v-model="url"
            type="text"
            placeholder="https://your-daily-domain.daily.co/room-name"
            required
          />
        </div>
        <div class="submit-container">
          <button type="submit">Начать</button>
        </div>
      </form>

      <p class="subtext">
        Нажмите "Разрешить", чтобы использовать камеру и микрофон на всплывающем окне
      </p>
    </div>
  </main>
</template>

<script>
export default {
  name: "HomeScreen",
  props: {
    joinCall: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      name: "",
      url: "",
    };
  },
  methods: {
    joinWithName() {
      this.joinCall(this.name, this.url);
    },
  },
};
</script>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: #fff;
  border: none;
}
.wrapper {
  max-width: 1200px;
  margin: auto;
  padding: 0 16px;
  text-align: center;
}
.wrapper p {
  margin: 8px 0;
}
.join-form {
  display: flex;
  flex-direction: column;
  width: 350px;
  margin: auto;
}

.join-form label {
  font-size: 18px;
  color: #6b7785;
  text-align: left;
  margin: 8px 0 4px;
}
.join-form input {
  padding: 8px;
  border: 1px solid #c8d1dc;
  border-radius: 12px;
}
.join-form div {
  display: flex;
  justify-content: center;
}
.join-form .submit-container button {
  padding: 7px 16px 9px;
  font-size: 12px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  margin-top: 16px;
  margin-bottom: 12px;
  background-color: #59af83;
  cursor: pointer;
}
.join-form .name-container {
  flex-direction: column;
}
.subtext {
  width: 500px;
    text-align: center;
  font-size: 16px;
  color: #6b7785;
}

@media (max-width: 1390px) {
  .subtext{
    width: 400px;
    text-align: center;
  }
}
</style>
