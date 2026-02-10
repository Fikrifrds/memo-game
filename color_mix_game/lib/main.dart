import 'package:flutter/material.dart';
import 'screens/game_screen.dart';

void main() => runApp(const ColorMixApp());

class ColorMixApp extends StatelessWidget {
  const ColorMixApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Color Mix Game',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const GameScreen(),
    );
  }
}
