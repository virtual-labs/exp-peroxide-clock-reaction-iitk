
var voiceLang = localStorage.getItem("lang") || "eng"; // This will set voiceLang to the stored value, or "eng" if null/undefined
if (voiceLang === "hi") {
    voiceLang = "hindi";
} else {
    voiceLang = "eng"; // Ensure it's explicitly "eng" if anything other than "hi" or not found
}
console.log(voiceLang);

function speakStep(text) {
    speechSynthesis.cancel();

    const speak = () => {
        const utterance = new SpeechSynthesisUtterance(text);

        const voices = speechSynthesis.getVoices();
        // Prioritize specific voices if available, otherwise fall back to language code
        const hindiVoice = voices.find(v => v.name.includes("Kalpana") || v.lang === "hi-IN");
        const engVoice = voices.find(v => v.name.includes("Zira") || v.lang === "en-US" || v.lang === "en-IN" || v.name.includes("Google US English"));

        utterance.voice = voiceLang === "hindi" ? hindiVoice : engVoice;
        utterance.lang = voiceLang === "hindi" ? "hi-IN" : "en-US"; // Changed to en-US for broader compatibility
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        speechSynthesis.speak(utterance);
    };

    // Ensure voices are loaded before attempting to speak
    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = speak;
    } else {
        speak();
    }
}

function playVoiceForCurrentStep() {
    const step = chemicals.step; // Access the current step from the chemicals object
    console.log("Playing voice for step:", step); // Debugging: log the step for voiceover

    const voiceInstructions = {
        eng: {
            2: "Now click on the distilled water to make the solution 90 milliliters",
            3: `Now measure ${chemicals.FlaskMl} milliliters of sulfuric acid to add in the mixture`,
            4: `Measure ${chemicals.FlaskMl} milliliters of sodium thiosulfate to add in the solution`,
            5: `Now measure ${chemicals.FlaskMl} milliliters of starch solution and add it`,
            6: `Now measure ${chemicals.FlaskMl} milliliters of hydrogen peroxide to add`,
            7: "Now stir the mixture and immediately start the stopwatch"
        },
        hindi: {
            2: "अब घोल को 90 मिलीलीटर बनाने के लिए आसुत जल पर क्लिक करें",
            3: `अब मिश्रण में मिलाने के लिए ${chemicals.FlaskMl} मिलीलीटर सल्फ्यूरिक एसिड मापें।`,
            4: `घोल में मिलाने के लिए ${chemicals.FlaskMl} मिलीलीटर सोडियम थायोसल्फेट मापें।`,
            5: `अब स्टार्च सॉल्यूशन का ${chemicals.FlaskMl} मिलीलीटर मापें और मिलाएं।`,
            6: `अब ${chemicals.FlaskMl} मिलीलीटर हाइड्रोजन पेरोक्साइड मापें और मिलाएं।`,
            7: "अब मिश्रण को हिलाएं और तुरंत स्टॉपवॉच चालू करें"
        }
    };

    const text = voiceInstructions[voiceLang][step];
    if (text) speakStep(text);
}

// ✅ CHEMICAL CLASS
class Chemical {
    emptybeaker = document.getElementById("emptybeaker");
    water = document.getElementById("DISTILLED_-WATER1");
    ML = localStorage.getItem("flask");
    FlaskMl = "";
    lang = localStorage.getItem("lang");
    instruct = document.getElementById("instruction");
    step = 1; // Start at step 1 (initial state, before popup closes)

    constructor() {
        this.OtherInfoInBasedOnSelectedLanguage();
        this.FlaskOfMl();
        // Initial instruction and validation are now handled by closePopup()
    }

    UpdateInstruction(id) {
        const [en, hi] = this.Instructions(id);
        this.instruct.innerText = (this.lang === "hi") ? hi : en;

        // Update the global voiceLang variable before playing the voice
        voiceLang = this.lang === "hi" ? "hindi" : "eng";
        // Call the global playVoiceForCurrentStep function without an ID,
        // as it now relies on chemicals.step for the current step.
        playVoiceForCurrentStep();
    }

