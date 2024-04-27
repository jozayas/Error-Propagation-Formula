const inputForm = document.getElementById("InputForm");
const outputDiv = document.getElementById("OutputDiv");

inputForm.addEventListener("submit", (event) => {
  event.preventDefault();

  while (outputDiv.firstChild) {
    outputDiv.removeChild(outputDiv.firstChild);
  }

  const inputText = document.getElementById("InputTextBox");

  inputFormula = inputText.value;

  const formula = nerdamer(inputFormula);

  const variables = formula.variables();

  let sum = nerdamer("0");

  variables.forEach((arg) => {
    const deltavar = nerdamer("Delta" + arg);

    const term = nerdamer.diff(formula, arg).multiply(deltavar).pow(2);

    sum = sum.add(term);
  });

  const errorFormula = sum.pow("1/2");

  const correctedLatex = getCorrectFormula(errorFormula);

  print_original_formula(formula);

  print_output_formula(correctedLatex);
});

function getCorrectFormula(errorFormula) {
  const fixedDelta = errorFormula.toTeX().replace(/Delta/g, "Delta ");

  const greekLetterNames =
    "(?<!\\\\)alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega";

  const fixedGreekLetters = fixedDelta.replace(
    new RegExp(`\\b(${greekLetterNames})\\b`, "g"),
    (match) => {
      return `\\${match} `;
    }
  );

  const removedDots = fixedGreekLetters.replace(/\\Delta \\cdot/g, "\\Delta");

  const correctedLatex = removedDots;
  return correctedLatex;
}

function print_original_formula(formula) {
  const header = document.createElement("h2");

  header.textContent = "Original Formula";

  outputDiv.appendChild(header);

  const inputp = document.createElement("p");

  const latexformula = formula.toTeX();

  inputp.innerHTML = `\\[${latexformula}\\]`;

  MathJax.typeset([inputp]);

  outputDiv.appendChild(inputp);

  addCopyButton(outputDiv, latexformula);
}

function addCopyButton(div, latexformula) {
  const buttondiv = document.createElement("div");
  buttondiv.className = "container";

  div.appendChild(buttondiv);

  const copybutton = document.createElement("button");
  copybutton.textContent = "Copy to Clipboard";
  copybutton.className = "copy-button";

  buttondiv.appendChild(copybutton);

  copybutton.addEventListener("click", (event) => {
    toClipboard(event, latexformula);
    copybutton.textContent = "📋 Copied!";
    copybutton.className = "copy-button-copied";
    setTimeout(() => {
      copybutton.textContent = "Copy to Clipboard";
      copybutton.className = "copy-button";
    }, 1500);
  });
}

async function toClipboard(event, textToCopy) {
  console.log(textToCopy);
  event.preventDefault();

  await navigator.clipboard.writeText(textToCopy);
}

function print_output_formula(correctedLatex) {
  const header = document.createElement("h2");

  header.textContent = "Error Formula";

  outputDiv.appendChild(header);

  const answerp = document.createElement("p");

  answerp.innerHTML = `\\[${correctedLatex}\\]`;

  MathJax.typeset([answerp]);

  outputDiv.appendChild(answerp);

  addCopyButton(outputDiv, correctedLatex);
}
