import 'package:flutter/material.dart';

class ScoreBoard extends StatelessWidget {
  final int score;
  final int round;
  final int maxRounds;

  const ScoreBoard({
    super.key,
    required this.score,
    required this.round,
    required this.maxRounds,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _chip('Round $round/$maxRounds', Icons.gamepad),
          const SizedBox(width: 8),
          _chip('$score pts', Icons.star),
        ],
      ),
    );
  }

  Widget _chip(String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white12,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: Colors.amber),
          const SizedBox(width: 4),
          Text(label, style: const TextStyle(fontSize: 13)),
        ],
      ),
    );
  }
}
