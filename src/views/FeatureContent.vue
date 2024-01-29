<template>
    <div class="featureContentContainer">
        <div class="card">
            <img style="width: 78px; height: 72px;" src="/images/icon1.png" alt="">
            <h3>Единое пространство:</h3>
            <div style="width: 30px; height: 3px; background-color: darkgray;"></div>
            <span>
                Наши онлайн-уроки предлагают уникальный опыт, позволяя вам обучаться и преподавать, используя всего один
                сайт. Забудьте о сложных настройках и сотнях открытых вкладок на вашем компьютере.
            </span>
        </div>
        <div class="card">
            <img style="width: 54px; height: 61px;" src="/images/icon2.png" alt="">
            <h3>Мгновенный доступ к материалам:</h3>
            <div style="width: 30px; height: 3px; background-color: darkgray;"></div>
            <span>
                Все учебные материалы и задания отображаются непосредственно на сайте. Нет необходимости переключаться
                между
                разными приложениями - всё у вас под рукой.
            </span>
        </div>
        <div class="card">
            <img style="width: 107px; height: 72px;" src="/images/icon3.png" alt="">
            <h3>Виртуальное общение:</h3>
            <div style="width: 30px; height: 3px; background-color: darkgray; "></div>
            <span>
                Это больше чем просто урок - это интерактивный опыт, который позволяет общаться, задавать вопросы,
                делиться материалами урока, словно вы находитесь в одной комнате.
            </span>
        </div>
    </div>
</template>
  
<script>
export default {

};
</script>

<style scoped>
.featureContentContainer {
    width: 100%;
    height: 95vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 50px;
}


.card {
    width: 320px;
    height: 510px;
    padding: 10px;
    background-color: #e3e3e3cc;
    border-radius: 20px;
    box-shadow: 13px 4px 4px 0px #A69C9C;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    padding: 30px;
}

h3 {
    color: #278E7C;
    font-size: 20px;
    text-align: center;
    line-height: 25px;
}

h1 {
    line-height: 10px;
    color: darkgray;
}

span {
    color: black;
    font-size: 18px;
}

@media (max-width: 1317px) {
    .featureContentContainer {
        height: auto;
        flex-direction: column;
        height: fit-content;
    }

    .card {
        width: 400px;
        height: 400px;
    }
}
</style>