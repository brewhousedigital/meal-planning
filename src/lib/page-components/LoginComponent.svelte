<script>
    // Helpers
    import {buttonProcessingState, buttonProcessingStateEnable} from "$lib/functions/buttonProcessingState";
    import Backendless from "backendless";


    // Components
    import AlertBar from "$lib/page-components/AlertBar.svelte";


    // Track the user's entry
    let formDetails = {}
    let shouldStayLoggedIn = true;


    // Error message handling
    let errorMessage = "";


    // Log a user into Backendless
    function handleLogin(e) {
        e.preventDefault();

        buttonProcessingState("#submitBtn");

        // Reset error state
        errorMessage = "";

        Backendless.UserService.login(formDetails.email, formDetails.password, shouldStayLoggedIn)
            .then((response) => {
                localStorage.setItem("userDetails", JSON.stringify(response));
                buttonProcessingState("#submitBtn", true);

                // Check for what Realm the person belongs to maybe?
                // Send user to their settlement
                window.location = "/meals";
            })
            .catch((error) => {
                // Populate with error from Backendless
                errorMessage = error;
            })
            .finally(() => {
                setTimeout(() => {
                    buttonProcessingStateEnable("#submitBtn", "Login")
                }, 2000)
            });
    }
</script>


<h2 class="mb-4">Login</h2>

<form class="" on:submit={handleLogin}>
    <div class="mb-4">
        <label for="email">Email</label>
        <input type="email" class="form-control" id="email" name="email" bind:value={formDetails.email} required>
    </div><!-- end form group -->

    <div class="mb-4">
        <label for="password">Password</label>

        <div class="position-relative">
            <input type="password"
                   class="form-control"
                   id="password"
                   name="password"
                   bind:value={formDetails.password}
                   required>
        </div><!-- end input group -->

        <div class="text-end pt-2">
            <!--<a href="/login/forgot-password" class="text-decoration-none fw-bold font-14">Forgot Password?</a>-->
        </div>
    </div><!-- end form group -->


    {#if errorMessage !== ""}
        <AlertBar content={errorMessage} />
    {/if}


    <button type="submit" id="submitBtn" class="btn btn-primary btn-lg w-100" name="submit">Login</button>
</form>


<style>

</style>