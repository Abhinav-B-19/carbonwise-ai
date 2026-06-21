# CarbonWise AI 🌱

## Gen AI Academy APAC Edition Submission

CarbonWise AI is an AI-powered sustainability platform that helps individuals understand, track, and improve their environmental impact through carbon footprint analysis, personalized AI coaching, sustainability goal tracking, gamification, and future impact simulations.

---

## 🌍 Problem Statement

Climate change remains one of the most pressing global challenges. While many individuals want to adopt sustainable lifestyles, they often lack:

* Visibility into their carbon footprint
* Understanding of which habits contribute most to emissions
* Personalized guidance on reducing environmental impact
* Motivation to consistently practice sustainable behaviors
* Tools to visualize the impact of lifestyle changes

CarbonWise AI addresses these challenges by combining carbon footprint tracking, AI-generated sustainability recommendations, gamification, and predictive scenario modeling into a single user-friendly platform.

---

## 🚀 Solution Overview

CarbonWise AI empowers users to:

* Measure their carbon footprint across multiple lifestyle categories
* Receive AI-powered sustainability recommendations
* Set and track sustainability goals
* Complete daily eco-friendly challenges
* Earn rewards and achievements
* Simulate future sustainability scenarios
* Monitor progress through visual dashboards

The platform transforms sustainability from a complex concept into actionable, measurable, and engaging daily habits.

---

## ✨ Features

### 🌍 Carbon Footprint Calculator

Calculate emissions across multiple categories:

* Transportation
* Home Energy Usage
* Food Consumption
* Online Deliveries

The platform generates:

* Total Carbon Emissions
* Carbon Score
* Sustainability Assessment

---

### 📊 Interactive Dashboard

Provides users with:

* Carbon Score Overview
* Sustainability Level
* Green Points
* Daily Streak
* Active Goals
* Assessment Statistics
* Emission Trend Charts
* Score Trend Charts

---

### 🎯 Sustainability Goals

Users can create personalized sustainability goals such as:

* Improve Carbon Score
* Reduce Total Emissions
* General Sustainability Improvement

Features include:

* Progress Tracking
* Automatic Goal Updates
* Completion Monitoring
* Goal Analytics

---

### 🏆 Daily Sustainability Challenges

Encourages consistent eco-friendly actions through:

* Daily Challenges
* Reward Points
* Carbon Savings Tracking
* Challenge History

Examples:

* Reduce AC Usage
* Use Public Transport
* Avoid Single-Use Plastics
* Reduce Delivery Orders

---

### 🤖 AI Sustainability Coach

Generates personalized sustainability recommendations using AI.

Features:

* Carbon Footprint Analysis
* Personalized Improvement Suggestions
* Actionable Sustainability Advice
* Historical AI Insights
* Progress-Based Recommendations

Example AI Guidance:

* Home energy optimization
* Transportation improvements
* Sustainable food choices
* Lifestyle habit adjustments

---

### 🔮 Sustainability Simulator

Allows users to explore "what-if" scenarios.

Users can simulate:

* Reduced Car Travel
* Reduced AC Usage
* Vegetarian Diet Adoption
* Reduced Deliveries

Outputs include:

* Projected Emissions
* Carbon Reduction Potential
* Projected Carbon Score
* AI Impact Analysis

This helps users understand the long-term impact of lifestyle changes before implementing them.

---

### 🏅 Gamification & Rewards

Keeps users motivated through:

* Green Points
* Sustainability Levels
* Achievement Badges
* Activity Streaks

Levels include:

* Eco Beginner
* Carbon Aware
* Green Advocate
* Eco Champion

---

### 👤 Personalized User Experience

Each user receives:

* Personalized Dashboard
* Sustainability Focus Tracking
* AI Recommendations
* Progress Monitoring
* Goal-Based Insights

---

## 🏗 Architecture

## 📁 Project Structure

```text
carbonwise-ai
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   ├── hooks
│   │   ├── services
│   │   ├── types
│   │   ├── utils
│   │   └── constants
│   └── tests
│
├── backend
│   ├── Controllers
│   ├── Services
│   ├── Models
│   ├── DTOs
│   ├── Data
│   └── Migrations
│
└── README.md
```

### Frontend

Built using:

* React
* TypeScript
* Tailwind CSS
* Axios
* React Router
* React Markdown
* Recharts

### Backend

Built using:

* ASP.NET Core Web API
* C#
* Entity Framework Core
* PostgreSQL

### AI Layer

* OpenAI Integration
* Personalized Sustainability Analysis
* AI Coaching
* Scenario Explanations

## 🤖 AI Workflow

