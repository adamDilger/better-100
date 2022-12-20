export function speak(input: string) {
  console.log("speak", input);
  const synthesis = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(input);

  // const voices = synthesis.getVoices().filter((v) => v.lang.startsWith("en-"));
  // const voice = voices[Math.floor(Math.random() * voices.length)];

  // utterance.voice = voice;
  utterance.rate = 0.9;
  utterance.volume = 1.0;

  synthesis.speak(utterance);
}
