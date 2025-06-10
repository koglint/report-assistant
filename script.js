let lastState = null; // stores full form state for undo
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form").forEach(form => {
    form.querySelectorAll("label").forEach(label => {
      const input = label.querySelector("input[type='checkbox']");
      if (input && !input.hasAttribute("value")) {
        input.value = label.textContent.trim();
      }
    });
  });
});


function generateComment() {
  const name = document.getElementById("name").value.trim();
  const pronouns = document.getElementById("pronouns").value;
  const mark = document.getElementById("mark").value.trim();
  const other = document.getElementById("other").value.trim();

  const adjectiveChecks = document.querySelectorAll("#student-adjectives input:checked");
  const engagementChecks = document.querySelectorAll("#engagement-options input:checked");
  const behaviorChecks = document.querySelectorAll("#behavior-options input:checked");
  const collabChecks = document.querySelectorAll("#collab-options input:checked");
  const performanceChecks = document.querySelectorAll("#performance-options input:checked");
  const improvementChecks = document.querySelectorAll("#improvement-options input:checked");

  const adjectives = getCheckedValues("#student-adjectives input:checked");
  const engagement = getCheckedValues("#engagement-options input:checked");
  const behavior = getCheckedValues("#behavior-options input:checked");
  const collab = getCheckedValues("#collab-options input:checked");
  const performance = getCheckedValues("#performance-options input:checked");
  const improvement = getCheckedValues("#improvement-options input:checked");

  let comment = `${name} (${pronouns}) achieved a/an ${mark} assessment result. Other relevant information to use is ${other}. `;

  if (adjectives.length) comment += "Student is " + adjectives.join(" ") + " ";
  if (engagement.length) comment += "In terms of engagement with learning, " + engagement.join(" ");
  if (behavior.length) comment += "During lessons, " + behavior.join(" ");
  if (collab.length) comment += "In the classroom, " + collab.join(" ");
  if (performance.length) comment += " In the assessment task, " + performance.join(" ");
  if (improvement.length) comment += " To improve, " + improvement.join(" ");

  // Save full form state for undo
  lastState = {
    output: document.getElementById("output").value,
    name,
    pronouns,
    mark,
    other,
    adjectives,
    engagement,
    behavior,
    collab,
    performance,
    improvement,
    activePronoun: document.querySelector(".pronoun-btn.active")?.getAttribute("data-value") || ""
  };

  document.getElementById("output").value = comment.trim();
}

function copyComment() {
  const output = document.getElementById("output");
  output.select();
  output.setSelectionRange(0, 99999);
  document.execCommand("copy");

  const alertBox = document.getElementById("copy-alert");
  if (alertBox) {
    alertBox.classList.add("show");
    setTimeout(() => {
      alertBox.classList.remove("show");
    }, 2000);
  }
}

function getCheckedValues(selector) {
  return Array.from(document.querySelectorAll(selector)).map(cb => cb.value);
}

// Setup pronoun toggle buttons
document.querySelectorAll('.pronoun-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pronoun-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById("pronouns").value = btn.getAttribute('data-value');
  });
});

function clearAll() {
  document.getElementById("name").value = "";
  document.getElementById("pronouns").value = "";
  document.getElementById("mark").value = "";
  document.getElementById("other").value = "";
  document.getElementById("output").value = "";

  document.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
  document.querySelectorAll(".pronoun-btn").forEach(btn => btn.classList.remove("active"));
}

function clearExceptOther() {
  document.getElementById("name").value = "";
  document.getElementById("pronouns").value = "";
  document.getElementById("mark").value = "";
  document.getElementById("output").value = "";

  document.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
  document.querySelectorAll(".pronoun-btn").forEach(btn => btn.classList.remove("active"));
}

