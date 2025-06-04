window.addEventListener('DOMContentLoaded', () => {
    const flames = document.querySelectorAll('.flame');
    const greeting = document.getElementById('greeting');
    const music = document.getElementById('birthdayMusic');
    const muteBtn = document.getElementById('muteBtn');
    const pageWrapper = document.getElementById('page-wrapper');
  
    const confettiCanvas = document.getElementById('confettiCanvas');
    const ctx = confettiCanvas.getContext('2d');
    let confettiPieces = [];
    let confettiAnimationId;
    let confettiActive = false;
  
    function resizeCanvas() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  
    class ConfettiPiece {
      constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = Math.random() * -confettiCanvas.height;
        this.size = 7 + Math.random() * 7;
        this.speed = 2 + Math.random() * 3;
        this.angle = Math.random() * 2 * Math.PI;
        this.spin = 0.1 + Math.random() * 0.3;
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
      }
      update() {
        this.y += this.speed;
        this.angle += this.spin;
        if (this.y > confettiCanvas.height) {
          this.y = Math.random() * -confettiCanvas.height;
          this.x = Math.random() * confettiCanvas.width;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
        ctx.restore();
      }
    }
  
    function createConfetti() {
      confettiPieces = [];
      for (let i = 0; i < 150; i++) {
        confettiPieces.push(new ConfettiPiece());
      }
    }
  
    function animateConfetti() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiPieces.forEach(p => {
        p.update();
        p.draw();
      });
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    }
  
    function startCelebration() {
      if (confettiActive) return;
      confettiActive = true;
  
      pageWrapper.classList.add('celebrate-bg');
  
      createConfetti();
      animateConfetti();
  
      setTimeout(() => {
        cancelAnimationFrame(confettiAnimationId);
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiActive = false;
      }, 8000);
    }
  
    function blowOutCandles() {
      flames.forEach(flame => {
        flame.classList.add('hidden');
      });
      greeting.style.color = 'hotpink';
  
      startCelebration();
    }
  
    music.volume = 0.3;
    music.play().catch(() => {
    });
  
    muteBtn.addEventListener('click', () => {
      if (music.paused) {
        music.play();
        muteBtn.textContent = '🔈 Mute';
      } else {
        music.pause();
        muteBtn.textContent = '🔇 Unmute';
      }
    });
  
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioContext = new AudioContext();
        const mic = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        mic.connect(analyser);
  
        const data = new Uint8Array(analyser.frequencyBinCount);
  
        function detectBlow() {
          analyser.getByteFrequencyData(data);
          const volume = data.reduce((a, b) => a + b, 0) / data.length;
  
          if (volume > 50) {
            blowOutCandles();
          }
  
          requestAnimationFrame(detectBlow);
        }
  
        detectBlow();
      })
      .catch(() => {
        alert('Mic access denied. Please allow microphone to use this feature.');
      });
  });
  