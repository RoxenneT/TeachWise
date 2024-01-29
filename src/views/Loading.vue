<template>
    <div class="loading">
        <div class="progress-9"></div>
    </div>
</template>

<style scoped>
.loading {
    width: 1204px;
    height: 700px;
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: white;
    z-index: 1;
}

.progress-9 {
    --r1: 154%;
    --r2: 68.5%;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background:
        radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, #3fa452 80%),
        radial-gradient(var(--r1) var(--r2) at bottom, #3fa452 79.5%, #0000 80%),
        radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, #3fa452 80%),
        #ccc;
    background-size: 50.5% 220%;
    background-position: -100% 0%, 0% 0%, 100% 0%;
    background-repeat: no-repeat;
    animation: p9 2s infinite linear;
}

@keyframes p9 {
    33% {
        background-position: 0% 33%, 100% 33%, 200% 33%
    }

    66% {
        background-position: -100% 66%, 0% 66%, 100% 66%
    }

    100% {
        background-position: 0% 100%, 100% 100%, 200% 100%
    }
}
</style>