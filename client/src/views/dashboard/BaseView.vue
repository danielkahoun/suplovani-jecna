<script>
    import NavigationBar from '@/components/NavigationBar.vue'
    import FooterBar from '@/components/FooterBar.vue'

    export default {
        inject: ['getUser'],
        computed: {
            user() {
                return this.getUser();
            }
        },
        components: { NavigationBar, FooterBar },
    }
</script>

<template>
    <navigation-bar />

    <div class="container d-flex flex-column min-vh-100">
        <slot :user="user"></slot>

        <footer-bar></footer-bar>
    </div>
</template>