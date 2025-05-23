export async function getEvents() {
  const res = await fetch("http://localhost:3000/api/events/all");
  return res.json();
}

export async function getEvent(id: string) {
  const res = await fetch(`http://localhost:3000/api/events/${id}`);
  return res.json();
}
export async function createEvent(event: { title: string; eventTime: string }) {
  const response = await fetch("http://localhost:3000/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API error: ${response.status} - ${errorBody}`);
  }

  return response.json();
}

export async function updateEvent(data: {
  id: string;
  title: string;
  eventTime: string;
}) {
  await fetch(`http://localhost:3000/api/events/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(id: string) {
  await fetch(`http://localhost:3000/api/events/${id}`, { method: "DELETE" });
}

export const registerPushToken = async (token: string) => {
  const response = await fetch(`http://localhost:3000/events/devices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error("Failed to register push token");
  }
};
