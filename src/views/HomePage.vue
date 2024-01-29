<script>
import { RouterLink } from 'vue-router';
export default {
    data() {
        return {
            components: {
                RouterLink,
            },
        }
    },
    mounted() {

    },
}
</script>

<template>
    <div class="homePageContainer">
        <div class="welcomeText">
            <div style="text-align: justify; display: flex; flex-direction: column; gap: 20px;">
                <h2>
                    Онлайн-обучение: проще, эффективнее и удобнее с нами!
                </h2>
                <span style="text-align: justify;">
                    Добро пожаловать на нашу платформу для онлайн-репетиторства, где обучение и преподавание стали проще,
                    удобнее и более эффективными, чем когда-либо!
                </span>
            </div>
            <RouterLink to="/seeMore" style=" color: #4fc5b5; text-decoration: underline #3a9286; font-size: 20px;">
                Нажмите чтобы узнать подробнее
            </RouterLink>
        </div>
        <div class="imgDecoration"></div>
    </div>
</template >

<style scoped>
.homePageContainer {
    width: 100%;
    height: 95vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.welcomeText {
    width: 492px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 30px;
}

.welcomeText>div>h2 {
    color: rgb(8, 114, 72);
    font-size: 40px;
}

.welcomeText>div>h3 {
    color: rgb(8, 114, 72);
    font-size: 20px;
}

.welcomeText>div>span {
    color: black;
    font-size: 20px;

}

.imgDecoration {
    width: 550px;
    height: 600px;
    background-image: url('/images/testimonial-1.png');
    background-size: 100% 100%;
}

.card {
    text-align: justify;
    width: 100%;
    height: 127px;
    padding: 10px;
    background-color: rgba(133, 188, 163, 0.725);
    border-radius: 20px;
    box-shadow: 0 0 5px 2px rgb(90, 90, 90);
}

.cardCenter {
    text-align: justify;
    width: 100%;
    height: 127px;
    padding: 10px;
    background-color: rgba(255, 185, 56, 0.723);
    border-radius: 20px;
    box-shadow: 0 0 5px 2px rgb(93, 93, 93);
}

button {
    width: 50px;
    height: 30px;
    background-color: white;
    border: none;
}

@media (max-width: 1317px) {
    .homePageContainer {
        width: 100%;
        height: 100%;
        flex-direction: column;
    }

    .welcomeText {
        width: 492px;
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 30px;
    }
}
</style>