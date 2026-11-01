# Software Requirements Specification (SRS)
# Gahbaz Higher Education Academic & E-Learning Platform

- **Project Name:** Gahbaz Integrated Academic Management & Learning Platform (LMS & SIS)
- **Document Version:** 2.0.0 (User-Centric Specification & Operational Baseline)
- **Standard:** ISO/IEC/IEEE 29148:2018 / IEEE Std 830-1998
- **Date:** 2026-11-01
- **Status:** Approved Baseline Specification
- **Primary Language:** English (Functional Specification) | Arabic (User Interface & Academic Domain)

---

## 1. Introduction & Strategic Vision

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the complete functional and operational requirements for the **Gahbaz Higher Education Academic & E-Learning Platform**. Written strictly from the **user perspective**, this document describes what university administrators, faculty members, students, and prospective visitors can see, do, and experience across the system. It abstracts away technical implementation details (such as database schemas, code functions, and API routes) to serve as the clear functional contract for stakeholders, designers, and software engineers.

### 1.2 The Core Problem & Gahbaz Solution
Traditional higher education institutions face operational friction caused by disconnected tools and manual paperwork:
* Physical course registration queues, manual credit-hour checks, and paper add/drop slips.
* Disconnected lecture delivery relying on external, unmonitored links.
* Manual spreadsheets for coursework, midterm, and final grades that delay GPA reporting.
* Slow official transcript generation requiring physical registrar office visits.
* Lack of synchronized communication channels between professors and enrolled students.

**Gahbaz** solves these challenges by unifying a modern **Learning Management System (LMS)** with a comprehensive **Student Information System (SIS)** into an intuitive, Arabic-first web platform.

### 1.3 Foundational Operational Philosophy: Major-Driven Automatic Cohort Enrollment
Unlike traditional platforms that force students through manual registration for every core subject, Gahbaz operates strictly on a **Major-Driven Automatic Enrollment** paradigm:
1. Every matriculated student belongs to an academic **Major** (Department) and has a defined academic level (Level 1, Level 2, etc.).
2. The university administrator maintains a predefined benchmark curriculum (**Study Plan / Semester Template**) for each level.
3. When the university launches a semester, the platform **automatically provisions active course offerings and enrolls all eligible students belonging to that cohort**.
4. Students immediately see their complete class schedule, syllabus, lecture videos, and discussion rooms upon logging in.
5. **Self-Registration Disabled for Students:** Student self-service course registration is explicitly disabled. Courses are populated exclusively through the semester launch workflow by the university administration.
6. The student portal operates as a **Course Schedule & Drop Portal** (بوابة المقررات والحذف): students can review their enrolled courses or optionally drop an unwanted course during the open window, provided their load does not drop below the minimum 12-credit threshold.

---

## 2. Overall System Description & User Personas

### 2.1 User Classes & Personas

```
                     ┌─────────────────────────────────────────┐
                     │          Platform Super-Admin           │
                     │  (Platform Provisioning & Multi-Tenant) │
                     └────────────────────┬────────────────────┘
                                          │
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │          University Admin               │
                     │  (Campus Setup, Term Launch, Admissions)│
                     └──────────────┬───────────────────┬──────┘
                                    │                   │
                  ┌─────────────────┴────┐         ┌────┴───────────────────┐
                  ▼                      ▼         ▼                        ▼
       ┌────────────────────┐   ┌────────────────────┐   ┌─────────────────────┐
       │   Faculty Member   │   │  Enrolled Student  │   │  Public / Visitor   │
       │ (Syllabus, Grades) │   │ (Lectures, Add/Drop│   │ (Landing, Sign-in)  │
       └────────────────────┘   └────────────────────┘   └─────────────────────┘
```

1. **University Administrator (`admin`):**
   * Manages institutional academic structures: Colleges, Departments/Majors, Master Subject Catalog, and Study Plans.
   * Executes one-click semester launches that generate courses and enroll cohorts.
   * Manages student admissions, faculty appointments, and administrative staff accounts.
   * Monitors campus health telemetry, user activity, and system metrics.

2. **Faculty Member / Instructor (`teacher`):**
   * Builds course syllabi with thematic sections, video lectures, and interactive reading topics.
   * Publishes homework assignments with due dates and attachments.
   * Evaluates student file submissions and provides qualitative feedback.
   * Enters and maintains continuous assessment gradebooks (Coursework, Midterm, Final Exams).
   * Moderates automated course discussion channels.

