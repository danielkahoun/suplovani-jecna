<template>
    <div class="2xl:mx-72 xl:mx-52 lg:mx-36 md:mx-12 mx-6">
        <nav class="py-3">
            <div class="flex justify-between items-center">
                <span class="font-medium">Suplování Ječná</span>
                <a href="/login"><button
                    class="bg-gray-800 text-white text-sm font-medium rounded-md hover:shadow-lg py-2 px-4">Vyzkoušet<i
                        class="fa-sharp fa-solid fa-square-arrow-up-right ml-2"></i></button></a>
            </div>
        </nav>
        <div class="bg-slate-200 2xl:bg-[url('/src/assets/header.png')] 2xl:bg-right 2xl:bg-no-repeat 2xl:bg-[length:50%] py-32 2xl:px-32 xl:px-28 lg:px-24 md:px-20 px-6 rounded-lg">
            <h1 class="text-4xl text-gray-800 font-medium">Suplování Ječná</h1>
            <h2 class="text-2xl text-gray-500">Snadný nástroj pro správu suplování</h2>
            <div class="flex flex-col gap-3 md:flex-row mt-5">
                <a href="/login">
                    <button
                        class="bg-white text-gray-800 font-medium text-lg rounded-md hover:shadow-lg py-2 px-4">Vyzkoušejte
                        nyní<i class="fa-sharp fa-solid fa-square-arrow-up-right ml-2"></i></button>
                </a>
                <a href="https://github.com/danielkahoun">
                <button
                    class="bg-gray-800 text-white font-medium text-lg rounded-md hover:shadow-lg py-2 px-4">Dostupné
                    na GitHubu<i class="fa-brands fa-github ml-2"></i></button>
                </a>
            </div>
        </div>
        <div class="flex flex-col md:flex-row gap-4 mt-4">
            <div class="bg-slate-100 w-full rounded-md p-4">
                <i class="fa-solid fa-bolt text-4xl text-yellow-500"></i>
                <h3 class="text-gray-800 text-xl font-medium mt-2">Snadné ovládání</h3>
                <p class="text-gray-600">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab, recusandae.</p>
            </div>
            <div class="bg-slate-100 w-full rounded-md p-4">
                <i class="fa-duotone fa-users text-4xl text-red-500"></i>
                <h3 class="text-gray-800 text-xl font-medium mt-2">Správa uživatelů</h3>
                <p class="text-gray-600">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab, recusandae.</p>
            </div>
            <div class="bg-slate-100 w-full rounded-md p-4">
                <i class="fa-duotone fa-calendar-days text-blue-500 text-4xl"></i>
                <h3 class="text-gray-800 text-xl font-medium mt-2">Integrace s kalendáři</h3>
                <p class="text-gray-600">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab, recusandae.</p>
            </div>
        </div>
        <div class="text-center my-24">
            <h1 class="font-light text-xl uppercase">Zvolený Tech Stack</h1>
            <h2 class="font-medium text-xl">Vue.js, Bootstrap a express.js</h2>
        </div>
    </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>