function undoComment() {
  if (!lastState) return;

  document.getElementById("output").value = lastState.output;
  document.getElementById("name").value = lastState.name;
  document.getElementById("pronouns").value = lastState.pronouns;
  document.getElementById("mark").value = lastState.mark;
  document.getElementById("other").value = lastState.other;

  restoreCheckedValues("#student-adjectives input", lastState.adjectives);
  restoreCheckedValues("#engagement-options input", lastState.engagement);
  restoreCheckedValues("#behavior-options input", lastState.behavior);
  restoreCheckedValues("#collab-options input", lastState.collab);
  restoreCheckedValues("#performance-options input", lastState.performance);
  restoreCheckedValues("#improvement-options input", lastState.improvement);

  document.querySelectorAll(".pronoun-btn").forEach(btn => {
    if (btn.getAttribute("data-value") === lastState.activePronoun) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function restoreCheckedValues(selector, values) {
  document.querySelectorAll(selector).forEach(cb => {
    cb.checked = values.includes(cb.value);
  });
}

function copyAIPrompt() {
  const promptDiv = document.querySelector(".ai-prompt-div");
  const textToCopy = promptDiv.innerText || promptDiv.textContent;

  // Copy to clipboard
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      console.log("Prompt copied to clipboard!");
    })
    .catch(err => {
      console.error("Failed to copy prompt: ", err);
    });
}

function copyNonPrompt() {
  const promptDiv = document.querySelector(".no-attendance-prompt-div");
  const textToCopy = promptDiv.innerText || promptDiv.textContent;

  // Copy to clipboard
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      console.log("Prompt copied to clipboard!");
    })
    .catch(err => {
      console.error("Failed to copy prompt: ", err);
    });
}

// Setup assessment mark buttons
document.querySelectorAll('.mark-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mark-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById("mark").value = btn.getAttribute('data-value');
  });
});

const modifierSets = {
  frequency: [
    "always",
    "usually",
    "often",
    "sometimes",
    "occasionally",
    "rarely",
    "never"
  ],
  degree: [
    "extremely",
    "very",
    "fairly",
    "somewhat",
    "slightly",
    "barely",
    "not"
  ],
  academic: [
    "outstanding",
    "thorough",
    "sound",
    "basic",
    "limited"
  ],
  nounModifier: [
    "significant",
    "substantial",
    "high",
    "regular",
    "occasional",
    "adequate", 
    "consistent", 
    "adequate",
    "infrequent", 
    "low", 
    "irregular" 
  ]
};


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modifier")) {
    e.stopPropagation();
    e.preventDefault();

    const span = e.target;
    const modifierType = span.getAttribute("data-modifier-type");
    const currentValue = span.textContent.trim();

    if (!modifierSets[modifierType]) return;

    // Remove existing menus first
    document.querySelectorAll(".custom-dropdown").forEach(d => d.remove());

    const menu = document.createElement("div");
    menu.className = "custom-dropdown";

    modifierSets[modifierType].forEach(option => {
      const item = document.createElement("div");
      item.className = "dropdown-option";
      item.textContent = option;
      item.addEventListener("click", () => {
        const newSpan = document.createElement("span");
        newSpan.className = "modifier";
        newSpan.setAttribute("data-modifier-type", modifierType);
        newSpan.textContent = option;
      
        // Update the associated checkbox value
        const label = span.closest("label");
        const checkbox = label?.querySelector("input[type='checkbox']");
        if (checkbox) {
          // Replace only the old modifier part in the value
          const oldText = checkbox.value;
          const updated = oldText.replace(span.textContent.trim(), option);
          checkbox.value = updated;
        }
      
        span.replaceWith(newSpan);
        menu.remove();
      });
      
      menu.appendChild(item);
    });

    const rect = span.getBoundingClientRect();
    menu.style.position = "absolute";
    menu.style.top = `${window.scrollY + rect.top - 5}px`;
    menu.style.left = `${window.scrollX + rect.left}px`;
    menu.style.zIndex = "9999";
    document.body.appendChild(menu);
  } else {
    // Close dropdown if clicked outside
    document.querySelectorAll(".custom-dropdown").forEach(d => d.remove());
  }
});






