# 💡 Ideas - Shuffle Snap Project

## Feature Ideas & Brainstorming

This document tracks all ideas for the Shuffle Snap project, both implemented and potential future additions.

---

## ✅ Implemented Features

### v1.0 (2026-03-12)
- **Three Difficulty Levels:** Easy (5×5), Medium (8×8), Hard (12×12)
- **Memory Preview:** 5-second countdown timer before puzzle starts
- **Drag & Drop Controls:** Mouse and touch support for piece swapping
- **Game Timer:** Difficulty-based time limits (60s, 90s, 120s)
- **Scoring System:** Base score + time bonus calculation
- **Hint Button:** Shows original image briefly
- **Animated Main Menu:** Three.js floating particles background
- **Win Screen:** Score display with performance feedback messages
- **Game Over Screen:** Timeout handling with retry option
- **Responsive Design:** Works on desktop and mobile devices
- **Image Folder Support:** Ready for multiple puzzle images

---

## 🚀 Future Feature Ideas

### Gameplay Variations

#### New Game Modes
- **Time Attack:** Unlimited moves, beat the clock
- **Move Limit:** Complete in minimum number of swaps
- **Infinite Mode:** Endless puzzles with increasing difficulty
- **Zen Mode:** No timer, relax and solve at your own pace
- **Challenge Mode:** Daily puzzle everyone gets the same image
- **Speed Run:** Race against best time on same puzzle

#### Difficulty Options
- **Custom Grid Size:** Let players choose any grid (3×3 to 20×20)
- **Piece Rotation:** Pieces can be rotated (harder puzzles)
- **Hidden Corners:** Corner pieces not marked
- **No Preview:** Start directly with scrambled pieces
- **Memory Test:** Very short preview time (2-3 seconds)

#### Puzzle Types
- **Image Categories:** Nature, cities, animals, abstract, art
- **Progressive Puzzles:** Get harder as you complete them
- **Themed Sets:** Holiday puzzles, movie scenes, famous paintings
- **User Uploads:** Players can use their own photos
- **Random Generator:** Fetch random images from Unsplash/Pexels API

### Visual Enhancements

#### Animations & Effects
- **Piece Placement Sound:** Satisfying click when piece is correct
- **Win Celebration:** Confetti, fireworks, or particle explosion
- **Smooth Transitions:** Fade/slide between screens
- **Piece Glow:** Highlight correctly placed pieces
- **Background Music:** Relaxing ambient soundtrack
- **Screen Shake:** Subtle effect on win

#### UI Improvements
- **Progress Bar:** Show completion percentage
- **Mini Preview:** Small thumbnail of original image always visible
- **Move Counter:** Track number of swaps made
- **Best Time Display:** Show personal best for each difficulty
- **Streak Counter:** Consecutive correct placements
- **Visual Difficulty Indicator:** Color-coded timer (green/yellow/red)

### Social & Competitive Features

#### Leaderboards
- **Global Rankings:** Top scores worldwide
- **Friend Competition:** Compare with friends' times
- **Daily/Weekly Challenges:** Special puzzles with prizes
- **Achievement Badges:** Unlock for milestones
- **Share Results:** Post completion on social media

#### Multiplayer (Stretch Goal)
- **Hotseat Mode:** Two players, same device, race to finish
- **Online Competition:** Real-time puzzle battles
- **Co-op Mode:** Work together on giant puzzles
- **Spectator Mode:** Watch friends solve puzzles

### Technical Features

#### Performance & Optimization
- **Image Caching:** Load images faster on repeat visits
- **Lazy Loading:** Only render visible pieces for huge grids
- **Web Workers:** Offload puzzle logic to background thread
- **Progressive Web App (PWA):** Install as desktop/mobile app
- **Offline Mode:** Play without internet connection

#### Data & Persistence
- **Local Storage:** Save high scores and progress
- **Cloud Sync:** Sync across devices with account
- **Play History:** Track all completed puzzles
- **Statistics Dashboard:** Show play time, win rate, etc.
- **Export/Import:** Share puzzle configurations

### Creative Ideas

#### Special Effects
- **Time Freeze:** Slow down timer for 5 seconds (power-up)
- **Auto-Sort:** Automatically place one random piece
- **Shuffle Again:** Re-scramble if stuck (with penalty)
- **X-Ray Vision:** See through pieces briefly
- **Magnet Mode:** Pieces snap to nearby correct positions

#### Themes & Skins
- **Retro Arcade:** Pixel art style with 8-bit sounds
- **Minimalist:** Clean, modern design with subtle colors
- **Neon Cyberpunk:** Glowing effects and dark background
- **Watercolor:** Artistic painted look
- **Seasonal:** Halloween, Christmas, Easter themes

#### Easter Eggs
- **Hidden Images:** Special puzzles on certain dates
- **Secret Codes:** Enter codes for bonus features
- **Konami Code:** Classic game cheat code for fun effects
- **Birthday Mode:** Special puzzle on player's birthday
- **Anniversary:** Celebrate game milestones

### Monetization Ideas (If Needed)

#### Free Features
- Unlimited puzzles with ads
- Basic image library
- Standard difficulty levels

#### Premium Features (Optional)
- Ad-free experience
- Exclusive image packs
- Custom themes and skins
- Advanced statistics
- Cloud save sync

---

## 🐛 Known Issues & Bugs

### Fixed
- ✅ **Image loading issue** (2026-03-12) — Images from assets folder weren't loading due to improper async handling. Fixed by using Image object with proper onload/onerror callbacks.
- ✅ **Drag & drop not working** (2026-03-12) — `swapPieces()` was destroying DOM structure with incorrect replaceChild calls. Fixed by swapping only background positions and dataset values instead of manipulating DOM nodes.
- ✅ **Visual glitch on drag** (2026-03-12) — Multiple pieces highlighted when dragging due to unreliable dragenter/dragleave events. Fixed by removing those handlers.
- ✅ **Premature win detection** (2026-03-12) — Win condition triggered incorrectly because `correctRow/correctCol` weren't swapped with pieces. Fixed by swapping all position data together.

### To Investigate
- [ ] Performance on very slow devices with 12×12 grid
- [ ] Touch controls on some mobile browsers
- [ ] Image loading fallback for missing assets

### Potential Issues to Watch
- Memory usage with large number of pieces
- Drag-and-drop edge cases (dropping outside board)
- Timer accuracy across different browsers
- Image aspect ratio handling for non-square images

---

## 📝 Notes & Observations

- Players might prefer smaller grids initially (3×3, 4×4)
- Hint button usage should be tracked for balance
- Consider adding "show original" as paid hint option
- Mobile users need larger touch targets
- Image quality matters - high-res images look better when split
- Timer color change at low time is good UX

---

## 🔗 Inspiration Sources

- Classic jigsaw puzzle games
- Memory card matching games
- Sliding tile puzzles (15-puzzle)
- Mobile puzzle apps (e.g., Jigsaw Puzzle by Easybrain)
- Browser-based puzzle games

---

*Last Updated: 2026-03-12*  
*Next Review: After player testing feedback*
