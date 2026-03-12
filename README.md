# 🧩 Shuffle Snap - Image Puzzle Game

A challenging and addictive image puzzle game where you reassemble scrambled image pieces before time runs out! Test your memory and spatial reasoning skills.

## 🎮 How to Play

1. **Memorize:** Study the complete image for 5 seconds
2. **Reassemble:** Drag and drop pieces to their correct positions
3. **Beat the Clock:** Complete the puzzle before time runs out!

## ⭐ Features

- **3 Difficulty Levels:** Easy (5×5), Medium (8×8), Hard (12×12)
- **Memory Challenge:** 5-second preview timer
- **Drag & Drop Controls:** Intuitive piece swapping
- **Time-Based Scoring:** Faster completion = higher score
- **Hint System:** Peek at the original image anytime
- **Animated Main Menu:** Beautiful 3D particle background
- **Responsive Design:** Works on desktop and mobile

## 🛠️ Tech Stack

- **Three.js** — Animated 3D background particles
- **HTML5 Drag & Drop API** — Piece manipulation
- **Vanilla JavaScript** — Game logic
- **CSS3** — Animations and styling

## 🚀 How to Run

```bash
cd shuffle_snap
python3 -m http.server 8000
```

Then open your browser and visit: `http://localhost:8000`

## 📁 Project Structure

```
shuffle_snap/
├── index.html          # Main HTML file
├── style.css           # Game styling & animations
├── script.js           # Game logic
├── assets/             # Image folder for puzzles
│   └── default-puzzle.jpg  # Placeholder image
└── README.md           # This file
```

## 🎯 Difficulty Levels

| Level | Grid Size | Time Limit | Max Score |
|-------|-----------|------------|-----------|
| Easy | 5×5 (25 pieces) | 60 seconds | 1,600 |
| Medium | 8×8 (64 pieces) | 90 seconds | 1,900 |
| Hard | 12×12 (144 pieces) | 120 seconds | 2,200 |

## 🏆 Scoring System

- **Base Score:** 1,000 points
- **Time Bonus:** +10 points per second remaining
- **Performance Feedback:** Messages based on completion speed

## 💡 Tips

- Use the hint button if you get stuck (shows original image)
- Start with corner pieces to establish boundaries
- Look for distinctive patterns or colors
- Practice improves your memory and speed!

## 🔗 Links

- **GitHub:** https://github.com/nano-nv/shuffle-snap
- **Live Demo:** (coming soon)

---

*Built with ❤️ by KaiserYami using nanobot*
