<script>
    import {onMount} from "svelte";

    let isUserLoggedIn = false;
    import LoginComponent from "$lib/page-components/LoginComponent.svelte";

    onMount(() => {
        let userDetails = JSON.parse(localStorage.getItem("userDetails"));
        if(userDetails.email !== undefined) isUserLoggedIn = true;
    })
</script>




{#if isUserLoggedIn}
    <img src="https://media.giphy.com/media/K4x1ZL36xWCf6/giphy.gif?cid=ecf05e47bl64mvb7etxqckarqixcr6gvrw8jr1o8dturqrpt&rid=giphy.gif&ct=g" class="img-fluid rounded">
{:else}
    <LoginComponent />
{/if}