import 'package:flutter/material.dart';
import '../models/game_state.dart';
import '../widgets/color_palette.dart';
import '../widgets/mixing_bowl.dart';
import '../widgets/target_display.dart';
import '../widgets/score_board.dart';

class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  GameState _gameState = GameState.newGame();

  void _addColor(Color color) {
    if (_gameState.isGameOver) return;
    setState(() {
      _gameState = _gameState.addColor(color);
    });
  }

  void _submitGuess() {
    final percentage = _gameState.matchPercentage;
    final message = percentage >= 90
        ? 'Perfect! $percentage% match!'
        : percentage >= 70
            ? 'Great! $percentage% match!'
            : percentage >= 50
                ? 'Not bad! $percentage% match'
                : 'Keep trying! $percentage% match';

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: const TextStyle(fontSize: 16)),
        backgroundColor: percentage >= 70 ? Colors.green : Colors.orange,
        duration: const Duration(seconds: 2),
      ),
    );

    setState(() {
      _gameState = _gameState.submitGuess();
    });
  }

  void _clearMix() {
    setState(() {
      _gameState = _gameState.clearMix();
    });
  }

  void _newGame() {
    setState(() {
      _gameState = GameState.newGame();
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_gameState.isGameOver) {
      return _buildGameOverScreen();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Color Mix Game'),
        centerTitle: true,
        actions: [
          ScoreBoard(
            score: _gameState.score,
            round: _gameState.round,
            maxRounds: _gameState.maxRounds,
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              // Target color to match
              TargetDisplay(targetColor: _gameState.targetColor),
              const SizedBox(height: 24),

              // Mixing bowl showing current mix
              Expanded(
                child: MixingBowl(
                  currentMix: _gameState.currentMix,
                  drops: _gameState.mixedColors,
                  matchPercentage: _gameState.matchPercentage,
                ),
              ),
              const SizedBox(height: 16),

              // Action buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ElevatedButton.icon(
                    onPressed: _gameState.mixedColors.isEmpty ? null : _clearMix,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Clear'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[700],
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed:
                        _gameState.mixedColors.isEmpty ? null : _submitGuess,
                    icon: const Icon(Icons.check),
                    label: const Text('Submit'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green[700],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Color palette
              ColorPalette(
                colors: GameState.availableColors,
                onColorTap: _addColor,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGameOverScreen() {
    final avgScore = (_gameState.score / _gameState.maxRounds).round();

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.palette, size: 80, color: Colors.amber),
            const SizedBox(height: 24),
            const Text(
              'Game Over!',
              style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Text(
              'Total Score: ${_gameState.score}',
              style: const TextStyle(fontSize: 24),
            ),
            Text(
              'Average Match: $avgScore%',
              style: TextStyle(fontSize: 18, color: Colors.grey[400]),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: _newGame,
              icon: const Icon(Icons.replay),
              label: const Text('Play Again', style: TextStyle(fontSize: 18)),
              style: ElevatedButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