    intial_to_middle(elementId, translateX, translateTop = -150, rotateAngle = -20, comebackToIntialPosition) {
        // Validation is now done *before* calling this function based on `chemicals.step`
        // Increment step *after* the current action starts
        // We increment here to set up for the *next* instruction
        // The instruction for the current step was played when the element became clickable.

        let element = document.getElementById(elementId);
        element.style.transition = 'transform 0.5s ease';
        element.style.transform = `translateY(${translateTop}px)`;

        setTimeout(() => {
            element.style.transform = `translateX(${translateX}px) rotate(${rotateAngle}deg)`;
        }, 1000);

        setTimeout(() => {
            element.style.transform = `translateX(${comebackToIntialPosition}px)`;
            element.setAttribute("src", this.changeImageAsPerSelectedBeaker(elementId)[1]);
            this.changeBeakerImage("fill", 5, elementId);

            setTimeout(() => {
                this.middle_to_final(elementId);
            }, 900);

        }, 1500);
    }

    middle_to_final(elementID) {
        this.MiddleBeakerAnimation(-80, -50, -40, 10, elementID);
        setTimeout(() => {
            this.final_Beaker_Chemical_Ammount(this.changeImageAsPerSelectedBeaker(elementID)[2])
        }, 1500);

        // After chemical added and animation, advance step and update instruction for the *next* chemical
        // Ensure this happens after the current chemical is fully added visually.
        this.step++; // Advance to the next step
        this.UpdateInstruction(this.step); // Play instruction for the new step
        this.Validate(this.step); // Make the next element clickable
    }

    final_Beaker_Chemical_Ammount(step = 1) {
        const finalFlask = document.getElementsByClassName("finalFlask")[0];
        const images = {
            1: "./90mlflask.png",
            2: "./100mlflask.png",
            3: "./115mlflask.png",
            4: "./120mlflask.png"
        };
        finalFlask.setAttribute("src", images[step]);
    }

    MiddleBeakerAnimation(translateY, translateX, rotateAngle, comabackPosition, finalElementId) {
        this.emptybeaker.style.transition = 'transform 0.5s ease';
        this.emptybeaker.style.transform = `translateY(${translateY}px)`;

        setTimeout(() => {
            this.emptybeaker.style.transform = `translateX(${translateX}px) rotate(${rotateAngle}deg)`;
        }, 1000);

        setTimeout(() => {
            this.emptybeaker.style.transform = `translateX(${comabackPosition}px)`;
            this.changeBeakerImage("empty");
        }, 1500);
    }

    changeBeakerImage(status, ML = 5, elementId) {
        if (status === "fill") {
            if (elementId === "SodiumThiosulphate1" || elementId === "Hydrogenperoxide1") {
                this.emptybeaker.setAttribute("src", "./5mlbeaker.png");
            } else {
                this.emptybeaker.setAttribute("src", "./10mlbeaker.png");
            }
        } else {
            this.emptybeaker.setAttribute("src", "./emptybeaker.png");
        }
    }

    changeImageAsPerSelectedBeaker(elementId) {
        const images = {
            "Sulphuricacid1": ["Sulphuricacid1", "./SulphuricAcid2.png", 1],
            "SodiumThiosulphate1": ["SodiumThiosulphate1", "./SodiumThiosulphate2.png", 2],
            "starchsolution1": ["starchsolution1", "./starchSolHalf.png", 3],
            "Hydrogenperoxide1": ["Hydrogenperoxide1", "./H2o2.png", 4]
        };
        return images[elementId];
    }

    FlaskOfMl() {
        const mapping = { 'a': 5, 'b': 10, 'c': 15, 'd': 20 };
        this.FlaskMl = mapping[this.ML];
    }

