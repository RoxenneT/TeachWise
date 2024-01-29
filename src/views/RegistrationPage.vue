<script>
import axios from 'axios';
import Loading from './Loading.vue'
export default {
    components: {
        Loading,
    },
    data() {
        return {
            first_name: '',
            last_name: '',
            email: '',
            type: '',
            password: '',
            // serverHost: 'http://127.0.0.1:7000',
            serverHost: 'http://172.28.0.242:7000',
            error: '',
            statusText: '',
            loading: false,
        }
    },
    methods: {
        register(form) {
            this.loading = true;
            const data = {
                first_name: this.first_name,
                last_name: this.last_name,
                email: this.email,
                type: this.type,
                password: this.password
            };
            axios.post(`${this.serverHost}/api/user`, data, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
                .then(response => {
                    console.log(response);
                    this.statusText = response['status']
                    if (this.statusText === 201) {
                        this.loginAfterRegistration(data.email, data.password);
                    }
                })
                .catch(error => {
                    if (error["response"]["status"] !== 500) {
                        this.error = error["response"]["data"]["error"];
                        setTimeout(() => {
                            this.error = '';
                        }, 5000);
                    }
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loginAfterRegistration(email, password) {
            this.loading = true;
            const loginData = {
                email: email,
                password: password
            };

            axios.post(`${this.serverHost}/api/user/login`, loginData)
                .then(response => {
                    let data = response.data;
                    console.log(data);
                    localStorage.setItem("token", data.token.token);
                    console.log(data.token.token);
                    this.$store.commit('updateRoles', { ...data, isAuthenticated: true });
                    this.$router.push('/');
                })
                .catch(error => {
                    if (error.response.status !== 500) {
                        this.error = error.response.data.error;
                        setTimeout(() => {
                            this.error = '';
                        }, 5000);
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    }
}
</script>

<template>
    <div class="containerRegistration">
        <div class="imageDecorationForRegistration" :class="{ 'hide': loading }"></div>
        <div class="registration" :class="{ 'hide': loading }">
            <h2>Регистрация</h2>
            <form @submit.prevent="register" method="POST">
                <input type="text" name="name" placeholder="Имя" v-model="first_name" required>
                <input type="text" name="surname" placeholder="Фамилия" v-model="last_name" required>
                <select name="role" v-model="type">
                    <option value="teacher">Учитель</option>
                    <option value="student">Студент</option>
                </select>
                <input type="text" name="email" placeholder="E-mail" v-model="email" required>
                <input type="password" name="password" placeholder="Пароль" v-model="password" required>
                <button type="submit">Готово</button>
            </form>
            <div class="errorCatcher" v-if="error">{{ error }}</div>
        </div>
        <loading v-if="loading"></loading>
    </div>
</template >

<style scoped>
.containerRegistration {
    width: 100%;
    height: 95vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 50px;
}

.hide {
    z-index: -1;
}

.registration {
    width: 40%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

h2 {
    color: rgb(8, 114, 72);
    font-size: 28px;
}

.imageDecorationForRegistration {
    width: 430px;
    height: 600px;
    background-image: url('/images/register.png');
    background-size: 100% 100%;
}

form {
    width: 400px;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;
}

input,
select {
    width: 400px;
    height: 50px;
    color: white;
    font-size: 18px;
    font-weight: bold;
    padding-left: 10px;
    background-color: rgba(116, 181, 158, 0.929);
    box-shadow: inset -5px 10px 10px -5px rgb(27, 82, 57);
    border-radius: 5px;
    border: none;
    outline: none;
}

input::placeholder {
    color: white;
    font-size: 18px;
}

button {
    color: white;
    font-size: 20px;
    background-color: rgb(255, 185, 56);
    border: none;
    width: 110px;
    height: 40px;
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
    left: 40%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.422);
    border-radius: 15px;
    animation: 5s ease slidein;
    font-size: 18px;
    font-weight: bold;
    color: black;
    text-align: center;
}

.errorCatcher {
    background-color: rgba(201, 89, 89, 0.559);
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
    .containerRegistration {
        height: auto;
        padding-bottom: 20px;
        flex-direction: column;
    }

    .errorCatcher {
        top: -20%;
        left: 95%;
        background-color: rgb(233, 130, 130)
    }

    @keyframes slidein {
        0% {
            top: 180%;
        }

        50% {
            top: 200%;
        }

        70% {
            top: 200%;
        }

        80% {
            top: 200%;
        }

        100% {
            top: 200%;
        }
    }
}
</style>