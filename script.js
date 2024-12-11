import steps from "./steps.js";
import paytables from "./paytables.js";
import emojiMap from "./emojiMap.js";

const app = document.getElementById("app");

app.innerHTML = `<section class="wagers" id="wagersSection">
    <div class="wagers__container">
      <div class="subtitle_2 subtitle_2--tropical">Place wagers from $1 to $1000:</div>
      <div class="wagers__items">
        <div class="wagers__item">
          <label class="wagers__label">
            🐵, 💲:
            <input
              class="wagers__input"
              type="number"
              min="0"
              max="1000"
              id="monkeyWager"
            />
          </label>
        </div>
        <div class="wagers__item">
          <label class="wagers__label">
            🐯, 💲:
            <input
              class="wagers__input"
              type="number"
              min="0"
              max="1000"
              id="tigerWager"
            />
          </label>
        </div>
        <div class="wagers__item">
          <label class="wagers__label">
            🐰 ,💲:
            <input
              class="wagers__input"
              type="number"
              min="0"
              max="1000"
              id="rabbitWager"
            />
          </label>
        </div>
      </div>
      <button class="button button--tropical" id="placeWagersBtn">
        Place Wagers
      </button>
    </div>
  </section>
`;
//one main round item for one wagered surfer HTML
window.createSurferInputs = function (id, emoji) {
  return `<div class="main_round__item item item--tropical">
      <div class="item__header">
        <h3 class="item__title">
          <span class="item__emoji">${emoji}</span>
        </h3>
        <div class="item__turtles turtles">
          <label class="turtles__label" title="Encounters survived">
            🐢🔪
            <select
              class="turtles__select"
              id="${id}Turtles"
              onchange="toggleMainRoundOutcome('${id}')"
            >
              <option value="">Select</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </label>
        </div>
      </div>
      <div
        class="item__outcomes outcomes"
        id="${id}mainRoundOutcome"
        style="display: none;"
      >
        <h3 class="outcomes__subtitle subtitle_3 subtitle_3--tropical">Outcome:</h3>
        <div class="outcomes__options">
          <div class="outcomes__item">
            <label class="outcomes__label" title="Select Bail Out">
              <input
                class="outcomes__input"
                type="radio"
                id="${id}BailOut"
                name="${id}MainRound"
                value="BailOut"
                onchange="handleRadioChange('${id}')"
              />
              👣 Bail Out
            </label>
          </div>
          <div class="outcomes__item">
            <label class="outcomes__label" title="Made it to the Beach">
              <input
                class="outcomes__input"
                type="radio"
                id="${id}Beach"
                name="${id}MainRound"
                value="Beach"
                onchange="handleRadioChange('${id}')"
              />
              🏝️ Beach
            </label>
          </div>
          <div class="outcomes__item">
            <label class="outcomes__label" title="Fall">
              <input
                class="outcomes__input"
                type="radio"
                id="${id}Fall"
                name="${id}MainRound"
                value="Fall"
                onchange="handleRadioChange('${id}')"
              />
              💥 Fall
            </label>
          </div>
        </div>
      </div>
      <div
        class="outcomes__steps steps"
        id="${id}StepInputContainer"
        style="display: none;"
      >
        <label class="steps__label">
          Step #:
          <input
            class="steps__input"
            type="number"
            id="${id}Step"
            min="0"
            max="109"
          />
        </label>
      </div>
      <div
        id="${id}PayoutContainer"
        class="item__amount"
        style="display: none;"
      >
        <div class="outcomes__subtitle subtitle_3 subtitle_3--tropical">After Main Round:</div>
        <div class="outcomes__result">
          💲
          <span class="item__sum subtitle_3 subtitle_3--tropical" id="${id}Payout"></span>
        </div>
      </div>
    </div>`;
};

