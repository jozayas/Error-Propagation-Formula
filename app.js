const inputForm = document.getElementById("InputForm");
const outputDiv = document.getElementById("OutputDiv");

function main() {
  inputForm.addEventListener("submit", (event) => {
    event.preventDefault();

    while (outputDiv.firstChild) {
      outputDiv.removeChild(outputDiv.firstChild);
    }

    const inputText = document.getElementById("InputTextBox");

    inputFormula = inputText.value;

    const { errorFormula, formula } = getErrorFormula(inputFormula);

    const correctedLatex = getCorrectFormula(errorFormula);

    print_original_formula(formula);

    print_output_formula(correctedLatex);
  });
}

function getErrorFormula(inputFormula) {
  let formula;
  try {
    formula = nerdamer(inputFormula);
  } catch (error) {
    alert(`Error: ${error.name} - ${error.message}`);
    throw Error("The formula is not valid");
  }

  const variables = formula.variables();

  let sum = nerdamer("0");

  variables.forEach((arg) => {
    const deltavar = nerdamer("Delta" + arg);

    const term = nerdamer.diff(formula, arg).pow(2).multiply(deltavar.pow(2));

    sum = sum.add(term);
  });

  const errorFormula = sum.pow("1/2");
  return { errorFormula, formula };
}

function getCorrectFormula(
  errorFormula,
  addParenthesis = true,
  removeCDots = false
) {
  console.log(errorFormula.text());

  let addedDeltaParenthesis;

  if (addParenthesis) {
    addedDeltaParenthesis = errorFormula
      .toTeX()
      .replace(/(Delta\w+)(?:_(\{\d+\}))/g, (_, delta, subscript) => {
        return `\\left(${delta}_${subscript}\\right)`;
      });
  } else {
    addedDeltaParenthesis = errorFormula.toTeX();
  }

  const fixedDeltaWhiteSpace = addedDeltaParenthesis.replace(
    /Delta/g,
    "Delta "
  );

  const greekLetterNames =
    "(?<!\\\\)alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega";

  const fixedGreekLetters = fixedDeltaWhiteSpace.replace(
    new RegExp(`\\b(${greekLetterNames})\\b`, "g"),
    (match) => {
      return `\\${match} `;
    }
  );

  const removedDoublebars = fixedGreekLetters.replace(/\\\\/g, "\\");

  const removedDeltaDots = removedDoublebars.replace(
    /\\Delta \\cdot/g,
    "\\Delta"
  );

  let removedCDots;

  if (removeCDots) {
    removedCDots = removedDeltaDots.replace(/\\cdot /g, "");
  } else {
    removedCDots = removedDeltaDots;
  }

  const correctedLatex = removedCDots;

  return correctedLatex;
}

function print_original_formula(formula) {
  const header = document.createElement("h2");

  header.textContent = "Original Formula";

  outputDiv.appendChild(header);

  const inputp = document.createElement("p");

  const latexformula = formula.toTeX();

  console.log(latexformula);

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
  event.preventDefault();

  await navigator.clipboard.writeText(textToCopy);
}

function print_output_formula(correctedLatex) {
  console.log(correctedLatex);

  const header = document.createElement("h2");

  header.textContent = "Error Formula";

  outputDiv.appendChild(header);

  const answerp = document.createElement("p");

  answerp.innerHTML = `\\[${correctedLatex}\\]`;

  MathJax.typeset([answerp]);

  outputDiv.appendChild(answerp);

  addCopyButton(outputDiv, correctedLatex);
}

try {
  main();
} catch (error) {
  console.log("hey");
  alert(error.message);
}
