<template>
    <div class="mx-72">
        <nav class="py-3">
            <div class="flex justify-between items-center">
                <span class="font-medium">Suplování Ječná</span>
                <button
                    class="bg-gray-800 text-white text-sm font-medium rounded-md hover:shadow-lg py-2 px-4">Vyzkoušet<i
                        class="fa-sharp fa-solid fa-square-arrow-up-right ml-2"></i></button>
            </div>
        </nav>
        <div class="bg-slate-200 p-32 rounded-lg">
            <h1 class="text-4xl text-gray-800 font-medium">Suplování Ječná</h1>
            <h2 class="text-2xl text-gray-500">Snadný nástroj pro správu suplování</h2>
            <button
                class="bg-white text-gray-800 font-medium text-lg rounded-md hover:shadow-lg py-2 px-4 mt-5">Vyzkoušejte
                nyní<i class="fa-sharp fa-solid fa-square-arrow-up-right ml-2"></i></button>
            <button
                class="bg-gray-800 text-white font-medium text-lg rounded-md hover:shadow-lg py-2 px-4 mt-5 ml-4">Dostupné
                na GitHubu<i class="fa-brands fa-github ml-2"></i></button>
        </div>
        <div class="flex gap-4 mt-4">
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