# Product Requirements Document - Memo Sprout (Flutter)

## 1. Overview

**Memo Sprout** is a Flutter-based mobile memory card-matching game. Players flip cards to find matching pairs across 9 emoji-based themes. The app supports local multiplayer (up to 20 players), multiple difficulty levels, and customizable settings. It **excludes the Learn English section** entirely (no Word-Picture, Riddles, Fill Blank, Trivia, or Geography themes).

- **App Name:** Memo Sprout
- **Tagline:** Memory Match Game
- **Logo:** Cute card character with a green sprout on top, surrounded by leaves, on a blue background (see `public/logo-with-background.jpeg`)

---

## 2. Goals

- Deliver a native mobile experience (iOS & Android) using Flutter
- Build a polished, blue-themed UI inspired by the Memo Sprout brand identity
- Provide 9 emoji-based themes for variety
- Optimize UI/UX for touch interactions and mobile screen sizes
- Support offline play with local data persistence

---

## 3. Target Platforms

- iOS 14+
- Android 8.0+ (API 26)

---

## 4. Features

### 4.1 Difficulty Levels

| Difficulty | Icon | Pairs | Total Cards | Selected Color |
|------------|------|-------|-------------|----------------|
| Easy       | 😊   | 6     | 12          | Blue            |
| Medium     | 🔥   | 12    | 24          | Blue            |
| Hard       | ⚡   | 24    | 48          | Red             |

- Displayed as three large rounded cards in a horizontal row
- Selected card shows filled background color with white text
- Unselected cards show outlined/light style
- Grid layout adapts to screen size and difficulty:
  - Easy: 3-4 columns
  - Medium: 4-6 columns
  - Hard: 4-6 columns (scrollable if needed on small screens)

### 4.2 Themes

Nine emoji-based themes where players match identical pairs. Each theme provides exactly 24 unique emoji items (supporting up to 24 pairs for Hard mode). Cards are randomly selected based on difficulty level and shuffled using Fisher-Yates algorithm.

Each card has an emoji and a human-readable label (used for accessibility/screen readers).

#### Farm (🐄)
| Emoji | Label | Emoji | Label | Emoji | Label |
|-------|-------|-------|-------|-------|-------|
| 🐄 | Cow | 🐔 | Chicken | 🦢 | Swan |
| 🐑 | Sheep | 🐴 | Horse | 🐇 | Rabbit |
| 🐈 | Cat | 🐓 | Rooster | 🦆 | Duck |
| 🐐 | Goat | 🐎 | Horse | 🐈‍⬛ | Black Cat |
| 🐏 | Ram | 🦃 | Turkey | 🕊️ | Dove |
| 🐂 | Ox | 🐃 | Buffalo | 🐮 | Cow Face |
| 🐣 | Chick | 🦜 | Parrot | 🦙 | Llama |
| 🐪 | Camel | 🦚 | Peacock | 🦤 | Dodo |

#### Garden (🌻)
| Emoji | Label | Emoji | Label | Emoji | Label |
|-------|-------|-------|-------|-------|-------|
| 🌻 | Sunflower | 🌷 | Tulip | 🌹 | Rose |
| 🌺 | Hibiscus | 🌸 | Blossom | 🌼 | Daisy |
| 🏵️ | Rosette | 🪻 | Hyacinth | 🌾 | Rice |
| 🌰 | Chestnut | 🌿 | Herb | 🌵 | Cactus |
| 🥀 | Wilted | 🪴 | Plant | 🌱 | Seedling |
| 🍃 | Leaf | 🌳 | Tree | 🌴 | Palm |
| 🪹 | Nest | 🍁 | Maple | 🍂 | Fallen Leaf |
| 🪺 | Eggs | 🪷 | Lotus | 🫘 | Beans |

#### Fruits (🍎)
| Emoji | Label | Emoji | Label | Emoji | Label |
|-------|-------|-------|-------|-------|-------|
| 🍎 | Apple | 🍌 | Banana | 🍇 | Grapes |
| 🍊 | Orange | 🍓 | Strawberry | 🍉 | Watermelon |
| 🍑 | Peach | 🍒 | Cherry | 🥝 | Kiwi |
| 🍍 | Pineapple | 🥭 | Mango | 🫐 | Blueberry |
| 🍋 | Lemon | 🥥 | Coconut | 🍈 | Melon |
| 🍐 | Pear | 🫒 | Olive | 🥑 | Avocado |
| 🍅 | Tomato | 🫑 | Pepper | 🥒 | Cucumber |
| 🌽 | Corn | 🥕 | Carrot | 🍆 | Eggplant |

