// src/data/skillSections.js

export const skillSections = {
  /* ---------------- iOS ---------------- */

  Swift: {
    description:
      'Used for building native iOS applications with a focus on safety, performance, and expressive syntax. I primarily use it for application logic and system-level interactions on Apple platforms.',
    link: 'https://developer.apple.com/swift/',
  },

  SwiftUI: {
    description:
      'A declarative UI framework used to build responsive, state-driven interfaces on iOS, allowing UI behavior to stay tightly coupled with data.',
    link: 'https://developer.apple.com/xcode/swiftui/',
  },

  UIKit: {
    description:
      'Used when fine-grained control over layout, navigation, or system components is required, especially for custom workflows.',
    link: 'https://developer.apple.com/documentation/uikit',
  },

  AVFoundation: {
    description:
      'Apple’s media framework used for camera capture, live previews, and real-time video processing.',
    link: 'https://developer.apple.com/documentation/avfoundation',
  },

  UIActivityViewController: {
    description:
      'Used to integrate native iOS sharing behavior through a consistent system-provided interface.',
    link: 'https://developer.apple.com/documentation/uikit/uiactivityviewcontroller',
  },

  HealthKit: {
    description:
      'Apple’s framework for securely accessing health and activity data such as steps and workouts.',
    link: 'https://developer.apple.com/documentation/healthkit',
  },

  'Core Data': {
    description:
      'A persistence framework used for managing structured data locally on Apple platforms.',
    link: 'https://developer.apple.com/documentation/coredata',
  },

  CloudKit: {
    description:
      'Apple’s cloud-backed data synchronization service used for cross-device persistence.',
    link: 'https://developer.apple.com/documentation/cloudkit',
  },

  'Sign in with Apple': {
    description:
      'Apple’s authentication system that allows users to sign in securely with their Apple ID, with privacy-friendly identity controls.',
    link: 'https://developer.apple.com/sign-in-with-apple/',
  },

  'Face ID': {
    description:
      'Biometric authentication used to protect sensitive app flows via device-level identity verification.',
    link: 'https://developer.apple.com/documentation/localauthentication',
  },

  /* ---------------- Android ---------------- */

  'Android Studio': {
    description:
      'The primary development environment I use for building native Android applications, including debugging and layout inspection.',
    link: 'https://developer.android.com/studio',
  },

  SQLite: {
    description:
      'A lightweight relational database used for local data persistence in mobile applications.',
    link: 'https://www.sqlite.org/index.html',
  },

  Activities: {
    description:
      'Core Android components representing individual UI screens and managing lifecycle-aware logic.',
    link: 'https://developer.android.com/guide/components/activities',
  },

  Fragments: {
    description:
      'Reusable Android UI components used to modularize screens and manage dynamic layouts.',
    link: 'https://developer.android.com/guide/fragments',
  },

  RecyclerView: {
    description:
      'A flexible Android UI component for efficiently displaying large or dynamic lists using adapters and view holders.',
    link: 'https://developer.android.com/develop/ui/views/layout/recyclerview',
  },

  'Android Volley': {
    description:
      'An Android networking library used for making HTTP requests, handling responses, and supporting request queuing and caching.',
    link: 'https://google.github.io/volley/',
  },

  Picasso: {
    description:
      'An Android image loading library used to fetch, cache, and display remote images with minimal boilerplate.',
    link: 'https://square.github.io/picasso/',
  },

  PhotoView: {
    description:
      'A zoomable ImageView component for Android that supports pinch-to-zoom and gesture-based image interaction.',
    link: 'https://github.com/GetStream/photoview-android',
  },

  'Fused Location Provider': {
    description:
      'Android’s location service used for accurate, sensor-fused positioning.',
    link: 'https://developer.android.com/training/location',
  },

  GradientDrawable: {
    description:
      'An Android drawable used to render gradients and shapes programmatically, often for dynamic backgrounds.',
    link: 'https://developer.android.com/reference/android/graphics/drawable/GradientDrawable',
  },

  'View binding': {
    description:
      'A feature that generates type-safe bindings for views, reducing findViewById usage and improving UI code safety.',
    link: 'https://developer.android.com/topic/libraries/view-binding',
  },

  GPS: {
    description:
      'A satellite-based positioning system used to determine device location, typically accessed through mobile platform location services.',
    link: 'https://developer.android.com/training/location',
  },

  /* ---------------- Web ---------------- */

  HTML: {
    description:
      'Used to structure web content with semantic meaning and accessibility in mind.',
    link: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  },

  CSS: {
    description:
      'Used to control layout, spacing, and visual hierarchy in responsive web interfaces.',
    link: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  },

  JavaScript: {
    description:
      'Used for client-side logic, interactivity, and state handling in web applications.',
    link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },

  'React.js': {
    description:
      'A component-based library used to build dynamic, state-driven user interfaces.',
    link: 'https://react.dev/',
  },

  'Component-Based Architecture': {
    description:
      'An approach that breaks UI and logic into reusable, self-contained units to improve maintainability.',
    link: 'https://react.dev/learn/thinking-in-react',
  },

  'State Management': {
    description:
      'The practice of keeping application data predictable and synchronized with UI behavior.',
    link: 'https://react.dev/learn/managing-state',
  },

  'Local Storage': {
    description:
      'Browser-based persistence used to store client-side data across sessions without backend dependencies.',
    link: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
  },

  'GitHub Pages': {
    description:
      'A static hosting platform used to deploy and serve web projects.',
    link: 'https://pages.github.com/',
  },

  /* ---------------- Backend / Cloud / Data ---------------- */

  Java: {
    description:
      'A primary language I’ve used across backend systems, Android applications, and tooling for structured, logic-heavy implementations.',
    link: 'https://docs.oracle.com/en/java/',
  },

  'Spring MVC': {
    description:
      'A Java framework used to build structured backend applications with clear separation of concerns.',
    link: 'https://docs.spring.io/spring-framework/docs/current/reference/html/web.html',
  },

  'Spring Boot': {
    description:
      'A Java framework used to build production-ready backend services quickly with convention-based configuration and strong ecosystem support.',
    link: 'https://spring.io/projects/spring-boot',
  },

  'REST APIs': {
    description:
      'Structured HTTP interfaces used to expose backend functionality in a predictable way.',
    link: 'https://restfulapi.net/',
  },

  APIs: {
    description:
      'Interfaces that allow systems to communicate and exchange data in a structured, predictable way (often over HTTP).',
    link: 'https://en.wikipedia.org/wiki/API',
  },

  SQL: {
    description:
      'A query language used to interact with relational databases for schema design and data retrieval.',
    link: 'https://www.postgresql.org/docs/',
  },

  JDBC: {
    description:
      'A Java-based database connectivity layer used to bridge application logic with SQL databases.',
    link: 'https://docs.oracle.com/javase/tutorial/jdbc/',
  },

  PostgreSQL: {
    description:
      'An open-source relational database used for structured storage, querying, and transactional consistency.',
    link: 'https://www.postgresql.org/docs/',
  },

  Linux: {
    description:
      'An operating system used for deploying and running backend systems and managing environments.',
    link: 'https://www.kernel.org/doc/html/latest/',
  },

  Multithreading: {
    description:
      'A technique used to execute multiple tasks concurrently to improve performance and responsiveness.',
    link: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/',
  },

  Concurrency: {
    description:
      'Managing multiple operations that run simultaneously while maintaining correctness.',
    link: 'https://en.wikipedia.org/wiki/Concurrency_(computer_science)',
  },

  Sockets: {
    description:
      'Low-level client–server communication using direct request–response messaging over TCP/UDP sockets.',
    link: 'https://docs.oracle.com/javase/tutorial/networking/sockets/',
  },

  'Socket Programming': {
    description:
      'Low-level client–server communication using direct request–response messaging.',
    link: 'https://docs.oracle.com/javase/tutorial/networking/sockets/',
  },

  Azure: {
    description:
      'Microsoft’s cloud platform used for hosting backend services, storage, and infrastructure for scalable applications.',
    link: 'https://learn.microsoft.com/azure/',
  },

  /* ---------------- Firebase ---------------- */

  'Firebase Authentication': {
    description:
      'Used to manage secure user authentication and identity across platforms.',
    link: 'https://firebase.google.com/docs/auth',
  },

  'Firebase Cloud Functions': {
    description:
      'Serverless backend logic used to process requests and enforce business rules.',
    link: 'https://firebase.google.com/docs/functions',
  },

  Firestore: {
    description:
      'A real-time NoSQL database used for structured data storage and synchronization.',
    link: 'https://firebase.google.com/docs/firestore',
  },

  'Cloud Firestore': {
    description:
      'A real-time NoSQL database used for structured data storage and synchronization across clients and backend services.',
    link: 'https://firebase.google.com/docs/firestore',
  },

  /* ---------------- Tooling / Libraries ---------------- */

  GSAP: {
    description:
      'An animation library used for timeline-based motion, scroll-driven effects, and transitions.',
    link: 'https://gsap.com/docs/',
  },

  'Three.js': {
    description:
      'A JavaScript library used for rendering interactive 3D scenes and spatial elements.',
    link: 'https://threejs.org/docs/',
  },

  /* ---------------- External APIs ---------------- */

  'Visual Crossing Weather API': {
    description:
      'A weather data API used to retrieve current conditions and forecast data.',
    link: 'https://www.visualcrossing.com/weather-api',
  },

  'Art Institute of Chicago API': {
    description:
      'A public API used to search, retrieve, and explore artworks and collection metadata from the Art Institute of Chicago.',
    link: 'https://api.artic.edu/docs/',
  },

  'OpenFoodFacts API': {
    description:
      'A public food product database API used to retrieve nutrition and product data (often via barcode lookups).',
    link: 'https://world.openfoodfacts.org/data',
  },

  'HereMap API': {
    description:
      'A location platform API used for mapping, routing, and geocoding features in apps.',
    link: 'https://www.here.com/docs/',
  },

  /* ---------------- Payments ---------------- */

  'Stripe API': {
    description:
      'A payment processing API used to handle secure transactions and access control.',
    link: 'https://stripe.com/docs/api',
  },

  /* ---------------- Hardware / IoT ---------------- */

  Arduino: {
    description:
      'An open-source electronics platform used for prototyping with microcontrollers, sensors, and actuators.',
    link: 'https://docs.arduino.cc/',
  },

  ESP32: {
    description:
      'A popular microcontroller platform with Wi-Fi and Bluetooth used for IoT prototyping and embedded systems.',
    link: 'https://docs.espressif.com/projects/esp-idf/en/stable/esp32/index.html',
  },

  /* ---------------- Security / Crypto ---------------- */

  'OAuth2.0': {
    description:
      'An authorization framework used to grant scoped access to resources without sharing user passwords directly.',
    link: 'https://datatracker.ietf.org/doc/html/rfc6749',
  },

  'Diffie-Hellman Algorithm': {
    description:
      'A cryptographic key exchange method used to establish a shared secret over an untrusted channel.',
    link: 'https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange',
  },

  /* ---------------- Courses / CS Foundations ---------------- */

  'Data Structures and Algorithms': {
    description:
      'Core CS foundations focused on designing efficient solutions using the right data structures and algorithmic techniques.',
    link: 'https://en.wikipedia.org/wiki/Data_structure',
  },

  Algorithms: {
    description:
      'Step-by-step computational procedures used to solve problems efficiently and correctly.',
    link: 'https://en.wikipedia.org/wiki/Algorithm',
  },

  'Data Structures': {
    description:
      'Ways of organizing and storing data to enable efficient access, updates, and computation.',
    link: 'https://en.wikipedia.org/wiki/Data_structure',
  },

  Databases: {
    description:
      'Systems and concepts for storing, querying, and maintaining structured data with reliability and consistency.',
    link: 'https://en.wikipedia.org/wiki/Database',
  },

  'Operating Systems': {
    description:
      'Concepts related to process management, memory, scheduling, synchronization, and how software interacts with hardware.',
    link: 'https://en.wikipedia.org/wiki/Operating_system',
  },

  'Computer Organization & Architecture': {
    description:
      'Foundations of how computers are structured internally: CPU design, instruction sets, memory hierarchy, and performance tradeoffs.',
    link: 'https://en.wikipedia.org/wiki/Computer_architecture',
  },

  'Computer Networks': {
    description:
      'Networking fundamentals including protocols, routing, reliable transport, and how distributed systems communicate.',
    link: 'https://en.wikipedia.org/wiki/Computer_network',
  },

  'Theory of Computation': {
    description:
      'Theoretical foundations of computing: automata, formal languages, computability, and complexity.',
    link: 'https://en.wikipedia.org/wiki/Theory_of_computation',
  },

  'Compiler Design': {
    description:
      'How source code is translated into executable form: parsing, semantic analysis, optimization, and code generation.',
    link: 'https://en.wikipedia.org/wiki/Compiler',
  },

  DBMS: {
    description:
      'Database Management Systems concepts: data modeling, relational design, queries, normalization, and transaction behavior.',
    link: 'https://en.wikipedia.org/wiki/Database#Database_management_system',
  },

  COPL: {
    description:
      'Concepts of Programming Languages: paradigms, type systems, semantics, and how languages shape program structure.',
    link: 'https://en.wikipedia.org/wiki/Programming_language',
  },

  'Object-Oriented Programming': {
    description:
      'A programming paradigm based on objects and encapsulation, emphasizing reusable structure via classes and interfaces.',
    link: 'https://docs.oracle.com/javase/tutorial/java/concepts/',
  },

  'Human-Computer Interaction': {
    description:
      'The study and practice of designing usable systems by understanding human behavior, cognition, and interaction patterns.',
    link: 'https://en.wikipedia.org/wiki/Human%E2%80%93computer_interaction',
  },

  'Agile Development': {
    description:
      'An iterative development approach emphasizing collaboration, incremental delivery, and responsiveness to change.',
    link: 'https://agilemanifesto.org/',
  },

  'Engineering Mathematics': {
    description:
      'Mathematical foundations commonly used in engineering and CS: calculus, linear algebra, probability, and discrete math.',
    link: 'https://en.wikipedia.org/wiki/Engineering_mathematics',
  },

  'General Aptitude': {
    description:
      'Reasoning and problem-solving skills including quantitative aptitude, logical reasoning, and verbal ability.',
    link: 'https://en.wikipedia.org/wiki/Aptitude',
  },

  /* ---------------- Languages ---------------- */

  'C++': {
    description:
      'A systems programming language used for performance-critical applications and understanding low-level memory and execution.',
    link: 'https://en.cppreference.com/',
  },

  Python: {
    description:
      'A general-purpose language used for scripting, automation, and rapid prototyping with a clean and readable syntax.',
    link: 'https://docs.python.org/3/',
  },

  'C#': {
    description:
      'A modern language used for application development with strong tooling support, commonly used with .NET.',
    link: 'https://learn.microsoft.com/dotnet/csharp/',
  },

  /* ---------------- Dev Tools / Productivity ---------------- */

  Figma: {
    description:
      'A collaborative design tool used to prototype UI flows, layouts, and interface structure quickly.',
    link: 'https://help.figma.com/hc/en-us',
  },

  /* ---------------- Dev Libraries (Java tooling) ---------------- */

  JGit: {
    description:
      'A Java library that provides Git functionality (clone, fetch, diff, log, etc.) directly inside Java applications.',
    link: 'https://www.eclipse.org/jgit/',
  },

  Checkstyle: {
    description:
      'A static analysis tool used to enforce coding standards and detect style violations in Java codebases.',
    link: 'https://checkstyle.sourceforge.io/',
  },

  OpenCSV: {
    description:
      'A Java library used to read and write CSV files reliably, supporting common parsing and formatting needs.',
    link: 'https://opencsv.sourceforge.net/',
  },

  JFreeChart: {
    description:
      'A Java charting library used to generate visualizations like bar charts and pie charts from structured data.',
    link: 'https://www.jfree.org/jfreechart/',
  },

  /* ---------------- Workplace / Admin Tools ---------------- */

  Outlook: {
    description:
      'Microsoft email and calendar client used for communication, scheduling, and coordination workflows.',
    link: 'https://support.microsoft.com/outlook',
  },

  Excel: {
    description:
      'Spreadsheet software used for reporting, tracking, analysis, and structured data workflows.',
    link: 'https://support.microsoft.com/excel',
  },

  Slate: {
    description:
      'A CRM/workflow platform often used in higher education for managing student records, communications, and processes.',
    link: 'https://technolutions.com/slate/',
  },

  'Perceptive Content': {
    description:
      'An enterprise content management system (also known as ImageNow) used for document storage, indexing, and workflow routing.',
    link: 'https://www.hyland.com/en/products/perceptive-content',
  },

  Adobe: {
    description:
      'Used for working with PDFs and documents (editing, combining, exporting, and batch processing workflows).',
    link: 'https://helpx.adobe.com/',
  },

  D2L: {
    description:
      'A learning management platform (Brightspace) used for course administration, content delivery, and student workflows.',
    link: 'https://www.d2l.com/',
  },

  /* ---------------- Project / Systems Concepts ---------------- */

  'CSV Files': {
    description:
      'A simple text-based tabular format used for storing and exchanging structured data in rows and columns.',
    link: 'https://en.wikipedia.org/wiki/Comma-separated_values',
  },

  'I/O Optimization': {
    description:
      'Techniques to reduce input/output bottlenecks (disk/network), improve throughput, and keep systems responsive under load.',
    link: 'https://en.wikipedia.org/wiki/Input/output',
  },

  'Information Retrieval': {
    description:
      'The field focused on searching, ranking, and retrieving relevant information from large collections of data.',
    link: 'https://en.wikipedia.org/wiki/Information_retrieval',
  },

  'Learning Management System': {
    description:
      'A platform used to deliver, manage, and track learning content, enrollments, and student progress at scale.',
    link: 'https://en.wikipedia.org/wiki/Learning_management_system',
  },

  /* ---------------- Portfolio Reference ---------------- */

  'Split Fiction': {
    description:
      'A co-op game reference used as inspiration for the portfolio’s split-view concept (two perspectives visible with a movable boundary).',
    link: 'https://www.hazelight.se/games/split-fiction/',
  },
}
