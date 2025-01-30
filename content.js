let isActive = true;

const dvorakToColemak = {
  "'": "q", ",": "w", ".": "f", "p": "p", "y": "g",
  "f": "j", "g": "l", "c": "u", "r": "y", "l": ";",
  "a": "a", "o": "r", "e": "s", "u": "t", "i": "d",
  "d": "h", "h": "n", "t": "e", "n": "i", ";": "z",
  "q": "x", "j": "c", "k": "v", "x": "b", "b": "k",
  "m": "m", "s": "o", "-": "'", "/": "[", "=": "]",
  "[": "-", "]": "=", "w": ",", "v": ".", "z": "/"
};

// Highlight inputs
function highlightInputs(inputs) {
  inputs.forEach(input => {
    input.style.border = isActive ? '2px solid yellow' : '';
    if (!input.dataset.highlighted) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
      input.dataset.highlighted = "true";
    }
  });

  const focusedElement = document.activeElement;
  if (isActive && focusedElement && (focusedElement.tagName === "INPUT" || focusedElement.tagName === "TEXTAREA")) {
    focusedElement.style.border = "4px solid green";
  }
}

// Handle focus & blur
function handleFocus(event) {
  if (isActive) event.target.style.border = '4px solid green';
}
function handleBlur(event) {
  if (isActive) event.target.style.border = '2px solid yellow';
}

// Convert Dvorak to Colemak
function dvorakToColemakConversion(event) {
  if (!isActive || event.ctrlKey || event.altKey || event.metaKey) return;

  const colemakKey = dvorakToColemak[event.key];
  if (colemakKey) {
    event.preventDefault();
    const input = event.target;

    if (input.isContentEditable || input.tagName === "TEXTAREA") {
      input.setRangeText(colemakKey, input.selectionStart, input.selectionEnd, "end");
    } else if (input.tagName === "INPUT") {
      const start = input.selectionStart;
      const newValue = input.value.slice(0, start) + colemakKey + input.value.slice(input.selectionEnd);
      input.value = newValue;
      input.setSelectionRange(start + 1, start + 1);
    } else {
      document.execCommand("insertText", false, colemakKey);
    }
  }
}

// Toggle with Ctrl + '
function toggleFeature(event) {
  if (event.ctrlKey && event.key === "'") {
    event.preventDefault();
    isActive = !isActive;
    highlightInputs(document.querySelectorAll('input, textarea'));
    console.log(`Dvorak-to-Colemak & Highlighting: ${isActive ? "ON" : "OFF"}`);
  }
}

// Listen for messages from `background.js`
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "showDialog") {
    alert("Dialog Placeholder: You can add UI here.");
  }
});

document.addEventListener('keydown', toggleFeature);
document.addEventListener('keydown', dvorakToColemakConversion);
highlightInputs(document.querySelectorAll('input, textarea'));
