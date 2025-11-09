import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-800 to-green-900 text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">Welcome to the Casino</h1>
          <p className="text-xl mb-8">Experience the thrill of gaming with our collection of casino games</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white text-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Blackjack</h2>
            <p className="mb-4">Beat the dealer by getting as close to 21 as possible without going over.</p>
            <a href="/games/blackjack" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              Play Now
            </a>
          </div>
          <div className="bg-white text-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow opacity-50">
            <h2 className="text-2xl font-bold mb-4">Roulette</h2>
            <p className="mb-4">Coming soon...</p>
          </div>
          <div className="bg-white text-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow opacity-50">
            <h2 className="text-2xl font-bold mb-4">Slots</h2>
            <p className="mb-4">Coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
