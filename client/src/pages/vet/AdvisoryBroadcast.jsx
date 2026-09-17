import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MapPin, MessageSquare, Globe, CheckCircle, Bell } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "?????" },
  { code: "mr", label: "?????" },
  { code: "ta", label: "?????" },
  { code: "gu", label: "???????" },
];

const TEMPLATES = {
  fmd: {
    en: "FMD suspected within 10 km of your village. Isolate affected cattle immediately, avoid shared water troughs, and notify your field worker.",
    hi: "???? ???? ?? 10 ???? ?? ???? FMD ??????? ??? ???????? ????? ?? ????? ??? ????, ???? ???? ?? ???? ?? ???? ?? ???? ????? ?????????? ?? ????? ?????",
    mr: "??????? ????????? 10 ???? ?? FMD ?????? ???. ???????? ?????? ??????? ????? ???, ??????? ???????? ???? ????? ??? ??? ??????? ??????? ?????????????? ????.",
  },
  anthrax: {
    en: "URGENT: Anthrax suspected in your district. Do NOT touch dead animals with bare hands. Burn and bury carcasses. Call the veterinary helpline immediately: 1962.",
    hi: "??????: ???? ???? ??? ????????? ??????? ??? ??? ??????? ?? ???? ????? ?? ? ????? ???? ?? ????? ??????? ????? ??? ???????? ????????? ?? ??? ????: 1962?",
    mr: "???????: ??????? ????????? ????????? ?????? ???. ??? ??????????? ?????? ?????? ?????? ??? ???. ?????? ????? ?????. ??????? ??????????? ??????????? ??? ???: 1962.",
  },
  ppr: {
    en: "PPR (Goat Plague) detected nearby. Separate sick goats and sheep from the herd. Do not sell or move animals to other markets. Contact the nearest vet.",
    hi: "???? ?? PPR (???? ?????) ?? ??? ??? ??? ????? ??????? ?? ?????? ?? ???? ?? ??? ????? ??????? ?? ???? ??????? ??? ? ????? ?? ? ?? ????? ?????? ??? ???????? ?? ?????? ?????",
    mr: "?????? PPR (???? ?????) ????? ???. ????? ?????? ? ??????? ????????? ??????? ???. ????????? ??? ??????? ???? ???. ??????? ???????????? ?????? ???.",
  },
};

const SENT_HISTORY = [
  { id: 1, disease: "FMD", district: "Pune", lang: "Marathi", channel: "SMS", count: 1420, time: "Today 10:15 AM", status: "delivered" },
  { id: 2, disease: "Anthrax", district: "Rajkot", lang: "Gujarati", channel: "WhatsApp", count: 840, time: "Yesterday 4:30 PM", status: "delivered" },
  { id: 3, disease: "PPR", district: "Solapur", lang: "Hindi", channel: "IVR", count: 620, time: "16 Sep 2026", status: "delivered" },
];

export default function AdvisoryBroadcast() {
  const navigate = useNavigate();
  const [disease, setDisease] = useState("fmd");
  const [lang, setLang] = useState("en");
  const [channel, setChannel] = useState("sms");
  const [district, setDistrict] = useState("Pune");
  const [customMsg, setCustomMsg] = useState("");
  const [sent, setSent] = useState(false);

  const templateMsg = TEMPLATES[disease]?.[lang] || TEMPLATES[disease]?.["en"] || "";
  const message = customMsg || templateMsg;

  const handleSend = () => { setSent(true); setTimeout(() => setSent(false), 3000); };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 pt-10 pb-4 sticky top-0 z-10">
        <button onClick={() => navigate("/vet")} className="flex items-center text-gray-500 gap-2 mb-3 text-sm"><ArrowLeft className="w-4 h-4" /> Dashboard</button>
        <h1 className="text-xl font-bold text-gray-800">Multilingual Advisory Broadcast</h1>
        <p className="text-gray-400 text-xs mt-0.5">Send geo-fenced SMS / WhatsApp / IVR alerts to affected farmers</p>
      </div>

      <div className="p-4 space-y-4">

        {/* Disease & Location */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Target & Disease</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Disease</label>
              <select value={disease} onChange={e => setDisease(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                <option value="fmd">FMD (Foot & Mouth)</option>
                <option value="anthrax">Anthrax</option>
                <option value="ppr">PPR (Goat Plague)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">District</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={district} onChange={e => setDistrict(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Language & Channel */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Language & Channel</h3>
          <div className="flex gap-2 flex-wrap mb-3">
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${lang === l.code ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600"}`}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["sms", "whatsapp", "ivr"].map(c => (
              <button key={c} onClick={() => setChannel(c)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${channel === c ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600"}`}>
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-blue-500" /> Message</h3>
            <span className="text-[10px] text-blue-600 font-semibold border border-blue-100 bg-blue-50 px-2 py-0.5 rounded-full">Auto-translated</span>
          </div>
          <textarea value={customMsg || templateMsg} onChange={e => setCustomMsg(e.target.value)} rows={4}
            className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-400 resize-none text-gray-700" />
          <p className="text-xs text-gray-400 mt-1">{message.length} characters · Estimated farmers reached: ~1,240</p>
        </div>

        {/* Send Button */}
        <button onClick={handleSend}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition ${sent ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
          {sent ? <><CheckCircle className="w-5 h-5" /> Advisory Sent Successfully!</> : <><Send className="w-5 h-5" /> Send Broadcast</>}
        </button>

        {/* History */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-gray-400" /> Sent History</h3>
          <div className="space-y-3">
            {SENT_HISTORY.map(h => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs font-semibold text-gray-700">{h.disease} · {h.district}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{h.lang} · {h.channel} · {h.count.toLocaleString()} recipients · {h.time}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