#### Animals (🦊)
| Emoji | Label | Emoji | Label | Emoji | Label |
|-------|-------|-------|-------|-------|-------|
| 🦊 | Fox | 🐻 | Bear | 🐼 | Panda |
| 🐨 | Koala | 🐯 | Tiger | 🦁 | Lion |
| 🐵 | Monkey | 🐘 | Elephant | 🦒 | Giraffe |
| 🦓 | Zebra | 🐆 | Leopard | 🦘 | Kangaroo |
| 🦛 | Hippo | 🦏 | Rhino | 🐊 | Crocodile |
| 🦈 | Shark | 🐋 | Whale | 🐬 | Dolphin |
| 🦅 | Eagle | 🦉 | Owl | 🦩 | Flamingo |
| 🐧 | Penguin | 🐺 | Wolf | 🦇 | Bat |

#### Food (🍕)
| Emoji | Label | Emoji | Label | Emoji | Label |
|-------|-------|-------|-------|-------|-------|
| 🍕 | Pizza | 🍔 | Burger | 🌮 | Taco |
| 🍜 | Noodles | 🍣 | Sushi | 🧁 | Cupcake |
| 🎂 | Cake | 🍩 | Donut | 🍪 | Cookie |
| 🥐 | Croissant | 🥯 | Bagel | 🧇 | Waffle |
| 🥞 | Pancakes | 🍰 | Shortcake | 🥧 | Pie |
| 🍫 | Chocolate | ☕ | Coffee | 🧃 | Juice |
| 🥤 | Drink | 🍵 | Tea | 🧈 | Butter |
| 🥨 | Pretzel | 🥖 | Bread | 🍿 | Popcorn |

#### Ocean (🐙)

> **Fixed:** Removed cross-theme duplicates (🦈, 🐬, 🐋, 🐊, 🦩, 🦆 from Animals/Farm) and duplicate labels (🐠/🐟 both "Fish"). Replaced with unique ocean-related emojis.

| Emoji | Label | Emoji | Label | Emoji | Label |
|-------|-------|-------|-------|-------|-------|
| 🐙 | Octopus | 🦑 | Squid | 🐠 | Tropical Fish |
| 🐡 | Blowfish | 🐳 | Spouting Whale | 🦐 | Shrimp |
| 🦞 | Lobster | 🦀 | Crab | 🐚 | Shell |
| 🪸 | Coral | 🦭 | Seal | 🪼 | Jellyfish |
| 🦦 | Otter | 🐢 | Turtle | 🦪 | Oyster |
| 🌊 | Wave | 🏝️ | Island | 🐟 | Fish |
| 🦈 | Shark | 🐬 | Dolphin | 🐋 | Whale |
| ⚓ | Anchor | 🚢 | Ship | 🧜 | Merperson |

#### Sports (⚽)
| Emoji | Label | Emoji | Label | Emoji | Label |
|-------|-------|-------|-------|-------|-------|
| ⚽ | Football | 🏀 | Basketball | 🏈 | Rugby Ball |
| ⚾ | Baseball | 🎾 | Tennis | 🏐 | Volleyball |
| 🏉 | Rugby | 🏒 | Hockey | 🏓 | Ping Pong |
| 🏸 | Badminton | 🥊 | Boxing | 🥋 | Martial Arts |
| 🥅 | Goal | 🏹 | Archery | 🥇 | Gold |
| 🥈 | Silver | 🥉 | Bronze | 🏅 | Medal |
| 🎿 | Skiing | 🛷 | Sled | ⛸️ | Ice Skate |
| 🥏 | Frisbee | 🪃 | Boomerang | 🏏 | Cricket |

