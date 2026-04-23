let current = 0;
let exam = [];
let locked = false;

// 🔀 Shuffle
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// ▶ iniciar
function startPractice() {
  let n = parseInt(document.getElementById("numQuestions").value);
  if (!n || n <= 0) n = 10;

  exam = shuffle(questions).slice(0, n);

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");

  document.getElementById("total").textContent = exam.length;

  render();
}

// 🔥 render
function render() {
  locked = false;

  const q = exam[current];

  document.getElementById("current").textContent = current + 1;

  // 🔥 progreso
  let percent = (current / exam.length) * 100;
  document.getElementById("bar").style.width = percent + "%";
  document.getElementById("percent").textContent = Math.round(percent) + "%";

  // 🔥 pregunta
  document.getElementById("question").textContent = q.question;

  // 🔥 imagen
  const img = document.getElementById("image");
  const imgContainer = document.getElementById("image-container");

  if (q.image && q.image.trim() !== "") {
    img.src = q.image;
    imgContainer.classList.remove("hidden");
  } else {
    imgContainer.classList.add("hidden");
    img.src = "";
  }

  // 🔥 opciones
  const cont = document.getElementById("options");
  cont.innerHTML = "";

  const letters = ["A", "B", "C", "D"];

  q.options.forEach((op, i) => {
    const btn = document.createElement("button");

    btn.className = `
      flex items-center w-full text-left p-5 rounded-2xl
      bg-surface-container-low hover:bg-surface-container transition border border-transparent
    `;

    btn.innerHTML = `
      <span class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest mr-4 font-bold">
        ${letters[i]}
      </span>
      <span class="flex-grow">${op}</span>
    `;

    btn.onclick = () => {
      if (locked) return;

      const circle = btn.querySelector("span");
      const text = btn.querySelector("span:last-child");

      // ❌ INCORRECTA
      if (i !== q.correct) {
        btn.classList.add("bg-red-500/20", "border-red-400");

        circle.classList.remove("bg-surface-container-highest");
        circle.classList.add("bg-red-400", "text-black");

        text.classList.add("text-red-300");

        const icon = document.createElement("span");
        icon.textContent = "✕";
        icon.className = "ml-3 text-red-400 font-bold";
        btn.appendChild(icon);

        return;
      }

      // ✅ CORRECTA
      locked = true;

      btn.classList.add("bg-tertiary/10", "border-tertiary");

      circle.classList.remove("bg-surface-container-highest");
      circle.classList.add("bg-tertiary", "text-black");

      text.classList.add("text-tertiary");

      const icon = document.createElement("span");
      icon.textContent = "✔";
      icon.className = "ml-3 text-primary-container font-bold";
      btn.appendChild(icon);

      setTimeout(() => {
        current++;

        if (current < exam.length) {
          render();
        } else {
          end();
        }
      }, 800);
    };

    cont.appendChild(btn);
  });
}

// 🏁 fin
function end() {
  document.getElementById("quiz").innerHTML = `
  <div class="min-h-[70vh] flex flex-col justify-center items-center text-center gap-4">
    
    <h2 class="headline text-3xl md:text-4xl font-extrabold">
      🎉 ¡Buen trabajo!
    </h2>

    <p class="text-on-surface-variant text-sm md:text-base max-w-xs sm:max-w-md lg:max-w-xl">
      Sigue mejorando con otro intento o prueba un simulacro para medir tu nivel.
    </p>

    <div class="flex gap-4 mt-4">
      
      <button onclick="location.reload()" 
        class="inline-flex items-center justify-center px-6 py-3 
        bg-gradient-to-r from-primary to-primary-container 
        text-black font-bold rounded-full
        transition-all duration-200 ease-out
        hover:scale-105 hover:shadow-lg hover:shadow-primary-container/30
        active:scale-95">
        Reintentar 
        <span class="material-symbols-outlined">replay</span>
      </button>

      <a href="../simulacro-a1/index.html"
        class="inline-flex items-center justify-center px-6 py-3 
        bg-gradient-to-r from-primary to-primary-container 
        text-black font-bold rounded-full
        transition-all duration-200 ease-out
        hover:scale-105 hover:shadow-lg hover:shadow-primary-container/30
        active:scale-95">
        Simulacro     
        <span class="material-symbols-outlined">timer</span>
      </a>

    </div>
  </div>
  `;
}
