import React, { useEffect, useState } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxOviN26bY7wDKmcs4zvSsWxd_4V-ubHgmAxLEyad6X6BKKhKIpNiE65jZ4iPKLfh91/exec";

const players = [
  "Anil", "Viswa", "Venkat", "Ravi", "Yeswant", "Satya Vinay",
  "Suresh", "Sailesh", "Chandra", "Abhishek", "Naveen", "Akshay"
];

export default function Summary() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const sessionRes = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=Sessions`);
      const shuttleRes = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=Shuttles`);
      const sessionData = (await sessionRes.json()).data || [];
      const shuttleData = (await shuttleRes.json()).data || [];

      const stats = {};
      players.forEach(p => stats[p] = { paid: 0, share: 0 });

      // Sessions
      for (let i = 1; i < sessionData.length; i++) {
        const [,, fee, paidBy, playersStr] = sessionData[i];
        const attendees = playersStr.split(",").map(p => p.trim()).filter(Boolean);
        const split = fee / attendees.length;
        attendees.forEach(p => stats[p].share += split);
        stats[paidBy].paid += Number(fee);
      }

      // Shuttles
      for (let i = 1; i < shuttleData.length; i++) {
        const [, amount, paidBy, sharedStr] = shuttleData[i];
        const shared = sharedStr.split(",").map(p => p.trim()).filter(Boolean);
        const split = amount / shared.length;
        shared.forEach(p => stats[p].share += split);
        stats[paidBy].paid += Number(amount);
      }

      const results = players.map(name => ({
        name,
        paid: stats[name].paid.toFixed(2),
        share: stats[name].share.toFixed(2),
        balance: (stats[name].paid - stats[name].share).toFixed(2)
      }));

      setSummary(results);
    };

    loadData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Summary</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Player</th>
            <th className="border px-2 py-1">Paid (£)</th>
            <th className="border px-2 py-1">Share (£)</th>
            <th className="border px-2 py-1">Balance (£)</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((s) => (
            <tr key={s.name}>
              <td className="border px-2 py-1">{s.name}</td>
              <td className="border px-2 py-1">{s.paid}</td>
              <td className="border px-2 py-1">{s.share}</td>
              <td className={`border px-2 py-1 ${s.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {s.balance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