3. **Student (`student`):**
   * Enjoys automatic class schedule enrollment upon term launch.
   * Streams video lectures, reads interactive topic content, and tracks study time.
   * Submits homework deliverables digitally (PDF/ZIP) with on-time/late tracking.
   * Uses the self-service Add/Drop portal to adjust courses within 12–19 credit-hour limits and prerequisite checks.
   * Tracks real-time grades and reviews official printable transcripts with standard 4.0 SGPA and CGPA calculations.
   * Communicates with instructors and peers via course discussion rooms and direct 1-on-1 messages.

4. **Platform Super Administrator (`super-admin`):**
   * Global platform administrator with multi-university oversight.
   * Provisions new university tenants, manages institutional licenses, and reviews global resource usage.

5. **Public / Prospective Visitor (`guest`):**
   * Browses the public landing page to learn about university faculties and degree programs.
   * Accesses secure login or submits account registration.

---

## 3. User-Perspective Role & Capabilities Matrix

| System Capability                                     | Super Admin  |    University Admin     |  Faculty Member   |           Student           | Public Visitor |
| :---------------------------------------------------- | :----------: | :---------------------: | :---------------: | :-------------------------: | :------------: |
| **University Tenant Provisioning & Licensing**        | Full Control |         Denied          |      Denied       |           Denied            |     Denied     |
| **Colleges, Majors & Curriculum Catalog Setup**       | Full Control | Full Control (Own Univ) |     View Only     |          View Only          |     Denied     |
| **Study Plan Templates (Levels 1–N)**                 | Full Control | Full Control (Own Univ) |     View Only     |          View Only          |     Denied     |
| **One-Click Cohort Semester Launch**                  | Full Control | Full Control (Own Univ) |      Denied       |           Denied            |     Denied     |
| **Semester Conclude & Delete Lifecycle**              | Full Control | Full Control (Own Univ) |      Denied       |           Denied            |     Denied     |
| **User Admissions & Faculty Recruitment**             | Full Control | Full Control (Own Univ) |      Denied       |           Denied            |     Denied     |
| **System Governance & Activity Metrics**              | Cross-Tenant |    Campus Dashboard     |      Denied       |           Denied            |     Denied     |
| **Course Syllabus & Lesson Authoring (LMS)**          | Full Control |    Campus Oversight     | Assigned Courses  |          View Only          |     Denied     |
| **Course File & Supplemental Materials Library**      | Full Control |    Campus Oversight     | Assigned Courses  |        Download Only        |     Denied     |
| **Assignment Publishing & Submission Grading**        | Full Control |    Campus Oversight     | Assigned Courses  |           Denied            |     Denied     |
| **Student Homework Deliverable Submission**           |    Denied    |         Denied          |      Denied       |        Enrolled Only        |     Denied     |
| **Continuous Assessment Gradebook Entry**             | Full Control |    Campus Oversight     | Assigned Courses  |           Denied            |     Denied     |
| **Real-Time Grade Inspection**                        | Full Control |    Campus Oversight     | Assigned Courses  |          Self Only          |     Denied     |
| **Course Schedule & Drop Portal (Self-Add Disabled)** |    Denied    |     Override Access     |      Denied       | Active Students (Drop Only) |     Denied     |
| **Official Printable Academic Transcript**            | Full Control |       Any Student       | Assigned Students |          Self Only          |     Denied     |
| **Course Discussion Channels**                        | Full Control |    Campus Moderation    |  Assigned Rooms   |       Enrolled Rooms        |     Denied     |
| **Direct 1-on-1 Private Messaging**                   |  Available   |        Available        |     Available     |          Available          |     Denied     |
| **In-App Notification Center**                        |  Available   |        Available        |     Available     |          Available          |     Denied     |
| **Profile & Password Self-Update**                    |  Self Only   |        Self Only        |     Self Only     |          Self Only          |     Denied     |
| **Public Landing Page & Authentication**              |  Available   |        Available        |     Available     |          Available          |      Open      |

---

## 4. Detailed Functional Requirements (User Perspective)

---

### Module 1: Institutional Governance & Multi-Tenancy

