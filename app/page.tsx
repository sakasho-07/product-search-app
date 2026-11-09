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

  const filteredProducts = products.filter((product) => {
    const matchesKeyword = product.name.includes(keyword);

    const matchesCategory =
      category === "すべて" || product.category === category;

    return matchesKeyword && matchesCategory;
  });

  return (
    <main>
      <h1>商品検索アプリ</h1>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="すべて">すべて</option>
        <option value="PC">PC</option>
        <option value="スマホ">スマホ</option>
        <option value="タブレット">タブレット</option>
        <option value="周辺機器">周辺機器</option>
      </select>

      <input
        type="text"
        placeholder="商品名を入力してください"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div key={product.id}>
            <img
              src={product.image}
              alt={product.name}
            />

            <p>{product.name}</p>
            <p>{product.category}</p>
            <p>{product.price}円</p>
          </div>
        ))
      ) : (
        <p>該当する商品がありません。検索条件を変更してください。</p>
      )}
    </main>
  );
}