//Show Radio Buttons with Main Round Outcome options onLy when N ofTurtle Encounters is set:
window.toggleMainRoundOutcome = function (surfer) {
  const turtlesInput = document.getElementById(`${surfer}Turtles`);
  const mainRoundOutcome = document.getElementById(`${surfer}mainRoundOutcome`);
  //If Turtles N is selected:
  if (turtlesInput.value !== "") {
    //Show options
    mainRoundOutcome.style.display = "flex";
    //Update the "After Main Round" on changing N of turtles
    turtlesInput.addEventListener("change", () => {
      console.log(`${surfer} Turtles changed to: ${turtlesInput.value}`);
      updatePayout(surfer);
    });
    //Update the "After Main Round" on changing Resolution Point of Bailing Out
    const stepInput = document.getElementById(`${surfer}Step`);
    if (stepInput) {
      stepInput.addEventListener("input", () => {
        console.log(`${surfer} Step changed to: ${stepInput.value}`);
        updatePayout(surfer);
      });
    }
    //or don't show it, if Turtles N is not set
  } else {
    mainRoundOutcome.style.display = "none";
  }
};
//React to selectiong different outcomes of the Main Round
window.handleRadioChange = function (surfer) {
  const bailOutRadio = document.getElementById(`${surfer}BailOut`);
  const beachRadio = document.getElementById(`${surfer}Beach`);
  const fallRadio = document.getElementById(`${surfer}Fall`);
  const stepInputContainer = document.getElementById(
    `${surfer}StepInputContainer`
  );
  const payoutContainer = document.getElementById(`${surfer}PayoutContainer`);
  const stepInput = document.getElementById(`${surfer}Step`);

  if (bailOutRadio.checked) {
    stepInputContainer.style.display = "flex";
  } else {
    stepInputContainer.style.display = "none";
  }

  if (bailOutRadio.checked || beachRadio.checked || fallRadio.checked) {
    payoutContainer.style.display = "flex";
    updatePayout(surfer);
  } else {
    payoutContainer.style.display = "none";
  }
  // Check Bonus Round visibility
  checkBonusRoundVisibility();
  checkCalculateTotalVisibility();
};

