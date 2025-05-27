function generateComment() {
    const name = document.getElementById("name").value.trim();
    const pronouns = document.getElementById("pronouns").value;
    const mark = document.getElementById("mark").value.trim();
  
    const behaviorChecks = document.querySelectorAll("#behavior-options input:checked");
    const performanceChecks = document.querySelectorAll("#performance-options input:checked");
    const improvementChecks = document.querySelectorAll("#improvement-options input:checked");
  
    const behavior = Array.from(behaviorChecks).map(cb => cb.value);
    const performance = Array.from(performanceChecks).map(cb => cb.value);
    const improvement = Array.from(improvementChecks).map(cb => cb.value);
  
    let comment = `${name} (${pronouns}) achieved a mark of ${mark}. `;
  
    if (behavior.length) comment += "In class, " + behavior.join(" ");
    if (performance.length) comment += " In the assessment task, " + performance.join(" ");
    if (improvement.length) comment += " To improve, " + improvement.join(" ");
  
    document.getElementById("output").value = comment.trim();
  }
  