<script>

    // Helper functions
    import {onMount} from "svelte";

    // Import Backendless
    import Backendless from 'backendless'
    import AlertBar from "$lib/page-components/AlertBar.svelte";
    const APP_ID = 'BFD3873C-0565-EBFE-FFA8-8001D60AC000';
    const API_KEY = '8561E43D-334E-44E4-B05E-40A81D6E081A';
    Backendless.initApp(APP_ID, API_KEY);


    // Define the footer links
    let footerLinks = [
        {name: 'Meals', icon: 'archive', url: '#'},
        {name: 'Shopping', icon: 'cart', url: '#'},
        {name: 'Selected', icon: 'list-ol', url: '#'},
    ]

    // Render the loading icon or not
    let isSiteReadyToLoad = false;


    // Show/hide content based on logged in status
    let isUserLoggedIn = false;


    // Error messaging
    let errorMessage = "";


    onMount(() => {
        // Setup localstorage on first load
        if(localStorage.getItem("userDetails") === null) {
            localStorage.setItem("userDetails", JSON.stringify(null))
        }

        // Get the current URL
        let currentURL = window.location.pathname;

        let status = false;

        Backendless.UserService.getCurrentUser()
            .then(function(response) {
                if(response === null) {
                    // This is a temporary variable to track through the approved pages loop

                    // Check for homepage
                    if(currentURL === "/") status = true;

                    isUserLoggedIn = false;
                } else {
                    // Save the user's info just in case it updated
                    localStorage.setItem("userDetails", JSON.stringify(response))
                    status = true;
                    isUserLoggedIn = true;
                }

                // If they are not logged in, and are accessing a restricted page, send them to the login page
                if(!status) {
                    window.location = "/";
                } else {
                    // Content can now be loaded
                    isSiteReadyToLoad = true;
                }
            })

            .catch(function(error) {
                // TODO: Trigger alert bar here
                console.log(error)

                // This will prevent the site from loading unless we clear out everything on error
                localStorage.setItem("userDetails", JSON.stringify({}))

                // This is our App ID appended to the end of the name
                localStorage.removeItem("Backendless_BFD3873C-0565-EBFE-FFA8-8001D60AC000");

                status = false;
            });
    })
</script>


{#if isSiteReadyToLoad}
    <header class="container">
        <h1 class="fw-bold text-center mb-4">Meal Plan</h1>
    </header>


    <main class="container">
        <slot></slot>
    </main>


    <footer class="border-top">
        <div class="container">
            <div class="d-flex justify-content-between align-items-end text-center">
                {#each footerLinks as link}
                    <a href={link.url} sveltekit:prefetch class="footer-link col">
                        <div><i class="bi bi-{link.icon}"></i></div>
                        <div>{link.name}</div>
                    </a>
                {/each}
            </div><!-- end flex -->
        </div><!-- end container -->
    </footer>
{:else}
    <main style="width: 100%; height: 100vh;display:flex; align-items: center; justify-content: center;">
        {#if errorMessage === ""}
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        {:else}
            <AlertBar content={errorMessage} />
        {/if}
    </main>
{/if}



<style>
    main {
        min-height: 100vh;
        padding-bottom: 90px;
    }

    footer {
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 0;
        padding: 4px;
        background-color: #fff;
    }
    .footer-link {
        text-decoration: none;
        color: #6c757d;
        font-weight: 600;
    }

    .footer-link i {
        font-size: 30px;
        color: #222;
    }
</style>