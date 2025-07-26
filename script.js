// 1) On récupère l'affichage et tous les boutons
const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".calc-button");

// 2) Etat interne de la calculatrice
let current = "0";        // Ce qui est affiché
let justEvaluated = false; // Pour savoir si on vient d'appuyer sur "="

const opMap = { "×": "*", "÷": "/", "−": "-" };

// 3) Helpers
const isOperator = (ch) => ["+", "-", "*", "/"].includes(ch);

function updateDisplay() {
  display.textContent = current;
}

function sanitize(expr) {
  // remplace les symboles jolis par les vrais opérateurs JS
  return expr.replace(/[×÷−]/g, (m) => opMap[m]);
}

function handleNumber(digit) {
  if (current === "0" || justEvaluated) {
    current = digit;
    justEvaluated = false;
  } else {
    current += digit;
  }
}

function handleDot() {
  // On empêche plusieurs '.' dans le même nombre
  const lastNumber = current.split(/[\+\-\*\/]/).pop();
  if (!lastNumber.includes(".")) {
    current += ".";
  }
}

function handleOperator(op) {
  const normalized = opMap[op] || op; // transforme × ÷ − en * / -
  const last = current.slice(-1);

  if (isOperator(last)) {
    // si le dernier char est déjà un opérateur, on le remplace
    current = current.slice(0, -1) + normalized;
  } else {
    current += normalized;
  }
  justEvaluated = false;
}

function handleClear() {
  current = "0";
  justEvaluated = false;
}

function handleBackspace() {
  if (justEvaluated) {
    // après "=", un backspace remet à 0
    current = "0";
    justEvaluated = false;
    return;
  }
  if (current.length <= 1) {
    current = "0";
  } else {
    current = current.slice(0, -1);
  }
}

function handleEqual() {
  try {
    const expr = sanitize(current);
    // ATTENTION : eval est pratique ici, mais à éviter sur des inputs non maîtrisés
    const result = eval(expr);
    current = String(result);
    justEvaluated = true;
  } catch (e) {
    current = "Erreur";
    justEvaluated = true;
  }
}

// 4) Gestion des clics sur les boutons
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.textContent.trim();

    if (value === "C") {
      handleClear();
    } else if (value === "←") {
      handleBackspace();
    } else if (value === "=" || value === "=&equals;") {
      handleEqual();
    } else if (value === ".") {
      handleDot();
    } else if (["+", "−", "×", "÷"].includes(value)) {
      handleOperator(value);
    } else if (!isNaN(value)) {
      // chiffre
      handleNumber(value);
    }

    updateDisplay();
  });
});

// (Optionnel) 5) Support clavier
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key)) {
    handleNumber(key);
  } else if (key === ".") {
    handleDot();
  } else if (["+", "-", "*", "/"].includes(key)) {
    handleOperator(key);
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    handleEqual();
  } else if (key === "Backspace") {
    handleBackspace();
  } else if (key.toLowerCase() === "c") {
    handleClear();
  } else {
    return; // on ignore le reste
  }

  updateDisplay();
});