#### Flags (🏁)
| Emoji | Label | Emoji | Label | Emoji | Label |
|-------|-------|-------|-------|-------|-------|
| 🏁 | Finish | 🚩 | Flag | 🇲🇾 | Malaysia |
| 🏴 | Black Flag | 🏳️ | White Flag | 🇺🇸 | USA |
| 🇬🇧 | UK | 🇫🇷 | France | 🇩🇪 | Germany |
| 🇯🇵 | Japan | 🇰🇷 | Korea | 🇨🇳 | China |
| 🇮🇳 | India | 🇧🇷 | Brazil | 🇦🇺 | Australia |
| 🇨🇦 | Canada | 🇮🇹 | Italy | 🇪🇸 | Spain |
| 🇲🇽 | Mexico | 🇹🇷 | Turkey | 🇮🇩 | Indonesia |
| 🇸🇦 | Saudi | 🇪🇬 | Egypt | 🇿🇦 | S. Africa |

#### Transport (🚗)
| Emoji | Label | Emoji | Label | Emoji | Label |
|-------|-------|-------|-------|-------|-------|
| 🚗 | Car | 🚕 | Taxi | 🚌 | Bus |
| 🚎 | Trolley | 🏎️ | Race Car | 🚓 | Police |
| 🚑 | Ambulance | 🚒 | Fire Truck | 🚐 | Minibus |
| 🛻 | Pickup | 🚚 | Truck | 🚛 | Lorry |
| 🚜 | Tractor | 🏍️ | Motorcycle | 🛵 | Scooter |
| 🚲 | Bicycle | 🛴 | Kick Scooter | 🚂 | Train |
| 🚆 | Railway | 🚇 | Metro | 🚈 | Light Rail |
| ✈️ | Airplane | 🚁 | Helicopter | 🛶 | Canoe |

### 4.3 Multiplayer (Local)

- Support 1-20 players in a single local game
- Player management on setup screen:
  - Add / remove players
  - Edit player names (max 20 characters)
  - Reorder players (drag-to-reorder on mobile)
  - Shuffle / randomize player order
- 10 player colors: red, sky-blue, amber, emerald, violet, pink, teal, orange, indigo, lime
- Random starting player selection
- Turn-based cycling through all players
- Active player highlighted in scoreboard during gameplay

### 4.4 Settings

All settings are displayed in a clean list layout with icons, labels, and toggle/slider controls on the right side.

#### Turn Timer
- Toggle ON / OFF (switch control)
- When ON, shows adjustable slider: 5-120 seconds in 5-second increments
- Visual countdown on screen during gameplay
- Auto-skip turn when timer reaches 0
- Color indicators: blue (normal), yellow (<=10s), red (<=5s) with pulse animation

#### Sound
- Toggle ON / OFF (switch control)
- When ON, shows volume slider (0-100%) with speaker icons on each end
- Slider uses orange accent color
- Three procedurally generated sound effects:
  - **Flip**: Short ascending tone on card tap
  - **Match**: Two-note celebratory chord on successful match
  - **Wrong**: Descending tone on failed match

#### On Match
- Segmented control: **Keep** / **Switch**
- Keep: Player retains turn after a successful match
- Switch: Turn always passes to the next player

#### Card Numbers
- Toggle ON / OFF (switch control)
- When ON, displays a number on each card face (1, 2, 3...) to help younger players track card positions
- Numbers appear on the card back (face-down state)

#### Show Names
- Toggle ON / OFF (switch control)
- When ON, displays the emoji label text below the emoji on revealed cards (e.g., "Fox" under 🦊)
- Uses the `kEmojiLabels` map for display text

All settings persist locally between sessions.

### 4.5 Gameplay

#### Game Flow
1. **Setup Screen** - Select difficulty, theme, configure settings, manage players, tap "Let's Play!" (blue bottom bar)
2. **Playing Screen** - Flip cards, find matches, track scores
3. **Win Screen** - View results, rankings, play again or return to setup

#### Match Logic
- Player taps a face-down card to flip it
- Player taps a second card to flip it
- If both cards show the same emoji: **Match** - cards stay revealed, player scores +1 point
- If cards differ: **No Match** - both cards flip back after 1 second, turn passes (or stays based on Keep Turn setting)
- Game ends when all pairs are matched

#### Card Flip Animation
- 3D flip animation using Flutter's `Transform` with perspective matrix
- Front face shows card content (emoji), optionally with label text below (if Show Names is ON) and card number (if Card Numbers is ON)
- Back face shows styled card back with **blue gradient** and subtle pattern, optionally with card number overlay
- Tap feedback: subtle scale on press

