# Locked In — Development Roadmap (30 Sprints)

> **Methodology:** Agile (1-week sprints)
>
> **Goal:** Build an MVP first, then expand into a production-ready AI learning platform.
>
> **Tech Stack**
>
> * React Native (Expo)
> * TypeScript
> * Supabase
> * PostgreSQL
> * OpenAI
> * Supabase Storage
> * Edge Functions
> * Expo Router
> * Zustand
> * TanStack Query
> * NativeWind
> * Expo Notifications

---

# Phase 1 — Foundation

## Sprint 1 — Project Initialization

### Goals

* Initialize React Native project
* Configure Expo Router
* Setup TypeScript
* Setup NativeWind
* Configure ESLint & Prettier
* Create folder structure
* Setup environment variables

### Deliverables

* Running mobile app
* Navigation skeleton
* Theme system
* Light/Dark mode
* Reusable UI components

---

## Sprint 2 — Backend Setup

### Goals

* Create Supabase project
* Configure Authentication
* Database schema
* Storage buckets
* RLS Policies

### Tables

* users
* profiles
* subjects
* folders
* uploads
* notes

Deliverable:

Working backend.

---

## Sprint 3 — Authentication

Features

* Email Login
* Register
* Forgot Password
* Google Login
* Apple Login (iOS)
* Session persistence

Deliverables

Complete authentication flow.

---

## Sprint 4 — Design System

Build reusable components.

Components

* Button
* Card
* Input
* Search
* Modal
* Bottom Sheet
* Loading States
* Empty States
* Skeletons
* Toasts

Deliverables

Reusable UI library.

---

# Phase 2 — Dashboard

## Sprint 5 — Dashboard

Features

* Welcome screen
* Today's progress
* Study streak
* Upcoming exams
* Continue studying
* Subject overview

---

## Sprint 6 — Subject Management

Features

* Create Subject
* Edit Subject
* Delete Subject
* Icons
* Colors
* Sorting
* Search

---

## Sprint 7 — Folder Organization

Students can create

* Units
* Chapters
* Semesters
* Topics

Supports drag-and-drop organization.

---

# Phase 3 — Upload System

## Sprint 8 — File Upload

Upload

* PDF
* DOCX
* PPTX
* TXT
* Markdown

Store in Supabase Storage.

---

## Sprint 9 — Camera Scanner

Features

* Scan notes
* Whiteboards
* Books
* Documents

Auto crop

Perspective correction

Image enhancement

---

## Sprint 10 — OCR

Extract text from

* Images
* Handwritten notes
* Whiteboards

Save extracted text.

---

## Sprint 11 — Audio Upload

Students upload lectures.

Store recordings.

Generate transcript.

---

# Phase 4 — AI

## Sprint 12 — AI Reviewer

Generate

* Summary
* Detailed Notes
* Cheat Sheet

Save generated reviewer.

---

## Sprint 13 — Flashcard Generator

Generate

* Flashcards
* Definitions
* Key concepts

Flashcard viewer.

---

## Sprint 14 — AI Tutor

Chat with uploaded documents.

Features

* Follow-up questions
* Context memory
* Citation references

---

## Sprint 15 — Quiz Generator

Generate

* Multiple Choice
* Identification
* True/False
* Fill in Blank
* Matching

---

## Sprint 16 — Mock Exam

Features

* Timer
* Auto Submit
* Randomization
* Results
* Review answers

---

# Phase 5 — Learning Engine

## Sprint 17 — Progress Tracking

Track

* Study sessions
* Quiz history
* Mock exams
* Reading time

Charts.

---

## Sprint 18 — Weakness Detection

AI identifies

* Weak topics
* Frequently missed questions
* Low confidence topics

Recommendations.

---

## Sprint 19 — Adaptive Learning

Question difficulty adjusts automatically.

Generate personalized review sessions.

---

## Sprint 20 — Study Planner

Students enter

* Exam date
* Available hours

Generate schedule automatically.

---

## Sprint 21 — Smart Notifications

Reminder engine.

Examples

* Review tomorrow
* Exam approaching
* Daily streak

Push notifications.

---

# Phase 6 — Productivity

## Sprint 22 — Calendar

Calendar

* Exams
* Assignments
* Quizzes
* Deadlines

---

## Sprint 23 — Focus Mode

Features

* Pomodoro
* Ambient sounds
* Session timer
* Session history

---

## Sprint 24 — Offline Mode

Offline

* Notes
* Flashcards
* Reviewers

Automatic sync.

---

# Phase 7 — Gamification

## Sprint 25 — XP System

Features

* XP
* Levels
* Daily streak

---

## Sprint 26 — Achievements

Badges

Milestones

Weekly goals

Monthly goals

---

## Sprint 27 — Leaderboards

Rank

* Friends
* School
* Global

Optional.

---

# Phase 8 — Collaboration

## Sprint 28 — Study Groups

Features

* Create groups
* Invite members
* Shared reviewers
* Shared notes
* Shared quizzes

---

## Sprint 29 — Quiz Battle

Modes

* 1v1
* Group

Live scoring.

---

# Phase 9 — Production

## Sprint 30 — Polish & Launch

Tasks

* Bug fixing
* Performance optimization
* Accessibility improvements
* App Store assets
* Play Store assets
* Privacy Policy
* Terms of Service
* Analytics
* Crash reporting
* Beta testing
* Production release

---

# 🚀 Post-Launch Roadmap (Recommended)

## Sprint 31 — AI Knowledge Graph

Visualize relationships between concepts.

---

## Sprint 32 — YouTube Import

Paste a YouTube lecture.

Generate

* Transcript
* Summary
* Flashcards
* Quiz

---

## Sprint 33 — Voice AI Tutor

Talk naturally with AI using voice.

---

## Sprint 34 — Teacher Dashboard

Teachers can

* Upload lectures
* Assign quizzes
* Monitor student progress
* View class analytics

---

## Sprint 35 — School Workspace

Schools can create organizations.

Features

* Classes
* Teachers
* Students
* Shared subjects
* Analytics

---

## Sprint 36 — Parent Portal

Parents can view

* Study time
* Progress
* Upcoming exams
* Weekly reports

---

## Sprint 37 — AI Exam Predictor

Predict likely exam performance based on:

* Quiz history
* Study habits
* Mock exams
* Confidence ratings

---

## Sprint 38 — AI Study Coach

Daily personalized coaching.

Examples

* What to study next
* Motivation
* Focus recommendations
* Weekly goals

---

## Sprint 39 — Marketplace

Community-created

* Reviewers
* Flashcards
* Mock exams
* Study packs

Creators can publish content.

---

## Sprint 40 — AI Learning Assistant 2.0

The long-term vision.

Students can ask:

* "Teach me this chapter."
* "Explain this formula."
* "Generate a 100-question board exam."
* "Create a one-page cheat sheet."
* "Make this lesson easier."
* "Test me until I master this topic."

The AI evolves from a chatbot into a personalized learning companion that understands each student's learning style, strengths, weaknesses, and academic goals.

---

# 🎯 MVP Release Scope

To launch a compelling first version, complete Sprints **1–20**. This delivers:

* Authentication
* Subjects
* File uploads
* OCR
* AI reviewer generation
* Flashcards
* AI tutor
* Quiz generation
* Mock exams
* Progress tracking
* Weakness detection
* Adaptive learning
* AI study planner

This is already a powerful AI-powered study platform that can be released to early users for feedback.

Sprints **21–30** focus on polish, engagement, collaboration, offline support, and production readiness, while **31–40** expand the platform into a complete AI learning ecosystem.
