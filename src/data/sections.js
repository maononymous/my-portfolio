// src/data/sections.js

const sections = [
  {
    id: 'about',
    title: 'Abdullah Omer Mohammed',
    subtitle: 'Curious Developer | Creative Technologist',
    planetId: 0,
    dnaContent: `My name is Abdullah Omer Mohammed. I am currently pursuing my Master's degree in Computer Science at DePaul University, Chicago. I work as a Program Assistant for the Continuing and Professional Education Department. I love nature, mathematics, photography, and I'm passionate about iOS development. I'm always up for brainstorming app ideas and talking about programming, DSA, or algorithms. Fun fact: I'm an art enthusiast who enjoys cooking and staying fit.`,
    planetContent: `Academically, I specialize in iOS development and Swift-based tooling. I currently manage multiple Swift/SwiftUI projects, and my work includes structured backend integrations, modular architecture, and API-driven mobile UIs. I balance hands-on development with user-centric design, and my assistantship at DePaul includes workflow management and stakeholder coordination.`,
  },
  {
    id: 'bachelor',
    title: 'Bachelor of Engineering (B.E.) in Computer Science and Engineering',
    subtitle: 'Osmania University | GPA: 7.43/10 | Aug 2018 - May 2022',
    planetId: 1,
    dnaContent: `I discovered my love for building and coding during these four years. I was active in campus events, organized tech fests, and designed social media promotions as part of Matrusri Campus Connect.`,
    planetContent: `Worked with Java, C++, Python, and focused on Data Structures and Algorithms. Built Java-based applications integrated with RESTful APIs and SQL databases. Explored frameworks like Spring MVC and React.js.`,
  },
  {
    id: 'apror',
    title: 'APROR',
    subtitle: 'Team-based exploration and prototyping | Dec 2018 - Hyderabad',
    planetId: 2,
    dnaContent: `A team of 5 friends driven by curiosity and caffeine. We prototyped, built, and pitched ideas through countless hackathons. Our weekends were full of debates, prototypes, and learning.`,
    planetContent: `Contributed to backend and logic-heavy tasks using Java, JavaScript, SQL, and C#. Tools included Arduino, Figma, and IDEs. We consistently delivered full-stack builds for hackathons.`,
  },
  {
    id: 'minipro',
    title: 'Speed Limit Assistant',
    subtitle: 'Speed Monitoring Mobile App <br>June 2020 - August 2020',
    planetId: 3,
    dnaContent: `Speed Limit Assistant was a three-member group project we built during our undergrad, aimed at helping drivers stay within speed limits. The app would turn red and alert the user if they were going faster than allowed on the current street. We used real-time GPS data to track location and pulled street-wise speed limits using HereMap APIs. It was one of those classic "simple but smart" ideas: practical, intuitive, and kind of thrilling to build. I primarily handled the logic and backend work, but we all pitched in across the board, from frontend tweaks to prepping for the final deme.`,
    planetContent: `Speed Limit Assistant was a mobile application developed in Android Studio to promote safer driving habits through real-time speed monitoring. The app utilized the device's <a href="#!" class="skill" data-skill="GPS">GPS</a> to detect the user's current location, and the <a href="#!" class="skill" data-skill="HereMap API">HereMap API</a> to fetch the legal speed limit for that specific street. It then compared that limit against the user's actual speed, calculated via the phone's accelerometer and location data. I was responsible for implementing the backend logic, handling sensor input, API calls, and trigger conditions and contributed to the UI integration logic as well. The app included a live map view and visual alert system that turned the screen red when the driver exceeded the limit.`,
  },
  {
    id: 'sfuit',
    title: 'SfUIT',
    subtitle: 'Assistive Technology Summit | Telangana State Innovation Cell <br>November 2021 - January 2022 | Hyderabad, India',
    planetId: 4,
    dnaContent: `SfUIT (pronounced “Suit”) was our first recognized project under APROR, and our proudest one. It was a smart wearable designed to monitor health vitals and assist users during emergencies. We poured everything into it, from sensor logic and app development to editing pitch videos at 2AM. It all paid off at the Assistive Technology Summit, where we showcased it in front of prominent figures from the Telangana Government. Winning 2nd prize and a ₹150,000 award felt surreal, not just for the money, but for the validation that we could actually build something that mattered.`,
    planetContent: `SfUIT (Smart fabricia Using Internet of Things) was a health-monitoring wearable IoT solution built using an <a href="#!" class="skill" data-skill="ESP32">ESP32</a> microcontroller and multiple sensors to capture heartbeat, oxygen saturation, body temperature, altitude, and fall detection. I worked on writing the embedded logic in <a href="#!" class="skill" data-skill="C#">C#</a> for real-time data collection and signal processing. The device was connected to a responsive web app (built using <a href="#!" class="skill" data-skill="React.js">React.js</a>) and a companion mobile app (developed using Android Studio), both of which allowed users, caretakers, or doctors to monitor vitals in real time. The system also had a built-in emergency trigger that alerted caretakers and pinged emergency services with the user's live location. I contributed across the stack, from ensuring sensor accuracy to backend integrations, pitch decks, and demo preparations. It was a complete all-hands-on-deck sprint, and our first taste of building end-to-end, human-centric tech.`,
  },
  {
    id: 'playerorbit',
    title: 'Player Orbit',
    subtitle: 'Backend Developer Intern <br>January 2022 - March 2022 | Hyderabad, India',
    planetId: 5,
    dnaContent: `Player Orbit was a young company trying to bring structure and learning to gaming, a rare blend in India's digital space. Their focus started with gaming content and slowly shifted to educational gameplay, especially chess for kids. I interned as a backend developer during their initial phase, working alongside their core team. It was my first experience collaborating in a professional setup, and it gave me solid exposure to real-world systems and workflows, beyond what textbooks ever taught.`,
    planetContent: `During my internship at Player Orbit, I contributed to backend microservices for user authentication and session management. I was part of a team responsible for designing and implementing the login service and user database schema. We explored secure login flows using <a href="#!" class="skill" data-skill="OAuth2.0">OAuth2.0</a> and worked on structuring scalable data models for future feature integration. The stack involved core backend principles like API design, access control, and service decoupling, and gave me practical insight into production-ready backend architecture.`,
  },
  {
    id: 'finpro',
    title: 'Anonymous Data Sharing Scheme',
    subtitle: 'Medical Data Sharing System using Diffie-Hellman Algorithm <br>March 2022 - April 2022',
    planetId: 1,
    dnaContent: `This was our final semester academic project, where we explored how sensitive data can be securely shared over public communication networks. We used the example of medical data, patient vitals, in this case, to demonstrate the concept. Our three-person group followed the same dynamic as before: I worked on the logic and backend, while the others handled frontend and presentation. It was a challenging yet satisfying experience to apply cryptographic theory in a real-world use case and actually see it working.`,
    planetContent: `We developed a secure medical data sharing system by implementing the <a href="#!" class="skill" data-skill="Diffie-Hellman Algorithm">Diffie-Hellman Algorithm</a> to demonstrate secure key exchange over public channels. The project included a basic UI for input/output demonstration, but my primary contributions were focused on the backend logic for encryption, data transfer protocols, and ensuring accurate key computation. The system allowed encrypted exchange of patient vitals between two simulated endpoints, ensuring that the actual data remained unreadable without access to the negotiated secret key. This project strengthened my understanding of secure communication protocols and gave me hands-on experience with privacy-focused system design.`,
  },
  {
    id: 'abdulbari1',
    title: 'Abdul Bari Pvt Ltd',
    subtitle: 'Software Developer <br>April 2022 - December 2023 | Hyderabad, India',
    planetId: 3,
    dnaContent: `Abdul Bari Pvt Ltd is an edtech company known for its high-quality programming courses in subjects like DSA, Java, and Python. I worked full-time as a software developer, contributing to build and maintain the company's learning platform. My time there was packed with real-world problem-solving, from improving how students interact with the course content to enabling secure payments and helping the platform scale smoothly as users grew.`,
    planetContent: `At Abdul Bari Pvt Ltd, I helped design and build a scalable <a href="#!" class="skill" data-skill="Learning Management System">Learning Management System (LMS)</a> that served over 1,000 active users. I led the frontend development using <a href="#!" class="skill" data-skill="HTML">HTML</a>, <a href="#!" class="skill" data-skill="CSS">CSS</a>, and <a href="#!" class="skill" data-skill="JavaScript">JavaScript</a>, focusing on clean UI and responsive design, which led to a measurable boost in user engagement. I also implemented secure online payments using the <a href="#!" class="skill" data-skill="Stripe API">Stripe API</a>, integrating it with course access logic and transaction verification flows. This role gave me hands-on experience in full-stack development within a fast-growing edtech environment, with the flexibility of remote collaboration.`,
  },
  {
    id: 'abdulbari2',
    title: 'Abdul Bari Pvt Ltd',
    subtitle: 'Course Assistant <br>April 2022 - December 2023 | Hyderabad, India',
    planetId: 5,
    dnaContent: `Alongside my development work, I also served as a course assistant for several online programming courses at Abdul Bari Pvt Ltd, reaching over 380,000 students across platforms like Udemy. I helped with everything from video editing and assignment drafts to resolving student doubts through the Q&A portal. It was fulfilling to be on the academic side of tech, supporting learners directly and playing a small part in their growth.`,
    planetContent: `I co-instructed and supported the delivery of 5+ online programming courses focused on <a href="#!" class="skill" data-skill="Data Structures and Algorithms">Data Structures</a>, <a href="#!" class="skill" data-skill="Java">Java</a>, and <a href="#!" class="skill" data-skill="C++">C++</a>, with a collective reach of over 380,000 enrolled students. My responsibilities included video content refinement, assignment design drafts, and real-time doubt resolution on course Q&A forums. I regularly responded to technical questions, clarified complex concepts, and helped maintain content clarity throughout the courses. This role deepened my communication skills, technical teaching ability, and gave me exposure to the behind-the-scenes rigor of large-scale course creation.`,
  },
  {
    id: 'gate',
    title: 'GATE - General Aptitude Test in Engineering',
    subtitle: 'All India Rank: 200 <br>GATE 2023 | India',
    planetId: 2,
    dnaContent: `I appeared for GATE 2023 (CSE) and secured an All India Rank of 200 out of over 100,000 candidates, in my very first attempt. I gave it my all for 8 months, showing up every day with focus, discipline, and the occasional plate of biryani as fuel. The preparation phase tested more than just technical skills, it taught me how to pace myself, stay consistent, and deal with uncertainty. When the results dropped, it was one of those rare moments that just hit different: loud, quiet, proud, all at once.`,
    planetContent: `I took a full-syllabus approach to GATE preparation, ensuring each subject got the depth and practice it deserved. While <a href="#!" class="skill" data-skill="Engineering Mathematics">Engineering Mathematics</a> and <a href="#!" class="skill" data-skill="General Aptitude">General Aptitude</a> were my natural strengths, I devoted focused effort to subjects like <a href="#!" class="skill" data-skill="Operating Systems">Operating Systems</a>, <a href="#!" class="skill" data-skill="Computer Organization & Architecture">Computer Organization & Architecture</a>, and <a href="#!" class="skill" data-skill="Computer Networks">Computer Networks</a>, which required more revision and layered understanding. I also covered topics like <a href="#!" class="skill" data-skill="Algorithms">Algorithms</a>, <a href="#!" class="skill" data-skill="Data Structures">Data Structures</a>, <a href="#!" class="skill" data-skill="Theory of Computation">Theory of Computation</a>, <a href="#!" class="skill" data-skill="Databases">Databases</a>, and <a href="#!" class="skill" data-skill="Compiler Design">Compiler Design</a> with equal seriousness, ensuring I was confident across the board. Regular mock tests, performance analysis, and timed practice sessions helped me build precision, resilience, and a sense of exam rhythm.`,
  },
  {
    id: 'depaul',
    title: 'Master of Science (M.S.) in Computer Science',
    subtitle: 'DePaul University | Current GPA: 3.87/4 <br>January 2024 - December 2025 | Chicago, IL, USA',
    planetId: 4,
    dnaContent: `DePaul's been nothing short of transformative for me. I came in open-minded and found my creative anchor through the iOS Development courses I took across two quarters. They pushed me to build more, express more, and actually enjoy the process of coding, beyond just solving problems. The city itself feels like the U.S. version of Hyderabad: vibrant, welcoming, and full of character. I love cycling along the Lakefront Trail to campus and work, and the gym and rec center have become part of my rhythm here. The student involvement events on campus are always buzzing with energy, and I try to attend as many as I can. I've found new friends here in Chicago and reconnected with old ones too, which has made the experience all the more meaningful. I've also had the opportunity to serve as a student assistant at the university, which has added a whole new layer to my experience.`,
    planetContent: `My coursework at DePaul has been a mix of systems, application development, and design-focused computing. Along with mobile app development, I've worked with technologies like <a href="#!" class="skill" data-skill="React.js">React.js</a>, <a href="#!" class="skill" data-skill="HTML">HTML</a>, <a href="#!" class="skill" data-skill="CSS">CSS</a>, and <a href="#!" class="skill" data-skill="JavaScript">JavaScript</a> to create responsive frontend interfaces. On the backend side, I've used <a href="#!" class="skill" data-skill="Java">Java</a>, <a href="#!" class="skill" data-skill="Spring MVC">Spring MVC</a>, and <a href="#!" class="skill" data-skill="SQL">SQL</a> to build and connect full-stack applications. I've also taken foundational courses like <a href="#!" class="skill" data-skill="DBMS">DBMS</a>, <a href="#!" class="skill" data-skill="COPL">COPL</a>, and <a href="#!" class="skill" data-skill="Object-Oriented Programming">OOPS</a>, which strengthened my core understanding of design principles and language paradigms. My exposure to <a href="#!" class="skill" data-skill="Human-Computer Interaction">HCI</a> and <a href="#!" class="skill" data-skill="Agile Development">Agile Development</a> has helped me view software through a more user-centered, iterative lens, balancing functionality with usability and workflow.`,
  },
  {
    id: 'oopj1',
    title: 'Car Rental System',
    subtitle: 'A Java and SQL based system for operating and maintaining a Car Rental Company <br>April 2024 - May 2024',
    planetId: 3,
    dnaContent: `This was my first full-fledged solo backend project, a command-line car rental management system built for my Object-Oriented Programming class. It handled everything from car listings and availability to rental pricing and payment modes. Working on it alone taught me how to break a problem into smaller components and build something structured and functional from scratch. It was equal parts logic, loops, and learning, a real hands-on lesson in design thinking and debugging.`,
    planetContent: `The Car Rental System was a CLI-based application developed in <a href="#!" class="skill" data-skill="Java">Java</a> using core object-oriented principles like inheritance, abstraction, and encapsulation. It managed vehicle categories, pricing, booking availability, and multiple payment types, with persistent storage handled through a <a href="#!" class="skill" data-skill="SQL">SQL</a> database via <a href="#!" class="skill" data-skill="JDBC">JDBC</a>. Designed and implemented independently, the system emphasized clean class hierarchies, modular logic, and real-time data operations via terminal input/output. It served as a foundational project to apply OOP concepts in a real-world-like workflow, reinforcing my understanding of both design and execution.`,
  },
  {
    id: 'oopj2',
    title: 'Static Code Analysis Tool for Git Repositories',
    subtitle: 'A Java-based tool that performs static analysis on GitHub repositories and visualizes code quality using charts <br>May 2024 - June 2024',
    planetId: 1,
    dnaContent: `This project was born out of pure curiosity. Even though I was doing well in SE450 (OOP with Java), I took on a bonus project my professor offered, just to explore more. I built a complete static analysis tool that pulled public Git repositories, scanned them for code issues, and visualized the findings through charts. It gave me the chance to go beyond the classroom and stitch together everything I'd learned, plus a lot that I hadn't touched before. Honestly, it was the first time I felt like I'd built a proper developer tool.`,
    planetContent: `This was a solo project for SE450, where I developed a static code analysis and visualization tool using <a href="#!" class="skill" data-skill="Java">Java</a>. The application used the <a href="#!" class="skill" data-skill="JGit">JGit</a> library to pull source code from GitHub repositories, then ran <a href="#!" class="skill" data-skill="Checkstyle">Checkstyle</a> to analyze Java files for code violations. The results were stored in CSV format via <a href="#!" class="skill" data-skill="OpenCSV">OpenCSV</a> and visualized using <a href="#!" class="skill" data-skill="JFreeChart">JFreeChart</a> to generate bar and pie charts. I designed the tool to operate end-to-end, from Git fetch to analysis to visual feedback, reinforcing my understanding of data pipelines, modular architecture, and developer-focused tooling.`,
  },
  {
    id: 'dpas',
    title: 'Department Assistant',
    subtitle: 'School of Continuing and Professional Studies <br>May 2024 - April 2025 | Chicago, IL, USA',
    planetId: 2,
    dnaContent: `This was one of those roles that quietly reshaped how I communicate, problem-solve, and navigate uncertainty. As a Department Assistant at DePaul's School of Continuing and Professional Studies, I was part of a close-knit student team responsible for supporting adult learners through administrative processes. What began as contributing to answering calls and emails grew into something much more, I became the go-to person in the office, often relied upon by my peers. The environment was warm and collaborative, and it taught me how much trust can grow when you show up consistently and follow through. It also helped me become more confident in how I speak and handle people's needs.`,
    planetContent: `In this student-facing administrative role, I handled high-frequency requests from continuing education students, including course registration, payment deferral enrollment, course drops, transfers, and refund workflows via email and phone. I worked extensively with <a href="#!" class="skill" data-skill="Outlook">Outlook</a>, <a href="#!" class="skill" data-skill="Excel">Excel</a>, <a href="#!" class="skill" data-skill="Slate">Slate</a>, and <a href="#!" class="skill" data-skill="Perceptive Content">Perceptive Content (ImageNow)</a> for workflow tracking, record management, and form processing. I also contributed heavily to PDF editing and internal content creation using <a href="#!" class="skill" data-skill="Adobe">Adobe</a>, often managing document formatting, batch updates, and instructional materials. Due to my reliability, I was entrusted with side projects like office maintenance coordination, instructor data collation, and scheduling updates. I was considered reliable to train new hires when other team members were unavailable, even after transitioning to my next role.`,
  },
  {
    id: 'pmgoogle',
    title: 'Poor Man\'s Google',
    subtitle: 'File Search Engine using Multithreading and Client-Server Communication <br>September 2024 - November 2024',
    planetId: 4,
    dnaContent: 'This was my attempt at building Google on a budget. As part of a solo project, I created a file search engine that let a client input a keyword, and then returned the top 10 files containing that keyword the most. I set it up on a Linux VM, working with massive CSV files and building out the client-server system from scratch. It was one of those projects that pulled everything together: problem solving, systems thinking, and lots of "why isn\'t this working?" moments.',
    planetContent: 'Built entirely in <a href="#!" class="skill" data-skill="Java">Java</a>, Poor Man\'s Google was a multithreaded file search engine deployed on a Linux virtual machine. The system used a client-server architecture, where multiple clients sent keyword queries to a server via socket-based communication. On the server side, I used multithreading to parallelize search operations across large CSV files, tracking keyword frequency and returning the top 10 matching files ranked by occurrence. This project deepened my understanding of I/O optimization, thread safety, and basic information retrieval, all while reinforcing my grasp on distributed design under memory and time constraints.'
  },
  {
    id: 'pmreddit',
    title: 'Task Management System',
    subtitle: 'Task Management Website using HTML, CSS, Javascript and React.js <br>September 2024 - November 2024',
    planetId: 5,
    dnaContent: 'This was a solo build for my Web Applications course, a fully functional task management web app that let users create, group, and manage their tasks with custom tags and deadlines. I focused on making the UI feel lightweight and intuitive, letting users organize their day without overthinking the tool itself. It didn\'t use any backend, just local storage, but it handled everything I needed, and gave me a solid feel for how modern web apps are structured.',
    planetContent: 'Built using <a href="#!" class="skill" data-skill="React.js">React.js</a>, <a href="#!" class="skill" data-skill="HTML">HTML</a>, <a href="#!" class="skill" data-skill="CSS">CSS</a>, and <a href="#!" class="skill" data-skill="JavaScript">JavaScript</a>, this task management system allowed users to create and edit tasks with metadata such as title, description, tags, group assignments, and deadlines. Groups could also be created, edited, and assigned tasks for better organization. All data was saved locally in the browser using `localStorage`, and the application followed a component-based architecture for state and view management. This project solidified my understanding of client-side data persistence, component hierarchies, and dynamic UI rendering in a React environment.'
  },
  {
    id: 'iwashere',
    title: 'IWasHere',
    subtitle: 'Theme based Camera Mobile App <br>January 2025 - March 2025',
    planetId: 1,
    dnaContent: 'IWasHere was a passion project, something I built out of curiosity, just to see if I could blend photography and mobile UI into one creative tool. The app lets users choose a themed overlay (currently country-based), take a picture, and then decide whether to keep or discard it. If saved, a share sheet opens so they can instantly send it to friends or save it to their gallery. It\'s simple on the surface, but getting there taught me a lot about how camera systems and UI layers work together, especially when dealing with custom overlay frames.',
    planetContent: 'IWasHere is a camera-based mobile app developed using a combination of <a href="#!" class="skill" data-skill="SwiftUI">SwiftUI</a> and <a href="#!" class="skill" data-skill="UIKit">UIKit</a>. The app allows users to select a country-themed photo frame, capture a live image through the camera interface, and preview it with the overlay applied. Upon confirmation, the app opens a native <a href="#!" class="skill" data-skill="UIActivityViewController">share sheet</a> for saving or sharing the final image. Implementing the frame overlay logic required custom layering and transformation techniques to ensure alignment and pixel fidelity. While the current version supports country-based overlays, future updates aim to include event-specific themes as well.'
  },
  {
    id: 'jeevit',
    title: 'JeevIT',
    subtitle: 'Wellness Tracking Mobile App <br>January 2025 - March 2025',
    planetId: 2,
    dnaContent: 'JeevIT started as a way to track my own health more intentionally and quickly grew into a full-fledged wellness app. I built it to track everything from meals and water to exercise and steps, pulling real data from my Apple Watch and Health app. It became a daily companion, not just an app. The graphs, color themes, and progress rings gave it personality, while building it taught me how to take a personal problem and solve it through design, logic, and iteration.',
    planetContent: 'JeevIT is a privacy-first wellness tracker built using <a href="#!" class="skill" data-skill="SwiftUI">SwiftUI</a>, with deep integrations into <a href="#!" class="skill" data-skill="HealthKit">HealthKit</a>, <a href="#!" class="skill" data-skill="Core Data">Core Data</a>, and <a href="#!" class="skill" data-skill="CloudKit">CloudKit</a>. The app includes features for logging and visualizing water intake, exercise calories, meal calories, steps, and weight, using interactive charts and segmented views. Users can add custom entries, scan food barcodes via the <a href="#!" class="skill" data-skill="OpenFoodFacts API">OpenFoodFacts API</a>, and track progress with animated rings and customizable color themes. The app supports Apple Sign-In, biometric login via FaceID, and offers persistent data syncing across devices. JeevIT was designed with extensibility in mind blending a clean UI with secure, modular storage and real-world health applications.'
  },
  {
    id: 'taxmate',
    title: 'TaxMate',
    subtitle: 'Tax Filing cross-platform App for International Students in USA <br>January 2025 - March 2025',
    planetId: 5,
    dnaContent: 'As an international student, filing taxes in the U.S. felt like an unsolved puzzle, so we decided to build the missing piece. TaxMate started as an academic project and evolved into a full-featured cross-platform app that helps F-1 visa students file their taxes with confidence. From uploading W-2 forms and collecting immigration details to generating filled-out IRS forms, the app guides users step-by-step through an otherwise confusing process. It\'s one of the most structured and purpose-driven things I\'ve built: equal parts research, tech, and empathy.',
    planetContent: 'TaxMate is a cross-platform tax filing platform for F-1 visa international students, developed using <a href="#!" class="skill" data-skill="React.js">React.js</a> for the web frontend, <a href="#!" class="skill" data-skill="Spring Boot">Spring Boot</a> for the backend, and <a href="#!" class="skill" data-skill="PostgreSQL">PostgreSQL</a> as the primary data layer. The iOS client, built with <a href="#!" class="skill" data-skill="SwiftUI">SwiftUI</a>, includes features for secure login via <a href="#!" class="skill" data-skill="Firebase Authentication">Firebase Authentication</a>, W-2 form upload with OCR, and user-friendly navigation for reviewing and submitting personal, academic, and immigration data. The backend is hosted on <a href="#!" class="skill" data-skill="Azure">Azure</a> processes extracted W-2 data, performs validation, and generates ready-to-file IRS forms such as 1040NR and 8843. Built with modular APIs and future-ready architecture, TaxMate is designed for long-term extensibility, compliance, and real-world usability.'
  },
  {
    id: 'pras',
    title: 'Program Assistant',
    subtitle: 'School of Continuing and Professional Studies <br>April 2025 - Present | Chicago, IL, USA',
    planetId: 4,
    dnaContent: 'After a year as a Department Assistant, I transitioned into a more focused role as a Program Assistant, working directly under a Program Manager in the same department. While the office stayed the same, the nature of the work shifted: I now deal with course-specific tasks, assist in managing programs, and handle instructor and student support on a more academic level. I continue to be someone the office relies on, but now it\'s more about diving deeper into the rhythms of course planning, keeping an eye on enrollments, and stepping in when students or instructors need help. It\'s quieter work in some ways, but also more structured, and I\'m enjoying that shift.',
    planetContent: 'As a Program Assistant, I provide academic and administrative support to a Program Manager overseeing several continuing education programs at DePaul. My daily responsibilities include monitoring course enrollment data, managing student queries via <a href="#!" class="skill" data-skill="Outlook">Outlook</a> and phone, and assisting with course planning and logistics on behalf of the Program Manager when they are unavailable. I work extensively with <a href="#!" class="skill" data-skill="Excel">Excel</a>, <a href="#!" class="skill" data-skill="Slate">Slate</a>, and <a href="#!" class="skill" data-skill="D2L">D2L</a> with access to program files and databases that I previously didn\'t interact with. This role is more autonomous and course-administration focused than my prior one, requiring attention to detail, discretion, and a strong sense of ownership over program workflows and communications.'
  },
  {
    id: 'buckbuddy',
    title: 'BuckBuddy',
    subtitle: 'Group Expense Sharing Mobile App <br>May 2025 - Present',
    planetId: 3,
    dnaContent: 'BuckBuddy was inspired by that all-too-familiar friend group chaos of “who owes what”, and a love for clean, touch-friendly design. It\'s an expense-sharing app that makes tracking and splitting group costs actually feel smooth. With intuitive swipe navigation, you can hop between your groups, friends, and balances like flipping through cards, no tabs, no clutter. I designed it to be simple, quick, and visually pleasant, while still powerful under the hood.',
    planetContent: 'BuckBuddy is a SwiftUI-based mobile app designed for seamless group expense management, integrating features like friend tracking, group creation, expense logging, and real-time balance updates. Navigation is handled through gesture-driven UI transitions using directional swipes between views such as Home, Friends, Groups, Expenses, and Profile. The backend logic and API endpoints are powered by <a href="#!" class="skill" data-skill="Firebase Cloud Functions">Firebase Cloud Functions</a>, with <a href="#!" class="skill" data-skill="Firebase Authentication">Firebase Authentication</a> and <a href="#!" class="skill" data-skill="Firestore">Firestore</a> handling user login and data storage. The app employs structured data models and dynamic view rendering to ensure efficient state management and user experience. Designed to be scalable and lightweight, BuckBuddy blends functionality with simplicity, making expense tracking feel like second nature.'
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    subtitle: 'This Portfolio Website <br>June 2025 - Present',
    planetId: 2,
    dnaContent: `This portfolio website is my way of sharing my journey, skills, and projects with the world. I wanted a space that felt like me, where I could showcase what I've built, what I care about, and how I think. It\'s a blend of my past work, current projects, and future aspirations, all wrapped in a design that reflects my personality. I built it to be more than just a resume, but a living, breathing representation of who I am as a developer and a person.`,
    planetContent: `This portfolio website is built using <a href="#!" class="skill" data-skill="React.js">React.js</a> and <a href="#!" class="skill" data-skill="Tailwind CSS">Tailwind CSS</a>, with a focus on responsive design and user experience. It features sections for my journey, skills, projects, and contact information, all designed to be easily navigable and visually appealing. The site uses a modular component structure to ensure maintainability and scalability, allowing for future updates and additions. The design emphasizes clean typography, intuitive navigation, and a cohesive color scheme that reflects my personal brand. The portfolio is hosted on <a href="#!" class="skill" data-skill="GitHub Pages">GitHub Pages</a>, making it accessible and easy to share. This project showcases my ability to create a polished, professional web presence while highlighting my skills in frontend development and design.`
  }
];

export default sections;