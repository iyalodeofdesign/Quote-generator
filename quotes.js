const QUOTES_DATA = [
  // --- MOTIVATION ---
  {
    id: "motivation-1",
    category: "motivation",
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    id: "motivation-2",
    category: "motivation",
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela"
  },
  {
    id: "motivation-3",
    category: "motivation",
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    id: "motivation-4",
    category: "motivation",
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe"
  },
  {
    id: "motivation-5",
    category: "motivation",
    text: "Aim for the moon. If you miss, you may hit a star.",
    author: "W. Clement Stone"
  },
  {
    id: "motivation-6",
    category: "motivation",
    text: "Keep your face always toward the sunshine—and shadows will fall behind you.",
    author: "Walt Whitman"
  },
  {
    id: "motivation-7",
    category: "motivation",
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis"
  },
  {
    id: "motivation-8",
    category: "motivation",
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso"
  },
  {
    id: "motivation-9",
    category: "motivation",
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    id: "motivation-10",
    category: "motivation",
    text: "The hard days are what make you stronger.",
    author: "Aly Raisman"
  },

  // --- SUCCESS ---
  {
    id: "success-1",
    category: "success",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    id: "success-2",
    category: "success",
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau"
  },
  {
    id: "success-3",
    category: "success",
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    id: "success-4",
    category: "success",
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller"
  },
  {
    id: "success-5",
    category: "success",
    text: "Opportunities don't happen. You create them.",
    author: "Chris Grosser"
  },
  {
    id: "success-6",
    category: "success",
    text: "Try not to become a man of success. Rather become a man of value.",
    author: "Albert Einstein"
  },
  {
    id: "success-7",
    category: "success",
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill"
  },
  {
    id: "success-8",
    category: "success",
    text: "I owe my success to having listened respectfully to the very best advice, and then going away and doing the exact opposite.",
    author: "G.K. Chesterton"
  },
  {
    id: "success-9",
    category: "success",
    text: "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.",
    author: "Colin Powell"
  },
  {
    id: "success-10",
    category: "success",
    text: "Success is getting what you want, happiness is wanting what you get.",
    author: "W. P. Kinsella"
  },

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

  // --- WISDOM ---
  {
    id: "wisdom-1",
    category: "wisdom",
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates"
  },
  {
    id: "wisdom-2",
    category: "wisdom",
    text: "Knowing others is intelligence; knowing yourself is true wisdom.",
    author: "Lao Tzu"
  },
  {
    id: "wisdom-3",
    category: "wisdom",
    text: "Count your age by friends, not years. Count your life by smiles, not tears.",
    author: "John Lennon"
  },
  {
    id: "wisdom-4",
    category: "wisdom",
    text: "The fool doth think he is wise, but the wise man knows himself to be a fool.",
    author: "William Shakespeare"
  },
  {
    id: "wisdom-5",
    category: "wisdom",
    text: "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
    author: "Aristotle"
  },
  {
    id: "wisdom-6",
    category: "wisdom",
    text: "Any fool can know. The point is to understand.",
    author: "Albert Einstein"
  },
  {
    id: "wisdom-7",
    category: "wisdom",
    text: "Wisdom begins in wonder.",
    author: "Socrates"
  },
  {
    id: "wisdom-8",
    category: "wisdom",
    text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
    author: "Rumi"
  },
  {
    id: "wisdom-9",
    category: "wisdom",
    text: "Wisdom comes from experience. Experience is often the result of lack of wisdom.",
    author: "Terry Pratchett"
  },
  {
    id: "wisdom-10",
    category: "wisdom",
    text: "Knowledge speaks, but wisdom listens.",
    author: "Jimi Hendrix"
  },

  // --- HAPPINESS ---
  {
    id: "happiness-1",
    category: "happiness",
    text: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama"
  },
  {
    id: "happiness-2",
    category: "happiness",
    text: "For every minute you are angry you lose sixty seconds of happiness.",
    author: "Ralph Waldo Emerson"
  },
  {
    id: "happiness-3",
    category: "happiness",
    text: "Happiness is when what you think, what you say, and what you do are in harmony.",
    author: "Mahatma Gandhi"
  },
  {
    id: "happiness-4",
    category: "happiness",
    text: "The most important thing is to enjoy your life—to be happy—it's all that matters.",
    author: "Audrey Hepburn"
  },
  {
    id: "happiness-5",
    category: "happiness",
    text: "Sanity and happiness are an impossible combination.",
    author: "Mark Twain"
  },
  {
    id: "happiness-6",
    category: "happiness",
    text: "Happiness depends upon ourselves.",
    author: "Aristotle"
  },
  {
    id: "happiness-7",
    category: "happiness",
    text: "The only way to find true happiness is to risk being completely open.",
    author: "Chuck Palahniuk"
  },
  {
    id: "happiness-8",
    category: "happiness",
    text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    author: "Mother Teresa"
  },
  {
    id: "happiness-9",
    category: "happiness",
    text: "Happiness is a warm puppy.",
    author: "Charles M. Schulz"
  },
  {
    id: "happiness-10",
    category: "happiness",
    text: "There is no path to happiness: happiness is the path.",
    author: "Thich Nhat Hanh"
  },

  // --- LEADERSHIP ---
  {
    id: "leadership-1",
    category: "leadership",
    text: "A leader is one who knows the way, goes the way, and shows the way.",
    author: "John C. Maxwell"
  },
  {
    id: "leadership-2",
    category: "leadership",
    text: "Leadership is not about a title or a designation. It's about impact, influence, and inspiration.",
    author: "Robin S. Sharma"
  },
  {
    id: "leadership-3",
    category: "leadership",
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    id: "leadership-4",
    category: "leadership",
    text: "The supreme quality for leadership is unquestionably integrity.",
    author: "Dwight D. Eisenhower"
  },
  {
    id: "leadership-5",
    category: "leadership",
    text: "Do not follow where the path may lead, go instead where there is no path and leave a trail.",
    author: "Ralph Waldo Emerson"
  },
  {
    id: "leadership-6",
    category: "leadership",
    text: "Great leaders are almost always great simplifiers, who can cut through argument, debate and doubt to offer a solution everyone can understand.",
    author: "Colin Powell"
  },
  {
    id: "leadership-7",
    category: "leadership",
    text: "To lead people, walk behind them.",
    author: "Lao Tzu"
  },
  {
    id: "leadership-8",
    category: "leadership",
    text: "Before you are a leader, success is all about growing yourself. When you become a leader, success is all about growing others.",
    author: "Jack Welch"
  },
  {
    id: "leadership-9",
    category: "leadership",
    text: "A genuine leader is not a searcher for consensus but a molder of consensus.",
    author: "Martin Luther King Jr."
  },
  {
    id: "leadership-10",
    category: "leadership",
    text: "Leadership is the capacity to translate vision into reality.",
    author: "Warren Bennis"
  },

  // --- COURAGE & STRENGTH (Preserved) ---
  {
    id: "courage-1",
    category: "courage",
    text: "Courage is not the absence of fear, but the triumph over it.",
    author: "Nelson Mandela"
  },
  {
    id: "courage-2",
    category: "courage",
    text: "It takes courage to grow up and become who you really are.",
    author: "E.E. Cummings"
  },
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
  }
];

if (typeof window !== 'undefined') {
  window.QUOTES_DATA = QUOTES_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QUOTES_DATA;
}