// Update "After Main Round" on changing inputs
window.updatePayout = function (surfer) {
  const wager = Number(document.getElementById(`${surfer}Wager`)?.value || 0);
  const turtles = Number(
    document.getElementById(`${surfer}Turtles`)?.value || 0
  );
  const stepInput = document.getElementById(`${surfer}Step`);
  const payoutElement = document.getElementById(`${surfer}Payout`);
  const payoutContainer = document.getElementById(`${surfer}PayoutContainer`);

  const bailOutRadio = document.getElementById(`${surfer}BailOut`);
  const beachRadio = document.getElementById(`${surfer}Beach`);
  const fallRadio = document.getElementById(`${surfer}Fall`);

  // Default message for payout
  let message = "";
  let isError = false;
  //If choice is "Bail Out":
  if (bailOutRadio && bailOutRadio.checked) {
    //If the Resolution Pint of Bailing Out is selected:
    if (stepInput) {
      const step = Number(stepInput.value || -1);
      // Map turtle counts to their minimum step requirements
      const stepRequirements = { 1: 40, 2: 41, 3: 42 };

      // Check if the step meets the requirement
      if (turtles in stepRequirements && step < stepRequirements[turtles]) {
        message = `Step should be ${stepRequirements[turtles]}+`;
        isError = true;

        // Apply font size dynamically if there's an error
        if (payoutElement) {
          payoutElement.style.fontSize = "1rem";
        }
      } else {
        const payout = calculatePayout(surfer, wager);
        message = payout.toFixed(2);

        // Reset font size if there's no error
        if (payoutElement) {
          payoutElement.style.fontSize = ""; // Reset to default
        }
      }
    }
    //if choice is "Beach":
  } else if (beachRadio && beachRadio.checked) {
    const payout = calculatePayout(surfer, wager);
    message = payout.toFixed(2);
    //if choice is "Fall"
  } else if (fallRadio && fallRadio.checked) {
    message = "0.00";
  }
  // Update the "After Main Round"
  if (payoutElement) {
    payoutElement.textContent = message;
    payoutElement.style.color = isError ? "#ff5d6e" : "#2eb872";
  }

  // Show the "After Main Round"
  if (payoutContainer) {
    payoutContainer.style.display = "flex";
  }
};
//Calculate "After Main Round" (turtles multiplier will be applied here for clarity)
window.calculatePayout = function (surfer, wager) {
  const turtles = Number(
    document.getElementById(`${surfer}Turtles`)?.value || 0
  );
  const bailOutRadio = document.getElementById(`${surfer}BailOut`);
  const beachRadio = document.getElementById(`${surfer}Beach`);
  const fallRadio = document.getElementById(`${surfer}Fall`);
  const stepInput = document.getElementById(`${surfer}Step`);

  let payout = 0;
  //"Fall" always results in 0 payout
  if (fallRadio && fallRadio.checked) {
    payout = wager * 0;
    //"bail Out" Multiplier should be checked in steps array:
  } else if (bailOutRadio && bailOutRadio.checked) {
    const step = stepInput ? Number(stepInput.value || -1) : -1;

    if (step >= 0 && step < steps.length) {
      const stepObject = steps[step];

      if (stepObject && stepObject.bailOut) {
        const payoutValue = stepObject.bailOut[turtles];

        if (payoutValue !== undefined) {
          payout = wager * payoutValue;
        } else {
          console.error(
            `No payout value for turtles=${turtles} at step=${step}`
          );
          payout = 0; // Default to 0, or set a custom fallback if required
        }
      } else {
        console.error(
          `Invalid step object or missing bailOut for step=${step}`
        );
        console.log(steps[109], steps.length);
        payout = 0; // Handle missing or invalid step data
      }
    } else {
      console.error(`Step ${step} is out of range`);
      payout = 0;
    }
  } else if (beachRadio && beachRadio.checked) {
    // Simple Beach logic: Wager × Turtle Multiplier
    const turtleMultiplier =
      turtles === 0 ? 1 : turtles === 1 ? 3 : turtles === 2 ? 9 : 27;
    payout = wager * turtleMultiplier;
  }

  return payout;
};
document.getElementById("placeWagersBtn").addEventListener("click", () => {
  // Get the wager values
  const monkeyWager = Number(document.getElementById("monkeyWager").value || 0);
  const tigerWager = Number(document.getElementById("tigerWager").value || 0);
  const rabbitWager = Number(document.getElementById("rabbitWager").value || 0);

  // Reference to the error message container or create one if it doesn't exist
  let errorMessage = document.getElementById("wagerErrorMessage");
  if (!errorMessage) {
    errorMessage = document.createElement("div");
    errorMessage.id = "wagerErrorMessage";
    errorMessage.style.color = "red";
    errorMessage.style.marginTop = "10px";
    errorMessage.style.fontSize = "0.9rem";
    document.querySelector(".wagers__container").appendChild(errorMessage); // Append it under the button
  }

  // Check if at least one wager is greater than 0
  if (monkeyWager > 0 || tigerWager > 0 || rabbitWager > 0) {
    // Clear any previous error message
    errorMessage.textContent = "";

    // Hide the wager section
    document.querySelector(".wagers").style.display = "none";

    // Disable the button to prevent further clicks
    const placeWagersBtn = document.getElementById("placeWagersBtn");
    placeWagersBtn.disabled = true;
    placeWagersBtn.textContent = "Wagers Placed"; // Update button text for clarity

    // Proceed to the main round logic
    updateSurferGroup();
  } else {
    // Display an error message if no wagers are placed
    errorMessage.textContent =
      "Please place at least one wager before proceeding!";
  }
});
//Update Main Round items
window.updateSurferGroup = function () {
  // Check if Main Round is already displayed
  const mainRoundSection = document.querySelector(".main_round");
  // Add it if it's not displayed yet, let's create it!
  if (!mainRoundSection) {
    const newMainRoundSection = document.createElement("section");
    newMainRoundSection.classList.add("main_round");
    newMainRoundSection.innerHTML = `
      <div class="main_round__container">
        <h2 class="subtitle_2 subtitle_2--tropical">🏄 Main Round 🐬</h2>
        <div class="main_round__items" id="surferGroup"></div>
      </div>
    `;
    // And append!
    app.appendChild(newMainRoundSection);
  }
  // let's define <div class="main_round__items">
  const surferGroup = document.getElementById("surferGroup");

  // Populate surferGroup based on placed wagers (here I call createSurferInputs for each wager > 0 )
  const monkeyWager = Number(document.getElementById("monkeyWager").value || 0);
  const tigerWager = Number(document.getElementById("tigerWager").value || 0);
  const rabbitWager = Number(document.getElementById("rabbitWager").value || 0);

  let surfersHTML = "";
  if (monkeyWager > 0) surfersHTML += createSurferInputs("monkey", "🐵");
  if (tigerWager > 0) surfersHTML += createSurferInputs("tiger", "🐯");
  if (rabbitWager > 0) surfersHTML += createSurferInputs("rabbit", "🐰");
  // Paste it in div class="main_round__items":
  surferGroup.innerHTML = surfersHTML;

  // Hide the Totals section initially
  const totalsSection = document.querySelector(".totals");
  if (totalsSection) totalsSection.style.display = "none";
  //And the button
  const calculateButton = document.getElementById("calculateTotalBtn");
  if (calculateButton) calculateButton.style.display = "none";

  //Attach Bonus Round listeners and visibility check
  attachBonusListeners();
  checkBonusRoundVisibility();
  //check if we are ready to calculate totals and append it in the end
  checkCalculateTotalVisibility();
};
//create Bonus Round section
window.checkBonusRoundVisibility = function () {
  const surfers = ["monkey", "tiger", "rabbit"];
  const bonusRound = document.getElementById("bonusRound");

  //Check if any surfer selected Beach
  const beachSelected = surfers.some((surfer) => {
    const beachRadio = document.getElementById(`${surfer}Beach`);
    return beachRadio && beachRadio.checked;
  });
  //If the Bonus Round is not created already, and at least 1 surfer selected "Beach":
  if (!bonusRound && beachSelected) {
    // Create the Bonus Round section
    const bonusRoundSection = document.createElement("section");
    bonusRoundSection.classList.add("bonus_round");
    bonusRoundSection.id = "bonusRound";
    bonusRoundSection.innerHTML = `<div class="bonus_round__container">
        <h2 class="subtitle_2 subtitle_2--tropical">🧉 Bonus Round 🍉</h2>
        <div class="bonus_round__items">
          <div class="bonus_round__item">
            <label class="bonus_round__label">
              🍹
              <span class="bonus_round__descr" title="Pick'em Up Drink feature">
                Feature:
              </span>
              <select class="bonus_round__select" id="drinkFeature">
                <option value="1" selected>
                  X1
                </option>
                <option value="2">X2</option>
                <option value="2.5">X2.5</option>
                <option value="3">X3</option>
                <option value="1">Extra Pick</option>
              </select>
            </label>
          </div>
          <div class="bonus_round__item">
            <label class="bonus_round__label">
              🪟
              <span class="bonus_round__descr" title="Square Selection Matches">
                Matches:
              </span>
              <select class="bonus_round__select" id="squareMatches">
                <option value="0" selected>
                  0
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5" disabled>
                  5
                </option>
              </select>
            </label>
          </div>
        </div>
      </div>`;
    //Append the Bonus Round to the app
    app.appendChild(bonusRoundSection);
    //Attach listeners for the new Bonus Round section
    attachBonusListeners();
    // Hide the Bonus Round if no surfer has selected Beach:
  } else if (bonusRound && !beachSelected) {
    bonusRound.style.display = "none";
    resetBonusRound(); // Reset the Bonus Round inputs
    // Show the Bonus Round if it's already created and Beach is selected
  } else if (bonusRound && beachSelected) {
    bonusRound.style.display = "block";
  }
};
//Get the data about Bonus round Multipliers
window.attachBonusListeners = function () {
  const surfers = ["monkey", "tiger", "rabbit"];
  const payoutObserver = new MutationObserver(() => {
    checkCalculateTotalVisibility(); // Recheck conditions when payouts change
  });
  //Observe changes in the payout container for each surfer
  surfers.forEach((surfer) => {
    const payoutElement = document.getElementById(`${surfer}Payout`);
    if (payoutElement) {
      payoutObserver.observe(payoutElement, { childList: true, subtree: true });
    }

    const beachRadio = document.getElementById(`${surfer}Beach`);
    if (beachRadio) {
      beachRadio.addEventListener("change", checkBonusRoundVisibility);
    }
  });

  // Attach listeners to Bonus Round inputs
  const drinkFeature = document.getElementById("drinkFeature");
  const squareMatches = document.getElementById("squareMatches");
  if (drinkFeature) {
    drinkFeature.addEventListener("change", () => {
      updateSquareMatches();
      checkCalculateTotalVisibility(); // Trigger visibility check
    });
  }

  if (squareMatches) {
    squareMatches.addEventListener("change", checkCalculateTotalVisibility);
  }
};

