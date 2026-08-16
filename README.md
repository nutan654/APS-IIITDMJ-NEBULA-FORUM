# NEBULA Astronomy & Physics Society

A full-stack astronomy platform for the Astronomy & Physics Society of IIITDM Jabalpur, combining interactive telescope simulations, observation management, astronomy utilities, role-based member systems, equipment reservations, and an AI-powered astronomy assistant.

## Overview

NEBULA is designed as a digital platform for astronomy clubs and observatory communities.

The application brings together:

* Interactive telescope and eyepiece simulations
* Celestial observation logging
* Astrophotography archiving
* Astronomy-focused weather and seeing analysis
* Role-based scholar progression
* Observatory equipment reservations
* AI-assisted astronomy guidance
* Interactive constellation visualization
* Secure authentication and protected API routes

The project uses a modern Next.js architecture with server/client component separation and a custom lightweight relational state layer.

## Core Features

### Interactive Eyepiece Simulator

A browser-based telescope optics simulator that models how celestial objects appear under different observing configurations.

The simulator supports:

* Eyepiece focal-length changes
* Magnification calculations
* Barlow lens configurations
* Dynamic field-of-view boundaries
* Planetary observation rendering
* Multiple celestial targets

Supported targets include Saturn, Jupiter's Galilean moons, the Orion Nebula, and lunar craters.

### Celestial Observation Logbook

A CRUD-based observation ledger for recording:

* Celestial objects
* Telescope configuration
* Eyepiece selection
* Atmospheric conditions
* Observation notes
* Deep-sky observations

Observation entries are integrated into the platform's astronomy activity feed.

### Astrophotography Archive

A structured gallery for preserving astronomical imaging records alongside technical metadata such as:

* Exposure information
* ISO configuration
* Telescope instrumentation
* Long-exposure parameters
* Observatory records

### Astronomy Seeing Predictor

A custom observation-quality model combining simulated astronomical conditions including:

```text
Cloud Cover
Atmospheric Clarity
Lunar Interference
Sky Scintillation
        ↓
Observation Quality
        ↓
Recommended Target Type
```

The system can distinguish between conditions suitable for deep-sky imaging and conditions where planetary observations are more appropriate.

### Scholar Examination System

NEBULA includes an astronomy qualification workflow for member progression.

Members can progress through:

```text
NOVICE
   ↓
SCHOLAR
   ↓
HIGH_PRIEST
```

Successful examination completion automatically updates the user's role.

This provides a practical example of role-based business logic rather than simple static permissions.

### Galileo AI Assistant

An astronomy-focused conversational assistant designed to answer questions related to:

* Astrophysics
* Orbital mechanics
* Relativity
* Observing techniques
* Observatory schedules
* Astronomy concepts

The assistant is integrated into the application as a dedicated astronomy interface.

### Observatory Equipment Reservations

A reservation system for coordinating:

* Telescope sessions
* Equipment usage
* Observatory slots
* Research sessions
* Multiple telescope configurations

This provides a centralized scheduling layer for observatory activities.

## System Architecture

```text
                         ┌──────────────────────────┐
                         │       Next.js App        │
                         │                          │
                         │  Server Components       │
                         │  Client Components       │
                         │  Interactive Simulators  │
                         │  Astronomy Dashboard     │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │      Next.js API         │
                         │                          │
                         │  Authentication          │
                         │  Authorization           │
                         │  CRUD Operations         │
                         │  Reservations            │
                         │  Astronomy Services      │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │ Custom Relational Store  │
                         │                          │
                         │ Users                    │
                         │ Observations             │
                         │ Equipment                │
                         │ Reservations              │
                         │ Scholar State            │
                         └──────────────────────────┘

                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │    Astronomy Utilities   │
                         │                          │
                         │ Optics Simulation        │
                         │ Seeing Prediction         │
                         │ Constellation Rendering  │
                         │ AI Assistant              │
                         └──────────────────────────┘
```

## Technical Architecture

### Frontend

* Next.js 14
* App Router
* React
* TypeScript
* Tailwind CSS
* Server Components
* Client Components
* HTML5 Canvas
* `requestAnimationFrame`

### Backend

The backend is implemented using Next.js API routes.

Responsibilities include:

* Authentication
* Authorization
* Protected API operations
* Observation CRUD
* Equipment management
* Reservation management
* Scholar role progression
* Astronomy-related application logic

### State and Persistence

The current implementation uses a custom in-memory relational engine rather than an external database.

The relational model organizes application state around entities such as:

```text
User
 ├── Observations
 ├── Reservations
 └── Scholar Status

Equipment
 └── Reservations
```