    Instructions(instructionId) {
        const flaskMl = this.FlaskMl;
        const instructions = {
            1: ["Click on anyone of flask to start the reaction", "प्रतिक्रिया शुरू करने के लिए फ्लास्क में से किसी एक पर क्लिक करें"],
            2: ["Now click on the distilled water to make the solution 90ml", "अब घोल को 90 मि.ली. बनाने के लिए आसुत जल पर क्लिक करें"],
            3: [`Now measure ${flaskMl}ml of sulphuric acid to add in the mixture`, `अब मिश्रण में मिलाने के लिए ${flaskMl} मिलीलीटर सल्फ्यूरिक एसिड मापें।`],
            4: [`Measure ${flaskMl}ml of sodium thiosulphate to add in the solution`, `घोल में मिलाने के लिए ${flaskMl} मिलीलीटर सोडियम थायोसल्फेट मापें`],
            5: [`Now measure ${flaskMl}ml of starch solution and add it`, `अब स्टार्च सॉल्यूशन का ${flaskMl}ml मापें और मिलाएं`],
            6: [`Now measure ${flaskMl}ml of hydrogen peroxide to add`, `अब ${flaskMl}ml हाइड्रोजन पेरोक्साइड मापें और मिलाएं`],
            7: ["Now stir the mixture and immediately start the stop watch Please wait for completion of reaction" , "अब मिश्रण को हिलाएं और तुरंत स्टॉप वॉच चालू करें "]
        };
        return instructions[instructionId];
    }

    OtherInfoInBasedOnSelectedLanguage() {
        if (this.lang === "hi") {
            document.getElementById("header").innerText = "आयोडाइड हाइड्रोजन पेरोक्साइड क्लॉक रिएक्शन की गतिकी का अध्ययन करने के लिए";
            document.getElementsByClassName("instruct")[0].innerText = "निर्देश";
            document.getElementsByClassName("glov")[0].innerText = "कृपया उचित सुरक्षात्मक गियर पहनें...";
            document.getElementById("ins").innerText = "निर्देश";
            document.getElementById("timer").innerText = "घड़ी";
        } else {
            document.getElementById("header").innerText = "TO STUDY THE KINETICS OF IODIDE HYDROGEN PEROXIDE CLOCK REACTION";
            document.getElementsByClassName("instruct")[0].innerText = "INSTRUCTIONS";
            document.getElementsByClassName("glov")[0].innerText = "Please ensure to wear appropriate protective gear...";
            document.getElementById("ins").innerText = "INSTRUCTIONS";
            document.getElementById("timer").innerText = "Timer";
        }
    }

    movementOfSelectedBeaker(elementId) {
        const mapping = {
            "Sulphuricacid1": [-160, 4], // This implies after sulphuric acid, step 4 is next.
            "SodiumThiosulphate1": [-331, 5],
            "starchsolution1": [-482, 6],
            "Hydrogenperoxide1": [-640, 7]
        };
        const [x, nextInstructionId] = mapping[elementId];
        // Don't update instruction or validate here directly.
        // `middle_to_final` will handle advancing the step and updating instruction/validation.
        chemicals.intial_to_middle(elementId, x, -150, -50, 20);
    }

    DirectAnimationForDistillerWater() {
        this.DistillerWaterAnimataion(-110, -80, -40, 10);
        // After this animation, advance the step and update instruction
        this.step = 3; // After water, the next step is Sulphuric Acid
        this.UpdateInstruction(this.step); // Play instruction for step 3
        this.Validate(this.step); // Make Sulphuric Acid clickable
    }

    DistillerWaterAnimataion(translateX, translateY, rotateAngle, comebackPosition) {
        this.water.style.transition = 'transform 0.9s ease';
        this.water.style.transform = `translateY(${translateY}px)`;

        setTimeout(() => {
            this.water.style.transform = `translateX(${translateX}px) rotate(${rotateAngle}deg)`;
        }, 1000);

        setTimeout(() => {
            this.water.style.transform = `translateX(${comebackPosition}px)`;
            this.final_Beaker_Chemical_Ammount(1); // Assuming 1 means after distilled water
            this.water.setAttribute("src", "./DISTILLED_-WATER2.png");
        }, 1500);
    }

    isFinalStep(elementId) {
        return elementId === "Hydrogenperoxide1";
    }

