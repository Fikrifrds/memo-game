import 'dart:math';
import 'package:flutter/material.dart';

class ColorDrop {
  final Color color;
  final String name;

  const ColorDrop({required this.color, required this.name});
}

class GameState {
  static const List<ColorDrop> availableColors = [
    ColorDrop(color: Color(0xFFFF0000), name: 'Red'),
    ColorDrop(color: Color(0xFF0000FF), name: 'Blue'),
    ColorDrop(color: Color(0xFFFFFF00), name: 'Yellow'),
    ColorDrop(color: Color(0xFFFFFFFF), name: 'White'),
    ColorDrop(color: Color(0xFF000000), name: 'Black'),
  ];

  final Color targetColor;
  final List<Color> mixedColors;
  final int score;
  final int round;
  final int maxRounds;

  const GameState({
    required this.targetColor,
    this.mixedColors = const [],
    this.score = 0,
    this.round = 1,
    this.maxRounds = 5,
  });

  Color get currentMix {
    if (mixedColors.isEmpty) return const Color(0xFFFFFFFF);
    // Subtractive-style mixing: average the RGB channels
    int r = 0, g = 0, b = 0;
    for (final c in mixedColors) {
      r += c.red;
      g += c.green;
      b += c.blue;
    }
    return Color.fromARGB(
      255,
      (r / mixedColors.length).round().clamp(0, 255),
      (g / mixedColors.length).round().clamp(0, 255),
      (b / mixedColors.length).round().clamp(0, 255),
    );
  }

  /// Similarity score 0-100 between current mix and target
  int get matchPercentage {
    if (mixedColors.isEmpty) return 0;
    final mix = currentMix;
    final dr = (mix.red - targetColor.red).abs();
    final dg = (mix.green - targetColor.green).abs();
    final db = (mix.blue - targetColor.blue).abs();
    final maxDistance = 255 * 3;
    final distance = dr + dg + db;
    return (((maxDistance - distance) / maxDistance) * 100).round();
  }

  bool get isGameOver => round > maxRounds;

  GameState addColor(Color color) {
    return GameState(
      targetColor: targetColor,
      mixedColors: [...mixedColors, color],
      score: score,
      round: round,
      maxRounds: maxRounds,
    );
  }

  GameState submitGuess() {
    return GameState(
      targetColor: _generateRandomColor(),
      mixedColors: const [],
      score: score + matchPercentage,
      round: round + 1,
      maxRounds: maxRounds,
    );
  }

  GameState clearMix() {
    return GameState(
      targetColor: targetColor,
      mixedColors: const [],
      score: score,
      round: round,
      maxRounds: maxRounds,
    );
  }

  static GameState newGame() {
    return GameState(
      targetColor: _generateRandomColor(),
    );
  }

  static Color _generateRandomColor() {
    final random = Random();
    // Generate colors that are achievable by mixing the available colors
    final presets = [
      const Color(0xFFFF8000), // Orange
      const Color(0xFF800080), // Purple
      const Color(0xFF008000), // Green
      const Color(0xFFFF69B4), // Pink
      const Color(0xFF808000), // Olive
      const Color(0xFF008080), // Teal
      const Color(0xFFFF4500), // Red-Orange
      const Color(0xFF4B0082), // Indigo
      const Color(0xFF9ACD32), // Yellow-Green
      const Color(0xFFCD853F), // Peru/Brown
      const Color(0xFF708090), // Slate Gray
      const Color(0xFFFF6347), // Tomato
    ];
    return presets[random.nextInt(presets.length)];
  }
}
