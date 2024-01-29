<script>
import axios from 'axios';
import { useStore } from 'vuex';
import Loading from './Loading.vue'
export default {
    components: {
        Loading,
    },
    data() {
        return {
            email: '',
            password: '',
            // serverHost: 'http://127.0.0.1:7000',
            serverHost: 'http://172.28.0.242:7000',
            error: '',
            loading: false,
        }
    },
    methods: {
        enter(form) {
            this.loading = true;
            const data = {
                email: this.email,
                password: this.password
            };
            axios.post(`${this.serverHost}/api/user/login`, data)
                .then(response => {
                    let data = response.data;
                    localStorage.setItem("token", data["token"]["token"]);
                    axios.get(`${this.serverHost}/api/user/profile`, {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    })
                        .then(response => {
                            let data = response.data;
                            localStorage.setItem("profile", JSON.stringify(data))
                        })
                        .catch(error => {
                            if (error["response"]["status"] !== 500) {
                                this.error = error["response"]["data"]["error"];
                                setTimeout(() => {
                                    this.error = '';
                                }, 5000);
                            }
                        });
                    let tempData = data['token']['type']
                    localStorage.setItem("type", tempData)
                    this.$store.commit('updateRoles', { tempData, isAuthenticated: true });
                    this.$router.push('/');
                })
                .catch(error => {
                    if (error["response"]["status"] !== 500) {
                        this.error = error["response"]["data"]["error"];
                        setTimeout(() => {
                            this.error = '';
                        }, 5000);
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
}
</script>

<template>
    <div class="enterContainer">
        <div class="laptop" :class="{ 'hide': loading }">
            <div class="decor">
                <div style="display: flex; flex-direction: row; margin-top: 10px;">
                    <div style="width: 15px; height: 15px; background-color: red; border-radius: 50%; margin-left: 10px;">
                    </div>
                    <div
                        style="width: 15px; height: 15px; background-color: orange; border-radius: 50%; margin-left: 10px;">
                    </div>
                    <div style="width: 15px; height: 15px; background-color: green; border-radius: 50%; margin-left: 10px;">
                    </div>
                </div>

                <form @submit.prevent="enter" action="POST">
                    <input type="text" placeholder="E-mail" v-model="email">
                    <input type="password" placeholder="Пароль" v-model="password">
                    <button type="submit">Войти</button>
                </form>
            </div>
            <div class="errorCatcher" v-if="error">{{ error }}</div>
        </div>
        <loading v-if="loading"></loading>
    </div>
</template >

<style scoped>
.enterContainer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 50px;
    padding-bottom: 50px;
}

.hide {
    z-index: -1;
}

.laptop {
    width: 680px;
    height: 620px;
    background-image: url('/images/pngtree-laptop-3d-view-simple-flat-vector-png-image_6623050.png');
    background-size: 100% 100%;
}

.decor {
    width: 300px;
    height: 330px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: white;
    border-radius: 10px;
    border: 1px solid rgb(8, 114, 72);
}

form {
    width: 300px;
    height: 300px;
    background-color: rgb(82, 137, 116);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(8, 114, 72);
    border-radius: 0 0 10px 10px;
    gap: 20px;
}

input {
    width: 200px;
    height: 30px;
    outline: none;
    font-size: 18px;
    text-align: center;
}

input::placeholder {
    text-align: center;
}

button {
    color: white;
    font-size: 20px;
    background-color: rgb(255, 185, 56);
    border: none;
    width: 100px;
    height: 30px;
    border-radius: 20px;
    box-shadow: none;
}

button:hover {
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.366);
}

.errorCatcher {
    min-width: 300px;
    max-width: 400px;
    min-height: 150px;
    max-height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    position: absolute;
    top: -20%;
    left: 80%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: rgba(201, 89, 89, 0.559);
    border: 1px solid #ccc;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.422);
    border-radius: 15px;
    animation: 5s ease slidein;
    font-size: 18px;
    font-weight: bold;
    color: black;
    text-align: center;
}

@keyframes slidein {
    0% {
        top: 20%;
    }

    50% {
        top: 30%;
    }

    70% {
        top: 30%;
    }

    80% {
        top: 30%;
    }

    100% {
        top: 30%;
    }
}

@media (max-width: 1317px) {
    .laptop {
        width: 400px;
        height: 700px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('/images/phone.png');
    }

    .decor {
        width: 0;
        border: none;
        background-color: none;
    }

    form {
        background-color: transparent;
        border: none;
        margin-left: -158px;
    }

    .errorCatcher {
        left: 94%;
        background-color: white;
        color: red;
    }

    @keyframes slidein {
        0% {
            top: 60%;
        }

        50% {
            top: 82%;
        }

        70% {
            top: 82%;
        }

        80% {
            top: 82%;
        }

        100% {
            top: 82%;
        }
    }
}
</style>