    stirAnimation(elementID) {
        const stir = document.getElementById(elementID);
        stir.classList.add("transform-stir");

        setTimeout(() => {
            stir.classList.remove("transform-stir");
            this.DoFianlThingsAfterAllChemicalAdded();
        }, 3000);
    }

    DoFianlThingsAfterAllChemicalAdded() {
        startStopwatch();
    }

  completeReactionInstruction() {
    let completionText;
    if (this.lang === "hi") {
        completionText = "प्रतिक्रिया पूरी हुई";
        this.instruct.innerText = completionText;
    } else {
        completionText = "Reaction completed";
        this.instruct.innerText = completionText;
    }

    // Add voiceover for the completion instruction
    // Ensure voiceLang is set correctly, though it should already be from previous steps
    voiceLang = this.lang === "hi" ? "hindi" : "eng";
    speakStep(completionText);
}

    Validate(currentStep) {
        // Iterate through all elements that are part of the steps.
        // It's highly recommended to add a `data-step` attribute to your HTML elements
        // (e.g., `<img id="DISTILLED_-WATER1" class="step" data-step="2">`)
        // This makes validation robust and independent of their order in the HTML.
        Array.from(document.querySelectorAll('.step, #DISTILLED_-WATER1, #stir')).forEach(e => {
            let elementStep = parseInt(e.dataset.step); // Get step from data-step attribute
            if (isNaN(elementStep)) { // Fallback if data-step is not set (e.g., for stir)
                if (e.id === "DISTILLED_-WATER1") elementStep = 2;
                else if (e.id === "Sulphuricacid1") elementStep = 3;
                else if (e.id === "SodiumThiosulphate1") elementStep = 4;
                else if (e.id === "starchsolution1") elementStep = 5;
                else if (e.id === "Hydrogenperoxide1") elementStep = 6;
                else if (e.id === "stir") elementStep = 7;
            }

            // Only the element matching the current step should have the cursor/be interactive
            const isActiveStep = (elementStep === currentStep);
            e.classList.toggle("cursor", isActiveStep);
            e.style.pointerEvents = isActiveStep ? "auto" : "none"; // Control clickability
        });
    }
}

var chemicals = new Chemical();
// Initial validation and instruction will happen in closePopup()

document.querySelectorAll('.clk').forEach(e => {
    e.addEventListener("click", (event) => {
        // Check if the clicked element corresponds to the current allowed step
        // It's crucial that your HTML elements for Sulphuricacid1, SodiumThiosulphate1, etc.
        // also have the class `step` and a `data-step` attribute like `data-step="3"`.
        const clickedElementStep = parseInt(event.target.dataset.step);
        if (chemicals.step === clickedElementStep) {
            chemicals.movementOfSelectedBeaker(event.target.id);
        } else {
            console.warn(`Invalid click for step ${chemicals.step}. Clicked: ${event.target.id} (expected step ${clickedElementStep || 'N/A'}).`);
        }
    });
});

document.getElementById("DISTILLED_-WATER1").addEventListener('click', () => {
    console.log("DISTILLED_-WATER1 clicked. Current step:", chemicals.step);
    // Only allow distilled water click at step 2
    if (chemicals.step === 2) {
        chemicals.DirectAnimationForDistillerWater();
    } else {
        console.warn("Invalid step for distilled water interaction. Current step:", chemicals.step);
    }
});

document.getElementById("stir").addEventListener('click', () => {
    console.log("Stir clicked. Current step:", chemicals.step);
    // Only allow stir click at step 7
    if (chemicals.step === 7) {
        chemicals.stirAnimation("stir");
    } else {
        console.warn("Invalid step for stir interaction. Current step:", chemicals.step);
    }
});

