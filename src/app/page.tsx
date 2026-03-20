"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGroup } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [memberNames, setMemberNames] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addMemberField = () => {
    setMemberNames([...memberNames, ""]);
  };

  const removeMemberField = (index: number) => {
    if (memberNames.length <= 2) return;
    setMemberNames(memberNames.filter((_, i) => i !== index));
  };

  const updateMemberName = (index: number, name: string) => {
    const updated = [...memberNames];
    updated[index] = name;
    setMemberNames(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = groupName.trim();
    const validMembers = memberNames
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (!trimmedName) {
      setError("グループ名を入力してください");
      return;
    }
    if (validMembers.length < 2) {
      setError("メンバーを2人以上入力してください");
      return;
    }

    setLoading(true);
    try {
      const groupId = await createGroup(trimmedName, validMembers);
      router.push(`/g/${groupId}`);
    } catch {
      setError("グループの作成に失敗しました。もう一度お試しください。");
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-2xl font-bold mb-1.5 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
        新しいグループを作成
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        旅行やイベントの立て替えを簡単に精算できます
      </p>

      {error && (
        <div className="error-banner mb-5 animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card-strong p-5 space-y-5">
          <div>
            <label className="section-label mb-2 block">グループ名</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="例: 箱根旅行"
              className="glass-input"
            />
          </div>

          <div>
            <label className="section-label mb-2 block">メンバー</label>
            <div className="space-y-2.5">
              {memberNames.map((name, i) => (
                <div key={i} className="flex gap-2 animate-fade-in">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateMemberName(i, e.target.value)}
                    placeholder={`メンバー ${i + 1}`}
                    className="glass-input flex-1"
                  />
                  {memberNames.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeMemberField(i)}
                      className="delete-btn px-2 text-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMemberField}
              className="mt-3 text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent hover:opacity-70 transition-opacity"
            >
              + メンバーを追加
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient w-full py-3.5 text-base"
        >
          {loading ? "作成中..." : "グループを作成"}
        </button>
      </form>
    </div>
  );
}
