import 'package:flutter/material.dart';

class MixingBowl extends StatelessWidget {
  final Color currentMix;
  final List<Color> drops;
  final int matchPercentage;

  const MixingBowl({
    super.key,
    required this.currentMix,
    required this.drops,
    required this.matchPercentage,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text(
          'Your Mix',
          style: TextStyle(fontSize: 16, color: Colors.white70),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
            width: double.infinity,
            decoration: BoxDecoration(
              color: drops.isEmpty ? Colors.grey[800] : currentMix,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.white24, width: 2),
              boxShadow: drops.isEmpty
                  ? []
                  : [
                      BoxShadow(
                        color: currentMix.withValues(alpha: 0.3),
                        blurRadius: 20,
                        spreadRadius: 2,
                      ),
                    ],
            ),
            child: Center(
              child: drops.isEmpty
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.palette,
                            size: 48, color: Colors.grey[600]),
                        const SizedBox(height: 8),
                        Text(
                          'Tap colors below to mix!',
                          style: TextStyle(
                              color: Colors.grey[500], fontSize: 16),
                        ),
                      ],
                    )
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '${drops.length} drop${drops.length == 1 ? '' : 's'}',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: _textColorFor(currentMix),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '$matchPercentage% match',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: _textColorFor(currentMix),
                          ),
                        ),
                        const SizedBox(height: 12),
                        // Show the individual drops
                        Wrap(
                          spacing: 4,
                          children: drops
                              .map((c) => Container(
                                    width: 20,
                                    height: 20,
                                    decoration: BoxDecoration(
                                      color: c,
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                          color: Colors.white38, width: 1),
                                    ),
                                  ))
                              .toList(),
                        ),
                      ],
                    ),
            ),
          ),
        ),
      ],
    );
  }

  Color _textColorFor(Color bg) {
    // Use luminance to determine readable text color
    return bg.computeLuminance() > 0.4 ? Colors.black87 : Colors.white;
  }
}
