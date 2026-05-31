# Macro Fuel

## Overview

Macro Fuel is a personal nutrition tracking application designed to log daily food intake, track macronutrients, and monitor progress against custom dietary goals.

This is a self-built tool created for personal use, focused on simplifying calorie tracking, recipe reuse, and daily macro planning through a structured and data-driven workflow.

The project is not intended for commercial distribution. It exists as part of my personal portfolio to demonstrate product thinking, system design, and full-stack implementation skills.

---

## Core Features

### Ingredient Tracking

I can log individual ingredients along with their macronutrient information (calories, protein, carbohydrates, and fats). This creates a reusable base dataset for meal building.

### Recipe Builder

Ingredients can be combined into reusable recipes, allowing frequently used meals to be stored, managed, and reused across different days.

### Meal Planning (Planner Tab)

The planner enables users to assign recipes to meals (breakfast, lunch, dinner, snacks) for a given day, providing a structured view of daily intake.

### Macro & Calorie Goals

Users can define daily targets for:

* Calories
* Protein
* Carbohydrates
* Fats
* Activity level (optional tracking input)

### Dashboard Analytics

A visual dashboard compares:

* Consumed macros vs. daily goals

---

## Architecture & Tech Stack

### Frontend

* React
* JavaScript (ES6+)
* Component-based UI structure

### Backend

* Appwrite (database, and data persistence)

### Hosting

* GitHub Pages (static deployment)

---

## Development Approach

This project was built iteratively as a personal solution to a recurring problem: tracking nutrition in a structured and flexible way.

The frontend was initially designed using AI-assisted UI generation tools to accelerate layout exploration and design decisions. These designs were then translated into React components using additional AI-assisted development tools, followed by manual refinement and integration.

The backend was implemented using Appwrite to handle structured data storage, user-defined entities (ingredients, recipes, and daily logs), and persistent tracking of nutritional information.

---

## Key Design Decisions

* **Data-first structure:** Ingredients → Recipes → Daily Plans → Dashboard analytics
* **Reusable entities:** Recipes are built once and reused across multiple days
* **Separation of concerns:** Ingredient data, recipe composition, and daily tracking are independently managed
* **Minimal cost infrastructure:** Fully hosted using free-tier services (GitHub Pages + Appwrite)

---

## Hosting

The application is currently hosted via GitHub Pages as a static frontend, connected to an Appwrite backend instance for data persistence.

This setup was chosen to maintain zero-cost operation while ensuring sufficient scalability for personal use.

---

## AI Usage

AI tools were used as development accelerators in the following areas:

* UI layout ideation and design generation
* Conversion of design concepts into React components
* Backend integration guidance (Appwrite)
* Debugging and implementation support

All system design decisions, data modeling, and final implementation choices were made manually.

---

## Purpose

This project serves as:

* A personal nutrition tracking system
* A demonstration of full-stack application design
* A showcase of data modeling and system structuring ability
* A portfolio artifact highlighting practical problem-solving skills

It is intentionally built for personal use and not designed as a commercial product.

---

## Future Improvements

* Improved analytics and trend tracking over time
* Enhanced recipe categorization and tagging
* Exportable nutrition reports
* Smarter activity-to-calorie adjustment modeling

---

## Author

Built and maintained by Laura Jimenez as part of a personal learning and portfolio development journey focused on systems thinking, data-driven applications, and software engineering fundamentals.