The custom store keeps the project lightweight while providing relational-style application behavior.

## Authentication and Authorization

NEBULA implements JWT-based authentication with cookie-backed sessions.

Security features include:

* JWT authentication
* HttpOnly session cookies
* Role-based authorization
* Protected API routes
* Server-side authorization checks
* Dynamic role elevation after examination
* Restricted observatory operations

Authorization is based on the user's current application role rather than relying solely on client-side UI restrictions.

## Rendering and Performance

The visual layer uses browser-native rendering technologies for interactive astronomical experiences.

The application uses:

* HTML5 Canvas for starfield and constellation rendering
* `requestAnimationFrame` for animation loops
* Hardware-accelerated browser rendering
* Responsive layouts
* Hybrid server/client rendering

The constellation system dynamically renders connections between stars to create an interactive astronomical background.

## Design System

The interface combines astronomical visualization with a structured application UI.

Key design characteristics include:

* Responsive layouts
* Glassmorphism panels
* Celestial gradients
* Cinzel and Spectral typography
* Animated starfields
* Interactive constellation effects
* Motion-based UI transitions
* Astronomy-specific visualization components

The visual system is implemented as part of the application rather than relying entirely on static imagery.

## Project Structure

```text
APS-IIITDMJ-NEBULA-FORUM/
├── app/
│   ├── api/                 # Next.js API routes
│   ├── ...                  # Application pages and layouts
│
├── lib/
│   ├── ...                  # Shared application logic
│
├── public/                  # Static assets
│
├── package.json
├── package-lock.json
├── next.config.js
├── tsconfig.json
├── next-env.d.ts
├── README.md
│
├── debug_strip.py
├── read_log.py
├── strip_comments.py
└── strip_comments.js
```

The current repository is a compact Next.js application with the frontend and backend API layer maintained within the same project.

## Local Development

### Requirements

* Node.js
* npm

Clone the repository:

```bash
git clone https://github.com/nutan654/APS-IIITDMJ-NEBULA-FORUM.git
cd APS-IIITDMJ-NEBULA-FORUM
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The current repository's documented development workflow uses Next.js and `npm run dev`.

## Deployment

The project is structured for deployment as a Next.js application.

The repository currently includes a deployed Vercel application linked from GitHub:

```text
https://aps-iiitdmj-nebula-forum.vercel.app
```

## Engineering Highlights

### Full-Stack Next.js Architecture

Frontend rendering and backend API operations are maintained within the same Next.js application, reducing unnecessary service boundaries for a club-scale platform.

### Role-Based Business Logic

Scholar progression is implemented as an application workflow:

```text
Examination
    ↓
Validation
    ↓
Role Promotion
    ↓
Updated Permissions
```

This makes authorization part of the domain model rather than simply a UI feature.

### Interactive Scientific Visualization

The project uses browser rendering primitives to build astronomy-focused visualizations rather than presenting the application as a collection of static pages.

### Domain-Specific Simulation

The eyepiece laboratory models telescope observation parameters such as focal length, magnification, field of view, and Barlow lens configuration.

### Integrated Observatory Workflow

Observation records, equipment reservations, scholar progression, and astronomy utilities are combined into one platform, reflecting the operational workflow of an astronomy society.

## Future Improvements

Potential extensions include:

* Persistent PostgreSQL storage
* Live ISS tracking
* Real-time sky maps
* Advanced astronomy research assistant
* Observatory analytics
* Automated astronomical event notifications
* Advanced astrophotography metadata analysis
* Research archive management
* Multi-user observatory collaboration
* Real astronomical weather API integration

## Technology Stack

| Layer          | Technology                         |
| -------------- | ----------------------------------- |
| Framework      | Next.js 14                         |
| UI             | React                              |
| Language       | TypeScript                         |
| Styling        | Tailwind CSS                       |
| API            | Next.js API Routes                 |
| Authentication | JWT                                |
| Sessions       | Cookie-based authentication        |
| Authorization  | Role-Based Access Control          |
| State          | Custom in-memory relational engine |
| Visualization  | HTML5 Canvas                       |
| Animation      | `requestAnimationFrame`            |
| AI             | Astronomy assistant integration    |
| Deployment     | Vercel                             |

## Project Goal

NEBULA was built to explore how a specialized web platform can combine software engineering with scientific education.

The goal is not simply to present astronomy content, but to provide an interactive environment where members can:

* Learn
* Simulate
* Observe
* Record
* Schedule
* Qualify
* Explore

within a single astronomy-focused system.

## Author

**Nutan Bisandre**



[GitHub](https://github.com/nutan654)
