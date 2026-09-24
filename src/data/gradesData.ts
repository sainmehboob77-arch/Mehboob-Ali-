import { DayTimetable, Student, CourseBook, StudyPlan } from '../types';

// Helper to build 6-day timetable for any grade
function createGradeWeeklyTimetable(
  grade: string,
  scheduleTemplate: {
    Mon: { sub: string; teacher: string; room: string }[];
    Tue: { sub: string; teacher: string; room: string }[];
    Wed: { sub: string; teacher: string; room: string }[];
    Thu: { sub: string; teacher: string; room: string }[];
    Fri: { sub: string; teacher: string; room: string }[];
    Sat: { sub: string; teacher: string; room: string }[];
  }
): DayTimetable[] {
  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  return days.map(day => {
    const key = day.slice(0, 3) as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
    const dayClasses = scheduleTemplate[key];
    const isFriday = day === 'Friday';
    const isSaturday = day === 'Saturday';

    if (isFriday) {
      return {
        day,
        periods: [
          { periodNumber: 1, timeRange: '08:00 - 08:45 AM', subject: dayClasses[0]?.sub || 'Mathematics', teacherName: dayClasses[0]?.teacher || 'Sir Ghulam Mustafa', roomNumber: dayClasses[0]?.room || 'Room 101' },
          { periodNumber: 2, timeRange: '08:45 - 09:30 AM', subject: dayClasses[1]?.sub || 'English Language', teacherName: dayClasses[1]?.teacher || 'Madam Samina', roomNumber: dayClasses[1]?.room || 'Room 101' },
          { periodNumber: 3, timeRange: '09:30 - 10:15 AM', subject: dayClasses[2]?.sub || 'Science / Exploration', teacherName: dayClasses[2]?.teacher || 'Madam Farhat', roomNumber: dayClasses[2]?.room || 'Room 101' },
          { periodNumber: 4, timeRange: '10:15 - 11:00 AM', subject: 'Islamic Morals & Surah Recitation', teacherName: 'Molana Hafiz Niaz Kalhoro', roomNumber: 'Assembly Hall' },
          { periodNumber: 5, timeRange: '11:00 - 12:00 PM', subject: 'Jummah Prayer Assembly & Dismissal', teacherName: 'Faculty & Administration', roomNumber: 'School Mosque / Hall' },
        ]
      };
    }

    if (isSaturday) {
      return {
        day,
        periods: [
          { periodNumber: 1, timeRange: '08:00 - 08:45 AM', subject: 'Weekly Assessment / Spelling & Mental Math', teacherName: dayClasses[0]?.teacher || 'Class Incharge', roomNumber: dayClasses[0]?.room || 'Room 101' },
          { periodNumber: 2, timeRange: '08:45 - 09:30 AM', subject: dayClasses[1]?.sub || 'Activity & Worksheets', teacherName: dayClasses[1]?.teacher || 'Subject Teacher', roomNumber: dayClasses[1]?.room || 'Room 101' },
          { periodNumber: 3, timeRange: '09:30 - 10:15 AM', subject: 'Art, Calligraphy & Creative Craft', teacherName: 'Art Department', roomNumber: 'Creative Studio' },
          { periodNumber: 4, timeRange: '10:15 - 10:55 AM', subject: 'Recess Break', teacherName: 'Campus Staff', roomNumber: 'Courtyard', isBreak: true },
          { periodNumber: 5, timeRange: '10:55 - 11:45 AM', subject: 'Junior Games & Physical Training', teacherName: 'Coach Zulfiqar', roomNumber: 'Sports Grounds' },
        ]
      };
    }

    // Mon - Thu Standard 7 Periods
    return {
      day,
      periods: [
        { periodNumber: 1, timeRange: '08:00 - 08:45 AM', subject: dayClasses[0]?.sub || 'Mathematics', teacherName: dayClasses[0]?.teacher || 'Primary Teacher', roomNumber: dayClasses[0]?.room || 'Classroom' },
        { periodNumber: 2, timeRange: '08:45 - 09:30 AM', subject: dayClasses[1]?.sub || 'English Language', teacherName: dayClasses[1]?.teacher || 'English Teacher', roomNumber: dayClasses[1]?.room || 'Classroom' },
        { periodNumber: 3, timeRange: '09:30 - 10:15 AM', subject: dayClasses[2]?.sub || 'Science / EVS', teacherName: dayClasses[2]?.teacher || 'Science Teacher', roomNumber: dayClasses[2]?.room || 'Classroom' },
        { periodNumber: 4, timeRange: '10:15 - 10:55 AM', subject: 'Recess & Healthy Snack Break', teacherName: 'Campus Staff', roomNumber: 'Cafeteria / Courtyard', isBreak: true },
        { periodNumber: 5, timeRange: '10:55 - 11:40 AM', subject: dayClasses[3]?.sub || 'Sindhi / Urdu', teacherName: dayClasses[3]?.teacher || 'Language Teacher', roomNumber: dayClasses[3]?.room || 'Classroom' },
        { periodNumber: 6, timeRange: '11:40 - 12:25 PM', subject: dayClasses[4]?.sub || 'Social Studies / Computer', teacherName: dayClasses[4]?.teacher || 'Specialist', roomNumber: dayClasses[4]?.room || 'Classroom' },
        { periodNumber: 7, timeRange: '12:25 - 01:15 PM', subject: dayClasses[5]?.sub || 'Islamiat & Character Building', teacherName: dayClasses[5]?.teacher || 'Molana Hafiz Niaz', roomNumber: dayClasses[5]?.room || 'Classroom' },
      ]
    };
  });
}

