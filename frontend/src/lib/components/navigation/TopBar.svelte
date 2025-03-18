<!-- TopBar component -->


<script>
    import logoSvg from "$lib/assets/logo.svg"
</script>

<div class="top-bar-root">
    <img class="logo" src={logoSvg} alt="logo" />

    <div class="action-slot">
        <slot name="action">
            <!-- Default action content if needed -->
        </slot>
    </div>
</div>

<style>
    .top-bar-root {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        height: 88px;
        padding-left: 24px;
        padding-right: 24px;
        padding-bottom: 8px;
        max-width: 568px;

    }

    .logo {
        width: 24px;
        height: 24px;
    }

    .action-slot {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: fit-content;
    }

    /* Hide on desktop */
    @media (min-width: 896px) {
        .top-bar-root {
            display: none;
        }
    }
</style>
