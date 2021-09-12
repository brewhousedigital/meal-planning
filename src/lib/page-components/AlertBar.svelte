<script>
    export let content = "";
    export let icon = "bell-fill";
</script>


<style>

</style>


<div class="alert alert-warning d-flex align-items-center" role="alert">
    <i class="bi bi-{icon} me-2 d-block"></i>
    <div>{content}</div>
</div>