// -------------------------------------------------------------
// TIMETABLES FOR GRADES 1 TO 8
// -------------------------------------------------------------
export const TIMETABLES_GRADES_1_TO_8: Record<string, DayTimetable[]> = {
  'Grade 1': createGradeWeeklyTimetable('Grade 1', {
    Mon: [
      { sub: 'Early Mathematics & Counting', teacher: 'Madam Farzana Solangi', room: 'Room 101' },
      { sub: 'English Phonics & Alphabet', teacher: 'Madam Samina Kousar', room: 'Room 101' },
      { sub: 'General Knowledge & Nature', teacher: 'Madam Farzana Solangi', room: 'Room 101' },
      { sub: 'Sindhi Pehli Kitab (Qaida)', teacher: 'Molana Hafiz Niaz', room: 'Room 101' },
      { sub: 'Art, Drawing & Coloring', teacher: 'Madam Ruqayya Memon', room: 'Art Studio' },
      { sub: 'Moral Stories & Islamic Etiquette', teacher: 'Molana Hafiz Niaz', room: 'Room 101' },
    ],
    Tue: [
      { sub: 'English Phonics & Rhymes', teacher: 'Madam Samina Kousar', room: 'Room 101' },
      { sub: 'Mathematics Shapes & Numbers', teacher: 'Madam Farzana Solangi', room: 'Room 101' },
      { sub: 'Sindhi Alphabet & Writing', teacher: 'Molana Hafiz Niaz', room: 'Room 101' },
      { sub: 'Physical Play & Motor Skills', teacher: 'Coach Zulfiqar', room: 'Playground' },
      { sub: 'General Knowledge & Plants', teacher: 'Madam Farzana Solangi', room: 'Room 101' },
      { sub: 'Urdu Words & Speaking', teacher: 'Madam Samina Kousar', room: 'Room 101' },
    ],
    Wed: [
      { sub: 'Early Mathematics Addition', teacher: 'Madam Farzana Solangi', room: 'Room 101' },
      { sub: 'English Story Listening', teacher: 'Madam Samina Kousar', room: 'Room 101' },
      { sub: 'Drawing & Clay Modeling', teacher: 'Madam Ruqayya Memon', room: 'Art Studio' },
      { sub: 'Sindhi Pehli Kitab', teacher: 'Molana Hafiz Niaz', room: 'Room 101' },
      { sub: 'Computer Tablet Learning', teacher: 'Engr. Kashif Bhutto', room: 'Junior IT Room' },
      { sub: 'Islamic Manners & Dua Recitation', teacher: 'Molana Hafiz Niaz', room: 'Room 101' },
    ],
    Thu: [
      { sub: 'Mathematics Mental Counting', teacher: 'Madam Farzana Solangi', room: 'Room 101' },
      { sub: 'English Handwriting Practice', teacher: 'Madam Samina Kousar', room: 'Room 101' },
      { sub: 'Science & Animal World', teacher: 'Madam Farzana Solangi', room: 'Room 101' },
      { sub: 'Sindhi Qaida', teacher: 'Molana Hafiz Niaz', room: 'Room 101' },
      { sub: 'Music & Cultural Rhymes', teacher: 'Cultural Wing', room: 'Activity Hall' },
      { sub: 'Good Habits & Cleanliness', teacher: 'Madam Farzana Solangi', room: 'Room 101' },
    ],
    Fri: [
      { sub: 'English Alphabet Review', teacher: 'Madam Samina Kousar', room: 'Room 101' },
      { sub: 'Mathematics Number Line', teacher: 'Madam Farzana Solangi', room: 'Room 101' },
      { sub: 'Sindhi Letter Tracing', teacher: 'Molana Hafiz Niaz', room: 'Room 101' },
    ],
    Sat: [
      { sub: 'Weekly Phonics & Math Quiz', teacher: 'Madam Farzana Solangi', room: 'Room 101' },
      { sub: 'Coloring & Storybook Reading', teacher: 'Madam Samina Kousar', room: 'Room 101' },
    ]
  }),

  'Grade 2': createGradeWeeklyTimetable('Grade 2', {
    Mon: [
      { sub: 'Mathematics: 2-Digit Addition', teacher: 'Madam Farzana Solangi', room: 'Room 102' },
      { sub: 'English: Reader & Sight Words', teacher: 'Madam Samina Kousar', room: 'Room 102' },
      { sub: 'General Knowledge & Environment', teacher: 'Sir Abdul Jabbar', room: 'Room 102' },
      { sub: 'Sindhi Biyee Kitab', teacher: 'Molana Hafiz Niaz', room: 'Room 102' },
      { sub: 'Computer Fundamentals', teacher: 'Engr. Kashif Bhutto', room: 'Junior IT Lab' },
      { sub: 'Islamiat: Akhlaqiyat', teacher: 'Molana Hafiz Niaz', room: 'Room 102' },
    ],
    Tue: [
      { sub: 'English: Sentence Formation', teacher: 'Madam Samina Kousar', room: 'Room 102' },
      { sub: 'Mathematics: Subtraction & Money', teacher: 'Madam Farzana Solangi', room: 'Room 102' },
      { sub: 'Sindhi Grammar Basics', teacher: 'Molana Hafiz Niaz', room: 'Room 102' },
      { sub: 'Physical Education & Games', teacher: 'Coach Zulfiqar', room: 'Playground' },
      { sub: 'General Knowledge: Our Body', teacher: 'Sir Abdul Jabbar', room: 'Room 102' },
      { sub: 'Art & Sketching', teacher: 'Madam Ruqayya', room: 'Art Studio' },
    ],
    Wed: [
      { sub: 'Mathematics: Multiplication Tables', teacher: 'Madam Farzana Solangi', room: 'Room 102' },
      { sub: 'English Reading & Spellings', teacher: 'Madam Samina Kousar', room: 'Room 102' },
      { sub: 'General Science: Living Things', teacher: 'Sir Abdul Jabbar', room: 'Room 102' },
      { sub: 'Sindhi Reading & Recitation', teacher: 'Molana Hafiz Niaz', room: 'Room 102' },
      { sub: 'Computer Typing & Paint', teacher: 'Engr. Kashif Bhutto', room: 'Junior IT Lab' },
      { sub: 'Islamiat Stories of Prophets', teacher: 'Molana Hafiz Niaz', room: 'Room 102' },
    ],
    Thu: [
      { sub: 'English Poetry & Recitation', teacher: 'Madam Samina Kousar', room: 'Room 102' },
      { sub: 'Mathematics Shapes & Measurements', teacher: 'Madam Farzana Solangi', room: 'Room 102' },
      { sub: 'Social Knowledge: My Community', teacher: 'Sir Abdul Jabbar', room: 'Room 102' },
      { sub: 'Sindhi Writing Practice', teacher: 'Molana Hafiz Niaz', room: 'Room 102' },
      { sub: 'Library Story Hour', teacher: 'Library Staff', room: 'Library' },
      { sub: 'Character Education', teacher: 'Madam Farzana Solangi', room: 'Room 102' },
    ],
    Fri: [
      { sub: 'Mathematics Practice Drill', teacher: 'Madam Farzana Solangi', room: 'Room 102' },
      { sub: 'English Dictation', teacher: 'Madam Samina Kousar', room: 'Room 102' },
      { sub: 'Sindhi Storytelling', teacher: 'Molana Hafiz Niaz', room: 'Room 102' },
    ],
    Sat: [
      { sub: 'Weekly Math & English Review', teacher: 'Madam Farzana Solangi', room: 'Room 102' },
      { sub: 'Creative Art & Origami', teacher: 'Art Staff', room: 'Room 102' },
    ]
  }),

  'Grade 3': createGradeWeeklyTimetable('Grade 3', {
    Mon: [
      { sub: 'Mathematics: Multiplication & Fractions', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 103' },
      { sub: 'English Grammar & Comprehension', teacher: 'Madam Samina Kousar', room: 'Room 103' },
      { sub: 'General Science: Plant Life & Seeds', teacher: 'Madam Farhat Bano', room: 'Room 103' },
      { sub: 'Sindhi Tiyee Kitab', teacher: 'Molana Hafiz Niaz', room: 'Room 103' },
      { sub: 'Social Studies: Maps & Villages', teacher: 'Sir Abdul Jabbar', room: 'Room 103' },
      { sub: 'Islamiat: Wudu & Salah Guidance', teacher: 'Molana Hafiz Niaz', room: 'Room 103' },
    ],
    Tue: [
      { sub: 'General Science: Animals & Habitats', teacher: 'Madam Farhat Bano', room: 'Room 103' },
      { sub: 'Mathematics: Division Basics', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 103' },
      { sub: 'English: Creative Paragraph Writing', teacher: 'Madam Samina Kousar', room: 'Room 103' },
      { sub: 'Computer Studies: Parts of PC', teacher: 'Engr. Kashif Bhutto', room: 'CS Lab 2' },
      { sub: 'Sindhi Dictation & Vocabulary', teacher: 'Molana Hafiz Niaz', room: 'Room 103' },
      { sub: 'Physical Education & Athletics', teacher: 'Coach Zulfiqar', room: 'Sports Complex' },
    ],
    Wed: [
      { sub: 'Mathematics: Word Problems', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 103' },
      { sub: 'English Comprehension Passage', teacher: 'Madam Samina Kousar', room: 'Room 103' },
      { sub: 'General Science: Water Cycle Experiment', teacher: 'Madam Farhat Bano', room: 'Junior Science Lab' },
      { sub: 'Sindhi Literature Poetry', teacher: 'Molana Hafiz Niaz', room: 'Room 103' },
      { sub: 'Social Studies: Adam Doki History', teacher: 'Sir Abdul Jabbar', room: 'Room 103' },
      { sub: 'Islamiat: Hadith Nabawi', teacher: 'Molana Hafiz Niaz', room: 'Room 103' },
    ],
    Thu: [
      { sub: 'English: Nouns, Verbs & Adjectives', teacher: 'Madam Samina Kousar', room: 'Room 103' },
      { sub: 'Mathematics: Geometry & Angles', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 103' },
      { sub: 'General Science: States of Matter', teacher: 'Madam Farhat Bano', room: 'Room 103' },
      { sub: 'Sindhi Workbook & Questions', teacher: 'Molana Hafiz Niaz', room: 'Room 103' },
      { sub: 'Drawing & Crafting Project', teacher: 'Madam Ruqayya', room: 'Art Studio' },
      { sub: 'Library & Silent Reading', teacher: 'Librarian', room: 'Library' },
    ],
    Fri: [
      { sub: 'Mathematics Times Table Championship', teacher: 'Sir Ghulam Mustafa', room: 'Room 103' },
      { sub: 'English Spelling Bee', teacher: 'Madam Samina Kousar', room: 'Room 103' },
      { sub: 'Science Observation Log', teacher: 'Madam Farhat Bano', room: 'Room 103' },
    ],
    Sat: [
      { sub: 'Weekly Curriculum Test', teacher: 'Class Incharge', room: 'Room 103' },
      { sub: 'Outdoor Sports & Games', teacher: 'Coach Zulfiqar', room: 'Grounds' },
    ]
  }),

  'Grade 4': createGradeWeeklyTimetable('Grade 4', {
    Mon: [
      { sub: 'Mathematics: Long Division & Factors', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 104' },
      { sub: 'English: Tenses & Active Voice', teacher: 'Madam Samina Kousar', room: 'Room 104' },
      { sub: 'General Science: Digestive System', teacher: 'Madam Farhat Bano', room: 'Junior Lab' },
      { sub: 'Sindhi Chothween Kitab', teacher: 'Molana Hafiz Niaz', room: 'Room 104' },
      { sub: 'Social Studies: Geography of Sindh', teacher: 'Sir Abdul Jabbar', room: 'Room 104' },
      { sub: 'Computer Studies: Windows & Office', teacher: 'Engr. Kashif Bhutto', room: 'CS Lab 2' },
    ],
    Tue: [
      { sub: 'General Science: Ecosystems & Food Chains', teacher: 'Madam Farhat Bano', room: 'Room 104' },
      { sub: 'Mathematics: Fractions & Decimals', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 104' },
      { sub: 'English: Composition & Letter Writing', teacher: 'Madam Samina Kousar', room: 'Room 104' },
      { sub: 'Sindhi Grammar & Comprehension', teacher: 'Molana Hafiz Niaz', room: 'Room 104' },
      { sub: 'Social Studies: Climate of Pakistan', teacher: 'Sir Abdul Jabbar', room: 'Room 104' },
      { sub: 'Physical Sports & Football', teacher: 'Coach Zulfiqar', room: 'Grounds' },
    ],
    Wed: [
      { sub: 'Mathematics: Perimeter & Area', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 104' },
      { sub: 'English: Poetry & Literary Devices', teacher: 'Madam Samina Kousar', room: 'Room 104' },
      { sub: 'General Science: Simple Machines (Levers & Pulleys)', teacher: 'Madam Farhat Bano', room: 'Junior Lab' },
      { sub: 'Sindhi Chothween Kitab', teacher: 'Molana Hafiz Niaz', room: 'Room 104' },
      { sub: 'Computer Science: Scratch Coding Basics', teacher: 'Engr. Kashif Bhutto', room: 'CS Lab 2' },
      { sub: 'Islamiat: Islamic History & Khulafa', teacher: 'Molana Hafiz Niaz', room: 'Room 104' },
    ],
    Thu: [
      { sub: 'English: Direct Speech & Dialogue', teacher: 'Madam Samina Kousar', room: 'Room 104' },
      { sub: 'Mathematics: Data Handling & Bar Graphs', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 104' },
      { sub: 'General Science: Electricity & Circuits', teacher: 'Madam Farhat Bano', room: 'Junior Lab' },
      { sub: 'Sindhi Poetry Recitation', teacher: 'Molana Hafiz Niaz', room: 'Room 104' },
      { sub: 'Social Studies: Natural Resources of Pakistan', teacher: 'Sir Abdul Jabbar', room: 'Room 104' },
      { sub: 'Library & General Knowledge Quiz', teacher: 'Librarian', room: 'Library' },
    ],
    Fri: [
      { sub: 'Mathematics Quiz', teacher: 'Sir Ghulam Mustafa', room: 'Room 104' },
      { sub: 'English Essay Writing', teacher: 'Madam Samina Kousar', room: 'Room 104' },
      { sub: 'Science Experiment Demo', teacher: 'Madam Farhat Bano', room: 'Junior Lab' },
    ],
    Sat: [
      { sub: 'Weekly Progress Exam', teacher: 'Examination Team', room: 'Room 104' },
      { sub: 'Robotics Demo & Art Projects', teacher: 'Engr. Kashif Bhutto', room: 'Lab' },
    ]
  }),

  'Grade 5': createGradeWeeklyTimetable('Grade 5', {
    Mon: [
      { sub: 'Mathematics: HCF, LCM & Fractions', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 105' },
      { sub: 'General Science: Human Organ Systems', teacher: 'Madam Farhat Bano', room: 'Room 105' },
      { sub: 'English: Advanced Grammar & Essays', teacher: 'Madam Samina Kousar', room: 'Room 105' },
      { sub: 'Sindhi Panjween Kitab', teacher: 'Molana Hafiz Niaz', room: 'Room 105' },
      { sub: 'Social Studies: Ancient Indus Civilization', teacher: 'Sir Abdul Jabbar', room: 'Room 105' },
      { sub: 'Computer Science: Internet & Spreadsheets', teacher: 'Engr. Kashif Bhutto', room: 'CS Lab 1' },
    ],
    Tue: [
      { sub: 'General Science: Microorganisms & Health', teacher: 'Madam Farhat Bano', room: 'Science Lab' },
      { sub: 'Mathematics: Ratio, Proportion & Percentages', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 105' },
      { sub: 'English Comprehension & Vocabulary', teacher: 'Madam Samina Kousar', room: 'Room 105' },
      { sub: 'Urdu Language & Composition', teacher: 'Molana Hafiz Niaz', room: 'Room 105' },
      { sub: 'Social Studies: Provinces of Pakistan', teacher: 'Sir Abdul Jabbar', room: 'Room 105' },
      { sub: 'Physical Education & Cricket Training', teacher: 'Coach Zulfiqar', room: 'Sports Complex' },
    ],
    Wed: [
      { sub: 'Mathematics: Practical Geometry & Triangles', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 105' },
      { sub: 'English: Formal Letter & Story Writing', teacher: 'Madam Samina Kousar', room: 'Room 105' },
      { sub: 'General Science: Environmental Changes', teacher: 'Madam Farhat Bano', room: 'Science Lab' },
      { sub: 'Sindhi Literature: Shah Abdul Latif Stories', teacher: 'Molana Hafiz Niaz', room: 'Room 105' },
      { sub: 'Computer Science: Basic Web Concepts', teacher: 'Engr. Kashif Bhutto', room: 'CS Lab 1' },
      { sub: 'Islamiat: Seerat-un-Nabi (PBUH)', teacher: 'Molana Hafiz Niaz', room: 'Room 105' },
    ],
    Thu: [
      { sub: 'English: Speech & Debate Practice', teacher: 'Madam Samina Kousar', room: 'Auditorium' },
      { sub: 'Mathematics: Distance, Time & Speed', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 105' },
      { sub: 'General Science: Solar System & Satellites', teacher: 'Madam Farhat Bano', room: 'Room 105' },
      { sub: 'Sindhi Grammar: Prepositions & Clauses', teacher: 'Molana Hafiz Niaz', room: 'Room 105' },
      { sub: 'Social Studies: Government & Democracy', teacher: 'Sir Abdul Jabbar', room: 'Room 105' },
      { sub: 'Library Research & Documentaries', teacher: 'Librarian', room: 'Library' },
    ],
    Fri: [
      { sub: 'Mathematics Board Model Paper Drill', teacher: 'Sir Ghulam Mustafa', room: 'Room 105' },
      { sub: 'English Grammar Review', teacher: 'Madam Samina Kousar', room: 'Room 105' },
      { sub: 'Science Practical Observation', teacher: 'Madam Farhat Bano', room: 'Science Lab' },
    ],
    Sat: [
      { sub: 'Weekly Board Simulation Test', teacher: 'Examination Cell', room: 'Main Hall' },
      { sub: 'Co-Curricular Clubs & Athletics', teacher: 'Club Incharges', room: 'Campus' },
    ]
  }),

  'Grade 6': createGradeWeeklyTimetable('Grade 6', {
    Mon: [
      { sub: 'Mathematics: Sets & Number Operations', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 206' },
      { sub: 'General Science: Cellular Organization', teacher: 'Madam Farhat Bano', room: 'Science Lab' },
      { sub: 'English Literature: The Indus Tale', teacher: 'Madam Samina Kousar', room: 'Room 206' },
      { sub: 'Sindhi Chahween Kitab', teacher: 'Molana Hafiz Niaz', room: 'Room 206' },
      { sub: 'Geography: Earth as a Planet & Continents', teacher: 'Sir Abdul Jabbar', room: 'Room 206' },
      { sub: 'Computer Science: Logic & Algorithms', teacher: 'Engr. Kashif Bhutto', room: 'CS Lab 1' },
    ],
    Tue: [
      { sub: 'General Science: Sense Organs in Humans', teacher: 'Madam Farhat Bano', room: 'Science Lab' },
      { sub: 'Mathematics: Integers & Number Line', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 206' },
      { sub: 'English: Direct/Indirect Speech', teacher: 'Madam Samina Kousar', room: 'Room 206' },
      { sub: 'History: Ancient Civilizations (Mohenjo-daro)', teacher: 'Sir Abdul Jabbar', room: 'Room 206' },
      { sub: 'Sindhi Grammar & Composition', teacher: 'Molana Hafiz Niaz', room: 'Room 206' },
      { sub: 'Physical Sports & Athletics', teacher: 'Coach Zulfiqar', room: 'Grounds' },
    ],
    Wed: [
      { sub: 'Mathematics: Algebraic Expressions Intro', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 206' },
      { sub: 'English: Essay & Summary Writing', teacher: 'Madam Samina Kousar', room: 'Room 206' },
      { sub: 'General Science: Photosynthesis Lab', teacher: 'Madam Farhat Bano', room: 'Science Lab' },
      { sub: 'Computer Science: Flowcharts & Python Intro', teacher: 'Engr. Kashif Bhutto', room: 'CS Lab 1' },
      { sub: 'Sindhi Literature Poetry Analysis', teacher: 'Molana Hafiz Niaz', room: 'Room 206' },
      { sub: 'Islamiat: Pillars of Faith & Morality', teacher: 'Molana Hafiz Niaz', room: 'Room 206' },
    ],
    Thu: [
      { sub: 'General Science: Matter & States (Atoms)', teacher: 'Madam Zainab Abbasi', room: 'Chemistry Lab' },
      { sub: 'Mathematics: Linear Equations in One Variable', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 206' },
      { sub: 'English: Comprehension & Precision', teacher: 'Madam Samina Kousar', room: 'Room 206' },
      { sub: 'Geography: Weather, Climate & Monsoon', teacher: 'Sir Abdul Jabbar', room: 'Room 206' },
      { sub: 'Sindhi Prose & Critical Questions', teacher: 'Molana Hafiz Niaz', room: 'Room 206' },
      { sub: 'Debating Society & Public Speaking', teacher: 'Madam Samina Kousar', room: 'Auditorium' },
    ],
    Fri: [
      { sub: 'Mathematics Problem Solving Drill', teacher: 'Sir Ghulam Mustafa', room: 'Room 206' },
      { sub: 'English Vocabulary & Spellings', teacher: 'Madam Samina Kousar', room: 'Room 206' },
      { sub: 'Science Practical Workbook Review', teacher: 'Madam Farhat Bano', room: 'Science Lab' },
    ],
    Sat: [
      { sub: 'Weekly Formative Assessment', teacher: 'Examination Committee', room: 'Room 206' },
      { sub: 'Robotics Club & Football League', teacher: 'Mentors', room: 'Grounds / Lab' },
    ]
  }),

  'Grade 7': createGradeWeeklyTimetable('Grade 7', {
    Mon: [
      { sub: 'Mathematics: Real Numbers & Exponents', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 207' },
      { sub: 'General Science: Human Respiratory System', teacher: 'Madam Farhat Bano', room: 'Bio Lab' },
      { sub: 'English Language: Clauses & Sentence Craft', teacher: 'Madam Samina Kousar', room: 'Room 207' },
      { sub: 'Sindhi Satween Kitab', teacher: 'Molana Hafiz Niaz', room: 'Room 207' },
      { sub: 'History: Mughal Dynasty in South Asia', teacher: 'Sir Abdul Jabbar', room: 'Room 207' },
      { sub: 'Computer Science: Programming Concepts', teacher: 'Engr. Kashif Bhutto', room: 'CS Lab 1' },
    ],
    Tue: [
      { sub: 'General Science: Atomic Structure & Bonding', teacher: 'Madam Zainab Abbasi', room: 'Chemistry Lab' },
      { sub: 'Mathematics: Algebraic Identities & Formulas', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 207' },
      { sub: 'English: Literature Analysis & Character Study', teacher: 'Madam Samina Kousar', room: 'Room 207' },
      { sub: 'Geography: Rivers & Irrigation System of Indus', teacher: 'Sir Abdul Jabbar', room: 'Room 207' },
      { sub: 'Sindhi Grammar & Formal Letters', teacher: 'Molana Hafiz Niaz', room: 'Room 207' },
      { sub: 'Physical Education & Badminton', teacher: 'Coach Zulfiqar', room: 'Sports Complex' },
    ],
    Wed: [
      { sub: 'Mathematics: Practical Geometry & Constructions', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 207' },
      { sub: 'English: Creative Essays & Articles', teacher: 'Madam Samina Kousar', room: 'Room 207' },
      { sub: 'General Science: Dispersion of Light & Mirrors', teacher: 'Sir Abdul Jabbar Memon', room: 'Physics Lab' },
      { sub: 'Computer Science: HTML & Web Fundamentals', teacher: 'Engr. Kashif Bhutto', room: 'CS Lab 1' },
      { sub: 'Sindhi Prose & Classical Poets', teacher: 'Molana Hafiz Niaz', room: 'Room 207' },
      { sub: 'Islamiat: Islamic Law, Justice & Brotherhood', teacher: 'Molana Hafiz Niaz', room: 'Room 207' },
    ],
    Thu: [
      { sub: 'General Science: Sound Waves & Echoes', teacher: 'Sir Abdul Jabbar Memon', room: 'Physics Lab' },
      { sub: 'Mathematics: Financial Arithmetic (Tax & Zakat)', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 207' },
      { sub: 'English: Dialogue Delivery & Drama', teacher: 'Madam Samina Kousar', room: 'Auditorium' },
      { sub: 'History: European Travelers in Sindh', teacher: 'Sir Abdul Jabbar', room: 'Room 207' },
      { sub: 'Sindhi Essay Writing', teacher: 'Molana Hafiz Niaz', room: 'Room 207' },
      { sub: 'Library Research & Science Atlas', teacher: 'Librarian', room: 'Library' },
    ],
    Fri: [
      { sub: 'Mathematics Speed Calculation Drill', teacher: 'Sir Ghulam Mustafa', room: 'Room 207' },
      { sub: 'English Language Mechanics', teacher: 'Madam Samina Kousar', room: 'Room 207' },
      { sub: 'Science Laboratory Experiment Session', teacher: 'Faculty', room: 'Labs' },
    ],
    Sat: [
      { sub: 'Weekly Competitive Test', teacher: 'Examination Cell', room: 'Room 207' },
      { sub: 'Inter-House Volleyball & STEM Workshop', teacher: 'Instructors', room: 'Campus' },
    ]
  }),

  'Grade 8': createGradeWeeklyTimetable('Grade 8', {
    Mon: [
      { sub: 'Mathematics: Operations on Sets & Venn Diagrams', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 208' },
      { sub: 'General Science: Ecology & Biogeochemical Cycles', teacher: 'Madam Farhat Bano', room: 'Bio Lab' },
      { sub: 'English: Pre-Matric Grammar & Rhetoric', teacher: 'Madam Samina Kousar', room: 'Room 208' },
      { sub: 'Sindhi Athween Kitab', teacher: 'Molana Hafiz Niaz', room: 'Room 208' },
      { sub: 'History: British Rule & Sindh Conquest (1843)', teacher: 'Sir Abdul Jabbar', room: 'Room 208' },
      { sub: 'Computer Science: Python Data Structures', teacher: 'Engr. Kashif Bhutto', room: 'CS Lab 1' },
    ],
    Tue: [
      { sub: 'General Science: Chemical Reactions & Balancing Equations', teacher: 'Madam Zainab Abbasi', room: 'Chemistry Lab' },
      { sub: 'Mathematics: Simultaneous Linear Equations', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 208' },
      { sub: 'English Literature: Shakespeare & Classical Prose', teacher: 'Madam Samina Kousar', room: 'Room 208' },
      { sub: 'Geography: Topography & Minerals of Pakistan', teacher: 'Sir Abdul Jabbar', room: 'Room 208' },
      { sub: 'Sindhi Composition & Argumentative Essays', teacher: 'Molana Hafiz Niaz', room: 'Room 208' },
      { sub: 'Physical Education & Cricket Coaching', teacher: 'Coach Zulfiqar', room: 'Grounds' },
    ],
    Wed: [
      { sub: 'Mathematics: Factorization & Algebraic Fractions', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 208' },
      { sub: 'English: Formal Correspondence & Reports', teacher: 'Madam Samina Kousar', room: 'Room 208' },
      { sub: 'General Science: Pressure, Force & Hydraulics', teacher: 'Sir Abdul Jabbar Memon', room: 'Physics Lab' },
      { sub: 'Computer Science: Database Design & SQL', teacher: 'Engr. Kashif Bhutto', room: 'CS Lab 1' },
      { sub: 'Sindhi Poetry: Sachal Sarmast & Sami', teacher: 'Molana Hafiz Niaz', room: 'Room 208' },
      { sub: 'Islamiat: Islamic Economics & Human Rights', teacher: 'Molana Hafiz Niaz', room: 'Room 208' },
    ],
    Thu: [
      { sub: 'General Science: Acids, Alkalis & Indicators Lab', teacher: 'Madam Zainab Abbasi', room: 'Chemistry Lab' },
      { sub: 'Mathematics: Circles, Chords & Tangents', teacher: 'Sir Ghulam Mustafa Solangi', room: 'Room 208' },
      { sub: 'English: Active to Passive Voice in Complex Tenses', teacher: 'Madam Samina Kousar', room: 'Room 208' },
      { sub: 'History: Pakistan Movement Foundations (Sir Syed)', teacher: 'Sir Abdul Jabbar', room: 'Room 208' },
      { sub: 'Sindhi Comprehension & Translation', teacher: 'Molana Hafiz Niaz', room: 'Room 208' },
      { sub: 'Model United Nations & Debate Coaching', teacher: 'Madam Samina Kousar', room: 'Auditorium' },
    ],
    Fri: [
      { sub: 'Mathematics Board Preparation Mock', teacher: 'Sir Ghulam Mustafa', room: 'Room 208' },
      { sub: 'English Writing Precision', teacher: 'Madam Samina Kousar', room: 'Room 208' },
      { sub: 'Integrated Science Lab Practical', teacher: 'Science Staff', room: 'Labs' },
    ],
    Sat: [
      { sub: 'Pre-Matric Baseline Assessment', teacher: 'Examination Cell', room: 'Room 208' },
      { sub: 'Robotics Team Challenge & Athletics', teacher: 'Coaches', room: 'Complex' },
    ]
  }),
};

// -------------------------------------------------------------
// STUDENTS FOR GRADES 1 TO 8
// -------------------------------------------------------------
export const STUDENTS_GRADES_1_TO_8: Student[] = [
  // Grade 1
  {
    id: 'IBFS-2024-0101',
    rollNumber: '01-05',
    fullName: 'Anaya Ali Mahar',
    gender: 'Female',
    grade: 'Grade 1',
    section: 'A',
    dateOfBirth: '2018-03-12',
    enrollmentDate: '2024-04-15',
    bloodGroup: 'B+',
    bFormNumber: '45203-8192031-2',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
    guardian: {
      fatherName: 'Ali Nawaz Mahar',
      fatherOccupation: 'Agronomist & Landowner',
      fatherCnic: '45203-1928374-1',
      motherName: 'Zubaida Mahar',
      primaryPhone: '+92 301 2894101',
      whatsappNumber: '+92 301 2894101',
      email: 'ali.mahar@agri.com',
      residentialAddress: 'Mahar House, Canal Road, Adam Doki',
      emergencyContact: '+92 302 9918234',
      relation: 'Father',
    },
    attendancePercentage: 98.0,
    recentAttendanceStatus: 'Present',
    termResults: {
      termName: 'Mid-Term Progress Card 2024',
      academicYear: '2024-2025',
      subjects: [
        { subjectName: 'Early Mathematics', maxMarks: 50, obtainedMarks: 49, grade: 'A+', teacherRemarks: 'Exceptional counting and shape sorting.' },
        { subjectName: 'English Phonics', maxMarks: 50, obtainedMarks: 48, grade: 'A+', teacherRemarks: 'Fluent letter pronunciation.' },
        { subjectName: 'Sindhi Pehli Kitab', maxMarks: 50, obtainedMarks: 47, grade: 'A+', teacherRemarks: 'Recites nursery rhymes beautifully.' },
        { subjectName: 'General Knowledge', maxMarks: 50, obtainedMarks: 50, grade: 'A+', teacherRemarks: 'Knows all colors, animals, and body parts.' },
        { subjectName: 'Art & Coloring', maxMarks: 50, obtainedMarks: 48, grade: 'A+', teacherRemarks: 'Very neat pencil grip and creative drawing.' },
      ],
      totalMarks: 250,
      obtainedMarks: 242,
      percentage: 96.8,
      overallGrade: 'A+ (Outstanding)',
      classRank: 1,
      conduct: 'Joyful, respectful, highly attentive in morning circle time.',
      teacherRemarks: 'Anaya is a brilliant young learner who brings brightness to the classroom.',
      headmasterSignature: 'Ghulam Mustafa Solangi (Principal)',
    },
    feeStatus: {
      monthlyTuition: 3500,
      transportCharges: 1000,
      annualFunds: 800,
      currentMonthStatus: 'Paid',
      dueDate: '2024-10-10',
      lastPaymentReceiptNo: 'RCP-IBFS-98110',
    }
  },

  // Grade 2
  {
    id: 'IBFS-2024-0202',
    rollNumber: '02-14',
    fullName: 'Ayesha Noor Memon',
    gender: 'Female',
    grade: 'Grade 2',
    section: 'A',
    dateOfBirth: '2017-06-25',
    enrollmentDate: '2023-04-10',
    bloodGroup: 'O+',
    bFormNumber: '45203-7182904-4',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    guardian: {
      fatherName: 'Dr. Tariq Noor Memon',
      fatherOccupation: 'Medical Officer, Taluka Hospital',
      fatherCnic: '45203-8829104-3',
      motherName: 'Dr. Saima Tariq',
      primaryPhone: '+92 300 3918205',
      whatsappNumber: '+92 300 3918205',
      email: 'tariq.memon.md@gmail.com',
      residentialAddress: 'Hospital Officers Colony, Block B, Adam Doki',
      emergencyContact: '+92 300 9988112',
      relation: 'Father',
    },
    attendancePercentage: 96.5,
    recentAttendanceStatus: 'Present',
    termResults: {
      termName: 'Mid-Term Progress Card 2024',
      academicYear: '2024-2025',
      subjects: [
        { subjectName: 'Mathematics', maxMarks: 100, obtainedMarks: 94, grade: 'A+', teacherRemarks: 'Fast at mental addition and clock reading.' },
        { subjectName: 'English', maxMarks: 100, obtainedMarks: 92, grade: 'A+', teacherRemarks: 'Reads storybooks with good expression.' },
        { subjectName: 'Sindhi Biyee Kitab', maxMarks: 100, obtainedMarks: 90, grade: 'A+', teacherRemarks: 'Neat handwriting in Sindhi Nastaliq.' },
        { subjectName: 'General Knowledge', maxMarks: 50, obtainedMarks: 48, grade: 'A+', teacherRemarks: 'Understands basic plant and animal life.' },
        { subjectName: 'Islamiat', maxMarks: 50, obtainedMarks: 49, grade: 'A+', teacherRemarks: 'Has memorized five daily prayers and Kalmas.' },
      ],
      totalMarks: 400,
      obtainedMarks: 373,
      percentage: 93.25,
      overallGrade: 'A+ (Outstanding)',
      classRank: 2,
      conduct: 'Well-mannered, punctual, always eager to help classmates.',
      teacherRemarks: 'Ayesha is an exemplary student with high academic dedication.',
      headmasterSignature: 'Ghulam Mustafa Solangi (Principal)',
    },
    feeStatus: {
      monthlyTuition: 3600,
      transportCharges: 1000,
      annualFunds: 800,
      currentMonthStatus: 'Paid',
      dueDate: '2024-10-10',
      lastPaymentReceiptNo: 'RCP-IBFS-98124',
    }
  },

  // Grade 3
  {
    id: 'IBFS-2024-0303',
    rollNumber: '03-08',
    fullName: 'Farhan Ali Channa',
    gender: 'Male',
    grade: 'Grade 3',
    section: 'A',
    dateOfBirth: '2016-09-14',
    enrollmentDate: '2022-04-12',
    bloodGroup: 'A+',
    bFormNumber: '45203-9182746-1',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    guardian: {
      fatherName: 'Manzoor Hussain Channa',
      fatherOccupation: 'Irrigation Department Engineer',
      fatherCnic: '45203-3918274-7',
      motherName: 'Parveen Channa',
      primaryPhone: '+92 303 4819203',
      whatsappNumber: '+92 303 4819203',
      email: 'manzoor.channa@sindhirrigation.gov.pk',
      residentialAddress: 'Irrigation Colony, Canal Headworks, Adam Doki',
      emergencyContact: '+92 304 9918273',
      relation: 'Father',
    },
    attendancePercentage: 93.0,
    recentAttendanceStatus: 'Present',
    termResults: {
      termName: 'Mid-Term Progress Card 2024',
      academicYear: '2024-2025',
      subjects: [
        { subjectName: 'Mathematics', maxMarks: 100, obtainedMarks: 88, grade: 'A', teacherRemarks: 'Good multiplication tables grasp; practice division.' },
        { subjectName: 'General Science', maxMarks: 100, obtainedMarks: 91, grade: 'A+', teacherRemarks: 'Loves science experiments and drawing cycles.' },
        { subjectName: 'English', maxMarks: 100, obtainedMarks: 85, grade: 'A', teacherRemarks: 'Good vocabulary; practice paragraph writing.' },
        { subjectName: 'Sindhi Tiyee Kitab', maxMarks: 75, obtainedMarks: 67, grade: 'A', teacherRemarks: 'Good comprehension of folk stories.' },
        { subjectName: 'Social Studies', maxMarks: 75, obtainedMarks: 68, grade: 'A', teacherRemarks: 'Knows cardinal directions and map reading.' },
        { subjectName: 'Islamiat', maxMarks: 50, obtainedMarks: 46, grade: 'A+', teacherRemarks: 'Respectful student with good Islamic etiquette.' },
      ],
      totalMarks: 500,
      obtainedMarks: 445,
      percentage: 89.0,
      overallGrade: 'A (Excellent)',
      classRank: 3,
      conduct: 'Friendly, active in school assembly recitations and games.',
      teacherRemarks: 'Farhan shows steady intellectual curiosity. Very strong in science concepts.',
      headmasterSignature: 'Ghulam Mustafa Solangi (Principal)',
    },
    feeStatus: {
      monthlyTuition: 3800,
      transportCharges: 1100,
      annualFunds: 900,
      currentMonthStatus: 'Paid',
      dueDate: '2024-10-10',
      lastPaymentReceiptNo: 'RCP-IBFS-98135',
    }
  },

  // Grade 4
  {
    id: 'IBFS-2024-0404',
    rollNumber: '04-11',
    fullName: 'Zeeshan Haider Soomro',
    gender: 'Male',
    grade: 'Grade 4',
    section: 'A',
    dateOfBirth: '2015-04-03',
    enrollmentDate: '2021-04-15',
    bloodGroup: 'B-',
    bFormNumber: '45203-1029384-5',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    guardian: {
      fatherName: 'Ghulam Haider Soomro',
      fatherOccupation: 'Lawyer (Advocate High Court)',
      fatherCnic: '45203-5519283-9',
      motherName: 'Najma Soomro',
      primaryPhone: '+92 300 4819201',
      whatsappNumber: '+92 300 4819201',
      email: 'advocate.haider@soomrolaw.pk',
      residentialAddress: 'Court Road, Near District Bar Council, Adam Doki',
      emergencyContact: '+92 301 9928192',
      relation: 'Father',
    },
    attendancePercentage: 95.0,
    recentAttendanceStatus: 'Present',
    termResults: {
      termName: 'Mid-Term Progress Card 2024',
      academicYear: '2024-2025',
      subjects: [
        { subjectName: 'Mathematics', maxMarks: 100, obtainedMarks: 90, grade: 'A+', teacherRemarks: 'High accuracy in fractions and perimeter.' },
        { subjectName: 'General Science', maxMarks: 100, obtainedMarks: 89, grade: 'A', teacherRemarks: 'Excellent diagram of human digestive system.' },
        { subjectName: 'English', maxMarks: 100, obtainedMarks: 91, grade: 'A+', teacherRemarks: 'Strong debate participant with clear diction.' },
        { subjectName: 'Sindhi Chothween Kitab', maxMarks: 75, obtainedMarks: 69, grade: 'A+', teacherRemarks: 'Fluent reading and comprehension.' },
        { subjectName: 'Social Studies', maxMarks: 75, obtainedMarks: 67, grade: 'A', teacherRemarks: 'Detailed project on Sindh agriculture.' },
        { subjectName: 'Computer Studies', maxMarks: 50, obtainedMarks: 47, grade: 'A+', teacherRemarks: 'Enthusiastic in basic Scratch code creation.' },
      ],
      totalMarks: 500,
      obtainedMarks: 453,
      percentage: 90.6,
      overallGrade: 'A+ (Outstanding)',
      classRank: 2,
      conduct: 'Leadership qualities, monitors classroom discipline effectively.',
      teacherRemarks: 'Zeeshan has shown outstanding progress in English and Mathematics.',
      headmasterSignature: 'Ghulam Mustafa Solangi (Principal)',
    },
    feeStatus: {
      monthlyTuition: 3900,
      transportCharges: 1100,
      annualFunds: 900,
      currentMonthStatus: 'Paid',
      dueDate: '2024-10-10',
      lastPaymentReceiptNo: 'RCP-IBFS-98146',
    }
  },

  // Grade 6
  {
    id: 'IBFS-2024-0606',
    rollNumber: '06-15',
    fullName: 'Arsalan Shah Bukhari',
    gender: 'Male',
    grade: 'Grade 6',
    section: 'A',
    dateOfBirth: '2013-11-20',
    enrollmentDate: '2020-04-10',
    bloodGroup: 'AB+',
    bFormNumber: '45203-3918274-2',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    guardian: {
      fatherName: 'Syed Qaim Ali Shah',
      fatherOccupation: 'College Professor of Chemistry',
      fatherCnic: '45203-2918273-5',
      motherName: 'Syeda Batool',
      primaryPhone: '+92 301 9918274',
      whatsappNumber: '+92 301 9918274',
      email: 'prof.qaimshah@degreecollege.edu.pk',
      residentialAddress: 'Professors Colony, College Road, Adam Doki',
      emergencyContact: '+92 300 8819203',
      relation: 'Father',
    },
    attendancePercentage: 97.2,
    recentAttendanceStatus: 'Present',
    termResults: {
      termName: 'Mid-Term Examination 2024',
      academicYear: '2024-2025',
      subjects: [
        { subjectName: 'Mathematics', maxMarks: 100, obtainedMarks: 95, grade: 'A+', teacherRemarks: 'Remarkable speed in algebraic equations and sets.' },
        { subjectName: 'General Science', maxMarks: 100, obtainedMarks: 94, grade: 'A+', teacherRemarks: 'High distinction in microscope observation and cell biology.' },
        { subjectName: 'English', maxMarks: 100, obtainedMarks: 90, grade: 'A+', teacherRemarks: 'Very good vocabulary and essay coherence.' },
        { subjectName: 'Computer Science', maxMarks: 100, obtainedMarks: 96, grade: 'A+', teacherRemarks: 'Top performer in algorithm logic and Python basics.' },
        { subjectName: 'Geography & History', maxMarks: 75, obtainedMarks: 69, grade: 'A+', teacherRemarks: 'Extensive knowledge of Mohenjo-daro architecture.' },
        { subjectName: 'Sindhi Literature', maxMarks: 75, obtainedMarks: 70, grade: 'A+', teacherRemarks: 'Eloquent recitation of Shah Latif surs.' },
      ],
      totalMarks: 550,
      obtainedMarks: 514,
      percentage: 93.45,
      overallGrade: 'A+ (Outstanding)',
      classRank: 1,
      conduct: 'Diligent, analytical, respectful of all faculty members.',
      teacherRemarks: 'Arsalan has brilliant scientific instincts. A future engineering or medicine aspirant.',
      headmasterSignature: 'Ghulam Mustafa Solangi (Principal)',
    },
    feeStatus: {
      monthlyTuition: 4100,
      transportCharges: 1200,
      annualFunds: 1000,
      currentMonthStatus: 'Paid',
      dueDate: '2024-10-10',
      lastPaymentReceiptNo: 'RCP-IBFS-98160',
    }
  },

  // Grade 7
  {
    id: 'IBFS-2024-0707',
    rollNumber: '07-03',
    fullName: 'Shayan Ahmed Solangi',
    gender: 'Male',
    grade: 'Grade 7',
    section: 'A',
    dateOfBirth: '2012-05-18',
    enrollmentDate: '2024-09-21',
    bloodGroup: 'A+',
    bFormNumber: '45203-8819283-7',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    guardian: {
      fatherName: 'Naveed Ahmed Solangi',
      fatherOccupation: 'Senior Revenue Officer (Mukhtiarkar Office)',
      fatherCnic: '45203-2918239-1',
      motherName: 'Shazia Solangi',
      primaryPhone: '+92 301 3918204',
      whatsappNumber: '+92 301 3918204',
      email: 'naveed.solangi@sindh.gov.pk',
      residentialAddress: 'Revenue Officers Colony, Behind Session Court, Adam Doki',
      emergencyContact: '+92 302 4491029',
      relation: 'Father',
    },
    attendancePercentage: 96.0,
    recentAttendanceStatus: 'Present',
    termResults: {
      termName: 'Mid-Term Examination 2024',
      academicYear: '2024-2025',
      subjects: [
        { subjectName: 'Mathematics', maxMarks: 100, obtainedMarks: 89, grade: 'A', teacherRemarks: 'Strong proofs in geometric theorems and factoring.' },
        { subjectName: 'General Science', maxMarks: 100, obtainedMarks: 91, grade: 'A+', teacherRemarks: 'Thorough understanding of atomic structures and bonds.' },
        { subjectName: 'English', maxMarks: 100, obtainedMarks: 87, grade: 'A', teacherRemarks: 'Well-structured essays with diverse vocabulary.' },
        { subjectName: 'Computer Science', maxMarks: 100, obtainedMarks: 93, grade: 'A+', teacherRemarks: 'Excels in web page markup (HTML) and logic.' },
        { subjectName: 'History & Geography', maxMarks: 75, obtainedMarks: 68, grade: 'A+', teacherRemarks: 'In-depth insight into the Indus irrigation system.' },
        { subjectName: 'Sindhi Satween Kitab', maxMarks: 75, obtainedMarks: 71, grade: 'A+', teacherRemarks: 'Superb classical literary appreciation.' },
        { subjectName: 'Islamiat', maxMarks: 75, obtainedMarks: 70, grade: 'A+', teacherRemarks: 'Deep knowledge of early Islamic jurisprudence.' },
      ],
      totalMarks: 625,
      obtainedMarks: 569,
      percentage: 91.04,
      overallGrade: 'A+ (Outstanding)',
      classRank: 2,
      conduct: 'Highly disciplined, active in STEM science exhibitions.',
      teacherRemarks: 'Shayan is an exceptional student who adjusted quickly and shines in science.',
      headmasterSignature: 'Ghulam Mustafa Solangi (Principal)',
    },
    feeStatus: {
      monthlyTuition: 4200,
      transportCharges: 1200,
      annualFunds: 1000,
      currentMonthStatus: 'Paid',
      dueDate: '2024-10-10',
      lastPaymentReceiptNo: 'RCP-IBFS-98175',
    }
  }
];

// -------------------------------------------------------------
// COURSE BOOKS FOR GRADES 1 TO 8
// -------------------------------------------------------------
export const COURSE_BOOKS_GRADES_1_TO_8: CourseBook[] = [
  // Grade 1
  {
    id: 'CB-01-MATH',
    title: 'Primary Mathematics for Grade 1 (National Curriculum)',
    subject: 'Mathematics',
    grade: 'Grade 1',
    author: 'Primary Education Curriculum Wing',
    publisher: 'Sindh Textbook Board, Jamshoro',
    edition: '2024 Single National Curriculum',
    totalChapters: 8,
    coverColor: 'from-amber-500 to-orange-700',
    keyTopics: ['Numbers 1 to 100', 'Basic Addition & Subtraction', 'Comparing Sizes & Heights', '2D Shapes & Coins', 'Telling Time on Clock'],
  },
  {
    id: 'CB-01-ENG',
    title: 'English Primer & Phonics Workbook (Grade 1)',
    subject: 'English',
    grade: 'Grade 1',
    author: 'Early Literacy Specialist Panel',
    publisher: 'Sindh Textbook Board & Oxford Press',
    edition: '2024 Edition',
    totalChapters: 10,
    coverColor: 'from-sky-500 to-blue-700',
    keyTopics: ['Letter Sounds & Phonics Blends', 'CVC Words (Cat, Dog, Sun)', 'Sight Words & Rhymes', 'Naming Words & Actions', 'Simple Daily Greetings'],
  },
  {
    id: 'CB-01-SND',
    title: 'Sindhi Pehli Kitab (Qaida & Reader)',
    subject: 'Sindhi',
    grade: 'Grade 1',
    author: 'Sindhi Adabi Board & STBB Committee',
    publisher: 'Sindh Textbook Board, Jamshoro',
    edition: '2024 Colorful Edition',
    totalChapters: 12,
    coverColor: 'from-emerald-500 to-teal-700',
    keyTopics: ['Sindhi Alphabet (Alif to Yay)', 'Letter Shapes & Dots', 'Animals & Fruit Names in Sindhi', 'Moral Rhymes & Folk Verses'],
  },

  // Grade 2
  {
    id: 'CB-02-MATH',
    title: 'Primary Mathematics for Class II',
    subject: 'Mathematics',
    grade: 'Grade 2',
    author: 'Prof. Mumtaz Ali & Team',
    publisher: 'Sindh Textbook Board, Jamshoro',
    edition: '2024 Edition',
    totalChapters: 9,
    coverColor: 'from-blue-500 to-indigo-700',
    keyTopics: ['3-Digit Place Values (Hundreds)', 'Addition & Subtraction with Regrouping', 'Introduction to Multiplication (2, 3, 5, 10)', 'Fractions (Halves & Quarters)', 'Measurement: Meters & Liters'],
  },
  {
    id: 'CB-02-GK',
    title: 'General Knowledge & Environmental Studies (Grade 2)',
    subject: 'General Knowledge',
    grade: 'Grade 2',
    author: 'Dr. Shahida Soomro',
    publisher: 'Sindh Textbook Board',
    edition: '2024 Edition',
    totalChapters: 8,
    coverColor: 'from-green-500 to-emerald-700',
    keyTopics: ['My Family & Healthy Habits', 'Plants, Leaves & Seeds', 'Domestic & Wild Animals', 'Water Sources & Clean Air', 'Safety Rules at School & Home'],
  },

  // Grade 3
  {
    id: 'CB-03-SCI',
    title: 'General Science for Elementary Classes (Grade 3)',
    subject: 'General Science',
    grade: 'Grade 3',
    author: 'Dr. Naseem Akhtar',
    publisher: 'Sindh Textbook Board, Jamshoro',
    edition: '2024 Discovery Edition',
    totalChapters: 8,
    coverColor: 'from-teal-500 to-cyan-700',
    keyTopics: ['Life Cycles of Animals & Plants', 'States of Matter: Solid, Liquid, Gas', 'Heat, Temperature & Thermometers', 'Simple Earth Science & Soils', 'Forces & Movement (Pushes & Pulls)'],
  },
  {
    id: 'CB-03-MATH',
    title: 'Mathematics Grade 3 (Concept & Practice)',
    subject: 'Mathematics',
    grade: 'Grade 3',
    author: 'STBB Mathematics Board',
    publisher: 'Sindh Textbook Board',
    edition: '2024 Edition',
    totalChapters: 10,
    coverColor: 'from-purple-500 to-indigo-700',
    keyTopics: ['4-Digit Numbers up to 10,000', 'Multiplication Algorithms & Long Division', 'Equivalent Fractions', 'Angles, Rays & Polygons', 'Perimeter of Rectangles & Squares'],
  },

  // Grade 4
  {
    id: 'CB-04-SCI',
    title: 'General Science Class IV (Inquiry & Experiments)',
    subject: 'General Science',
    grade: 'Grade 4',
    author: 'Dr. Abdul Qadeer & Board of Authors',
    publisher: 'Sindh Textbook Board',
    edition: '2024 Edition',
    totalChapters: 9,
    coverColor: 'from-emerald-600 to-teal-800',
    keyTopics: ['Human Body: Digestive & Respiratory Systems', 'Ecosystems & Food Webs', 'Circuits, Conductors & Insulators', 'Simple Machines (Levers, Pulleys, Wheels)', 'Properties of Light & Sound Waves'],
  },
  {
    id: 'CB-04-SST',
    title: 'Social Studies & Geography of Sindh (Grade 4)',
    subject: 'Social Studies',
    grade: 'Grade 4',
    author: 'Prof. Ghulam Rasool Kalhoro',
    publisher: 'Sindh Textbook Board',
    edition: '2024 Edition',
    totalChapters: 7,
    coverColor: 'from-amber-600 to-yellow-800',
    keyTopics: ['Geography of Sindh & the Indus River', 'Agriculture & Main Crops of Pakistan', 'Our Government & Civics', 'Cultural Heritage of Mohenjo-daro & Bhambore', 'Famous Historical Figures'],
  },

  // Grade 5
  {
    id: 'CB-05-MATH',
    title: 'Mathematics Grade 5 (Elementary Completion)',
    subject: 'Mathematics',
    grade: 'Grade 5',
    author: 'Sindh Textbook Board Jamshoro',
    publisher: 'STBB Jamshoro',
    edition: '2024 Edition',
    totalChapters: 11,
    coverColor: 'from-blue-600 to-slate-800',
    keyTopics: ['HCF & LCM (Prime Factorization)', 'Operations on Common & Decimal Fractions', 'Percentages & Unitary Method', 'Angles, Triangles & Quadrilaterals', 'Area, Perimeter & Volume', 'Averages & Bar Graphs'],
  },
  {
    id: 'CB-05-SCI',
    title: 'General Science Class V (Laboratory Foundations)',
    subject: 'General Science',
    grade: 'Grade 5',
    author: 'Dr. Shamim Ara & Faculty',
    publisher: 'Sindh Textbook Board',
    edition: '2024 Edition',
    totalChapters: 10,
    coverColor: 'from-green-600 to-emerald-800',
    keyTopics: ['Classification of Living Organisms', 'Microorganisms: Bacteria, Viruses & Fungi', 'Seeds: Structure & Germination', 'Pollution & Conservation of Environment', 'Electricity & Magnetism', 'Structure of Earth & Space'],
  },

  // Grade 6
  {
    id: 'CB-06-SCI',
    title: 'Science for Middle Schools (Grade 6)',
    subject: 'General Science',
    grade: 'Grade 6',
    author: 'Prof. Muhammad Aslam & Board',
    publisher: 'Sindh Textbook Board, Jamshoro',
    edition: '2024 Revised Edition',
    totalChapters: 10,
    coverColor: 'from-emerald-600 to-indigo-800',
    keyTopics: ['Cellular Organization of Plants & Animals', 'Sense Organs: Eye, Ear, Skin & Nose', 'Photosynthesis & Respiration in Plants', 'Elements, Compounds & Mixtures', 'Air & Atmospheric Gases', 'Energy & Forms of Energy'],
  },
  {
    id: 'CB-06-MATH',
    title: 'Mathematics Grade 6 (Pre-Algebra & Geometry)',
    subject: 'Mathematics',
    grade: 'Grade 6',
    author: 'Board of Mathematicians STBB',
    publisher: 'Sindh Textbook Board',
    edition: '2024 Edition',
    totalChapters: 11,
    coverColor: 'from-indigo-600 to-blue-900',
    keyTopics: ['Introduction to Sets & Venn Diagrams', 'Whole Numbers & Integers', 'Factors & Multiples', 'Ratio, Proportion & Financial Arithmetic', 'Algebra: Algebraic Terms & Expressions', 'Practical Geometry: Bisecting Angles'],
  },

  // Grade 7
  {
    id: 'CB-07-SCI',
    title: 'General Science for Grade 7 (Middle School Curriculum)',
    subject: 'General Science',
    grade: 'Grade 7',
    author: 'Dr. Naseem Akhtar & Faculty',
    publisher: 'Sindh Textbook Board',
    edition: '2024 Edition',
    totalChapters: 11,
    coverColor: 'from-cyan-600 to-teal-800',
    keyTopics: ['Human Organ Systems (Digestive & Circulatory)', 'Transport in Humans & Plants', 'Reproduction in Plants & Pollination', 'Atomic Structure & Periodic Table Basics', 'Physical & Chemical Changes', 'Transmission of Heat', 'Sound Waves & Optics'],
  },
  {
    id: 'CB-07-MATH',
    title: 'Mathematics Grade 7 (Algebraic Identities & Geometry)',
    subject: 'Mathematics',
    grade: 'Grade 7',
    author: 'Prof. Ghulam Rasool & Team',
    publisher: 'Sindh Textbook Board',
    edition: '2024 Edition',
    totalChapters: 12,
    coverColor: 'from-sky-600 to-indigo-800',
    keyTopics: ['Rational Numbers & Real Number Line', 'Square & Square Roots of Numbers', 'Financial Arithmetic (Taxes, Profit & Loss, Zakat)', 'Algebraic Identities (a+b)²', 'Linear Equations & Solutions', 'Practical Geometry: Constructing Triangles'],
  },

  // Grade 8
  {
    id: 'CB-08-SCI',
    title: 'Science Grade 8: Pre-Matric Foundation (Physics, Chemistry & Biology)',
    subject: 'General Science',
    grade: 'Grade 8',
    author: 'Dr. Abdul Qadeer Khan & Board of Senior Specialists',
    publisher: 'Sindh Textbook Board, Jamshoro',
    edition: '2024 Pre-Matric Edition',
    totalChapters: 12,
    coverColor: 'from-violet-600 to-indigo-900',
    keyTopics: ['Human Nervous System & Excretory System', 'Cell Division: Mitosis & Meiosis', 'Biotechnology & DNA Basics', 'Chemical Reactions & Chemical Equations', 'Acids, Alkalis & Salts', 'Force, Pressure & Hydraulics', 'Measurement of Physical Quantities'],
  },
  {
    id: 'CB-08-MATH',
    title: 'Mathematics Grade 8: Pre-Secondary Foundation',
    subject: 'Mathematics',
    grade: 'Grade 8',
    author: 'STBB Secondary Mathematics Wing',
    publisher: 'Sindh Textbook Board',
    edition: '2024 Edition',
    totalChapters: 12,
    coverColor: 'from-blue-700 to-slate-900',
    keyTopics: ['Operations on Sets & De Morgan’s Laws', 'Real Numbers & Number Systems', 'Financial Arithmetic & Compound Interest', 'Simultaneous Linear Equations', 'Factorization of Algebraic Polynomials', 'Demonstrative Geometry & Pythagoras Theorem', 'Information Handling & Histograms'],
  }
];

// -------------------------------------------------------------
// STUDY PLANS FOR GRADES 1 TO 8
// -------------------------------------------------------------
export const STUDY_PLANS_GRADES_1_TO_8: StudyPlan[] = [
  {
    id: 'SP-01-MATH-T2',
    title: 'Grade 1 Numeracy: Numbers up to 50 & Basic Shapes',
    grade: 'Grade 1',
    subject: 'Mathematics',
    term: 'Second Term (Oct - Dec 2024)',
    weekRange: 'Weeks 1 - 4',
    objectives: [
      'Count, read, and write numbers up to 50',
      'Perform single-digit addition using physical counters',
      'Identify circle, triangle, square, and rectangle shapes',
      'Arrange numbers in ascending and descending order'
    ],
    recommendedHoursPerWeek: 4,
    milestones: [
      { week: 'Week 1', topics: 'Counting & Grouping 1 to 20', assignments: 'Counting flashcards & worksheet', assessmentType: 'Oral Counting Drill' },
      { week: 'Week 2', topics: 'Addition with Pictures & Objects', assignments: 'Coloring sum page (sums up to 10)', assessmentType: 'Practical Observation' },
      { week: 'Week 3', topics: 'Introduction to Numbers 21 to 50', assignments: 'Fill in missing numbers chart', assessmentType: 'Workbook Check' },
      { week: 'Week 4', topics: 'Shapes Around Us & Sorting', assignments: 'Shape cutouts matching project', assessmentType: 'Shapes Quiz' },
    ]
  },
  {
    id: 'SP-03-SCI-T2',
    title: 'Grade 3 Science: States of Matter & Plant Habitats',
    grade: 'Grade 3',
    subject: 'General Science',
    term: 'Second Term (Oct - Dec 2024)',
    weekRange: 'Weeks 1 - 4',
    objectives: [
      'Differentiate between Solids, Liquids, and Gases with real-world examples',
      'Explain the water cycle and condensation process',
      'Investigate seed germination requirements (water, light, soil)'
    ],
    recommendedHoursPerWeek: 4,
    milestones: [
      { week: 'Week 1', topics: 'Solids, Liquids & Gases: Properties & Differences', assignments: 'Classify 15 household items', assessmentType: 'Concept Sorting Test' },
      { week: 'Week 2', topics: 'Changes of State: Melting, Freezing & Boiling', assignments: 'Ice-melting observation experiment', assessmentType: 'Lab Sheet' },
      { week: 'Week 3', topics: 'Plant Parts & Functions of Roots/Leaves', assignments: 'Pressed leaf collection book', assessmentType: 'Project Rubric' },
      { week: 'Week 4', topics: 'Seed Germination & Growth Stages', assignments: 'Sprouting bean in cotton experiment', assessmentType: 'Logbook Evaluation' },
    ]
  },
  {
    id: 'SP-05-MATH-T2',
    title: 'Grade 5 Mathematics: Fractions, Decimals & Geometry',
    grade: 'Grade 5',
    subject: 'Mathematics',
    term: 'Second Term (Oct - Dec 2024)',
    weekRange: 'Weeks 1 - 5',
    objectives: [
      'Solve addition, subtraction, multiplication, and division of fractions',
      'Convert between fractions, decimals, and percentages',
      'Calculate area and perimeter of complex rectangular shapes',
      'Construct angles using protractor accurately'
    ],
    recommendedHoursPerWeek: 5,
    milestones: [
      { week: 'Week 1', topics: 'Operations on Fractions (BODMAS)', assignments: 'Ex 3.1 & 3.2 mixed problems', assessmentType: 'Weekly Quiz' },
      { week: 'Week 2', topics: 'Decimals: Multiplication & Division by 10/100/1000', assignments: 'Ex 4.1 word problem worksheet', assessmentType: 'Speed Drill' },
      { week: 'Week 3', topics: 'Percentages & Real-life Financial Application', assignments: 'Calculate discounts and profits table', assessmentType: 'Applied Task' },
      { week: 'Week 4', topics: 'Angles, Triangles & Protractor Construction', assignments: 'Construct acute, obtuse and reflex angles', assessmentType: 'Geometry Rubric' },
      { week: 'Week 5', topics: 'Perimeter, Area & Composite Shapes', assignments: 'Ex 8.2 calculation set', assessmentType: 'Unit Mid-term Exam' },
    ]
  },
  {
    id: 'SP-08-SCI-T2',
    title: 'Grade 8 Science: Chemical Reactions & Force/Pressure',
    grade: 'Grade 8',
    subject: 'General Science',
    term: 'Second Term (Oct - Dec 2024)',
    weekRange: 'Weeks 1 - 5',
    objectives: [
      'Write and balance word equations for combination and decomposition reactions',
      'Understand Law of Conservation of Mass in chemical changes',
      'Calculate pressure using Force / Area formula and explain hydraulic lifts',
      'Construct ray diagrams for curved mirrors and lenses'
    ],
    recommendedHoursPerWeek: 5,
    milestones: [
      { week: 'Week 1', topics: 'Chemical Reactions: Reactants, Products & Types', assignments: 'Balancing 10 chemical equations', assessmentType: 'Equation Test' },
      { week: 'Week 2', topics: 'Exothermic & Endothermic Reactions with Examples', assignments: 'Reaction temperature logbook writeup', assessmentType: 'Lab Practical Check' },
      { week: 'Week 3', topics: 'Acids, Alkalis, pH Scale & Neutralization', assignments: 'Litmus and universal indicator testing', assessmentType: 'Lab Report' },
      { week: 'Week 4', topics: 'Pressure in Liquids, Gases & Pascal’s Principle', assignments: 'Hydraulic lift calculation problems', assessmentType: 'Concept Quiz' },
      { week: 'Week 5', topics: 'Dispersion of Light & Curved Mirrors', assignments: 'Ray diagrams for concave mirrors', assessmentType: 'Board Foundation Exam' },
    ]
  }
];
