document.addEventListener('DOMContentLoaded', () => {
    const moments = document.querySelectorAll('.moment');
    const cosmicBg = document.getElementById('cosmic-bg');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicControls = document.getElementById('musicControls');
    const progressBar = document.getElementById('progressBar');
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');
    let isPlaying = false;

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top < windowHeight * 0.9 && // Trigger when 90% in view
            rect.bottom > 0                  // Hide when fully out
        );
    }

    function updateElements() {
        const scrollY = window.scrollY;
        cosmicBg.style.transform = `translateY(${scrollY * 0.5}px)`; // Parallax effect

        moments.forEach(moment => {
            if (isInViewport(moment)) {
                moment.classList.add('visible');
            } else {
                moment.classList.remove('visible');
            }
        });
    }

    // Ensure all moments are hidden initially
    moments.forEach(moment => moment.classList.remove('visible'));

    // Music toggle and controls
    musicToggle.addEventListener('click', () => {
        if (!isPlaying) {
            backgroundMusic.play().then(() => {
                isPlaying = true;
                musicToggle.textContent = 'Pause Music';
                musicControls.classList.add('active');
                updateMusicProgress();
            }).catch(error => console.log("Audio playback failed:", error));
        } else {
            backgroundMusic.pause();
            isPlaying = false;
            musicToggle.textProgressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * backgroundMusic.duration;
    backgroundMusic.currentTime = seekTime;
});

            musicToggle.textContent = 'Play Music';
            musicControls.classList.remove('active');
        }
    });

    // Update music progress
    function updateMusicProgress() {
        if (isPlaying) {
            const current = backgroundMusic.currentTime;
            const total = backgroundMusic.duration || 0;
            const progress = (current / total) * 100 || 0;

            currentTime.textContent = formatTime(current);
            duration.textContent = formatTime(total);
            progressBar.value = progress;

            requestAnimationFrame(updateMusicProgress);
        }
    }

    // Format time (MM:SS)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Seek on progress bar change
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * backgroundMusic.duration;
        backgroundMusic.currentTime = seekTime;
    });

    // Handle audio metadata load (for duration)
    backgroundMusic.addEventListener('loadedmetadata', () => {
        duration.textContent = formatTime(backgroundMusic.duration);
    });

    // Ensure music loops correctly (redundant with HTML loop, but for safety)
    backgroundMusic.addEventListener('ended', () => {
        backgroundMusic.currentTime = 0;
        if (isPlaying) backgroundMusic.play();
    });

    window.addEventListener('scroll', updateElements, { passive: true });
    updateElements(); // Run on load

});