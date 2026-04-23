let current = 0;
let selected = [];

// 🔀 Shuffle PRO
function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 🔥 EXAMEN
let exam = shuffle(questions).slice(0, 10);

// ⏱️ TIMER
let time = 40 * 60;
let timerInterval;

function startTimer() {
  const timerEl = document.getElementById("timer");

  timerInterval = setInterval(() => {
    let min = Math.floor(time / 60);
    let sec = time % 60;

    timerEl.textContent =
      `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

    if (time <= 300) {
      timerEl.classList.add("text-red-400");
    }

    if (time <= 0) {
      clearInterval(timerInterval);
      showResult();
      return;
    }

    time--;
  }, 1000);
}

// 🔥 RENDER
function render() {
  const q = exam[current];

  document.getElementById("question").textContent = q.question;

  // 🖼️ imagen
  const img = document.getElementById("image");
  const imgContainer = document.getElementById("image-container");

  if (q.image && q.image.trim() !== "") {
    img.src = q.image;
    imgContainer.classList.remove("hidden");
  } else {
    imgContainer.classList.add("hidden");
    img.src = "";
  }

  // 🔘 opciones
  const cont = document.getElementById("options");
  cont.innerHTML = "";

  const letters = ["A", "B", "C", "D"];

  q.options.forEach((op, i) => {
    const btn = document.createElement("button");

    btn.className = `
      w-full flex items-center justify-between text-left 
      p-3 md:p-4 rounded-2xl transition-all border
    `;

    btn.innerHTML = `
      <div class="flex items-center gap-4 w-full">

        <div class="w-9 h-9 flex items-center justify-center rounded-full font-bold
        ${
          selected[current] === i
            ? "bg-primary-container text-black"
            : "bg-surface-container-highest text-on-surface"
        }">
          ${letters[i]}
        </div>

        <span class="${
          selected[current] === i
            ? "text-on-surface font-semibold"
            : "text-on-surface-variant"
        } flex-1">
          ${op}
        </span>

      </div>
    `;

    if (selected[current] === i) {
      btn.classList.add("bg-primary/10", "border-primary-container");
    } else {
      btn.classList.add(
        "bg-surface-container-low",
        "hover:bg-surface-container",
        "border-transparent"
      );
    }

    btn.onclick = () => {
      selected[current] = i;
      updateButtons();
      render();
    };

    cont.appendChild(btn);
  });

  // 🔢 progreso
  document.getElementById("current").textContent =
    String(current + 1).padStart(2, "0");

  document.getElementById("total").textContent =
    String(exam.length).padStart(2, "0");

  let progress = (current / exam.length) * 100;

  document.getElementById("bar").style.width = progress + "%";
  document.getElementById("percent").textContent =
    Math.round(progress) + "%";

  updateButtons();
}

// 🔘 BOTONES
function updateButtons() {
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  const isAnswered = selected[current] !== undefined;

  nextBtn.disabled = !isAnswered;
  nextBtn.classList.toggle("opacity-40", !isAnswered);

  prevBtn.disabled = current === 0;
  prevBtn.classList.toggle("opacity-40", current === 0);
}

// ▶ siguiente
function next() {
  if (selected[current] === undefined) return;

  if (current < exam.length - 1) {
    current++;
    render();
  } else {
    showResult();
  }
}

// ◀ anterior
function prev() {
  if (current > 0) {
    current--;
    render();
  }
}

// 🏁 RESULTADOS
function showResult() {
  clearInterval(timerInterval);

  let correct = 0;

  exam.forEach((q, i) => {
    if (selected[i] === q.correct) correct++;
  });

  let total = exam.length;
  let wrong = total - correct;
  let percent = Math.round((correct / total) * 100);

  let timeUsed = 40 * 60 - time;
  let min = Math.floor(timeUsed / 60);
  let sec = timeUsed % 60;
  let timeText = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

  document.body.innerHTML = `
  <div class="min-h-screen bg-surface-container-lowest text-on-surface px-6 py-16">

    <div class="max-w-5xl mx-auto">

      <h1 class="text-4xl font-extrabold mb-2">Resultados del Simulacro</h1>
      <p class="text-on-surface-variant mb-10">Examen A1 • Simulación</p>

      <!-- RESUMEN -->
      <div class="mb-12 space-y-8">

        <!-- CIRCULO -->
        <div class="bg-surface-container rounded-3xl p-10 flex flex-col items-center">

          <div class="relative w-40 h-40 flex items-center justify-center">

            <div class="absolute inset-0 rounded-full border-[10px] border-primary-container opacity-20"></div>

            <div 
              class="absolute inset-0 rounded-full border-[10px] border-primary-container"
              style="clip-path: inset(0 ${100 - percent}% 0 0);">
            </div>

            <span class="text-5xl font-extrabold">
              ${percent}%
            </span>

          </div>

          <div class="mt-6 px-6 py-2 rounded-full font-bold
            ${percent >= 90 ? "bg-tertiary/20 text-tertiary" : "bg-red-500/20 text-red-300"}">
            ${percent >= 90 ? "APROBADO" : "DESAPROBADO"}
          </div>

        </div>

        <!-- CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div class="bg-surface-container p-6 rounded-2xl">
            <div class="text-tertiary text-xl mb-2">✔</div>
            <div class="text-3xl font-bold">${correct}</div>
            <div class="text-on-surface-variant text-sm uppercase">Correctas</div>
          </div>

          <div class="bg-surface-container p-6 rounded-2xl">
            <div class="text-red-400 text-xl mb-2">✕</div>
            <div class="text-3xl font-bold">${wrong}</div>
            <div class="text-on-surface-variant text-sm uppercase">Incorrectas</div>
          </div>

          <div class="bg-surface-container p-6 rounded-2xl">
            <div class="text-primary-container text-xl mb-2">⏱</div>
            <div class="text-3xl font-bold">${timeText}</div>
            <div class="text-on-surface-variant text-sm uppercase">Tiempo</div>
          </div>

        </div>

      </div>

      <!-- REVISIÓN -->
      <h2 class="text-2xl font-bold mb-6">Revisión de preguntas</h2>

      <div class="space-y-6">

        ${exam.map((q, i) => {
          let isCorrect = selected[i] === q.correct;

          return `
          <div class="bg-surface-container p-6 rounded-2xl">

            <div class="flex justify-between mb-4">
              <span class="text-xs text-on-surface-variant">
                PREGUNTA ${String(i + 1).padStart(2, "0")}
              </span>

              <span class="${isCorrect ? "text-tertiary" : "text-red-400"} text-xs font-bold">
                ${isCorrect ? "CORRECTA" : "INCORRECTA"}
              </span>
            </div>

            <h3 class="font-semibold mb-5">${q.question}</h3>

            <div class="grid md:grid-cols-12 gap-6 items-stretch">

              <div class="order-2 md:order-none ${q.image ? "md:col-span-8" : "md:col-span-12"}">

                <div class="space-y-3">
                  ${q.options.map((op, index) => {
                    let isUser = selected[i] === index;
                    let isReal = q.correct === index;

                    let base = "bg-surface-container-low";
                    let border = "border-transparent";
                    let icon = "";

                    if (isUser && !isReal) {
                      base = "bg-red-500/20";
                      border = "border-red-400";
                      icon = "✕";
                    }

                    if (isReal) {
                      base = "bg-tertiary/10";
                      border = "border-tertiary";
                      icon = "✔";
                    }

                    return `
                    <div class="${base} border ${border} p-4 rounded-2xl flex justify-between items-center">
                      <span>${op}</span>
                      <span>${icon}</span>
                    </div>
                    `;
                  }).join("")}
                </div>

              </div>

              ${
                q.image
                  ? `
                  <div class="order-1 md:order-none md:col-span-4 flex">
                    <div class="rounded-2xl bg-surface-container-highest p-4 w-full h-full flex items-center justify-center">
                      <img src="${q.image}" class="max-w-full max-h-full object-contain"/>
                    </div>
                  </div>
                  `
                  : ""
              }

            </div>

          </div>
          `;
        }).join("")}

      </div>

      <div class="mt-12 text-center">
        <button onclick="location.reload()"
        class="px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-black font-bold rounded-full
        hover:scale-105 hover:shadow-lg hover:shadow-primary-container/30 transition">
          Reintentar simulacro
        </button>
      </div>

    </div>

  </div>
  `;
}

// 🚀 iniciar
document.getElementById("nextBtn").onclick = next;
document.getElementById("prevBtn").onclick = prev;

startTimer();
render();