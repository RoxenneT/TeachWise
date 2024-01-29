<script>
import axios from 'axios';
export default {
    data() {
        return {
            // serverHost: 'http://127.0.0.1:7000',
            serverHost: 'http://172.28.0.242:7000',
            error: '',
            isSuccess: false,
            student: {
                id: 1,
                photo: '',
                surname: '',
                name: '',
                email: '',
                password: '',
            }
        };
    },
    created() {
        axios.get(`${this.serverHost}/api/user/profile`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                let data = response.data;
                console.log(data);
                this.student.id = data["user_id"];
                this.student.name = data["first_name"];
                this.student.surname = data["last_name"];
                this.student.email = data["email"];
                this.student.password = data["password"];
                this.student.photo = `${this.serverHost}${data["image"]}`;
                console.log(this.student.photo);
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
    },
    methods: {
        changePhoto(event) {
            const file = event.target.files[0];
            if (file) {
                this.convertImageToDataUrl(file);
                console.log("Выбран файл:", file);
            }
        },
        convertImageToDataUrl(imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.student.photo = e.target.result;
            };
            reader.readAsDataURL(imageFile);
        },
        submitForm() {
            const formData = new FormData();

            formData.append('first_name', this.student.name);
            formData.append('last_name', this.student.surname);
            formData.append('email', this.student.email);
            formData.append('password', this.student.password);

            const fileInput = document.getElementById('fileInput');
            if (fileInput.files.length > 0) {
                formData.append('img', fileInput.files[0]);
            }

            axios.put(`${this.serverHost}/api/user`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(response => {
                    let data = response.data;
                    console.log(data);
                    this.isSuccess = true
                })
                .catch(error => {
                    if (error.response && error.response.status !== 500) {
                        this.error = error.response.data.error;
                        setTimeout(() => {
                            this.error = '';
                        }, 5000);
                    }
                }); 
        },
        logout() {
            this.$store.commit('logout');
            localStorage.removeItem('token');
            this.$router.push('/');
        }
    },
};
</script>

<template>
    <div class="dashboardContainer">
        <div class="profilePhoto">
            <h3>Настройка профиля:</h3>
            <img v-if="student.photo !== 'http://172.28.0.242:7000null'" :src=student.photo alt="Фотография пользователя">
            <img v-if="student.photo === 'http://172.28.0.242:7000null'" src="/images/profile.jpg" alt="Фотография пользователя">
            <label class="custom-file-input-label" for="fileInput">Выберите файл</label>
            <input id="fileInput" style="display: none;" type="file" @change="changePhoto" accept="image/*" />
        </div>

        <form @submit.prevent="submitForm">
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <label for="name">Имя:</label>
                <input id="name" type="text" v-model="student.name">

                <label for="surname">Фамилия:</label>
                <input id="surname" type="text" v-model="student.surname">
            </div>

            <div style="display: flex; flex-direction: column; gap: 15px;">
                <label for="email">E-mail</label>
                <input id="email" type="text" v-model="student.email">

                <label for="password">Пароль:</label>
                <input id="password" type="text" v-model="student.password">
            </div>
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
                <button type="submit">Сохранить</button>
                <button type="button" @click="logout">Выйти</button>
            </div>
        </form>
        <div class="errorCatcher" v-if="error">{{ error }}</div>
        <div class="great" v-if="isSuccess">Данные сохранены!</div>
    </div>
</template >

<style scoped>
.dashboardContainer {
    width: 98%;
    min-height: 95vh;
    max-height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.profilePhoto {
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
}

img {
    width: 250px;
    height: 250px;
    border-radius: 10px;
}

input {
    width: 310px;
    height: 36px;
    color: black;
    font-size: 15px;
    font-weight: bold;
    padding-left: 10px;
    border-radius: 5px;
    border: 1px solid rgb(29, 88, 62);
    outline: none;
}

input::placeholder {
    color: black;
    font-size: 15px;
}

form {
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;
}

textarea {
    width: 518px;
    height: 100px;
    font-size: 15px;
    font-weight: bold;
}

.popup {
    width: 400px;
    min-height: 400px;
    max-height: 800px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.custom-file-input-label,
button {
    width: 150px;
    height: 30px;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    background-color: #3498db;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.errorCatcher {
    background-color: rgba(201, 89, 89, 0.559);
}

.great {
    background-color: rgba(89, 201, 93, 0.559);
}

.errorCatcher,
.great {
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
    .dashboardContainer {
        flex-direction: column;
        height: fit-content;
        gap: 30px;
    }

    .profilePhoto {
        width: 100%;
    }

    form {
        width: 100%;
        margin-bottom: 20px;
    }

    .errorCatcher,
    .great {
        left: 89%;
        background-color: rgb(243, 243, 243);
    }

    .errorCatcher {
        color: red;
    }

    .great {
        color: rgb(32, 141, 32);
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