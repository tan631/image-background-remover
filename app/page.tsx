"use client";

import { useState, useRef, useCallback } from "react";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [phrase, setPhrase] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setImage(file);
    setResult(null);
    setError(null);
    setPreview(URL.createObjectURL(file));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }, []);

  const onSubmit = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const form = new FormData();
    form.append("image", image);
    form.append("phrase", phrase);

    try {
      const res = await fetch("/api/remove-bg", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "处理失败");
      } else {
        const blob = await res.blob();
        setResult(URL.createObjectURL(blob));
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      {/* 帅照 - 固定在右下角，不挡操作 */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          <img
            src="/handsome.jpg"
            alt="本站创始人"
            className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white ring-2 ring-blue-400 transition-transform group-hover:scale-110 cursor-pointer"
          />
          <span className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            谭超真帅 ✨
          </span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">图片背景去除</h1>
      <p className="text-gray-500 mb-10">上传图片，一键去除背景</p>

      {/* 上传区域 */}
      <div
        className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
          dragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white hover:border-blue-300"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {preview ? (
          <img src={preview} alt="预览" className="max-h-48 mx-auto rounded-lg object-contain" />
        ) : (
          <>
            <div className="text-5xl mb-3">🖼️</div>
            <p className="text-gray-500">点击或拖拽图片到此处</p>
            <p className="text-gray-400 text-sm mt-1">支持 JPG、PNG、WebP</p>
          </>
        )}
      </div>

      {/* 暗语输入 */}
      <div className="w-full max-w-lg mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          验证暗语
        </label>
        <input
          type="text"
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder="请输入暗语才能去除背景 🤫"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <p className="text-xs text-gray-400 mt-1">提示：输入正确的暗语后才可以处理图片</p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="w-full max-w-lg mt-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* 提交按钮 */}
      <button
        onClick={onSubmit}
        disabled={!image || loading}
        className="mt-6 w-full max-w-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition"
      >
        {loading ? "处理中..." : "去除背景"}
      </button>

      {/* 结果对比 */}
      {result && (
        <div className="w-full max-w-2xl mt-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">处理结果</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-2 text-center">原图</p>
              <img src={preview!} alt="原图" className="w-full rounded-lg object-contain max-h-64" />
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23e5e5e5'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23e5e5e5'/%3E%3C/svg%3E\")" }}>
              <p className="text-xs text-gray-400 mb-2 text-center">去背景</p>
              <img src={result} alt="结果" className="w-full rounded-lg object-contain max-h-64" />
            </div>
          </div>
          <a
            href={result}
            download="removed-bg.png"
            className="mt-4 block w-full text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
          >
            下载图片
          </a>
        </div>
      )}
    </main>
  );
}
