<script>
    import meals from "$lib/data/meals.json";

    // Process the JSON values
    let mealItems = meals.map(item => {
        item.ingredients = JSON.parse(item.ingredients);
        item.instructions = JSON.parse(item.instructions);
        item.tags = JSON.parse(item.tags);

        return item;
    });



</script>


<svelte:head>
    <title>List of all Meals</title>
</svelte:head>

<h2 class="mb-4">List of all meals</h2>

{#each mealItems as meal}
    <div class="card position-relative mb-4">
        <img src="/images/meals/{meal.image !== null ? meal.image : 'coming-soon.jpg'}" class="card-img-top" alt="Photo of {meal.name}">
        <div class="card-body">
            <h5 class="card-title">{meal.name}</h5>
            <p class="card-text">{meal.description}</p>
            <div class="mb-3">
                {#each meal.tags as tag}
                    <span class="text-small text-muted fst-italic badge bg-light me-2">{tag}</span>
                {/each}
            </div>
            <a href="/meals/{meal.url}" class="btn btn-primary stretched-link">See Recipe</a>
        </div>
    </div>
{/each}
<style>

</style>