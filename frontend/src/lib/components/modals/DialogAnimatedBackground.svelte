<script lang="ts">
    export let colors = [
        // Inspired by Aurora Borealis
        ["#3B9C9C", "#72C2C2", "#A4D8D8", "#D4E3F2", "#0E4D92"],
        
        // Ocean Breeze
        ["#003D5B", "#04756F", "#54B2A9", "#A0E8AF", "#F4F1BB"],
        
        // Ocean Wave
        ["#005F73", "#0A9396", "#94D2BD", "#E9D8A6", "#EE9B00"]
    ];

    import { onMount, onDestroy } from 'svelte';
    
    // Receive scroll position from parent
    export let scrollPosition: number = 0;
    
    // Define the structure for circle objects
    interface Circle {
        x: number;
        y: number;
        dx: number;
        dy: number;
        radius: number;
        color: string;
        baseRadius: number;
        scale: number;
    }

    let canvas: HTMLCanvasElement | undefined;
    let ctx: CanvasRenderingContext2D | null;
    let circles: Circle[] = [];
    const circleCount = 5;
    const speed = 0.5;

    onMount(() => {
        if (!canvas) return;
        
        ctx = canvas.getContext('2d');
        if (!ctx) return; // Ensure context is not null
        
        // Flatten the color arrays into a single array
        const colorsSet = colors.flat();
        
        const resizeCanvas = () => {
            if (!canvas) return; // Add check for canvas existence
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const minRadius = Math.max(window.innerWidth/8, 150);
        const maxRadiusRange = Math.min(window.innerWidth/4, 700);
        
        // Generate initial positions and properties for circles
        for (let i = 0; i < circleCount; i++) {
            if (!canvas) continue; // Need canvas dimensions
            const radius = (Math.random() * maxRadiusRange) + minRadius;
            circles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() - 0.5) * speed, // Movement speed and direction
                dy: (Math.random() - 0.5) * speed,
                radius,
                color: colorsSet[Math.floor(Math.random() * colorsSet.length)],
                baseRadius: radius, // Save initial radius for scaling
                scale: Math.random() * 0.05 + 0.95 // Random scale factor around 1
            });
        }
        
        // Animation loop
        let animationId: number | undefined;
        const animate = () => {
            if (!ctx || !canvas) return; // Ensure ctx and canvas are available
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate opacity based on scroll position
            const opacity = Math.max(0, 1 - scrollPosition / 600);

            circles.forEach(circle => {
                if (!ctx || !canvas) return; // Ensure ctx and canvas are available inside loop too
                ctx.beginPath();
                // Compute scale based on time or position
                const scale = Math.cos(Date.now() * 0.001 + circle.baseRadius) * 0.2 + 0.8; // Scale oscillation
                const scaledRadius = circle.baseRadius * scale;
                
                ctx.arc(circle.x, circle.y, scaledRadius, 0, Math.PI * 2, false);
                ctx.fillStyle = circle.color;
                ctx.globalAlpha = opacity; // Set alpha per circle based on scroll
                ctx.filter = 'blur(124px)'; // Applying blur for overlap effect
                ctx.fill();
                ctx.filter = 'none'; // Reset filter for other potential drawings
                ctx.closePath();
                
                // Move circles within a range
                circle.x += circle.dx;
                circle.y += circle.dy;
                if (circle.x + scaledRadius > canvas.width || circle.x - scaledRadius < 0) {
                    circle.dx = -circle.dx;
                }
                if (circle.y + scaledRadius > canvas.height || circle.y - scaledRadius < 0) {
                    circle.dy = -circle.dy;
                }
            });
            animationId = requestAnimationFrame(animate);
        };
        
        animate();
        
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationId !== undefined) {
                cancelAnimationFrame(animationId);
            }
        };
    });
</script>

<div class="background-container">
    <canvas bind:this={canvas} style="display: block; width: 120%; height: 100%;"></canvas>
</div>

<style>
    .background-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        overflow: hidden;
    }
</style>