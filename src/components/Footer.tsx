export default function Footer() {
  return (
    <footer className="mt-24 border-t border-rose-100 bg-rose-50/40">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span
              className="text-xl font-bold text-rose-500"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              koolog
            </span>
          </div>

          <p className="text-sm text-stone-400 text-center">
            開発しながら学んだことを記録する空間です。
          </p>

          <p className="text-sm text-stone-400">
            © 2024 koolog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