### 4.6 Scoring & Stats

#### In-Game Stats
- Elapsed time (continuously updated)
- Move count (incremented each turn attempt)
- Matched pair count
- Progress bar (matched / total pairs)

#### Best Scores
- Stored locally per combination of: theme + difficulty + player count
- Key format: `{theme}-{difficulty}-{playerCount}p` (e.g., `farm-Easy-2p`)
- Tracked per entry: moves, time, date
- "New Best Score!" indicator when current game beats the record
- Comparison: fewer moves wins; if tied, faster time wins

#### Game State Persistence
- Auto-save game state locally so interrupted games can be resumed
- Saved data: card positions, match status, current player, scores, elapsed time, turn count, all settings
- Cleared when game finishes or user returns to setup

### 4.7 Win Screen

- Confetti particle animation (random colors, sizes, rotation, fall speed)
- Display final stats: total time, total moves
- Player rankings sorted by score (crown icon for 1st place)
- Buttons: "Play Again" (same settings) and "New Setup" (return to setup)

---

## 5. UI/UX Design

### 5.1 Design System & Branding

- **App Name:** Memo Sprout
- **Logo:** Card character with sprout + leaves on blue background (`public/logo-with-background.jpeg`)
- **Font:** Fredoka (or similar rounded, playful font)
- **Base Color:** Blue (matching logo background)
- **Color Palette:**
  - Primary: Deep blue `#2962FF` (buttons, active states, "Let's Play!" bar)
  - Primary Light: Light blue `#E3F2FD` (backgrounds, card surfaces)
  - Accent: Indigo/purple `#5C6BC0` (selected theme highlight, active toggles)
  - Secondary: Orange `#FF9800` (sliders, sound volume bar)
  - Danger/Hard: Red `#EF5353` (Hard difficulty selected state)
  - Surface: White `#FFFFFF` (cards, setting rows, content areas)
  - Text: Dark gray `#212121` (primary text), medium gray `#757575` (secondary)
- **Card Back:** Blue gradient with subtle pattern (replacing green from web version)
- Support system dark mode
- Rounded corners, soft shadows, card-based layout
- Top-left: Memo Sprout logo + name; Top-right: trophy/leaderboard icon

### 5.2 Setup Screen (Mobile)

Based on the reference design:

- **Header:** Memo Sprout logo (small, top-left) + app name + "Memory Match Game" subtitle. Trophy icon top-right.
- **Difficulty section:** Three large rounded cards in a row (Easy, Medium, Hard). Each shows an icon, label, and pair count. Selected state uses filled color (blue for Easy/Medium, red for Hard).
- **Theme section:** Horizontal scrollable row of square theme cards. Each shows the theme icon emoji and name. Selected state uses indigo/purple filled background with white text.
- **Settings section:** Vertical list of setting rows with:
  - Left: colored icon + label
  - Right: toggle switch or segmented control
  - Expandable sliders (timer duration, volume) appear below when toggle is ON
- **Players section:** Header shows count + shuffle button + add player button. Player list with drag handles, colored number badges, and editable name fields.
- **Start button:** Full-width "Let's Play!" button pinned at bottom with play icon, using primary blue with white text.

### 5.3 Playing Screen (Mobile)
- Top bar: progress bar, timer (if enabled), pause/settings button
- Player scoreboard: horizontal scrollable bar showing all players with active player highlighted
- Center: responsive card grid filling available space
- Match feedback: toast notification at bottom showing matched pair
- Cards sized to fit screen width based on column count with consistent gap

### 5.4 Win Screen (Mobile)
- Full-screen overlay with confetti
- Centered card with stats and rankings
- Action buttons at the bottom

### 5.5 Responsive Behavior
- Portrait orientation optimized
- Landscape supported with adjusted grid
- Tablet: larger cards, more columns

---

## 6. Technical Architecture

### 6.1 Stack
- **Framework:** Flutter (latest stable)
- **Language:** Dart
- **State Management:** Riverpod (recommended) or BLoC
- **Local Storage:** SharedPreferences for settings and best scores; Hive or local JSON for game state persistence
- **Audio:** `audioplayers` package or procedural generation via `flutter_soloud`
- **Animations:** Flutter built-in (`AnimationController`, `Tween`, `Transform` with `Matrix4`); `confetti` package or custom painter for win screen

