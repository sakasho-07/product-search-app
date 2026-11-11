"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("すべて");
  const [sortOrder, setSortOrder] = useState("default");
  const [favorites, setFavorites] = useState<number[]>([]);
  const toggleFavorite = (productId: number) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter((id) => id !== productId);
      }

      return [...prevFavorites, productId];
    });
  };

  const [isInitialized, setIsInitialized] = useState(false);


  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/products.json");
      const data = await response.json();

      setProducts(data);
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setKeyword(params.get("keyword") ?? "");
    setCategory(params.get("category") ?? "すべて");

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();

    if (keyword) {
      params.set("keyword", keyword);
    }

    if (category !== "すべて") {
      params.set("category", category);
    }

    const queryString = params.toString();

    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.replaceState(null, "", newUrl);
  }, [keyword, category, isInitialized]);

  const filteredProducts = products
    .filter((product) => {
      const matchesKeyword = product.name.includes(keyword);

      const matchesCategory =
        category === "すべて" || product.category === category;

      return matchesKeyword && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      }

      if (sortOrder === "desc") {
        return b.price - a.price;
      }

      return 0;
    });

  return (
    <main>
      <header className="border-b border-[#8A7057]/30 px-6 py-8 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-[0.2em]">
          MODERN SELECT
        </h1>

        <p className="mt-2 text-xs tracking-[0.25em] text-[#8A7057]">
          CURATED ITEMS FOR MODERN LIVING
        </p>

        <nav className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 px-2 text-xs tracking-widest sm:gap-10 sm:text-sm">
          <a href="#" className="hover:text-[#8A7057]">ALL ITEMS</a>
          <a href="#" className="hover:text-[#8A7057]">PC</a>
          <a href="#" className="hover:text-[#8A7057]">SMARTPHONE</a>
          <a href="#" className="hover:text-[#8A7057]">ACCESSORIES</a>
        </nav>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 pt-10 sm:flex-row">
        <input
          type="text"
          placeholder="商品名で検索..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full rounded-full border border-[#8A7057]/30 bg-white/60 px-6 py-3 text-sm outline-none transition focus:border-[#8A7057] sm:flex-1"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-full border border-[#8A7057]/30 bg-white/60 px-6 py-3 text-sm outline-none focus:border-[#8A7057]"
        >
          <option value="すべて">すべてのカテゴリー</option>
          <option value="PC">PC</option>
          <option value="スマホ">スマホ</option>
          <option value="タブレット">タブレット</option>
          <option value="周辺機器">周辺機器</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="rounded-full border border-[#8A7057]/30 bg-white/60 px-6 py-3 text-sm outline-none focus:border-[#8A7057]"
        >
          <option value="default">おすすめ順</option>
          <option value="asc">価格が安い順</option>
          <option value="desc">価格が高い順</option>
        </select>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pt-6">
        <div>
          <p className="text-sm text-[#8A7057]">
            全{products.length}件中 {filteredProducts.length}件を表示
          </p>

          <p className="mt-1 text-sm text-[#8A7057]">
            ♥ お気に入り：{favorites.length}件
          </p>
        </div>

        <button
          onClick={() => {
            setKeyword("");
            setCategory("すべて");
            setSortOrder("default");
          }}
          className="rounded-full border border-[#8A7057]/40 px-5 py-2 text-xs text-[#8A7057] transition hover:bg-[#8A7057] hover:text-white"
        >
          条件をリセット
        </button>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-12 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-lg bg-white/70 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-[#EAE2D5]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl shadow-sm transition hover:scale-110"
                  aria-label="お気に入り"
                >
                  {favorites.includes(product.id) ? "♥" : "♡"}
                </button>
              </div>

              <div className="p-4">
                <p className="text-xs tracking-widest text-[#8A7057]">
                  {product.category}
                </p>

                <p className="mt-2 text-sm font-medium text-[#302820]">
                  {product.name}
                </p>

                <p className="mt-3 text-base font-semibold text-[#302820]">
                  ¥{product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>該当する商品がありません。検索条件を変更してください。</p>
      )}

            <footer className="mt-12 border-t border-[#8A7057]/30 bg-[#EAE2D5] px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-serif font-semibold tracking-[0.2em]">
              MODERN SELECT
            </h2>

            <p className="mt-3 text-xs leading-6 text-[#8A7057]">
              日々の暮らしを豊かにする、<br />
              こだわりのアイテムをセレクト。
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-widest">
              CONTACT
            </h3>

            <p className="mt-3 text-sm text-[#8A7057]">
              お問い合わせはこちら
            </p>
            <p className="mt-2 text-sm text-[#8A7057]">
              Email: info@modern-select.example
            </p>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-[#8A7057]/20 pt-6 text-center">
          <p className="text-xs text-[#8A7057]">
            © 2026 MODERN SELECT. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}