//Make selecting 5 matches in Square Matches possible, only if Drink feature is Extra Pick
window.updateSquareMatches = function () {
  const drinkFeature = document.getElementById("drinkFeature");
  const squareMatches = document.getElementById("squareMatches");
  const fiveOption = squareMatches.querySelector('option[value="5"]');
  //Check on instant
  if (!drinkFeature || !squareMatches || !fiveOption) {
    console.warn("Required elements for Square Selection not found!");
    return;
  }
  // Check if "Extra Pick" is selected based on text
  const isExtraPick = drinkFeature.selectedOptions[0].text === "Extra Pick";
  // Enable or disable the option "5" in Square Matches
  fiveOption.disabled = !isExtraPick;
  // Reset Square Matches if "5" is currently selected and now disabled
  if (!isExtraPick && squareMatches.value === "5") {
    squareMatches.value = "0"; // Reset to default
  }
  console.log(`Square Matches updated. "5" enabled: ${!fiveOption.disabled}`);
};

window.createCalculateButton = function () {
  // Check if Totals section already exists
  const existingTotalsSection = document.querySelector(".totals");
  if (existingTotalsSection) {
    return;
  }

  // Create Totals section with button
  const totalsSection = document.createElement("section");
  totalsSection.classList.add("totals");
  totalsSection.innerHTML = `<div class="totals__container" id="totalsContainer">
      <button
        class="button button--tropical"
        id="calculateTotalBtn"
        style="display: none;"
      >
        Calculate Totals
      </button>
      <div class="totals__items" id="resultsContainer"></div>
      <div id="totalsErrorMessage" style="color: red; margin-top: 10px; font-size: 0.9rem;"></div>
    </div>`;
  app.appendChild(totalsSection);

  const calculateTotalsBtn = document.getElementById("calculateTotalBtn");
  const errorMessage = document.getElementById("totalsErrorMessage");

  calculateTotalsBtn.addEventListener("click", () => {
    const canCalculate = checkCalculateConditions();

    if (!canCalculate) {
      errorMessage.textContent =
        "Please complete all required inputs for wagered surfers!";
      return;
    }

    // Clear error message and proceed
    errorMessage.textContent = "";

    // Disable button and update text
    calculateTotalsBtn.disabled = true;
    calculateTotalsBtn.textContent = "Totals Calculated";

    // Hide Main Round section
    const mainRoundSection = document.querySelector(".main_round");
    if (mainRoundSection) {
      mainRoundSection.style.display = "none";
    }

    // Hide Bonus Round section
    const bonusRoundSection = document.getElementById("bonusRound");
    if (bonusRoundSection) {
      bonusRoundSection.style.display = "none";
    }

    // Perform calculations
    calculateTotals();

    // Transform the button into "Start New Round"
    setTimeout(() => {
      calculateTotalsBtn.disabled = false;
      calculateTotalsBtn.textContent = "Start New Round";

      // Add reset functionality
      calculateTotalsBtn.addEventListener("click", resetApp);
    }, 500); // Small delay for user clarity
  });
};

