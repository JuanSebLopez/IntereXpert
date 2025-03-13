import 'package:flutter/material.dart';

class InterestScreen extends StatelessWidget {
  const InterestScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<_InteresOption> options = [
      _InteresOption(
        title: "Tasa de Interés",
        subtitle: "Calcular o convertir Tasas",
        icon: Icons.trending_up,
        onTap: () {
          Navigator.pushNamed(context, '/rate_interest');
        },
      ),
      _InteresOption(
        title: "Interés Simple",
        subtitle: "Fórmulas para I. Simple",
        icon: Icons.calculate,
        onTap: () {
          Navigator.pushNamed(context, '/simple_interest');
        },
      ),
      _InteresOption(
        title: "Interés Compuesto",
        subtitle: "Fórmulas para I. Compuesto",
        icon: Icons.auto_graph,
        onTap: () {
          // Navegar a la pantalla de Interés Compuesto
        },
      ),
      _InteresOption(
        title: "Anualidades",
        subtitle: "Cálculos de anualidades",
        icon: Icons.attach_money,
        onTap: () {
          // Navegar a la pantalla de Anualidades
        },
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text("Cálculo Intereses"),
        centerTitle: true,
        automaticallyImplyLeading: false,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: GridView.builder(
            shrinkWrap: true,
            physics:
                const NeverScrollableScrollPhysics(), // 🔹 Evita conflicto con el ScrollView principal
            itemCount: options.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 16.0,
              mainAxisSpacing: 16.0,
              childAspectRatio:
                  0.9, // 🔹 Ajusta este valor para evitar el overflow
            ),
            itemBuilder: (context, index) {
              return _InteresCard(option: options[index]);
            },
          ),
        ),
      ),
    );
  }
}

class _InteresOption {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;

  _InteresOption({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.onTap,
  });
}

class _InteresCard extends StatelessWidget {
  final _InteresOption option;
  const _InteresCard({Key? key, required this.option}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: option.onTap,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(option.icon, size: 40, color: Colors.purple),
              const SizedBox(height: 12),
              Text(
                option.title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                option.subtitle,
                style: const TextStyle(color: Colors.grey),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
