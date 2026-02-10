import 'package:flutter/material.dart';

class TargetDisplay extends StatelessWidget {
  final Color targetColor;

  const TargetDisplay({super.key, required this.targetColor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[850],
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          const Icon(Icons.flag, color: Colors.amber, size: 28),
          const SizedBox(width: 12),
          const Text(
            'Target Color:',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 500),
              height: 56,
              decoration: BoxDecoration(
                color: targetColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white24, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: targetColor.withValues(alpha: 0.4),
                    blurRadius: 12,
                    spreadRadius: 1,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