// Helper function to check if calculating totals is allowed
function checkCalculateConditions() {
  const surfers = ["monkey", "tiger", "rabbit"];
  let isValid = false; // Track if at least one surfer is valid

  for (const surfer of surfers) {
    const wager = Number(document.getElementById(`${surfer}Wager`)?.value || 0);

    // Skip non-wagered surfers
    if (wager === 0) continue;

    const bailOutRadio = document.getElementById(`${surfer}BailOut`);
    const fallRadio = document.getElementById(`${surfer}Fall`);
    const beachRadio = document.getElementById(`${surfer}Beach`);
    const stepInput = document.getElementById(`${surfer}Step`);

    // Bail Out requires step input
    if (bailOutRadio?.checked && stepInput?.value) {
      isValid = true;
      continue;
    }

    // Fall or Beach options are valid without extra input
    if (fallRadio?.checked || beachRadio?.checked) {
      isValid = true;
      continue;
    }

    // If no valid outcome is selected, return false
    return false;
  }

  return isValid; // Valid if at least one surfer meets conditions
}

// Check if it's time to create Totals section and [Calculate Totals] button
window.checkCalculateTotalVisibility = function () {
  //Array with all surfers and their wagers
  const surfers = [
    {
      id: "monkey",
      wager: Number(document.getElementById("monkeyWager")?.value || 0),
    },
    {
      id: "tiger",
      wager: Number(document.getElementById("tigerWager")?.value || 0),
    },
    {
      id: "rabbit",
      wager: Number(document.getElementById("rabbitWager")?.value || 0),
    },
  ];
  // Count of surfers with wagers
  let wageredSurferCount = 0;
  // Count of wagered surfers who are resolved
  let resolvedSurferCount = 0;
  // Tracks whether all Main Round choices are meaningful
  let mainRoundValid = true;
  // Skip surfers without wagers
  surfers.forEach((surfer) => {
    if (surfer.wager === 0) {
      console.log(`${surfer.id}: Skipping (no wager placed)`);
      return;
    }
    // OR if wager > 0, adds 1 to wageredSurferCount
    wageredSurferCount++;
    // What is in "After Main Round:"
    const payoutElement = document.getElementById(`${surfer.id}Payout`);
    //Radio buttons and selectors in Main Round items
    const bailOutRadio = document.getElementById(`${surfer.id}BailOut`);
    const fallRadio = document.getElementById(`${surfer.id}Fall`);
    const beachRadio = document.getElementById(`${surfer.id}Beach`);
    const stepInput = document.getElementById(`${surfer.id}Step`);
    //If there is a value in "After Main Round:"
    if (payoutElement && payoutElement.textContent.trim() !== "") {
      //And the choice is "Bail Out"
      if (bailOutRadio && bailOutRadio.checked) {
        // The value from the steps input
        const stepValue = Number(stepInput?.value || -1);
        //Check if it's between 0 and 109
        if (stepValue >= 0 && stepValue <= 109) {
          //if so, add 1 to resolvedSurferCount
          resolvedSurferCount++;
        } else {
          //otherwise, main round info is not completely filled
          mainRoundValid = false;
        }
        //And if the choice is "Fall"
      } else if (fallRadio?.checked || beachRadio?.checked) {
        //add 1 to resolvedSurferCount
        resolvedSurferCount++;
        //But if it's "Beach"
      } else {
        //It's too early to calculate the totals (as we still have bonus round to play)
        mainRoundValid = false;
      }
      // If there's no value in "After Main Round:"
    } else {
      //Can't say we are ready to calculate
      mainRoundValid = false;
    }
  });
  //Create the variable, which is true, only if we have some wagers put and all of them are "Bail Out"(+ steps Indicated) or "Fall"
  const shouldDisplay =
    mainRoundValid &&
    wageredSurferCount > 0 &&
    resolvedSurferCount === wageredSurferCount;
  // If all of above is true, the [Calculate Totals] button should be displayed
  if (shouldDisplay) {
    createCalculateButton();
    const calculateButton = document.getElementById("calculateTotalBtn");
    console.log(calculateButton);
    //if it exists, show it
    if (calculateButton) calculateButton.style.display = "block";
    // if shouldDisplay is false
  } else {
    //Don't show it
    console.log("no need for button yet");
  }
};

