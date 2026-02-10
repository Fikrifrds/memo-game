import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:color_mix_game/models/game_state.dart';

void main() {
  group('GameState', () {
    test('newGame creates a valid initial state', () {
      final state = GameState.newGame();
      expect(state.mixedColors, isEmpty);
      expect(state.score, 0);
      expect(state.round, 1);
      expect(state.isGameOver, false);
    });

    test('addColor adds a color to the mix', () {
      final state = GameState.newGame().addColor(Colors.red);
      expect(state.mixedColors.length, 1);
      expect(state.mixedColors.first, Colors.red);
    });

    test('clearMix resets mixed colors', () {
      final state =
          GameState.newGame().addColor(Colors.red).addColor(Colors.blue);
      final cleared = state.clearMix();
      expect(cleared.mixedColors, isEmpty);
      expect(cleared.round, state.round);
    });

    test('currentMix returns white when no colors added', () {
      final state = GameState.newGame();
      expect(state.currentMix, const Color(0xFFFFFFFF));
    });

    test('currentMix averages colors correctly', () {
      final state = GameState.newGame()
          .addColor(const Color(0xFFFF0000))
          .addColor(const Color(0xFF0000FF));
      final mix = state.currentMix;
      // Average of red(255,0,0) and blue(0,0,255) = (128, 0, 128)
      expect(mix.red, 128);
      expect(mix.green, 0);
      expect(mix.blue, 128);
    });

    test('matchPercentage is 0 with no colors', () {
      final state = GameState.newGame();
      expect(state.matchPercentage, 0);
    });

    test('submitGuess advances to next round and adds score', () {
      final state = GameState.newGame().addColor(Colors.red);
      final next = state.submitGuess();
      expect(next.round, 2);
      expect(next.mixedColors, isEmpty);
    });

    test('isGameOver returns true after max rounds', () {
      var state = GameState.newGame();
      for (var i = 0; i < state.maxRounds; i++) {
        state = state.addColor(Colors.red).submitGuess();
      }
      expect(state.isGameOver, true);
    });
  });
}
