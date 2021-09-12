<script context="module">
    export async function load(ctx) {
        // "category" is the name of the folder. That is where the parameter comes from
        let slug = ctx.page.params;
        return {props: {slug: slug}};
    }
</script>

<script>
    export let slug;
    let mealSlug = slug['meal'];

    import meals from "$lib/data/meals.json";

    let meal = meals.filter(item => item.url === mealSlug);
    if(meal.length !== 1) window.location = "/meals";

    meal = meal[0];


</script>


<div class="mb-3"><img src="/images/meals/{meal.image !== null ? meal.image : 'coming-soon.jpg'}" class="img-fluid"></div>
<h2>{meal.name}</h2>

<p>{meal.description}</p>

<div class="mb-3">
    {#each meal.tags as tag}
        <span class="text-small text-muted fst-italic badge bg-light me-2">{tag}</span>
    {/each}
</div>

<p>Cook Time: {meal.cookTime} minutes</p>

<p>Leftovers? {meal.leftovers ? '👍' : '❌'}</p>

<h3>Ingredients</h3>
<ul>
    {#each meal.ingredients as ingredient}
        <li>{ingredient}</li>
    {/each}
</ul>


<h3>Instructions</h3>
<ol>
    {#each meal.instructions as instruction}
        <li>{instruction}</li>
    {/each}
</ol>



<style>

</style>