// POPUP
function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    localStorage.clear();
    localStorage.setItem("flask", document.getElementById('flask').value);
    localStorage.setItem("lang", document.getElementById('lang').value);
    document.getElementById("popup").style.display = "none";

    // Reinitialize the chemicals object to apply selected language and flask
    chemicals = new Chemical(); // Creates a new Chemical instance
    chemicals.step = 2; // Manually set the step to 2 for the first interaction (distilled water)
    chemicals.FlaskOfMl(); // Ensure FlaskMl is set before instructions are updated

    // Update instruction and play voice for step 2
    chemicals.UpdateInstruction(chemicals.step);
    // Make only the distilled water clickable
    chemicals.Validate(chemicals.step);
}

// STOPWATCH LOGIC (No changes needed here based on the described issue)
let timer;
let elapsedMs = 0;
let targetTimeMs = 0;

function getTargetTime(flaskType) {
    return {
        'a': 265000,
        'b': 138000,
        'c': 96000,
        'd': 74000
    }[flaskType] || 0;
}

function startStopwatch() {
    const flask = localStorage.getItem("flask");
    targetTimeMs = getTargetTime(flask);

    let instructionText; // Declare a variable to hold the instruction text
    if (chemicals.lang === "hi") {
        instructionText = "कृपया प्रतिक्रिया पूरी होने तक प्रतीक्षा करें";
        chemicals.instruct.innerText = instructionText;
    } else {
        instructionText = "Please wait for completion of reaction";
        chemicals.instruct.innerText = instructionText;
    }

    // Add this line to play the voiceover for the instruction
    // Ensure voiceLang is correctly set before calling speakStep
    voiceLang = chemicals.lang === "hi" ? "hindi" : "eng"; // Just to be super safe, re-set voiceLang
    speakStep(instructionText); // Play the voiceover for the current instruction text

    timer = setInterval(() => {
        elapsedMs += 10;
        updateDisplay(elapsedMs);

        if (elapsedMs >= targetTimeMs && targetTimeMs > 0) {
            stopStopwatch();
        }
    }, 10);
}

function stopStopwatch() {
    clearInterval(timer);
    elapsedMs = targetTimeMs; // Ensure display shows the exact target time
    updateDisplay(elapsedMs);

    let beaker = document.getElementById("flask20ml");

    if (chemicals.FlaskMl == 5) beaker.setAttribute('src', "./90mlflaskafter.png");
    else if (chemicals.FlaskMl == 10) beaker.setAttribute('src', "./100mlflask.png");
    else if (chemicals.FlaskMl == 15) beaker.setAttribute('src', "./115mlflask.png");
    else if (chemicals.FlaskMl == 20) beaker.setAttribute('src', "./120mlflask.png");

    chemicals.completeReactionInstruction();
}

function resetStopwatch() {
    clearInterval(timer);
    elapsedMs = 0;
    updateDisplay(0);
    document.getElementsByClassName("finalFlask")[0].setAttribute("src", "./20mlflask .png");
    chemicals = new Chemical();
    openPopup();
}

function forwardTime() {
    elapsedMs += 10000;
    updateDisplay(elapsedMs);
    if (elapsedMs >= targetTimeMs && targetTimeMs > 0) {
        stopStopwatch();
    }
}

function updateDisplay(ms) {
    let h = Math.floor(ms / 3600000),
        m = Math.floor((ms % 3600000) / 60000),
        s = Math.floor((ms % 60000) / 1000),
        ms10 = Math.floor((ms % 1000) / 10);

    document.getElementById("stopwatch").innerText =
        `${h.toString().padStart(2, '0')}:` +
        `${m.toString().padStart(2, '0')}:` +
        `${s.toString().padStart(2, '0')}:` +
        `${ms10.toString().padStart(2, '0')}`;
}

// Hover on flask
document.getElementById("flask20ml").addEventListener("mouseover", () => {
    const flask = localStorage.getItem("flask");
    chemicals.ML = flask;
    chemicals.FlaskOfMl();
    const titles = { 'a': 'Flask A 5ML', 'b': 'Flask B 10ML', 'c': 'Flask C 15ML', 'd': 'Flask D 20ML' };
    document.getElementById("flask20ml").setAttribute("title", titles[flask]);
});

// Call openPopup immediately when the script loads to show the initial selection
openPopup();