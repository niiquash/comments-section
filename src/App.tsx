import { useEffect, useState } from "react";
import axios, { CanceledError } from "axios";

interface Comment {
  id: number;
  name: string;
  body: string;
}

function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get<Comment[]>("https://jsonplaceholder.typicode.com/comments", {
        signal: controller.signal,
      })
      .then((res) => setComments(res.data))
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="App">
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {comments.map((comment) => (
          <li className="list-group-item" key={comment.id}>
            <p>Name: {comment.name}</p>
            <p>Body: {comment.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
