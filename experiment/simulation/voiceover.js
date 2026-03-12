// let voiceLang = localStorage.getItem("lang") === "hi" ? "hindi" : "eng";
// function speakStep(text) {
//     speechSynthesis.cancel();

//     const speak = () => {
//         const utterance = new SpeechSynthesisUtterance(text);

//         const voices = speechSynthesis.getVoices();
//         const hindiVoice = voices.find(v => v.name.includes("Kalpana") || v.lang === "hi-IN");
//         const engVoice = voices.find(v => v.name.includes("Zira") || v.lang === "en-US" || v.lang === "en-IN");

//         utterance.voice = voiceLang === "hindi" ? hindiVoice : engVoice;
//         utterance.lang = voiceLang === "hindi" ? "hi-IN" : "en-IN";
//         utterance.rate = 1;
//         utterance.pitch = 1;
//         utterance.volume = 1;

//         speechSynthesis.speak(utterance);
//     };

//     // If voices are not ready yet, wait
//     if (speechSynthesis.getVoices().length === 0) {
//         speechSynthesis.onvoiceschanged = speak;
//     } else {
//         speak();
//     }
// }


// function playVoiceForCurrentStep() {
//     const step = chemicals.step;

//     const voiceInstructions = {
//         eng: {
//             2: "Now click on the distilled water to make the solution 90 milliliters",
//             3: `Now measure ${chemicals.FlaskMl} milliliters of sulfuric acid to add in the mixture`,
//             4: `Measure ${chemicals.FlaskMl} milliliters of sodium thiosulfate to add in the solution`,
//             5: `Now measure ${chemicals.FlaskMl} milliliters of starch solution and add it`,
//             6: `Now measure ${chemicals.FlaskMl} milliliters of hydrogen peroxide to add`,
//             7: "Now stir the mixture and immediately start the stopwatch"
//         },
//         hindi: {
//             2: "अब घोल को 90 मिलीलीटर बनाने के लिए आसुत जल पर क्लिक करें",
//             3: `अब मिश्रण में मिलाने के लिए ${chemicals.FlaskMl} मिलीलीटर सल्फ्यूरिक एसिड मापें।`,
//             4: `घोल में मिलाने के लिए ${chemicals.FlaskMl} मिलीलीटर सोडियम थायोसल्फेट मापें।`,
//             5: `अब स्टार्च सॉल्यूशन का ${chemicals.FlaskMl} मिलीलीटर मापें और मिलाएं।`,
//             6: `अब ${chemicals.FlaskMl} मिलीलीटर हाइड्रोजन पेरोक्साइड मापें और मिलाएं।`,
//             7: "अब मिश्रण को हिलाएं और तुरंत स्टॉपवॉच चालू करें"
//         }
//     };

//     const text = voiceInstructions[voiceLang][step];
//     if (text) speakStep(text);
// }