import 'package:flutter/material.dart';
import '../models/game_state.dart';

class ColorPalette extends StatelessWidget {
  final List<ColorDrop> colors;
  final ValueChanged<Color> onColorTap;

  const ColorPalette({
    super.key,
    required this.colors,
    required this.onColorTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[850],
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: colors.map((drop) {
          return GestureDetector(
            onTap: () => onColorTap(drop.color),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 150),
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: drop.color,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white24, width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: drop.color.withValues(alpha: 0.4),
                        blurRadius: 8,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  drop.name,
                  style: const TextStyle(fontSize: 11, color: Colors.white70),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