//
window.attachBonusListeners = function () {
  const surfers = ["monkey", "tiger", "rabbit"];
  const payoutObserver = new MutationObserver(() => {
    checkCalculateTotalVisibility();
  });

  // Observe changes in the payout container for each surfer
  surfers.forEach((surfer) => {
    const payoutElement = document.getElementById(`${surfer}Payout`);
    if (payoutElement) {
      payoutObserver.observe(payoutElement, { childList: true, subtree: true });
    }

    const beachRadio = document.getElementById(`${surfer}Beach`);
    if (beachRadio) {
      beachRadio.addEventListener("change", () => {
        checkBonusRoundVisibility();
        checkCalculateTotalVisibility();
      });
    }
  });

  //Attach listener to Bonus Round inputs
  const drinkFeature = document.getElementById("drinkFeature");
  const squareMatches = document.getElementById("squareMatches");

  if (drinkFeature) {
    drinkFeature.addEventListener("change", () => {
      updateSquareMatches();
      checkCalculateTotalVisibility();
    });
  }

  if (squareMatches) {
    squareMatches.addEventListener("change", checkCalculateTotalVisibility);
  }
};

window.createResultsContainer = function () {
  let resultsContainer = document.getElementById("resultsContainer");

  if (!resultsContainer) {
    resultsContainer = document.createElement("div");
    resultsContainer.id = "resultsContainer";
    resultsContainer.className = "totals__items";

    // Append to the totals container
    const totalsContainer = document.getElementById("totalsContainer");
    if (totalsContainer) {
      totalsContainer.appendChild(resultsContainer);
    } else {
      console.error("Totals container not found!");
    }
  }

  resultsContainer.style.display = "block"; // Ensure it's visible
};

