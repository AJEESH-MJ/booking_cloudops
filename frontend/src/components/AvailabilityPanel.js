import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../App.js";

export default function AvailabilityPanel({
  selectedNet,
  slotInterval = 60,
  businessStart = "06:00",
  businessEnd = "22:00",
}) {
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [slots, setSlots] = useState([]);
  const [freeStarts, setFreeStarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Build time slots
  useEffect(() => {
    const [sh, sm] = businessStart.split(":").map(Number);
    const [eh, em] = businessEnd.split(":").map(Number);
    const start = new Date(`${date}T${businessStart}:00`);
    const end = new Date(`${date}T${businessEnd}:00`);

    const t = [];
    let cur = new Date(start);
    while (cur < end) {
      const s = new Date(cur);
      const e = new Date(cur);
      e.setMinutes(e.getMinutes() + slotInterval);
      t.push({ start: s, end: e });
      cur = e;
    }
    setSlots(t);
  }, [date, slotInterval, businessStart, businessEnd]);

  useEffect(() => {
    async function fetchFree() {
      if (!selectedNet) return setFreeStarts([]);
      setLoading(true);
      try {
        const res = await axios.get(`${API}/availability`, {
          params: { date, duration: slotInterval, netIds: selectedNet._id },
        });
        const starts = (res.data || []).map((o) =>
          new Date(o.startAt).toISOString()
        );
        setFreeStarts(starts);
      } catch (err) {
        setMessage("Unable to fetch availability. Showing offline view.");
        setFreeStarts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFree();
  }, [selectedNet, date, slotInterval]);

  const isFree = (slot) =>
    freeStarts.includes(slot.start.toISOString());

  const handleBookClick = (slot) => setSelectedSlot(slot);

  const confirmBooking = () => {
    const iso = selectedSlot.start.toISOString();
    setFreeStarts((prev) => prev.filter((s) => s !== iso));
    setMessage(
      `Booked ${new Date(selectedSlot.start).toLocaleTimeString()} (demo only)`
    );
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">
          {selectedNet ? selectedNet.name : "Choose net"}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="date"
          className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="ml-auto text-sm text-gray-300">
          <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2" />
          Free
          <span className="inline-block w-3 h-3 bg-red-400 rounded-full ml-4 mr-2" />
          Booked
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {slots.map((slot, idx) => {
          const free = isFree(slot);
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border border-white/20 backdrop-blur-sm transition-all ${
                free
                  ? "bg-green-400/20 hover:shadow-green-500/30 cursor-pointer"
                  : "bg-red-400/10 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    {slot.start.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-sm text-gray-300">
                    {slot.end.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {free ? (
                  <button
                    onClick={() => handleBookClick(slot)}
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-1 rounded-lg text-sm hover:scale-105 transition-all"
                  >
                    Book
                  </button>
                ) : (
                  <span className="text-xs text-red-300">Booked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {message && <div className="text-sm text-cyan-300">{message}</div>}

      {/* Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedSlot(null)}
          />
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 z-10 max-w-md w-full shadow-lg shadow-cyan-500/20">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">
              Confirm Booking
            </h3>
            <p className="text-sm text-gray-200 mb-4">
              Book <span className="font-semibold">{selectedNet?.name}</span> at{" "}
              {new Date(selectedSlot.start).toLocaleTimeString()}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
