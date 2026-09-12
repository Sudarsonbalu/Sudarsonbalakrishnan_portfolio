import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 180 };

    // Get current mode (dark/light)
    const isDark = () => document.documentElement.classList.contains('dark');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseSize = Math.random() * 2 + 1;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.color = '';
      }

      update(dark) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce on boundaries
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Interactive mouse effects
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            // Push or pull particles slightly
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 1.5;
            this.y -= (dy / distance) * force * 1.5;
            this.size = this.baseSize * (1 + force * 1.5);
          } else {
            if (this.size > this.baseSize) {
              this.size -= 0.1;
            }
          }
        }

        // Set colors based on dark mode status
        if (dark) {
          this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(168, 85, 247, 0.4)';
        } else {
          this.color = 'rgba(59, 130, 246, 0.25)';
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // Dynamic density based on screen size
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000);
      const cap = Math.min(numberOfParticles, 120); // Cap particles to maintain top performance
      
      for (let i = 0; i < cap; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };

    const drawLines = (dark) => {
      const maxDistance = 110;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            // Calculate opacity based on distance
            const alpha = (1 - distance / maxDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            
            if (dark) {
              // Blend gradient lines between nodes
              ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            } else {
              ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 1.5})`;
            }
            
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      const dark = isDark();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update(dark);
        particle.draw();
      });

      drawLines(dark);

      // Mouse interactive web
      if (mouse.x !== null && mouse.y !== null && mouse.radius > 0) {
        particles.forEach((particle) => {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius - 20) {
            const alpha = (1 - distance / mouse.radius) * 0.15;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particle.x, particle.y);
            if (dark) {
              ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            } else {
              ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 1.5})`;
            }
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Event listeners
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Init and start loop
    resizeCanvas();
    animate();

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none transition-colors duration-300"
    />
  );
};

export default ParticleBackground;
