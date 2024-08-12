import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";

const missileInstructions = [
  {
    title: "Choosing a Shelter",
    content: [
      "Identify the nearest secure area in advance, such as a Mamad (residential secure space), a bomb shelter, or an inner room without windows.",
      "If you live in a multi-story building without immediate access to a Mamad or bomb shelter, go down two flights of stairs if you’re on the top floor, or one flight if you're on a lower floor.",
    ],
  },
  {
    title: "When You Hear the Siren",
    content: [
      "Indoors: Quickly enter your designated shelter or secure room and close all doors and windows.",
      "Outdoors: Lie flat on the ground, cover your head with your hands, and stay there for at least 10 minutes.",
      "In a Vehicle: Stop safely on the side of the road, exit the vehicle, and lie down on the ground away from the car.",
      "Public Transport: Crouch below the window line and cover your head and neck with your hands.",
    ],
  },
  {
    title: "After the Attack",
    content: [
      "Stay in your secure area for at least 10 minutes after hearing the explosion.",
      "Listen to the radio or official app notifications for further instructions before leaving the secure area.",
      "Avoid touching any suspicious objects and report them to authorities.",
    ],
  },
  {
    title: "Prepare Your Shelter",
    content: [
      "Ensure your shelter or secure room is equipped with essentials: bottled water, food, a first-aid kit, flashlights, communication devices, and copies of important documents.",
      "Keep personal belongings like money, clothes, medications, and items to pass the time in the shelter.",
      "Make sure your shelter is cleared of any clutter and ready for use at all times.",
    ],
  },
];

function InstructionsPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white p-8 md:p-10 rounded-xl shadow-2xl border-t-8 border-orange-500 overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-4 md:mb-6 text-center">
          Pikud HaOref Missile Attack Instructions
        </h1>
        <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 text-center">
          Follow these guidelines provided by Pikud HaOref (Home Front Command)
          to ensure your safety during missile attacks.
        </p>
        <Accordion type="multiple" className="space-y-4">
          {missileInstructions.map((instruction, index) => (
            <AccordionItem
              key={index}
              value={instruction.title}
              className="border border-gray-300 rounded-lg shadow-lg"
            >
              <AccordionTrigger className="bg-gradient-to-r from-orange-300 to-orange-400 text-gray-800 text-base md:text-lg font-semibold p-3 md:p-4 rounded-t-lg hover:from-orange-400 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition">
                {instruction.title}
              </AccordionTrigger>
              <AccordionContent className="bg-gray-50 p-4 md:p-6 rounded-b-lg text-gray-700 leading-relaxed">
                <ul className="list-disc list-inside space-y-2 md:space-y-3">
                  {instruction.content.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default InstructionsPage;
