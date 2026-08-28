const QUOTES_DATA = [
  // --- LIFE ---
  {
    id: "life-1",
    category: "life",
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama"
  },
  {
    id: "life-2",
    category: "life",
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    id: "life-3",
    category: "life",
    text: "Get busy living or get busy dying.",
    author: "Stephen King"
  },
  {
    id: "life-4",
    category: "life",
    text: "You only live once, but if you do it right, once is enough.",
    author: "Mae West"
  },
  {
    id: "life-5",
    category: "life",
    text: "In three words I can sum up everything I've learned about life: it goes on.",
    author: "Robert Frost"
  },
  {
    id: "life-6",
    category: "life",
    text: "To live is the rarest thing in the world. Most people exist, that is all.",
    author: "Oscar Wilde"
  },
  {
    id: "life-7",
    category: "life",
    text: "Life isn't about finding yourself. Life is about creating yourself.",
    author: "George Bernard Shaw"
  },
  {
    id: "life-8",
    category: "life",
    text: "Live in the sunshine, swim the sea, drink the wild air.",
    author: "Ralph Waldo Emerson"
  },
  {
    id: "life-9",
    category: "life",
    text: "Life is really simple, but we insist on making it complicated.",
    author: "Confucius"
  },
  {
    id: "life-10",
    category: "life",
    text: "May you live all the days of your life.",
    author: "Jonathan Swift"
  },
  {
    id: "life-11",
    category: "life",
    text: "Life is either a daring adventure or nothing at all.",
    author: "Helen Keller"
  },
  {
    id: "life-12",
    category: "life",
    text: "Turn your wounds into wisdom.",
    author: "Oprah Winfrey"
  },
  {
    id: "life-13",
    category: "life",
    text: "The unexamined life is not worth living.",
    author: "Socrates"
  },
  {
    id: "life-14",
    category: "life",
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs"
  },
  {
    id: "life-15",
    category: "life",
    text: "Life shrinks or expands in proportion to one's courage.",
    author: "Anaïs Nin"
  },

  // --- LOVE ---
  {
    id: "love-1",
    category: "love",
    text: "There is only one happiness in this life, to love and be loved.",
    author: "George Sand"
  },
  {
    id: "love-2",
    category: "love",
    text: "Love all, trust a few, do wrong to none.",
    author: "William Shakespeare"
  },
  {
    id: "love-3",
    category: "love",
    text: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.",
    author: "Dr. Seuss"
  },
  {
    id: "love-4",
    category: "love",
    text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
    author: "Lao Tzu"
  },
  {
    id: "love-5",
    category: "love",
    text: "The best thing to hold onto in life is each other.",
    author: "Audrey Hepburn"
  },
  {
    id: "love-6",
    category: "love",
    text: "Love is composed of a single soul inhabiting two bodies.",
    author: "Aristotle"
  },
  {
    id: "love-7",
    category: "love",
    text: "To love and be loved is to feel the sun from both sides.",
    author: "David Viscott"
  },
  {
    id: "love-8",
    category: "love",
    text: "Where there is love there is life.",
    author: "Mahatma Gandhi"
  },
  {
    id: "love-9",
    category: "love",
    text: "Love does not consist in gazing at each other, but in looking outward together in the same direction.",
    author: "Antoine de Saint-Exupéry"
  },
  {
    id: "love-10",
    category: "love",
    text: "We are most alive when we're in love.",
    author: "John Updike"
  },
  {
    id: "love-11",
    category: "love",
    text: "The greatest happiness of life is the conviction that we are loved; loved for ourselves, or rather, loved in spite of ourselves.",
    author: "Victor Hugo"
  },
  {
    id: "love-12",
    category: "love",
    text: "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive at its destination full of hope.",
    author: "Maya Angelou"
  },
  {
    id: "love-13",
    category: "love",
    text: "Keep love in your heart. A life without it is like a sunless garden when the flowers are dead.",
    author: "Oscar Wilde"
  },
  {
    id: "love-14",
    category: "love",
    text: "The giving of love is an education in itself.",
    author: "Eleanor Roosevelt"
  },
  {
    id: "love-15",
    category: "love",
    text: "Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that.",
    author: "Martin Luther King Jr."
  },

  // --- COURAGE ---
  {
    id: "courage-1",
    category: "courage",
    text: "Courage is not the absence of fear, but the triumph over it.",
    author: "Nelson Mandela"
  },
  {
    id: "courage-2",
    category: "courage",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    id: "courage-3",
    category: "courage",
    text: "It takes courage to grow up and become who you really are.",
    author: "E.E. Cummings"
  },
  {
    id: "courage-4",
    category: "courage",
    text: "All our dreams can come true, if we have the courage to pursue them.",
    author: "Walt Disney"
  },
  {
    id: "courage-5",
    category: "courage",
    text: "You gain strength, courage and confidence by every experience in which you really stop to look fear in the face.",
    author: "Eleanor Roosevelt"
  },
  {
    id: "courage-6",
    category: "courage",
    text: "He who is not courageous enough to take risks will accomplish nothing in life.",
    author: "Muhammad Ali"
  },
  {
    id: "courage-7",
    category: "courage",
    text: "Courage is resistance to fear, mastery of fear - not absence of fear.",
    author: "Mark Twain"
  },
  {
    id: "courage-8",
    category: "courage",
    text: "With enough courage, you can do without a reputation.",
    author: "Margaret Mitchell"
  },
  {
    id: "courage-9",
    category: "courage",
    text: "Courage is grace under pressure.",
    author: "Ernest Hemingway"
  },
  {
    id: "courage-10",
    category: "courage",
    text: "Whatever you do, you need courage. Whatever course you decide upon, there is always someone to tell you that you are wrong.",
    author: "Ralph Waldo Emerson"
  },
  {
    id: "courage-11",
    category: "courage",
    text: "Have the courage to use your own reason!",
    author: "Immanuel Kant"
  },
  {
    id: "courage-12",
    category: "courage",
    text: "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'",
    author: "Mary Anne Radmacher"
  },
  {
    id: "courage-13",
    category: "courage",
    text: "Real courage is when you know you're licked before you begin, but you begin anyway and see it through no matter what.",
    author: "Harper Lee"
  },
  {
    id: "courage-14",
    category: "courage",
    text: "Confront the dark parts of yourself, and work to banish them with illumination and forgiveness. Your willingness to wrestle with your demons will cause your angels to sing.",
    author: "August Wilson"
  },
  {
    id: "courage-15",
    category: "courage",
    text: "Courage is the most important of all the virtues because without courage, you can't practice any other virtue consistently.",
    author: "Maya Angelou"
  },

  // --- STRENGTH ---
  {
    id: "strength-1",
    category: "strength",
    text: "That which does not kill us makes us stronger.",
    author: "Friedrich Nietzsche"
  },
  {
    id: "strength-2",
    category: "strength",
    text: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi"
  },
  {
    id: "strength-3",
    category: "strength",
    text: "You never know how strong you are until being strong is your only choice.",
    author: "Bob Marley"
  },
  {
    id: "strength-4",
    category: "strength",
    text: "Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.",
    author: "Kahlil Gibran"
  },
  {
    id: "strength-5",
    category: "strength",
    text: "The world breaks everyone, and afterward, some are strong at the broken places.",
    author: "Ernest Hemingway"
  },
  {
    id: "strength-6",
    category: "strength",
    text: "He who believes is strong; he who doubts is weak. Strong convictions precede great actions.",
    author: "Louisa May Alcott"
  },
  {
    id: "strength-7",
    category: "strength",
    text: "Mastering others is strength. Mastering yourself is true power.",
    author: "Lao Tzu"
  },
  {
    id: "strength-8",
    category: "strength",
    text: "Calm mind brings inner strength and self-confidence, so that's very important for good health.",
    author: "Dalai Lama"
  },
  {
    id: "strength-9",
    category: "strength",
    text: "Promise me you'll always remember: You're braver than you believe, and stronger than you seem, and smarter than you think.",
    author: "A.A. Milne"
  },
  {
    id: "strength-10",
    category: "strength",
    text: "Where there is no struggle, there is no strength.",
    author: "Frederick Douglass"
  },
  {
    id: "strength-11",
    category: "strength",
    text: "A truly strong person does not need the approval of others any more than a lion needs the approval of sheep.",
    author: "Vernon Howard"
  },
  {
    id: "strength-12",
    category: "strength",
    text: "Tough times never last, but tough people do.",
    author: "Robert H. Schuller"
  },
  {
    id: "strength-13",
    category: "strength",
    text: "Deep in your roots, all flowers keep the light.",
    author: "Theodore Roethke"
  },
  {
    id: "strength-14",
    category: "strength",
    text: "In the depth of winter, I finally learned that within me there lay an invincible summer.",
    author: "Albert Camus"
  },
  {
    id: "strength-15",
    category: "strength",
    text: "Strength and growth come only through continuous effort and struggle.",
    author: "Napoleon Hill"
  }
];

if (typeof window !== 'undefined') {
  window.QUOTES_DATA = QUOTES_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QUOTES_DATA;
}

