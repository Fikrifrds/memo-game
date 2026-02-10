# Color Mix Game

A fun color mixing game built with Flutter. Match the target color by mixing primary colors!

## How to Play

1. A **target color** is shown at the top of the screen
2. Tap the color circles (Red, Blue, Yellow, White, Black) to add drops to your mix
3. The mixing bowl shows your current mixed color and match percentage
4. Hit **Submit** when you're happy with your mix
5. Play 5 rounds and try to get the highest total score!

## Setup on Mac

Since this project was scaffolded without `flutter create`, you need to generate platform files:

```bash
cd color_mix_game
flutter create .
flutter pub get
```

## Run

```bash
# iOS Simulator
open -a Simulator
flutter run

# Android
flutter run -d android

# Chrome
flutter run -d chrome
```

## Test

```bash
flutter test
```

## Project Structure

```
lib/
  main.dart                  # App entry point
  models/
    game_state.dart          # Game logic & color mixing
  screens/
    game_screen.dart         # Main game screen
  widgets/
    color_palette.dart       # Color selection buttons
    mixing_bowl.dart         # Visual mixing area
    target_display.dart      # Target color display
    score_board.dart         # Score & round tracker
```
