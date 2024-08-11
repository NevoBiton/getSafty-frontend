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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Pikud HaOref Missile Attack Instructions
      </h1>
      <p className="text-lg text-gray-700 mb-4">
        Follow these guidelines provided by Pikud HaOref (Home Front Command) to
        ensure your safety during missile attacks.
      </p>
      <Accordion type="multiple" className="space-y-4">
        {missileInstructions.map((instruction, index) => (
          <AccordionItem
            key={index}
            value={instruction.title} // Add a unique value prop here
            className="border border-gray-300 rounded-lg"
          >
            <AccordionTrigger className="bg-orange-500 text-white text-lg font-semibold p-4 rounded-lg hover:bg-orange-600">
              {instruction.title}
            </AccordionTrigger>
            <AccordionContent className="bg-white p-4 rounded-b-lg text-gray-700">
              <ul className="list-disc list-inside space-y-2">
                {instruction.content.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default InstructionsPage;