//Calculation on clicking [Calculate Totals]
window.calculateTotals = function () {
  createResultsContainer(); // Ensure container is created
  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.classList.add("totals__items");

  if (!resultsContainer) {
    console.error("Results container not found!");
    return;
  }

  let totalPaytable1 = 0;
  let totalPaytable2 = 0;

  // Clear previous results
  resultsContainer.innerHTML = "";

  const surfers = ["monkey", "tiger", "rabbit"];
  surfers.forEach((surfer) => {
    const wager = Number(document.getElementById(`${surfer}Wager`)?.value || 0);
    const turtles = Number(
      document.getElementById(`${surfer}Turtles`)?.value || 0
    );
    const bailOutRadio = document.getElementById(`${surfer}BailOut`);
    const beachRadio = document.getElementById(`${surfer}Beach`);
    const fallRadio = document.getElementById(`${surfer}Fall`);
    const stepInput = document.getElementById(`${surfer}Step`);

    let payout1 = 0; // Paytable #1 payout
    let payout2 = 0; // Paytable #2 payout
    let breakdown = "";

    if (fallRadio && fallRadio.checked) {
      payout1 = payout2 = 0;
      breakdown = `Payout: 💲${wager} ✖️ 0 after 💥 🟰 💲0.00`;
    } else if (bailOutRadio && bailOutRadio.checked) {
      const step = Number(stepInput?.value || -1);
      if (step >= 0 && step < steps.length) {
        const stepObject = steps[step];
        const payoutValue = stepObject.bailOut
          ? stepObject.bailOut[turtles] || 0
          : 0;
        payout1 = payout2 = wager * payoutValue;
        breakdown = `Payout: 💲${wager} ✖️ ${payoutValue} 👣 (on point ${step} after ${turtles} 🐢) 🟰 💲${payout1.toFixed(
          2
        )}`;
      }
    } else if (beachRadio && beachRadio.checked) {
      const turtleMultiplier =
        turtles === 0 ? 1 : turtles === 1 ? 3 : turtles === 2 ? 9 : 27;
      const drinkFeature = document.getElementById("drinkFeature");
      const drinkMultiplier =
        drinkFeature?.selectedOptions[0]?.text === "Extra Pick"
          ? 1
          : Number(drinkFeature?.value || 1);
      const squareMatches = Number(
        document.getElementById("squareMatches")?.value || 0
      );
      const paytableValue1 = paytables[0][squareMatches] || 0;
      const paytableValue2 = paytables[1][squareMatches] || 0;

      payout1 = wager * turtleMultiplier * drinkMultiplier * paytableValue1;
      payout2 = wager * turtleMultiplier * drinkMultiplier * paytableValue2;

      breakdown = `Paytable #1: 💲${wager} ✖️ ${turtleMultiplier} for ${turtles} 🐢 ✖️ ${drinkMultiplier} for 🍹 ✖️ ${paytableValue1} for 🪟 🟰 💲${payout1.toFixed(
        2
      )}<br>Paytable #2: 💲${wager} ✖️ ${turtleMultiplier} for ${turtles} 🐢 ✖️ ${drinkMultiplier} for 🍹 ✖️ ${paytableValue2} for 🪟 🟰 💲${payout2.toFixed(
        2
      )}`;
    }

    totalPaytable1 += payout1;
    totalPaytable2 += payout2;

    // Add result for each surfer
    if (wager > 0) {
      const surferResult = document.createElement("div");
      surferResult.classList.add("totals__item");
      surferResult.innerHTML = `<h4 class="totals__emoji">${
        surfer === "monkey" ? "🐵" : surfer === "tiger" ? "🐯" : "🐰"
      }</h4>
        <p>${breakdown}</p>`;
      resultsContainer.appendChild(surferResult);
    }
  });

  // Add entire payouts
  const footer = document.querySelector(".footer");
  const entireResult = document.querySelector(".footer__container");

  entireResult.innerHTML = `
      <div class="totals__entire entire">
        <div class="title_1">
          <h2>💰Total Payout🌟</h2>
        </div>
        <div class="entire__items">
          <div class="entire__item">
            Paytable #1:💲${totalPaytable1.toFixed(2)}
          </div>
          <div class="entire__item">
            Paytable #2:💲${totalPaytable2.toFixed(2)}
          </div>
        </div>
      </div>
   `;
  footer.appendChild(entireResult);
};

