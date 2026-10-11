import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/client";

export default function NotesApp() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // 1. Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to notes (real-time)
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("authorId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(data);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Create note
  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await addDoc(collection(db, "notes"), {
      title,
      content,
      authorId: user.uid,
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setContent("");
  }

  // 4. Delete note
  async function handleDelete(noteId) {
    if (!confirm("Delete this note?")) return;
    await deleteDoc(doc(db, "notes", noteId));
  }

  // 5. Filter notes
  const filteredNotes = notes.filter((note) => {
    if (filter === "all") return true;
    return note.content.toLowerCase().includes(filter.toLowerCase());
  });

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please sign in to use Notes.</p>;

  return (
    <div>
      <h2>My Notes</h2>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Add Note</button>
      </form>

      <div>
        <label>Filter: </label>
        <input
          type="text"
          placeholder="Search notes..."
          value={filter === "all" ? "" : filter}
          onChange={(e) => setFilter(e.target.value || "all")}
        />
      </div>

      <h3>Notes ({filteredNotes.length})</h3>
      {filteredNotes.length === 0 && <p>No notes yet.</p>}

      <ul>
        {filteredNotes.map((note) => (
          <li key={note.id}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <button onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}