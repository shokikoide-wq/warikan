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
    <div>
      <h1 className="text-2xl font-bold mb-2">新しいグループを作成</h1>
      <p className="text-gray-500 mb-6">
        旅行やイベントの立て替えを簡単に精算できます
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">グループ名</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="例: 箱根旅行"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">メンバー</label>
          <div className="space-y-2">
            {memberNames.map((name, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateMemberName(i, e.target.value)}
                  placeholder={`メンバー ${i + 1}`}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {memberNames.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeMemberField(i)}
                    className="text-gray-400 hover:text-red-500 px-2"
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
            className="mt-2 text-indigo-600 text-sm font-medium hover:text-indigo-800"
          >
            + メンバーを追加
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "作成中..." : "グループを作成"}
        </button>
      </form>
    </div>
  );
}