#### REQ-GOV-001: Multi-Tenant University Provisioning
* **User Persona:** Super Administrator (`super-admin`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As a platform super administrator, I want to register and provision new universities with their formal title, institutional code, and primary administrative contact (auto-generating secure initial credentials), so that independent universities operate in completely isolated virtual environments, while allowing super administrators to toggle suspension and switch tenant context on-the-fly.
* **User Experience & Business Rules:**
  1. The Super Admin accesses a dedicated "University Management" portal (`/universities`).
  2. The Super Admin creates a university profile specifying Name, Code, Chief Administrator Name, and Chief Administrator Email.
  3. The system executes an atomic transaction creating the `University` container and the primary `admin` user, issuing and revealing a temporary password.
  4. The Super Admin can monitor institutional telemetry (counts of colleges, majors, courses, faculty, and students).
  5. The Super Admin can suspend/activate universities (suspension immediately denies login to all non-super-admin users of that university).
  6. The Super Admin can switch active university context via the navigation bar to inspect any university's workspace as an administrator.

#### REQ-GOV-002: System Telemetry & Administrative Health Dashboard
* **User Persona:** University Administrator (`admin`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As a university administrator, I want to monitor real-time institutional metrics and server health on my dashboard so that I have complete visibility over platform adoption and operational stability.
* **User Experience & Business Rules:**
  1. Displays summary metric cards: Total Colleges, Total Academic Majors, Total Open Courses, Active Faculty Members, and Enrolled Students.
  2. Displays real-time server health widgets showing CPU utilization percentage, available RAM, and server uptime.
  3. Displays active user counts (users active within the last 5 minutes) and login trends over the preceding 3 days.

#### REQ-GOV-003: Searchable Security Audit Trail Viewer
* **User Persona:** University Administrator (`admin`), Super Administrator
* **Status:** `[Status: Planned / Next for Implementation]`
* **User Story:** As an administrator, I want to inspect a searchable, filterable audit log of administrative actions so that I can trace operational changes (term launches, user deletions, grade changes) for accountability and security.
* **User Experience & Business Rules:**
  1. The administrator navigates to an "Audit Logs" screen.
  2. A chronological table displays: Date/Time, Actor Name, Role, Action Performed (e.g., "Term Launched", "Course Deleted", "User Created"), IP Address, and Operational Notes.
  3. The administrator can filter logs by date range, action type, or user.

---

### Module 2: Academic Curriculum & Catalog Architecture

#### REQ-CUR-001: College / Faculty Administration
* **User Persona:** University Administrator (`admin`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As a university administrator, I want to create and manage academic colleges (e.g., College of Engineering) and define their total graduation semesters, so that degree programs are properly housed.
* **User Experience & Business Rules:**
  1. Admin can add, edit, view, and delete colleges.
  2. Each college records: Name, Description, and Program Length in semesters (e.g., 8 or 10 semesters).
  3. Deletion safeguard: The system warns the administrator and prevents accidental deletion if academic majors are actively housed in that college.

#### REQ-CUR-002: Academic Major / Department Setup
* **User Persona:** University Administrator (`admin`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As a university administrator, I want to establish academic majors within each college so that matriculated students follow a structured program of study.
* **User Experience & Business Rules:**
  1. Admin creates a major linked to a parent college, specifying Major Title and Department Description.
  2. The major maintains the directory of enrolled students and active study plan templates.
  3. The system allows filtering subjects and semesters by academic major.

#### REQ-CUR-003: Master Catalog Subjects Blueprint
* **User Persona:** University Administrator (`admin`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an administrator, I want to maintain a master catalog of academic subjects with course codes, credit hours, prerequisites, and standard grading schemes, so that operational term courses can be consistently spawned from verified academic blueprints.
* **User Experience & Business Rules:**
  1. Admin adds master subjects specifying:
     * Subject Title and Standard Catalog Code (e.g., "SWE201", "Introduction to Software Engineering").
     * Credit Hours (weighted units between 1 and 10, typically 3 hours).
     * Prerequisite Subjects: Admin can select one or more prerequisite subjects from the catalog that a student must complete before taking this subject.
     * Default Assessment Breakdown (Grade Schema): Default maximum points for Coursework (20 pts), Midterm Exam (30 pts), and Final Exam (50 pts), summing to 100 points.
  2. Catalog subjects remain permanent institutional blueprints; active course offerings are instantiated from them each term.

#### REQ-CUR-004: Sequential Level Study Plan Templates (`SemesterTemplate`)
* **User Persona:** University Administrator (`admin`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an administrator, I want to organize each major's curriculum into ordered academic levels (Level 1, Level 2, up to Level $N$) with prescribed core subjects, so that students can be enrolled automatically according to their study plan.
* **User Experience & Business Rules:**
  1. Each major maintains study plan templates indexed strictly from Level 1 up to the program maximum.
  2. Sequence Integrity: Level indices must start at 1, cannot be duplicated within the same major, and cannot have missing gaps (e.g., Level 2 cannot exist without Level 1). Deleting a level automatically re-sequences subsequent levels.
  3. Admin assigns master catalog subjects to each level template.
  4. All prescribed subjects in a template represent mandatory degree requirements contributing to graduation credits and GPA.

---

### Module 3: Semester Lifecycle & Automated Enrollment Engine

#### REQ-SEM-001: Automated Cohort Semester Launch
* **User Persona:** University Administrator (`admin`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an administrator, I want to launch an academic term by selecting majors and levels, so that the system automatically instantiates courses, assigns faculty, enrolls eligible students, initializes gradebooks, and creates course chat rooms in a single streamlined action.
* **User Experience & Business Rules:**
  1. **Launch Wizard Interface:**
     * Admin enters term details: Term Label (e.g., "Fall 2026/2027"), Start Date, End Date, and Add/Drop Deadline.
     * Admin selects the target Academic Major(s).
     * Admin chooses whether to launch **"All Levels"** or select specific levels (e.g., Level 1 and Level 3).
     * Admin can inspect prescribed subjects and optionally customize which subjects are offered for that term.
  2. **Automated Atomic Enrollment Execution:**
     * The system creates the active Semester record.
     * Instantiates active Course Offerings from the catalog subjects, linking designated instructors.
     * Identifies all students enrolled in that major whose incoming semester matches the template level index.
     * Enrolls the student cohort directly into the active courses.
     * Advances each student's incoming semester counter by +1.
     * Initializes blank Grade records linked to each student and course.
     * Provisions dedicated Course Discussion Rooms with the instructor as group admin and students as members.
  3. **Operational Safeguards:**
     * Prevents launching any level that has **0 eligible students** registered in the major.
     * Prevents launching any level that has **0 assigned subjects**.

#### REQ-SEM-002: Prerequisite Validation During Cohort Launch
* **User Persona:** University Administrator (`admin`)
* **Status:** `[Status: Planned / Next for Implementation]`
* **User Story:** As an administrator, when launching a cohort semester, I want the system to flag students who failed a required prerequisite in the preceding term, so that academic advisors can intervene or hold advance registrations.
* **User Experience & Business Rules:**
  1. During term launch, the system checks whether enrolled students have passed (Grade $\ge 60\%$) all prerequisites for the spawned courses.
  2. Students with missing prerequisites are either flagged with an "Academic Prerequisite Hold" on that specific course or presented in an administrative review modal before final launch confirmation.

#### REQ-SEM-003: Semester Conclude & Deletion Safeguards
* **User Persona:** University Administrator (`admin`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an administrator, I want to finalize an active semester upon completion of final exams, or safely delete a term if entered in error.
* **User Experience & Business Rules:**
  1. **Conclude Semester:** Admin marks the semester as concluded. This locks the term, releases the study plan template from active status, and freezes further grade modifications.
  2. **Delete Semester Safeguard:** Deleting a semester safely rolls back student enrollment records, deletes course offerings, and cleans up linked sections and grades.

#### REQ-SEM-004: Student Course Schedule & Drop Portal (Self-Addition Disabled)
* **User Persona:** Student (`student`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an enrolled student, during the active enrollment window, I want to review my auto-enrolled semester courses and have the ability to drop an unwanted course (provided my load remains $\ge 12$ credit hours), while the ability to manually add courses for myself is disabled and handled exclusively through semester launch.
* **User Experience & Business Rules:**
  1. **Course Assignment Exclusivity:** Course enrollment is performed exclusively by the university administration upon semester launch (`startSemesterService`) according to the student's major and academic level template. Manual self-registration by students is disabled.
  2. **Browse-Only Semester Catalog:** Students can explore the catalog of courses offered in the active semester in view-only mode to inspect descriptions, syllabi, instructors, and prerequisites. The registration action is disabled with an explanatory notice: *"Course registration is performed automatically upon semester launch according to your study plan. Self-addition is currently disabled."*
  3. **Course Dropping Rules:**
     * The student can drop a course only while the current date is before the semester's defined `addDropDeadline`.
     * **Minimum Load: 12 Credit Hours.** A student cannot drop a course if their remaining registered load would fall below 12 credit hours.
     * Dropping a course removes it from the student's active schedule, cleans up the unearned grade record, and removes the student from the course chat room.

---

### Module 4: Digital Course Delivery & Learning Management (LMS)

#### REQ-LMS-001: Course Overview & Media Customization
* **User Persona:** Faculty Member (`teacher`), University Admin
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an instructor, I want to customize my course overview, write learning objectives, specify requirements, and upload a cover banner, so that enrolled students have a clear understanding of expectations.
* **User Experience & Business Rules:**
  1. Instructors can edit Course Description, Learning Outcomes ("What you will learn"), and Prerequisites/Requirements.
  2. Instructors can upload high-resolution image cover banners that display on student course cards.

#### REQ-LMS-002: Modular Syllabus Authoring (Sections & Lessons)
* **User Persona:** Faculty Member (`teacher`), Student (`student`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an instructor, I want to organize my course into thematic units (Sections) containing lectures (Lessons), so that students can navigate and study course material sequentially.
* **User Experience & Business Rules:**
  1. **Thematic Sections:** Instructors create ordered sections (e.g., "Unit 1: Fundamentals of Database Design").
  2. **Lectures / Lessons:** Within any section, instructors can add lessons of two types:
     * **Video Lecture:** Video media streaming URL with estimated watch duration in minutes.
     * **Interactive Reading Topic:** Formatted rich-text explanation with estimated reading time.
  3. **Study Time Aggregation:** The system automatically sums lesson times to display total estimated study duration per section and for the entire course.
  4. **Empty State Handling:** When a course has no sections yet, the UI displays a clean empty state with an "Add New Section" prompt without crashing or displaying errors.

#### REQ-LMS-003: Student Lecture Consumption & Video Player
* **User Persona:** Student (`student`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As a student, I want to watch video lectures and read interactive topics within a dedicated distraction-free viewer, so that I can study my curriculum online.
* **User Experience & Business Rules:**
  1. Students open a course to view the syllabus table of contents with badges indicating available video or text content.
  2. Selecting a lesson opens the dedicated lesson viewer with responsive video playback, full-screen options, and rich formatted text.

#### REQ-LMS-004: Standalone Course File & Materials Library
* **User Persona:** Faculty Member (`teacher`), Student (`student`)
* **Status:** `[Status: Planned / Next for Implementation]`
* **User Story:** As an instructor, I want a dedicated "Course Materials" repository tab to upload lecture slide decks, syllabus PDFs, and reference papers for student download, without having to frame them as assignments.
* **User Experience & Business Rules:**
  1. Instructors can upload reference files (PDF, PPTX, DOCX, ZIP) with a title and optional description.
  2. Students can view, search, and download reference materials directly from the course interface.

---

### Module 5: Coursework & Assignment Hub

#### REQ-ASG-001: Assignment Publishing
* **User Persona:** Faculty Member (`teacher`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an instructor, I want to publish homework assignments with titles, instructions, deadlines, maximum points, and attachment rubrics, so that students understand what deliverables are expected.
* **User Experience & Business Rules:**
  1. The instructor opens the course "Assignments & Tasks" tab.
  2. Creates an assignment specifying: Title, Detailed Instructions, Due Date & Time, Maximum Score (default 100), and optional rubric/starter file attachment.
  3. The assignment becomes immediately visible on all enrolled students' course dashboards.

#### REQ-ASG-002: Student Deliverable Submission
* **User Persona:** Student (`student`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As a student, I want to upload my completed homework deliverable and write notes to my instructor, with clear confirmation of whether my submission was on time.
* **User Experience & Business Rules:**
  1. Students view the assignment deadline and instructions.
  2. Students upload their deliverable file (PDF, ZIP, DOCX, etc.) and can add optional submission notes or web links.
  3. **Late Tracking:** If submitted past the deadline, the system automatically marks the submission as **"Late"** (متأخر) with an amber badge.
  4. Students can re-submit an updated file anytime prior to the instructor grading the task.

#### REQ-ASG-003: Faculty Submission Evaluation & Feedback
* **User Persona:** Faculty Member (`teacher`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an instructor, I want to review submitted student files, assign scores within the maximum points limit, and provide qualitative feedback comments.
* **User Experience & Business Rules:**
  1. The instructor opens an assignment to view the submission roster showing student names, submission timestamps, on-time/late flags, and file download links.
  2. The instructor enters an awarded numerical score (validated between 0 and maximum points) and optional written feedback.
  3. The submission status updates to **"Graded"**, and the student is immediately able to view their score and instructor comments.

---

### Module 6: Continuous Assessment & Academic Records (SIS)

#### REQ-SIS-001: Continuous Assessment Gradebook
* **User Persona:** Faculty Member (`teacher`), University Admin
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an instructor, I want to maintain a tabular gradebook for my enrolled course, entering marks for coursework, midterm, and final exams, with automatic total and percentage calculations.
* **User Experience & Business Rules:**
  1. The instructor accesses the course "Gradebook" interface.
  2. A roster table displays all enrolled students and score columns corresponding to the course schema (e.g., Coursework max 20, Midterm max 30, Final Exam max 50).
  3. The system enforces maximum allowed points per column and prevents entering negative or out-of-range values.
  4. Upon saving, the system preserves individual component marks and automatically recalculates the student's Total Score (0–100) and Percentage.

#### REQ-SIS-002: Real-Time Student Grade Tracking
* **User Persona:** Student (`student`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As a student, I want to inspect my current grades for all enrolled courses so that I can monitor my academic standing throughout the semester.
* **User Experience & Business Rules:**
  1. Students navigate to the "Grades" portal.
  2. Displays course cards showing the breakdown of earned marks (Coursework, Midterm, Final), cumulative percentage, and letter grade equivalents.

#### REQ-SIS-003: Standard 4.0 GPA Calculation Engine
* **User Persona:** Student (`student`), University Admin
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As a student and registrar, I want the system to compute standardized 4.0 Semester GPA (SGPA) and career Cumulative GPA (CGPA) based on official percentage scales, so that academic performance is universally recognized.
* **User Experience & Business Rules:**
  1. **Grading Scale Conversion:**
     * **95–100%:** A+ (4.00 Grade Points) — Excellent / Passed
     * **90–94%:** A (3.75 Grade Points) — Passed
     * **85–89%:** B+ (3.50 Grade Points) — Passed
     * **80–84%:** B (3.00 Grade Points) — Passed
     * **75–79%:** C+ (2.50 Grade Points) — Passed
     * **70–74%:** C (2.00 Grade Points) — Passed
     * **65–69%:** D+ (1.50 Grade Points) — Passed
     * **60–64%:** D (1.00 Grade Points) — Minimum Passing
     * **0–59%:** F (0.00 Grade Points) — Failed
  2. **Formulas:**
     * $\text{Quality Points} = \text{Grade Points} \times \text{Course Credit Hours}$
     * $\text{Semester GPA (SGPA)} = \frac{\sum \text{Quality Points in Semester}}{\sum \text{Attempted Credits in Semester}}$
     * $\text{Cumulative GPA (CGPA)} = \frac{\sum \text{Quality Points across All Semesters}}{\sum \text{Attempted Credits across All Semesters}}$
  3. **Academic Standings:**
     * $\text{CGPA} \ge 3.50$: **First Class Honors (امتياز)**
     * $3.00 \le \text{CGPA} < 3.50$: **Very Good (جيد جداً)**
     * $2.00 \le \text{CGPA} < 3.00$: **Good Standing (جيد)**
     * $\text{CGPA} < 2.00$: **Academic Probation (تحت الملاحظة الأكاديمية)**
  4. **Failed Courses:** A failed course contributes 0 quality points; its credit hours are included in attempted hours, counting against SGPA and CGPA.

#### REQ-SIS-004: Academic Probation Load Restrictions
* **User Persona:** Student (`student`), University Admin
* **Status:** `[Status: Planned / Next for Implementation]`
* **User Story:** As an academic registrar, I want students placed on Academic Probation (CGPA < 2.0) to have their maximum registered credit hours automatically capped at 12–14 hours, so that they can concentrate on improving their grades.
* **User Experience & Business Rules:**
  1. When a student's CGPA drops below 2.0, their Add/Drop maximum load limit is dynamically reduced from 19 hours to 14 hours.
  2. The student receives a prominent banner advising them to consult their academic advisor.

#### REQ-SIS-005: Official Printable Academic Transcript
* **User Persona:** Student (`student`), University Admin
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As a student or university administrator, I want to generate and print an official academic transcript showing chronological semesters, course details, term SGPAs, career CGPA, and institutional stamps, formatted cleanly for paper printing.
* **User Experience & Business Rules:**
  1. Displays student demographic data: Full Name, Student ID, College, Major, Admission Date, and Graduation/Academic Standing.
  2. Presents a chronological table for every enrolled semester listing: Course Code, Course Title, Credit Hours, Percentage Score, Letter Grade, Grade Points, and Total Quality Points.
  3. Summarizes each term: Attempted Credits, Earned Credits, and Term SGPA.
  4. Summarizes career total: Total Earned Credits, Total Quality Points, and Cumulative CGPA.
  5. **High-Fidelity Paper Printing:** Optimized with print formatting (`@media print`) that removes browser navigation bars and renders official university header, watermark, registrar signature block, and official stamp box.

---

### Module 7: Campus Collaboration & Communication

#### REQ-COM-001: Automated Course Discussion Channels
* **User Persona:** Faculty Member (`teacher`), Student (`student`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an instructor and enrolled student, I want a dedicated discussion room automatically created for each course offering, so that we can communicate about lectures and coursework.
* **User Experience & Business Rules:**
  1. Room is created automatically upon semester launch with the course title and section.
  2. Instructor is designated as channel administrator.
  3. Student roster is synchronized automatically: students adding the course gain access, students dropping lose access.
  4. Supports real-time text exchange, timestamps, and sender identification.

#### REQ-COM-002: Direct 1-on-1 Private Messaging
* **User Persona:** All Authenticated Users
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As a student or faculty member, I want to initiate private direct conversations with peers and professors, so that we can discuss academic topics privately.
* **User Experience & Business Rules:**
  1. Users can search for university members by name and start a direct conversation.
  2. Provides real-time message delivery, conversation history, and unread indicators.

#### REQ-COM-003: Persistent In-App Notification Center
* **User Persona:** All Authenticated Users
* **Status:** `[Status: Planned / Next for Implementation]`
* **User Story:** As a student or professor, I want an in-app notification center (bell icon) with an unread badge counter, so that I can track assignment deadlines, graded homework, and term announcements even if I missed the immediate screen popup.
* **User Experience & Business Rules:**
  1. A bell icon in the top navigation bar displays a badge with the count of unread notifications.
  2. Clicking the bell opens a dropdown list of recent events (e.g., *"Instructor Faisal posted Homework 2"*, *"Your submission was graded: 18/20"*, *"Add/Drop window closes in 24 hours"*).
  3. Clicking a notification navigates directly to the relevant course, assignment, or gradebook page and marks the notification as read.

---

### Module 8: Identity, Admissions & Access Administration

#### REQ-IDN-001: Student Admissions & Matriculation
* **User Persona:** University Administrator (`admin`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an admissions administrator, I want to register incoming students, assign them to their degree major, and set their initial academic level, so that they are recognized in cohort launches.
* **User Experience & Business Rules:**
  1. Admin enters Student Name, Email, Contact Phone, and selects Degree Major.
  2. Sets Incoming Semester Level (defaults to Level 1).
  3. The system generates secure temporary credentials and dispatches an automated welcome email.

#### REQ-IDN-002: Faculty Appointments & Subject Assignments
* **User Persona:** University Administrator (`admin`)
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As an administrator, I want to recruit faculty members, record their academic title and specialization, and assign them to departments and courses.
* **User Experience & Business Rules:**
  1. Admin creates faculty account with Name, Academic Title (e.g., Dr., Prof., Eng.), Specialization, and Email.
  2. Admin assigns faculty to catalog subjects or specific course offerings.

#### REQ-IDN-003: Secure Authentication & Self-Profile Update
* **User Persona:** All Users
* **Status:** `[Status: Implemented & Verified]`
* **User Story:** As any platform user, I want to log in securely, update my profile details, upload an avatar, and change my password.
* **User Experience & Business Rules:**
  1. Secure authentication verifying registered email and password.
  2. Profile screen allows updating First Name, Last Name, Phone Number, and uploading a Profile Avatar image.
  3. Secure password change requiring confirmation of current password.
  4. Role integrity: Non-admin users cannot alter their own role, student ID, or major.

---

## 5. Non-Functional Requirements (User Experience & System Quality)

### 5.1 Usability & Localization (Arabic-First RTL)
* **NFR-USE-001 (Arabic-First Experience):** The user interface must render natively in Right-to-Left (RTL) orientation using modern Arabic typography (Google Cairo font). All academic terms (الكليات, التخصصات, المواد, الخطة الدراسية, الحذف والإضافة, السجل الأكاديمي) must align with standard higher education terminology.
* **NFR-USE-002 (Visual Excellence & Responsive Design):** The interface must support full desktop, tablet, and mobile responsiveness. It must offer both sleek Dark Mode and clean Light Mode with high contrast and smooth state transitions.
* **NFR-USE-003 (Clarity & Feedback):** Every user action (saving grades, adding courses, submitting homework) must provide immediate visual feedback (loading spinners on buttons, affirmative green success banners, or clear error explanations).

### 5.2 Reliability & Operational Integrity
* **NFR-REL-001 (Atomic Term Launch):** Semester launching must execute as a single all-or-nothing operation. If any student or course enrollment encounters an issue, the entire operation must roll back cleanly so that no half-created semesters exist.
* **NFR-REL-002 (Data Cascading Safety):** Deleting a course or semester must cleanly detach or purge linked sections, homework submissions, and grade entries, preventing orphaned records.

### 5.3 Performance & Responsiveness
* **NFR-PER-001 (Fast Page Rendering):** Catalog listings (students, courses, subjects) must support paginated loading (20–50 items per page) so that screens render under 500ms even with thousands of institutional records.
* **NFR-PER-002 (Real-Time Communication):** Course chat and direct messages must deliver instantaneously without requiring manual browser refreshes.

### 5.4 Privacy & Data Security
* **NFR-SEC-001 (Tenant Data Isolation):** Users belonging to one university must never view, query, or interact with records, courses, or users of another university.
* **NFR-SEC-002 (Role Access Enforcement):** Students can never alter course syllabus materials or other students' grades; faculty can only grade courses they are actively assigned to teach.
* **NFR-SEC-003 (Credential Security):** Passwords must be strongly encrypted. Sessions must be securely protected against unauthorized hijacking.

---

## 6. Implementation & Roadmap Summary

To provide clear visibility for the next implementation steps, the table below maps all functional capabilities by operational readiness:

| Requirement ID | Functional Capability | User Persona | Operational Status |
| :--- | :--- | :--- | :---: |
| **REQ-CUR-001** | College & Faculty Administration | University Admin | ✅ **Implemented & Verified** |
| **REQ-CUR-002** | Academic Major / Department Setup | University Admin | ✅ **Implemented & Verified** |
| **REQ-CUR-003** | Master Subject Catalog & Prerequisites | University Admin | ✅ **Implemented & Verified** |
| **REQ-CUR-004** | Sequential Study Plan Templates (1..N) | University Admin | ✅ **Implemented & Verified** |
| **REQ-SEM-001** | Automated Cohort Semester Launch | University Admin | ✅ **Implemented & Verified** |
| **REQ-SEM-003** | Semester Conclude & Safe Deletion | University Admin | ✅ **Implemented & Verified** |
| **REQ-SEM-004** | Course Schedule & Drop Portal (Self-Add Disabled) | Student | ✅ **Implemented & Verified** |
| **REQ-LMS-001** | Course Overview & Media Cover Banner | Faculty Member | ✅ **Implemented & Verified** |
| **REQ-LMS-002** | Syllabus Thematic Sections & Lessons | Faculty Member | ✅ **Implemented & Verified** |
| **REQ-LMS-003** | Student Lecture Streaming & Viewer | Student | ✅ **Implemented & Verified** |
| **REQ-ASG-001** | Assignment Publishing with Due Dates | Faculty Member | ✅ **Implemented & Verified** |
| **REQ-ASG-002** | Student Homework Deliverable Upload | Student | ✅ **Implemented & Verified** |
| **REQ-ASG-003** | Faculty Homework Review & Feedback | Faculty Member | ✅ **Implemented & Verified** |
| **REQ-SIS-001** | Continuous Assessment Gradebook Grid | Faculty Member | ✅ **Implemented & Verified** |
| **REQ-SIS-002** | Real-Time Student Grade Dashboard | Student | ✅ **Implemented & Verified** |
| **REQ-SIS-003** | Standard 4.0 SGPA & CGPA Engine | Student / Admin | ✅ **Implemented & Verified** |
| **REQ-SIS-005** | Official Printable Academic Transcript | Student / Admin | ✅ **Implemented & Verified** |
| **REQ-COM-001** | Automated Course Discussion Rooms | Faculty & Student | ✅ **Implemented & Verified** |
| **REQ-COM-002** | 1-on-1 Direct Messaging | All Users | ✅ **Implemented & Verified** |
| **REQ-IDN-001** | Student Admissions & Level Assignment | University Admin | ✅ **Implemented & Verified** |
| **REQ-IDN-002** | Faculty Recruitment & Specialization | University Admin | ✅ **Implemented & Verified** |
| **REQ-IDN-003** | Profile & Password Self-Management | All Users | ✅ **Implemented & Verified** |
| **REQ-GOV-002** | Administrative Telemetry & Health Dashboard | University Admin | ✅ **Implemented & Verified** |
| **REQ-GOV-001** | Multi-Tenant University Provisioning Portal | Super Admin | ✅ **Implemented & Verified** |
| **REQ-SEM-002** | Prerequisite Check on Cohort Launch | University Admin | 🚀 **Planned Next for Implementation** |
| **REQ-COM-003** | Persistent In-App Notification Center | All Users | 🚀 **Planned Next for Implementation** |
| **REQ-LMS-004** | Course General Resource & File Library | Faculty & Student | 🚀 **Planned Next for Implementation** |
| **REQ-SIS-004** | Academic Probation Credit-Hour Caps | Student & Admin | 🚀 **Planned Next for Implementation** |
| **REQ-GOV-003** | Searchable Administrative Audit Log Viewer | University Admin | 🚀 **Planned Next for Implementation** |

---
*End of Software Requirements Specification (SRS) - Gahbaz Higher Education Platform (Version 2.0.0)*
