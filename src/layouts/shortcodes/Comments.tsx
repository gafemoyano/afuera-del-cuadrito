import React, { useState, useEffect } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";

interface Comment {
  id: string;
  postSlug: string;
  authorName: string;
  message: string;
  createdAt: string;
}

interface CommentsProps {
  postSlug: string;
}

const Comments: React.FC<CommentsProps> = ({ postSlug }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postSlug=${postSlug}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const sortedData = data.sort(
          (a: Comment, b: Comment) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setComments(sortedData);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postSlug]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (website) {
      setAuthorName("");
      setMessage("");
      setWebsite("");
      return;
    }

    if (!authorName.trim() || !message.trim()) return;

    setSubmitting(true);

    const tempId = `temp-${Date.now()}`;
    const newComment: Comment = {
      id: tempId,
      postSlug,
      authorName,
      message,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);

    setAuthorName("");
    setMessage("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, authorName, message }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      const savedComment = await response.json();

      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? savedComment : c)),
      );

      setToast({ type: "success", message: "¡Comentario publicado!" });
    } catch (err) {
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      setToast({ type: "error", message: "Error al publicar el comentario." });
      setAuthorName(newComment.authorName);
      setMessage(newComment.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 font-secondary text-dark">
      <h3 className="mb-6 font-primary text-2xl font-bold text-dark">
        Dejar un comentario
      </h3>

      <form onSubmit={handleSubmit} className="mb-10">
        <div className="mb-4">
          <label
            htmlFor="authorName"
            className="mb-2 block font-bold text-dark"
          >
            Nombre
          </label>
          <input
            type="text"
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Tu nombre"
            required
            disabled={submitting}
          />
        </div>

        <div className="hidden">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="mb-2 block font-bold text-dark">
            Tu comentario
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-32 w-full resize-y rounded-lg border border-border bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Escribe tu comentario aquí..."
            required
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary rounded-lg px-6 py-3 font-semibold transition disabled:opacity-70"
        >
          {submitting ? "Publicando..." : "Publicar comentario"}
        </button>
      </form>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 font-semibold text-white shadow-lg transition-opacity ${
            toast.type === "success" ? "bg-light" : "bg-primary"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <p className="text-center text-text">Cargando comentarios...</p>
        ) : error ? (
          <p className="text-center text-primary">
            No se pudieron cargar los comentarios.
          </p>
        ) : comments.length === 0 ? (
          <p className="text-center text-text italic">
            ¡Sé el primero en comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-border pb-6 last:border-0"
            >
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-bold text-primary">
                  {comment.authorName}
                </span>
                <span className="text-sm text-text-light">
                  {formatDistanceToNowStrict(
                    new Date(
                      comment.createdAt.endsWith("Z")
                        ? comment.createdAt
                        : comment.createdAt + "Z",
                    ),
                    { addSuffix: true, locale: es },
                  )}
                </span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">
                {comment.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