```text
User Input
     ↓
Carbon Assessment
     ↓
Carbon Score Calculation
     ↓
Dashboard Analytics
     ↓
AI Sustainability Analysis
     ↓
Personalized Recommendations
     ↓
Goals & Challenges
     ↓
Gamification & Rewards
     ↓
Scenario Simulation
```

### Infrastructure

Frontend Hosting:

* Vercel

Backend Hosting:

* Render

Database:

* PostgreSQL

---

## ⚡ Technical Highlights

- Component-based architecture
- Strong TypeScript typing
- Modular service layer
- Lazy-loaded routes
- Reusable UI components
- Memoized computations using useMemo
- Optimized rendering using React.memo
- Responsive mobile-first design
- Comprehensive automated testing
- Separation of concerns

## 🚀 Performance Optimizations

- Route-based code splitting
- Production bundle optimization
- Memoized chart calculations
- Component memoization
- Reduced unnecessary re-renders
- Lightweight production build (<1 MB)
- Efficient API orchestration using Promise.all



## 🔄 User Flow

### 1. User Registration

User registers with:

* Name
* Email
* Sustainability Focus

---

### 2. Carbon Assessment

User submits:

* Transportation Data
* Home Energy Usage
* Food Consumption
* Delivery Frequency

Platform calculates:

* Carbon Emissions
* Carbon Score

---

### 3. Dashboard Insights

Users receive:

* Sustainability Overview
* Emission Trends
* Score Trends
* Progress Metrics

---

### 4. Goal Creation

Users create sustainability goals and track their progress automatically.

---

### 5. Daily Challenges

Users complete sustainability challenges to earn points and improve their environmental impact.

---

### 6. AI Coaching

AI analyzes user history and generates personalized recommendations.

---

### 7. Scenario Simulation

Users experiment with future sustainability choices and see projected outcomes.

---

### 8. Rewards & Achievements

Users earn:

* Green Points
* Streaks
* Achievement Badges
* Sustainability Levels

---

## 🛠 Local Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
dotnet restore
dotnet run
```

### Test

```bash
npm test
dotnet test
```

## 📸 Screenshots

### Dashboard

<img width="1440" height="797" alt="image" src="https://github.com/user-attachments/assets/afd8c38f-372e-4475-bb32-c12c2a10a803" />

### Carbon Calculator

<img width="1440" height="797" alt="image" src="https://github.com/user-attachments/assets/3e00a45d-7ce1-4a9a-b3e0-99027541ec6d" />

### Goals

<img width="1440" height="797" alt="image" src="https://github.com/user-attachments/assets/a59984e9-8455-469a-a342-e61f1b10ef41" />

### Challenges

<img width="1918" height="862" alt="image" src="https://github.com/user-attachments/assets/eb1f70db-6196-457e-88ca-0225ff15404f" />

### AI Coach

<img width="1440" height="797" alt="image" src="https://github.com/user-attachments/assets/acf617a8-278d-4158-b341-4609caf7a974" />

### Sustainability Simulator

<img width="1918" height="872" alt="image" src="https://github.com/user-attachments/assets/e0e70d67-2e2a-4351-b1a8-7d87e2e041b2" />

### Rewards & Achievements

<img width="1918" height="872" alt="image" src="https://github.com/user-attachments/assets/e7861c3c-e40e-4acc-8736-02b80456906f" />

---

## 🌐 Live Demo

Frontend:

https://carbonwise-ai-lime.vercel.app

Backend API:

https://carbonwise-ai-44hh.onrender.com

Swagger Documentation:

https://carbonwise-ai-44hh.onrender.com/swagger

---

## 💻 Source Code

GitHub Repository:

https://github.com/Abhinav-B-19/carbonwise-ai

---

## 🎯 Hackathon Submission

Event:

**Gen AI Academy APAC Edition**

Project:

**CarbonWise AI**

Category:

**AI for Sustainability & Environmental Impact**

---

## 🔮 Future Enhancements

Planned improvements include:

* Real-Time Carbon Tracking
* Smart Device Integrations
* Team Sustainability Challenges
* Community Leaderboards
* Carbon Offset Marketplace
* Organization Sustainability Reporting
* AI-Generated Sustainability Plans
* Carbon Benchmark Comparisons
* Mobile Application
* Voice-Based Sustainability Assistant

---

## 👨‍💻 Author

**Abhinav B**

GitHub:
https://github.com/Abhinav-B-19

---

## 🌱 Making Sustainability Measurable, Actionable, and Engaging

CarbonWise AI combines Artificial Intelligence, Gamification, and Sustainability Analytics to help users make informed environmental decisions and build long-term sustainable habits.
