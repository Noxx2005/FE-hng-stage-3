'use client';

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex items-center justify-center min-h-screen bg-blue-50"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900">Habit Tracker</h1>
      </div>
    </div>
  );
}
