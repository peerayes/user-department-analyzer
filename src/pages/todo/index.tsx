"use client";

import React, { useEffect, useState } from "react";

interface Item {
  type: "Fruit" | "Vegetable";
  name: string;
  id?: number;
}

interface TimerRecord {
  [key: number]: NodeJS.Timeout;
}

export default function AutoDeleteTodoPage(): React.ReactElement {
  const initialItems: Item[] = [
    { type: "Fruit", name: "Apple" },
    { type: "Vegetable", name: "Broccoli" },
    { type: "Vegetable", name: "Mushroom" },
    { type: "Fruit", name: "Banana" },
    { type: "Vegetable", name: "Tomato" },
    { type: "Fruit", name: "Orange" },
    { type: "Fruit", name: "Mango" },
    { type: "Fruit", name: "Pineapple" },
    { type: "Vegetable", name: "Cucumber" },
    { type: "Fruit", name: "Watermelon" },
    { type: "Vegetable", name: "Carrot" },
  ];
  // State for each column
  const [mainList, setMainList] = useState<Item[]>(initialItems);
  const [fruitColumn, setFruitColumn] = useState<Item[]>([]);
  const [vegetableColumn, setVegetableColumn] = useState<Item[]>([]);

  // Timer tracking
  const [timers, setTimers] = useState<TimerRecord>({});

  // Move item from main list to its type column
  const moveToTypeColumn = (item: Item, index: number): void => {
    // Remove from main list
    const updatedMainList = [...mainList];
    updatedMainList.splice(index, 1);
    setMainList(updatedMainList);

    // Add to appropriate column
    if (item.type === "Fruit") {
      setFruitColumn([...fruitColumn, { ...item, id: Date.now() }]);
    } else {
      setVegetableColumn([...vegetableColumn, { ...item, id: Date.now() }]);
    }
  };

  // Move item from type column back to main list
  const moveBackToMainList = (
    item: Item,
    fromColumn: "Fruit" | "Vegetable"
  ): void => {
    // Add to bottom of main list
    setMainList([...mainList, item]);

    // Remove from column and clear timer
    if (fromColumn === "Fruit") {
      setFruitColumn(fruitColumn.filter((i) => i.id !== item.id));
    } else {
      setVegetableColumn(vegetableColumn.filter((i) => i.id !== item.id));
    }

    // Clear timer
    if (item.id && timers[item.id]) {
      clearTimeout(timers[item.id]);
      const newTimers = { ...timers };
      delete newTimers[item.id];
      setTimers(newTimers);
    }
  };

  // Set up auto-return timers for items in type columns
  useEffect(() => {
    // Process fruit column items
    fruitColumn.forEach((item) => {
      if (item.id && !timers[item.id]) {
        const timerId = setTimeout(() => {
          moveBackToMainList(item, "Fruit");
        }, 5000);

        setTimers((prev) => ({
          ...prev,
          [item.id as number]: timerId,
        }));
      }
    });

    // Process vegetable column items
    vegetableColumn.forEach((item) => {
      if (item.id && !timers[item.id]) {
        const timerId = setTimeout(() => {
          moveBackToMainList(item, "Vegetable");
        }, 5000);

        setTimers((prev) => ({
          ...prev,
          [item.id as number]: timerId,
        }));
      }
    });

    // Cleanup timers
    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, [fruitColumn, vegetableColumn]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Auto Delete Todo List
      </h1>

      <div className="flex w-full max-w-6xl gap-6">
        {/* Main List Column */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            Main List
          </h2>
          <div className="flex flex-col gap-2">
            {mainList.map((item, index) => (
              <button
                key={`main-${index}`}
                onClick={() => moveToTypeColumn(item, index)}
                className={`p-3 rounded-md text-white font-medium text-left ${
                  item.type === "Fruit"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } transition duration-200`}>
                {item.name} ({item.type})
              </button>
            ))}
          </div>
        </div>

        {/* Fruit Column */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-red-600 border-b pb-2">
            Fruits
          </h2>
          <div className="flex flex-col gap-2">
            {fruitColumn.map((item) => (
              <button
                key={`fruit-${item.id}`}
                onClick={() => moveBackToMainList(item, "Fruit")}
                className="p-3 bg-red-500 hover:bg-red-600 rounded-md text-white font-medium text-left transition duration-200">
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Vegetable Column */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-600 border-b pb-2">
            Vegetables
          </h2>
          <div className="flex flex-col gap-2">
            {vegetableColumn.map((item) => (
              <button
                key={`veg-${item.id}`}
                onClick={() => moveBackToMainList(item, "Vegetable")}
                className="p-3 bg-green-500 hover:bg-green-600 rounded-md text-white font-medium text-left transition duration-200">
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