window.resetBonusRound = function () {
  const drinkFeature = document.getElementById("drinkFeature");
  const squareMatches = document.getElementById("squareMatches");

  if (drinkFeature) drinkFeature.value = "1"; // Reset to default
  if (squareMatches) squareMatches.value = "0"; // Reset to default
};

function resetApp() {
  // Clear Wager Section inputs and show it again
  const wagerInputs = document.querySelectorAll(".wagers__input");
  wagerInputs.forEach((input) => (input.value = ""));
  const wagersSection = document.querySelector(".wagers");
  if (wagersSection) {
    wagersSection.style.display = "block";
  }

  // Reset the "Place Wagers" button
  const placeWagersBtn = document.getElementById("placeWagersBtn");
  if (placeWagersBtn) {
    placeWagersBtn.disabled = false; // Enable the button
    placeWagersBtn.textContent = "Place Wagers"; // Reset text
  }

  // Remove Main Round section
  const mainRoundSection = document.querySelector(".main_round");
  if (mainRoundSection) {
    mainRoundSection.remove();
  }

  // Remove Bonus Round section
  const bonusRoundSection = document.getElementById("bonusRound");
  if (bonusRoundSection) {
    bonusRoundSection.remove();
  }
  //remove individual results

  const calculations = document.querySelector(".totals");
  if (calculations) {
    calculations.remove();
  }

  // Remove entire result from footer
  const entireResult = document.querySelector(".entire");
  if (entireResult) {
    entireResult.remove();
  }

  // Reset "Calculate Totals" button
  const calculateTotalsBtn = document.getElementById("calculateTotalBtn");
  if (calculateTotalsBtn) {
    calculateTotalsBtn.disabled = false; // Enable the button for reuse
    calculateTotalsBtn.textContent = "Calculate Totals"; // Reset button text
    calculateTotalsBtn.style.display = "none"; // Initially hidden
    calculateTotalsBtn.removeEventListener("click", resetApp); // Remove reset listener
  }

  // Clear any error messages
  const errorMessage = document.getElementById("totalsErrorMessage");
  if (errorMessage) {
    errorMessage.textContent = "";
  }
}