### 6.2 Project Structure

```
lib/
├── main.dart
├── app.dart
├── models/
│   ├── card_model.dart
│   ├── player_model.dart
│   ├── game_settings.dart
│   └── game_state.dart
├── data/
│   ├── themes.dart            # All 9 themes with emoji data & labels
│   └── player_colors.dart     # Player color definitions
├── providers/
│   ├── game_provider.dart
│   ├── settings_provider.dart
│   └── players_provider.dart
├── screens/
│   ├── setup_screen.dart
│   ├── game_screen.dart
│   └── win_screen.dart
├── widgets/
│   ├── card_widget.dart
│   ├── player_scoreboard.dart
│   ├── difficulty_selector.dart
│   ├── theme_selector.dart
│   ├── settings_panel.dart
│   ├── timer_widget.dart
│   ├── progress_bar.dart
│   └── confetti_overlay.dart
└── utils/
    ├── sounds.dart
    ├── shuffle.dart            # Fisher-Yates shuffle
    └── storage.dart            # Local persistence helpers
```

### 6.3 Theme Data (Dart)

```dart
const kEmojiLabels = <String, String>{
  // Farm
  '🐄': 'Cow', '🐔': 'Chicken', '🦢': 'Swan', '🐑': 'Sheep',
  '🐴': 'Horse', '🐇': 'Rabbit', '🐈': 'Cat', '🐓': 'Rooster',
  '🦆': 'Duck', '🐐': 'Goat', '🐎': 'Horse', '🐈‍⬛': 'Black Cat',
  '🐏': 'Ram', '🦃': 'Turkey', '🕊️': 'Dove', '🐂': 'Ox',
  '🐃': 'Buffalo', '🐮': 'Cow Face', '🐣': 'Chick', '🦜': 'Parrot',
  '🦙': 'Llama', '🐪': 'Camel', '🦚': 'Peacock', '🦤': 'Dodo',
  // Garden
  '🌻': 'Sunflower', '🌷': 'Tulip', '🌹': 'Rose', '🌺': 'Hibiscus',
  '🌸': 'Blossom', '🌼': 'Daisy', '🏵️': 'Rosette', '🪻': 'Hyacinth',
  '🌾': 'Rice', '🌰': 'Chestnut', '🌿': 'Herb', '🌵': 'Cactus',
  '🥀': 'Wilted', '🪴': 'Plant', '🌱': 'Seedling', '🍃': 'Leaf',
  '🌳': 'Tree', '🌴': 'Palm', '🪹': 'Nest', '🍁': 'Maple',
  '🍂': 'Fallen Leaf', '🪺': 'Eggs', '🪷': 'Lotus', '🫘': 'Beans',
  // Fruits
  '🍎': 'Apple', '🍌': 'Banana', '🍇': 'Grapes', '🍊': 'Orange',
  '🍓': 'Strawberry', '🍉': 'Watermelon', '🍑': 'Peach', '🍒': 'Cherry',
  '🥝': 'Kiwi', '🍍': 'Pineapple', '🥭': 'Mango', '🫐': 'Blueberry',
  '🍋': 'Lemon', '🥥': 'Coconut', '🍈': 'Melon', '🍐': 'Pear',
  '🫒': 'Olive', '🥑': 'Avocado', '🍅': 'Tomato', '🫑': 'Pepper',
  '🥒': 'Cucumber', '🌽': 'Corn', '🥕': 'Carrot', '🍆': 'Eggplant',
  // Animals
  '🦊': 'Fox', '🐻': 'Bear', '🐼': 'Panda', '🐨': 'Koala',
  '🐯': 'Tiger', '🦁': 'Lion', '🐵': 'Monkey', '🐘': 'Elephant',
  '🦒': 'Giraffe', '🦓': 'Zebra', '🐆': 'Leopard', '🦘': 'Kangaroo',
  '🦛': 'Hippo', '🦏': 'Rhino', '🐊': 'Crocodile', '🦈': 'Shark',
  '🐋': 'Whale', '🐬': 'Dolphin', '🦅': 'Eagle', '🦉': 'Owl',
  '🦩': 'Flamingo', '🐧': 'Penguin', '🐺': 'Wolf', '🦇': 'Bat',
  // Food
  '🍕': 'Pizza', '🍔': 'Burger', '🌮': 'Taco', '🍜': 'Noodles',
  '🍣': 'Sushi', '🧁': 'Cupcake', '🎂': 'Cake', '🍩': 'Donut',
  '🍪': 'Cookie', '🥐': 'Croissant', '🥯': 'Bagel', '🧇': 'Waffle',
  '🥞': 'Pancakes', '🍰': 'Shortcake', '🥧': 'Pie', '🍫': 'Chocolate',
  '☕': 'Coffee', '🧃': 'Juice', '🥤': 'Drink', '🍵': 'Tea',
  '🧈': 'Butter', '🥨': 'Pretzel', '🥖': 'Bread', '🍿': 'Popcorn',
  // Ocean
  '🐙': 'Octopus', '🦑': 'Squid', '🐠': 'Tropical Fish',
  '🐡': 'Blowfish', '🐳': 'Spouting Whale', '🦐': 'Shrimp',
  '🦞': 'Lobster', '🦀': 'Crab', '🐚': 'Shell',
  '🪸': 'Coral', '🦭': 'Seal', '🪼': 'Jellyfish',
  '🦦': 'Otter', '🐢': 'Turtle', '🦪': 'Oyster',
  '🌊': 'Wave', '🏝️': 'Island', '🐟': 'Fish',
  '⚓': 'Anchor', '🚢': 'Ship', '🧜': 'Merperson',
  // Sports
  '⚽': 'Football', '🏀': 'Basketball', '🏈': 'Rugby Ball', '⚾': 'Baseball',
  '🎾': 'Tennis', '🏐': 'Volleyball', '🏉': 'Rugby', '🏒': 'Hockey',
  '🏓': 'Ping Pong', '🏸': 'Badminton', '🥊': 'Boxing', '🥋': 'Martial Arts',
  '🥅': 'Goal', '🏹': 'Archery', '🥇': 'Gold', '🥈': 'Silver',
  '🥉': 'Bronze', '🏅': 'Medal', '🎿': 'Skiing', '🛷': 'Sled',
  '⛸️': 'Ice Skate', '🥏': 'Frisbee', '🪃': 'Boomerang', '🏏': 'Cricket',
  // Flags
  '🏁': 'Finish', '🚩': 'Flag', '🇲🇾': 'Malaysia', '🏴': 'Black Flag',
  '🏳️': 'White Flag', '🇺🇸': 'USA', '🇬🇧': 'UK', '🇫🇷': 'France',
  '🇩🇪': 'Germany', '🇯🇵': 'Japan', '🇰🇷': 'Korea', '🇨🇳': 'China',
  '🇮🇳': 'India', '🇧🇷': 'Brazil', '🇦🇺': 'Australia', '🇨🇦': 'Canada',
  '🇮🇹': 'Italy', '🇪🇸': 'Spain', '🇲🇽': 'Mexico', '🇹🇷': 'Turkey',
  '🇮🇩': 'Indonesia', '🇸🇦': 'Saudi', '🇪🇬': 'Egypt', '🇿🇦': 'S. Africa',
  // Transport
  '🚗': 'Car', '🚕': 'Taxi', '🚌': 'Bus', '🚎': 'Trolley',
  '🏎️': 'Race Car', '🚓': 'Police', '🚑': 'Ambulance', '🚒': 'Fire Truck',
  '🚐': 'Minibus', '🛻': 'Pickup', '🚚': 'Truck', '🚛': 'Lorry',
  '🚜': 'Tractor', '🏍️': 'Motorcycle', '🛵': 'Scooter', '🚲': 'Bicycle',
  '🛴': 'Kick Scooter', '🚂': 'Train', '🚆': 'Railway', '🚇': 'Metro',
  '🚈': 'Light Rail', '✈️': 'Airplane', '🚁': 'Helicopter', '🛶': 'Canoe',
};

const kGameThemes = [
  GameTheme(id: 'farm', name: 'Farm', icon: '🐄', items: [
    '🐄', '🐔', '🦢', '🐑', '🐴', '🐇', '🐈', '🐓',
    '🦆', '🐐', '🐎', '🐈‍⬛', '🐏', '🦃', '🕊️', '🐂',
    '🐃', '🐮', '🐣', '🦜', '🦙', '🐪', '🦚', '🦤',
  ]),
  GameTheme(id: 'garden', name: 'Garden', icon: '🌻', items: [
    '🌻', '🌷', '🌹', '🌺', '🌸', '🌼', '🏵️', '🪻',
    '🌾', '🌰', '🌿', '🌵', '🥀', '🪴', '🌱', '🍃',
    '🌳', '🌴', '🪹', '🍁', '🍂', '🪺', '🪷', '🫘',
  ]),
  GameTheme(id: 'fruits', name: 'Fruits', icon: '🍎', items: [
    '🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍑', '🍒',
    '🥝', '🍍', '🥭', '🫐', '🍋', '🥥', '🍈', '🍐',
    '🫒', '🥑', '🍅', '🫑', '🥒', '🌽', '🥕', '🍆',
  ]),
  GameTheme(id: 'animals', name: 'Animals', icon: '🦊', items: [
    '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐵', '🐘',
    '🦒', '🦓', '🐆', '🦘', '🦛', '🦏', '🐊', '🦈',
    '🐋', '🐬', '🦅', '🦉', '🦩', '🐧', '🐺', '🦇',
  ]),
  GameTheme(id: 'food', name: 'Food', icon: '🍕', items: [
    '🍕', '🍔', '🌮', '🍜', '🍣', '🧁', '🎂', '🍩',
    '🍪', '🥐', '🥯', '🧇', '🥞', '🍰', '🥧', '🍫',
    '☕', '🧃', '🥤', '🍵', '🧈', '🥨', '🥖', '🍿',
  ]),
  GameTheme(id: 'ocean', name: 'Ocean', icon: '🐙', items: [
    '🐙', '🦑', '🐠', '🐡', '🐳', '🦐',
    '🦞', '🦀', '🐚', '🪸', '🦭', '🪼',
    '🦦', '🐢', '🦪', '🌊', '🏝️', '🐟',
    '⚓', '🚢', '🧜', '🐬', '🐋', '🦈',
  ]),
  GameTheme(id: 'sports', name: 'Sports', icon: '⚽', items: [
    '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🏒',
    '🏓', '🏸', '🥊', '🥋', '🥅', '🏹', '🥇', '🥈',
    '🥉', '🏅', '🎿', '🛷', '⛸️', '🥏', '🪃', '🏏',
  ]),
  GameTheme(id: 'flags', name: 'Flags', icon: '🏁', items: [
    '🏁', '🚩', '🇲🇾', '🏴', '🏳️', '🇺🇸', '🇬🇧', '🇫🇷',
    '🇩🇪', '🇯🇵', '🇰🇷', '🇨🇳', '🇮🇳', '🇧🇷', '🇦🇺', '🇨🇦',
    '🇮🇹', '🇪🇸', '🇲🇽', '🇹🇷', '🇮🇩', '🇸🇦', '🇪🇬', '🇿🇦',
  ]),
  GameTheme(id: 'transport', name: 'Transport', icon: '🚗', items: [
    '🚗', '🚕', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒',
    '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲',
    '🛴', '🚂', '🚆', '🚇', '🚈', '✈️', '🚁', '🛶',
  ]),
];
```

---

## 7. Out of Scope

- **Learn English section** - Word-Picture, Riddles, Fill Blank, Trivia, Geography themes are all excluded
- Text-to-speech functionality
- Online / networked multiplayer
- User accounts / cloud sync
- In-app purchases
- Ads
- Push notifications

---

## 8. Milestones

### M1 - Core Game Loop
- Card model, shuffle logic, match logic
- Single-player game with one theme (Farm)
- Card flip animation
- Win condition detection

### M2 - Full Setup Screen
- Difficulty selector
- All 9 themes with emoji data
- Settings UI (timer, sound, keep turn)
- Player management (add, remove, edit, reorder)

### M3 - Multiplayer & Scoring
- Turn-based multiplayer (up to 20 players)
- Scoreboard with active player highlight
- Turn timer with visual countdown
- Best score tracking and persistence

### M4 - Polish & Persistence
- Sound effects (flip, match, wrong)
- Confetti and win screen animations
- Game state auto-save and resume
- Dark mode support
- Performance optimization for 48-card grid

### M5 - Release Prep
- iOS and Android testing on real devices
- App icons and splash screen
- App Store / Play Store listing assets
- Beta testing and bug fixes
