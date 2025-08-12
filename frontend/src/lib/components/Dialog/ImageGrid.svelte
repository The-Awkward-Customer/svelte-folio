<script lang="ts">
  type GridVariant = 'one' | 'two' | 'three' | 'four';

  const { variant, areaA, areaB, areaC, areaD } = $props<{
    variant: GridVariant;
    areaA: () => any;
    areaB?: () => any;
    areaC?: () => any;
    areaD?: () => any;
  }>();

  // Validation logic
  if (variant === 'two' && !areaB) {
    console.error('DialogSectionGrid variant "two" requires areaB content.');
  }
  if (variant === 'three' && (!areaB || !areaC)) {
    console.error(
      'DialogSectionGrid variant "three" requires areaB and areaC content.'
    );
  }
  if (variant === 'four' && (!areaB || !areaC || !areaD)) {
    console.error(
      'DialogSectionGrid variant "four" requires areaB, areaC, and areaD content.'
    );
  }
</script>

<div
  class="dialog-section-grid"
  class:variant-one={variant === 'one'}
  class:variant-two={variant === 'two'}
  class:variant-three={variant === 'three'}
  class:variant-four={variant === 'four'}
>
  <div class="grid-area area-a">{@render areaA()}</div>
  {#if areaB}
    <div class="grid-area area-b">{@render areaB()}</div>
  {/if}
  {#if areaC}
    <div class="grid-area area-c">{@render areaC()}</div>
  {/if}
  {#if areaD}
    <div class="grid-area area-d">{@render areaD()}</div>
  {/if}
</div>

<style>
  .dialog-section-grid {
    display: grid;
    gap: 12px;
    overflow: hidden; /* Basic overflow handling */
    background-color: rgba(255, 105, 180, 0.3); /* Pink with opacity */
  }

  .grid-area {
    overflow: hidden; /* Basic overflow handling for individual areas */
    background-color: rgba(0, 0, 255, 0.3); /* Blue with opacity */
  }

  /* Mobile Styles (default) */
  .variant-one {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: 'A';
  }

  .variant-two {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr;
    grid-template-areas:
      'A'
      'B';
  }

  .variant-three {
    grid-template-columns: 1fr;
    grid-template-rows: 4fr 3fr 2fr;
    grid-template-areas:
      'A'
      'B'
      'C';
  }

  .variant-four {
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 2fr 2fr 1fr;
    grid-template-areas:
      'A'
      'B'
      'D'
      'C';
  }

  .area-a {
    grid-area: A;
  }
  .area-b {
    grid-area: B;
  }
  .area-c {
    grid-area: C;
  }
  .area-d {
    grid-area: D;
  }

  /* Desktop Styles */
  @media (min-width: 896px) {
    .dialog-section-grid {
      aspect-ratio: 16 / 9;
    }

    .variant-one {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
      grid-template-areas: 'A';
    }

    .variant-two {
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr;
      grid-template-areas: 'A B';
    }

    .variant-three {
      grid-template-columns: 2fr 1fr;
      grid-template-rows: repeat(5, 1fr);
      grid-template-areas:
        'A B'
        'A B'
        'A B'
        'A C'
        'A C';
    }

    .variant-four {
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: repeat(4, 1fr);
      grid-template-areas:
        'A B D'
        'A B D'
        'A B D'
        'A C D';
    }
  }
</style>
